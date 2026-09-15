import {
  IconMoodEmpty,
  IconMoodHappy,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodSmileBeam,
} from '@tabler/icons-react'

export interface MoodLevel {
  value: number
  icon: typeof IconMoodSad
  label: string
  // Dégradé rouge -> jaune -> vert (demande explicite, plutôt que la palette
  // divergente rouge/bleu habituelle du skill dataviz). Le distinguo ne repose
  // pas que sur la couleur : chaque niveau a aussi une icône de forme différente.
  colorLight: string
  colorDark: string
}

export const MOOD_LEVELS: MoodLevel[] = [
  { value: 1, icon: IconMoodSad, label: 'Mauvaise', colorLight: '#e03131', colorDark: '#ff8787' },
  { value: 2, icon: IconMoodEmpty, label: 'Difficile', colorLight: '#e8590c', colorDark: '#ffa94d' },
  { value: 3, icon: IconMoodNeutral, label: 'Neutre', colorLight: '#f59f00', colorDark: '#ffd43b' },
  { value: 4, icon: IconMoodHappy, label: 'Bonne', colorLight: '#66a80f', colorDark: '#a9e34b' },
  { value: 5, icon: IconMoodSmileBeam, label: 'Excellente', colorLight: '#2b8a3e', colorDark: '#69db7c' },
]

export function moodLevel(value: number): MoodLevel {
  return MOOD_LEVELS.find((m) => m.value === value) ?? MOOD_LEVELS[2]
}

export function moodColor(level: MoodLevel, colorScheme: 'light' | 'dark'): string {
  return colorScheme === 'dark' ? level.colorDark : level.colorLight
}
