import dayjs from 'dayjs'
import {
  IconArrowBackUp,
  IconAward,
  IconBolt,
  IconBrain,
  IconBrandStrava,
  IconCalendarWeek,
  IconClock,
  IconCrown,
  IconDiamond,
  IconDog,
  IconFlame,
  IconMedal,
  IconNotes,
  IconPalette,
  IconRocket,
  IconRoute,
  IconRun,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconTrophy,
  IconWeight,
} from '@tabler/icons-react'
import { DOG_TYPE, GOAL_EXCLUDED_TYPES } from '../constants'
import { startOfIsoWeek, toDateKey } from './dates'
import type { MoodEntry, WeightEntry, Workout } from '../types'

export interface BadgeContext {
  workouts: Workout[]
  weightEntries: WeightEntry[]
  moodEntries: MoodEntry[]
  streak: number
  dayStreak: number
}

export interface BadgeConfig {
  id: string
  label: string
  description: string
  icon: typeof IconAward
  category: string
  isUnlocked: (ctx: BadgeContext) => boolean
}

function sportCount(workouts: Workout[]): number {
  return workouts.filter((w) => w.type !== DOG_TYPE && !GOAL_EXCLUDED_TYPES.includes(w.type)).length
}

function dogCount(workouts: Workout[]): number {
  return workouts.filter((w) => w.type === DOG_TYPE).length
}

function totalDistance(workouts: Workout[]): number {
  return workouts.reduce((sum, w) => sum + (w.distance_km ?? 0), 0)
}

function totalDuration(workouts: Workout[]): number {
  return workouts.reduce((sum, w) => sum + (w.duration_minutes ?? 0), 0)
}

function hasComeback(workouts: Workout[]): boolean {
  const dates = Array.from(new Set(workouts.map((w) => w.date))).sort()
  for (let i = 1; i < dates.length; i++) {
    if (dayjs(dates[i]).diff(dayjs(dates[i - 1]), 'day') >= 14) return true
  }
  return false
}

function hasWeekVariety(workouts: Workout[], minTypes: number): boolean {
  const byWeek = new Map<string, Set<string>>()
  for (const w of workouts) {
    const weekKey = toDateKey(startOfIsoWeek(dayjs(w.date)))
    const set = byWeek.get(weekKey) ?? new Set<string>()
    set.add(w.type)
    byWeek.set(weekKey, set)
  }
  return [...byWeek.values()].some((set) => set.size >= minTypes)
}

export const BADGE_CATEGORIES = [
  'Débuts',
  'Séries',
  'Volume',
  'Variété',
  'Chien',
  'Sport',
  'Distance & durée',
  'Poids',
  'Humeur',
  'Bonus',
] as const

export const BADGES: BadgeConfig[] = [
  // Débuts
  {
    id: 'first-activity',
    label: 'Premier pas',
    description: 'Logger ta première activité',
    icon: IconMedal,
    category: 'Débuts',
    isUnlocked: (ctx) => ctx.workouts.length >= 1,
  },
  {
    id: 'first-week',
    label: 'Sur les rails',
    description: 'Atteindre les deux objectifs sur une semaine',
    icon: IconAward,
    category: 'Débuts',
    isUnlocked: (ctx) => ctx.streak >= 1,
  },

  // Séries de semaines
  {
    id: 'streak-4',
    label: 'Un mois de suite',
    description: "4 semaines d'affilée avec les objectifs atteints",
    icon: IconFlame,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.streak >= 4,
  },
  {
    id: 'streak-8',
    label: 'Habitué·e',
    description: "8 semaines d'affilée avec les objectifs atteints",
    icon: IconFlame,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.streak >= 8,
  },
  {
    id: 'streak-12',
    label: 'Trois mois de suite',
    description: "12 semaines d'affilée avec les objectifs atteints",
    icon: IconTrophy,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.streak >= 12,
  },
  {
    id: 'streak-26',
    label: 'Six mois de suite',
    description: "26 semaines d'affilée avec les objectifs atteints",
    icon: IconDiamond,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.streak >= 26,
  },
  {
    id: 'streak-52',
    label: 'Une année entière',
    description: "52 semaines d'affilée avec les objectifs atteints",
    icon: IconCrown,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.streak >= 52,
  },

  // Séries de jours
  {
    id: 'day-streak-3',
    label: 'Trois jours de suite',
    description: "Logger une activité 3 jours d'affilée",
    icon: IconBolt,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.dayStreak >= 3,
  },
  {
    id: 'day-streak-7',
    label: 'Semaine sans faute',
    description: "Logger une activité 7 jours d'affilée",
    icon: IconCalendarWeek,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.dayStreak >= 7,
  },
  {
    id: 'day-streak-30',
    label: 'Mois sans faute',
    description: "Logger une activité 30 jours d'affilée",
    icon: IconRocket,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.dayStreak >= 30,
  },
  {
    id: 'day-streak-100',
    label: 'Centurion',
    description: "Logger une activité 100 jours d'affilée",
    icon: IconCrown,
    category: 'Séries',
    isUnlocked: (ctx) => ctx.dayStreak >= 100,
  },

  // Volume total de séances
  {
    id: 'total-10',
    label: 'Dix séances',
    description: '10 activités enregistrées au total',
    icon: IconStar,
    category: 'Volume',
    isUnlocked: (ctx) => ctx.workouts.length >= 10,
  },
  {
    id: 'total-50',
    label: 'Cinquante séances',
    description: '50 activités enregistrées au total',
    icon: IconStarFilled,
    category: 'Volume',
    isUnlocked: (ctx) => ctx.workouts.length >= 50,
  },
  {
    id: 'total-100',
    label: 'Centenaire',
    description: '100 activités enregistrées au total',
    icon: IconTrophy,
    category: 'Volume',
    isUnlocked: (ctx) => ctx.workouts.length >= 100,
  },

  // Variété
  {
    id: 'variety',
    label: 'Grand angle',
    description: "Essayer 3 types d'activité différents",
    icon: IconSparkles,
    category: 'Variété',
    isUnlocked: (ctx) => new Set(ctx.workouts.map((w) => w.type)).size >= 3,
  },
  {
    id: 'week-variety',
    label: 'Touche-à-tout',
    description: "4 types d'activité différents sur une même semaine",
    icon: IconPalette,
    category: 'Variété',
    isUnlocked: (ctx) => hasWeekVariety(ctx.workouts, 4),
  },

  // Chien
  {
    id: 'dog-20',
    label: 'Ami des chiens',
    description: '20 sorties chien',
    icon: IconDog,
    category: 'Chien',
    isUnlocked: (ctx) => dogCount(ctx.workouts) >= 20,
  },
  {
    id: 'dog-50',
    label: 'Meilleur ami',
    description: '50 sorties chien',
    icon: IconDog,
    category: 'Chien',
    isUnlocked: (ctx) => dogCount(ctx.workouts) >= 50,
  },
  {
    id: 'dog-100',
    label: 'Le chien te remercie',
    description: '100 sorties chien',
    icon: IconDog,
    category: 'Chien',
    isUnlocked: (ctx) => dogCount(ctx.workouts) >= 100,
  },

  // Sport
  {
    id: 'sport-25',
    label: 'Régulier·ère',
    description: '25 séances de sport',
    icon: IconRun,
    category: 'Sport',
    isUnlocked: (ctx) => sportCount(ctx.workouts) >= 25,
  },
  {
    id: 'sport-50',
    label: 'Sportif·ve confirmé·e',
    description: '50 séances de sport',
    icon: IconRun,
    category: 'Sport',
    isUnlocked: (ctx) => sportCount(ctx.workouts) >= 50,
  },
  {
    id: 'sport-100',
    label: 'Centurion du sport',
    description: '100 séances de sport',
    icon: IconRun,
    category: 'Sport',
    isUnlocked: (ctx) => sportCount(ctx.workouts) >= 100,
  },

  // Distance et durée
  {
    id: 'distance-50',
    label: '50 km parcourus',
    description: 'Cumuler 50 km sur tes séances',
    icon: IconRoute,
    category: 'Distance & durée',
    isUnlocked: (ctx) => totalDistance(ctx.workouts) >= 50,
  },
  {
    id: 'distance-100',
    label: '100 km parcourus',
    description: 'Cumuler 100 km sur tes séances',
    icon: IconRoute,
    category: 'Distance & durée',
    isUnlocked: (ctx) => totalDistance(ctx.workouts) >= 100,
  },
  {
    id: 'distance-500',
    label: '500 km parcourus',
    description: 'Cumuler 500 km sur tes séances',
    icon: IconRoute,
    category: 'Distance & durée',
    isUnlocked: (ctx) => totalDistance(ctx.workouts) >= 500,
  },
  {
    id: 'duration-600',
    label: "10 heures d'effort",
    description: 'Cumuler 10h de séances chronométrées',
    icon: IconClock,
    category: 'Distance & durée',
    isUnlocked: (ctx) => totalDuration(ctx.workouts) >= 600,
  },
  {
    id: 'duration-6000',
    label: "100 heures d'effort",
    description: 'Cumuler 100h de séances chronométrées',
    icon: IconClock,
    category: 'Distance & durée',
    isUnlocked: (ctx) => totalDuration(ctx.workouts) >= 6000,
  },

  // Poids
  {
    id: 'weight-10',
    label: 'Suivi assidu',
    description: '10 pesées enregistrées',
    icon: IconWeight,
    category: 'Poids',
    isUnlocked: (ctx) => ctx.weightEntries.length >= 10,
  },
  {
    id: 'weight-30',
    label: 'Suivi sur la durée',
    description: '30 pesées enregistrées',
    icon: IconWeight,
    category: 'Poids',
    isUnlocked: (ctx) => ctx.weightEntries.length >= 30,
  },
  {
    id: 'weight-100',
    label: 'Suivi expert',
    description: '100 pesées enregistrées',
    icon: IconWeight,
    category: 'Poids',
    isUnlocked: (ctx) => ctx.weightEntries.length >= 100,
  },

  // Humeur
  {
    id: 'mood-10',
    label: 'Introspectif·ve',
    description: '10 humeurs enregistrées',
    icon: IconBrain,
    category: 'Humeur',
    isUnlocked: (ctx) => ctx.moodEntries.length >= 10,
  },
  {
    id: 'mood-30',
    label: 'Grand·e observateur·rice',
    description: '30 humeurs enregistrées',
    icon: IconBrain,
    category: 'Humeur',
    isUnlocked: (ctx) => ctx.moodEntries.length >= 30,
  },
  {
    id: 'mood-100',
    label: 'Zen absolu',
    description: '100 humeurs enregistrées',
    icon: IconBrain,
    category: 'Humeur',
    isUnlocked: (ctx) => ctx.moodEntries.length >= 100,
  },

  // Bonus
  {
    id: 'comeback',
    label: 'Retour en force',
    description: 'Reprendre après au moins 14 jours de pause',
    icon: IconArrowBackUp,
    category: 'Bonus',
    isUnlocked: (ctx) => hasComeback(ctx.workouts),
  },
  {
    id: 'strava-linked',
    label: 'Connecté',
    description: 'Lier une séance à une activité Strava',
    icon: IconBrandStrava,
    category: 'Bonus',
    isUnlocked: (ctx) => ctx.workouts.some((w) => !!w.strava_embed_id),
  },
  {
    id: 'notes-10',
    label: 'Le mot juste',
    description: '10 séances avec un commentaire',
    icon: IconNotes,
    category: 'Bonus',
    isUnlocked: (ctx) => ctx.workouts.filter((w) => !!w.notes).length >= 10,
  },
  {
    id: 'five-star',
    label: 'Séance parfaite',
    description: 'Noter une séance 5 étoiles',
    icon: IconStarFilled,
    category: 'Bonus',
    isUnlocked: (ctx) => ctx.workouts.some((w) => w.rating === 5),
  },
]

export function unlockedBadgeIds(ctx: BadgeContext): Set<string> {
  return new Set(BADGES.filter((b) => b.isUnlocked(ctx)).map((b) => b.id))
}
