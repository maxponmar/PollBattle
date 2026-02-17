# FamilyFraud API App

Laravel 12 application implementing backend and frontend (Inertia React) for the Family Feud SaaS platform.

## Stack

- Laravel 12
- Inertia.js + React
- TailwindCSS
- Motion (`motion/react`)
- MariaDB (target), SQLite (local quickstart)
- Redis + Reverb for realtime workflows

## Setup

1. `cp .env.example .env`
2. `composer install`
3. `npm install`
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `php artisan serve`
7. `npm run dev`

## Demo Seed

- Email: `owner@example.com`
- Password: `password`

## Core Modules

- Survey engine with 100-response validation
- Game engine with state machine transitions
- Hall system with join slug/PIN and anonymous player JWT tokens
- Buzz lock service with broadcast events for realtime gameplay
