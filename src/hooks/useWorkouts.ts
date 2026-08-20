import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseCollection } from '../lib/useSupabaseCollection'
import type { Workout } from '../types'

type WorkoutDetails = Partial<
  Pick<
    Workout,
    'duration_minutes' | 'distance_km' | 'notes' | 'rating' | 'strava_embed_id' | 'strava_embed_token'
  >
>

export function useWorkouts(userId: string | undefined) {
  const {
    data: workouts,
    setData: setWorkouts,
    loading,
    error,
    refresh,
  } = useSupabaseCollection<Workout>('workouts', userId, 'date')

  const addWorkout = useCallback(
    async (type: string, date: string) => {
      if (!userId) return
      const { data, error } = await supabase
        .from('workouts')
        .insert({ user_id: userId, type, date })
        .select()
        .single()
      if (!error && data) setWorkouts((prev) => [data, ...prev])
    },
    [userId, setWorkouts],
  )

  const updateWorkout = useCallback(
    async (id: string, patch: WorkoutDetails) => {
      const { data, error } = await supabase.from('workouts').update(patch).eq('id', id).select().single()
      if (!error && data) setWorkouts((prev) => prev.map((w) => (w.id === id ? data : w)))
    },
    [setWorkouts],
  )

  const removeWorkout = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('workouts').delete().eq('id', id)
      if (!error) setWorkouts((prev) => prev.filter((w) => w.id !== id))
    },
    [setWorkouts],
  )

  return { workouts, loading, error, addWorkout, updateWorkout, removeWorkout, refresh }
}
