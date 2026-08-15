import { BarsList } from '@mantine/charts'
import { Paper, Stack, Text, Title } from '@mantine/core'
import { activityBreakdown } from '../lib/insights'
import type { ActivityTypeConfig } from '../constants'
import type { Workout } from '../types'

interface ActivityBreakdownChartProps {
  workouts: Workout[]
  activityTypes: ActivityTypeConfig[]
}

export function ActivityBreakdownChart({ workouts, activityTypes }: ActivityBreakdownChartProps) {
  const breakdown = activityBreakdown(workouts, activityTypes)

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Répartition des activités</Title>
        {breakdown.length > 0 ? (
          <BarsList
            data={breakdown.map((item) => ({ name: item.label, value: item.count, color: item.color }))}
            valueFormatter={(v) => `${v}`}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Log ta première activité pour voir la répartition.
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
