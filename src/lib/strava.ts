export interface StravaEmbed {
  id: string
  token: string
}

/**
 * Extrait l'id et le token du code d'intégration collé depuis Strava
 * (un <div class="strava-embed-placeholder" data-embed-id="..." data-token="...">).
 * Les deux valeurs sont validées (charset strict) avant d'être réinjectées en HTML.
 */
export function extractStravaEmbed(input: string): StravaEmbed | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const idMatch = trimmed.match(/data-embed-id=["'](\d+)["']/)
  const tokenMatch = trimmed.match(/data-token=["']([A-Za-z0-9_-]+)["']/)
  if (!idMatch || !tokenMatch) return null

  return { id: idMatch[1], token: tokenMatch[1] }
}
