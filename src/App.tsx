import { useEffect, useState } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { onSnapshot } from 'firebase/firestore'
import { auth } from './lib/firebase'
import { logsCollection, addLog } from './lib/firestore'
import { getTrackables, Trackable } from './lib/trackables'
import { TrackableList } from './components/TrackableList'
import { IdentityPicker } from './components/IdentityPicker'

function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [trackables, setTrackables] = useState<Trackable[]>([])
  const [identity, setIdentity] = useState<'Me' | 'Wife' | null>(
    () => (localStorage.getItem('madgy_caregiver') as 'Me' | 'Wife' | null)
  )

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

    const unsubscribeLogs = onSnapshot(logsCollection('madgy'), () => {
      // Phase 1: confirms listener is active; elapsed-time display is Phase 3 (DISP-01)
    })

    return () => unsubscribeLogs()
  }, [authLoading])

  function handleIdentityChange(next: 'Me' | 'Wife') {
    localStorage.setItem('madgy_caregiver', next)
    setIdentity(next)
  }

  async function handleLog(trackableId: string): Promise<void> {
    if (!identity) return
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
        <h1 className="text-xl font-semibold leading-tight text-gray-900 mb-6">
          Madgy Tracker
        </h1>
        {!authLoading && (
          <>
            <IdentityPicker value={identity} onChange={handleIdentityChange} />
            <TrackableList
              trackables={trackables}
              onLog={handleLog}
              disabled={identity === null}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
