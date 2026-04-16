# JERAI FITNESS — Gym Management Demo

## Project Overview
A full-stack gym management website demo built to showcase what's possible for a gym owner. Features member portals, class booking with waitlists, membership sales, admin dashboards, progress tracking, and community features.

## Tech Stack
- **Next.js 14** — App Router, Server Components, Server Actions
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling with dark theme
- **shadcn/ui** — Consistent, accessible UI components (classic/default style, Tailwind v3)
- **Supabase** — Auth (email/password), PostgreSQL database, Row Level Security
- **Recharts** — Progress tracking charts
- **qrcode.react** — Digital membership card QR codes
- **lucide-react** — Icons

## Folder Structure
```
src/
├── app/
│   ├── (auth)/             # Login, Signup pages
│   ├── (dashboard)/        # Member dashboard (protected)
│   │   └── dashboard/
│   │       ├── book/       # Book a class
│   │       ├── bookings/   # My bookings
│   │       ├── checkout/   # Membership purchase
│   │       ├── leaderboard/# Community leaderboard
│   │       ├── membership/ # Digital membership card
│   │       └── progress/   # Progress tracker
│   ├── (admin)/            # Admin dashboard (admin role only)
│   │   └── admin/
│   │       ├── bookings/   # View all bookings
│   │       ├── classes/    # CRUD classes
│   │       ├── members/    # View members
│   │       └── wod/        # Workout of the Day
│   ├── about/              # Public about page
│   ├── auth/callback/      # Supabase auth callback
│   ├── classes/            # Public class schedule
│   ├── contact/            # Public contact form
│   ├── pricing/            # Public pricing page
│   └── page.tsx            # Homepage
├── components/
│   ├── admin/              # Admin-specific components
│   ├── dashboard/          # Dashboard-specific components
│   ├── ui/                 # shadcn/ui components
│   ├── navbar.tsx          # Public navbar
│   └── footer.tsx          # Public footer
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── middleware.ts   # Auth middleware helper
│   ├── types/
│   │   └── database.ts     # TypeScript types + plan data
│   └── utils.ts            # cn() utility
├── middleware.ts            # Route protection
supabase/
├── schema.sql              # Full database DDL + RLS
└── seed.sql                # Demo data (trainers, classes, WODs)
```

## Key Conventions
- **Route groups**: `(auth)`, `(dashboard)`, `(admin)` for layout separation
- **Server Components** by default; `"use client"` only when needed (forms, interactivity)
- **Supabase clients**: Use `server.ts` in Server Components, `client.ts` in Client Components
- **Auth flow**: Middleware checks auth state → redirects unauthenticated users → checks admin role for `/admin/*`
- **Styling**: Dark theme always active (`class="dark"` on `<html>`), orange accent (`--primary`)
- **Data fetching**: Server Components fetch directly; Client Components use `useEffect` + Supabase client

## How to Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint check
```

## How to Add New Features
1. Create a new route in the appropriate route group under `src/app/`
2. Use `createClient()` from the correct supabase util (server vs client)
3. Add new shadcn components: `npx shadcn@latest add [component]`
4. For new database tables: add to `supabase/schema.sql` with RLS policies
5. Add TypeScript types in `src/lib/types/database.ts`

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (optional, for admin ops)
```
