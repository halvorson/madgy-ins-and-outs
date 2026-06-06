# Phase 3: Display & Polish — Pattern Map

**Mapped:** 2026-06-06
**Files analyzed:** 4 (3 modified, 1 new)
**Analogs found:** 4 / 4

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/App.tsx` | provider/orchestrator | event-driven + request-response | `src/App.tsx` (self — extend existing) | exact |
| `src/components/TrackableCard.tsx` | component | request-response | `src/components/TrackableCard.tsx` (self — extend existing) | exact |
| `src/components/TrackableList.tsx` | component | transform | `src/components/TrackableList.tsx` (self — extend existing) | exact |
| `src/lib/elapsed.ts` | utility | transform | `src/lib/trackables.ts` (pure function pattern) | role-match |

---

## Pattern Assignments

### `src/App.tsx` (orchestrator, event-driven)

**Analog:** `src/App.tsx` (self — extend, do not rewrite)

**Existing imports to extend** (lines 1–8):
```typescript
import { useEffect, useState } from 'react'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { onSnapshot } from 'firebase/firestore'
import { auth } from './lib/firebase'
import { logsCollection, addLog } from './lib/firestore'
import { getTrackables, Trackable } from './lib/trackables'
import { TrackableList } from './components/TrackableList'
import { IdentityPicker } from './components/IdentityPicker'
```

Add to imports:
```typescript
import { Timestamp } from 'firebase/firestore'
import { formatElapsed } from './lib/elapsed'
```

**Existing state pattern** (lines 11–16) — add new state alongside existing:
```typescript
const [authLoading, setAuthLoading] = useState(true)
const [authError, setAuthError] = useState(false)
const [trackables, setTrackables] = useState<Trackable[]>([])
const [identity, setIdentity] = useState<'Me' | 'Wife' | null>(
  () => (localStorage.getItem('madgy_caregiver') as 'Me' | 'Wife' | null)
)
// ADD:
const [lastLogged, setLastLogged] = useState<Record<string, Timestamp>>({})
const [, setTick] = useState(0)  // tick counter — forces re-render every 30s
```

**onSnapshot callback to fill in** (lines 35–43) — replace the empty callback:
```typescript
useEffect(() => {
  if (authLoading) return

  const unsubscribeLogs = onSnapshot(logsCollection('madgy'), (snapshot) => {
    const map: Record<string, Timestamp> = {}
    snapshot.docs.forEach((doc) => {
      const data = doc.data()
      const id: string = data.trackableId
      const ts: Timestamp = data.timestamp
      if (!map[id] || ts.toMillis() > map[id].toMillis()) {
        map[id] = ts
      }
    })
    setLastLogged(map)
  })

  return () => unsubscribeLogs()
}, [authLoading])
```

**setInterval pattern** (new useEffect, follow same useEffect structure as lines 35–43):
```typescript
useEffect(() => {
  const id = setInterval(() => {
    setTick((n) => n + 1)
  }, 30000)
  return () => clearInterval(id)
}, [])
```

**Prop threading pattern** (lines 72–77) — add `lastLogged` prop alongside existing props:
```typescript
<TrackableList
  trackables={trackables}
  onLog={handleLog}
  disabled={identity === null}
  lastLogged={lastLogged}   // ADD
/>
```

**Auth error / loading guard pattern** (lines 55–69) — no changes; preserve exactly.

---

### `src/components/TrackableCard.tsx` (component, request-response)

**Analog:** `src/components/TrackableCard.tsx` (self — extend props interface)

**Existing props interface** (lines 3–8) — add one prop:
```typescript
interface TrackableCardProps {
  id: string
  displayName: string
  onLog: () => Promise<void>
  disabled?: boolean
  lastLoggedText: string   // ADD — pre-computed string from App
}
```

**Destructure pattern** (line 10) — add to destructure:
```typescript
export function TrackableCard({ displayName, onLog, disabled, lastLoggedText }: TrackableCardProps) {
```

**Elapsed slot** (lines 32–34) — replace `&mdash;` with prop:
```typescript
// BEFORE:
<p className="text-sm font-normal leading-relaxed text-gray-500 mt-1">
  &mdash;
</p>

// AFTER:
<p className="text-sm font-normal leading-relaxed text-gray-500 mt-1">
  {lastLoggedText}
</p>
```

**Error handling pattern** (lines 14–23) — no changes; preserve exactly:
```typescript
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
```

---

### `src/components/TrackableList.tsx` (component, transform)

**Analog:** `src/components/TrackableList.tsx` (self — extend props and rendering)

**Existing imports** (lines 1–2) — add `formatElapsed`:
```typescript
import { Trackable } from '../lib/trackables'
import { TrackableCard } from './TrackableCard'
import { Timestamp } from 'firebase/firestore'
import { formatElapsed } from '../lib/elapsed'
```

**Props interface** (lines 4–8) — add `lastLogged`:
```typescript
interface TrackableListProps {
  trackables: Trackable[]
  onLog: (trackableId: string) => Promise<void>
  disabled?: boolean
  lastLogged: Record<string, Timestamp>   // ADD
}
```

**Core grouping pattern** (replace the flat `<ul>` at lines 10–25):
```typescript
export function TrackableList({ trackables, onLog, disabled, lastLogged }: TrackableListProps) {
  const pills = trackables.filter((t) => t.type === 'pill')
  const activities = trackables.filter((t) => t.type === 'activity')

  function renderGroup(items: Trackable[], label: string, addTopMargin: boolean) {
    return (
      <div className={addTopMargin ? 'mt-6' : ''}>
        <h2 className="text-xs font-normal uppercase tracking-wide text-gray-400 mb-2">
          {label}
        </h2>
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
```

**Section header element** (exact classes from UI-SPEC §7.1):
```tsx
<h2 className="text-xs font-normal uppercase tracking-wide text-gray-400 mb-2">
  Pills
</h2>
```

---

### `src/lib/elapsed.ts` (utility, transform) — NEW FILE

**Analog:** `src/lib/trackables.ts` (pure function with typed export, no side effects)

**Pattern from analog** (lines 1–16 of `src/lib/trackables.ts`):
```typescript
// Pure export — no imports from React or Firebase app state
export interface Trackable { ... }
export async function getTrackables(): Promise<Trackable[]> { ... }
```

**Target file structure:**
```typescript
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
```

**Key constraints from CONTEXT.md D-01–D-03 and UI-SPEC §6:**
- `undefined` → `'Never'` (capital N)
- `< 60_000ms` → `'just now'` (all lowercase)
- `>= 60_000ms` → `'${h}h ${m}m ago'` — always both units, no day conversion

---

## Shared Patterns

### State management pattern
**Source:** `src/App.tsx` lines 11–16
**Apply to:** New `lastLogged` state and `tick` state in App.tsx

```typescript
// Pattern: useState with explicit type annotation
const [lastLogged, setLastLogged] = useState<Record<string, Timestamp>>({})
```

### useEffect cleanup pattern
**Source:** `src/App.tsx` lines 18–43
**Apply to:** Both the onSnapshot useEffect (already present) and the new setInterval useEffect

```typescript
useEffect(() => {
  // setup
  const cleanup = setupSomething()
  return () => cleanup()  // always return cleanup
}, [dependency])
```

### Prop threading (App → List → Card)
**Source:** `src/App.tsx` lines 72–77, `src/components/TrackableList.tsx` lines 10–25
**Apply to:** `lastLogged` flows App → TrackableList → TrackableCard (as pre-computed `lastLoggedText` string)

The formatting step happens at the TrackableList boundary (`formatElapsed(lastLogged[t.id])`), so TrackableCard receives only a plain string and stays purely presentational.

### Tailwind class pattern
**Source:** `src/components/TrackableCard.tsx` lines 27–50
**Apply to:** Section headers in TrackableList, elapsed `<p>` slot

Existing card text secondary class:
```typescript
className="text-sm font-normal leading-relaxed text-gray-500 mt-1"
```
Section header class (new, from UI-SPEC §3 and §7.1):
```typescript
className="text-xs font-normal uppercase tracking-wide text-gray-400 mb-2"
```

---

## No Analog Found

All files have close analogs in the codebase. No files require falling back to RESEARCH.md patterns.

---

## Metadata

**Analog search scope:** `src/App.tsx`, `src/components/`, `src/lib/`
**Files scanned:** 5 (`App.tsx`, `TrackableCard.tsx`, `TrackableList.tsx`, `firestore.ts`, `trackables.ts`)
**Pattern extraction date:** 2026-06-06
