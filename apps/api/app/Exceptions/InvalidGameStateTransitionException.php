<?php

namespace App\Exceptions;

use App\Enums\GameState;
use RuntimeException;

class InvalidGameStateTransitionException extends RuntimeException
{
    public static function fromStates(GameState $from, GameState $to): self
    {
        return new self("Cannot transition game state from {$from->value} to {$to->value}.");
    }
}
