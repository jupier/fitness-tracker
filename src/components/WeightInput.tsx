import { useState } from 'react'
import { Button, Group, NumberInput, Paper, Stack, Title } from '@mantine/core'
import dayjs from 'dayjs'

interface WeightInputProps {
  onAdd: (weight: number, date: string) => void
}

export function WeightInput({ onAdd }: WeightInputProps) {
  const [value, setValue] = useState<number | ''>('')

  const submit = () => {
    if (value === '' || value <= 0) return
    onAdd(value, dayjs().format('YYYY-MM-DD'))
    setValue('')
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Title order={4}>Poids</Title>
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
      </Stack>
    </Paper>
  )
}
