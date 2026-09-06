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
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendar,
  IconChartBar,
  IconHistory,
  IconLogout,
  IconMoon,
  IconSun,
  IconTrophy,
} from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { useSession } from './hooks/useSession'
import { useWorkouts } from './hooks/useWorkouts'
import { useWeightEntries } from './hooks/useWeightEntries'
import { useMoodEntries } from './hooks/useMoodEntries'
import { AuthView } from './components/AuthView'
import { Logo } from './components/Logo'
import { WeekGrid } from './components/WeekGrid'
import { DayPanel } from './components/DayPanel'
import { WeekSummary } from './components/WeekSummary'
import { StreakBanner } from './components/StreakBanner'
import { BadgesPanel } from './components/BadgesPanel'
import { ReminderBanner } from './components/ReminderBanner'
import { WeightChart } from './components/WeightChart'
import { MoodChart } from './components/MoodChart'
import { ActivityTrendChart } from './components/ActivityTrendChart'
import { ActivityBreakdownChart } from './components/ActivityBreakdownChart'
import { ActivityHeatmap } from './components/ActivityHeatmap'
import { MoodActivityChart } from './components/MoodActivityChart'
import { WeeklyScoreChart } from './components/WeeklyScoreChart'
import { WeekProfileChart } from './components/WeekProfileChart'
import { HistoryList } from './components/HistoryList'
import { deriveActivityTypes } from './lib/activityTypes'
import { startOfIsoWeek, toDateKey, weekDays } from './lib/dates'
import { computeDayStreak, computeStreak, weekGoalsMet } from './lib/goals'
import { BADGES, unlockedBadgeIds } from './lib/badges'
import { fireConfetti, hasCelebratedWeek, markCelebratedWeek } from './lib/celebrate'
import { supabase } from './lib/supabase'

type TabValue = 'calendrier' | 'analyse' | 'badges' | 'historique'

const NAV_ITEMS: { value: TabValue; label: string; icon: typeof IconCalendar }[] = [
  { value: 'calendrier', label: 'Calendrier', icon: IconCalendar },
  { value: 'analyse', label: 'Analyse', icon: IconChartBar },
  { value: 'badges', label: 'Badges', icon: IconTrophy },
  { value: 'historique', label: 'Historique', icon: IconHistory },
]

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
  const [activeTab, setActiveTab] = useState<TabValue>('calendrier')
  const [selectedDay, setSelectedDay] = useState<Dayjs>(() => dayjs())
  const [dayDetailOpen, setDayDetailOpen] = useState(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search)

      const tab = params.get('tab')
      setActiveTab(NAV_ITEMS.some((item) => item.value === tab) ? (tab as TabValue) : 'calendrier')

      const day = params.get('day')
      if (day && /^\d{4}-\d{2}-\d{2}$/.test(day) && dayjs(day).isValid()) {
        setSelectedDay(dayjs(day))
        setDayDetailOpen(true)
      } else {
        setDayDetailOpen(false)
      }
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  const switchTab = (tab: TabValue) => {
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.pushState({}, '', url)
    setActiveTab(tab)
  }

  const openDay = (day: Dayjs) => {
    const url = new URL(window.location.href)
    url.searchParams.set('day', toDateKey(day))
    window.history.pushState({}, '', url)
    setSelectedDay(day)
    setDayDetailOpen(true)
  }

  const closeDay = () => window.history.back()

  const activityTypes = useMemo(() => deriveActivityTypes(workouts), [workouts])
  const streak = useMemo(() => computeStreak(workouts), [workouts])
  const dayStreak = useMemo(() => computeDayStreak(workouts), [workouts])

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
    <AppShell header={{ height: 56 }} footer={{ height: 64 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          {activeTab === 'calendrier' && dayDetailOpen ? (
            <Group gap={8}>
              <ActionIcon variant="subtle" onClick={closeDay} aria-label="Retour au calendrier">
                <IconArrowLeft size={18} />
              </ActionIcon>
              <Title order={3} tt="capitalize">
                {selectedDay.isSame(dayjs(), 'day') ? "Aujourd'hui" : selectedDay.format('dddd D MMMM')}
              </Title>
            </Group>
          ) : (
            <Group gap={8}>
              <Logo size={26} />
              <Title order={3}>Routine</Title>
            </Group>
          )}
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

          {activeTab === 'calendrier' && dayDetailOpen && (
            <Stack gap="lg" py="md">
              <DayPanel
                date={selectedDay}
                workouts={workouts}
                activityTypes={activityTypes}
                onAdd={addWorkout}
                onRemove={removeWorkout}
                onUpdate={updateWorkout}
                weightEntries={entries}
                onAddWeight={addEntry}
                moodEntries={moodEntries}
                onAddMood={addMoodEntry}
                onUpdateMoodNote={updateMoodNote}
              />
            </Stack>
          )}

          {activeTab === 'calendrier' && !dayDetailOpen && (
            <Stack gap="lg" py="md">
              <Divider label="Progression" labelPosition="left" />
              <StreakBanner streak={streak} dayStreak={dayStreak} />
              <WeekSummary workouts={currentWeekWorkouts} />

              <Divider label="Journal" labelPosition="left" />
              <ReminderBanner weekWorkouts={currentWeekWorkouts} />
              <WeekGrid
                workouts={workouts}
                weightEntries={entries}
                moodEntries={moodEntries}
                activityTypes={activityTypes}
                selectedDate={toDateKey(selectedDay)}
                onDayClick={openDay}
              />
            </Stack>
          )}

          {activeTab === 'analyse' && (
            <Stack gap="lg" py="md">
              <Divider label="Score & profil" labelPosition="left" />
              <WeeklyScoreChart workouts={workouts} moodEntries={moodEntries} />
              <WeekProfileChart workouts={workouts} weightEntries={entries} moodEntries={moodEntries} />

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
          )}

          {activeTab === 'badges' && (
            <Stack gap="lg" py="md">
              <BadgesPanel unlocked={unlockedBadges} />
            </Stack>
          )}

          {activeTab === 'historique' && (
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
          )}
        </Container>
      </AppShell.Main>
      <AppShell.Footer>
        <Group grow h="100%" gap={0} px="xs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.value
            return (
              <UnstyledButton
                key={item.value}
                onClick={() => switchTab(item.value)}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  color: active ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dimmed)',
                }}
              >
                <Icon size={22} />
                <Text size="11px" fw={active ? 600 : 400}>
                  {item.label}
                </Text>
              </UnstyledButton>
            )
          })}
        </Group>
      </AppShell.Footer>
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
