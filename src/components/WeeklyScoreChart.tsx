import { Paper, Stack, Text, Title } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import dayjs from 'dayjs'
import { startOfIsoWeek, toDateKey, weekDays } from '../lib/dates'
import { weekScore } from '../lib/insights'
import type { MoodEntry, Workout } from '../types'

interface WeeklyScoreChartProps {
  workouts: Workout[]
  moodEntries: MoodEntry[]
  weeks?: number
}

export function WeeklyScoreChart({ workouts, moodEntries, weeks = 10 }: WeeklyScoreChartProps) {
  const currentWeekStart = startOfIsoWeek(dayjs())
  const weekStarts = Array.from({ length: weeks }, (_, i) =>
    currentWeekStart.subtract(weeks - 1 - i, 'week'),
  )

  const data = weekStarts.map((start) => {
    const keys = weekDays(start).map(toDateKey)
    const weekWorkouts = workouts.filter((w) => keys.includes(w.date))
    const weekMood = moodEntries.filter((m) => keys.includes(m.date))
    const { total } = weekScore(weekWorkouts, weekMood)
    return { week: start.format('D MMM'), score: total }
  })

  const hasData = workouts.length > 0 || moodEntries.length > 0

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Score hebdomadaire</Title>
        {hasData ? (
          <BarChart
            h={220}
            data={data}
            dataKey="week"
            series={[{ name: 'score', color: 'violet.6', label: 'Score / 100' }]}
            yAxisProps={{ domain: [0, 100] }}
            referenceLines={[{ y: 80, label: 'Bonne semaine', color: 'gray.5' }]}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Log tes séances et ton humeur pour voir ton score évoluer.
          </Text>
        )}
        <Text size="xs" c="dimmed">
          40 pts objectif sport, 40 pts objectif chien, 20 pts humeur moyenne de la semaine.
        </Text>
      </Stack>
    </Paper>
  )
}
