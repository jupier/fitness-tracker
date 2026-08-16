-- À exécuter dans le SQL Editor Supabase.

alter table workouts add column if not exists distance_km numeric;
