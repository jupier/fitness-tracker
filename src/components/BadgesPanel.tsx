import { useMemo, useState } from 'react'
import { Group, Modal, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title, UnstyledButton } from '@mantine/core'
import { IconCheck, IconLock } from '@tabler/icons-react'
import { BADGE_CATEGORIES, BADGES, type BadgeConfig } from '../lib/badges'

interface BadgesPanelProps {
  unlocked: Set<string>
}

function BadgeIcon({ badge, unlocked, size }: { badge: BadgeConfig; unlocked: boolean; size: number }) {
  const Icon = badge.icon
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: unlocked ? 'var(--mantine-color-yellow-light)' : 'var(--mantine-color-gray-light)',
      }}
    >
      <Icon
        size={size * 0.5}
        color={unlocked ? 'var(--mantine-color-yellow-7)' : 'var(--mantine-color-gray-6)'}
      />
    </div>
  )
}

export function BadgesPanel({ unlocked }: BadgesPanelProps) {
  const [selected, setSelected] = useState<BadgeConfig | null>(null)

  const byCategory = useMemo(() => {
    const map = new Map<string, BadgeConfig[]>()
    for (const badge of BADGES) {
      const list = map.get(badge.category) ?? []
      list.push(badge)
      map.set(badge.category, list)
    }
    return map
  }, [])

  const selectedUnlocked = selected ? unlocked.has(selected.id) : false

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Badges</Title>
          <Text size="xs" c="dimmed">
            {unlocked.size} / {BADGES.length}
          </Text>
        </Group>
        <Stack gap="md">
          {BADGE_CATEGORIES.map((category) => {
            const badges = byCategory.get(category)
            if (!badges) return null
            return (
              <div key={category}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={6}>
                  {category}
                </Text>
                <SimpleGrid cols={{ base: 4, xs: 5, sm: 6 }} spacing="xs">
                  {badges.map((badge) => (
                    <UnstyledButton key={badge.id} onClick={() => setSelected(badge)}>
                      <Stack align="center" gap={4}>
                        <BadgeIcon badge={badge} unlocked={unlocked.has(badge.id)} size={44} />
                        <Text size="10px" ta="center" lh={1.15} lineClamp={2}>
                          {badge.label}
                        </Text>
                      </Stack>
                    </UnstyledButton>
                  ))}
                </SimpleGrid>
              </div>
            )
          })}
        </Stack>
      </Stack>

      <Modal opened={!!selected} onClose={() => setSelected(null)} title={selected?.label} centered size="xs">
        {selected && (
          <Stack align="center" gap="sm" py="sm">
            <BadgeIcon badge={selected} unlocked={selectedUnlocked} size={72} />
            <Text ta="center" c="dimmed" size="sm">
              {selected.description}
            </Text>
            {selectedUnlocked ? (
              <Group gap={6}>
                <ThemeIcon color="green" variant="light" size="sm" radius="xl">
                  <IconCheck size={12} />
                </ThemeIcon>
                <Text size="sm" fw={600} c="green">
                  Débloqué
                </Text>
              </Group>
            ) : (
              <Group gap={6}>
                <ThemeIcon color="gray" variant="light" size="sm" radius="xl">
                  <IconLock size={12} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  Pas encore débloqué
                </Text>
              </Group>
            )}
          </Stack>
        )}
      </Modal>
    </Paper>
  )
}
