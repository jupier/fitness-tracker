import { useMemo, useState } from 'react'
import {
  ActionIcon,
  AppShell,
  Center,
  Container,
  Group,
  Loader,
  Stack,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { IconLogout, IconMoon, IconSun } from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useSession } from './hooks/useSession'
import { useWorkouts } from './hooks/useWorkouts'
import { useWeightEntries } from './hooks/useWeightEntries'
import { AuthView } from './components/AuthView'
import { WeekGrid } from './components/WeekGrid'
import { DayLogModal } from './components/DayLogModal'
import { WeekSummary } from './components/WeekSummary'
import { StreakBanner } from './components/StreakBanner'
import { ReminderBanner } from './components/ReminderBanner'
import { WeightSection } from './components/WeightSection'
import { ActivityTrendChart } from './components/ActivityTrendChart'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { HistoryList } from './components/HistoryList'
import { deriveActivityTypes } from './lib/activityTypes'
import { startOfIsoWeek, toDateKey, weekDays } from './lib/dates'
import { computeStreak } from './lib/goals'
import { supabase } from './lib/supabase'

function AppContent({ userId }: { userId: string }) {
  const { workouts, addWorkout, updateWorkout, removeWorkout } = useWorkouts(userId)
  const { entries, addEntry, removeEntry } = useWeightEntries(userId)
  const [weekStart, setWeekStart] = useState(() => startOfIsoWeek(dayjs()))
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const activityTypes = useMemo(() => deriveActivityTypes(workouts), [workouts])
  const streak = useMemo(() => computeStreak(workouts), [workouts])

  const weekKeys = weekDays(weekStart).map(toDateKey)
  const weekWorkouts = workouts.filter((w) => weekKeys.includes(w.date))

  const currentWeekKeys = weekDays(startOfIsoWeek(dayjs())).map(toDateKey)
  const currentWeekWorkouts = workouts.filter((w) => currentWeekKeys.includes(w.date))

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Routine</Title>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => toggleColorScheme()}
              aria-label="Changer le thème"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              onClick={() => supabase.auth.signOut()}
              aria-label="Déconnexion"
            >
              <IconLogout size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="sm">
          <Stack gap="lg" py="md">
            <StreakBanner streak={streak} />
            <ReminderBanner weekWorkouts={currentWeekWorkouts} />
            <WeekGrid
              weekStart={weekStart}
              onWeekChange={setWeekStart}
              workouts={workouts}
              activityTypes={activityTypes}
              onDayClick={setSelectedDay}
            />
            <WeekSummary workouts={weekWorkouts} />
            <WeightSection entries={entries} onAdd={addEntry} />
            <ActivityTrendChart workouts={workouts} />
            <ActivityHeatmap workouts={workouts} />
            <HistoryList
              workouts={workouts}
              weightEntries={entries}
              activityTypes={activityTypes}
              onRemoveWorkout={removeWorkout}
              onRemoveWeight={removeEntry}
            />
          </Stack>
        </Container>
      </AppShell.Main>
      <DayLogModal
        date={selectedDay}
        workouts={workouts}
        activityTypes={activityTypes}
        onClose={() => setSelectedDay(null)}
        onAdd={addWorkout}
        onRemove={removeWorkout}
        onUpdate={updateWorkout}
      />
    </AppShell>
  )
}

export default function App() {
  const { session, loading } = useSession()

  if (loading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    )
  }

  if (!session) {
    return <AuthView />
  }

  return <AppContent userId={session.user.id} />
}
