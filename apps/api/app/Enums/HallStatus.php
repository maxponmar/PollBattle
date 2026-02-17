<?php

namespace App\Enums;

enum HallStatus: string
{
    case Waiting = 'waiting';
    case Active = 'active';
    case Completed = 'completed';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::cases());
    }
}
