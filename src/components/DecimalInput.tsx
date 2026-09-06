import { useEffect, useState } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'

interface DecimalInputProps extends Omit<TextInputProps, 'value' | 'onChange' | 'type' | 'inputMode'> {
  value: number | ''
  onChange: (value: number | '') => void
  decimals?: number
}

function toText(value: number | ''): string {
  return value === '' ? '' : String(value).replace('.', ',')
}

// Accepte "," ou "." comme séparateur décimal, indifféremment du clavier du
// téléphone ou de l'habitude de saisie — pas besoin des flèches +/- pour
// entrer une valeur comme 89,7.
export function DecimalInput({ value, onChange, decimals = 1, ...props }: DecimalInputProps) {
  const [text, setText] = useState(() => toText(value))
  const pattern = new RegExp(`^\\d*([.,]\\d{0,${decimals}})?$`)

  useEffect(() => {
    setText(toText(value))
  }, [value])

  return (
    <TextInput
      {...props}
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const raw = e.currentTarget.value
        if (!pattern.test(raw)) return
        setText(raw)
        const normalized = raw.replace(',', '.')
        if (normalized === '' || normalized === '.') {
          onChange('')
          return
        }
        const parsed = Number(normalized)
        if (!Number.isNaN(parsed)) onChange(parsed)
      }}
    />
  )
}
