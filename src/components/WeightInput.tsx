import { useEffect, useState } from 'react'
import { Button, Group, Paper, Stack, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { DecimalInput } from './DecimalInput'
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
          <DecimalInput label={label} placeholder="72,5" value={value} onChange={setValue} w={140} />
          <Button onClick={submit} disabled={value === ''}>
            Enregistrer
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}
