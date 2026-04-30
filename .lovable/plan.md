## Goal

Build an **interactive, in-app slide presentation** (1920×1080 scaled, navigable in browser) that walks a non-technical reader through every feature of the WorkFlowy app — what it looks like, where to click, what appears, plus the endpoint(s) and database table(s) behind each feature.

**Scope of THIS plan:** Frontend deck only. The backend-focused deck is a separate future request (you said "don't forget about the backend… first think about the frontend").

**Source of truth:** `spec/31-app/`, `spec/32-ui-design/`, `spec/33-feedback-report/`, `spec/34-activity-feed/`, `spec/35-enforcement-rules/`, `spec/36-user-management/`. Folder `spec/18-spec-issues/` is ignored as you requested.

---

## What you'll get

A new route `/deck` in this app with:

- A scaled 1920×1080 slide canvas (auto-fits any window)
- Left thumbnail sidebar (collapsible)
- Top toolbar: prev/next, slide counter, grid view, fullscreen "Present" mode, dark-mode toggle
- Keyboard nav: ←/→/Space, `G` grid, `F5` present, `Esc` exit
- Each slide is a real React component — easy to tweak text/layout later
- ~60 slides total, organised into chapters with section dividers

---

## Slide structure (per feature, 3 slides)

For every major feature we use a consistent 3-slide pattern so a beginner can follow:

```text
┌─────────────────────────────────┐  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│  Slide A — UI Walkthrough       │  │  Slide B — How it Works         │  │  Slide C — Endpoints & DB       │
│                                 │  │                                 │  │                                 │
│  ┌──── ASCII wireframe ────┐    │  │  Step 1 → click ⋮ on a row      │  │  REST                            │
│  │  [Sidebar][Page area  ] │    │  │  Step 2 → menu opens beside it  │  │   GET  /wp-json/wf/v1/items     │
│  │  [       ][ • Item 1  ] │    │  │  Step 3 → choose "Move"         │  │   POST /wp-json/wf/v1/items     │
│  │  [       ][ • Item 2  ] │    │  │  Step 4 → picker dialog appears │  │   ...                            │
│  └─────────────────────────┘    │  │  Step 5 → item is moved         │  │                                 │
│                                 │  │                                 │  │  DB tables touched              │
│  Plain-English caption of       │  │  What you see / what happens    │  │   • Item     (parentId, order)  │
│  every region of the screen     │  │  written for a first-time user  │  │   • AuditLog (who/what/when)    │
└─────────────────────────────────┘  └─────────────────────────────────┘  └─────────────────────────────────┘
```

- **Slide A** uses an ASCII/box wireframe (matches the spec's own style) with arrows and labels.
- **Slide B** is plain English: "Click here → this opens → press Enter → result."
- **Slide C** is the only technical slide: lists endpoint URL+method and the DB tables/columns involved (technical terms allowed here, per your tone choice).

Smaller features collapse into 1–2 slides; some flows (e.g. drag-and-drop, search) get an extra animation/state-diagram slide.

---

## Deck outline (~60 slides)

```text
CH 0  Cover & Reading Guide                                    (2 slides)
CH 1  WorkFlowy in 60 Seconds — what is it, the Item model    (3)
CH 2  App Shell — Navbar, Sidebar, Page area, Breadcrumb      (4)   [32/06/01, 32/06/06, 31/03]
CH 3  Recursive Item Rendering — the heart of the app         (3)   [32 recursive contract, 31/04]
CH 4  Editor & Interactions — Enter/Tab, slash menu, toolbar  (5)   [32/04, 32/06/05, 31/05]
CH 5  Bullet Anatomy — bullet, ⋮ menu, focused-item menu      (3)   [32/06/04, 31/06]
CH 6  Multi-Select & Drag-and-Drop                            (3)   [31/12, 32/04/03]
CH 7  Search Popover (command-palette)                        (3)   [32/06/02, 31/15b]
CH 8  Today View & Calendar / Quick Add                       (3)   [32/06/07, 31/10]
CH 9  Board View (Kanban) & Dashboard View                    (3)   [31/07, 31/07b]
CH 10 Mirrors — peer groups, cycle detection                  (3)   [31/09, 31/09a, 31/09b]
CH 11 Templates — apply & snapshot semantics                  (2)   [31/13]
CH 12 Share Dialog & Permissions                              (3)   [31/08, 31/15]
CH 13 Trash View & 30-day Reaper                              (3)   [31/11, 31/11b]
CH 14 Right-Side Panel — Handbook, Hotkeys, What's New        (2)   [32/06/03]
CH 15 App Shell Menu, Themes, Fonts, Settings                 (3)   [32/06/08]
CH 16 Concurrency, Sync, Offline Queue                        (3)   [31/14, 31/14b]
CH 17 User Management — Auth, Account, Roles, Admin UI        (4)   [36-user-management]
CH 18 Feedback Reporting — Submission & Admin Review          (2)   [33-feedback-report]
CH 19 Activity Feed — events, capture, feed UI                (2)   [34-activity-feed]
CH 20 Enforcement Rules (developer guardrails — quick tour)   (2)   [35-enforcement-rules]
CH 21 Endpoint Catalogue — one-page summary table             (1)   [31/06-endpoints]
CH 22 Database Map — ERD overview, key tables                 (2)   [31/07-db-diagram]
CH 23 Closing — what's next (backend deck preview)            (1)
                                                               ───
                                                              ~64 slides
```

---

## Phasing (you say "next" between phases)

**Phase 1 — Scaffold the deck app**
- Add `/deck` route, `ScaledSlide` component (1920×1080 + auto-scale), `DeckShell` (toolbar + thumbnail sidebar + canvas), keyboard nav, fullscreen, grid view.
- Slide registry array so adding a slide = adding one file + one entry.
- Two seed slides (Cover + Reading Guide) to prove the shell works.
- Outcome: you can open `/deck`, click through, present fullscreen.

**Phase 2 — Chapters 1–6 (foundations)**
- WorkFlowy intro, App shell, Recursive rendering, Editor/Interactions, Bullet anatomy, Multi-select & DnD.
- ~21 slides. After this you can already demo the "core editing" story.

**Phase 3 — Chapters 7–12 (feature surfaces)**
- Search, Today/Calendar, Board/Dashboard, Mirrors, Templates, Share & Permissions.
- ~17 slides.

**Phase 4 — Chapters 13–17 (system surfaces & users)**
- Trash, Right-side panel, App-shell menu/themes/settings, Concurrency/Sync, User Management.
- ~15 slides.

**Phase 5 — Chapters 18–23 (cross-cutting + closing)**
- Feedback, Activity Feed, Enforcement quick tour, Endpoint catalogue, DB map, closing.
- ~10 slides.

You can stop at any phase; the deck is fully usable after Phase 1 and grows with each phase.

---

## Technical details (skip if not interested)

- **Stack:** existing React 18 + Vite + Tailwind + shadcn. No new deps needed.
- **Files added:**
  - `src/pages/Deck.tsx` — route page hosting `<DeckShell/>`
  - `src/deck/DeckShell.tsx`, `ScaledSlide.tsx`, `SlideThumb.tsx`, `GridView.tsx`, `useDeckNav.ts`
  - `src/deck/slides/index.ts` — registry: `[{ id, title, chapter, Component }]`
  - `src/deck/slides/<NN>-<slug>.tsx` — one file per slide
  - `src/deck/components/Wireframe.tsx`, `EndpointTable.tsx`, `DbTable.tsx`, `StepList.tsx` — reusable slide primitives
  - Add `<Route path="/deck" element={<Deck/>} />` in `src/App.tsx`
- **Scaling:** absolute-positioned 1920×1080 wrapper with `transform: scale(min(scaleX, scaleY))`, `.slide-content` font-size scope per slides-app guidance.
- **Wireframes:** rendered inside `<pre className="font-mono">` with monospace box-drawing — readable at scale, easy to edit, matches the spec's own visual language.
- **Endpoint/DB data per slide:** small typed arrays inside the slide file pulled from `spec/31-app/06-endpoints/` and `spec/31-app/07-db-diagram/` (no runtime fetching — content is authored into the slides).
- **No backend changes**, no Lovable Cloud calls — pure static deck.
- **Theming:** uses existing `index.css` semantic tokens; dark-mode toggle flips `.dark` on root.
- **Out of scope:** real screenshots (we'd need a designer), animations beyond simple slide transitions, audio narration, export to .pptx (can be added later as a separate task).

---

## Open questions before I start (Phase 1)

None blocking — your answers covered format, depth, visual style, and tone. I'll proceed to scaffold Phase 1 the moment you approve and say "next" (or just "go").

If you'd later prefer a downloadable .pptx in addition to the in-app deck, we can generate one from the same slide content in a follow-up phase.
