import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { createTheme, MantineProvider } from '@mantine/core'
import { ThemeChoiceContext } from '../lib/themeContext'
import { DEFAULT_THEME_ID, readThemeCookie, resolveTheme, writeThemeCookie } from '../lib/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState(() => readThemeCookie() ?? DEFAULT_THEME_ID)

  const setThemeId = (id: string) => {
    setThemeIdState(id)
    writeThemeCookie(id)
  }

  const mantineTheme = useMemo(() => {
    const theme = resolveTheme(themeId)
    return createTheme({
      primaryColor: theme.primaryColor,
      ...(theme.customColors ? { colors: theme.customColors } : {}),
      ...(theme.white ? { white: theme.white } : {}),
    })
  }, [themeId])

  useEffect(() => {
    // Le dégradé de fond peint le <body> directement (pas géré par les tokens
    // Mantine, qui n'acceptent que des couleurs unies) : visible dans les
    // marges et entre les cartes, avec le header/footer qui restent unis
    // par-dessus.
    document.body.style.background = resolveTheme(themeId).bodyGradient ?? ''
  }, [themeId])

  return (
    <ThemeChoiceContext.Provider value={{ themeId, setThemeId }}>
      <MantineProvider theme={mantineTheme} defaultColorScheme="auto">
        {children}
      </MantineProvider>
    </ThemeChoiceContext.Provider>
  )
}
