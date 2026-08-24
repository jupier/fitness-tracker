import { REST_TYPE, WEEKLY_GOALS, WEIGHT_GOAL_KG, type ActivityTypeConfig } from '../constants'
import { activityConfig } from './activityTypes'
import { weekProgress } from './goals'
import type { MoodEntry, WeightEntry, Workout } from '../types'

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

/**
 * Compare l'humeur moyenne les jours avec au moins une activité physique vs les
 * jours sans — "Repos" ne compte pas comme une activité ici, sinon un jour de
 * repos loggé masquerait le vrai jour "sans rien".
 */
export function moodByActivity(workouts: Workout[], moodEntries: MoodEntry[]): MoodByActivity {
  const activeDates = new Set(workouts.filter((w) => w.type !== REST_TYPE).map((w) => w.date))
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

function averageMood(moodEntries: MoodEntry[]): number {
  if (moodEntries.length === 0) return 3 // neutre par défaut, faute de donnée
  return moodEntries.reduce((sum, m) => sum + m.mood, 0) / moodEntries.length
}

export interface WeekProfile {
  sport: number // 0-100
  chien: number // 0-100
  mood: number // 0-100
  weight: number | null // 0-100, null si pas de pesée cette semaine-là
}

/** Normalise les signaux d'une semaine (sport, chien, humeur, proximité du poids cible) sur 0-100. */
export function weekProfile(
  weekWorkouts: Workout[],
  weekMoodEntries: MoodEntry[],
  weekWeightEntries: WeightEntry[],
): WeekProfile {
  const { sport, chien } = weekProgress(weekWorkouts)
  const sportPct = Math.min(100, Math.round((sport / WEEKLY_GOALS.sport) * 100))
  const chienPct = Math.min(100, Math.round((chien / WEEKLY_GOALS.chien) * 100))
  const moodPct = Math.round(((averageMood(weekMoodEntries) - 1) / 4) * 100)

  let weightPct: number | null = null
  if (weekWeightEntries.length > 0) {
    const avgWeight = weekWeightEntries.reduce((sum, w) => sum + w.weight, 0) / weekWeightEntries.length
    weightPct = Math.max(0, Math.round(100 - Math.abs(avgWeight - WEIGHT_GOAL_KG) * 5))
  }

  return { sport: sportPct, chien: chienPct, mood: moodPct, weight: weightPct }
}

export interface WeekScoreBreakdown {
  sport: number // sur 40
  chien: number // sur 40
  mood: number // sur 20
  total: number // sur 100
}

/** Score composite d'une semaine : objectifs sport/chien (40 pts chacun) + humeur moyenne (20 pts). */
export function weekScore(weekWorkouts: Workout[], weekMoodEntries: MoodEntry[]): WeekScoreBreakdown {
  const profile = weekProfile(weekWorkouts, weekMoodEntries, [])
  const sport = Math.round(profile.sport * 0.4)
  const chien = Math.round(profile.chien * 0.4)
  const mood = Math.round(profile.mood * 0.2)
  return { sport, chien, mood, total: sport + chien + mood }
}
