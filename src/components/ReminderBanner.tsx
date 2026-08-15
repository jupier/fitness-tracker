import { Alert } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { WEEKLY_GOALS } from '../constants'
import { weekProgress } from '../lib/goals'
import type { Workout } from '../types'

interface ReminderBannerProps {
  weekWorkouts: Workout[]
}

function isLateInWeek(): boolean {
  return [4, 5, 6, 0].includes(dayjs().day()) // jeudi -> dimanche
}

export function ReminderBanner({ weekWorkouts }: ReminderBannerProps) {
  if (!isLateInWeek()) return null

  const { sport, chien } = weekProgress(weekWorkouts)
  const missing: string[] = []
  if (sport < WEEKLY_GOALS.sport) {
    const remaining = WEEKLY_GOALS.sport - sport
    missing.push(`${remaining} séance${remaining > 1 ? 's' : ''} de sport`)
  }
  if (chien < WEEKLY_GOALS.chien) {
    const remaining = WEEKLY_GOALS.chien - chien
    missing.push(`${remaining} sortie${remaining > 1 ? 's' : ''} chien`)
  }

  if (missing.length === 0) return null

  return (
    <Alert color="yellow" icon={<IconAlertTriangle size={16} />} title="Il te reste cette semaine">
      {missing.join(' · ')}
    </Alert>
  )
}
