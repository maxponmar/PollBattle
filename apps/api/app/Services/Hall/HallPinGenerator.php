<?php

namespace App\Services\Hall;

use App\Models\Hall;
use RuntimeException;

class HallPinGenerator
{
    public function generate(): string
    {
        $maxAttempts = 20;

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            $pin = (string) random_int(100000, 999999);

            if (! Hall::query()->where('join_code', $pin)->exists()) {
                return $pin;
            }
        }

        throw new RuntimeException('Unable to generate a unique hall PIN.');
    }
}
