# Local Development Setup

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 9+ | `npm i -g pnpm` |
| PostgreSQL | 14+ | Docker (below) or native install |

---

## 1 — Clone & install

```bash
git clone <your-repo-url>
cd <repo-dir>
pnpm install
```

---

## 2 — Environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Your local Postgres URL (see below) |
| `CLERK_PUBLISHABLE_KEY` | [Clerk dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Same page |
| `VITE_CLERK_PUBLISHABLE_KEY` | Same as `CLERK_PUBLISHABLE_KEY` |
| `SESSION_SECRET` | Any random string (32+ chars) |

### Quick Postgres with Docker

```bash
docker run -d \
  --name tems-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16

# DATABASE_URL to use:
# postgresql://postgres:postgres@localhost:5432/tems
```

---

## 3 — Push the database schema

```bash
pnpm --filter @workspace/db run db:push
```

This creates all tables (services, patients, appointments, contact_enquiries).

### Optional: seed sample data

```bash
pnpm --filter @workspace/db run db:seed
```

---

## 4 — Run the services

Open **three terminals**:

```bash
# Terminal 1 — API server (http://localhost:8080)
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Website (http://localhost:3000)
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/tems-website run dev

# Terminal 3 — Mockup sandbox (http://localhost:3001/__mockup)  [optional]
PORT=3001 BASE_PATH=/__mockup pnpm --filter @workspace/mockup-sandbox run dev
```

Or use the convenience script at the root:

```bash
pnpm run dev:local
```

---

## 5 — Frontend → API connection

By default the frontend expects the API at `http://localhost:8080`.
If you change the API port, update `VITE_API_BASE_URL` in your `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

---

## Stack summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 + Tailwind CSS 4 |
| Routing | Wouter |
| API client | React Query + Orval-generated hooks |
| Backend | Express 5 + TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Clerk (cookie-based) |
| Package manager | pnpm (monorepo) |
