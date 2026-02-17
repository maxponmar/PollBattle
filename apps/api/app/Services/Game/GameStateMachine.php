<?php

namespace App\Services\Game;

use App\Enums\GameState;
use App\Events\GameStateTransitioned;
use App\Exceptions\InvalidGameStateTransitionException;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class GameStateMachine
{
    /**
     * @var array<string, array<int, string>>
     */
    private const ALLOWED_TRANSITIONS = [
        'waiting' => ['face_off'],
        'face_off' => ['active_round', 'strike'],
        'active_round' => ['strike', 'steal_attempt', 'fast_money_1', 'completed'],
        'strike' => ['active_round', 'steal_attempt'],
        'steal_attempt' => ['active_round', 'fast_money_1', 'completed'],
        'fast_money_1' => ['fast_money_2'],
        'fast_money_2' => ['completed'],
        'completed' => [],
    ];

    public function canTransition(GameState $from, GameState $to): bool
    {
        $allowed = self::ALLOWED_TRANSITIONS[$from->value] ?? [];

        return in_array($to->value, $allowed, true);
    }

    public function transition(Game $game, GameState $to): Game
    {
        return DB::transaction(function () use ($game, $to): Game {
            /** @var Game $lockedGame */
            $lockedGame = Game::query()->lockForUpdate()->findOrFail($game->id);
            $from = $lockedGame->status;

            if (! $this->canTransition($from, $to)) {
                throw InvalidGameStateTransitionException::fromStates($from, $to);
            }

            $lockedGame->update([
                'status' => $to,
            ]);

            GameStateTransitioned::dispatch($lockedGame, $from, $to);

            return $lockedGame;
        });
    }
}
