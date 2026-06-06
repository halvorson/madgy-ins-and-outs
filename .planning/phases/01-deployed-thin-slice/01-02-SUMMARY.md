---
phase: "01-deployed-thin-slice"
plan: "02"
subsystem: "app"
tags: ["react", "firebase", "firestore", "auth", "tailwind", "components"]
dependency_graph:
  requires: ["01-01"]
  provides: ["anonymous-auth", "firestore-data-layer", "react-component-tree", "security-rules"]
  affects: ["01-03"]
tech_stack:
  added: []
  patterns:
    - "Anonymous auth via signInAnonymously + onAuthStateChanged before any Firestore write"
    - "Firestore real-time listener (onSnapshot) set up after auth resolves"
    - "Firestore security rules require request.auth != null for all reads/writes"
    - "TrackableCard/TrackableList component structure accepts arrays for Phase 2 config-driven expansion"
    - "Log button disabled state via writing boolean state; error surfaced as inline text"
key_files:
  created:
    - src/lib/firestore.ts
    - src/components/TrackableCard.tsx
    - src/components/TrackableList.tsx
    - firestore.rules
  modified:
    - src/App.tsx
    - firebase.json
decisions:
  - "Rendered TrackableList only after authLoading resolves (simpler than threading authLoading as a prop)"
  - "loggedBy hardcoded to 'caregiver' for Phase 1; Phase 2 adds Me/Wife picker (LOG-02)"
  - "onSnapshot callback body left empty in Phase 1 — confirms listener is active; elapsed-time display is Phase 3 (DISP-01)"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-06-06"
  tasks_completed: 2
  files_created: 4
  files_modified: 2
---

# Phase 01 Plan 02: Firestore Data Layer + React Component Tree Summary

Anonymous auth wired via signInAnonymously, Firestore addLog() writing to /subjects/madgy/logs/, real-time onSnapshot listener active, TrackableCard/TrackableList components built per UI-SPEC, and Firestore security rules blocking unauthenticated access.

## What Was Built

- **src/lib/firestore.ts:** `logsCollection(subject)` returns Firestore collection ref; `addLog(subject, trackableId)` writes `{ trackableId, timestamp: serverTimestamp(), loggedBy: 'caregiver' }` to `/subjects/{subject}/logs/`
- **firestore.rules:** `allow read, write: if request.auth != null` for `/subjects/{subject}/logs/{logId}` — default-deny blocks all other paths
- **firebase.json:** Added `"firestore": { "rules": "firestore.rules" }` alongside existing hosting config
- **src/components/TrackableCard.tsx:** Card with `displayName`, em-dash status placeholder, Log button (`bg-blue-600`, `min-h-[44px]`, `aria-label="Log {displayName}"`), writing/error states (`opacity-50 cursor-not-allowed` disabled, "Couldn't save. Tap to retry." error copy)
- **src/components/TrackableList.tsx:** `<ul className="flex flex-col gap-6">` accepting `trackables[]` array, maps to `TrackableCard` items
- **src/App.tsx:** Auth init via `signInAnonymously` + `onAuthStateChanged`; `onSnapshot` listener for `logsCollection('madgy')` started after auth resolves; `handleLog` calls `addLog('madgy', trackableId)`; renders `TrackableList` with hardcoded Gabapentin card; auth error state shows "Something went wrong. Please reload."

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Firestore data layer and security rules | 6e4b460 | src/lib/firestore.ts, firestore.rules, firebase.json |
| 2 | React component tree with auth and listener | 0a3421e | src/components/TrackableCard.tsx, src/components/TrackableList.tsx, src/App.tsx |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` exits 0 | PASS |
| `addLog` and `logsCollection` exported from firestore.ts | PASS |
| `firestore.rules` contains `request.auth != null` | PASS |
| `firebase.json` contains `"rules": "firestore.rules"` | PASS |
| `TrackableCard` exports with aria-label, min-h-[44px], opacity-50, error copy | PASS |
| `TrackableList` exports accepting trackables array | PASS |
| `App.tsx` calls `signInAnonymously` | PASS |
| `App.tsx` calls `onSnapshot` | PASS |
| `App.tsx` calls `addLog('madgy', ...)` | PASS |
| `App.tsx` renders `max-w-md mx-auto px-4 py-6` container | PASS |

## Deviations from Plan

None - plan executed exactly as written.

The plan offered a choice for authLoading threading: "render TrackableList only after !authLoading" vs. passing authLoading as a prop. Chose the simpler approach (conditional render) as the plan suggested.

## Known Stubs

- `src/components/TrackableCard.tsx` status line shows `&mdash;` (em dash) — intentional Phase 1 placeholder; Phase 3 (DISP-01) will replace with elapsed-time display ("3h 12m ago")
- `src/App.tsx` trackables array is hardcoded to `[{ id: 'gabapentin', displayName: 'Gabapentin' }]` — intentional Phase 1 hardcode per D-08; Phase 2 (TRACK-01) replaces with config-driven list
- `onSnapshot` callback body is empty — intentional; confirms listener is active, log entries are not displayed in Phase 1 per D-09; Phase 3 adds elapsed-time from log timestamps

These stubs do not prevent the plan's goal: a tap on Log writes to Firestore and the listener is active for real-time sync verification. They are tracked here for Plan 03 verification.

## Threat Flags

None. All T-02-* threat mitigations applied:
- T-02-01: `request.auth != null` in firestore.rules blocks unauthenticated writes
- T-02-02: `addLog()` only callable after `onAuthStateChanged` fires (authLoading gate); Firestore rules provide second layer
- T-02-SC: No new packages installed in this plan

## Self-Check: PASSED

- `src/lib/firestore.ts` — FOUND
- `src/components/TrackableCard.tsx` — FOUND
- `src/components/TrackableList.tsx` — FOUND
- `firestore.rules` — FOUND
- `firebase.json` updated with firestore key — FOUND
- `src/App.tsx` updated — FOUND
- Commit 6e4b460 (Task 1) — FOUND
- Commit 0a3421e (Task 2) — FOUND
