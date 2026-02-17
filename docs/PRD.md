# Product Requirements Document (PRD)
## Project: Family Feud SaaS Platform
## Version: 1.0
## Tech Stack: Laravel 12 + MariaDB + Redis + Reverb + Inertia + React + TailwindCSS + Framer Motion

---

# 1. Executive Summary

A SaaS platform that enables communities, companies, churches, schools, and families to create and host real-time Family Feud–style games.

The platform allows:
- Custom survey creation (100-respondent model)
- Automatic game generation
- Real-time multiplayer gameplay
- Anonymous join via PIN/URL
- Sound effects + animations
- Multi-tenant SaaS architecture

---

# 2. Objectives

- Allow hosts to create and launch a game in under 5 minutes
- Real-time synchronized gameplay (<200ms latency)
- Support 200 concurrent players per hall
- Multi-tenant isolation
- Fully automated scoring logic

---

# 3. Core Features

## 3.1 Survey Engine
- Survey must total 100 responses
- Answers stored with frequency
- Points = frequency
- Manual or collected survey mode

## 3.2 Game Engine
- Face-Off round
- 4 Main Rounds (configurable)
- Fast Money Round
- Strike system (3 strikes)
- Steal logic
- Multipliers per round

## 3.3 Hall System (Kahoot-style)
- Unique URL
- 6-digit PIN
- Anonymous player join
- Team selection
- Real-time presence tracking

## 3.4 Roles
- Super Admin
- Tenant Owner
- Moderator
- Anonymous Player

## 3.5 Sound Effects (Required)
- Buzz
- Correct reveal
- Strike
- Steal success
- Steal fail
- Timer tick
- Winner celebration

Toggleable. Preloaded client-side.

---

# 4. Functional Requirements

## 4.1 Game State Machine

States:
- Waiting
- FaceOff
- ActiveRound
- Strike
- StealAttempt
- FastMoney1
- FastMoney2
- Completed

Transitions must be atomic and broadcasted.

---

# 5. Non-Functional Requirements

- 99.9% uptime
- Horizontal scaling
- Redis session store
- Stateless application servers
- WCAG AA accessibility
- Secure JWT auth for anonymous players

---

# 6. SaaS Requirements

- Multi-tenancy (stancl/tenancy)
- Stripe billing (future phase)
- Tenant-level data isolation
- Subscription enforcement

---

# 7. Definition of Done

- Host creates survey
- Survey validated to 100 responses
- Game auto-generated
- Hall created
- Players join
- Real-time buzz works
- Points calculated automatically
- Sounds + animations active
- Winner declared
