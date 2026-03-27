# TrainIQ Authentication & RBAC Design

## Context

TrainIQ needs authentication with RBAC for 3 roles: **Student**, **Trainer**, **Admin**. The project uses Next.js 16, Supabase, and Prisma ORM. Currently no auth exists — the dashboard routes (`/student`, `/trainer`, `/management`) are publicly accessible.

### Decisions from brainstorming

| Decision | Choice |
|---|---|
| Auth method | Email + Password only |
| Account creation | Hybrid: students self-register, trainers/admins created by admin |
| Role storage | `public.profiles` table with `role` column, synced via trigger |
| Post-login routing | Role-based redirect; trainers/admins can also view student dashboards |

---

## Approach: Supabase SSR + Custom JWT Claims

This is the Supabase-recommended pattern for Next.js App Router:

1. **`@supabase/ssr`** stores auth session in cookies (not localStorage)
2. **`public.profiles` table** holds the user's `role`, synced on signup via a Postgres trigger
3. **Custom Access Token Hook** injects the `user_role` into the JWT, so the proxy can read it without a DB call
4. **Next.js Proxy** (replaces `middleware.ts` in Next.js 16) refreshes auth tokens and enforces route protection
5. **RLS policies** use `auth.jwt() ->> 'user_role'` for database-level access control

### Why this approach?

- **Zero DB calls per request** — the role is embedded in the JWT
- **RLS-friendly** — policies use the JWT claim, so Supabase Data API is automatically secured
- **Prisma-compatible** — `profiles` table is a regular Prisma model
- **Standard pattern** — directly from the Supabase RBAC docs

### Architecture flow

```
Sign Up → auth.users row created
       → Postgres trigger creates profiles row (role = 'student')
       → Custom JWT hook injects user_role into access token

Login  → Proxy refreshes session cookie
       → Reads user_role from JWT claims
       → Redirects to role-appropriate dashboard
       → Blocks unauthorized routes

Page   → Server Component reads role from JWT via getClaims()
       → Renders role-appropriate content
       → Sidebar shows role-specific navigation
```

---

## Route Access Matrix

| Route Pattern | Student | Trainer | Admin |
|---|---|---|---|
| `/login`, `/signup` | ✓ (unauthenticated only) | ✓ | ✓ |
| `/student/*` | ✓ | ✓ (view only) | ✓ (view only) |
| `/trainer/*` | ✗ | ✓ | ✓ |
| `/management/*` | ✗ | ✗ | ✓ |

---

## Key Components

### Database: `public.profiles` table
```sql
CREATE TYPE public.app_role AS ENUM ('student', 'trainer', 'admin');

CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  avatar_url  TEXT,
  role        app_role NOT NULL DEFAULT 'student',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### Auth Hook: inject role into JWT
A PL/pgSQL function registered as a Custom Access Token Hook that reads the user's role from `profiles` and adds it as a `user_role` claim.

### Proxy: route protection
Reads `user_role` from the JWT and enforces the route access matrix. Unauthenticated users are redirected to `/login`.

### Login/Signup Pages
Clean forms using shadcn/ui components, matching the existing TrainIQ design system.
