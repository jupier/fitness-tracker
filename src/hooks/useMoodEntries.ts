import { useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseCollection } from '../lib/useSupabaseCollection'
import type { MoodEntry } from '../types'

export function useMoodEntries(userId: string | undefined) {
  const {
    data: entries,
    setData: setEntries,
    loading,
    error,
    refresh,
  } = useSupabaseCollection<MoodEntry>('mood_entries', userId, 'date')

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
    [userId, setEntries],
  )

  const updateNote = useCallback(
    async (id: string, note: string | null) => {
      const { data, error } = await supabase.from('mood_entries').update({ note }).eq('id', id).select().single()
      if (!error && data) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)))
    },
    [setEntries],
  )

  const removeEntry = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('mood_entries').delete().eq('id', id)
      if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
    },
    [setEntries],
  )

  return { entries, loading, error, addEntry, updateNote, removeEntry, refresh }
}
