<?php

namespace App\Http\Controllers;

use App\Events\BuzzRegistered;
use App\Http\Requests\JoinHallRequest;
use App\Models\BuzzEvent;
use App\Models\Game;
use App\Models\Hall;
use App\Models\Player;
use App\Services\Hall\BuzzLockService;
use App\Services\Hall\HallPinGenerator;
use App\Services\Hall\PlayerTokenService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class HallController extends Controller
{
    public function store(Request $request, Game $game, HallPinGenerator $pinGenerator): RedirectResponse
    {
        $this->ensureGameTenantAccess($request, $game);

        $hall = DB::transaction(function () use ($game, $pinGenerator): Hall {
            $hall = Hall::query()->create([
                'game_id' => $game->id,
                'unique_slug' => Str::lower((string) Str::ulid()),
                'join_code' => $pinGenerator->generate(),
                'status' => 'waiting',
            ]);

            $hall->teams()->createMany([
                ['name' => 'Team A', 'score' => 0],
                ['name' => 'Team B', 'score' => 0],
            ]);

            return $hall;
        });

        return redirect()->route('halls.show', $hall)->with('success', 'Hall created successfully.');
    }

    public function show(Request $request, Hall $hall): Response
    {
        $hall->load(['game', 'teams.players', 'buzzEvents.player.team']);

        $this->ensureGameTenantAccess($request, $hall->game);

        return Inertia::render('Halls/Show', [
            'hall' => $hall,
        ]);
    }

    public function showJoin(string $slug): Response
    {
        $hall = Hall::query()
            ->where('unique_slug', $slug)
            ->with(['game:id,title,status', 'teams:id,hall_id,name,score'])
            ->firstOrFail();

        return Inertia::render('Halls/Join', [
            'hall' => [
                'id' => $hall->id,
                'unique_slug' => $hall->unique_slug,
                'join_code' => $hall->join_code,
                'status' => $hall->status,
                'game' => $hall->game,
                'teams' => $hall->teams,
            ],
        ]);
    }

    public function join(JoinHallRequest $request, string $slug, PlayerTokenService $tokenService): RedirectResponse
    {
        $hall = Hall::query()
            ->where('unique_slug', $slug)
            ->with('teams')
            ->firstOrFail();

        $validated = $request->validated();

        if ($validated['join_code'] !== $hall->join_code) {
            throw ValidationException::withMessages([
                'join_code' => 'The join code is invalid.',
            ]);
        }

        if (isset($validated['team_id']) && ! $hall->teams->pluck('id')->contains((int) $validated['team_id'])) {
            throw ValidationException::withMessages([
                'team_id' => 'The selected team is invalid for this hall.',
            ]);
        }

        $player = Player::query()->create([
            'hall_id' => $hall->id,
            'team_id' => $validated['team_id'] ?? null,
            'nickname' => $validated['nickname'],
            'jwt_token' => Str::random(40),
            'is_active' => true,
            'last_seen_at' => now(),
        ]);

        $token = $tokenService->generate($player);
        $player->update(['jwt_token' => $token]);

        $request->session()->put("hall_player_tokens.{$hall->id}", $token);

        return redirect()->route('halls.player', $hall);
    }

    public function player(Request $request, Hall $hall): Response|RedirectResponse
    {
        $token = $request->session()->get("hall_player_tokens.{$hall->id}");

        if (! is_string($token)) {
            return redirect()->route('halls.join.show', $hall->unique_slug)
                ->with('error', 'Join the hall before accessing the player board.');
        }

        $player = Player::query()
            ->where('hall_id', $hall->id)
            ->where('jwt_token', $token)
            ->first();

        if (! $player) {
            return redirect()->route('halls.join.show', $hall->unique_slug)
                ->with('error', 'Player session expired. Join again.');
        }

        $hall->load(['game.rounds.survey', 'teams']);

        return Inertia::render('Halls/Player', [
            'hall' => $hall,
            'player' => $player,
        ]);
    }

    public function buzz(Request $request, Hall $hall, BuzzLockService $buzzLockService): RedirectResponse
    {
        $token = $request->session()->get("hall_player_tokens.{$hall->id}");

        if (! is_string($token)) {
            return redirect()->route('halls.join.show', $hall->unique_slug)
                ->with('error', 'Please join the hall before buzzing.');
        }

        $player = Player::query()
            ->where('hall_id', $hall->id)
            ->where('jwt_token', $token)
            ->first();

        if (! $player) {
            return redirect()->route('halls.join.show', $hall->unique_slug)
                ->with('error', 'Player session not found.');
        }

        if (! $buzzLockService->acquire($hall)) {
            return back()->withErrors([
                'buzz' => 'Buzz lock is active. Wait for the host to reopen buzzing.',
            ]);
        }

        $buzzEvent = BuzzEvent::query()->create([
            'hall_id' => $hall->id,
            'player_id' => $player->id,
            'occurred_at' => now(),
        ]);

        BuzzRegistered::dispatch($buzzEvent);

        return back()->with('success', 'Buzz registered.');
    }

    public function resetBuzz(Request $request, Hall $hall, BuzzLockService $buzzLockService): RedirectResponse
    {
        $hall->load('game');
        $this->ensureGameTenantAccess($request, $hall->game);

        $buzzLockService->release($hall);

        return back()->with('success', 'Buzz lock reset.');
    }

    private function ensureGameTenantAccess(Request $request, Game $game): void
    {
        abort_unless($game->tenant_id === $request->user()->tenant_id, 404);
    }
}
