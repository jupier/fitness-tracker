import { IconAward, IconBrain, IconDog, IconFlame, IconMedal, IconRun, IconSparkles, IconWeight } from '@tabler/icons-react'
import { DOG_TYPE } from '../constants'
import type { MoodEntry, WeightEntry, Workout } from '../types'

export interface BadgeContext {
  workouts: Workout[]
  weightEntries: WeightEntry[]
  moodEntries: MoodEntry[]
  streak: number
}

export interface BadgeConfig {
  id: string
  label: string
  description: string
  icon: typeof IconAward
  isUnlocked: (ctx: BadgeContext) => boolean
}

export const BADGES: BadgeConfig[] = [
  {
    id: 'first-activity',
    label: 'Premier pas',
    description: 'Logger ta première activité',
    icon: IconMedal,
    isUnlocked: (ctx) => ctx.workouts.length >= 1,
  },
  {
    id: 'first-week',
    label: 'Sur les rails',
    description: 'Atteindre les deux objectifs sur une semaine',
    icon: IconAward,
    isUnlocked: (ctx) => ctx.streak >= 1,
  },
  {
    id: 'streak-4',
    label: 'Un mois de suite',
    description: "4 semaines d'affilée avec les objectifs atteints",
    icon: IconFlame,
    isUnlocked: (ctx) => ctx.streak >= 4,
  },
  {
    id: 'streak-8',
    label: 'Habitué·e',
    description: "8 semaines d'affilée avec les objectifs atteints",
    icon: IconFlame,
    isUnlocked: (ctx) => ctx.streak >= 8,
  },
  {
    id: 'variety',
    label: 'Grand angle',
    description: "Essayer 3 types d'activité différents",
    icon: IconSparkles,
    isUnlocked: (ctx) => new Set(ctx.workouts.map((w) => w.type)).size >= 3,
  },
  {
    id: 'dog-20',
    label: 'Ami des chiens',
    description: '20 sorties chien',
    icon: IconDog,
    isUnlocked: (ctx) => ctx.workouts.filter((w) => w.type === DOG_TYPE).length >= 20,
  },
  {
    id: 'sport-25',
    label: 'Régulier·ère',
    description: '25 séances de sport',
    icon: IconRun,
    isUnlocked: (ctx) => ctx.workouts.filter((w) => w.type !== DOG_TYPE).length >= 25,
  },
  {
    id: 'weight-10',
    label: 'Suivi assidu',
    description: '10 pesées enregistrées',
    icon: IconWeight,
    isUnlocked: (ctx) => ctx.weightEntries.length >= 10,
  },
  {
    id: 'mood-10',
    label: 'Introspectif·ve',
    description: '10 humeurs enregistrées',
    icon: IconBrain,
    isUnlocked: (ctx) => ctx.moodEntries.length >= 10,
  },
]

export function unlockedBadgeIds(ctx: BadgeContext): Set<string> {
  return new Set(BADGES.filter((b) => b.isUnlocked(ctx)).map((b) => b.id))
}
