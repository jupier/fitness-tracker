import { Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core'
import { BADGES } from '../lib/badges'

interface BadgesPanelProps {
  unlocked: Set<string>
}

export function BadgesPanel({ unlocked }: BadgesPanelProps) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Group justify="space-between">
          <Title order={4}>Badges</Title>
          <Text size="xs" c="dimmed">
            {unlocked.size} / {BADGES.length}
          </Text>
        </Group>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <Group gap="xs" wrap="nowrap">
            {BADGES.map((badge) => {
              const isUnlocked = unlocked.has(badge.id)
              const Icon = badge.icon
              return (
                <Tooltip key={badge.id} label={`${badge.label} — ${badge.description}`} multiline w={200}>
                  <Stack
                    align="center"
                    gap={4}
                    p="xs"
                    style={{
                      minWidth: 76,
                      borderRadius: 8,
                      opacity: isUnlocked ? 1 : 0.35,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isUnlocked ? 'var(--mantine-color-yellow-light)' : 'var(--mantine-color-gray-light)',
                      }}
                    >
                      <Icon size={20} color={isUnlocked ? 'var(--mantine-color-yellow-7)' : 'var(--mantine-color-gray-6)'} />
                    </div>
                    <Text size="xs" ta="center" lh={1.1}>
                      {badge.label}
                    </Text>
                  </Stack>
                </Tooltip>
              )
            })}
          </Group>
        </div>
      </Stack>
    </Paper>
  )
}
