import { BarsList } from '@mantine/charts'
import { Paper, Stack, Text, Title } from '@mantine/core'
import { moodByActivity } from '../lib/insights'
import type { MoodEntry, Workout } from '../types'

interface MoodActivityChartProps {
  workouts: Workout[]
  moodEntries: MoodEntry[]
}

export function MoodActivityChart({ workouts, moodEntries }: MoodActivityChartProps) {
  const { activeAvg, activeCount, restAvg, restCount } = moodByActivity(workouts, moodEntries)
  const hasEnoughData = activeCount > 0 && restCount > 0

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Humeur vs activité</Title>
        <Text size="xs" c="dimmed">
          Compare ton humeur moyenne les jours où tu as bougé à celle des jours sans activité, pour voir si le
          sport influence ton moral.
        </Text>
        {hasEnoughData ? (
          <BarsList
            data={[
              { name: 'Jours actifs', value: Math.round((activeAvg ?? 0) * 10) / 10, color: 'indigo' },
              { name: 'Jours sans activité', value: Math.round((restAvg ?? 0) * 10) / 10, color: 'gray' },
            ]}
            valueFormatter={(v) => `${v.toFixed(1)} / 5`}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Logge des séances et des humeurs sur les mêmes jours (et sur des jours sans activité) pour voir la
            comparaison.
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
