# Roadmap: Madgy Tracker

## Overview

Three vertical slices from zero to shipped MVP. Phase 1 gets a real, deployed app that logs one event and syncs live between phones. Phase 2 broadens to all trackables with the full logging UX including the who-picker. Phase 3 completes the display layer — elapsed-time readouts for every trackable and a polished mobile-first layout.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Deployed Thin Slice** - Firebase infra wired, one trackable logs and syncs live on a deployed URL
- [x] **Phase 2: Full Trackables & Logging** - All trackables seeded via abstracted config, one-tap logging with Me/Wife picker (completed 2026-06-06)
- [ ] **Phase 3: Display & Polish** - Elapsed-time readouts for all trackables, never-logged state, mobile-first layout complete

## Phase Details

### Phase 1: Deployed Thin Slice

**Goal**: A real deployed app that lets both caregivers tap to log one event and instantly see it appear on each other's screen
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, TRACK-02, LOG-03, DISP-02
**Success Criteria** (what must be TRUE):

  1. Opening the Firebase Hosting URL on a phone shows the app (no blank screen, no build errors)
  2. Tapping a log button writes an entry to Firestore that is immediately visible in the Firebase console
  3. The same entry appears on a second device without refreshing the page
  4. An unauthenticated direct Firestore read (e.g. via REST) is rejected by security rules
  5. The Firestore data structure includes a subject field (even if hardcoded to "madgy") so it does not preclude future multi-subject use

**Plans**: 3 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Vite scaffold, Firebase SDK wiring, env config, Hosting config (manual Firebase project creation checkpoint)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Anonymous auth, Firestore data layer, React component tree (App/TrackableList/TrackableCard), security rules

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — Production build and Firebase deploy, end-to-end verification on two devices

### Phase 2: Full Trackables & Logging

**Goal**: All care trackables (every pill plus ate, peed, pooed) are available via an abstracted config layer, and caregivers can log any of them with a single tap and attribute the action to themselves
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: TRACK-01, LOG-01, LOG-02
**Success Criteria** (what must be TRUE):

  1. All pills and ate/peed/pooed trackables appear in the app, driven by a config function (not inline JSX literals)
  2. Tapping any trackable's button logs it as done at the current time with a single tap
  3. Before logging, a Me/Wife picker is presented and the chosen name is stored with the entry in Firestore
  4. Swapping the config function's data source requires no changes to the components that render trackables

**Plans**: 2 plans
**UI hint**: yes

Plans:
**Wave 1**

- [x] 02-01-PLAN.md — trackables.ts config layer, firestore.ts loggedBy param, IdentityPicker component

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-02-PLAN.md — Wire App.tsx, TrackableList, TrackableCard; end-to-end human verification

### Phase 3: Display & Polish

**Goal**: Every trackable shows how long ago it was last done (or that it has never been done), and the layout is comfortable to use one-handed on a phone
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: DISP-01, DISP-03
**Success Criteria** (what must be TRUE):

  1. Each trackable shows a human-readable elapsed time (e.g. "3h 12m ago") that updates without a page refresh
  2. A trackable that has never been logged shows a clear "never" or equivalent indicator instead of a time
  3. The full trackable list is legible and tappable on a 375px-wide phone screen without horizontal scrolling
  4. Buttons are large enough to tap accurately one-handed

**Plans**: 2 plans
**UI hint**: yes

Plans:
**Wave 1**

- [ ] 03-01-PLAN.md — formatElapsed utility (src/lib/elapsed.ts), App.tsx snapshot callback + setInterval tick + lastLogged state

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 03-02-PLAN.md — TrackableCard lastLoggedText prop, TrackableList grouped sections (Pills/Activities), human verification

## Backlog

### Phase 999.1: Extrapolate this to work for multiple animals / people (BACKLOG)

**Goal:** [Captured for future planning]
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 999.2: Implement auth (BACKLOG)

**Goal:** [Captured for future planning]
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

### Phase 999.3: Create shared objects and auth-based permissioning per object (maybe has to be done as a part of 999.1) (BACKLOG)

**Goal:** [Captured for future planning]
**Requirements:** TBD
**Plans:** 0 plans

Plans:
- [ ] TBD (promote with /gsd:review-backlog when ready)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Deployed Thin Slice | 3/3 | Complete | 2026-06-06 |
| 2. Full Trackables & Logging | 2/2 | Complete    | 2026-06-06 |
| 3. Display & Polish | 0/2 | Not started | - |
