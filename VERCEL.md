# Deploying to Vercel

## Architecture on Vercel

| Layer | How it deploys |
|-------|---------------|
| Frontend (React/Vite) | Static files served from `artifacts/tems-website/dist/public` |
| API (Express) | Vercel Serverless Function at `/api` (bundled by esbuild) |
| Database | External PostgreSQL — use [Neon](https://neon.tech) (free tier, Postgres-compatible) |

All `/api/*` requests are routed to the serverless Express function.
All other routes (`/`, `/services`, `/admin/*`, etc.) fall back to `index.html` for client-side routing.

---

## Step 1 — Database (Neon)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project → copy the **Connection string** (looks like `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`)
3. Push the schema once (locally or via the Neon SQL editor):

```bash
DATABASE_URL="postgresql://..." pnpm --filter @workspace/db run db:push
```

---

## Step 2 — Clerk

1. Log in to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create an application (or use your existing one)
3. Go to **API Keys** → copy:
   - `Publishable key` → `CLERK_PUBLISHABLE_KEY` + `VITE_CLERK_PUBLISHABLE_KEY`
   - `Secret key` → `CLERK_SECRET_KEY`

---

## Step 3 — Deploy to Vercel

### Option A — Vercel Dashboard (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo (`glitterrock-vampire/Tobago-Medical-Hub`)
3. Vercel auto-detects `vercel.json` — no framework preset needed
4. Add **Environment Variables** (see table below)
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Environment Variables

Set all of these in the Vercel project dashboard under **Settings → Environment Variables**.

| Variable | Example value | Notes |
|----------|--------------|-------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require` | From Neon |
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | From Clerk dashboard |
| `CLERK_SECRET_KEY` | `sk_live_...` | From Clerk dashboard |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Same as above — needed at Vite build time |
| `VITE_CLERK_PROXY_URL` | `https://yourdomain.vercel.app/api/__clerk` | Enables Clerk proxy on your domain. Replace with your actual Vercel URL or custom domain |
| `SESSION_SECRET` | any 32+ char random string | Used for cookie signing |

> **`VITE_CLERK_PROXY_URL`** — Once you know your Vercel deployment URL (e.g. `https://tobago-medical-hub.vercel.app`), set this to `https://tobago-medical-hub.vercel.app/api/__clerk`. This proxies Clerk's API through your domain, which is required for production Clerk auth to work correctly on a non-Clerk subdomain.

---

## After First Deploy

1. Note your deployment URL (e.g. `https://tobago-medical-hub.vercel.app`)
2. Go back to Vercel → Environment Variables → update `VITE_CLERK_PROXY_URL` with your real URL
3. Redeploy (Vercel → Deployments → Redeploy)
4. In Clerk dashboard → **Domains** → add your Vercel URL as a production domain

---

## Custom Domain

1. Vercel dashboard → **Settings → Domains** → add your domain
2. Point your DNS to Vercel's nameservers (Vercel provides the records)
3. Update `VITE_CLERK_PROXY_URL` to `https://yourdomain.com/api/__clerk`
4. Redeploy
