import { IconActivity, IconBarbell, IconBike, IconDog, IconPlant2, IconRun, IconSwimming, IconZzz } from '@tabler/icons-react'

export interface ActivityTypeConfig {
  type: string
  label: string
  icon: typeof IconActivity
  color: string
}

// Types suggérés par défaut. L'utilisateur peut en ajouter d'autres librement
// (ex: footing occasionnel) — voir lib/activityTypes.ts.
export const DEFAULT_ACTIVITY_TYPES: ActivityTypeConfig[] = [
  { type: 'rameur', label: 'Rameur', icon: IconSwimming, color: 'blue' },
  { type: 'vtt', label: 'VTT', icon: IconBike, color: 'orange' },
  { type: 'chien', label: 'Chien', icon: IconDog, color: 'teal' },
  { type: 'footing', label: 'Footing', icon: IconRun, color: 'grape' },
  { type: 'musculation', label: 'Muscu', icon: IconBarbell, color: 'yellow' },
  { type: 'jardinage', label: 'Jardinage', icon: IconPlant2, color: 'lime' },
  { type: 'repos', label: 'Repos', icon: IconZzz, color: 'gray' },
]

// Icône/couleur pour un type d'activité non reconnu (ajouté librement par l'utilisateur).
export const FALLBACK_ACTIVITY_TYPE: Omit<ActivityTypeConfig, 'type' | 'label'> = {
  icon: IconActivity,
  color: 'gray',
}

// Le chien a son propre objectif ; tout le reste compte comme "sport"...
export const DOG_TYPE = 'chien'

// ...sauf ces types-là, suivis normalement mais exclus des objectifs.
export const GOAL_EXCLUDED_TYPES = ['jardinage', 'repos']

export const WEEKLY_GOALS = {
  sport: 2,
  chien: 2,
}
