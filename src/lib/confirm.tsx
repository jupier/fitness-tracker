import { Text } from '@mantine/core'
import { modals } from '@mantine/modals'

export function confirmDelete(message: string, onConfirm: () => void) {
  modals.openConfirmModal({
    title: 'Supprimer ?',
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: 'Supprimer', cancel: 'Annuler' },
    confirmProps: { color: 'red' },
    onConfirm,
  })
}
