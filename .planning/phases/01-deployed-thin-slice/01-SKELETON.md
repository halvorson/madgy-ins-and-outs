# Walking Skeleton — Phase 01: Deployed Thin Slice

## What the Skeleton Proves

A user visits a deployed Firebase Hosting URL on their phone, taps "Log" once, and that tap
immediately appears on a second device's screen. No login prompt, no refresh required.

---

## End-to-End Path (Layer by Layer)

### 1. Browser → Firebase Hosting

The Vite build output (`dist/`) is served from Firebase Hosting.

**Proof line:** `firebase.json` contains `"public": "dist"` and `"rewrites": [{ "source": "**", "destination": "/index.html" }]`

---

### 2. React App Mount → Anonymous Auth

On `App` mount, `signInAnonymously(auth)` runs silently before any Firestore access.
The user never sees a login screen.

**Proof line:** `useEffect(() => { signInAnonymously(auth) }, [])` in `src/App.tsx`

---

### 3. Log Button Tap → Firestore Write

Tapping "Log" on the `TrackableCard` calls `addDoc` on the Firestore path
`/subjects/madgy/logs/{auto-id}`, writing `{ trackableId, timestamp, loggedBy: "caregiver" }`.

**Proof line:** `await addDoc(collection(db, 'subjects', 'madgy', 'logs'), { trackableId: 'gabapentin', timestamp: serverTimestamp(), loggedBy: 'caregiver' })` in `src/lib/firestore.ts`

---

### 4. Firestore → Real-Time Listener → Second Device

`onSnapshot` on the same collection path delivers new documents to every connected client
within ~1 second. No polling, no manual refresh.

**Proof line:** `onSnapshot(collection(db, 'subjects', 'madgy', 'logs'), (snap) => setLogs(snap.docs.map(d => d.data())))` in `src/App.tsx`

---

### 5. Security Rules → Unauthenticated Writes Rejected

Firestore security rules deny all reads and writes unless `request.auth != null`.
Anonymous auth satisfies this; REST reads without a token do not.

**Proof line:**
```
match /subjects/{subject}/logs/{logId} {
  allow read, write: if request.auth != null;
}
```
in `firestore.rules`

---

## Architectural Decisions Locked by This Skeleton

These decisions are set by the skeleton and must not be renegotiated in Phase 2 or Phase 3.

| Decision | Value | Rationale |
|----------|-------|-----------|
| Frontend framework | React + Vite + TypeScript (`react-ts` template) | D-10, CONTEXT.md |
| Styling | Tailwind CSS via `@tailwindcss/vite` plugin | D-11, CONTEXT.md |
| Firestore path | `/subjects/{subject}/logs/{logId}` | D-04, D-06 — multi-subject extensibility |
| Log entry shape | `{ trackableId: string, timestamp: Timestamp, loggedBy: string, note?: string }` | D-05 |
| Auth strategy | Firebase Anonymous Auth — invisible, no sign-in screen | D-01, INFRA-02 |
| Firebase config | `VITE_`-prefixed env vars, `.env` not committed, `.env.example` committed | D-03 |
| Hosting | Firebase Hosting, `dist/` as public dir, SPA rewrites to `index.html` | D-01, INFRA-01 |
| Component structure | `App` → `TrackableList` → `TrackableCard` | D-07 — scaffold Phases 2/3 extend |

---

## Directory Layout

```
madgy-ins-and-outs/
├── src/
│   ├── App.tsx              — root component; auth init + Firestore listener
│   ├── main.tsx             — React entry point
│   ├── lib/
│   │   ├── firebase.ts      — Firebase app init, exports auth + db
│   │   └── firestore.ts     — addLog(), logsCollection ref
│   └── components/
│       ├── TrackableList.tsx — list wrapper; accepts array prop
│       └── TrackableCard.tsx — single card with Log button + states
├── firestore.rules          — security rules (require auth)
├── firebase.json            — Hosting config (dist/, SPA rewrites)
├── .firebaserc              — project alias
├── .env.example             — VITE_ keys template (committed)
├── .env                     — real keys (NOT committed)
├── vite.config.ts           — @tailwindcss/vite plugin
└── package.json
```

---

*Skeleton created: 2026-06-06*
*Phase: 01-deployed-thin-slice*
