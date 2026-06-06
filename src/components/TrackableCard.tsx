import { useState } from 'react'

interface TrackableCardProps {
  id: string
  displayName: string
  onLog: () => Promise<void>
  disabled?: boolean
}

export function TrackableCard({ displayName, onLog, disabled }: TrackableCardProps) {
  const [writing, setWriting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLog() {
    setWriting(true)
    setError(null)
    try {
      await onLog()
      setWriting(false)
    } catch (err) {
      setWriting(false)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-base font-semibold leading-tight text-gray-900">
          {displayName}
        </h2>
        <p className="text-sm font-normal leading-relaxed text-gray-500 mt-1">
          &mdash;
        </p>
      </div>
      <div className="flex flex-col items-end">
        <button
          aria-label={`Log ${displayName}`}
          disabled={writing || !!disabled}
          onClick={handleLog}
          className={`bg-blue-600 text-white rounded-md px-4 py-2 min-h-[44px] font-semibold text-sm${(writing || disabled) ? ' opacity-50 cursor-not-allowed' : ''}`}
        >
          Log
        </button>
        {error !== null && (
          <p className="text-sm text-red-600 mt-1">Couldn't save. Tap to retry.</p>
        )}
      </div>
    </div>
  )
}
