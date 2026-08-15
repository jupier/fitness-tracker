export interface MoodLevel {
  value: number
  emoji: string
  label: string
  // Dégradé divergent (skill dataviz) : rouge (mauvaise) -> gris (neutre) -> bleu (bonne).
  colorLight: string
  colorDark: string
}

export const MOOD_LEVELS: MoodLevel[] = [
  { value: 1, emoji: '😞', label: 'Mauvaise', colorLight: '#d03b3b', colorDark: '#e66767' },
  { value: 2, emoji: '😕', label: 'Difficile', colorLight: '#e88a8a', colorDark: '#c96565' },
  { value: 3, emoji: '😐', label: 'Neutre', colorLight: '#c3c2b7', colorDark: '#5f5e58' },
  { value: 4, emoji: '🙂', label: 'Bonne', colorLight: '#86b6ef', colorDark: '#5598e7' },
  { value: 5, emoji: '😄', label: 'Excellente', colorLight: '#2a78d6', colorDark: '#3987e5' },
]

export function moodLevel(value: number): MoodLevel {
  return MOOD_LEVELS.find((m) => m.value === value) ?? MOOD_LEVELS[2]
}
