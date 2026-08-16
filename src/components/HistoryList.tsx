import { ActionIcon, Badge, Group, Paper, Rating, Stack, Text } from '@mantine/core'
import { IconBrandStrava, IconTrash, IconWeight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { activityConfig } from '../lib/activityTypes'
import { confirmDelete } from '../lib/confirm'
import { moodLevel } from '../lib/mood'
import type { ActivityTypeConfig } from '../constants'
import type { MoodEntry, WeightEntry, Workout } from '../types'

interface HistoryListProps {
  workouts: Workout[]
  weightEntries: WeightEntry[]
  moodEntries: MoodEntry[]
  activityTypes: ActivityTypeConfig[]
  onRemoveWorkout: (id: string) => void
  onRemoveWeight: (id: string) => void
  onRemoveMood: (id: string) => void
  limit?: number
}

export function HistoryList({
  workouts,
  weightEntries,
  moodEntries,
  activityTypes,
  onRemoveWorkout,
  onRemoveWeight,
  onRemoveMood,
  limit = 10,
}: HistoryListProps) {
  const items: (
    | { kind: 'workout'; data: Workout }
    | { kind: 'weight'; data: WeightEntry }
    | { kind: 'mood'; data: MoodEntry }
  )[] = [
    ...workouts.map((w) => ({ kind: 'workout' as const, data: w })),
    ...weightEntries.map((w) => ({ kind: 'weight' as const, data: w })),
    ...moodEntries.map((m) => ({ kind: 'mood' as const, data: m })),
  ]

  items.sort((a, b) => {
    const dateCompare = b.data.date.localeCompare(a.data.date)
    if (dateCompare !== 0) return dateCompare
    return b.data.created_at.localeCompare(a.data.created_at)
  })

  const visible = items.slice(0, limit)

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        {visible.length === 0 && (
          <Text size="sm" c="dimmed">
            Rien pour l'instant.
          </Text>
        )}
        {visible.map((item) => {
          if (item.kind === 'workout') {
            const cfg = activityConfig(item.data.type, activityTypes)
            const Icon = cfg.icon
            return (
              <Group key={`w-${item.data.id}`} justify="space-between" wrap="nowrap">
                <Group gap={8} wrap="wrap">
                  <Icon size={16} />
                  <Text size="sm">{cfg.label}</Text>
                  <Text size="xs" c="dimmed">
                    {dayjs(item.data.date).format('D MMM')}
                  </Text>
                  {item.data.duration_minutes != null && (
                    <Badge size="xs" variant="light" color="gray">
                      {item.data.duration_minutes} min
                    </Badge>
                  )}
                  {item.data.distance_km != null && (
                    <Badge size="xs" variant="light" color="gray">
                      {item.data.distance_km} km
                    </Badge>
                  )}
                  {item.data.rating != null && <Rating value={item.data.rating} size="xs" readOnly />}
                  {item.data.strava_embed_id && (
                    <ActionIcon
                      component="a"
                      href={`https://www.strava.com/activities/${item.data.strava_embed_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      color="orange"
                      size="xs"
                      aria-label="Voir sur Strava"
                    >
                      <IconBrandStrava size={12} />
                    </ActionIcon>
                  )}
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() =>
                    confirmDelete(
                      `Supprimer "${cfg.label}" du ${dayjs(item.data.date).format('D MMM')} ?`,
                      () => onRemoveWorkout(item.data.id),
                    )
                  }
                  aria-label="Supprimer"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            )
          }
          if (item.kind === 'weight') {
            return (
              <Group key={`e-${item.data.id}`} justify="space-between">
                <Group gap={8}>
                  <IconWeight size={16} />
                  <Text size="sm">{item.data.weight} kg</Text>
                  <Text size="xs" c="dimmed">
                    {dayjs(item.data.date).format('D MMM')}
                  </Text>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() =>
                    confirmDelete(
                      `Supprimer la pesée de ${item.data.weight} kg du ${dayjs(item.data.date).format('D MMM')} ?`,
                      () => onRemoveWeight(item.data.id),
                    )
                  }
                  aria-label="Supprimer"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            )
          }
          const level = moodLevel(item.data.mood)
          return (
            <Group key={`m-${item.data.id}`} justify="space-between" wrap="nowrap">
              <Group gap={8} wrap="wrap">
                <Text size="sm">{level.emoji}</Text>
                <Text size="sm">{level.label}</Text>
                <Text size="xs" c="dimmed">
                  {dayjs(item.data.date).format('D MMM')}
                </Text>
                {item.data.note && (
                  <Text size="xs" c="dimmed" fs="italic">
                    "{item.data.note}"
                  </Text>
                )}
              </Group>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() =>
                  confirmDelete(`Supprimer l'humeur du ${dayjs(item.data.date).format('D MMM')} ?`, () =>
                    onRemoveMood(item.data.id),
                  )
                }
                aria-label="Supprimer"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          )
        })}
      </Stack>
    </Paper>
  )
}
