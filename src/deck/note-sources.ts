// Manual mapping: slideId → spec source. Used by scripts/extract-spec-notes.ts
// to generate `src/deck/notes.generated.ts`. Add a row here, run the script,
// and the slide's auto-note will appear (unless the slide has a hand-written
// note in `notes.ts`, which always wins).
//
// `anchor` (optional) limits extraction to a section: matches a heading whose
// text contains this string (case-insensitive). If omitted, the file's first
// non-frontmatter prose section is used.

export interface NoteSource {
  slideId: string;
  spec: string;       // path relative to repo root, e.g. "spec/31-app/01-features/09a-mirror-cycle-detection.md"
  anchor?: string;    // heading substring, e.g. "Algorithm" or "User Story"
}

export const NOTE_SOURCES: NoteSource[] = [
  // ----- Frontend deck examples -----
  { slideId: "ch1-01", spec: "spec/31-app/00-overview.md" },
  { slideId: "ch1-02", spec: "spec/31-app/00-itemtype-canonical.md" },
  { slideId: "ch16-01-concurrency-ui", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "ch16-02-sync-flow", spec: "spec/31-app/01-features/14b-sync-replay.md" },

  // ----- Backend deck examples -----
  { slideId: "b3-1", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "b3-2", spec: "spec/31-app/01-features/14-concurrency-and-sync.md", anchor: "Pull" },
  { slideId: "b3-6", spec: "spec/31-app/01-features/14b-sync-replay.md" },
  { slideId: "b5-1", spec: "spec/31-app/01-features/09a-mirror-cycle-detection.md", anchor: "Overview" },
  { slideId: "b5-2", spec: "spec/31-app/01-features/09a-mirror-cycle-detection.md", anchor: "Algorithm" },

  // ----- Ops deck examples -----
  { slideId: "o1-01-slos", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o5-05-playbook-restore", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
];
