import { ActionIcon, Group, Paper, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { DAY_LABELS, isToday, toDateKey, weekDays, weekLabel } from '../lib/dates'
import { activityConfig } from '../lib/activityTypes'
import { moodLevel } from '../lib/mood'
import type { ActivityTypeConfig } from '../constants'
import type { MoodEntry, Workout } from '../types'

interface WeekGridProps {
  weekStart: Dayjs
  onWeekChange: (start: Dayjs) => void
  workouts: Workout[]
  moodEntries: MoodEntry[]
  activityTypes: ActivityTypeConfig[]
  onDayClick: (date: Dayjs) => void
}

export function WeekGrid({ weekStart, onWeekChange, workouts, moodEntries, activityTypes, onDayClick }: WeekGridProps) {
  const days = weekDays(weekStart)
  const byDate = new Map<string, Workout[]>()
  for (const w of workouts) {
    const list = byDate.get(w.date) ?? []
    list.push(w)
    byDate.set(w.date, list)
  }
  const moodByDate = new Map(moodEntries.map((m) => [m.date, m]))

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <ActionIcon
          variant="subtle"
          onClick={() => onWeekChange(weekStart.subtract(1, 'week'))}
          aria-label="Semaine précédente"
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text fw={600}>{weekLabel(weekStart)}</Text>
        <ActionIcon
          variant="subtle"
          onClick={() => onWeekChange(weekStart.add(1, 'week'))}
          aria-label="Semaine suivante"
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>
      <SimpleGrid cols={7} spacing="xs">
        {days.map((day, i) => {
          const key = toDateKey(day)
          const entries = byDate.get(key) ?? []
          const mood = moodByDate.get(key)
          const today = isToday(day)
          const future = day.isAfter(dayjs(), 'day')
          return (
            <UnstyledButton key={key} onClick={() => onDayClick(day)} style={{ opacity: future ? 0.5 : 1 }}>
              <Paper
                withBorder
                radius="md"
                p={6}
                pos="relative"
                bg={today ? 'var(--mantine-color-blue-light)' : undefined}
                style={today ? { borderColor: 'var(--mantine-color-blue-outline)' } : undefined}
              >
                {mood && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: `light-dark(${moodLevel(mood.mood).colorLight}, ${moodLevel(mood.mood).colorDark})`,
                    }}
                  />
                )}
                <Stack gap={4} align="center">
                  <Text size="xs" c="dimmed">
                    {DAY_LABELS[i]}
                  </Text>
                  <Text size="sm" fw={today ? 700 : 500}>
                    {day.format('D')}
                  </Text>
                  <Group gap={2} justify="center" wrap="wrap" mih={18}>
                    {entries.map((e) => {
                      const cfg = activityConfig(e.type, activityTypes)
                      const Icon = cfg.icon
                      return (
                        <Icon
                          key={e.id}
                          size={14}
                          color={`var(--mantine-color-${cfg.color}-6)`}
                          className="activity-pop"
                        />
                      )
                    })}
                  </Group>
                </Stack>
              </Paper>
            </UnstyledButton>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
