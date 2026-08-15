import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Workout } from '../types'

type WorkoutDetails = Partial<Pick<Workout, 'duration_minutes' | 'notes' | 'rating'>>

export function useWorkouts(userId: string | undefined) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) setWorkouts(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

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
    [userId],
  )

  const updateWorkout = useCallback(async (id: string, patch: WorkoutDetails) => {
    const { data, error } = await supabase.from('workouts').update(patch).eq('id', id).select().single()
    if (!error && data) setWorkouts((prev) => prev.map((w) => (w.id === id ? data : w)))
  }, [])

  const removeWorkout = useCallback(async (id: string) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id)
    if (!error) setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }, [])

  return { workouts, loading, addWorkout, updateWorkout, removeWorkout, refresh }
}
