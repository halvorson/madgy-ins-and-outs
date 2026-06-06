import { useEffect, useState } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { onSnapshot, Timestamp } from 'firebase/firestore'
import { auth } from './lib/firebase'
import { logsCollection, addLog } from './lib/firestore'
import { getTrackables, Trackable } from './lib/trackables'
import { TrackableList } from './components/TrackableList'
import { IdentityPicker } from './components/IdentityPicker'

function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [trackables, setTrackables] = useState<Trackable[]>([])
  const [identity, setIdentity] = useState<'Me' | 'Wife'>(
    () => (localStorage.getItem('madgy_caregiver') as 'Me' | 'Wife') ?? 'Me'
  )
  const [lastLogged, setLastLogged] = useState<Record<string, Timestamp>>({})
  const [, setTick] = useState(0)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const items = await getTrackables()
        setTrackables(items)
        setAuthLoading(false)
      }
    })

    signInAnonymously(auth).catch(() => {
      setAuthError(true)
      setAuthLoading(false)
    })

    return () => unsubscribeAuth()
  }, [])

  useEffect(() => {
    if (authLoading) return

    const unsubscribeLogs = onSnapshot(logsCollection('madgy'), (snapshot) => {
      const map: Record<string, Timestamp> = {}
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        const id: string = data.trackableId
        const ts: Timestamp | null = data.timestamp
        // serverTimestamp() is null in the local optimistic snapshot before the server round-trips
        if (!ts) return
        if (!map[id] || ts.toMillis() > map[id].toMillis()) {
          map[id] = ts
        }
      })
      setLastLogged(map)
    })

    return () => unsubscribeLogs()
  }, [authLoading])

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000)
    return () => clearInterval(id)
  }, [])

  function handleIdentityChange(next: 'Me' | 'Wife') {
    localStorage.setItem('madgy_caregiver', next)
    setIdentity(next)
  }

  async function handleLog(trackableId: string): Promise<void> {
    await addLog('madgy', trackableId, identity)
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <p className="text-sm text-red-600">Something went wrong. Please reload.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold leading-tight text-gray-900">
            Madgy Tracker
          </h1>
          <IdentityPicker value={identity} onChange={handleIdentityChange} />
        </div>
        {!authLoading && (
          <TrackableList
            trackables={trackables}
            onLog={handleLog}
            lastLogged={lastLogged}
          />
        )}
      </div>
    </div>
  )
}

export default App
