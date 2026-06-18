-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Untitled presentation',
  content jsonb not null default '{}'::jsonb,
  theme_id text,
  accent text,
  logo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decks_user_id_updated_at_idx
  on public.decks (user_id, updated_at desc);

alter table public.decks enable row level security;

create policy "Users read own decks"
  on public.decks for select
  using (auth.uid() = user_id);

create policy "Users insert own decks"
  on public.decks for insert
  with check (auth.uid() = user_id);

create policy "Users update own decks"
  on public.decks for update
  using (auth.uid() = user_id);

create policy "Users delete own decks"
  on public.decks for delete
  using (auth.uid() = user_id);

create or replace function public.set_decks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists decks_updated_at on public.decks;

create trigger decks_updated_at
  before update on public.decks
  for each row
  execute function public.set_decks_updated_at();
