<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SurveyController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/join/{slug}', [HallController::class, 'showJoin'])->name('halls.join.show');
Route::post('/join/{slug}', [HallController::class, 'join'])->name('halls.join');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('surveys', SurveyController::class)->except(['show']);
    Route::resource('games', GameController::class)->except(['edit', 'update']);

    Route::post('/games/{game}/transition', [GameController::class, 'transition'])->name('games.transition');
    Route::post('/games/{game}/halls', [HallController::class, 'store'])->name('halls.store');
    Route::get('/halls/{hall}', [HallController::class, 'show'])->name('halls.show');
    Route::post('/halls/{hall}/buzz/reset', [HallController::class, 'resetBuzz'])->name('halls.buzz.reset');
});

Route::get('/halls/{hall}/player', [HallController::class, 'player'])->name('halls.player');
Route::post('/halls/{hall}/buzz', [HallController::class, 'buzz'])->name('halls.buzz');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
