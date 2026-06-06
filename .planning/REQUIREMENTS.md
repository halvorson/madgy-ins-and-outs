# Requirements: Madgy Tracker

**Defined:** 2026-06-06
**Core Value:** At a glance, both caregivers can see when each care event last happened — so meds are never missed or doubled.

## v1 Requirements

Requirements for the initial MVP release. Each maps to a roadmap phase.

### Trackables

- [ ] **TRACK-01**: App provides a seeded set of trackables (each pill plus ate, peed, pooed) defined through an abstracted config layer, so the source can later become dynamic without changing consumers
- [ ] **TRACK-02**: Trackables and log entries are stored in Firestore under a structure that does not preclude adding multiple subjects (pets/people) later

### Logging

- [ ] **LOG-01**: User can log a trackable as done at the current time with a single tap
- [ ] **LOG-02**: User selects who performed the action (Me/Wife picker) and it is recorded with the entry, without any login
- [ ] **LOG-03**: Each logged action is persisted to Firestore as an append-only entry (no edit/delete in MVP)

### Display

- [ ] **DISP-01**: For each trackable, the app shows how long ago it was last logged (e.g. "3h 12m ago"), or indicates it has never been logged
- [ ] **DISP-02**: When either caregiver logs an action, the other caregiver's screen updates in real time without a manual refresh
- [ ] **DISP-03**: The app is a mobile-first single-page layout usable one-handed on a phone

### Access & Infrastructure

- [ ] **INFRA-01**: App is built with a lightweight framework (React + Vite or similar) and deployed to Firebase Hosting
- [ ] **INFRA-02**: Users are authenticated invisibly via Firebase Anonymous Auth (no sign-in screen)
- [ ] **INFRA-03**: Firestore security rules require authentication for all reads and writes

## v2 Requirements

Deferred to future releases. Tracked but not in the current roadmap.

### History & Editing

- **HIST-01**: Caregiver can view the full chronological log of all entries
- **HIST-02**: Caregiver can delete an erroneous entry
- **HIST-03**: Caregiver can edit an entry or backdate a log to a custom time

### Scheduling

- **SCHED-01**: A trackable can define a recurrence (e.g. every 12 hours) and the app shows when it is due/overdue

### Configuration & Subjects

- **CFG-01**: Caregiver can add, rename, or remove trackables from the UI
- **SUBJ-01**: App supports multiple subjects (multiple pets and/or people) with per-subject trackables and logs

## Out of Scope

Explicitly excluded for now. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User accounts / real login / roles | Anonymous auth is invisible and sufficient for a private two-person family tool |
| Passcode / PIN gate UI | Obscure URL + anonymous-auth-gated Firestore rules deemed enough; no added friction wanted |
| Notifications / reminders | Not requested for MVP; depends on scheduling (SCHED-01) which is itself deferred |
| Native mobile app | Web SPA on Firebase Hosting covers both phones |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TRACK-01 | TBD | Pending |
| TRACK-02 | TBD | Pending |
| LOG-01 | TBD | Pending |
| LOG-02 | TBD | Pending |
| LOG-03 | TBD | Pending |
| DISP-01 | TBD | Pending |
| DISP-02 | TBD | Pending |
| DISP-03 | TBD | Pending |
| INFRA-01 | TBD | Pending |
| INFRA-02 | TBD | Pending |
| INFRA-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 0 (roadmap not yet created)
- Unmapped: 11 ⚠️

---
*Requirements defined: 2026-06-06*
*Last updated: 2026-06-06 after initial definition*
