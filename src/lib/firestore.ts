import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

interface LogEntry {
  trackableId: string
  timestamp: ReturnType<typeof serverTimestamp>
  loggedBy: string
  note?: string
}

export function logsCollection(subject: string) {
  return collection(db, 'subjects', subject, 'logs')
}

export async function addLog(
  subject: string,
  trackableId: string,
  loggedBy: string,
): Promise<void> {
  const entry: LogEntry = {
    trackableId,
    timestamp: serverTimestamp(),
    loggedBy,
  }
  await addDoc(logsCollection(subject), entry)
}
