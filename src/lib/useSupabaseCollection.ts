import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Fetch générique avec une nouvelle tentative automatique en cas d'échec (coupure
 * réseau ponctuelle, démarrage à froid du projet Supabase gratuit...) plutôt que de
 * rester silencieusement sur des données vides comme si tout s'était bien passé.
 */
export function useSupabaseCollection<T>(table: string, userId: string | undefined, orderBy: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchOnce = useCallback(async () => {
    return supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending: false })
  }, [table, orderBy])

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(false)

    const first = await fetchOnce()
    if (!first.error) {
      setData((first.data as T[]) ?? [])
      setLoading(false)
      return
    }

    console.error(`Erreur de chargement (${table}), nouvelle tentative...`, first.error)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const retry = await fetchOnce()
    if (!retry.error) {
      setData((retry.data as T[]) ?? [])
      setLoading(false)
      return
    }

    console.error(`Échec du chargement (${table}) après nouvelle tentative.`, retry.error)
    setError(true)
    setLoading(false)
  }, [userId, table, fetchOnce])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, setData, loading, error, refresh }
}
