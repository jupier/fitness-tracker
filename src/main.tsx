import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/notifications/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import './index.css'
import { ThemeProvider } from './components/ThemeProvider.tsx'
import App from './App.tsx'

dayjs.locale('fr')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ModalsProvider>
        <Notifications position="top-center" />
        <App />
      </ModalsProvider>
    </ThemeProvider>
  </StrictMode>,
)
