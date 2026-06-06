# Phase 2: Full Trackables & Logging - Context

**Gathered:** 2026-06-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add all care trackables (every pill plus ate, peed, pooped) via an abstracted config layer, and wire the Me/Wife identity picker so every log entry records who did it. Real-time elapsed-time display is Phase 3. This phase is purely about seeding the full trackable list, making the config call async-ready, and capturing caregiver identity per log entry.

</domain>

<decisions>
## Implementation Decisions

### Trackable list
- **D-01:** Six trackables total: Carprofen, Gabapentin, Trazodone (pills), then Ate, Peed, Pooped (activities).
- **D-02:** Display order is pills first, then activities — meds are higher-stakes so they lead.
- **D-03:** IDs: `carprofen`, `gabapentin`, `trazodone`, `ate`, `peed`, `pooped`.

### Config layer
- **D-04:** Config is an async function: `export async function getTrackables(): Promise<Trackable[]>`. Body is a static array for now; callers use `await` so the source can later become a Firestore or API call without changing App.tsx.
- **D-05:** Each trackable carries `{ id: string, displayName: string, type: 'pill' | 'activity' }`. The `type` field enables future UI differentiation (color, icon, section grouping) without a schema migration.
- **D-06:** The config function lives in `src/lib/trackables.ts` (new file). App.tsx calls it on mount and stores the result in state.

### Me/Wife picker UX
- **D-07:** Global "I am:" selector in the page header — two buttons (Me / Wife) shown at the top. Identity is set once per session (or persisted — see D-09) and applies to all subsequent Log taps.
- **D-08:** Log buttons on all TrackableCards are disabled (visually grayed, `disabled` attr) until an identity is selected. No tap → no log → no ambiguity. This is a hard gate, not a soft warning.
- **D-09:** Caregiver names to store: `"Me"` and `"Wife"`. These are the `loggedBy` values written to Firestore.

### Picker memory
- **D-10:** Identity is persisted via `localStorage` under a key like `madgy_caregiver`. On app load, the stored value (if any) pre-selects the identity and enables Log buttons immediately. The user can always switch by tapping the other button.

### firestore.ts changes
- **D-11:** `addLog(subject, trackableId)` gains a required `loggedBy: string` parameter. Hardcoded `'caregiver'` is removed. All callers pass the active identity.

### Claude's Discretion
- Exact Tailwind styling for the "I am:" selector (button states: selected vs unselected)
- Loading state while `getTrackables()` resolves (skeleton or spinner — fast in practice since it's a static array)
- localStorage key name

</decisions>

<specifics>
## Specific Ideas

- The "I am:" selector should feel like a toggle — the active identity is visually highlighted, the inactive one is muted. This makes it instantly scannable at a glance.
- Phones are personal devices — localStorage persistence means each phone naturally becomes "that caregiver's phone" without any explicit pairing. The owner's phone always starts as Me; the wife's always starts as Wife.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — TRACK-01 (config layer), LOG-01 (one-tap log), LOG-02 (Me/Wife picker + loggedBy stored)
- `.planning/PROJECT.md` — Key decisions (unified trackable concept, append-only logging, anonymous auth)
- `.planning/ROADMAP.md` §Phase 2 — Success criteria that verification will check against

### Prior phase implementation
- `.planning/phases/01-deployed-thin-slice/01-CONTEXT.md` — D-04/D-05: Firestore data model (`/subjects/{subject}/logs/{logId}`), LogEntry schema (`trackableId`, `timestamp`, `loggedBy`, `note?`)
- `src/lib/firestore.ts` — Current `addLog()` signature and `LogEntry` type to update
- `src/components/TrackableCard.tsx` — Existing card component to extend with `disabled` prop
- `src/App.tsx` — Current wiring of auth, Firestore listener, and static trackable list to replace with config call

### No external specs
No ADRs or design docs beyond the planning files above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TrackableCard` — accepts `id`, `displayName`, `onLog`; add `disabled: boolean` prop to gate the Log button
- `TrackableList` — accepts `trackables[]` + `onLog` handler; no changes needed unless adding grouping
- `firestore.ts` `logsCollection(subject)` — unchanged; `addLog()` needs `loggedBy` param added
- `App.tsx` auth + Firestore listener pattern — reuse as-is; add `getTrackables()` call in `useEffect` after auth resolves

### Established Patterns
- Anonymous auth resolves before any Firestore interaction — Phase 2 identity selection can happen in parallel (localStorage read is sync), but Log taps still gate on auth
- `onLog: () => Promise<void>` callback pattern on TrackableCard — extend to pass `loggedBy` through the call chain: App → TrackableList → TrackableCard

### Integration Points
- `src/lib/trackables.ts` (new) → imported by `App.tsx` to replace the inline hardcoded array
- `localStorage` → read on mount in `App.tsx` to restore identity; written when user taps Me or Wife
- `firestore.ts addLog` → updated signature flows up to `handleLog` in `App.tsx`

</code_context>

<deferred>
## Deferred Ideas

- Elapsed-time display ("3h 12m ago") — Phase 3 (DISP-01)
- Never-logged state display — Phase 3
- Full trackable list layout polish (grouping headers "Pills" / "Activities") — Phase 3 or discretion

</deferred>

---

*Phase: 02-full-trackables-logging*
*Context gathered: 2026-06-06*
