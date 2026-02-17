<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Hall;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $tenantId = $request->user()?->tenant_id;

        $surveyQuery = Survey::query();
        $gameQuery = Game::query();
        $hallQuery = Hall::query();

        if ($tenantId !== null) {
            $surveyQuery->where('tenant_id', $tenantId);
            $gameQuery->where('tenant_id', $tenantId);
            $hallQuery->whereHas('game', fn ($query) => $query->where('tenant_id', $tenantId));
        }

        $recentHalls = (clone $hallQuery)
            ->with(['game:id,title,status', 'teams:id,hall_id,name,score'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'surveys' => (clone $surveyQuery)->count(),
                'games' => (clone $gameQuery)->count(),
                'activeGames' => (clone $gameQuery)->where('status', '!=', 'completed')->count(),
                'halls' => (clone $hallQuery)->count(),
            ],
            'recentHalls' => $recentHalls,
        ]);
    }
}
