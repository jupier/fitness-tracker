import { Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { buildHeatmap, intensityLevel } from '../lib/heatmap'
import type { Workout } from '../types'

const SHADE_VARS = [
  'var(--mantine-color-gray-2)',
  'var(--mantine-color-blue-3)',
  'var(--mantine-color-blue-5)',
  'var(--mantine-color-blue-7)',
]

interface ActivityHeatmapProps {
  workouts: Workout[]
}

export function ActivityHeatmap({ workouts }: ActivityHeatmapProps) {
  const weeks = buildHeatmap(workouts, 12)

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Title order={4}>Vue d'ensemble</Title>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <Group gap={3} wrap="nowrap" align="flex-start">
            {weeks.map((week) => (
              <Stack key={week.days[0].date} gap={3}>
                {week.days.map((day) =>
                  day.inRange ? (
                    <Tooltip
                      key={day.date}
                      label={`${dayjs(day.date).format('D MMM YYYY')} — ${day.count} activité${day.count > 1 ? 's' : ''}`}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: SHADE_VARS[intensityLevel(day.count)],
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <div key={day.date} style={{ width: 12, height: 12 }} />
                  ),
                )}
              </Stack>
            ))}
          </Group>
        </div>
        <Group gap={6}>
          <Text size="xs" c="dimmed">
            Moins
          </Text>
          {SHADE_VARS.map((v) => (
            <div key={v} style={{ width: 12, height: 12, borderRadius: 3, background: v }} />
          ))}
          <Text size="xs" c="dimmed">
            Plus
          </Text>
        </Group>
      </Stack>
    </Paper>
  )
}
