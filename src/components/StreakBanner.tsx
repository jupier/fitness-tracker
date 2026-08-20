import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconFlame, IconTrophy } from '@tabler/icons-react'

interface StreakBannerProps {
  streak: number
  dayStreak: number
}

export function StreakBanner({ streak, dayStreak }: StreakBannerProps) {
  return (
    <Group grow gap="sm" align="stretch">
      <Paper withBorder radius="md" p="sm" bg={dayStreak > 0 ? 'var(--mantine-color-orange-light)' : undefined}>
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon color="orange" variant="light" size="lg" radius="xl">
            <IconFlame size={20} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={700} size="lg" lh={1.1}>
              {dayStreak}
            </Text>
            <Text size="xs" c="dimmed">
              jour{dayStreak > 1 ? 's' : ''} d'affilée
            </Text>
          </Stack>
        </Group>
      </Paper>
      <Paper withBorder radius="md" p="sm" bg={streak > 0 ? 'var(--mantine-color-yellow-light)' : undefined}>
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon color="yellow" variant="light" size="lg" radius="xl">
            <IconTrophy size={20} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={700} size="lg" lh={1.1}>
              {streak}
            </Text>
            <Text size="xs" c="dimmed">
              semaine{streak > 1 ? 's' : ''} d'objectifs
            </Text>
          </Stack>
        </Group>
      </Paper>
    </Group>
  )
}
