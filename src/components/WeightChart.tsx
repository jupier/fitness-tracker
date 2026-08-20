import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { movingAverage, sortedByDate, weightDelta } from '../lib/weight'
import { WEIGHT_GOAL_KG } from '../constants'
import type { WeightEntry } from '../types'

interface WeightChartProps {
  entries: WeightEntry[]
}

export function WeightChart({ entries }: WeightChartProps) {
  const sorted = sortedByDate(entries)
  const averages = movingAverage(entries)
  const chartData = sorted.map((e, i) => ({
    date: dayjs(e.date).format('D MMM'),
    poids: e.weight,
    moyenne: averages[i]?.value,
  }))
  const delta = weightDelta(entries, 30)

  const values = [...chartData.flatMap((d) => [d.poids, d.moyenne]), WEIGHT_GOAL_KG].filter(
    (v): v is number => typeof v === 'number',
  )
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const padding = Math.max(1, (maxValue - minValue) * 0.15)
  const yDomain: [number, number] = [Math.floor(minValue - padding), Math.ceil(maxValue + padding)]

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Poids dans le temps</Title>
          {delta !== null && (
            <Badge
              variant="light"
              color="gray"
              leftSection={delta <= 0 ? <IconTrendingDown size={12} /> : <IconTrendingUp size={12} />}
            >
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1)} kg / 30j
            </Badge>
          )}
        </Group>
        {chartData.length > 1 ? (
          <LineChart
            h={220}
            data={chartData}
            dataKey="date"
            series={[
              { name: 'poids', color: 'blue.3', label: 'Poids (kg)' },
              { name: 'moyenne', color: 'blue.7', label: 'Moyenne 7j' },
            ]}
            curveType="linear"
            withDots={chartData.length < 40}
            referenceLines={[{ y: WEIGHT_GOAL_KG, label: `Objectif (${WEIGHT_GOAL_KG} kg)`, color: 'gray.5' }]}
            yAxisProps={{ domain: yDomain }}
          />
        ) : (
          <Text size="sm" c="dimmed">
            Ajoute au moins deux pesées pour voir la courbe.
          </Text>
        )}
      </Stack>
    </Paper>
  )
}
