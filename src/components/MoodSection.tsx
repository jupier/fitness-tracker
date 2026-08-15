import { useState } from 'react'
import { Button, Collapse, Group, Paper, Stack, Text, Textarea, Title, UnstyledButton } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import dayjs from 'dayjs'
import { MOOD_LEVELS } from '../lib/mood'
import type { MoodEntry } from '../types'

interface MoodSectionProps {
  entries: MoodEntry[]
  onAdd: (mood: number, date: string) => void
  onUpdateNote: (id: string, note: string | null) => void
}

export function MoodSection({ entries, onAdd, onUpdateNote }: MoodSectionProps) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [noteValue, setNoteValue] = useState('')

  const today = dayjs().format('YYYY-MM-DD')
  const todayEntry = entries.find((e) => e.date === today)

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const chartData = sorted.map((e) => ({ date: dayjs(e.date).format('D MMM'), humeur: e.mood }))

  const pick = (mood: number) => {
    onAdd(mood, today)
  }

  const openNote = () => {
    setNoteValue(todayEntry?.note ?? '')
    setNoteOpen(true)
  }

  const saveNote = () => {
    if (!todayEntry) return
    onUpdateNote(todayEntry.id, noteValue.trim() === '' ? null : noteValue.trim())
    setNoteOpen(false)
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Humeur</Title>
        <Group justify="center" gap="xs">
          {MOOD_LEVELS.map((level) => {
            const selected = todayEntry?.mood === level.value
            return (
              <UnstyledButton
                key={level.value}
                onClick={() => pick(level.value)}
                aria-label={level.label}
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  padding: 8,
                  borderRadius: 12,
                  border: selected ? `2px solid ${level.colorLight}` : '2px solid transparent',
                  background: selected ? 'var(--mantine-color-default-hover)' : undefined,
                  transform: selected ? 'scale(1.1)' : undefined,
                  transition: 'transform 0.15s ease',
                }}
              >
                {level.emoji}
              </UnstyledButton>
            )
          })}
        </Group>
        {todayEntry && (
          <Stack gap={4} align="center">
            {!noteOpen && (
              <Button variant="subtle" size="xs" onClick={openNote}>
                {todayEntry.note ? 'Modifier la note' : 'Ajouter une note'}
              </Button>
            )}
            <Collapse expanded={noteOpen} style={{ width: '100%' }}>
              <Stack gap="xs">
                <Textarea
                  placeholder="Pourquoi cette humeur ?"
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.currentTarget.value)}
                  autosize
                  minRows={2}
                />
                <Button size="xs" onClick={saveNote} style={{ alignSelf: 'flex-start' }}>
                  Enregistrer
                </Button>
              </Stack>
            </Collapse>
          </Stack>
        )}
        {chartData.length > 1 ? (
          <LineChart
            h={200}
            data={chartData}
            dataKey="date"
            series={[{ name: 'humeur', color: 'indigo.6', label: 'Humeur' }]}
            yAxisProps={{ domain: [1, 5], ticks: [1, 2, 3, 4, 5] }}
            curveType="linear"
            withDots
          />
        ) : (
          <Text size="sm" c="dimmed">
            Ajoute au moins deux humeurs pour voir la courbe.
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
