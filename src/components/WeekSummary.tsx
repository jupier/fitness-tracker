import { Group, Paper, Progress, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconCheck, IconDog, IconRun } from '@tabler/icons-react'
import { WEEKLY_GOALS } from '../constants'
import { weekProgress } from '../lib/goals'
import type { Workout } from '../types'

interface WeekSummaryProps {
  workouts: Workout[]
}

const TILES = [
  { key: 'sport' as const, label: 'Sport', icon: IconRun, color: 'blue', goal: WEEKLY_GOALS.sport },
  { key: 'chien' as const, label: 'Chien', icon: IconDog, color: 'teal', goal: WEEKLY_GOALS.chien },
]

export function WeekSummary({ workouts }: WeekSummaryProps) {
  const progress = weekProgress(workouts)

  return (
    <Group grow gap="sm" align="stretch">
      {TILES.map((tile) => {
        const count = progress[tile.key]
        const done = count >= tile.goal
        const Icon = tile.icon
        return (
          <Paper key={tile.key} withBorder radius="md" p="sm">
            <Stack gap={6}>
              <Group justify="space-between" gap={4} wrap="nowrap">
                <Group gap={6}>
                  <Icon size={16} />
                  <Text size="sm" fw={500}>
                    {tile.label}
                  </Text>
                </Group>
                {done && (
                  <ThemeIcon color="green" variant="light" size="sm" radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                )}
              </Group>
              <Progress value={Math.min(100, (count / tile.goal) * 100)} color={done ? 'green' : tile.color} size="sm" />
              <Text size="xs" c="dimmed">
                {count} / {tile.goal}
              </Text>
            </Stack>
          </Paper>
        )
      })}
    </Group>
  )
}
