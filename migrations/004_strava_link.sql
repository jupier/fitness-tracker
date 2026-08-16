-- À exécuter dans le SQL Editor Supabase.

alter table workouts add column if not exists strava_embed_id text;
alter table workouts add column if not exists strava_embed_token text;
