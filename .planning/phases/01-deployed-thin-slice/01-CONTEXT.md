# Phase 1: Deployed Thin Slice - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Stand up the full Firebase infrastructure (project creation, Hosting, Firestore, Anonymous Auth), wire it to a React+Vite SPA, and deploy a live URL where one hardcoded trackable (Gabapentin) can be logged with a single tap and instantly appear on a second device. No caregiver picker yet — the thin slice proves the infra stack end-to-end.

</domain>

<decisions>
## Implementation Decisions

### Firebase Project Setup
- **D-01:** Firebase project does not exist yet — creation is part of Phase 1 scope. Create a new project, enable Firestore (Native mode), Hosting, and Anonymous Auth.
- **D-02:** Use the Spark (free tier) plan. No Cloud Functions needed for MVP; Firestore + Hosting + Auth are all free on Spark.
- **D-03:** Firebase config (API keys, project ID, etc.) stored in a `.env` file using `VITE_` prefix. Never committed to source control; `.env.example` committed as a template.

### Firestore Data Model
- **D-04:** Log entries are nested by subject: `/subjects/{subject}/logs/{logId}`. The subject document ID is `"madgy"` hardcoded for MVP.
- **D-05:** Each log entry document contains: `{ trackableId: string, timestamp: Timestamp, loggedBy: string, note?: string }`. The `note` field is optional and empty for MVP taps but included in the schema now to avoid a migration later.
- **D-06:** The subject path satisfies TRACK-02's multi-subject requirement — adding a new subject is a new path, not a schema change.

### UI Scaffold Depth
- **D-07:** Build a scaffolded UI, not a bare-bones one-button throwaway. Phase 1 renders one `TrackableCard` component inside a list — the same structure Phases 2 and 3 will populate with all trackables. This avoids a Phase 2 rewrite.
- **D-08:** The thin-slice trackable is "Gabapentin" (hardcoded `trackableId: "gabapentin"`, display name: "Gabapentin"). Phase 2 replaces this with the full config-driven list.
- **D-09:** The card shows: trackable name + a "Log" button. Real-time last-logged time is Phase 3; Phase 1 just confirms the entry lands in Firestore and appears on a second device (DISP-02).

### Toolchain
- **D-10:** React + Vite, TypeScript. Use Vite's `react-ts` template as the starting point.
- **D-11:** Tailwind CSS for styling. Added to the Vite project via the official `@tailwindcss/vite` plugin.
- **D-12:** No component library (no shadcn/ui). The app's UI is simple enough that custom Tailwind classes are sufficient.

### Claude's Discretion
- Anonymous auth initialization timing (on app mount, before Firestore writes)
- Exact Firestore security rules implementation (require `request.auth != null` for all reads/writes)
- Firebase Hosting config (single-page app rewrites to `index.html`)
- Folder structure within `src/` (components/, lib/, hooks/ or similar)

</decisions>

<specifics>
## Specific Ideas

- The app's primary value is "at a glance, both caregivers can see when each event last happened" — the Phase 1 UI should feel like it's on the way to that, not a dev demo. Scaffolded component structure matters.
- Madgy's subject ID in Firestore is `"madgy"` (lowercase, no spaces) — keep it human-readable in the console.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Constraints
- `.planning/REQUIREMENTS.md` — Full requirement list; Phase 1 covers INFRA-01, INFRA-02, INFRA-03, TRACK-02, LOG-03, DISP-02
- `.planning/PROJECT.md` — Key decisions table (auth strategy, data model rationale, append-only logging)
- `.planning/ROADMAP.md` §Phase 1 — Success criteria that verification will check against

### No external specs
No ADRs or design docs exist yet — all requirements are captured in the planning files above and decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing components, hooks, or utilities.

### Established Patterns
- None established yet. Phase 1 sets the patterns that later phases follow.

### Integration Points
- Vite dev server → Firebase Emulator Suite (optional for local dev)
- React app → Firebase SDK (`firebase/app`, `firebase/firestore`, `firebase/auth`)
- Firebase Hosting → serves the Vite build output (`dist/`)

</code_context>

<deferred>
## Deferred Ideas

- Real-time elapsed-time display ("3h 12m ago") — Phase 3 (DISP-01)
- Me/Wife picker on log tap — Phase 2 (LOG-02)
- Full trackable list from config — Phase 2 (TRACK-01)
- Firebase Emulator Suite setup for local dev — useful but not blocking MVP; defer to backlog

</deferred>

---

*Phase: 01-deployed-thin-slice*
*Context gathered: 2026-06-06*
