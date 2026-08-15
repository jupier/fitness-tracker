import type { ActivityTypeConfig } from '../constants'
import { activityConfig } from './activityTypes'
import type { MoodEntry, Workout } from '../types'

export interface ActivityBreakdownItem {
  type: string
  label: string
  color: string
  count: number
}

export function activityBreakdown(workouts: Workout[], activityTypes: ActivityTypeConfig[]): ActivityBreakdownItem[] {
  const counts = new Map<string, number>()
  for (const w of workouts) {
    counts.set(w.type, (counts.get(w.type) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([type, count]) => {
      const cfg = activityConfig(type, activityTypes)
      return { type, label: cfg.label, color: cfg.color, count }
    })
    .sort((a, b) => b.count - a.count)
}

export interface MoodByActivity {
  activeAvg: number | null
  activeCount: number
  restAvg: number | null
  restCount: number
}

/** Compare l'humeur moyenne les jours avec au moins une activité vs les jours sans. */
export function moodByActivity(workouts: Workout[], moodEntries: MoodEntry[]): MoodByActivity {
  const activeDates = new Set(workouts.map((w) => w.date))
  let activeSum = 0
  let activeCount = 0
  let restSum = 0
  let restCount = 0

  for (const m of moodEntries) {
    if (activeDates.has(m.date)) {
      activeSum += m.mood
      activeCount++
    } else {
      restSum += m.mood
      restCount++
    }
  }

  return {
    activeAvg: activeCount > 0 ? activeSum / activeCount : null,
    activeCount,
    restAvg: restCount > 0 ? restSum / restCount : null,
    restCount,
  }
}
