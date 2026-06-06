import { useEffect, useState } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { onSnapshot } from 'firebase/firestore'
import { auth } from './lib/firebase'
import { logsCollection, addLog } from './lib/firestore'
import { TrackableList } from './components/TrackableList'

function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
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

  async function handleLog(trackableId: string): Promise<void> {
    await addLog('madgy', trackableId)
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
          <TrackableList
            trackables={[{ id: 'gabapentin', displayName: 'Gabapentin' }]}
            onLog={handleLog}
          />
        )}
      </div>
    </div>
  )
}

export default App
