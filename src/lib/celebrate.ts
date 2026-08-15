import confetti from 'canvas-confetti'

export function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#2a78d6', '#eb6834', '#1baf7a', '#0ca30c'],
  })
}

const CELEBRATED_WEEK_KEY = 'routine:celebrated-week'

export function hasCelebratedWeek(weekKey: string): boolean {
  return localStorage.getItem(CELEBRATED_WEEK_KEY) === weekKey
}

export function markCelebratedWeek(weekKey: string) {
  localStorage.setItem(CELEBRATED_WEEK_KEY, weekKey)
}
