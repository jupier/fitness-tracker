import { useEffect, useState } from 'react'
import { Button, Group, NumberInput, Paper, Stack, Title } from '@mantine/core'
import dayjs from 'dayjs'
import type { WeightEntry } from '../types'

interface WeightInputProps {
  date: string
  entries: WeightEntry[]
  onAdd: (weight: number, date: string) => void
}

export function WeightInput({ date, entries, onAdd }: WeightInputProps) {
  const existing = entries.find((e) => e.date === date)
  const [value, setValue] = useState<number | ''>(existing?.weight ?? '')

  useEffect(() => {
    setValue(existing?.weight ?? '')
  }, [existing?.weight, date])

  const submit = () => {
    if (value === '' || value <= 0) return
    onAdd(value, date)
  }

  const label = dayjs(date).isSame(dayjs(), 'day') ? "Aujourd'hui (kg)" : `${dayjs(date).format('D MMM')} (kg)`

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Title order={4}>Poids</Title>
        <Group align="flex-end">
          <NumberInput
            label={label}
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
      </Stack>
    </Paper>
  )
}
