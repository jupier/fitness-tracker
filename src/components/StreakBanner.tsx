import { Group, Paper, Text, ThemeIcon } from '@mantine/core'
import { IconFlame } from '@tabler/icons-react'

interface StreakBannerProps {
  streak: number
}

export function StreakBanner({ streak }: StreakBannerProps) {
  if (streak <= 0) {
    return (
      <Paper withBorder radius="md" p="sm">
        <Text size="sm" c="dimmed">
          Atteins tes objectifs cette semaine pour démarrer une série 🔥
        </Text>
      </Paper>
    )
  }

  return (
    <Paper withBorder radius="md" p="sm" bg="var(--mantine-color-orange-light)">
      <Group gap="sm">
        <ThemeIcon color="orange" variant="light" size="lg" radius="xl">
          <IconFlame size={20} />
        </ThemeIcon>
        <Text fw={600}>
          {streak} semaine{streak > 1 ? 's' : ''} d'affilée avec tous les objectifs atteints
        </Text>
      </Group>
    </Paper>
  )
}
