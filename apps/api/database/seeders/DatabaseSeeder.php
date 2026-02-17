<?php

namespace Database\Seeders;

use App\Enums\SubscriptionPlan;
use App\Enums\UserRole;
use App\Models\Game;
use App\Models\GameRound;
use App\Models\Hall;
use App\Models\Survey;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $tenant = Tenant::query()->create([
            'name' => 'Demo Family Feud Tenant',
            'subscription_plan' => SubscriptionPlan::Pro,
        ]);

        User::factory()->create([
            'tenant_id' => $tenant->id,
            'name' => 'Tenant Owner',
            'email' => 'owner@example.com',
            'role' => UserRole::TenantOwner,
        ]);

        $survey = Survey::query()->create([
            'tenant_id' => $tenant->id,
            'question' => 'Name something you find in a living room.',
            'is_public' => true,
            'approved' => true,
        ]);

        $survey->answers()->createMany([
            ['answer' => 'Sofa', 'frequency' => 40, 'points' => 40],
            ['answer' => 'TV', 'frequency' => 30, 'points' => 30],
            ['answer' => 'Table', 'frequency' => 20, 'points' => 20],
            ['answer' => 'Lamp', 'frequency' => 10, 'points' => 10],
        ]);

        $game = Game::query()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Friday Night Family Feud',
            'configuration_json' => [
                'rounds' => 4,
                'fast_money_enabled' => true,
            ],
            'status' => 'waiting',
        ]);

        GameRound::query()->create([
            'game_id' => $game->id,
            'survey_id' => $survey->id,
            'multiplier' => 1,
            'round_order' => 1,
        ]);

        $hall = Hall::query()->create([
            'game_id' => $game->id,
            'unique_slug' => 'demo-hall',
            'join_code' => '123456',
            'status' => 'waiting',
        ]);

        $hall->teams()->createMany([
            ['name' => 'Team A', 'score' => 0],
            ['name' => 'Team B', 'score' => 0],
        ]);
    }
}
