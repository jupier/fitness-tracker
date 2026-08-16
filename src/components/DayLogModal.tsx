import { useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Collapse,
  Group,
  Modal,
  NumberInput,
  Rating,
  Stack,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { IconBrandStrava, IconChevronDown, IconChevronUp, IconPlus, IconTrash } from '@tabler/icons-react'
import dayjs, { type Dayjs } from 'dayjs'
import { activityConfig, resolveTypeInput } from '../lib/activityTypes'
import { confirmDelete } from '../lib/confirm'
import { toDateKey } from '../lib/dates'
import { extractStravaEmbed } from '../lib/strava'
import { StravaEmbed } from './StravaEmbed'
import type { ActivityTypeConfig } from '../constants'
import type { Workout } from '../types'

type WorkoutDetails = Partial<
  Pick<
    Workout,
    'duration_minutes' | 'distance_km' | 'notes' | 'rating' | 'strava_embed_id' | 'strava_embed_token'
  >
>

interface DayLogModalProps {
  date: Dayjs | null
  workouts: Workout[]
  activityTypes: ActivityTypeConfig[]
  onClose: () => void
  onAdd: (type: string, date: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, patch: WorkoutDetails) => void
}

function EntryRow({
  entry,
  cfg,
  onRemove,
  onUpdate,
}: {
  entry: Workout
  cfg: ActivityTypeConfig
  onRemove: () => void
  onUpdate: (patch: WorkoutDetails) => void
}) {
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState<number | ''>(entry.duration_minutes ?? '')
  const [distance, setDistance] = useState<number | ''>(entry.distance_km ?? '')
  const [note, setNote] = useState(entry.notes ?? '')
  const [rating, setRating] = useState(entry.rating ?? 0)
  const [stravaInput, setStravaInput] = useState('')
  const [stravaError, setStravaError] = useState(false)
  const Icon = cfg.icon

  const save = () => {
    let strava_embed_id = entry.strava_embed_id
    let strava_embed_token = entry.strava_embed_token
    if (stravaInput.trim() !== '') {
      const parsed = extractStravaEmbed(stravaInput)
      if (!parsed) {
        setStravaError(true)
        return
      }
      strava_embed_id = parsed.id
      strava_embed_token = parsed.token
    }
    setStravaError(false)
    onUpdate({
      duration_minutes: duration === '' ? null : duration,
      distance_km: distance === '' ? null : distance,
      notes: note.trim() === '' ? null : note.trim(),
      rating: rating === 0 ? null : rating,
      strava_embed_id,
      strava_embed_token,
    })
    setStravaInput('')
    setOpen(false)
  }

  return (
    <Stack gap={4}>
      <Group justify="space-between" wrap="nowrap">
        <UnstyledButton onClick={() => setOpen((o) => !o)} style={{ flex: 1 }}>
          <Group gap={6}>
            <Icon size={16} className="activity-pop" />
            <Text size="sm">{cfg.label}</Text>
            {entry.duration_minutes != null && (
              <Badge size="xs" variant="light" color="gray">
                {entry.duration_minutes} min
              </Badge>
            )}
            {entry.distance_km != null && (
              <Badge size="xs" variant="light" color="gray">
                {entry.distance_km} km
              </Badge>
            )}
            {entry.rating != null && <Rating value={entry.rating} size="xs" readOnly />}
            {cfg.stravaEligible && entry.strava_embed_id && (
              <Badge size="xs" variant="light" color="orange" leftSection={<IconBrandStrava size={11} />}>
                Strava
              </Badge>
            )}
            {open ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </Group>
        </UnstyledButton>
        <ActionIcon color="red" variant="subtle" onClick={onRemove} aria-label="Supprimer">
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
      <Collapse expanded={open}>
        <Stack gap="xs" pl={22} pb="xs">
          <Group>
            <NumberInput
              label="Durée (min)"
              placeholder="45"
              value={duration}
              onChange={(v) => setDuration(typeof v === 'number' ? v : '')}
              min={0}
              w={140}
            />
            <NumberInput
              label="Distance (km)"
              placeholder="5.2"
              decimalScale={1}
              step={0.1}
              value={distance}
              onChange={(v) => setDistance(typeof v === 'number' ? v : '')}
              min={0}
              w={140}
            />
          </Group>
          <div>
            <Text size="xs" fw={500} mb={4}>
              Note
            </Text>
            <Rating value={rating} onChange={setRating} />
          </div>
          <Textarea
            label="Commentaire"
            placeholder="Optionnel"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            autosize
            minRows={2}
          />
          {cfg.stravaEligible && (
            <>
              {entry.strava_embed_id && entry.strava_embed_token && (
                <StravaEmbed activityId={entry.strava_embed_id} token={entry.strava_embed_token} />
              )}
              <Textarea
                label={entry.strava_embed_id ? "Remplacer le code d'intégration Strava" : "Code d'intégration Strava"}
                description="Sur Strava : ⋯ > Intégrer, puis colle le code ici tel quel"
                placeholder='<div class="strava-embed-placeholder" data-embed-id="..." data-token="..."></div>'
                value={stravaInput}
                onChange={(e) => {
                  setStravaInput(e.currentTarget.value)
                  setStravaError(false)
                }}
                error={stravaError ? "Ce n'est pas un code d'intégration Strava valide" : undefined}
                autosize
                minRows={2}
              />
            </>
          )}
          <Button size="xs" onClick={save} style={{ alignSelf: 'flex-start' }}>
            Enregistrer
          </Button>
        </Stack>
      </Collapse>
    </Stack>
  )
}

export function DayLogModal({ date, workouts, activityTypes, onClose, onAdd, onRemove, onUpdate }: DayLogModalProps) {
  const [customOpen, setCustomOpen] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const dateKey = date ? toDateKey(date) : null
  const entries = dateKey ? workouts.filter((w) => w.date === dateKey) : []
  const isFuture = date ? date.isAfter(dayjs(), 'day') : false

  const submitCustom = () => {
    if (!customValue.trim() || !dateKey) return
    onAdd(resolveTypeInput(customValue), dateKey)
    setCustomValue('')
    setCustomOpen(false)
  }

  return (
    <Modal opened={!!date} onClose={onClose} title={date?.format('dddd D MMMM')} centered size="lg">
      <Stack gap="md">
        {entries.length > 0 && (
          <Stack gap={2}>
            {entries.map((e) => {
              const cfg = activityConfig(e.type, activityTypes)
              return (
                <EntryRow
                  key={e.id}
                  entry={e}
                  cfg={cfg}
                  onRemove={() => confirmDelete(`Supprimer "${cfg.label}" de cette journée ?`, () => onRemove(e.id))}
                  onUpdate={(patch) => onUpdate(e.id, patch)}
                />
              )
            })}
          </Stack>
        )}
        {isFuture ? (
          <Alert color="gray" variant="light">
            Impossible de logger une activité dans le futur.
          </Alert>
        ) : (
          <>
            <Text size="xs" c="dimmed">
              Ajouter une activité
            </Text>
            <Group gap="xs">
              {activityTypes.map((cfg) => {
                const Icon = cfg.icon
                return (
                  <Button
                    key={cfg.type}
                    variant="light"
                    color={cfg.color}
                    size="xs"
                    leftSection={<Icon size={14} />}
                    onClick={() => dateKey && onAdd(cfg.type, dateKey)}
                  >
                    {cfg.label}
                  </Button>
                )
              })}
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftSection={<IconPlus size={14} />}
                onClick={() => setCustomOpen((o) => !o)}
              >
                Autre
              </Button>
            </Group>
            <Collapse expanded={customOpen}>
              <Group gap="xs">
                <TextInput
                  placeholder="Nom de l'activité"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitCustom()}
                  style={{ flex: 1 }}
                />
                <Button onClick={submitCustom} disabled={!customValue.trim()}>
                  Ajouter
                </Button>
              </Group>
            </Collapse>
          </>
        )}
      </Stack>
    </Modal>
  )
}
