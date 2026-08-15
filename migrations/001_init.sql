-- À exécuter une fois dans l'éditeur SQL de ton projet Supabase.

create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('rameur', 'vtt', 'chien')),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table workouts enable row level security;
alter table weight_entries enable row level security;

create policy "own workouts" on workouts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own weight entries" on weight_entries for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
