import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseCollection } from '../lib/useSupabaseCollection'
import type { WeightEntry } from '../types'

export function useWeightEntries(userId: string | undefined) {
  const {
    data: entries,
    setData: setEntries,
    loading,
    error,
    refresh,
  } = useSupabaseCollection<WeightEntry>('weight_entries', userId, 'date')

  const addEntry = useCallback(
    async (weight: number, date: string) => {
      if (!userId) return
      const { data, error } = await supabase
        .from('weight_entries')
        .upsert({ user_id: userId, weight, date }, { onConflict: 'user_id,date' })
        .select()
        .single()
      if (!error && data) {
        setEntries((prev) => [data, ...prev.filter((e) => e.date !== date)])
      }
    },
    [userId, setEntries],
  )

  const removeEntry = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('weight_entries').delete().eq('id', id)
      if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
    },
    [setEntries],
  )

  return { entries, loading, error, addEntry, removeEntry, refresh }
}
