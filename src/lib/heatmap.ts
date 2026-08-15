import dayjs from 'dayjs'
import { toDateKey } from './dates'
import type { Workout } from '../types'

export interface HeatmapDay {
  date: string
  count: number
  inRange: boolean
}

export interface HeatmapWeek {
  days: HeatmapDay[]
}

/** Grille façon GitHub : une colonne par semaine (lundi→dimanche), sur les `months` derniers mois. */
export function buildHeatmap(workouts: Workout[], months = 12): HeatmapWeek[] {
  const countByDate = new Map<string, number>()
  for (const w of workouts) {
    countByDate.set(w.date, (countByDate.get(w.date) ?? 0) + 1)
  }

  const today = dayjs().startOf('day')
  const rangeStart = today.subtract(months, 'month').startOf('day')
  const gridStart = rangeStart.subtract((rangeStart.day() + 6) % 7, 'day')

  const weeks: HeatmapWeek[] = []
  let cursor = gridStart
  while (cursor.isBefore(today) || cursor.isSame(today, 'day')) {
    const days: HeatmapDay[] = []
    for (let i = 0; i < 7; i++) {
      const d = cursor.add(i, 'day')
      const key = toDateKey(d)
      days.push({
        date: key,
        count: countByDate.get(key) ?? 0,
        inRange: !d.isBefore(rangeStart) && !d.isAfter(today),
      })
    }
    weeks.push({ days })
    cursor = cursor.add(1, 'week')
  }
  return weeks
}

export function intensityLevel(count: number): 0 | 1 | 2 | 3 {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  return 3
}
