export interface Workout {
  id: string
  user_id: string
  type: string
  date: string
  notes: string | null
  duration_minutes: number | null
  distance_km: number | null
  rating: number | null
  strava_embed_id: string | null
  strava_embed_token: string | null
  created_at: string
}

export interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  date: string
  mood: number
  note: string | null
  created_at: string
}
