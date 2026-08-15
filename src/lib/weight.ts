import dayjs from 'dayjs'
import type { WeightEntry } from '../types'

export function sortedByDate(entries: WeightEntry[]): WeightEntry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date))
}

/** Variation entre la dernière pesée et la pesée la plus proche il y a `days` jours. */
export function weightDelta(entries: WeightEntry[], days = 30): number | null {
  const sorted = sortedByDate(entries)
  if (sorted.length < 2) return null

  const latest = sorted[sorted.length - 1]
  const cutoff = dayjs(latest.date).subtract(days, 'day')
  const reference = sorted.find((e) => !dayjs(e.date).isBefore(cutoff)) ?? sorted[0]

  if (reference.id === latest.id) return null
  return latest.weight - reference.weight
}

/** Moyenne mobile simple sur `window` points, pour lisser les variations quotidiennes. */
export function movingAverage(entries: WeightEntry[], window = 7): { date: string; value: number }[] {
  const sorted = sortedByDate(entries)
  return sorted.map((entry, i) => {
    const slice = sorted.slice(Math.max(0, i - window + 1), i + 1)
    const avg = slice.reduce((sum, e) => sum + e.weight, 0) / slice.length
    return { date: entry.date, value: Math.round(avg * 10) / 10 }
  })
}
