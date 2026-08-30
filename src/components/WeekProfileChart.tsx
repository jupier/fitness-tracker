import { Paper, Stack, Text, Title } from '@mantine/core'
import { RadarChart } from '@mantine/charts'
import dayjs from 'dayjs'
import { startOfIsoWeek, toDateKey, weekDays } from '../lib/dates'
import { weekProfile } from '../lib/insights'
import type { MoodEntry, WeightEntry, Workout } from '../types'

interface WeekProfileChartProps {
  workouts: Workout[]
  weightEntries: WeightEntry[]
  moodEntries: MoodEntry[]
}

export function WeekProfileChart({ workouts, weightEntries, moodEntries }: WeekProfileChartProps) {
  const weekStart = startOfIsoWeek(dayjs())
  const keys = weekDays(weekStart).map(toDateKey)
  const weekWorkouts = workouts.filter((w) => keys.includes(w.date))
  const weekMood = moodEntries.filter((m) => keys.includes(m.date))
  const weekWeight = weightEntries.filter((w) => keys.includes(w.date))
  const profile = weekProfile(weekWorkouts, weekMood, weekWeight)

  const data = [
    { axis: 'Sport', value: profile.sport },
    { axis: 'Chien', value: profile.chien },
    { axis: 'Humeur', value: profile.mood },
    ...(profile.weight !== null ? [{ axis: 'Poids', value: profile.weight }] : []),
  ]

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Profil de la semaine</Title>
        <Text size="xs" c="dimmed">
          Où en est ta semaine en cours sur chaque axe (100 = objectif atteint), pour repérer d'un coup d'œil ce
          qui traîne.
        </Text>
        <RadarChart
          h={220}
          data={data}
          dataKey="axis"
          series={[{ name: 'value', color: 'violet.6', label: 'Cette semaine' }]}
          withPolarRadiusAxis
        />
      </Stack>
    </Paper>
  )
}
