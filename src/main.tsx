import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
import '@mantine/notifications/styles.css'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import './index.css'
import App from './App.tsx'

dayjs.locale('fr')

const theme = createTheme({
  components: {
    NumberInput: {
      defaultProps: {
        // Convention française : virgule comme séparateur décimal, plutôt que
        // le point par défaut (sinon impossible de taper un nombre à virgule
        // directement au clavier, il faut passer par les boutons +/-).
        decimalSeparator: ',',
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ModalsProvider>
        <Notifications position="top-center" />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </StrictMode>,
)
