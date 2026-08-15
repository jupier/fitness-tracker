import { DEFAULT_ACTIVITY_TYPES, FALLBACK_ACTIVITY_TYPE, type ActivityTypeConfig } from '../constants'
import type { Workout } from '../types'

/** Types par défaut + types déjà utilisés par l'utilisateur (ex: footing ajouté à la volée). */
export function deriveActivityTypes(workouts: Workout[]): ActivityTypeConfig[] {
  const knownSlugs = new Set(DEFAULT_ACTIVITY_TYPES.map((t) => t.type))
  const customSlugs = new Set<string>()
  for (const w of workouts) {
    if (!knownSlugs.has(w.type)) customSlugs.add(w.type)
  }
  const customs: ActivityTypeConfig[] = Array.from(customSlugs)
    .sort()
    .map((type) => ({ type, label: type, ...FALLBACK_ACTIVITY_TYPE }))
  return [...DEFAULT_ACTIVITY_TYPES, ...customs]
}

export function activityConfig(type: string, available: ActivityTypeConfig[]): ActivityTypeConfig {
  return available.find((a) => a.type === type) ?? { type, label: type, ...FALLBACK_ACTIVITY_TYPE }
}

/**
 * Reconnaît un texte saisi librement s'il correspond (peu importe la casse) à un
 * type par défaut, pour éviter de créer un doublon (ex: "Footing" -> "footing").
 * Sinon retourne le texte tel quel, comme nouveau type personnalisé.
 */
export function resolveTypeInput(input: string): string {
  const trimmed = input.trim()
  const lower = trimmed.toLowerCase()
  const match = DEFAULT_ACTIVITY_TYPES.find((t) => t.type.toLowerCase() === lower || t.label.toLowerCase() === lower)
  return match ? match.type : trimmed
}
