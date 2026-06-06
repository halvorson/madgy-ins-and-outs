---
phase: 02
phase_name: Full Trackables & Logging
status: draft
created: 2026-06-06
tool: none
design_system: custom Tailwind CSS v4 (no component library)
---

# UI-SPEC: Phase 2 — Full Trackables & Logging

## 1. Design System

**Tool:** None — no shadcn, no component library. Custom Tailwind CSS v4 utility classes directly
in component files.

**Registry:** Not applicable.

**Tailwind version:** 4.x (`@tailwindcss/vite` plugin, `@import "tailwindcss"` in `index.css`).
No `tailwind.config.*` — using CSS-native configuration.

**Existing baseline established in Phase 1:**
- App shell: `min-h-screen bg-gray-50 font-sans`
- Card: `bg-white rounded-lg border border-gray-200 p-4`
- Primary button (Log): `bg-blue-600 text-white rounded-md px-4 py-2 min-h-[44px] font-semibold text-sm`
- List gap: `gap-6`
- Container: `max-w-md mx-auto px-4 py-6`

All Phase 2 design decisions must be consistent with this baseline.

---

## 2. Spacing

Scale: 8-point grid (multiples of 4px only).

| Token | px | Usage |
|-------|----|-------|
| 1 | 4px | Inline label gap, tight badge spacing |
| 2 | 8px | Button internal padding (y-axis), label-to-value gap |
| 3 | 12px | — (avoid — not on scale) |
| 4 | 16px | Card internal padding (`p-4`), horizontal container padding (`px-4`) |
| 6 | 24px | List item gap (`gap-6`), section spacing |
| 8 | 32px | Header bottom margin |

**Touch targets:** All interactive elements must meet 44px minimum height. Existing Log button uses
`min-h-[44px]`. Identity picker buttons (Me / Wife) must also use `min-h-[44px]`.

---

## 3. Typography

Exactly 3 sizes, 2 weights. From Phase 1 baseline, confirmed.

| Role | Size | Weight | Line Height | Class |
|------|------|--------|-------------|-------|
| Page title | 20px (`text-xl`) | 600 semibold | 1.25 (`leading-tight`) | `text-xl font-semibold leading-tight` |
| Card label / Button | 14px (`text-sm`) | 600 semibold | 1.5 (`leading-relaxed`) | `text-sm font-semibold` |
| Supporting / meta text | 14px (`text-sm`) | 400 regular | 1.5 (`leading-relaxed`) | `text-sm font-normal leading-relaxed` |

**"I am:" header label:** `text-sm font-semibold text-gray-600` — same size as card meta, semibold
to distinguish it as a label.

No additional font sizes may be introduced in this phase.

---

## 4. Color

60/30/10 split. From Phase 1 baseline.

| Role | Color | Usage |
|------|-------|-------|
| 60% dominant surface | `gray-50` (#F9FAFB) | Page background (`bg-gray-50`) |
| 30% secondary surface | `white` / `gray-200` | Cards (`bg-white`, `border-gray-200`) |
| 10% accent | `blue-600` (#2563EB) | **Reserved for:** primary Log button (`bg-blue-600`), active identity picker button |
| Text primary | `gray-900` | Card headings, page title |
| Text secondary | `gray-500` | Card meta text (last logged placeholder) |
| Text label | `gray-600` | "I am:" label, picker section label |
| Destructive / error | `red-600` | Error messages only (`text-red-600`) |
| Disabled surface | `blue-600 opacity-50` | Disabled Log button (existing pattern: `opacity-50 cursor-not-allowed`) |

**Identity picker button states:**

| State | Classes |
|-------|---------|
| Selected (active identity) | `bg-blue-600 text-white font-semibold` |
| Unselected | `bg-white text-gray-700 border border-gray-300 font-semibold` |
| Both buttons | `rounded-md px-5 py-2 min-h-[44px] text-sm` |

No new colors may be introduced. The `blue-600` accent is the single highlight color for both the
Log button and the active identity — this ensures visual consistency and keeps the color contract
tight.

---

## 5. Layout & Structure

### Page structure (top to bottom)

```
┌─────────────────────────────────────────┐
│  max-w-md mx-auto px-4 py-6             │
│                                         │
│  "Madgy Tracker"          (h1)          │
│                                         │
│  ┌─ Identity Bar ──────────────────┐    │
│  │  I am:  [ Me ]  [ Wife ]        │    │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─ Trackable Card ─────────────────┐   │
│  │  Carprofen            [ Log ]    │   │
│  └──────────────────────────────────┘   │
│  ┌─ Trackable Card ─────────────────┐   │
│  │  Gabapentin           [ Log ]    │   │
│  └──────────────────────────────────┘   │
│  ... (Trazodone, Ate, Peed, Pooped)     │
└─────────────────────────────────────────┘
```

**Trackable order (fixed, from CONTEXT.md D-01/D-02):**
1. Carprofen
2. Gabapentin
3. Trazodone
4. Ate
5. Peed
6. Pooped

No section headers in Phase 2. Flat list only.

**Identity bar placement:** Directly below the page `h1`, above the trackable list. Margin below
the bar: `mb-6` (24px) to match list gap rhythm.

**Identity bar internal layout:**
```
flex items-center gap-3
"I am:" label — Me button — Wife button
```
Full bar container: `mb-6 flex items-center gap-3`

---

## 6. Component Inventory

### 6.1 Existing components (Phase 1 — extend, do not recreate)

**`TrackableCard`** — Add `disabled: boolean` prop.
- When `disabled={true}`: Log button gets `opacity-50 cursor-not-allowed` and `disabled` attribute.
- `disabled` applies only to the Log button, not the card itself.
- Error display is unchanged.

**`TrackableList`** — Add `disabled: boolean` prop; thread it down to each `TrackableCard`.
- No structural changes.

**`App`** — Add identity state, `getTrackables()` call, localStorage read/write.

### 6.2 New components (Phase 2)

**`IdentityPicker`** (inline in `App.tsx` or extracted as a small component)
- Props: `value: 'Me' | 'Wife' | null`, `onChange: (identity: 'Me' | 'Wife') => void`
- Renders label + two buttons
- Selected button: `bg-blue-600 text-white`
- Unselected button: `bg-white text-gray-700 border border-gray-300`
- Both buttons: `rounded-md px-5 py-2 min-h-[44px] text-sm font-semibold`
- No animation; plain state swap.

### 6.3 New lib files (no UI)

**`src/lib/trackables.ts`** — `getTrackables()` async function. No visual contract.

---

## 7. Interaction States

### Log button states

| State | Visual | Condition |
|-------|--------|-----------|
| Enabled | `bg-blue-600 text-white` | Identity selected, not writing |
| Disabled (no identity) | `bg-blue-600 text-white opacity-50 cursor-not-allowed` | No identity set |
| Writing (in-flight) | `bg-blue-600 text-white opacity-50 cursor-not-allowed` | Firestore write in progress |
| Error | Button re-enabled; error text shown below | Write threw |

The `disabled` attribute must be present (not just visual styling) in all disabled states so
assistive technology and browser defaults are correct.

### Identity picker states

| State | Visual |
|-------|--------|
| Nothing selected | Both buttons in unselected style; Log buttons all disabled |
| "Me" selected | Me button `bg-blue-600 text-white`; Wife button `bg-white border` |
| "Wife" selected | Wife button `bg-blue-600 text-white`; Me button `bg-white border` |

Switching identity is instant — no confirm dialog. The new identity applies to all subsequent Log
taps. In-flight logs are unaffected (they already captured identity at tap time).

### Loading state (trackables list)

While `getTrackables()` is resolving (fast — static array, but still async), show nothing in the
list area. No spinner, no skeleton. Auth loading already shows nothing; the same pattern applies.
Duration is effectively zero for a static array; the guard prevents flash in any future slow path.

---

## 8. Copywriting

### Labels

| Element | Copy |
|---------|------|
| Page title | `Madgy Tracker` |
| Identity label | `I am:` |
| Identity button — owner | `Me` |
| Identity button — wife | `Wife` |
| Log button | `Log` |

### Empty state

No empty state in Phase 2. The trackable list always shows all 6 items once loaded. No "nothing
here" state exists.

### Error states

| Situation | Copy |
|-----------|------|
| Log write fails | `Couldn't save. Tap to retry.` (existing, Phase 1) |
| Auth fails on load | `Something went wrong. Please reload.` (existing, Phase 1) |

No new error copy in Phase 2.

### Destructive actions

None in Phase 2. No confirmations needed.

---

## 9. Accessibility

- All interactive elements use native HTML `<button>` elements (no `<div>` click handlers).
- Disabled Log buttons use the `disabled` attribute, not just CSS.
- Identity picker buttons use descriptive `aria-label` if the button text alone is insufficient:
  `aria-label="Set identity to Me"` / `aria-label="Set identity to Wife"`.
- Selected identity button should carry `aria-pressed="true"`; unselected `aria-pressed="false"`.
- Minimum touch target: 44px height on all buttons (existing `min-h-[44px]` pattern).
- Color contrast: `blue-600` (#2563EB) on white meets WCAG AA for text at 14px semibold
  (4.5:1 required; blue-600 on white is ~4.63:1).

---

## 10. Pre-Population Sources

| Decision | Source | Value |
|----------|--------|-------|
| Design system: none | Codebase scan | No `components.json`, no config file |
| Tailwind v4 | `package.json` | `@tailwindcss/vite: ^4.3.0` |
| Color palette | Phase 1 codebase | gray-50, white, gray-200, blue-600, gray-900, gray-500, red-600 |
| Card layout | `TrackableCard.tsx` | `bg-white rounded-lg border border-gray-200 p-4` |
| Button style | `TrackableCard.tsx` | `bg-blue-600 text-white rounded-md px-4 py-2 min-h-[44px] font-semibold text-sm` |
| Log button disabled pattern | `TrackableCard.tsx` | `opacity-50 cursor-not-allowed` |
| Trackable order | CONTEXT.md D-01/D-02 | Pills first, then activities |
| Identity values | CONTEXT.md D-09 | `"Me"` and `"Wife"` |
| Picker memory | CONTEXT.md D-10 | `localStorage` key `madgy_caregiver` |
| Disabled gate | CONTEXT.md D-08 | Hard gate: Log disabled until identity set |
| Loading state style | CONTEXT.md (Claude discretion) | No spinner/skeleton — show nothing |
| Picker visual style | CONTEXT.md (Claude discretion) | Selected: blue-600 fill; unselected: white + border |
| Typography | Phase 1 codebase | text-xl/text-base/text-sm, font-semibold/font-normal |
| Touch targets | Phase 1 codebase | `min-h-[44px]` |
| Container | `App.tsx` | `max-w-md mx-auto px-4 py-6` |

---

## 11. Out of Scope (Phase 2)

Per CONTEXT.md `<deferred>`:

- Elapsed-time display ("3h 12m ago") — Phase 3
- Never-logged indicator — Phase 3
- Section headers ("Pills" / "Activities") grouping — Phase 3
- Any layout polish beyond the identity bar — Phase 3

---

*Phase: 02-full-trackables-logging*
*UI-SPEC created: 2026-06-06*
*Status: draft — awaiting checker validation*
