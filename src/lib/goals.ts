import dayjs from 'dayjs'
import { DOG_TYPE, GOAL_EXCLUDED_TYPES, WEEKLY_GOALS } from '../constants'
import { startOfIsoWeek, toDateKey, weekDays } from './dates'
import type { Workout } from '../types'

export interface WeekProgress {
  sport: number
  chien: number
}

export function weekProgress(weekWorkouts: Workout[]): WeekProgress {
  let sport = 0
  let chien = 0
  for (const w of weekWorkouts) {
    if (w.type === DOG_TYPE) chien++
    else if (!GOAL_EXCLUDED_TYPES.includes(w.type)) sport++
  }
  return { sport, chien }
}

export function weekGoalsMet(weekWorkouts: Workout[]): boolean {
  const { sport, chien } = weekProgress(weekWorkouts)
  return sport >= WEEKLY_GOALS.sport && chien >= WEEKLY_GOALS.chien
}

function workoutsInWeek(workouts: Workout[], weekStart: dayjs.Dayjs): Workout[] {
  const keys = new Set(weekDays(weekStart).map(toDateKey))
  return workouts.filter((w) => keys.has(w.date))
}

/**
 * Nombre de semaines consécutives (en remontant depuis la semaine en cours) où les
 * deux objectifs ont été atteints. La semaine en cours ne compte que si elle est
 * déjà validée — sinon elle est simplement ignorée (pas encore terminée), sans
 * casser la série des semaines précédentes.
 */
export function computeStreak(workouts: Workout[]): number {
  const currentWeekStart = startOfIsoWeek(dayjs())
  let streak = 0

  if (weekGoalsMet(workoutsInWeek(workouts, currentWeekStart))) {
    streak++
  }

  let cursor = currentWeekStart.subtract(1, 'week')
  while (weekGoalsMet(workoutsInWeek(workouts, cursor))) {
    streak++
    cursor = cursor.subtract(1, 'week')
  }

  return streak
}
