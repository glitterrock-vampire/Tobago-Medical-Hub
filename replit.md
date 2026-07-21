# Tobago East Medical Services

A full-stack medical practice website and CRM for Dr. Thea Quaccoo's practice in Kendal, Tobago. Patients book appointments online; staff manage everything from a private dashboard.

## Run & Operate

- `pnpm --filter @workspace/tems-website run dev` — frontend website (port auto-assigned, proxy at `/`)
- `pnpm --filter @workspace/api-server run dev` — API server (port 8080, proxy at `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY` — auto-provisioned by Replit Clerk

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, Tailwind v4, Framer Motion, Wouter, Clerk Auth
- API: Express 5 + Clerk middleware
- DB: PostgreSQL + Drizzle ORM (lib/db)
- Validation: Zod (v4), drizzle-zod
- API codegen: Orval (OpenAPI → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/api-spec/openapi.yaml` — Single source of truth for all API contracts
- `lib/db/src/schema/` — Database schema (services, patients, appointments, contact_enquiries)
- `artifacts/api-server/src/routes/` — Express route handlers (services, appointments, patients, contact)
- `artifacts/tems-website/src/pages/public/` — Public website pages (Home, Services, About, Contact, Book)
- `artifacts/tems-website/src/pages/admin/` — Staff CRM pages (Dashboard, Appointments, Patients, Enquiries)
- `attached_assets/` — Brand assets (logo, doctor photo, business card references)

## Architecture decisions

- **OpenAPI-first**: All API contracts defined in `lib/api-spec/openapi.yaml`, codegen produces typed React Query hooks and Zod validators — never hand-written types.
- **Patient upsert on booking**: When a patient books, the API upserts by email — same person booking twice doesn't create duplicates.
- **Clerk for staff auth only**: Public pages are fully open. `/admin/*` routes require Clerk sign-in. Web auth is cookie-based (no Bearer tokens in browser code).
- **Replit built-in PostgreSQL**: Uses Replit's managed Postgres, not Supabase, for tighter workspace integration and rollback support.
- **Email notifications**: Infrastructure in place; connect Resend via Replit integrations when ready.

## Product

- **Public website**: Home (hero + services preview), Services (full listing), About Dr. Quaccoo, Contact (phone/address/enquiry form), Book Appointment (step form → confirmation)
- **Staff CRM** (protected by Clerk): Dashboard with live stats and recent bookings, Appointment management (confirm/cancel/reschedule), Patient directory with notes and booking history, Contact enquiries inbox

## Practice contact info

- Doctor: Dr. Thea Quaccoo
- Phone: +1(868) 486-4537 / 499-2412
- Address: Kendal, Tobago
- Email: DR.T.QUACCOO@GMAIL.COM

## User preferences

- Warm mocha/beige brand palette — always match business card colours (#C4A69A, #7B4435, #E8C5B8)
- No emojis in the UI
- Mobile-first responsive layout

## Gotchas

- After any OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` AND `pnpm run typecheck:libs` before checking the API server.
- `preferredDate` is a Postgres `date` column (stored as string `YYYY-MM-DD`). Zod coercion may produce `Date` objects — always convert to string before inserting/comparing.
- Clerk web auth is cookie-based — never use `setAuthTokenGetter` or Bearer tokens in browser API calls. That's for Expo/mobile only.
- The `date` Postgres column type maps to `string` in Drizzle, not `Date`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `.local/skills/clerk-auth/references/setup-and-customization.md` for Clerk wiring details
