import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActionIcon,
  Alert,
  AppShell,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconCalendar,
  IconChartBar,
  IconHistory,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useSession } from './hooks/useSession'
import { useWorkouts } from './hooks/useWorkouts'
import { useWeightEntries } from './hooks/useWeightEntries'
import { useMoodEntries } from './hooks/useMoodEntries'
import { AuthView } from './components/AuthView'
import { Logo } from './components/Logo'
import { WeekGrid } from './components/WeekGrid'
import { DayLogModal } from './components/DayLogModal'
import { WeekSummary } from './components/WeekSummary'
import { StreakBanner } from './components/StreakBanner'
import { BadgesPanel } from './components/BadgesPanel'
import { ReminderBanner } from './components/ReminderBanner'
import { WeightInput } from './components/WeightInput'
import { WeightChart } from './components/WeightChart'
import { MoodInput } from './components/MoodInput'
import { MoodChart } from './components/MoodChart'
import { ActivityTrendChart } from './components/ActivityTrendChart'
import { ActivityBreakdownChart } from './components/ActivityBreakdownChart'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { MoodActivityChart } from './components/MoodActivityChart'
import { HistoryList } from './components/HistoryList'
import { deriveActivityTypes } from './lib/activityTypes'
import { startOfIsoWeek, toDateKey, weekDays } from './lib/dates'
import { computeDayStreak, computeStreak, weekGoalsMet } from './lib/goals'
import { BADGES, unlockedBadgeIds } from './lib/badges'
import { fireConfetti, hasCelebratedWeek, markCelebratedWeek } from './lib/celebrate'
import { supabase } from './lib/supabase'

function AppContent({ userId }: { userId: string }) {
  const {
    workouts,
    loading: workoutsLoading,
    error: workoutsError,
    addWorkout,
    updateWorkout,
    removeWorkout,
    refresh: refreshWorkouts,
  } = useWorkouts(userId)
  const {
    entries,
    loading: weightLoading,
    error: weightError,
    addEntry,
    removeEntry,
    refresh: refreshWeight,
  } = useWeightEntries(userId)
  const {
    entries: moodEntries,
    loading: moodLoading,
    error: moodError,
    addEntry: addMoodEntry,
    updateNote: updateMoodNote,
    removeEntry: removeMoodEntry,
    refresh: refreshMood,
  } = useMoodEntries(userId)
  const dataLoaded = !workoutsLoading && !weightLoading && !moodLoading
  const hasLoadError = workoutsError || weightError || moodError
  const retryLoad = () => {
    refreshWorkouts()
    refreshWeight()
    refreshMood()
  }
  const [weekStart, setWeekStart] = useState(() => startOfIsoWeek(dayjs()))
  const [selectedDay, setSelectedDay] = useState<Dayjs | null>(null)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const activityTypes = useMemo(() => deriveActivityTypes(workouts), [workouts])
  const streak = useMemo(() => computeStreak(workouts), [workouts])
  const dayStreak = useMemo(() => computeDayStreak(workouts), [workouts])

  const weekKeys = weekDays(weekStart).map(toDateKey)
  const weekWorkouts = workouts.filter((w) => weekKeys.includes(w.date))

  const currentWeekKeys = weekDays(startOfIsoWeek(dayjs())).map(toDateKey)
  const currentWeekWorkouts = workouts.filter((w) => currentWeekKeys.includes(w.date))

  const unlockedBadges = useMemo(
    () => unlockedBadgeIds({ workouts, weightEntries: entries, moodEntries, streak, dayStreak }),
    [workouts, entries, moodEntries, streak, dayStreak],
  )
  const previousBadgesRef = useRef<Set<string> | null>(null)

  useEffect(() => {
    // Tant que les données ne sont pas encore arrivées de Supabase, `unlockedBadges`
    // reflète un état vide transitoire — l'utiliser comme référence ferait passer
    // tous les badges déjà obtenus pour "nouveaux" dès que les vraies données arrivent.
    if (!dataLoaded) return

    if (previousBadgesRef.current === null) {
      previousBadgesRef.current = unlockedBadges
      return
    }
    const newlyUnlocked = [...unlockedBadges].filter((id) => !previousBadgesRef.current!.has(id))
    if (newlyUnlocked.length > 0) {
      fireConfetti()
      for (const id of newlyUnlocked) {
        const badge = BADGES.find((b) => b.id === id)
        if (!badge) continue
        const Icon = badge.icon
        notifications.show({
          title: 'Nouveau badge débloqué !',
          message: badge.label,
          color: 'yellow',
          icon: <Icon size={18} />,
        })
      }
    }
    previousBadgesRef.current = unlockedBadges
  }, [unlockedBadges, dataLoaded])

  useEffect(() => {
    if (!dataLoaded) return
    const thisWeekStart = startOfIsoWeek(dayjs())
    const weekKey = toDateKey(thisWeekStart)
    const keys = weekDays(thisWeekStart).map(toDateKey)
    const thisWeekWorkouts = workouts.filter((w) => keys.includes(w.date))
    if (weekGoalsMet(thisWeekWorkouts) && !hasCelebratedWeek(weekKey)) {
      markCelebratedWeek(weekKey)
      fireConfetti()
      notifications.show({
        title: 'Objectifs de la semaine atteints !',
        message: 'Bravo, continue comme ça 💪',
        color: 'green',
      })
    }
  }, [workouts, dataLoaded])

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap={8}>
            <Logo size={26} />
            <Title order={3}>Routine</Title>
          </Group>
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
          {hasLoadError && (
            <Alert color="red" icon={<IconAlertTriangle size={16} />} title="Certaines données n'ont pas pu charger" mb="md">
              <Group justify="space-between" wrap="nowrap">
                <Text size="sm">Vérifie ta connexion et réessaie.</Text>
                <Button size="xs" color="red" variant="light" onClick={retryLoad}>
                  Réessayer
                </Button>
              </Group>
            </Alert>
          )}
          <Tabs defaultValue="calendrier" keepMounted={false}>
            <Tabs.List grow>
              <Tabs.Tab value="calendrier" leftSection={<IconCalendar size={16} />}>
                Calendrier
              </Tabs.Tab>
              <Tabs.Tab value="analyse" leftSection={<IconChartBar size={16} />}>
                Analyse
              </Tabs.Tab>
              <Tabs.Tab value="historique" leftSection={<IconHistory size={16} />}>
                Historique
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="calendrier">
              <Stack gap="lg" py="md">
                <Divider label="Progression" labelPosition="left" />
                <StreakBanner streak={streak} dayStreak={dayStreak} />
                <BadgesPanel unlocked={unlockedBadges} />

                <Divider label="Cette semaine" labelPosition="left" />
                <ReminderBanner weekWorkouts={currentWeekWorkouts} />
                <WeekGrid
                  weekStart={weekStart}
                  onWeekChange={setWeekStart}
                  workouts={workouts}
                  moodEntries={moodEntries}
                  activityTypes={activityTypes}
                  onDayClick={setSelectedDay}
                />
                <WeekSummary workouts={weekWorkouts} />

                <Divider label="Poids & humeur" labelPosition="left" />
                <WeightInput onAdd={addEntry} />
                <MoodInput entries={moodEntries} onAdd={addMoodEntry} onUpdateNote={updateMoodNote} />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="analyse">
              <Stack gap="lg" py="md">
                <Divider label="Poids & humeur" labelPosition="left" />
                <WeightChart entries={entries} />
                <MoodChart entries={moodEntries} />

                <Divider label="Activité" labelPosition="left" />
                <ActivityTrendChart workouts={workouts} />
                <ActivityBreakdownChart workouts={workouts} activityTypes={activityTypes} />
                <ActivityHeatmap workouts={workouts} />

                <Divider label="Corrélations" labelPosition="left" />
                <MoodActivityChart workouts={workouts} moodEntries={moodEntries} />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="historique">
              <Stack gap="lg" py="md">
                <HistoryList
                  workouts={workouts}
                  weightEntries={entries}
                  moodEntries={moodEntries}
                  activityTypes={activityTypes}
                  onRemoveWorkout={removeWorkout}
                  onRemoveWeight={removeEntry}
                  onRemoveMood={removeMoodEntry}
                />
              </Stack>
            </Tabs.Panel>
          </Tabs>
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
