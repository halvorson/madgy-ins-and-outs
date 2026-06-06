---
phase: 01-deployed-thin-slice
reviewed: 2026-06-06T00:00:00Z
depth: standard
files_reviewed: 11
files_reviewed_list:
  - src/lib/firebase.ts
  - src/lib/firestore.ts
  - src/components/TrackableCard.tsx
  - src/components/TrackableList.tsx
  - src/App.tsx
  - src/main.tsx
  - src/index.css
  - src/vite-env.d.ts
  - firestore.rules
  - firebase.json
  - .env.example
findings:
  critical: 3
  warning: 4
  info: 2
  total: 9
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-06T00:00:00Z
**Depth:** standard
**Files Reviewed:** 11
**Status:** issues_found

## Summary

This is a thin-slice walking skeleton for the Madgy Tracker app. The code initializes Firebase, provides anonymous auth, a Firestore write path, and a single UI card. The scope is intentionally minimal, but several issues in this thin slice will cause real failures in production — particularly around auth race conditions, Firestore write authorization, and silent data loss.

---

## Critical Issues

### CR-01: Auth race condition — `onSnapshot` can fire before anonymous sign-in completes

**File:** `src/App.tsx:27-35`
**Issue:** The second `useEffect` depends on `authLoading` becoming `false` to subscribe to logs. However, `authLoading` is only set to `false` inside the `onAuthStateChanged` callback — which fires after the `signInAnonymously` call resolves. The problem is that `signInAnonymously(auth).catch(...)` is fire-and-forget: if the returned promise resolves (user is already signed in from a prior session), `onAuthStateChanged` fires synchronously during `initializeApp`, before the component even mounts. In that case `authLoading` remains `true` on the first render and the snapshot listener is never attached until the *next* render — which may never come if `onAuthStateChanged` already fired and no state update triggers a re-render.

More critically: the `onAuthStateChanged` callback only calls `setAuthLoading(false)` when `user` is truthy (line 14-16). If the user is signed out for any reason (e.g., token revocation), `setAuthLoading` is never called and the app hangs in a loading state forever with no error surfaced to the user.

**Fix:**
```tsx
onAuthStateChanged(auth, (user) => {
  if (user) {
    setAuthLoading(false)
  } else {
    // user is null — sign-in hasn't completed yet or was revoked; do nothing
    // but avoid hanging indefinitely: the signInAnonymously catch handles the error path
    // Optionally: setAuthError(true); setAuthLoading(false) if you want to surface sign-out
  }
})
```
More robustly, drive the auth state entirely from `onAuthStateChanged` (including the `null` case) and remove the parallel `signInAnonymously` + `catch` pattern:
```tsx
useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await signInAnonymously(auth)
      } catch {
        setAuthError(true)
        setAuthLoading(false)
      }
    } else {
      setAuthLoading(false)
    }
  })
  return () => unsub()
}, [])
```

---

### CR-02: Firestore writes will be rejected — `loggedBy` is hardcoded, not the authenticated UID

**File:** `src/lib/firestore.ts:15-22`
**Issue:** `addLog` hardcodes `loggedBy: 'caregiver'` (line 19). The current Firestore security rule (`allow read, write: if request.auth != null`) permits this for now. However, the natural next step for this app is to differentiate which caregiver (owner vs. wife) logged each event. If the rules are ever tightened to validate `request.resource.data.loggedBy == request.auth.uid`, every write from the current code will be silently rejected. Worse, for Phase 3 (elapsed-time display), there is no way to attribute log entries to a device/caregiver at all because the auth UID is never captured.

This is also a latent bug: `addLog` accepts `subject` and `trackableId` but the calling code in `App.tsx` hardcodes the subject as `'madgy'` — the subject parameter is an unnecessary indirection that adds complexity with no runtime flexibility.

**Fix:** Capture the current user's UID and include it in the log entry:
```ts
import { getAuth } from 'firebase/auth'

export async function addLog(subject: string, trackableId: string): Promise<void> {
  const uid = getAuth().currentUser?.uid
  if (!uid) throw new Error('Not authenticated')
  const entry: LogEntry = {
    trackableId,
    timestamp: serverTimestamp(),
    loggedBy: uid,
  }
  await addDoc(logsCollection(subject), entry)
}
```

---

### CR-03: `createRoot` will throw a runtime crash if `#root` element is absent

**File:** `src/main.tsx:6`
**Issue:** `document.getElementById('root')!` uses a non-null assertion. If the `index.html` root element is renamed, missing, or the script runs before DOM parsing completes, this throws `Cannot read properties of null (reading 'render')` — a hard crash with no error recovery. This is also the entry point for the entire app, so the crash gives no useful error to the user.

**Fix:**
```tsx
const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found in DOM')
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
This preserves the crash but converts it from an obscure property-on-null error to a meaningful message that survives minification.

---

## Warnings

### WR-01: `onSnapshot` listener receives no error handler — silent failure on Firestore permission errors

**File:** `src/App.tsx:30-33`
**Issue:** `onSnapshot(logsCollection('madgy'), () => { ... })` passes only a next-value callback. The Firestore SDK accepts an optional error callback as the third argument. Without it, if the listener fails (e.g., auth token expires, rules reject the read, network partition), the error is swallowed. The app will appear to work but stop receiving real-time updates with no indication to the user.

**Fix:**
```tsx
const unsubscribeLogs = onSnapshot(
  logsCollection('madgy'),
  () => {
    // Phase 1: listener active
  },
  (err) => {
    console.error('Firestore snapshot error:', err)
    // Surface to UI in Phase 3 when display is added
  }
)
```

---

### WR-02: Error display in `TrackableCard` is misleading — tells user to "tap to retry" but the button is a separate element

**File:** `src/components/TrackableCard.tsx:45`
**Issue:** The error message reads "Couldn't save. Tap to retry." The retry affordance is the "Log" button above it, not the error text itself. The error text is not interactive. A user on a phone may tap the red error text and nothing will happen, causing confusion.

**Fix:** Either make the error text a button that calls `handleLog`, remove the "Tap to retry" instruction, or change the message to "Couldn't save. Try the Log button again."
```tsx
{error !== null && (
  <p className="text-sm text-red-600 mt-1">Couldn't save. Try again.</p>
)}
```

---

### WR-03: `TrackableCard` prop `id` is declared in the interface but never used inside the component

**File:** `src/components/TrackableCard.tsx:3-9`
**Issue:** The `TrackableCardProps` interface declares `id: string` (line 4), but the component destructures `{ displayName, onLog }` (line 9) and never uses `id`. The `id` prop is passed by the parent (`TrackableList`) but is a dead parameter in the component. This is a correctness concern for future callers who may expect `id` to be applied (e.g., as an HTML `id` attribute for accessibility or testing).

**Fix:** Either use `id` in the component (e.g., `id={id}` on the root `div`) or remove it from `TrackableCardProps` if the parent should manage it:
```tsx
export function TrackableCard({ id, displayName, onLog }: TrackableCardProps) {
  // ...
  return (
    <div id={id} className="...">
```

---

### WR-04: Firestore rules have no index/query protection — `subjects` collection is fully writable by any auth user

**File:** `firestore.rules:4-6`
**Issue:** The rule `allow read, write: if request.auth != null` on `subjects/{subject}/logs/{logId}` permits any authenticated user to write to *any* subject path (e.g., `subjects/arbitrary_subject/logs/...`). Since Firebase Anonymous Auth creates a new UID for every new app session, anyone who loads the app URL gets write access to all subject logs. There is no restriction on which subjects can be written to.

For a private family app this is a low-risk concern in practice, but the subject name `'madgy'` is the only guard — and it is enforced only in the client code, not the rules.

**Fix:** Hard-code the allowed subject in the rules:
```
match /subjects/{subject}/logs/{logId} {
  allow read, write: if request.auth != null && subject == 'madgy';
}
```
This ensures that even if someone reverse-engineers the app, they can only write to the `madgy` subject.

---

## Info

### IN-01: `LogEntry.timestamp` typed as `ReturnType<typeof serverTimestamp>` but Firestore returns `Timestamp` on read

**File:** `src/lib/firestore.ts:4-9`
**Issue:** The `LogEntry` interface types `timestamp` as `ReturnType<typeof serverTimestamp>`, which resolves to `FieldValue`. This is correct for writes, but when log documents are read back from Firestore (which will happen in Phase 3), the `timestamp` field will be a `Timestamp` object — not a `FieldValue`. Any interface re-used for reading will be incorrectly typed. This is a type safety trap for the next phase.

**Fix:** Use a union or a separate read/write type:
```ts
import { FieldValue, Timestamp } from 'firebase/firestore'

interface LogEntryWrite {
  trackableId: string
  timestamp: FieldValue
  loggedBy: string
  note?: string
}

interface LogEntryRead {
  trackableId: string
  timestamp: Timestamp
  loggedBy: string
  note?: string
}
```

---

### IN-02: `firebase.json` is missing a `firestore.indexes` reference

**File:** `firebase.json:12-14`
**Issue:** The `firestore` block specifies only `rules`. Firebase CLI deployments also commonly use a `firestore.indexes` file. Without it, `firebase deploy` will not deploy index definitions, and any composite queries added in Phase 3 (e.g., query logs by `trackableId` ordered by `timestamp`) will fail at runtime until indexes are manually created in the console.

**Fix:** Add the indexes reference now (even with an empty indexes file) to prevent surprises:
```json
"firestore": {
  "rules": "firestore.rules",
  "indexes": "firestore.indexes.json"
}
```
And create `firestore.indexes.json`:
```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

---

_Reviewed: 2026-06-06T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
