import { Paper, Stack, Text, Title } from '@mantine/core'
import { BarChart } from '@mantine/charts'
import dayjs from 'dayjs'
import { WEEKLY_GOALS } from '../constants'
import { startOfIsoWeek, toDateKey } from '../lib/dates'
import { weekProgress } from '../lib/goals'
import type { Workout } from '../types'

interface ActivityTrendChartProps {
  workouts: Workout[]
  weeks?: number
}

export function ActivityTrendChart({ workouts, weeks = 10 }: ActivityTrendChartProps) {
  const currentWeekStart = startOfIsoWeek(dayjs())
  const weekStarts = Array.from({ length: weeks }, (_, i) =>
    currentWeekStart.subtract(weeks - 1 - i, 'week'),
  )

  const data = weekStarts.map((start) => {
    const end = start.add(6, 'day')
    const weekWorkouts = workouts.filter((w) => w.date >= toDateKey(start) && w.date <= toDateKey(end))
    const { sport, chien } = weekProgress(weekWorkouts)
    return { week: start.format('D MMM'), sport, chien }
  })

  const hasData = workouts.length > 0

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Régularité</Title>
        {hasData ? (
          <BarChart
            h={220}
            data={data}
            dataKey="week"
            series={[
              { name: 'sport', color: 'blue.6', label: 'Sport' },
              { name: 'chien', color: 'teal.6', label: 'Chien' },
            ]}
            withLegend
            referenceLines={[{ y: WEEKLY_GOALS.sport, label: 'Objectif', color: 'gray.5' }]}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Log ta première séance pour voir apparaître la tendance.
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
