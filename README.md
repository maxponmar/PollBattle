# FamilyFraud Monorepo

Family Feud-style SaaS platform scaffolded with Laravel 12, Inertia React, TailwindCSS, Motion, Redis, and Reverb.

## Structure

- `apps/api` Laravel 12 application (Inertia React frontend + backend)
- `apps/web` reserved for future standalone frontend extraction
- `packages/game-engine` domain package placeholder
- `packages/survey-engine` domain package placeholder
- `packages/hall-realtime` domain package placeholder
- `packages/ui-components` shared UI package placeholder
- `infrastructure/docker` Docker build context
- `infrastructure/nginx` Nginx reverse proxy config
- `infrastructure/supervisor` Horizon supervisor config

## Quick Start

1. `cd apps/api`
2. `cp .env.example .env`
3. Configure DB/Redis/Reverb values
4. `composer install`
5. `npm install`
6. `php artisan migrate --seed`
7. `php artisan serve` and `npm run dev`

## Local Demo Credentials

- Email: `owner@example.com`
- Password: set through factory default (`password`) after seeding
