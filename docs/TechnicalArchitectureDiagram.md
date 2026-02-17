# Technical Architecture Diagram

                      ┌───────────────────────────┐
                      │        Client Layer        │
                      │ React + Inertia + Tailwind│
                      │ Framer Motion + Zustand   │
                      └──────────────┬────────────┘
                                     │
                        WebSockets   │   HTTP
                                     │
                 ┌───────────────────▼───────────────────┐
                 │           Nginx Reverse Proxy         │
                 └───────────────────┬───────────────────┘
                                     │
                 ┌───────────────────▼───────────────────┐
                 │           Laravel Application         │
                 │ Controllers / Services / Policies     │
                 │ Game Engine State Machine             │
                 └───────────────────┬───────────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
          ▼                          ▼                          ▼
    MariaDB                   Redis Cache                 Laravel Reverb
 (Persistent Data)        (Sessions + Queue)           (WebSocket Server)
                                                      Pub/Sub via Redis

          │
          ▼
  Horizon (Queue Workers)

---

Deployment Model:
- Dockerized services
- Horizontal scaling
- Stateless app servers
- Redis pub/sub for WebSocket scaling
