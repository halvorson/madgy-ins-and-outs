---
phase: 01
phase_name: deployed-thin-slice
status: draft
created: 2026-06-06
---

# UI Design Contract — Phase 01: Deployed Thin Slice

## Overview

Phase 1 renders one `TrackableCard` (Gabapentin) with a Log button. The card sits inside
a list container that Phases 2 and 3 will fill out. No elapsed-time display yet — the goal
is a scaffolded UI that proves infra end-to-end and feels like it is on the way to the
real product, not a dev demo.

---

## Design System

| Field | Value | Source |
|-------|-------|--------|
| Tool | None (no component library) | D-12, CONTEXT.md |
| Styling | Tailwind CSS via `@tailwindcss/vite` plugin | D-11, CONTEXT.md |
| Registry | Not applicable | D-12 |
| shadcn/ui | Explicitly excluded | D-12 |

---

## Spacing

8-point scale. All margins, padding, and gaps must be multiples of 4px (Tailwind units).

| Token (Tailwind) | px value | Use |
|-----------------|----------|-----|
| `p-2` / `gap-2` | 8px | Icon-to-text gap, tight internal spacing |
| `p-4` / `gap-4` | 16px | Card internal padding, form element spacing |
| `p-6` / `gap-6` | 24px | Card vertical gap in list |
| `p-8` | 32px | Page horizontal padding (desktop view, if shown) |
| `min-h-[44px]` | 44px | Minimum touch target height for the Log button |

Exception: Log button minimum touch target is 44px tall (mobile tap accuracy).

Source: DISP-03, ROADMAP.md Phase 3 success criteria note on one-handed tappability; defaults applied.

---

## Typography

Exactly 3 sizes, 2 weights. No other sizes or weights are used in this phase.

| Role | Size | Weight | Line-height | Tailwind classes |
|------|------|--------|-------------|-----------------|
| App title | 20px | 600 semibold | 1.2 | `text-xl font-semibold leading-tight` |
| Trackable name | 16px | 600 semibold | 1.2 | `text-base font-semibold leading-tight` |
| Body / status | 14px | 400 regular | 1.5 | `text-sm font-normal leading-relaxed` |

Font family: system-ui stack (Tailwind default `font-sans`). No custom font loaded — keeps
the deployed bundle minimal and avoids a layout shift on first paint.

Source: default for MVP; DISP-03 (legibility on 375px screen).

---

## Color

60/30/10 split. This phase uses a neutral palette — nothing in Phase 1's scope warrants
brand color investment.

| Role | Tailwind value | % | Reserved for |
|------|---------------|---|--------------|
| Dominant surface | `bg-gray-50` (page) | 60% | Page background |
| Secondary surface | `bg-white` (card) | 30% | TrackableCard background |
| Accent | `bg-blue-600` | 10% | Log button only |
| Text primary | `text-gray-900` | — | Trackable name, app title |
| Text secondary | `text-gray-500` | — | Status / placeholder copy |
| Card border | `border-gray-200` | — | Card outline |

Accent (`bg-blue-600`) is reserved exclusively for the Log button. No other element
uses it in Phase 1.

Destructive actions: none in this phase. No delete, no undo.

Source: default for MVP neutral palette; no brand color specified in upstream artifacts.

---

## Component Inventory

Components that must exist after Phase 1. These are the scaffold that Phases 2 and 3
extend — not throwaway shells.

### `App` (root)
- Initializes Firebase anonymous auth on mount
- Subscribes to Firestore real-time listener
- Renders `<TrackableList>`

### `TrackableList`
- Wrapper `<ul>` / `<div>` with vertical gap (`gap-6`)
- In Phase 1: renders exactly one `<TrackableCard>` (Gabapentin)
- Structure must accept an array so Phase 2 can map over config entries

### `TrackableCard`
Props needed in Phase 1:
- `id: string` — `"gabapentin"`
- `displayName: string` — `"Gabapentin"`
- `onLog: () => void` — writes entry to Firestore

Visual structure:
```
┌─────────────────────────────┐
│  Gabapentin                 │  ← text-base font-semibold text-gray-900
│  [status line placeholder]  │  ← text-sm text-gray-500 (Phase 1: empty or "—")
│                  [ Log ]    │  ← blue-600 button, 44px min-height
└─────────────────────────────┘
```

Card: `bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between`

### Log Button
- `bg-blue-600 text-white rounded-md px-4 py-2 min-h-[44px] font-semibold text-sm`
- Label: "Log" (see Copywriting section)
- Disabled state: `opacity-50 cursor-not-allowed` while Firestore write is in-flight
- No confirmation dialog — single tap logs immediately (LOG-01)

---

## Layout

Mobile-first. Single column. Max-width container centered on wider screens.

```
┌──────────────────────────┐  ← viewport (min 320px, tested at 375px)
│  Madgy Tracker           │  ← app title, p-4 header
│  ────────────────────    │
│  ┌────────────────────┐  │
│  │  TrackableCard     │  │  ← card with Log button
│  └────────────────────┘  │
└──────────────────────────┘
```

- Page container: `max-w-md mx-auto px-4 py-6`
- No navigation bar, no sidebar, no tabs in Phase 1
- No horizontal scrolling at 375px width

Source: DISP-03, REQUIREMENTS.md; ROADMAP.md Phase 3 success criteria (375px legibility
is confirmed as the target — Phase 1 must not break it).

---

## Interaction Contract

| Interaction | Trigger | Feedback | Outcome |
|-------------|---------|----------|---------|
| Tap "Log" button | Touch/click | Button enters disabled/opacity-50 state immediately | Firestore write; re-enables on completion |
| Real-time sync | Remote Firestore write by other device | UI updates without any user action | Card reflects new state (Phase 3 adds elapsed time; Phase 1 confirms the entry arrives) |
| Page load | App mount | Anonymous auth initializes silently | User sees card within ~1 second on a good connection |

Loading state on initial auth: no splash screen, no spinner required in Phase 1. The card
renders as soon as auth resolves; if auth takes >500ms, a brief blank card area is acceptable
given the MVP scope.

---

## Copywriting

### Primary CTA
- Label: **"Log"**
- Rationale: shortest possible verb; one tap = one log entry. No noun needed — the card's
  title ("Gabapentin") provides the object.

### Status line (Phase 1 placeholder)
- When no entry exists yet: `—` (em dash, no copy needed)
- Phase 3 will replace this with elapsed-time copy ("3h 12m ago")

### Empty state
- Phase 1 has no true empty state — the one card is always visible (hardcoded)
- If Firestore read returns no prior entries: status line shows `—`

### Error states
| Condition | Copy | Placement |
|-----------|------|-----------|
| Firestore write failed | "Couldn't save. Tap to retry." | Below the Log button, `text-sm text-red-600` |
| Auth failed on load | "Something went wrong. Please reload." | Replaces card area |

### Destructive actions
None in Phase 1. No delete, no edit, no confirmation dialogs required.

Source: LOG-03 (append-only, no edit/delete in MVP).

---

## States

Each component must handle these states in Phase 1:

### TrackableCard
| State | Condition | Rendering |
|-------|-----------|-----------|
| Default | Auth complete, no write in flight | Card visible, Log button active |
| Writing | Firestore write in flight | Log button `opacity-50 cursor-not-allowed` |
| Write error | Firestore write rejected | Error copy below button |
| Loading | Auth not yet resolved | Card visible, Log button disabled |

### App-level
| State | Condition | Rendering |
|-------|-----------|-----------|
| Auth loading | `signInAnonymously` pending | Cards render but Log buttons disabled |
| Auth error | Anonymous auth fails | "Something went wrong. Please reload." message |
| Firestore listening | Real-time listener active | Updates flow in automatically |

---

## Accessibility

- Log button must have `aria-label="Log Gabapentin"` (card title not always adjacent in DOM)
- Color contrast: `bg-blue-600` on `text-white` meets WCAG AA (4.5:1+)
- Touch targets: Log button min 44×44px (Apple HIG / WCAG 2.5.5)
- No motion effects required in Phase 1

---

## What This Phase Does NOT Specify

Intentionally deferred to later phases — do not implement:

| Item | Deferred to |
|------|-------------|
| Elapsed-time readout ("3h 12m ago") | Phase 3 (DISP-01) |
| Me/Wife picker | Phase 2 (LOG-02) |
| Full trackable list | Phase 2 (TRACK-01) |
| Never-logged indicator text | Phase 3 (DISP-01) |
| Mobile-first polish pass | Phase 3 (DISP-03) |
| App icon / favicon | Backlog |

---

## Registry Safety Gate

Not applicable. No shadcn/ui or third-party component registry used in this phase (D-12).

---

*UI-SPEC created: 2026-06-06*
*Phase: 01-deployed-thin-slice*
*Pre-populated from: CONTEXT.md (D-07, D-08, D-09, D-11, D-12), REQUIREMENTS.md (DISP-03, LOG-03, LOG-01), ROADMAP.md (Phase 1 success criteria)*
