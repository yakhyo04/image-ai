-- Artboard — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run: uses "if not exists" / "drop policy if exists" throughout.

-- ─────────────────────────────────────────────────────────────
-- profiles: one row per auth user, created automatically on signup
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  store_name  text,
  credits     integer not null default 30,
  created_at  timestamptz not null default now()
);

-- For databases created before the credits column existed.
alter table public.profiles
  add column if not exists credits integer not null default 30;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by their owner" on public.profiles;
create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Credits must never be settable by the client. Remove blanket UPDATE and
-- grant it back only on the user-editable profile fields. Credit changes go
-- exclusively through the spend_credits() function below.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, store_name, avatar_url) on public.profiles to authenticated;

-- Atomically spend (or, with a negative cost, refund) the current user's
-- credits. SECURITY DEFINER so it can write the protected `credits` column.
-- Raises INSUFFICIENT_CREDITS when the balance would go negative.
create or replace function public.spend_credits(cost integer)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  remaining integer;
begin
  update public.profiles
     set credits = credits - cost
   where id = auth.uid() and credits >= cost
  returning credits into remaining;

  if remaining is null then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  return remaining;
end;
$$;

revoke all on function public.spend_credits(integer) from public;
grant execute on function public.spend_credits(integer) to authenticated;

-- Auto-create a profile row when a new auth user is inserted.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- generations: one row per saved generated image
-- ─────────────────────────────────────────────────────────────
create table if not exists public.generations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  tool         text,
  prompt       text,
  storage_path text not null,
  mime_type    text,
  created_at   timestamptz not null default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

alter table public.generations enable row level security;

drop policy if exists "Users can read their own generations" on public.generations;
create policy "Users can read their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own generations" on public.generations;
create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own generations" on public.generations;
create policy "Users can delete their own generations"
  on public.generations for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- generation_events: one row per generation attempt (success or failure),
-- used to compute a real success rate.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.generation_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  tool        text,
  status      text not null check (status in ('success', 'failed')),
  created_at  timestamptz not null default now()
);

create index if not exists generation_events_user_idx
  on public.generation_events (user_id, created_at desc);

alter table public.generation_events enable row level security;

drop policy if exists "Users can read their own generation events" on public.generation_events;
create policy "Users can read their own generation events"
  on public.generation_events for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own generation events" on public.generation_events;
create policy "Users can insert their own generation events"
  on public.generation_events for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Storage bucket: generations (private). Each user owns the folder
-- named after their uid, e.g. generations/<uid>/<file>.png
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('generations', 'generations', false)
on conflict (id) do nothing;

drop policy if exists "Users can read own generation files" on storage.objects;
create policy "Users can read own generation files"
  on storage.objects for select
  using (
    bucket_id = 'generations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload own generation files" on storage.objects;
create policy "Users can upload own generation files"
  on storage.objects for insert
  with check (
    bucket_id = 'generations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own generation files" on storage.objects;
create policy "Users can delete own generation files"
  on storage.objects for delete
  using (
    bucket_id = 'generations'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
