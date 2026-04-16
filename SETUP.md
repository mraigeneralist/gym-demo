# JERAI FITNESS — Setup Guide

## Step 1: Prerequisites
- **Node.js** 18+ (check: `node -v`)
- **npm** 9+ (comes with Node)
- **Supabase account** — Free at [supabase.com](https://supabase.com)
- **Git** (optional, for version control)

## Step 2: Clone and Install Dependencies
```bash
git clone <repo-url> gym-demo
cd gym-demo
npm install
```

## Step 3: Create Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose a name (e.g., "jerai-fitness") and set a database password
4. Wait for the project to finish provisioning (~2 minutes)
5. Go to **Settings → API** and note:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 4: Set Up Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can copy `.env.local.example` as a starting template.

## Step 5: Create Database Tables
1. In Supabase, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this project
3. Copy the **entire contents** and paste into the SQL Editor
4. Click **Run**
5. You should see "Success. No rows returned" — this creates all tables, enums, indexes, RLS policies, and triggers

**What this creates:**
- 8 tables: profiles, memberships, trainers, classes, bookings, waitlist, workouts_of_day, progress_logs
- Row Level Security policies on all tables
- Auto-trigger to create a profile when a new user signs up
- Indexes for performance

## Step 6: Seed Demo Data
1. Still in the **SQL Editor**, create a new query
2. Open `supabase/seed.sql` from this project
3. Copy and paste the contents, then click **Run**
4. This inserts:
   - 3 trainer profiles
   - 12 classes across the week (Spin, HIIT, Yoga, Boxing, Strength)
   - 14 Workouts of the Day (2 weeks of WODs)

**Note:** Member profiles, memberships, and bookings are created through the app when users sign up and interact with it.

## Step 7: Run Locally
```bash
npm run dev
```

Visit these URLs:
- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Classes**: [http://localhost:3000/classes](http://localhost:3000/classes)
- **Pricing**: [http://localhost:3000/pricing](http://localhost:3000/pricing)
- **About**: [http://localhost:3000/about](http://localhost:3000/about)
- **Contact**: [http://localhost:3000/contact](http://localhost:3000/contact)
- **Sign Up**: [http://localhost:3000/signup](http://localhost:3000/signup)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (requires login)
- **Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) (requires admin role)

### Creating an Admin User
1. Sign up through the app at `/signup`
2. In Supabase, go to **Table Editor → profiles**
3. Find your user's row
4. Change `role` from `member` to `admin`
5. Now you can access `/admin`

### Testing the Full Flow
1. Sign up as a regular member
2. Browse and book classes at `/dashboard/book`
3. View your bookings at `/dashboard/bookings`
4. Purchase a membership via `/pricing` → checkout
5. Log progress at `/dashboard/progress`
6. View your digital membership card at `/dashboard/membership`
7. Check the leaderboard at `/dashboard/leaderboard`

## Step 8: Deploy to Vercel + Supabase

### Vercel Deployment
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

### Supabase Configuration for Production
1. In Supabase → **Authentication → URL Configuration**:
   - Set **Site URL** to your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Add redirect URLs: `https://your-app.vercel.app/auth/callback`
2. Ensure email confirmation is configured under **Authentication → Providers → Email**

Your gym management app is now live!
