import { Paper, Stack, Text, Title } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import dayjs from 'dayjs'
import type { MoodEntry } from '../types'

interface MoodChartProps {
  entries: MoodEntry[]
}

export function MoodChart({ entries }: MoodChartProps) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const chartData = sorted.map((e) => ({ date: dayjs(e.date).format('D MMM'), humeur: e.mood }))

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={4}>Humeur dans le temps</Title>
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
