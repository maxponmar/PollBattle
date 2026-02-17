# System Design Document (SDD)
## Family Feud SaaS

---

# 1. High-Level Design

The platform is a multi-tenant, real-time web application using:

- Laravel 11
- MariaDB
- Redis
- Laravel Reverb
- Inertia + React
- TailwindCSS
- Framer Motion

---

# 2. Core Components

## 2.1 Game Engine

Implemented as a domain service:
- State Machine pattern
- Immutable state transitions
- Atomic DB transactions
- Broadcast after commit

---

## 2.2 Real-Time Engine

- WebSockets via Reverb
- Presence channels per hall
- Redis pub/sub
- Client-side reconnection

---

## 2.3 Survey Aggregation

Manual mode:
- Host enters answers
- Validate total=100

Advanced mode:
- Collect raw answers
- NLP normalization
- Group similar answers
- Admin approval required

---

# 3. Scalability Strategy

- Stateless app servers
- Redis session store
- Horizontal scaling via load balancer
- Dedicated WebSocket nodes
- Queue workers via Horizon

---

# 4. Concurrency Handling

- Buzz locking via Redis SETNX
- DB-level row locking for score updates
- Optimistic concurrency control

---

# 5. Security

- JWT for anonymous players
- Signed hall URLs
- Rate limiting buzz
- CSRF protection
- PIN brute-force prevention

---

# 6. Failure Recovery

- WebSocket auto-reconnect
- State resync on reconnect
- Heartbeat monitoring
- Idempotent event processing

---

# 7. Observability

- Laravel Telescope (dev)
- Structured logs
- Redis metrics
- Performance monitoring
- Error tracking (Sentry)

---

# 8. Deployment

- Docker containers
- Nginx reverse proxy
- GitHub Actions CI/CD
- Zero-downtime deployments

---

# 9. Future Extensions

- AI-generated surveys
- Public global leaderboard
- Tournament mode
- OBS integration
- Native mobile app
