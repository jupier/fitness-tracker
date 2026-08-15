-- À exécuter dans le SQL Editor Supabase (projet déjà initialisé avec 001_init.sql).
-- Autorise n'importe quel type d'activité (plus seulement rameur/vtt/chien) et
-- ajoute des détails optionnels par séance : durée et note sur 5.

alter table workouts drop constraint if exists workouts_type_check;

alter table workouts add column if not exists duration_minutes integer;
alter table workouts add column if not exists rating smallint check (rating between 1 and 5);
