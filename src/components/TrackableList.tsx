import { TrackableCard } from './TrackableCard'

interface Trackable {
  id: string
  displayName: string
}

interface TrackableListProps {
  trackables: Trackable[]
  onLog: (trackableId: string) => Promise<void>
}

export function TrackableList({ trackables, onLog }: TrackableListProps) {
  return (
    <ul className="flex flex-col gap-6">
      {trackables.map((t) => (
        <li key={t.id}>
          <TrackableCard
            id={t.id}
            displayName={t.displayName}
            onLog={() => onLog(t.id)}
          />
        </li>
      ))}
    </ul>
  )
}
