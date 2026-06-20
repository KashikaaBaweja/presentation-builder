-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Creates profiles, is_admin(), signup trigger, and admin RLS policies.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS where needed.

-- ---------------------------------------------------------------------------
-- Profiles table
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- is_admin() — must exist before RLS policies that call it
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Profiles RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup (email, Google OAuth, or any auth provider)
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'user')
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill profiles for users who signed up before this script ran
insert into public.profiles (id, email, role)
select id, coalesce(email, ''), 'user'
from auth.users
on conflict (id) do update
  set email = excluded.email;

-- ---------------------------------------------------------------------------
-- Admin access to all decks (existing user deck policies stay unchanged)
-- ---------------------------------------------------------------------------

drop policy if exists "Admins read all decks" on public.decks;
create policy "Admins read all decks"
  on public.decks for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Make yourself admin — run AFTER the script above succeeds:
--
--   update public.profiles
--   set role = 'admin'
--   where email = 'kashikabaweja02@gmail.com';
-- ---------------------------------------------------------------------------
