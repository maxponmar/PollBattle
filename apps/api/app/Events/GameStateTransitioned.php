<?php

namespace App\Events;

use App\Enums\GameState;
use App\Models\Game;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStateTransitioned implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Game $game,
        public GameState $from,
        public GameState $to,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("game.{$this->game->id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'game.state.transitioned';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'game_id' => $this->game->id,
            'from' => $this->from->value,
            'to' => $this->to->value,
            'updated_at' => $this->game->updated_at?->toIso8601String(),
        ];
    }
}
