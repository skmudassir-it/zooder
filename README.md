# Zooder Monorepo

> A full-stack social media app — Next.js 16 + Tailwind CSS v4 + shadcn/ui + Socket.IO + Prisma

## Structure

```
zooder/
├── apps/
│   ├── web/          # Next.js 16 frontend + API routes
│   └── ws-server/    # Standalone Socket.IO server
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```

## Quick Start (Dev)

```bash
# 1. Clone and install
git clone https://github.com/skmudassir-it/zooder.git
cd zooder
npm install

# 2. Start dev services (Postgres, Redis, MinIO)
docker compose -f docker-compose.dev.yml up -d

# 3. Copy env files and fill secrets
cp apps/web/.env.example apps/web/.env
cp apps/ws-server/.env.example apps/ws-server/.env

# 4. Run migrations
cd apps/web && npx prisma migrate dev

# 5. Start dev servers
npm run dev       # Next.js on :3000
npm run ws:dev    # WebSocket on :3001
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| Auth | Auth.js v5 (JWT + HttpOnly cookies) |
| ORM | Prisma + PostgreSQL |
| Real-time | Socket.IO + Redis |
| State | Zustand |
| Storage | MinIO |

## Deployment (Coolify)

See `docker-compose.prod.yml` for service definitions. Each app has its own `Dockerfile`.
