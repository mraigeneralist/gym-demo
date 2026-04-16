-- ============================================================
-- GymDemo: Complete Database Schema
-- Run this in Supabase SQL Editor on a fresh project
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('member', 'admin');
create type membership_plan as enum ('basic', 'pro', 'elite');
create type membership_interval as enum ('monthly', '3month', 'annual');
create type membership_status as enum ('active', 'expired', 'cancelled');
create type booking_status as enum ('confirmed', 'waitlist', 'cancelled');

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  phone text,
  referral_code text unique not null default substr(md5(random()::text), 1, 8),
  role user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Trainers
create table trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text not null default '',
  photo_url text,
  specialties text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Classes
create table classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  instructor_id uuid references trainers(id) on delete set null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  capacity integer not null default 20,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- Memberships
create table memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade not null,
  plan membership_plan not null,
  interval membership_interval not null default 'monthly',
  price numeric(10,2) not null,
  start_date date not null default current_date,
  end_date date not null,
  status membership_status not null default 'active',
  created_at timestamptz not null default now()
);

-- Bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  class_date date not null,
  status booking_status not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- Waitlist
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade not null,
  class_id uuid references classes(id) on delete cascade not null,
  class_date date not null,
  position integer not null,
  created_at timestamptz not null default now()
);

-- Workout of the Day
create table workouts_of_day (
  id uuid primary key default gen_random_uuid(),
  date date unique not null,
  title text not null,
  description text not null default '',
  exercises jsonb not null default '[]',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Progress Logs
create table progress_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  weight numeric(5,1),
  notes text,
  metrics jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_memberships_member on memberships(member_id);
create index idx_memberships_status on memberships(status);
create index idx_bookings_member on bookings(member_id);
create index idx_bookings_class_date on bookings(class_id, class_date);
create index idx_bookings_status on bookings(status);
create index idx_waitlist_class_date on waitlist(class_id, class_date);
create index idx_waitlist_position on waitlist(class_id, class_date, position);
create index idx_wod_date on workouts_of_day(date);
create index idx_progress_member_date on progress_logs(member_id, date);
create index idx_classes_day on classes(day_of_week);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table trainers enable row level security;
alter table classes enable row level security;
alter table bookings enable row level security;
alter table waitlist enable row level security;
alter table workouts_of_day enable row level security;
alter table progress_logs enable row level security;

-- Helper: check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- PROFILES
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles
  for select using (is_admin());
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Enable insert for auth users" on profiles
  for insert with check (auth.uid() = id);

-- MEMBERSHIPS
create policy "Users can view own memberships" on memberships
  for select using (auth.uid() = member_id);
create policy "Admins can view all memberships" on memberships
  for select using (is_admin());
create policy "Admins can insert memberships" on memberships
  for insert with check (auth.uid() = member_id or is_admin());
create policy "Admins can update memberships" on memberships
  for update using (is_admin());

-- TRAINERS (public read)
create policy "Anyone can view trainers" on trainers
  for select using (true);
create policy "Admins can manage trainers" on trainers
  for all using (is_admin());

-- CLASSES (public read)
create policy "Anyone can view classes" on classes
  for select using (true);
create policy "Admins can manage classes" on classes
  for all using (is_admin());

-- BOOKINGS
create policy "Users can view own bookings" on bookings
  for select using (auth.uid() = member_id);
create policy "Admins can view all bookings" on bookings
  for select using (is_admin());
create policy "Users can create bookings" on bookings
  for insert with check (auth.uid() = member_id);
create policy "Users can update own bookings" on bookings
  for update using (auth.uid() = member_id);
create policy "Admins can update bookings" on bookings
  for update using (is_admin());

-- WAITLIST
create policy "Users can view own waitlist" on waitlist
  for select using (auth.uid() = member_id);
create policy "Admins can view all waitlist" on waitlist
  for select using (is_admin());
create policy "Users can join waitlist" on waitlist
  for insert with check (auth.uid() = member_id);
create policy "System can manage waitlist" on waitlist
  for delete using (auth.uid() = member_id or is_admin());

-- WORKOUTS OF THE DAY (public read)
create policy "Anyone can view WODs" on workouts_of_day
  for select using (true);
create policy "Admins can manage WODs" on workouts_of_day
  for all using (is_admin());

-- PROGRESS LOGS (private)
create policy "Users can view own progress" on progress_logs
  for select using (auth.uid() = member_id);
create policy "Users can log progress" on progress_logs
  for insert with check (auth.uid() = member_id);
create policy "Users can update own progress" on progress_logs
  for update using (auth.uid() = member_id);
create policy "Users can delete own progress" on progress_logs
  for delete using (auth.uid() = member_id);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New Member'),
    new.raw_user_meta_data->>'avatar_url',
    substr(md5(new.id::text || random()::text), 1, 8)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
