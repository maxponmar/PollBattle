<?php

namespace App\Enums;

enum SubscriptionPlan: string
{
    case Starter = 'starter';
    case Pro = 'pro';
    case Enterprise = 'enterprise';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $plan) => $plan->value, self::cases());
    }
}
