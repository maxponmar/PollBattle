<?php

namespace App\Events;

use App\Models\BuzzEvent;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BuzzRegistered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public BuzzEvent $buzzEvent)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("hall.{$this->buzzEvent->hall_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'buzz.registered';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'buzz_event_id' => $this->buzzEvent->id,
            'hall_id' => $this->buzzEvent->hall_id,
            'player_id' => $this->buzzEvent->player_id,
            'occurred_at' => $this->buzzEvent->occurred_at?->toIso8601String(),
        ];
    }
}
