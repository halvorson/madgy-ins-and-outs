---
status: complete
phase: 02-full-trackables-logging
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md
started: 2026-06-06T00:00:00Z
updated: 2026-06-06T00:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. All 6 trackables appear
expected: App shows Carprofen, Gabapentin, Trazodone, Ate, Peed, Pooped — all driven by getTrackables(), no inline JSX literals
result: pass

### 2. Log buttons disabled before identity selected
expected: On first load with no localStorage, all 6 Log buttons appear grayed out / disabled (opacity-50, cursor-not-allowed). Cannot tap them.
result: pass

### 3. Identity picker visible below title
expected: "I am:" label with Me and Wife buttons appears below "Madgy Tracker" heading. Both buttons start in unselected state (white background, border).
result: pass

### 4. Selecting identity enables Log buttons
expected: Tapping Me turns the Me button blue (bg-blue-600 white text). All 6 Log buttons become fully enabled (full opacity, clickable).
result: pass

### 5. Log writes selected identity to Firestore
expected: Tapping a Log button creates a Firestore document in subjects/madgy/logs with loggedBy set to "Me" or "Wife" (not "caregiver")
result: pass

### 6. Identity persists across page reloads
expected: After selecting Me or Wife, reloading the page restores the selected identity from localStorage (madgy_caregiver key). Log buttons remain enabled immediately.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none]
