import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { WeightEntry } from '../types'

export function useWeightEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) setEntries(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

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
    [userId],
  )

  const removeEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('weight_entries').delete().eq('id', id)
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, loading, addEntry, removeEntry, refresh }
}
