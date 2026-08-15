import { useState } from 'react'
import { Badge, Button, Group, NumberInput, Paper, Stack, Text, Title } from '@mantine/core'
import { LineChart } from '@mantine/charts'
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { movingAverage, sortedByDate, weightDelta } from '../lib/weight'
import type { WeightEntry } from '../types'

interface WeightSectionProps {
  entries: WeightEntry[]
  onAdd: (weight: number, date: string) => void
}

export function WeightSection({ entries, onAdd }: WeightSectionProps) {
  const [value, setValue] = useState<number | ''>('')

  const sorted = sortedByDate(entries)
  const averages = movingAverage(entries)
  const chartData = sorted.map((e, i) => ({
    date: dayjs(e.date).format('D MMM'),
    poids: e.weight,
    moyenne: averages[i]?.value,
  }))
  const delta = weightDelta(entries, 30)

  const submit = () => {
    if (value === '' || value <= 0) return
    onAdd(value, dayjs().format('YYYY-MM-DD'))
    setValue('')
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Poids</Title>
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
        <Group align="flex-end">
          <NumberInput
            label="Aujourd'hui (kg)"
            placeholder="72.5"
            decimalScale={1}
            step={0.1}
            value={value}
            onChange={(v) => setValue(typeof v === 'number' ? v : '')}
            w={140}
          />
          <Button onClick={submit} disabled={value === ''}>
            Enregistrer
          </Button>
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
