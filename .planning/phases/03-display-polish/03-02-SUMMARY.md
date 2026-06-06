---
phase: 03-display-polish
plan: 02
status: complete
completed: 2026-06-06
tasks_total: 5
tasks_completed: 5
gap_closure: true
---

# Plan 03-02 Summary: Gap Fixes — Null Guard, Identity Toggle, Header Layout, Spacing

## What Was Fixed

Five gap items identified at the Phase 3 human checkpoint, all UAT-verified:

### 1. White screen on first log (critical bug)
**Root cause:** `serverTimestamp()` FieldValue returns `null` in the local optimistic Firestore snapshot before the server round-trips the actual `Timestamp`. The snapshot callback cast `data.timestamp` directly to `Timestamp` then called `.toMillis()` on null — React crashed with a TypeError.

**Fix:** `const ts: Timestamp | null = data.timestamp; if (!ts) return` — skips optimistic null entries, processes only docs with a resolved server timestamp.

### 2. Identity pre-selected on load
**Change:** `useState<'Me' | 'Wife'>(() => (localStorage.getItem('madgy_caregiver') as 'Me' | 'Wife') ?? 'Me')` — defaults to `'Me'` on first load, no "nobody selected" state ever.

**Downstream:** `handleLog` guard removed (identity always set). `TrackableList.disabled` prop removed. `TrackableCard.disabled` prop removed and button logic simplified.

### 3. Compact pill toggle in header
**IdentityPicker redesign:** `value` type changed from `'Me' | 'Wife' | null` to non-nullable `'Me' | 'Wife'`. UI changed from two separate buttons with "I am:" label to a single `rounded-full border` pill with two segments, active segment in `bg-blue-600 text-white`.

**App.tsx header layout:** Replaced standalone `<h1>` with `flex items-center justify-between` row containing title + `<IdentityPicker>`.

### 4. Tighter card spacing
`TrackableList` gap changed from `gap-6` to `gap-3`. Activities section top margin changed from `mt-6` to `mt-4`. All 6 cards fit on one screen without scrolling.

### 5. No disabled prop threading (cleanup)
`TrackableList` no longer accepts or passes `disabled`. `TrackableCard` interface and button no longer reference `disabled`. Simpler and consistent with the non-nullable identity model.

## Verification

- `npx tsc -p tsconfig.app.json --noEmit` — 0 errors
- `npm run build` — clean production build, 0 TS errors
- User confirmed: item 2 (white screen) fixed, item 4 (spacing/layout) fixed

## Commit

`eb7013f` fix(03): gap fixes — null guard, pre-selected identity, compact header toggle, tighter spacing
