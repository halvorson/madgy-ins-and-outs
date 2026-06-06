# Phase 3: Display & Polish - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add real-time elapsed-time display to every trackable card and complete the layout with section grouping. The `onSnapshot` listener is already wired in App.tsx but its callback is empty — Phase 3 populates it with last-logged state per trackable and ticks the display on an interval. No new logging mechanics, no new Firestore writes — purely display and layout.

</domain>

<decisions>
## Implementation Decisions

### Elapsed-time format
- **D-01:** Format: `Nh Nm ago` — always show both hours and minutes (e.g. `2h 30m ago`, `0h 45m ago`, `14h 0m ago`). Consistent, no special-casing for zero minutes or zero hours.
- **D-02:** Under 1 minute (< 60 seconds since the log timestamp): show `just now` instead of `0h 0m ago`.
- **D-03:** No day units — the app tracks active recovery care; if a pill hasn't been given in 24+ hours that's a problem, but display hours is sufficient (`27h 0m ago` is fine).
- **D-04:** Display auto-updates without page refresh. Implement via `setInterval` — Claude picks the tick interval (30s or 1min is appropriate).

### Last-logged state
- **D-05:** The `onSnapshot` listener subscribed to `/subjects/madgy/logs` already exists in App.tsx but its callback does nothing. Phase 3 fills it in: reduce over the snapshot docs to build a `Record<string, Timestamp>` map of `trackableId → latest timestamp`. Store this map in React state.
- **D-06:** "Latest" means the log entry with the highest `timestamp` value for a given `trackableId`. All caregivers' logs count — the point is "did anyone do this?", not who.
- **D-07:** The elapsed display is computed from this map + the current time. Recomputed on every timer tick and also immediately when the Firestore snapshot updates.

### Never-logged indicator
- **D-08:** A trackable with no entry in the last-logged map shows `Never` (word, not a dash or icon). Replaces the current `—` em-dash placeholder in TrackableCard.

### Layout grouping
- **D-09:** The trackable list is rendered in two sections with small uppercase labels above each group: `Pills` and `Activities`. Group membership comes from the `type` field on each trackable (`'pill'` → Pills section, `'activity'` → Activities section).
- **D-10:** Within each section, order is preserved from the config (Carprofen → Gabapentin → Trazodone; Ate → Peed → Pooped).
- **D-11:** Grouping logic lives in `TrackableList` — it receives the full trackables array and splits it by type before rendering.

### Claude's Discretion
- Timer tick interval (30s recommended — short enough to feel live, not wasteful)
- Tailwind styling for section headers (`text-xs uppercase tracking-wide text-gray-400` or similar)
- Gap between sections vs within sections

</decisions>

<specifics>
## Specific Ideas

- `just now` should feel like a satisfying confirmation that your tap registered — the same card you just tapped instantly shows `just now`. This matters on a mobile device with a touch delay; make the transition fast.
- Section headers should be visually light (small, muted) — they help scan but shouldn't compete with the card content.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — DISP-01 (elapsed-time display, auto-update), DISP-03 (mobile-first, 375px, one-handed)
- `.planning/ROADMAP.md` §Phase 3 — Success criteria (all four must be TRUE)

### Prior phase implementation
- `.planning/phases/01-deployed-thin-slice/01-CONTEXT.md` — D-04/D-05: Firestore data model, log entry schema (`trackableId`, `timestamp`, `loggedBy`)
- `.planning/phases/02-full-trackables-logging/02-CONTEXT.md` — D-01–D-05: trackable list, `type` field, async config function; D-07–D-08: identity picker (not touched in Phase 3 but coexists)
- `src/App.tsx` — Existing `onSnapshot` listener (empty callback), `handleLog`, auth pattern
- `src/components/TrackableCard.tsx` — `&mdash;` placeholder to replace with elapsed text or "Never"
- `src/components/TrackableList.tsx` — Add grouping by `type` field here
- `src/lib/firestore.ts` — `logsCollection(subject)` used by the snapshot

### No external specs
No ADRs or design docs beyond the planning files above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `onSnapshot(logsCollection('madgy'), () => {})` in App.tsx — subscriber exists, callback is the only thing Phase 3 changes
- `TrackableCard` — `<p>` with `&mdash;` (line 30) is the slot for elapsed time; replace with a prop `lastLoggedText: string` or similar
- `TrackableList` — maps over the flat array; Phase 3 adds a split-by-type pass before mapping

### Established Patterns
- State flows App → TrackableList → TrackableCard via props; last-logged map follows the same pattern
- No hooks extracted yet — a `useElapsedTime(timestamp)` hook could encapsulate the timer, but keep it simple unless the planner sees benefit
- Tailwind `min-h-[44px]` on the Log button already satisfies one-handed tap target (DISP-03 §4 already met)

### Integration Points
- Firestore snapshot → `lastLogged: Record<string, Timestamp>` state in App.tsx
- `lastLogged[trackable.id]` → passed as prop to each TrackableCard
- `setInterval` in App.tsx (or a hook) → triggers re-render so elapsed text stays current
- `TrackableList` type split → two `<section>` or `<div>` elements with heading labels

</code_context>

<deferred>
## Deferred Ideas

- Per-caregiver last-logged breakdown ("Me: 2h ago, Wife: 4h ago") — v2 feature (HIST-01 territory)
- Color-coding cards when overdue (e.g. pill not given in >12h turns red) — SCHED-01 territory, not MVP
- Animated elapsed time transition — not needed for MVP

</deferred>

---

*Phase: 03-display-polish*
*Context gathered: 2026-06-06*
