# Madgy Tracker

## What This Is

A real-time, shared single-page web app for tracking the care of Madgy (Magellan), a dog recovering from tumor-removal surgery and on a multi-medication regimen. The owner and his wife use it on their separate phones to tap-log care events — pills given, ate, peed, pooed — and instantly see when each was last done, so neither double-doses a med nor wonders "did anyone already do this?" Hosted on Firebase Hosting with a Firestore backend.

## Core Value

At a glance, both caregivers can see when each care event last happened — so meds are never missed or doubled.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Caregiver can log a trackable as done "now" with one tap — Phase 1
- ✓ Each log entry records who did it via a quick Me/Wife picker (no accounts) — Phase 2
- ✓ Trackables (pills + activities) are defined via a config layer (hardcoded/seeded for MVP, but accessed through an abstracted call so it can become dynamic later) — Phase 2
- ✓ One person's log appears on the other person's screen in real time (no manual refresh) — Phase 1 (listener active) / Phase 3 (elapsed time display)
- ✓ Caregiver can see, for each trackable, how long ago it was last logged — Phase 3
- ✓ Access is gated by invisible Firebase Anonymous Auth + Firestore rules requiring auth, served from an obscure Hosting URL — Phase 1

### Active

<!-- Current scope. Building toward these. MVP. -->

*(none — all MVP requirements validated)*

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. MVP exclusions, most are near-term follow-ups. -->

- View the full historical log of all entries — first next feature after MVP, not needed to ship value
- Delete or edit bad/erroneous data points — pairs with the full-log feature; MVP is append-only
- Pill schedules with "due now" logic (e.g. every-12-hours → show as due) — high-value follow-up, but adds time math + config; MVP just shows elapsed time
- Backdating / custom timestamps when logging — MVP logs current time only; arrives with edit/full-log work
- Multiple subjects/pets/humans (e.g. second pet, the kids) — data model will not preclude it, but MVP tracks only Madgy
- Editable trackable/pill config UI — MVP seeds config in code; the config call is abstracted so a UI can replace it later
- User accounts, real login, roles/permissions — deliberately avoided; anonymous auth is invisible and sufficient for a private family tool

## Context

- Personal, low-stakes family tool built under time pressure during a pet's post-surgery recovery — shipping fast matters more than polish.
- Two known users (owner + wife), both on phones. Mobile-first UX is essential; desktop is incidental.
- Owner has a clear technical model already: trackable configs → a log of actions per trackable → Firestore to store them → a frontend that writes to it.
- Stated future direction: generalize "trackables" and introduce "subjects" so the same app could track multiple pets or even family members (a recent kid pinkeye episode inspired this). The MVP data model should anticipate this without building it.
- "Everything is a trackable" — pills and ate/peed/pooed are one unified concept, not two separate systems.

## Constraints

- **Hosting**: Firebase Hosting — chosen by owner; deploy target is fixed.
- **Database**: Firestore — real-time sync requirement makes its native live updates the natural fit.
- **Auth**: No real login. Firebase Anonymous Auth only (invisible to users), so Firestore rules can require `request.auth != null` without a sign-in screen.
- **Frontend**: Lightweight framework (e.g. React + Vite) — owner preference; chosen for easy extension to the planned follow-up features (full log, schedules, config UI).
- **Form factor**: Single-page app, mobile-first.
- **Timeline**: Ship the MVP quickly — the dog is in active recovery now.

## Key Decisions

<!-- Decisions that constrain future work. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Unified "trackable" concept for pills + activities | Avoids two parallel systems; matches owner's mental model and eases future generalization | Shipped Phase 2 — 6 trackables from single getTrackables() config function |
| Hardcode/seed trackable config behind an abstracted call | Fast to ship MVP while leaving a clean seam for a future dynamic/UI-driven config | Shipped Phase 2 — getTrackables() returns static array; swappable without touching TrackableList/Card |
| Firestore for storage + real-time | Two caregivers need each other's updates live; Firestore does this natively | Shipped Phase 1 — onSnapshot listener active; elapsed-time display deferred to Phase 3 |
| Firebase Anonymous Auth (no login UI) + obscure URL | Keeps random/bot traffic out with zero user friction; no accounts to manage | Shipped Phase 1 — invisible anonymous auth, Firestore rules enforce auth != null |
| Lightweight framework (React/Vite) over vanilla | Planned follow-ups (full log, schedules, config UI) are easier to grow into | Shipped Phase 1 — React/Vite deployed to Firebase Hosting |
| Append-only logging, "now" timestamps for MVP | Defers edit/delete/backdate complexity to the full-log feature | Shipped Phase 1 — addLog() writes serverTimestamp(); no edit/delete UI |
| Data model leaves room for multiple "subjects" | Future multi-pet / family-member tracking shouldn't require a rewrite | Shipped Phase 1 — logsCollection('madgy') and addLog('madgy', ...) use subject param throughout |
| loggedBy identity stored per-log, not per-session | Both caregivers on same Firebase project; identity attribution is per-entry not per-auth token | Shipped Phase 2 — Me/Wife picker persists to localStorage; passed as loggedBy to every addLog() call |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-06 after Phase 2*
