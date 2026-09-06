import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Divider, Group, Paper, Stack, Text, UnstyledButton } from '@mantine/core'
import { IconChevronRight, IconWeight } from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { DAY_LABELS, isToday, startOfIsoWeek, toDateKey, weekDays, weekLabel } from '../lib/dates'
import { activityConfig } from '../lib/activityTypes'
import { moodLevel } from '../lib/mood'
import type { ActivityTypeConfig } from '../constants'
import type { MoodEntry, WeightEntry, Workout } from '../types'

interface WeekGridProps {
  workouts: Workout[]
  weightEntries: WeightEntry[]
  moodEntries: MoodEntry[]
  activityTypes: ActivityTypeConfig[]
  selectedDate: string
  onDayClick: (date: Dayjs) => void
}

function earliestDateKey(...lists: { date: string }[][]): string | null {
  let min: string | null = null
  for (const list of lists) {
    for (const item of list) {
      if (min === null || item.date < min) min = item.date
    }
  }
  return min
}

export function WeekGrid({
  workouts,
  weightEntries,
  moodEntries,
  activityTypes,
  selectedDate,
  onDayClick,
}: WeekGridProps) {
  const byDate = new Map<string, Workout[]>()
  for (const w of workouts) {
    const list = byDate.get(w.date) ?? []
    list.push(w)
    byDate.set(w.date, list)
  }
  const moodByDate = new Map(moodEntries.map((m) => [m.date, m]))
  const weightByDate = new Map(weightEntries.map((w) => [w.date, w]))

  const currentWeekStart = useMemo(() => startOfIsoWeek(dayjs()), [])
  const lastWeekStart = useMemo(() => currentWeekStart.subtract(1, 'week'), [currentWeekStart])

  const earliestKey = useMemo(
    () => earliestDateKey(workouts, weightEntries, moodEntries),
    [workouts, weightEntries, moodEntries],
  )
  const maxWeeksShown = useMemo(() => {
    if (!earliestKey) return 1
    const earliestWeekStart = startOfIsoWeek(dayjs(earliestKey))
    return Math.max(1, currentWeekStart.diff(earliestWeekStart, 'week') + 1)
  }, [earliestKey, currentWeekStart])

  const [weeksShown, setWeeksShown] = useState(1)
  const reachedEnd = weeksShown >= maxWeeksShown
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reachedEnd) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (observerEntries) => {
        if (observerEntries[0].isIntersecting) {
          setWeeksShown((w) => Math.min(w + 1, maxWeeksShown))
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reachedEnd, maxWeeksShown])

  const weekStarts = Array.from({ length: weeksShown }, (_, idx) => currentWeekStart.subtract(idx, 'week'))

  return (
    <Stack gap="lg">
      {weekStarts.map((start) => {
        const label = start.isSame(currentWeekStart, 'day')
          ? 'Cette semaine'
          : start.isSame(lastWeekStart, 'day')
            ? 'Semaine dernière'
            : weekLabel(start)
        const days = weekDays(start).map((day, i) => ({ day, i }))
        return (
          <Stack key={toDateKey(start)} gap={6}>
            <Divider label={label} labelPosition="center" />
            {[...days].reverse().map(({ day, i }) => {
              const key = toDateKey(day)
              const dayEntries = byDate.get(key) ?? []
              const mood = moodByDate.get(key)
              const weight = weightByDate.get(key)
              const today = isToday(day)
              const selected = key === selectedDate
              const future = day.isAfter(dayjs(), 'day')
              return (
                <UnstyledButton
                  key={key}
                  onClick={() => onDayClick(day)}
                  disabled={future}
                  style={{ opacity: future ? 0.5 : 1 }}
                >
                  <Paper
                    withBorder
                    radius="md"
                    p="xs"
                    className={future ? undefined : 'day-row'}
                    bg={today ? 'var(--mantine-color-blue-light)' : undefined}
                    style={{
                      borderColor: selected
                        ? 'var(--mantine-color-violet-filled)'
                        : today
                          ? 'var(--mantine-color-blue-outline)'
                          : undefined,
                      borderWidth: selected ? 2 : undefined,
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap" gap="xs">
                      <Stack gap={0} align="center" style={{ flexShrink: 0, width: 34 }}>
                        <Text size="xs" c="dimmed" tt="uppercase">
                          {DAY_LABELS[i]}
                        </Text>
                        <Text size="md" fw={today ? 700 : 500}>
                          {day.format('D')}
                        </Text>
                      </Stack>

                      <Group gap={4} wrap="wrap" style={{ flex: 1 }}>
                        {dayEntries.length === 0 && !future && (
                          <Text size="xs" c="dimmed">
                            Rien de loggé
                          </Text>
                        )}
                        {dayEntries.map((e) => {
                          const cfg = activityConfig(e.type, activityTypes)
                          const Icon = cfg.icon
                          const detail = e.duration_minutes
                            ? `${e.duration_minutes}min`
                            : e.distance_km
                              ? `${e.distance_km}km`
                              : null
                          return (
                            <Badge
                              key={e.id}
                              variant="light"
                              color={cfg.color}
                              size="sm"
                              leftSection={<Icon size={11} />}
                            >
                              {cfg.label}
                              {detail ? ` · ${detail}` : ''}
                            </Badge>
                          )
                        })}
                      </Group>

                      <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
                        {weight && (
                          <Group gap={2} wrap="nowrap">
                            <IconWeight size={12} style={{ color: 'var(--mantine-color-dimmed)' }} />
                            <Text size="xs" c="dimmed">
                              {weight.weight}kg
                            </Text>
                          </Group>
                        )}
                        {mood && <span style={{ fontSize: 15, lineHeight: 1 }}>{moodLevel(mood.mood).emoji}</span>}
                        <IconChevronRight size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                      </Group>
                    </Group>
                  </Paper>
                </UnstyledButton>
              )
            })}
          </Stack>
        )
      })}

      {reachedEnd ? (
        <Text size="xs" c="dimmed" ta="center" py="sm">
          Début de ton historique
        </Text>
      ) : (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </Stack>
  )
}
