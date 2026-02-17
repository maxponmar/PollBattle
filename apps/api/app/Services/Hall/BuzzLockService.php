<?php

namespace App\Services\Hall;

use App\Models\Hall;
use Illuminate\Support\Facades\Cache;

class BuzzLockService
{
    public function acquire(Hall $hall, int $ttlSeconds = 3): bool
    {
        return Cache::add($this->lockKey($hall), now()->timestamp, $ttlSeconds);
    }

    public function release(Hall $hall): void
    {
        Cache::forget($this->lockKey($hall));
    }

    private function lockKey(Hall $hall): string
    {
        return "hall:{$hall->id}:buzz-lock";
    }
}
