import { createContext, useContext } from 'react'

export interface ThemeChoiceContextValue {
  themeId: string
  setThemeId: (id: string) => void
}

export const ThemeChoiceContext = createContext<ThemeChoiceContextValue | null>(null)

export function useThemeChoice(): ThemeChoiceContextValue {
  const ctx = useContext(ThemeChoiceContext)
  if (!ctx) throw new Error('useThemeChoice must be used within ThemeProvider')
  return ctx
}
