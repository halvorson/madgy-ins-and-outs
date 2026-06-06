import { Timestamp } from 'firebase/firestore'
import { Trackable } from '../lib/trackables'
import { formatElapsed } from '../lib/elapsed'
import { TrackableCard } from './TrackableCard'

interface TrackableListProps {
  trackables: Trackable[]
  onLog: (trackableId: string) => Promise<void>
  disabled?: boolean
  lastLogged: Record<string, Timestamp>
}

export function TrackableList({ trackables, onLog, disabled, lastLogged }: TrackableListProps) {
  const pills = trackables.filter((t) => t.type === 'pill')
  const activities = trackables.filter((t) => t.type === 'activity')

  function renderGroup(items: Trackable[], label: string, addTopMargin: boolean) {
    return (
      <div className={addTopMargin ? 'mt-6' : ''}>
        <h2 className="text-xs font-normal uppercase tracking-wide text-gray-400 mb-2">{label}</h2>
        <ul className="flex flex-col gap-6">
          {items.map((t) => (
            <li key={t.id}>
              <TrackableCard
                id={t.id}
                displayName={t.displayName}
                onLog={() => onLog(t.id)}
                disabled={disabled}
                lastLoggedText={formatElapsed(lastLogged[t.id])}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {renderGroup(pills, 'Pills', false)}
      {renderGroup(activities, 'Activities', true)}
    </div>
  )
}
