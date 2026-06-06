import { Timestamp } from 'firebase/firestore'

export function formatElapsed(timestamp: Timestamp | undefined): string {
  if (timestamp === undefined) return 'Never'
  const elapsedMs = Date.now() - timestamp.toMillis()
  if (elapsedMs < 60_000) return 'just now'
  const totalMinutes = Math.floor(elapsedMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m ago`
}
