<?php

namespace App\Services\Hall;

use App\Models\Player;
use Firebase\JWT\JWT;

class PlayerTokenService
{
    public function generate(Player $player): string
    {
        $issuedAt = now();

        $payload = [
            'iss' => config('app.url'),
            'sub' => "player:{$player->id}",
            'iat' => $issuedAt->timestamp,
            'exp' => $issuedAt->addHours(8)->timestamp,
            'hall_id' => $player->hall_id,
            'nickname' => $player->nickname,
        ];

        return JWT::encode($payload, $this->resolveSigningKey(), 'HS256');
    }

    private function resolveSigningKey(): string
    {
        $rawKey = (string) config('app.key');

        if (str_starts_with($rawKey, 'base64:')) {
            return (string) base64_decode(substr($rawKey, 7), true);
        }

        return $rawKey;
    }
}
