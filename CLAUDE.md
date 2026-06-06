<!-- GSD:project-start source:PROJECT.md -->
## Project

**Madgy Tracker**

A real-time, shared single-page web app for tracking the care of Madgy (Magellan), a dog recovering from tumor-removal surgery and on a multi-medication regimen. The owner and his wife use it on their separate phones to tap-log care events — pills given, ate, peed, pooed — and instantly see when each was last done, so neither double-doses a med nor wonders "did anyone already do this?" Hosted on Firebase Hosting with a Firestore backend.

**Core Value:** At a glance, both caregivers can see when each care event last happened — so meds are never missed or doubled.

### Constraints

- **Hosting**: Firebase Hosting — chosen by owner; deploy target is fixed.
- **Database**: Firestore — real-time sync requirement makes its native live updates the natural fit.
- **Auth**: No real login. Firebase Anonymous Auth only (invisible to users), so Firestore rules can require `request.auth != null` without a sign-in screen.
- **Frontend**: Lightweight framework (e.g. React + Vite) — owner preference; chosen for easy extension to the planned follow-up features (full log, schedules, config UI).
- **Form factor**: Single-page app, mobile-first.
- **Timeline**: Ship the MVP quickly — the dog is in active recovery now.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
