-- À exécuter dans le SQL Editor Supabase.

create table mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  mood smallint not null check (mood between 1 and 5),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table mood_entries enable row level security;

create policy "own mood entries" on mood_entries for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
