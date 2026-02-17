<?php

namespace App\Http\Controllers;

use App\Enums\GameState;
use App\Exceptions\InvalidGameStateTransitionException;
use App\Http\Requests\StoreGameRequest;
use App\Models\Game;
use App\Models\Survey;
use App\Services\Game\GameStateMachine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(Request $request): Response
    {
        $tenantId = $this->tenantId($request);

        $games = Game::query()
            ->where('tenant_id', $tenantId)
            ->withCount(['rounds', 'halls'])
            ->latest()
            ->get();

        return Inertia::render('Games/Index', [
            'games' => $games,
        ]);
    }

    public function create(Request $request): Response
    {
        $tenantId = $this->tenantId($request);

        $surveys = Survey::query()
            ->where('tenant_id', $tenantId)
            ->withSum('answers as total_responses', 'frequency')
            ->orderBy('question')
            ->get(['id', 'question', 'approved']);

        return Inertia::render('Games/Create', [
            'surveys' => $surveys,
        ]);
    }

    public function store(StoreGameRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $tenantId = $this->tenantId($request);

        $surveyIds = collect($data['rounds'])->pluck('survey_id')->unique()->values();
        $validSurveyIds = Survey::query()
            ->where('tenant_id', $tenantId)
            ->whereIn('id', $surveyIds)
            ->pluck('id');

        if ($validSurveyIds->count() !== $surveyIds->count()) {
            throw ValidationException::withMessages([
                'rounds' => 'One or more selected surveys are invalid for your tenant.',
            ]);
        }

        $game = DB::transaction(function () use ($data, $tenantId): Game {
            $game = Game::query()->create([
                'tenant_id' => $tenantId,
                'title' => $data['title'],
                'configuration_json' => $data['configuration_json'] ?? null,
                'status' => GameState::Waiting,
            ]);

            $rounds = collect($data['rounds'])
                ->map(static fn (array $round): array => [
                    'survey_id' => (int) $round['survey_id'],
                    'multiplier' => (int) $round['multiplier'],
                    'round_order' => (int) $round['round_order'],
                ])
                ->sortBy('round_order')
                ->values()
                ->all();

            $game->rounds()->createMany($rounds);

            return $game;
        });

        return redirect()->route('games.show', $game)->with('success', 'Game created successfully.');
    }

    public function show(Request $request, Game $game): Response
    {
        $this->ensureGameTenantAccess($request, $game);

        $game->load([
            'rounds.survey.answers',
            'halls.teams',
            'halls.players',
        ]);

        return Inertia::render('Games/Show', [
            'game' => $game,
            'stateOptions' => GameState::values(),
        ]);
    }

    public function transition(Request $request, Game $game, GameStateMachine $stateMachine): RedirectResponse
    {
        $this->ensureGameTenantAccess($request, $game);

        $validated = $request->validate([
            'to_state' => ['required', 'string', 'in:'.implode(',', GameState::values())],
        ]);

        try {
            $stateMachine->transition($game, GameState::from($validated['to_state']));
        } catch (InvalidGameStateTransitionException $exception) {
            throw ValidationException::withMessages([
                'to_state' => $exception->getMessage(),
            ]);
        }

        return back()->with('success', 'Game state transitioned successfully.');
    }

    public function destroy(Request $request, Game $game): RedirectResponse
    {
        $this->ensureGameTenantAccess($request, $game);

        $game->delete();

        return redirect()->route('games.index')->with('success', 'Game deleted successfully.');
    }

    private function ensureGameTenantAccess(Request $request, Game $game): void
    {
        abort_unless($game->tenant_id === $request->user()->tenant_id, 404);
    }

    private function tenantId(Request $request): int
    {
        $tenantId = $request->user()->tenant_id;

        abort_if($tenantId === null, 403, 'Authenticated user is not assigned to a tenant.');

        return (int) $tenantId;
    }
}
