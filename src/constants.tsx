import { IconActivity, IconBarbell, IconBike, IconDog, IconPlant2, IconRun, IconSwimming, IconZzz } from '@tabler/icons-react'

export interface ActivityTypeConfig {
  type: string
  label: string
  icon: typeof IconActivity
  color: string
  // Types pour lesquels l'intégration Strava a du sens (pour l'instant : sorties
  // cardio/GPS). Non proposé sur chien/muscu/jardinage/repos ni les types perso.
  stravaEligible?: boolean
}

// Types suggérés par défaut. L'utilisateur peut en ajouter d'autres librement
// (ex: footing occasionnel) — voir lib/activityTypes.ts.
export const DEFAULT_ACTIVITY_TYPES: ActivityTypeConfig[] = [
  { type: 'rameur', label: 'Rameur', icon: IconSwimming, color: 'blue', stravaEligible: true },
  { type: 'vtt', label: 'VTT', icon: IconBike, color: 'orange', stravaEligible: true },
  { type: 'chien', label: 'Chien', icon: IconDog, color: 'teal' },
  { type: 'footing', label: 'Footing', icon: IconRun, color: 'grape', stravaEligible: true },
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

export const WEIGHT_GOAL_KG = 85
