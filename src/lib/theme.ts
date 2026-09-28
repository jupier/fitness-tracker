import type { MantineColor, MantineColorsTuple } from '@mantine/core'

export interface ThemeOption {
  id: string
  label: string
  description: string
  primaryColor: MantineColor
  swatch: string
  // Palettes custom (10 nuances) enregistrées dans le thème Mantine pour ce
  // choix — permet une vraie couleur de marque plutôt qu'une des 13 couleurs
  // Mantine par défaut, et éventuellement un fond sombre repeint (clé "dark").
  customColors?: Record<string, MantineColorsTuple>
  // Pour un thème clair repeint : remplace le blanc de base (fond de page et
  // des cartes en mode clair) par une teinte de marque plutôt que du blanc pur.
  white?: string
  // Dégradé CSS appliqué au fond de la page (derrière le header/footer qui
  // restent unis, visible dans les marges et entre les cartes) — pour les
  // thèmes "fantaisie" plutôt qu'un simple aplat de couleur.
  bodyGradient?: string
  // Certains thèmes sont pensés pour un seul mode (typiquement sombre ou clair) —
  // sélectionner le thème bascule alors automatiquement dessus.
  forceColorScheme?: 'light' | 'dark'
}

// Chaque thème peut changer la couleur d'accent de l'interface (nav active,
// "aujourd'hui" dans le calendrier, logo, boutons...) et, pour les thèmes de
// marque, le fond de l'appli en mode sombre — mais jamais les couleurs des
// types d'activité ni des graphiques, qui restent catégorielles/fixes pour
// rester lisibles quel que soit le thème choisi.
export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    label: 'Bleu classique',
    description: "Le thème par défaut de l'app.",
    primaryColor: 'blue',
    swatch: '#228be6',
  },
  {
    id: 'strava',
    label: 'Strava',
    description: 'Orange vif sur fond sombre chaleureux, façon appli de sport.',
    primaryColor: 'strava',
    swatch: '#fc4c02',
    forceColorScheme: 'dark',
    customColors: {
      strava: [
        '#fff1e8',
        '#ffe0cc',
        '#ffc19c',
        '#ffa06a',
        '#ff8341',
        '#ff6a1f',
        '#fc4c02',
        '#e04400',
        '#c23a00',
        '#a03000',
      ],
      dark: [
        '#e8e4de',
        '#cdc7bd',
        '#b3aca0',
        '#8f877a',
        '#6b6459',
        '#4f483f',
        '#3a352e',
        '#2a2620',
        '#1c1915',
        '#121009',
      ],
    },
  },
  {
    id: 'spotify',
    label: 'Spotify',
    description: 'Vert éclatant sur noir profond, minimal et net.',
    primaryColor: 'spotify',
    swatch: '#1db954',
    forceColorScheme: 'dark',
    customColors: {
      spotify: [
        '#e3fcec',
        '#b8f5cf',
        '#8aedb0',
        '#5ce491',
        '#35dd79',
        '#1ed867',
        '#1db954',
        '#17a34a',
        '#0f8f3d',
        '#077530',
      ],
      dark: [
        '#ffffff',
        '#d9d9d9',
        '#b3b3b3',
        '#8c8c8c',
        '#666666',
        '#404040',
        '#282828',
        '#181818',
        '#121212',
        '#0a0a0a',
      ],
    },
  },
  {
    id: 'duolingo',
    label: 'Duolingo',
    description: 'Vert pomme joueur sur fond crème — le plus lumineux du lot.',
    primaryColor: 'duolingo',
    swatch: '#58cc02',
    forceColorScheme: 'light',
    white: '#fff8ec',
    customColors: {
      duolingo: [
        '#f2fce0',
        '#e0f7b8',
        '#c8ef8a',
        '#ade65c',
        '#98df38',
        '#83d81a',
        '#58cc02',
        '#4bb200',
        '#3e9700',
        '#317d00',
      ],
    },
  },
  {
    id: 'twitch',
    label: 'Twitch',
    description: 'Violet vif sur fond sombre teinté aubergine.',
    primaryColor: 'twitch',
    swatch: '#9146ff',
    forceColorScheme: 'dark',
    customColors: {
      twitch: [
        '#f6f0ff',
        '#e6d6ff',
        '#d0b3ff',
        '#b98fff',
        '#a570ff',
        '#9a5aff',
        '#9146ff',
        '#7c37e0',
        '#672dbd',
        '#52239a',
      ],
      dark: [
        '#e9e6ec',
        '#cdc7d6',
        '#b2a9bf',
        '#8d8299',
        '#695f76',
        '#4c4356',
        '#383040',
        '#232028',
        '#18161c',
        '#0e0d10',
      ],
    },
  },
  {
    id: 'aurore',
    label: 'Aurore',
    description: 'Dégradé pastel rose → lavande → menthe, tout en douceur.',
    primaryColor: 'aurore',
    swatch: '#ff1f82',
    forceColorScheme: 'light',
    bodyGradient: 'linear-gradient(160deg, #ffe3f1 0%, #f1e6ff 45%, #e0f7ef 100%)',
    customColors: {
      aurore: [
        '#ffe9f3',
        '#ffc7e2',
        '#ff9fcc',
        '#ff72b3',
        '#ff4a9c',
        '#ff2d8c',
        '#ff1f82',
        '#e01570',
        '#c00c5e',
        '#99044a',
      ],
    },
  },
  {
    id: 'neon',
    label: 'Néon',
    description: 'Cyan électrique sur dégradé violet nuit, esprit synthwave.',
    primaryColor: 'neon',
    swatch: '#00c2ff',
    forceColorScheme: 'dark',
    bodyGradient: 'linear-gradient(160deg, #1a0b2e 0%, #5b0e8f 45%, #0d0221 100%)',
    customColors: {
      neon: [
        '#e2fdff',
        '#b3f7ff',
        '#80f0ff',
        '#4de9ff',
        '#26e3ff',
        '#00d9ff',
        '#00c2ff',
        '#009fd1',
        '#007ca3',
        '#005875',
      ],
      dark: [
        '#ece6fb',
        '#cfc0f0',
        '#ab94e3',
        '#8768d6',
        '#6a4bc4',
        '#4f36a0',
        '#3a2678',
        '#241454',
        '#170a38',
        '#0b0420',
      ],
    },
  },
  {
    id: 'foret',
    label: 'Forêt enchantée',
    description: 'Or magique sur dégradé de verts profonds, esprit sous-bois.',
    primaryColor: 'foret',
    swatch: '#f5a623',
    forceColorScheme: 'dark',
    bodyGradient: 'linear-gradient(160deg, #062318 0%, #0b3d2e 45%, #1a5c3a 100%)',
    customColors: {
      foret: [
        '#fff8e1',
        '#ffecb3',
        '#ffe082',
        '#ffd54f',
        '#ffca28',
        '#ffc107',
        '#f5a623',
        '#d4880f',
        '#b06d08',
        '#8a5405',
      ],
      dark: [
        '#e6efe9',
        '#c7dccd',
        '#a3c4ab',
        '#7fa98a',
        '#5e8a6d',
        '#446b52',
        '#2f4f3b',
        '#1c3527',
        '#102019',
        '#08120d',
      ],
    },
  },
  {
    id: 'galaxie',
    label: 'Galaxie',
    description: 'Nébuleuse magenta sur fond spatial, du vide à la lumière.',
    primaryColor: 'galaxie',
    swatch: '#d117c4',
    forceColorScheme: 'dark',
    bodyGradient: 'linear-gradient(160deg, #05010f 0%, #240b4f 45%, #6a1b8f 100%)',
    customColors: {
      galaxie: [
        '#ffeafc',
        '#ffc7f7',
        '#ff9ef0',
        '#ff72e8',
        '#f94ce0',
        '#ea2bd6',
        '#d117c4',
        '#ad0ea3',
        '#890b82',
        '#650862',
      ],
      dark: [
        '#ece8f7',
        '#ccc3e8',
        '#a99bd6',
        '#8674c2',
        '#6a55a8',
        '#503f86',
        '#392c63',
        '#241a45',
        '#150f2c',
        '#0a0716',
      ],
    },
  },
  {
    id: 'lave',
    label: 'Lave',
    description: 'Braise orange qui jaillit du noir charbon, esprit volcan.',
    primaryColor: 'lave',
    swatch: '#ff5a00',
    forceColorScheme: 'dark',
    bodyGradient: 'linear-gradient(160deg, #0d0402 0%, #5a0f02 45%, #ff5a1f 100%)',
    customColors: {
      lave: [
        '#fff4e0',
        '#ffe0b0',
        '#ffc77d',
        '#ffab4d',
        '#ff8f2e',
        '#ff7517',
        '#ff5a00',
        '#db4700',
        '#b73800',
        '#8f2a00',
      ],
      dark: [
        '#f0e6e2',
        '#d9c2b8',
        '#bf9c8d',
        '#a37665',
        '#855544',
        '#663a2c',
        '#4a2519',
        '#301609',
        '#1c0b04',
        '#0d0301',
      ],
    },
  },
]

export const DEFAULT_THEME_ID = THEME_OPTIONS[0].id

export function resolveTheme(id: string | null | undefined): ThemeOption {
  return THEME_OPTIONS.find((t) => t.id === id) ?? THEME_OPTIONS[0]
}

const COOKIE_NAME = 'routine-theme'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 an

export function readThemeCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function writeThemeCookie(id: string) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}
