create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('client', 'fundi', 'admin')),
  name text not null,
  phone text not null unique,
  avatar_url text,
  id_number text,
  is_verified boolean default false,
  rating numeric(2,1) default 0,
  price_per_day numeric(10,2) default 0,
  skills text[] default '{}',
  location_lat double precision,
  location_lng double precision,
  is_online boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete cascade,
  fundi_id uuid references public.profiles(id) on delete cascade,
  service_type text not null,
  status text not null check (status in ('pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled')) default 'pending',
  client_lat double precision,
  client_lng double precision,
  fundi_lat double precision,
  fundi_lng double precision,
  price numeric(10,2) default 0,
  scheduled_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete cascade,
  reviewed_id uuid references public.profiles(id) on delete cascade,
  stars integer check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_client_idx on public.jobs(client_id);
create index if not exists jobs_fundi_idx on public.jobs(fundi_id);
create index if not exists messages_job_idx on public.messages(job_id);

-- Seed helpers for a simple in-app MVP
-- You can later replace this with generated Supabase data.
-- NOTE: Supabase auth is handled separately for login and OTP.
