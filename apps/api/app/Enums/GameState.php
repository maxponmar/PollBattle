<?php

namespace App\Enums;

enum GameState: string
{
    case Waiting = 'waiting';
    case FaceOff = 'face_off';
    case ActiveRound = 'active_round';
    case Strike = 'strike';
    case StealAttempt = 'steal_attempt';
    case FastMoney1 = 'fast_money_1';
    case FastMoney2 = 'fast_money_2';
    case Completed = 'completed';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $state) => $state->value, self::cases());
    }
}
