# Phase 2: Full Trackables & Logging - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the reasoning.

**Date:** 2026-06-06
**Phase:** 02-full-trackables-logging
**Mode:** discuss (default interactive)
**Areas discussed:** Trackable list, Config layer shape, Me/Wife picker UX, Picker memory

---

## Area 1: Trackable list

| Question | Options presented | Decision |
|----------|------------------|----------|
| What are all the trackables? | Free text entry | Ate, Peed, Pooped, Carprofen, Gabapentin, Trazodone |
| How should they be ordered? | Pills first then activities / Activities first then pills / Alphabetical / You decide | Pills first, then activities |

**Rationale:** Pills are higher-stakes (medication timing matters more than activities), so they lead. Activities (Ate/Peed/Pooped) follow.

---

## Area 2: Config layer shape

| Question | Options presented | Decision |
|----------|------------------|----------|
| Config layer structure | Function returning array / Exported const / Async function | Async function returning Promise |
| Extra fields on trackable? | id + displayName only / Add type field / You decide | Add `type: 'pill' \| 'activity'` |

**Rationale:** Async function means callers are already written to handle a dynamic source (API, Firestore) — no call-site changes needed when the source becomes dynamic. The `type` field costs nothing now and unlocks UI differentiation (color, icons, grouping) without a schema change later.

---

## Area 3: Me/Wife picker UX

| Question | Options presented | Decision |
|----------|------------------|----------|
| Where does picker appear? | Global header selector / Per-tap inline / Modal per tap | Global "I am:" selector at top of page |
| What if no identity set and Log tapped? | Disable buttons / Prompt inline / Allow with 'unknown' | Disable Log buttons until identity selected |

**Rationale:** Global selector = pick once, tap freely. Pairs naturally with localStorage persistence — each phone effectively becomes "that person's device." Disabled Log buttons are a hard gate with no ambiguity for a medication tracker where double-dosing is the primary risk.

---

## Area 4: Picker memory

| Question | Options presented | Decision |
|----------|------------------|----------|
| Remember identity between sessions? | localStorage (persists) / Session only / Always unpicked | localStorage — persists across sessions |

**Rationale:** Personal devices naturally map to one caregiver. Owner's phone = Me, wife's phone = Wife. localStorage makes this zero-friction after the first pick.

---

## No corrections made

All selections were the recommended default except:
- Config layer: user chose "Async function" over the recommended "Function returning array" — a deliberate future-proofing choice.
- Trackable type field: user added `type: 'pill' | 'activity'` — reasonable extensibility.

## Deferred ideas

- None raised during discussion — scope stayed within Phase 2 boundary.
