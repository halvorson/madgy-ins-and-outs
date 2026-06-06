---
phase: "01-deployed-thin-slice"
plan: "03"
subsystem: "infra"
tags: ["firebase", "hosting", "firestore", "deploy", "security-rules", "e2e"]
dependency_graph:
  requires: ["01-01", "01-02"]
  provides: ["live-hosting-url", "deployed-firestore-rules", "e2e-verified"]
  affects: []
tech_stack:
  added: []
  patterns:
    - "Production Vite build (npm run build) producing dist/ served by Firebase Hosting"
    - "Firebase CLI deploy --only hosting and --only firestore:rules as separate concerns"
    - "Firestore security rules verified end-to-end via unauthenticated REST rejection (HTTP 403)"
key_files:
  created: []
  modified:
    - firestore.rules
    - firebase.json
    - .gitignore
decisions:
  - "Deployed firestore:rules and hosting as separate firebase deploy targets — allows independent re-deploy of rules without rebuilding frontend"
metrics:
  duration: "~10 minutes"
  completed_date: "2026-06-06"
  tasks_completed: 2
  files_created: 0
  files_modified: 3
---

# Phase 01 Plan 03: Production Build + Firebase Deploy + E2E Verification Summary

Vite production build deployed to Firebase Hosting and Firestore security rules live; all four end-to-end verification tests passed on real devices — app loads, Log tap writes to Firestore, real-time sync confirmed on second device, unauthenticated REST access returns 403.

## What Was Built

- **Production build:** `npm run build` produced `dist/` with the React + Vite SPA; deployed to Firebase Hosting via `firebase deploy --only hosting`
- **Firestore security rules deployed:** `firestore.rules` (`allow read, write: if request.auth != null`) deployed via `firebase deploy --only firestore:rules`; rules are live in the Firebase project
- **.gitignore:** `.firebase/` deploy cache directory added to prevent committing Firebase CLI artifacts

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build and deploy — Firestore rules + Hosting | 735aaee | .gitignore |
| 2 | End-to-end verification on two devices | (checkpoint — user verified) | — |

## Verification Results

| Test | Description | Result |
|------|-------------|--------|
| 1 | App loads on phone (no blank screen, no build errors) | PASS |
| 2 | Log tap writes to Firestore (entry visible in Firebase console at subjects/madgy/logs) | PASS |
| 3 | Real-time sync — entry appears on second device without refresh | PASS |
| 4 | Unauthenticated REST read rejected (HTTP 403 / PERMISSION_DENIED) | PASS |

All 5 Phase 1 success criteria from ROADMAP.md are now TRUE:
1. Firebase Hosting URL opens on phone — PASS
2. Tapping Log writes to Firestore — PASS
3. Entry appears on second device without refresh — PASS
4. Unauthenticated REST read returns 403 — PASS
5. Firestore path includes subjects/madgy/ — PASS (established in Plan 02)

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

Inherited from Plan 02 (not introduced in this plan):
- `src/components/TrackableCard.tsx` status line shows em dash placeholder — Phase 3 (DISP-01) will add elapsed-time display
- `src/App.tsx` trackables array hardcoded to Gabapentin only — Phase 2 (TRACK-01) replaces with config-driven list
- `onSnapshot` callback body empty — Phase 3 wires log timestamps to elapsed-time display

These stubs do not affect the plan goal: the walking skeleton is live and all Phase 1 success criteria are met.

## Threat Flags

None. T-03-01 (unauthenticated Firestore REST read) mitigated and verified:
- Firestore security rules deployed with `request.auth != null`
- Test 4 confirmed HTTP 403 for unauthenticated REST access

## Self-Check: PASSED

- Commit 735aaee (Task 1 — build and deploy) — FOUND
- Task 2 verified by user on real devices — all 4 tests PASSED
- `.planning/phases/01-deployed-thin-slice/01-03-SUMMARY.md` — CREATED
