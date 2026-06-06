import { Trackable } from '../lib/trackables'
import { TrackableCard } from './TrackableCard'

interface TrackableListProps {
  trackables: Trackable[]
  onLog: (trackableId: string) => Promise<void>
  disabled?: boolean
}

export function TrackableList({ trackables, onLog, disabled }: TrackableListProps) {
  return (
    <ul className="flex flex-col gap-6">
      {trackables.map((t) => (
        <li key={t.id}>
          <TrackableCard
            id={t.id}
            displayName={t.displayName}
            onLog={() => onLog(t.id)}
            disabled={disabled}
          />
        </li>
      ))}
    </ul>
  )
}
