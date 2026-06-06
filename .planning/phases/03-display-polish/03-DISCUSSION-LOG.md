# Phase 3: Display & Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the reasoning.

**Date:** 2026-06-06
**Phase:** 03-display-polish
**Mode:** discuss --all (all areas auto-selected, interactive discussion)
**Areas discussed:** Elapsed-time format, Never-logged indicator, Layout grouping

---

## Area 1: Elapsed-time format

| Question | Options | Decision |
|----------|---------|----------|
| Time format style | `Nh Nm ago` always / Smart shorthand / Days+hours beyond 24h | `Nh Nm ago` — both units always |
| "Just now" threshold | < 1 minute / < 30 seconds / No just-now | Under 1 minute |

**Rationale:** Consistent format avoids parsing ambiguity — you always see two numbers. "just now" under a minute is natural UX feedback after a tap, especially important since this is a medication tracker (you want to see your tap registered).

---

## Area 2: Never-logged indicator

| Question | Options | Decision |
|----------|---------|----------|
| Text for never-logged | "Never" / em dash / "Not yet logged" | "Never" |

**Rationale:** "Never" is unambiguous — it reads as a state, not a loading placeholder. The em dash `—` could be mistaken for "still loading" on a slow connection.

---

## Area 3: Layout grouping

| Question | Options | Decision |
|----------|---------|----------|
| Section headers? | Pills/Activities headers / Flat list / You decide | Section headers: "Pills" / "Activities" |
| Additional polish? | No / Describe specific changes | No — elapsed time + headers is enough |

**Rationale:** The `type` field was added in Phase 2 specifically for this. Headers give a quick spatial anchor when scanning one-handed — pills are always in the top half, activities always in the bottom half.

---

## No corrections requested

All selections were recommended defaults. Discussion stayed within Phase 3 scope.

## Deferred ideas

- Per-caregiver breakdown (Me: 2h ago vs Wife: 4h ago) — v2 / HIST-01 territory
- Overdue color-coding — SCHED-01 territory
- Animated transitions — not needed for MVP
