import { useEffect } from 'react'

interface StravaEmbedProps {
  activityId: string
  token: string
}

/**
 * Le widget Strava fonctionne via un <div> placeholder que leur script
 * (chargé dynamiquement ci-dessous) transforme en iframe après coup. Le HTML
 * est posé une fois via dangerouslySetInnerHTML pour que React ne tente
 * jamais de re-differ ce sous-arbre une fois que le script l'a modifié.
 */
export function StravaEmbed({ activityId, token }: StravaEmbedProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://strava-embeds.com/embed.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [activityId, token])

  const html = `<div class="strava-embed-placeholder" data-embed-type="activity" data-embed-id="${activityId}" data-style="standard" data-from-embed="false" data-token="${token}"></div>`

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
