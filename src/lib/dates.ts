import dayjs, { Dayjs } from 'dayjs'

export const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function startOfIsoWeek(date: Dayjs): Dayjs {
  const day = date.day()
  const diff = day === 0 ? -6 : 1 - day
  return date.add(diff, 'day').startOf('day')
}

export function weekDays(weekStart: Dayjs): Dayjs[] {
  return Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'))
}

export function toDateKey(d: Dayjs): string {
  return d.format('YYYY-MM-DD')
}

export function weekLabel(weekStart: Dayjs): string {
  const end = weekStart.add(6, 'day')
  const sameMonth = weekStart.month() === end.month()
  const startFmt = weekStart.format(sameMonth ? 'D' : 'D MMM')
  const endFmt = end.format('D MMM YYYY')
  return `${startFmt} – ${endFmt}`
}

export function isToday(d: Dayjs): boolean {
  return d.isSame(dayjs(), 'day')
}
