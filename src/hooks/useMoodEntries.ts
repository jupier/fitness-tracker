import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { MoodEntry } from '../types'

export function useMoodEntries(userId: string | undefined) {
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('date', { ascending: false })
    if (!error && data) setEntries(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addEntry = useCallback(
    async (mood: number, date: string) => {
      if (!userId) return
      const { data, error } = await supabase
        .from('mood_entries')
        .upsert({ user_id: userId, mood, date }, { onConflict: 'user_id,date' })
        .select()
        .single()
      if (!error && data) {
        setEntries((prev) => [data, ...prev.filter((e) => e.date !== date)])
      }
    },
    [userId],
  )

  const updateNote = useCallback(async (id: string, note: string | null) => {
    const { data, error } = await supabase.from('mood_entries').update({ note }).eq('id', id).select().single()
    if (!error && data) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)))
  }, [])

  const removeEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('mood_entries').delete().eq('id', id)
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, loading, addEntry, updateNote, removeEntry, refresh }
}
