import type { SlideMeta } from "./types";

/**
 * Speaker notes by slide id. Kept separate from the slide registry so
 * notes can be edited without touching component imports.
 *
 * Conventions:
 *  - 1-3 short paragraphs, ~30-60 seconds of talk per slide
 *  - First sentence is the "headline" — what to say if you're rushed
 *  - Use `--` for sub-points the speaker can drop into
 *  - Divider slides get one-line orientation; closing slides recap
 */
export const NOTES: Record<string, string> = {
  // ============================================================
  // FRONTEND DECK
  // ============================================================

  cover: `Welcome. This deck walks through every screen of the WorkFlowy clone — what users see and why.

-- Audience: PMs, designers, and engineers onboarding to the product.
-- ~65 slides across 23 chapters; budget 35-40 minutes at a steady pace.
-- Backend internals are in a separate /backend-deck.`,

  "reading-guide": `Every screen here is backed by a real spec under spec/31-app/ through spec/36-user-management/. If a slide contradicts the spec, the spec wins — flag it.

-- Skip the divider slides if you're tight on time.
-- "Endpoints & DB" slides at the end of each chapter are the bridge to the backend deck.`,

  // ----- Chapter 1: WorkFlowy in 60 seconds -----
  "ch1-divider": `Three slides to set the mental model before we touch any UI.`,

  "ch1-1": `WorkFlowy is one infinite outline. Every line is an item, every item can have children, and any subtree can become a focused view.

-- The pitch in one sentence: "Lists, but recursive."
-- Everything else in this deck is a consequence of that one idea.`,

  "ch1-2": `Item is THE primitive — there's no separate "task", "note", or "page" table. The shape determines the role: an item with a dueDate behaves like a task, an item with children behaves like a list.

-- This is why the schema is so small. Look for the items table on slide 22-1.`,

  "ch1-3": `Today, Calendar, Board, Dashboard — none of these are separate entities. They're all queries over the same item tree, filtered and projected differently.

-- Mental model: Views are read-only lenses. Edits always go back to items.`,

  // ----- Chapter 2: App Shell -----
  "ch2-divider": `The frame around every screen — navbar, sidebar, content. Persists across navigation.`,

  "ch2-1": `Three regions: navbar on top, sidebar on the left, content in the middle. The right-side panel slides in on demand (chapter 14).

-- The shell is fixed; only the content region scrolls.`,

  "ch2-2": `Navbar holds breadcrumbs (your zoom path), search, and the user menu. Breadcrumbs are clickable — each segment zooms back to that level.`,

  "ch2-3": `Sidebar shows starred items + recent + system views (Today, Trash). It's NOT a separate file tree — it's saved pointers into the same outline.

-- Drag-reorder works inside the sidebar; that's a tag/star write, not a move.`,

  "ch2-4": `The shell itself only needs three reads: current user, starred items, recent items. Everything else loads lazily as you navigate.`,

  // ----- Chapter 3: Recursive Rendering -----
  "ch3-divider": `How one component renders the whole tree without exploding.`,

  "ch3-1": `Each <Item> renders its content row plus a list of <Item> children. That's the whole trick. Virtualization kicks in past 200 visible rows.

-- Collapsed subtrees aren't rendered at all — saves DOM and lets us handle 10K-item outlines.`,

  "ch3-2": `Zoom = change the root. The URL holds the root item id; everything above it is hidden but still loaded so breadcrumbs work.

-- Zoom out = pop a level. Cmd-. and Cmd-, are the keybinds.`,

  "ch3-3": `Reads are scoped to (root, depth). Writes never need to know about zoom — they target item ids directly.`,

  // ----- Chapter 4: Editor & Interactions -----
  "ch4-divider": `The bullet is a contenteditable. Five slides on what makes it feel WorkFlowy-fast.`,

  "ch4-1": `Each row is a contenteditable div with inline formatting. Newline = new sibling, Tab = indent, Shift-Tab = outdent. Enter at end of empty bullet outdents.

-- We don't use a heavyweight editor framework. The DOM IS the model for inline marks.`,

  "ch4-2": `Keyboard is the API. Show the cheat sheet — Cmd-Enter to complete, Cmd-Shift-↑/↓ to move, Cmd-/ to slash menu.

-- Power users never touch the mouse. Demo this if you have time.`,

  "ch4-3": `Slash menu is the discoverability layer. Type "/" and get every block-level action: type change, due date, tag, mirror, template.

-- Same actions exist in the row menu (chapter 5) — slash menu is just faster.`,

  "ch4-4": `Floating toolbar appears on text selection. Bold, italic, link, color. Disappears on blur.

-- Touch devices get a sticky version above the keyboard.`,

  "ch4-5": `Editor writes go through the sync funnel — every keystroke batch is a queued op (see chapter 16). No direct DB writes from the editor.`,

  // ----- Chapter 5: Bullet Anatomy -----
  "ch5-divider": `Two slides on the row itself — the dot, the handle, the menu.`,

  "ch5-1": `Each row has: expand/collapse caret, the bullet (drag handle + zoom target), content area, and a hover-revealed ⋮ menu.

-- Click the bullet = zoom. Drag the bullet = move. Cmd-click = open in right panel.`,

  "ch5-2": `Row menu is the kitchen sink: complete, indent, move, mirror, template, tag, color, share, delete. Same actions as slash menu, just findable by mouse.`,

  "ch5-3": `Every row action maps 1:1 to a sync op. The menu is a thin wrapper around dispatchOp().`,

  // ----- Chapter 6: Multi-Select & Drag-and-Drop -----
  "ch6-divider": `Bulk operations. Click-drag or Shift-click to select; act on the set.`,

  "ch6-1": `Selection is a Set<itemId> in client state. Visual highlight, count badge, action bar at the bottom of the viewport.

-- Selecting a parent does NOT auto-select children — that surprised early testers; we kept it explicit.`,

  "ch6-2": `Drag-and-drop uses the bullet as the handle. A blue insertion line shows the drop target; indent level changes with horizontal drag.

-- Multi-drag respects the selection set.`,

  "ch6-3": `Bulk ops are sent as a batched op array, not N individual requests. Server applies them in one transaction.`,

  // ----- Chapter 7: Search -----
  "ch7-divider": `Cmd-K opens search. Operators, scopes, ranking.`,

  "ch7-1": `Search is a sticky overlay. Top result previewed inline; Enter zooms to it.

-- Recent searches saved per user.`,

  "ch7-2": `Operators: is:task, tag:#x, due:<7d, in:zoom-path. Free text falls through to FTS. Parser is on backend slide B-8.2.`,

  "ch7-3": `Server returns ranked itemIds; client fetches the actual rows in a follow-up call. Keeps the search response tiny.`,

  // ----- Chapter 8: Today & Calendar -----
  "ch8-divider": `Time-based views. The same items, sorted by dueDate.`,

  "ch8-1": `Today shows everything due today + overdue, grouped by parent for context. Calendar is a month grid; click a day to inline-create.

-- Both are read-only projections; editing flips back to the home outline.`,

  "ch8-2": `One query: items WHERE dueDate <= today AND completedAt IS NULL. The grouping is client-side.`,

  "ch8-3": `Indexed by (workspaceId, dueDate) — see backend B-9.3 for the query plan.`,

  // ----- Chapter 9: Board & Dashboard -----
  "ch9-divider": `Two more views over the same tree.`,

  "ch9-1": `Kanban board: columns are tags or status values, cards are items. Drag a card → tag write. No new schema.

-- Column config is stored on the parent item as JSON.`,

  "ch9-2": `Dashboard is a widget grid. Each widget is a saved query (count, list, chart). Composable, not a separate report builder.`,

  "ch9-3": `Same items table powers both. The "magic" is in how queries are saved (a sub-item with a viewConfig blob).`,

  // ----- Chapter 10: Mirrors -----
  "ch10-divider": `One item, multiple parents. The feature most demos skip.`,

  "ch10-1": `A mirror is a pointer. Edit any peer (source or mirror), they all change. Mirrors look like normal items but with a small icon.

-- Use case: one task lives in both "Project X" and "This week".`,

  "ch10-2": `Create via slash menu → Mirror to. Detach turns a mirror back into an independent copy. Cycles are forbidden — backend rejects them (B-5.2).`,

  "ch10-3": `Mirror table is a thin join. Read-side resolution joins items to the source row. See B-5.1.`,

  // ----- Chapter 11: Templates -----
  "ch11-divider": `Snapshot a subtree, instantiate it elsewhere.`,

  "ch11-1": `Templates gallery shows your saved templates + workspace + public ones. "Apply" deep-copies into the current parent.

-- Common templates: weekly review, project kickoff, meeting notes.`,

  "ch11-2": `Templates live in a separate DB file (backend B-1.2). Snapshot is canonical JSON; instantiate mints fresh ids (B-6.2).`,

  // ----- Chapter 12: Share & Permissions -----
  "ch12-divider": `Sharing is per-item, inherited downward. Three slides.`,

  "ch12-1": `Share dialog: invite by email, grant role (read/comment/write/admin), or copy a link. Link sharing has its own permission rows.`,

  "ch12-2": `Permission ranks: admin > write > comment > read. Strongest grant on any ancestor wins. Inheritance means revoking high also revokes low.

-- Common gotcha: removing a member from the workspace doesn't auto-revoke item-level grants on items they were directly invited to.`,

  "ch12-3": `Effective permission resolved by recursive CTE walking ancestors. Cached 60s in-memory. See B-6.3.`,

  // ----- Chapter 13: Trash -----
  "ch13-divider": `Soft-delete with a 30-day window.`,

  "ch13-1": `Trash view groups deleted items by day. Restore brings the whole subtree back; permanent-delete needs confirm.`,

  "ch13-2": `Restore re-parents to the original location if it still exists, otherwise to the workspace root. Reaper hard-deletes after 30 days.

-- Mirrors of reaped items stay in "broken" state — user decides.`,

  "ch13-3": `deletedAt timestamp + cascading subtree update. Reaper is a background job (B-7.2).`,

  // ----- Chapter 14: Right-side panel -----
  "ch14-divider": `The contextual sidekick. Opens with Cmd-click on a bullet.`,

  "ch14-1": `Right panel shows item details: full content, tags, due date, history, comments. Doesn't take you out of context — main outline stays visible.`,

  "ch14-2": `Tabs: Details, Activity (chapter 19), Comments, Backlinks. Each tab is a separate fetch; they load on demand.`,

  // ----- Chapter 15: App menu, themes, settings -----
  "ch15-divider": `Three slides on the top-right ⋮ menu, themes, and the settings page.`,

  "ch15-1": `App menu (top-right ⋮): keyboard shortcuts, theme toggle, switch workspace, sign out, send feedback.`,

  "ch15-2": `Settings page is its own route: profile, password, notifications, integrations, danger zone.

-- Per-user preferences (theme, font size, dense mode) persist server-side so they roam across devices.`,

  "ch15-3": `Settings backed by user_preferences (KV blob). No schema migration when adding a new pref.`,

  // ----- Chapter 16: Concurrency, sync, offline -----
  "ch16-divider": `The single most important chapter for engineers. Three slides; expect questions.`,

  "ch16-1": `Optimistic UI: every edit applies locally first, then queues for the server. Last-write-wins on the server with deterministic tie-break (B-3.2).

-- "Concurrent" here means "from the same user's two tabs" as much as "from two users".`,

  "ch16-2": `Sync POST /sync with op batch + cursor → server returns new cursor + remote ops. SSE pushes incremental updates between syncs.

-- Offline = ops queue in IndexedDB outbox; replay on reconnect with clientOpId for idempotency.`,

  "ch16-3": `Two endpoints: POST /sync, GET /events (SSE). Cursor is HMAC-signed (B-3.3) so it can't be tampered with.`,

  // ----- Chapter 17: User management -----
  "ch17-divider": `Auth flow, roles, admin UI, endpoints. Four slides.`,

  "ch17-1": `Email + password, with optional magic-link as a future addition. Reset via email token (B-2.3). Sessions are HttpOnly cookies.`,

  "ch17-2": `Two role layers: system roles (admin, user) and workspace roles (owner, member, viewer). Both checked via has_role helper (B-2.4).`,

  "ch17-3": `Admin UI is a separate route, gated by hasRole(actor, 'admin'). Lists users, recent sign-ups, locked accounts, audit log.`,

  "ch17-4": `Endpoints: /auth/login, /auth/logout, /auth/reset, /admin/*. All admin endpoints double-check the role server-side — never trust the client.`,

  // ----- Chapter 18: Feedback Reporting -----
  "ch18-divider": `In-app feedback widget. Bug, idea, or praise → ticket.`,

  "ch18-1": `Bottom-right button opens a small form. Auto-attaches current URL, viewport size, and the last 50 client log lines.`,

  "ch18-2": `Stored in a separate feedback table. Admins triage in the admin UI (chapter 17.3).`,

  // ----- Chapter 19: Activity Feed -----
  "ch19-divider": `Append-only audit of who did what. Per-item and global views.`,

  "ch19-1": `Activity tab on the right panel shows per-item history. Workspace activity feed shows everyone's recent ops.

-- Useful for "who deleted my thing?" — answer is always there.`,

  "ch19-2": `Every applied op writes one activity row in the same transaction (B-8.3 write-path hooks). 90-day hot retention, then archived (B-7.3).`,

  // ----- Chapter 20: Enforcement Rules -----
  "ch20-divider": `One slide. Recap of the four guardrails that keep the app honest.`,

  "ch20-1": `1. All mutations through the sync funnel. 2. Permissions checked server-side, every op. 3. Sensitive routes re-verify the role. 4. Schemas Zod-parsed at the boundary.

-- These show up over and over in both decks. If you remember nothing else, remember these four.`,

  // ----- Chapter 21: Endpoint Catalogue -----
  "ch21-divider": `One slide. Every HTTP endpoint at a glance.`,

  "ch21-1": `Walk the table by section: auth, sync, items (read-only fetches), templates, sharing, admin. Note how few there are — most behavior is one of eight op types in the sync POST.`,

  // ----- Chapter 22: Database Map -----
  "ch22-divider": `Two slides. The whole schema fits on one diagram.`,

  "ch22-1": `Items at the center. Everything else (tags, shares, mirrors, activity) hangs off via FK. Templates DB is separate (small, isolated).`,

  "ch22-2": `Constraints worth pointing out: items.parentItemId is self-FK with ON DELETE CASCADE; mirrors enforce mirrorOfItemId <> id; sessions index is partial on revokedAt IS NULL.`,

  // ----- Closing -----
  "ch23-closing": `That's WorkFlowy. Three takeaways:

1. One primitive (Item) makes the whole product composable.
2. Every view is a query, not a separate feature.
3. Sync is the spine — the rest of the codebase orbits around it.

Backend deck is at /backend-deck if you want the systems story.`,

  // ============================================================
  // BACKEND DECK
  // ============================================================

  "b-cover": `This is the systems deck. Assume the audience has used a WorkFlowy-style outliner before, or seen the frontend deck.

-- We move from architecture (B-1) down to deployment (B-10). ~45 slides.
-- Every code snippet is real-shape TypeScript — not pseudocode. You should be able to grep for it.`,

  "b-guide": `Three things to assume:
1. One Node process, two SQLite files (app + templates).
2. All mutations through one "op" funnel — no direct table writes from route handlers.
3. We optimize for correctness and operability over throughput. Not designed to scale past a single host yet.`,

  // ----- B-1: Architecture -----
  "b1-divider": `Three slides on the shape of the server before we look at any feature.`,

  "b1-1": `One Node process, better-sqlite3 in WAL mode. WAL gives us non-blocking reads and one-writer-at-a-time without a queue.

-- "One process" is the whole story. No queue, no cache layer, no orchestrator.`,

  "b1-2": `Two SQLite files: app.sqlite (your data) and templates.sqlite (snapshots). They never reference each other across files — that's the boundary rule.

-- Why split? Independent backup cadence, independent migrations, and templates can be rebuilt from scratch if corrupted.`,

  "b1-3": `Request flows: cookie → session lookup → Zod parse → domain handler → DB transaction → write hooks → response. Same skeleton for every endpoint.

-- The skeleton is enforced by lint rules (B-10.2).`,

  // ----- B-2: Auth -----
  "b2-divider": `Four slides on auth. Boring on purpose.`,

  "b2-1": `Argon2id with memoryCost 19,456 and timeCost 2 — current OWASP recommendation. Pepper is in the env, never in the DB.

-- Verify-then-rehash: if params are below current target, rehash on next successful login.`,

  "b2-2": `Sessions: base64url token (32 bytes). We store SHA-256 of the token in the DB so a DB leak doesn't grant sessions. HttpOnly, Secure, SameSite=Lax cookie.

-- Rotate on privilege escalation (e.g., promoting a user to admin).`,

  "b2-3": `Reset tokens are single-use and time-bounded. The "always wait at least 200 ms" trick prevents email enumeration via timing.

-- We respond identically whether the email exists or not.`,

  "b2-4": `Two helpers: hasRole(userId, role) for system roles, workspaceRole(userId, wsId) for membership. Never check role from the cookie/session payload — always re-query.`,

  // ----- B-3: Sync -----
  "b3-divider": `Six slides on the sync protocol. The hardest chapter; take your time.`,

  "b3-1": `Op is a discriminated union over eight verbs. Every mutation is exactly one of these. clientOpId is the idempotency key — server dedupes.

-- New verbs require a migration AND a Zod schema update. Same code change.`,

  "b3-2": `LWW is the part everyone gets wrong. Tie-break order matters: (timestamp, actorUserId, clientOpId). Without all three you get flapping.

-- We store the winning stamp PER FIELD, not per row. So a content edit and a tag change at the same wall-clock time both apply.`,

  "b3-3": `Cursors are HMAC-signed. They contain (userId, lastSeenSeq) and the signature uses a server secret. Tampering = invalid cursor = full resync.

-- Don't return the raw seq; the signature also prevents user-cross-talk.`,

  "b3-4": `End-to-end: client batches ops with current cursor, server applies, returns new cursor + any remote ops the client hasn't seen.

-- Walk the diagram once, slowly. If anyone's confused, this is where to spend the time.`,

  "b3-5": `SSE for push. text/event-stream, Last-Event-ID for catch-up after disconnect, 15-second heartbeat to keep proxies from idling sockets.

-- Why SSE not WebSockets? One direction (server→client), works through every proxy, and reconnect-with-resume is built into the protocol.`,

  "b3-6": `Outbox in IndexedDB. Optimistic apply locally, queue op, replay on reconnect. clientOpId guarantees we never double-apply.

-- The outbox is what lets the app feel instant on flaky connections.`,

  // ----- B-4: Item ops -----
  "b4-divider": `Four slides on the structural ops. Move, indent, fractional indexing, soft-delete.`,

  "b4-1": `Move/indent/outdent are all the same op under the hood — set parentItemId + fractionalIndex. Wrap in BEGIN IMMEDIATE so concurrent moves queue.

-- Cycles rejected by walking the parent chain.`,

  "b4-2": `Fractional indexing avoids renumbering siblings on every move. Each sibling has a base-62 string; between(a,b) returns a string strictly between them.

-- Worst case one extra char per ~62 inserts at the same gap. Lazy rebalance kicks in when any group exceeds 32 chars.`,

  "b4-3": `Two clients can mint identical fractional indexes. We disambiguate by appending the actor's ULID suffix — preserves total order across replicas.

-- Rebalance is idempotent; safe to retry.`,

  "b4-4": `Delete sets deletedAt + cascades to descendants. Restore is the inverse. Hard-delete only via the reaper (B-7.2) after 30 days.

-- Restore falls back to root if the original parent is gone.`,

  // ----- B-5: Mirrors -----
  "b5-divider": `Three slides. Mirrors are the feature most likely to introduce bugs.`,

  "b5-1": `Mirrors are pointers. The mirror's items row has mirrorOfItemId set; its content column is ignored at read time. Reads JOIN to source.

-- COALESCE on every content field — slide shows the canonical query.`,

  "b5-2": `Cycle detection is the one thing the server absolutely must reject. Recursive CTE walks UP from target parent; bails on source-id hit.

-- Also forbid "mirror of a mirror" — there's only ever one source.`,

  "b5-3": `When a source is deleted, mirrors don't disappear — flagged brokenAt. UI shows tombstone, user decides.

-- Permission revocation triggers the same path, scoped to affected workspace.`,

  // ----- B-6: Templates & sharing -----
  "b6-divider": `Three slides. Snapshot, instantiate, permissions.`,

  "b6-1": `Templates are immutable JSON snapshots. Canonical form (sorted keys) so SHA-256 gives a stable content hash for dedup.

-- LocalIds in the snapshot are scoped to the snapshot only — no DB ids leak.`,

  "b6-2": `Instantiate walks the snapshot, mints fresh ids, rewrites parent pointers. localId→newId map built top-down so children always resolve their parent.

-- Tags looked up by NAME in the destination workspace; created if missing.`,

  "b6-3": `Permissions inherited downward. Effective permission = strongest grant on any ancestor. Recursive CTE resolves in one query; cached 60 s per (user, item).

-- Revoke cascades implicitly — deleting a share row drops the grant on the whole subtree because resolution always walks ancestors at read time.`,

  // ----- B-7: Background jobs -----
  "b7-divider": `Four slides. In-process scheduler, three jobs, plus SSE fan-out (which technically isn't a job but lives in the same module).`,

  "b7-1": `One in-process scheduler, no external queue. Jobs are async functions registered with cron-like specs. A SQLite lease row enforces single-instance.

-- Lease design lets a future multi-node deploy add coordination without rewriting the API.`,

  "b7-2": `Trash reaper runs hourly, chunks of 500. Chunking matters: SQLite's single-writer model means a giant DELETE blocks every other write. 500 keeps each tx under ~50 ms.

-- Mirrors pointing at reaped sources stay in brokenAt — reaper does NOT touch them.`,

  "b7-3": `Activity table grows fast — 90 days hot, then streamed to gzip ndjson archives and dropped. Archive job is idempotent.

-- Restore from archive is manual but supported. Procedure is in the runbook.`,

  "b7-4": `One in-memory hub, one Set of writers per workspace. Bounded queue per socket (256 ops); slow consumers get a reconnect event and catch up via cursor sync.

-- Heartbeat is a separate job, every 15 s.`,

  // ----- B-8: Search & activity -----
  "b8-divider": `Three slides. Search index, query parser, write-path hooks.`,

  "b8-1": `FTS5 contentless table mirrored from items. Trigram tokenizer for prefix + infix. bm25 weighted to favor content over tags. Per-workspace filter via a join.

-- Why contentless? Item updates would otherwise trigger automatic re-tokenization on every write.`,

  "b8-2": `Operator parser: is:, tag:, due:, in:, completed:. Hand-rolled tokenizer (no regex backtracking). Unknown ops fall through to free-text. Output → parameterized SQL builder.

-- Key safety property: user input never concatenated into SQL.`,

  "b8-3": `Every applied op flows through one funnel that fans out to FTS, activity, SSE. Hooks run inside the SAME transaction as the op — no eventual consistency drift.

-- SSE publish is the one exception: deferred to after-commit so subscribers never see uncommitted state.`,

  // ----- B-9: Migrations & indexes -----
  "b9-divider": `Three slides. The runner is ~80 lines.`,

  "b9-1": `Numbered SQL files, run inside a transaction. PRAGMA user_version is the source of truth. No external migration tool.

-- foreign_keys = OFF during migration prevents constraint thrash on table rebuilds; foreign_key_check at the end catches dangling refs.`,

  "b9-2": `Worked example: adding mirrorOfItemId. ALTER TABLE ADD COLUMN with FK + CHECK. Partial index because most rows aren't mirrors.

-- Forward compat: pre-v2 clients still work; mirror ops get rejected and the client falls back to a normal create.`,

  "b9-3": `Every read endpoint has an EXPLAIN QUERY PLAN snapshot in tests/query-plans/. CI fails if a plan changes from SEARCH USING INDEX to SCAN.

-- ANALYZE runs after every migration so SQLite has fresh stats.`,

  // ----- B-10: Enforcement & deployment -----
  "b10-divider": `Final phase. Four slides: Zod, ESLint, runbook, closing.`,

  "b10-1": `Zod is the boundary. Untrusted data hits exactly one schema parser; after that point we have a fully-typed value. No "as any" deeper in the stack.

-- Schemas in src/contracts/ imported by both server and client SDK. One source of truth.`,

  "b10-2": `Boundaries enforced by lint, not discipline. no-restricted-imports per directory. Domain code can't reach into transport, transport can't reach into storage, raw better-sqlite3 only inside src/db/.

-- Pre-commit + CI both run eslint --max-warnings=0.`,

  "b10-3": `Walk the runbook step by step. Build → pre-flight → atomic swap via systemd → health/SLOs → backups → incident playbook.

-- Single binary, single host, two SQLite files. No orchestrator.`,

  "b10-closing": `That's the backend in 45 slides. Three takeaways:

1. One process, two SQLite files. Boring is a feature.
2. Ops are the only mutation API — every behavior eventually becomes an applyOp() call.
3. Boundaries enforced by the type system and the linter, not by discipline. If you can write the wrong code, eventually someone will.

Questions?`,

  // ============================================================
  // OPS DECK
  // ============================================================

  "o-cover": `Welcome to the ops deck. This is what it takes to keep the WorkFlowy backend healthy in production.

-- Audience: on-call engineers, SREs, and anyone shipping changes that touch the running service.
-- 19 slides, ~25 minutes. Pairs with the backend deck — same single binary, same two SQLite files.`,

  "o-guide": `We assume the backend deck has been seen — one Go process, two SQLite files (data + activity), ops journal as the source of truth.

-- Stack assumed: Prometheus + Alertmanager, Grafana, Loki for logs, OpenTelemetry traces to Tempo, PagerDuty for paging.
-- If your stack differs, the shape of the alerts and dashboards still applies; swap the tooling.`,

  // ----- O-1: SLOs & error budget -----
  "o1-divider": `Three SLOs, one budget policy. Everything downstream — alerts, dashboards, on-call urgency — derives from these numbers.`,

  "o1-1": `Three SLOs: 99.9% availability on read endpoints, p99 < 300ms on applyOp, < 0.1% sync failure rate over 28 days.

-- Read availability is the user-facing one — if reads are down, the app is down.
-- applyOp latency is the write SLO; the 300ms includes WAL fsync.
-- Sync failure rate is per-op, not per-batch — one bad op shouldn't burn the budget for 99 good ones.`,

  "o1-2": `Error budget is 0.1% of 28 days ≈ 40 minutes. Policy is binary: budget remaining → ship freely; budget exhausted → freeze non-critical deploys until it recovers.

-- "Critical" = security fixes and rollbacks only. Everything else waits.
-- The freeze is automatic, not a debate. Removes the political tax.`,

  // ----- O-2: Metrics, logs, health -----
  "o2-divider": `What we expose, how we read it, and what "healthy" means to a load balancer.`,

  "o2-1": `Prometheus surface is small on purpose: http_requests_total, http_request_duration_seconds, applyop_duration_seconds, sync_failures_total, sqlite_busy_total, backup_age_seconds.

-- Histograms not summaries — we need to aggregate across instances even though there's only one today.
-- Every metric has a unit suffix. Future-you will thank present-you.`,

  "o2-2": `Logs are JSON, one line per request, with trace_id. Traces are OTel, sampled at 1% baseline + 100% on errors. Logs and traces share the same trace_id so you can pivot between them in one click.

-- Don't log PII. Item content is PII. Log item IDs and operation types only.
-- Tail-based sampling at the collector means we keep all error traces without paying for 100% of happy-path traces.`,

  "o2-3": `Two health endpoints. /healthz is liveness — returns 200 if the process can answer HTTP. /readyz is readiness — checks DB writable, activity DB writable, backup age < 24h, ops queue not stalled.

-- Load balancer uses /readyz. Kubernetes-style liveness restarts use /healthz.
-- Readyz failing during a backup is fine and expected — backup pauses writes for ~2s.`,

  // ----- O-3: Alerts -----
  "o3-divider": `Two tiers, hard line between them. If it pages, it has a playbook. If it doesn't have a playbook, it's a ticket.`,

  "o3-1": `Page-worthy: availability SLO burning > 14x (10% of monthly budget in 1h), applyOp p99 > 1s for 5min, sync failure rate > 1% for 5min, backup_age > 26h, disk > 90%.

-- Burn-rate alerts not threshold alerts — fewer false pages, faster real ones.
-- Every page links to a playbook. No playbook → not a page.`,

  "o3-2": `Ticket-worthy: backup_age > 12h, p95 latency creeping up week-over-week, sqlite_busy_total spiking but recovering, deploy duration > 90s.

-- These go to a Slack channel and an issue, not a phone. They're trend signals, not fires.
-- Review weekly. If a ticket alert fires three weeks running, either fix it or delete it.`,

  // ----- O-4: Dashboards -----
  "o4-divider": `Three dashboards. Overview for the daily glance, sync deep-dive when sync misbehaves, storage & jobs for the slow stuff.`,

  "o4-1": `Overview is the one tab that's always open. Top row: SLO burn rates. Middle: RPS, latency p50/p99, error rate. Bottom: process CPU/memory, ops queue depth.

-- If something looks wrong here, you drill into one of the other two dashboards.
-- No alert is allowed to fire without a panel here that shows the underlying signal.`,

  "o4-2": `Sync deep-dive: applyOp latency by op type, sync_failures_total by reason, conflict resolution counts, SSE connection count, ops journal lag.

-- "By reason" is what makes this dashboard useful — knowing failures rose isn't enough, you need to know they're all CONFLICT vs all SCHEMA_MISMATCH.
-- SSE connection count drops cliff-like during deploys; that's the rolling restart, not an outage.`,

  "o4-3": `Storage & jobs: DB file size, WAL size, checkpoint rate, backup duration & age, FTS rebuild time, vacuum duration, disk free.

-- WAL size growing without checkpoints = SQLite can't fsync. Usually disk pressure.
-- Backup duration trending up means data growth; budget the maintenance window accordingly.`,

  // ----- O-5: On-call & playbooks -----
  "o5-divider": `One rotation, four playbooks, then we close out.`,

  "o5-1": `Weekly rotation, primary + secondary. Handoff Monday 10am with a 15-minute review of the week's pages and tickets. Compensation policy is written down and non-negotiable.

-- Secondary is real backup, not decorative — primary can hand off mid-incident if they're cooked.
-- Pages outside business hours have a 15-min ack SLA; daytime is 5 min.`,

  "o5-2": `Sync errors spiking. Step 1: check sync_failures_total by reason on the deep-dive dashboard. Step 2: if one reason dominates, jump to that reason's sub-playbook. Step 3: if mixed, suspect a deploy — check deploy timeline, consider rollback.

-- Don't restart the process first. You'll lose the in-flight ops queue and make it worse.
-- CONFLICT spikes are usually a client bug, not a server bug. Check client version distribution.`,

  "o5-3": `SQLite busy / locked. Almost always one of: long-running read txn, backup in progress, or a runaway analytic query. Check sqlite_busy_total rate and active connections.

-- Quick mitigation: kill the longest-running read connection. Acceptable to lose one user's request.
-- Real fix: find the query that's holding the lock. WAL mode means writers don't block readers, so a busy is suspicious.`,

  "o5-4": `Bad deploy rollback. Single command: systemctl restart workflowy@previous. Atomic swap because each version is its own systemd unit pointing at its own binary.

-- Pre-flight checks on the new binary run BEFORE the swap, so if you got this page the bad version did pass pre-flight — capture artifacts before rolling back.
-- Rollback is expected to be < 10 seconds. If it isn't, we have a deeper problem.`,

  "o5-5": `Restore from backup. Stop the service, copy the most recent verified backup over data.db, run integrity_check, start the service in read-only mode, verify, then promote to read-write.

-- Activity DB restores separately and is allowed to lag — it's a log, not a source of truth.
-- We test this monthly in staging. If you've never run it, find the runbook entry and do a dry run before you need it for real.`,

  "o5-closing": `That's ops in 19 slides. Three takeaways:

1. SLOs first, alerts second, dashboards third. Don't build dashboards for vibes — build them to answer alerts.
2. Pages have playbooks. No playbook → ticket, not page.
3. Boring deploys: atomic swap, pre-flight, automatic rollback. Excitement is a smell.

Questions?`,

  // ============================================================
  // ENFORCEMENT DECK
  // ============================================================

  "e-cover": `Welcome to the enforcement deck. Twenty-one slides on how we make project guidelines mechanical — so CI, not reviewers, catches drift.

-- Audience: tech leads, DevOps, anyone wiring CI; also frontend/backend devs who'll consume the rules day-to-day.
-- Companion to /deck, /backend-deck, /ops-deck. This one is about HOW we keep all those promises.
-- Source of truth: spec/35-enforcement-rules — 14 acceptance rows, ~26 gates.`,

  "e-guide": `One sentence: rules without gates rot. The whole deck is built around that.

-- We'll cover four layers — compile, lint, runtime, test — in that order. Each layer catches a class of error the layer before it cannot.
-- Every slide cites a G-35-* gate ID and an AT-ENFORCEMENTRULES-NN row. If a slide makes a claim that isn't gated, treat it as a bug.
-- Definition of Done lives in the overview: all 14 ATs pass, the grep for \`any\`/@ts-ignore returns zero, and \`spec-hygiene/00-run-all.mjs\` exits 0.`,

  // ----- Phase E-1: Compile-time generics -----
  "e1-divider": `Phase one: the compiler. Four rules that keep \`any\` and \`unknown\` from ever crossing a public surface.`,

  "e1-1": `The simplest rule: no bare \`any\` in any signature. The compiler can't help you keep promises about a value typed as \`any\`.

-- Forbidden: parameters or returns typed \`any\`. Even one leak invalidates every type guarantee downstream.
-- Required: branded or generic parameter types, concrete or generic return types.
-- The CI grep \`rg -nP ":\\s*any\\b|@ts-ignore" src/\` must return zero hits — it's the simplest possible gate.
-- Gate: G-35-RT-NO-ANY · AT-ENFORCEMENTRULES-01.`,

  "e1-2": `\`unknown\` is fine as a parser INPUT — \`schema.parse(input: unknown)\` is correct. It's forbidden as an exported RETURN.

-- Why: returning \`unknown\` pushes the narrowing burden onto every caller. Inevitably, one caller skips it.
-- The fix is to narrow inside the boundary owner and expose the narrow type. Often that means a generic keyed off an enum or schema.
-- Gate: G-35-RT-NO-UNKNOWN · AT-ENFORCEMENTRULES-02.`,

  "e1-3": `Phantom generics are the silent killer. \`function fetch<T>(): Promise<T>\` looks safe but \`T\` widens to \`unknown\` at every call-site because the caller has nothing to bind it to.

-- Two valid patterns: (1) generic inferable from an argument — pass a Zod schema or a discriminator. (2) Default the generic to \`never\`, which forces the caller to write \`fetch<UserDto>('/me')\`.
-- The eslint rule walks every generic parameter and verifies one of those two conditions holds.
-- Gate: G-35-RT-NO-PHANTOM · AT-ENFORCEMENTRULES-03.`,

  "e1-4": `Per ADR-0020 we use branded IDs — \`ItemId\`, \`PageId\`, \`UserId\` — never raw \`string\`. Generic helpers must preserve the brand through the return type.

-- Forbidden: \`function parentOf(id: string): string\` — strips the brand, opens the door to mixing IDs across types.
-- Required: \`function parentOf<TId extends ItemId>(id: TId): TId\` — the brand flows through.
-- Gate: G-35-RT-PRESERVE-BRAND · AT-ENFORCEMENTRULES-04.`,

  // ----- Phase E-2: Runtime validation -----
  "e2-divider": `Phase two: the boundary. Compile-time generics protect in-process types — but anything coming from HTTP, IndexedDB, SSE, a worker, or the URL is untrusted shape until you parse it.`,

  "e2-1": `Five trust boundaries: B1 HTTP fetch · B2 IndexedDB · B3 SSE/WebSocket · B4 React Router loader params · B5 Worker postMessage.

-- The rule: every value sourced from any of these must pass through a Zod parse before any field access. \`as User\` casts at boundaries are forbidden.
-- The eslint rule traces \`response.json()\`, \`event.data\`, \`params\` access etc. and flags missing parse calls.
-- Gate: G-35-RV-PARSE-AT-BOUNDARY · AT-ENFORCEMENTRULES-05.`,

  "e2-2": `Every B1 (HTTP) response parses through \`EnvelopeSchema(rowSchema)\` — never the row schema directly.

-- Why: the envelope enforces our PascalCase contract — Status, Attributes, Results — and validates pagination + error shape BEFORE any field access. Skipping it means trusting shape that never went through CI.
-- Per ADR-0004/0019, every endpoint returns this envelope. The schema is a single import; misuse is an eslint failure, not a runtime crash.
-- Gate: G-35-RV-USE-ENVELOPE · AT-ENFORCEMENTRULES-06.`,

  "e2-3": `The Zod schema mints the brand at the parse boundary. Downstream code receives an already-branded value — there's no place to "forget" to brand.

-- Forbidden: \`Id: z.string()\` for an ID field. Required: \`Id: z.string().brand<'ItemId'>()\`.
-- This pairs with E-1 R4: branded in, branded out, brand preserved through generics. Together they make ID-mixing a compile error end-to-end.
-- Gate: G-35-RV-BRAND-IDS · AT-ENFORCEMENTRULES-07.`,

  "e2-4": `Two rules on one slide because they're a pair: schemas are strict by default, and parse failures throw a typed error.

-- R4 strict: \`.strict()\` on every schema except \`Attributes\` and \`Detail\` (which legitimately carry passthrough metadata). Catches API drift the day it ships, not three sprints later.
-- R5 typed failures: parse failures throw \`BoundaryParseError\` with one of \`USR-35-PARSE | -ENVELOPE | -BRAND\`. Silent \`try { … } catch { return null }\` is forbidden — it's the worst possible failure mode.
-- Gates: G-35-RV-STRICT-DEFAULT · G-35-RV-NO-SILENT-CATCH · AT-08.`,

  // ----- Phase E-3: ESLint authoring -----
  "e3-divider": `Phase three: how the rules themselves are built. We have a custom plugin — without authoring discipline, the plugin becomes the new untyped surface.`,

  "e3-1": `Every custom rule lives at \`eslint-plugins/coding-guidelines/src/rules/<name>.ts\` with a matching \`tests/<name>.test.ts\`, exported from \`src/index.ts\`.

-- Required factory: \`ESLintUtils.RuleCreator(getDocsUrl)\`. Hand-rolled \`module.exports\` rules are forbidden.
-- \`meta.docs.description\` must quote or paraphrase (≤10 words) the source-spec rule. Bare descriptions like "no any" fail CI.
-- Gates: G-35-EL-PLUGIN-LAYOUT · G-35-EL-USE-CREATOR · G-35-EL-MEANINGFUL-DOCS.`,

  "e3-2": `Naming: every rule matches one of three patterns — \`no-*\`, \`require-*\`, or \`prefer-*-over-*\`. Anything else (\`enforce-foo\`, \`check-bar\`, \`lint-baz\`) is rejected.

-- Why three patterns: every rule is either forbidding a thing, requiring a thing, or proposing a swap. There is no fourth shape.
-- Registration triple: every rule must be exported from \`src/index.ts\`, enabled in flat-config \`eslint.config.js\`, AND listed in the docs-URL map. Missing any one blocks merge.
-- Gates: G-35-EL-NAMING · G-35-EL-FULL-REGISTRATION · AT-10/11.`,

  "e3-3": `Two rules per author: cover ≥3 valid AND ≥3 invalid cases via \`RuleTester\`, asserting exact \`messageId\` (never string-matching \`.message\` text — too brittle).

-- Severity: every rule ships at \`error\`. \`warn\` is allowed only with a graduation date in the ledger. \`off\` in committed config is forbidden.
-- Sibling boundary rule: a rule that lingers as permanent \`warn\` past 14 days must promote to \`error\` or be removed entirely. No silent \`warn\` graveyards.
-- Gates: G-35-EL-RULE-TESTER · G-35-EL-NO-OFF · G-35-BE-PROMOTE-OR-REMOVE · AT-12.`,

  // ----- Phase E-4: Boundaries -----
  "e4-divider": `Phase four: the codebase shape. One module per external primitive. One parse per boundary. The whole pipeline wired into CI.`,

  "e4-1": `The chokepoint principle: every external primitive enters the codebase through exactly ONE module — its chokepoint.

-- Today: \`axios\` → \`src/api/client.ts\`. \`idb\` → \`src/lib/idb/client.ts\`. \`EventSource\` → \`src/realtime/sseClient.ts\`. \`Worker\` → \`src/workers/workerClient.ts\`.
-- Two-part rule: (1) chokepoint imports — exactly one module imports the primitive. (2) Export narrowing — that module owns the parse and re-exports only typed, branded, schema-validated values. Re-exporting \`AxiosResponse<unknown>\` defeats the entire purpose.
-- Gate: G-35-BE-CHOKEPOINT-IMPORT · AT-ENFORCEMENTRULES-13.`,

  "e4-2": `React Router loaders read untrusted input from the URL. Every loader/action that reads \`params\` or \`request.url\` must Zod-parse before any field access.

-- The pattern is one schema, one \`.parse(params)\` call, then destructure. After that the IDs flow through the codebase with their brand intact.
-- It's the same B4 boundary rule from E-2 R1 — called out separately because router loaders are a high-traffic foot-gun.
-- Gate: G-35-BE-LOADER-PARSE · AT-ENFORCEMENTRULES-14.`,

  "e4-3": `Putting it all together: four layers, each catching what the previous layer cannot.

-- Layer 1 Compile (tsconfig strict, generic rules) catches \`any\`, \`unknown\`, phantom generics, brand erasure.
-- Layer 2 Lint (custom plugin) catches naming/registration/severity drift and chokepoint violations.
-- Layer 3 Runtime (Zod boundary schemas) catches API drift, untrusted shape, missing brand.
-- Layer 4 Test (type-tests + RuleTester) catches generic regressions and rule false-negatives.
-- All four run on every PR via \`.github/workflows/ci.yml\`. Plus \`scripts/spec-hygiene/00-run-all.mjs\` audits AT-binds.`,

  "e9-closing": `Three takeaways:

1. Rules without gates rot. Ship the gate the same day you ship the rule, or don't ship the rule.
2. \`any\` and \`unknown\` aren't lazy — they're ungated promises. The compiler can't keep them for you.
3. Parse at the boundary, mint the brand at the parse, throw a typed error on failure. Three lines, three layers.

Cross-reference: spec/35-enforcement-rules/97-acceptance-criteria.md and 97a-acceptance-criteria-fixtures.md. Questions?`,

  // ============================================================
  // USER-MANAGEMENT DECK
  // ============================================================
  "u-cover": `This deck covers identity end-to-end: who you are, how we know it, and what you're allowed to do.

-- Audience: anyone touching auth, settings, or admin code.
-- 18 slides across 4 phases (Account, Auth, RBAC, Admin); ~20 minutes.
-- One principle threads through: every permission decision goes through hasRole. No exceptions.`,

  "u-guide": `Read in order. Phase U-1 is what the user sees in their settings panel. U-2 is the auth state machine behind it. U-3 is the helper layer that gates everything else. U-4 is the admin surface built on top.

-- If you only have 5 minutes, jump to U-3 (hasRole / requireRole).
-- Solo mode is real and supported — every flow has a "no server" branch.`,

  "u1-divider": `The owner's view: what a logged-in user can do to their own account.`,
  "u1-1": `Settings panel is one page with sections, not a wizard. Sections: Profile, Security, MFA, Sessions, Danger Zone.

-- Every section is independently saveable; no global "Save" button.
-- Server returns the whole settings object on each PATCH so the client doesn't drift.`,
  "u1-2": `Password change requires current password (re-auth). Email change requires re-auth AND a confirm-link sent to the NEW address — the old address is notified but not asked to confirm.

-- Until the new email is confirmed, the old one is still the login.
-- All sessions except the current one are revoked on success.`,
  "u1-3": `MFA enrolment is TOTP-first; recovery codes generated once and shown once. WebAuthn is opt-in second factor.

-- Enrolment flow: show QR → user enters 6-digit code → server verifies → recovery codes displayed → user must download/copy before close.
-- Disabling MFA requires both current password AND a current TOTP code.`,
  "u1-4": `Delete is soft for 30 days, then a reaper hard-deletes. Restore within the window is a single click and brings back everything including shared docs.

-- Soft-delete revokes all tokens immediately; restore does NOT auto-reissue them.
-- Cross-reference: spec/31-app/01-features/11b-trash-reaper.md.`,

  "u2-divider": `The state machine behind the lock icon.`,
  "u2-1": `Solo mode = local SQLite, no server, no tokens, single implicit user. Sync mode = server, tokens, real users. The same UI runs both; a single \`mode\` flag in app config switches the auth provider.

-- Never check \`mode\` inside features — check it once at the auth boundary.
-- Solo mode still runs hasRole; the resolver just always returns "owner".`,
  "u2-2": `Login is a small state machine: idle → submitting → mfa-required → success | error. MFA is a step, not a separate page — same URL, different state.

-- Wrong password and unknown email return the same error message and same timing (constant-time compare).
-- Rate-limit is per-IP AND per-account; the stricter wins.`,
  "u2-3": `Two tokens: short-lived access (15 min, in memory) and long-lived refresh (30 days, httpOnly cookie). Refresh rotates on every use; reuse of an old refresh = full session kill.

-- Access token is never persisted. Page reload = silent refresh on first request.
-- Logout revokes the refresh family server-side, not just the cookie.`,
  "u2-4": `MFA challenge is its own short-lived token (\`mfa_pending\`, 5 min). It can ONLY exchange for real tokens by presenting a valid TOTP or recovery code.

-- Recovery code is single-use; consumed even on failed subsequent attempts in the same window.
-- WebAuthn challenge replaces TOTP step entirely when registered.`,

  "u3-divider": `One helper. One guard. One escalation path. Everything else is built on these three.`,
  "u3-1": `\`hasRole(userId, role)\` is the single source of truth. It hits the user_roles table via a SECURITY DEFINER function so RLS doesn't recurse. Every permission check in the app — UI, API, jobs — calls this.

-- Never store roles on the user/profile row. Privilege-escalation bait.
-- Cache per-request, never per-session — roles can change mid-session.`,
  "u3-2": `\`requireRole(role)\` is the loader/route guard. It calls hasRole, and on false throws a typed \`ForbiddenError\` that the error boundary renders as 403.

-- Use it in route loaders, not in components. Components should already trust the loader.
-- For optional UI gating (show/hide a button), use hasRole directly — don't throw.`,
  "u3-3": `Role escalation (user → moderator → admin) is a lifecycle event, not a settings toggle. It writes an audit row, revokes all sessions for the target user, and emails them.

-- De-escalation follows the same path. Symmetry matters for audit.
-- Self-promotion is forbidden at the DB level via a CHECK constraint, not just app code.`,

  "u4-divider": `The admin surface. Small on purpose — every action here is audited and reversible.`,
  "u4-1": `Admin routes live under /admin/* and every loader calls \`requireRole("admin")\`. There is no "admin mode" toggle — you're admin or you're not, the route guards do the rest.

-- /admin/users, /admin/audit, /admin/jobs are the three top-level routes.
-- A non-admin hitting /admin gets a 403 page, not a redirect — redirects hide bugs.`,
  "u4-2": `Invite creates a pending user with a single-use signup token (7 day TTL). Deactivate is reversible (sets status=disabled, revokes tokens); delete is the soft-delete path.

-- Invite emails are queued, not sent inline — admin UI shows "queued" not "sent".
-- Deactivating yourself is blocked at the API.`,
  "u4-3": `Audit log is append-only, indexed by actor, target, and action. Surfaced as a virtualised table with filters; export is CSV with a server-signed checksum row.

-- Retention: 2 years hot, 5 years cold. See spec/31-app/05-conventions/09-audit-log-policy.md.
-- Never edit or delete audit rows from the UI. Ever.`,

  "u9-closing": `Three things:

1. Identity is a state machine, not a flag. Solo, logging in, MFA-pending, authenticated, expired — name the states, draw the transitions.
2. \`hasRole\` is the only permission primitive. Everything else — requireRole, admin guards, UI gates — composes it.
3. Every account-changing action is audited and reversible within a window. Soft-delete, session revocation, role changes — symmetry beats cleverness.

Cross-reference: spec/36-user-management/97-acceptance-criteria.md. Questions?`,
};

// Merge with auto-extracted notes from spec markdown.
// Hand-written entries above always win.
import { GENERATED_NOTES } from "./notes.generated";
const MERGED: Record<string, string> = { ...GENERATED_NOTES, ...NOTES };

export function attachNotes<T extends SlideMeta>(slides: T[]): T[] {
  return slides.map((s) => (s.notes ? s : { ...s, notes: MERGED[s.id] }));
}

