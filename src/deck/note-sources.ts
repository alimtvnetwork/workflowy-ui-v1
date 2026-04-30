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
  spec: string;       // path relative to repo root
  anchor?: string;    // heading substring, e.g. "Algorithm" or "User Story"
}

export const NOTE_SOURCES: NoteSource[] = [
  // =========================================================================
  // Frontend deck (/deck) — ch1..ch23
  // =========================================================================
  { slideId: "ch1-01-what-is-workflowy", spec: "spec/31-app/00-overview.md" },
  { slideId: "ch1-02-item-model", spec: "spec/31-app/00-itemtype-canonical.md" },
  { slideId: "ch1-03-views-over-tree", spec: "spec/31-app/01-features/03-layout-structure.md" },

  { slideId: "ch2-01-app-shell-ui", spec: "spec/32-ui-design/01-architecture/03-component-hierarchy.md" },
  { slideId: "ch2-02-navbar", spec: "spec/32-ui-design/06-workflowy-ui/01-navbar/01-layout.md" },
  { slideId: "ch2-03-sidebar", spec: "spec/31-app/01-features/03-layout-structure.md" },
  { slideId: "ch2-04-shell-tech", spec: "spec/32-ui-design/01-architecture/03-component-hierarchy.md" },

  { slideId: "ch3-01-recursive-ui", spec: "spec/31-app/01-features/04-page-content-area.md" },
  { slideId: "ch3-02-zoom", spec: "spec/31-app/01-features/12b-multi-select-zoom.md" },
  { slideId: "ch3-03-recursive-tech", spec: "spec/31-app/01-features/01-information-model.md" },

  { slideId: "ch4-01-editor-ui", spec: "spec/32-ui-design/04-editor/00-overview.md" },
  { slideId: "ch4-02-keys", spec: "spec/32-ui-design/04-editor/02-enter-key-rules.md" },
  { slideId: "ch4-03-slash-menu", spec: "spec/32-ui-design/04-editor/05-additional-behaviors.md" },
  { slideId: "ch4-04-toolbar", spec: "spec/32-ui-design/04-editor/01-rich-text-format.md" },
  { slideId: "ch4-05-editor-tech", spec: "spec/32-ui-design/04-editor/04-interaction-clarifications.md" },

  { slideId: "ch5-01-bullet-anatomy", spec: "spec/32-ui-design/06-workflowy-ui/04-bullet/01-anatomy.md" },
  { slideId: "ch5-02-row-menu", spec: "spec/32-ui-design/06-workflowy-ui/04-bullet/02-three-dot-menu.md" },
  { slideId: "ch5-03-bullet-tech", spec: "spec/31-app/01-features/06-item-context-menu.md" },

  { slideId: "ch6-01-multiselect", spec: "spec/31-app/01-features/12-multi-select.md" },
  { slideId: "ch6-02-dnd", spec: "spec/32-ui-design/04-editor/03-drag-and-drop.md" },
  { slideId: "ch6-03-multiselect-tech", spec: "spec/31-app/01-features/12b-multi-select-zoom.md" },

  { slideId: "ch7-01-search-ui", spec: "spec/32-ui-design/06-workflowy-ui/02-search/00-overview.md" },
  { slideId: "ch7-02-search-flow", spec: "spec/31-app/02-workflows/06-search-query-flow.md" },
  { slideId: "ch7-03-search-tech", spec: "spec/31-app/01-features/16-search-ranking.md" },

  { slideId: "ch8-01-today-calendar-ui", spec: "spec/31-app/01-features/10-today-view.md" },
  { slideId: "ch8-02-today-flow", spec: "spec/31-app/01-features/10-today-view.md", anchor: "Flow" },
  { slideId: "ch8-03-today-tech", spec: "spec/31-app/06-endpoints/10-today-view.md" },

  { slideId: "ch9-01-board-ui", spec: "spec/31-app/01-features/07-board-view.md" },
  { slideId: "ch9-02-dashboard-ui", spec: "spec/31-app/01-features/07b-dashboard-view.md" },
  { slideId: "ch9-03-board-dash-tech", spec: "spec/31-app/06-endpoints/07-board-view.md" },

  { slideId: "ch10-01-mirrors-ui", spec: "spec/31-app/01-features/09-mirrors.md" },
  { slideId: "ch10-02-mirrors-flow", spec: "spec/31-app/02-workflows/09-mirror-create-flow.md" },
  { slideId: "ch10-03-mirrors-tech", spec: "spec/31-app/01-features/09b-mirror-peer-group-model.md" },

  { slideId: "ch11-01-templates-ui", spec: "spec/31-app/01-features/13-templates.md" },
  { slideId: "ch11-02-templates-tech", spec: "spec/31-app/01-features/13b-templates-snapshot-semantics.md" },

  { slideId: "ch12-01-share-ui", spec: "spec/31-app/01-features/08-share-dialog.md" },
  { slideId: "ch12-02-permissions", spec: "spec/31-app/01-features/15-roles-and-permissions.md" },
  { slideId: "ch12-03-share-tech", spec: "spec/31-app/06-endpoints/08-share-dialog.md" },

  { slideId: "ch13-01-trash-ui", spec: "spec/31-app/01-features/11-trash-view.md" },
  { slideId: "ch13-02-trash-flow", spec: "spec/31-app/02-workflows/04-trash-restore-flow.md" },
  { slideId: "ch13-03-trash-tech", spec: "spec/31-app/01-features/11b-trash-reaper.md" },

  { slideId: "ch14-01-right-panel-ui", spec: "spec/32-ui-design/06-workflowy-ui/03-right-panel/00-overview.md" },
  { slideId: "ch14-02-right-panel-tech", spec: "spec/32-ui-design/06-workflowy-ui/03-right-panel/01-handbook-content.md" },

  { slideId: "ch15-01-app-menu-ui", spec: "spec/32-ui-design/06-workflowy-ui/01-navbar/02-breadcrumb.md" },
  { slideId: "ch15-02-settings-ui", spec: "spec/36-user-management/01-account-and-settings.md" },
  { slideId: "ch15-03-settings-tech", spec: "spec/36-user-management/03-rbac-helpers.md" },

  { slideId: "ch16-01-concurrency-ui", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "ch16-02-sync-flow", spec: "spec/31-app/02-workflows/07-sync-replay-flow.md" },
  { slideId: "ch16-03-sync-tech", spec: "spec/31-app/06-endpoints/14b-sync-replay.md" },

  { slideId: "ch17-01-auth-ui", spec: "spec/36-user-management/02-auth-flow.md" },
  { slideId: "ch17-02-rbac", spec: "spec/36-user-management/03-rbac-helpers.md" },
  { slideId: "ch17-03-admin-ui", spec: "spec/36-user-management/04-admin-ui.md" },
  { slideId: "ch17-04-auth-tech", spec: "spec/31-app/05-conventions/11-session-token-lifecycle.md" },

  { slideId: "ch18-01-feedback-ui", spec: "spec/33-feedback-report/03-admin-review-ui.md" },
  { slideId: "ch18-02-feedback-tech", spec: "spec/33-feedback-report/02-submission-flow.md" },

  { slideId: "ch19-01-activity-ui", spec: "spec/34-activity-feed/03-feed-ui.md" },
  { slideId: "ch19-02-activity-tech", spec: "spec/34-activity-feed/02-capture-pipeline.md" },

  { slideId: "ch20-01-enforcement", spec: "spec/35-enforcement-rules/00-overview.md" },
  { slideId: "ch21-01-endpoint-catalogue", spec: "spec/31-app/06-endpoints/16-endpoint-at-matrix.md" },
  { slideId: "ch22-01-db-map", spec: "spec/31-app/07-db-diagram/01-master-erd.md" },
  { slideId: "ch22-02-constraints", spec: "spec/31-app/07-db-diagram/06-indexes.md" },
  { slideId: "ch23-01-closing", spec: "spec/31-app/00-overview.md" },

  // =========================================================================
  // Backend deck (/backend-deck) — b1..b10
  // =========================================================================
  { slideId: "b1-01-process-model", spec: "spec/31-app/05-conventions/31-wp-plugin-folder-skeleton.md" },
  { slideId: "b1-02-two-db", spec: "spec/31-app/07-db-diagram/00b-split-db-anchor.md" },
  { slideId: "b1-03-request-lifecycle", spec: "spec/31-app/06-endpoints/00-overview.md" },

  { slideId: "b2-01-password-storage", spec: "spec/36-user-management/02-auth-flow.md" },
  { slideId: "b2-02-sessions", spec: "spec/31-app/05-conventions/11-session-token-lifecycle.md" },
  { slideId: "b2-03-reset-tokens", spec: "spec/31-app/05-conventions/11-session-token-lifecycle.md" },
  { slideId: "b2-04-rbac", spec: "spec/36-user-management/03-rbac-helpers.md" },

  { slideId: "b3-01-op-shapes", spec: "spec/31-app/06-endpoints/97b-endpoint-envelope-fixtures.md" },
  { slideId: "b3-02-lww", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "b3-03-cursors", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "b3-04-sequence", spec: "spec/31-app/02-workflows/07-sync-replay-flow.md" },
  { slideId: "b3-05-sse", spec: "spec/31-app/05-conventions/32-sse-php-implementation.md" },
  { slideId: "b3-06-offline-replay", spec: "spec/31-app/01-features/14b-offline-queue.md" },

  { slideId: "b4-01-move-atomicity", spec: "spec/31-app/01-features/06-item-context-menu.md" },
  { slideId: "b4-02-fractional-index", spec: "spec/31-app/01-features/01-information-model.md" },
  { slideId: "b4-03-rebalance", spec: "spec/31-app/01-features/01-information-model.md" },
  { slideId: "b4-04-soft-delete", spec: "spec/31-app/01-features/11-trash-view.md" },

  { slideId: "b5-01-peer-groups", spec: "spec/31-app/01-features/09b-mirror-peer-group-model.md" },
  { slideId: "b5-02-cycle-detection", spec: "spec/31-app/01-features/09a-mirror-cycle-detection.md", anchor: "Algorithm" },
  { slideId: "b5-03-broken-at", spec: "spec/31-app/02-workflows/08-mirror-detach-flow.md" },

  { slideId: "b6-01-snapshot", spec: "spec/31-app/01-features/13b-templates-snapshot-semantics.md" },
  { slideId: "b6-02-deep-copy", spec: "spec/31-app/02-workflows/02-template-application-flow.md" },
  { slideId: "b6-03-cascading-perms", spec: "spec/31-app/01-features/08b-sharing-mirror-interaction.md" },

  { slideId: "b7-01-job-runner", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "b7-02-trash-reaper", spec: "spec/31-app/01-features/11b-trash-reaper.md" },
  { slideId: "b7-03-activity-purge", spec: "spec/34-activity-feed/04-retention-and-purge.md" },
  { slideId: "b7-04-sse-fanout", spec: "spec/31-app/05-conventions/32-sse-php-implementation.md" },

  { slideId: "b8-01-fts5", spec: "spec/31-app/01-features/16-search-ranking.md" },
  { slideId: "b8-02-operator-parser", spec: "spec/32-ui-design/06-workflowy-ui/02-search/06-query-grammar.md" },
  { slideId: "b8-03-write-hooks", spec: "spec/31-app/06-endpoints/15b-search.md" },

  { slideId: "b9-01-versioning", spec: "spec/31-app/05-conventions/01-axios-version-control.md" },
  { slideId: "b9-02-v2-example", spec: "spec/31-app/06-endpoints/16-endpoint-at-matrix.md" },
  { slideId: "b9-03-query-plans", spec: "spec/31-app/07-db-diagram/06-indexes.md" },

  { slideId: "b10-01-zod", spec: "spec/35-enforcement-rules/02-runtime-validation.md" },
  { slideId: "b10-02-eslint-boundary", spec: "spec/35-enforcement-rules/04-boundary-enforcement.md" },
  { slideId: "b10-03-runbook", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "b10-04-closing", spec: "spec/31-app/05-conventions/00-overview.md" },

  // =========================================================================
  // Ops deck (/ops-deck) — o1..o5
  // =========================================================================
  { slideId: "o1-01-slos", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o1-02-error-budget", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },

  { slideId: "o2-01-metrics-surface", spec: "spec/31-app/05-conventions/09-audit-log-policy.md" },
  { slideId: "o2-02-logs-traces", spec: "spec/31-app/05-conventions/09-audit-log-policy.md" },
  { slideId: "o2-03-health-checks", spec: "spec/31-app/05-conventions/08-api-rate-limiting.md" },

  { slideId: "o3-01-pages", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o3-02-tickets", spec: "spec/31-app/05-conventions/09-audit-log-policy.md" },

  { slideId: "o4-01-overview-dashboard", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o4-02-sync-deep-dive", spec: "spec/31-app/01-features/14-concurrency-and-sync.md" },
  { slideId: "o4-03-storage-jobs", spec: "spec/31-app/01-features/11b-trash-reaper.md" },

  { slideId: "o5-01-on-call", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o5-02-playbook-sync-errors", spec: "spec/31-app/02-workflows/07-sync-replay-flow.md" },
  { slideId: "o5-03-playbook-db-locked", spec: "spec/31-app/05-conventions/08-api-rate-limiting.md" },
  { slideId: "o5-04-playbook-rollback", spec: "spec/31-app/05-conventions/01-axios-version-control.md" },
  { slideId: "o5-05-playbook-restore", spec: "spec/31-app/05-conventions/14-backup-and-dr-policy.md" },
  { slideId: "o5-06-closing", spec: "spec/31-app/05-conventions/00-overview.md" },

  // =========================================================================
  // Enforcement deck (/enforcement-deck) — e1..e4 + closing
  // =========================================================================
  { slideId: "e1-01-no-any", spec: "spec/35-enforcement-rules/01-generic-return-types.md" },
  { slideId: "e1-02-no-unknown", spec: "spec/35-enforcement-rules/01-generic-return-types.md", anchor: "unknown" },
  { slideId: "e1-03-no-phantom", spec: "spec/35-enforcement-rules/01-generic-return-types.md" },
  { slideId: "e1-04-preserve-brand", spec: "spec/35-enforcement-rules/01-generic-return-types.md", anchor: "brand" },

  { slideId: "e2-01-parse-boundary", spec: "spec/35-enforcement-rules/02-runtime-validation.md" },
  { slideId: "e2-02-envelope", spec: "spec/31-app/06-endpoints/97b-endpoint-envelope-fixtures.md" },
  { slideId: "e2-03-brand-ids", spec: "spec/35-enforcement-rules/02-runtime-validation.md", anchor: "brand" },
  { slideId: "e2-04-strict-and-fail", spec: "spec/35-enforcement-rules/02-runtime-validation.md", anchor: "fail" },

  { slideId: "e3-01-plugin-layout", spec: "spec/35-enforcement-rules/03-eslint-rule-authoring.md" },
  { slideId: "e3-02-naming-registration", spec: "spec/35-enforcement-rules/03-eslint-rule-authoring.md", anchor: "naming" },
  { slideId: "e3-03-tester-severity", spec: "spec/35-enforcement-rules/03-eslint-rule-authoring.md" },

  { slideId: "e4-01-chokepoint", spec: "spec/35-enforcement-rules/04-boundary-enforcement.md" },
  { slideId: "e4-02-loader-parse", spec: "spec/35-enforcement-rules/04-boundary-enforcement.md", anchor: "loader" },
  { slideId: "e4-03-pipeline", spec: "spec/31-app/05-conventions/02-ci-quality-gates.md" },

  { slideId: "e9-closing", spec: "spec/35-enforcement-rules/00-overview.md" },

  // =========================================================================
  // User-management deck (/user-deck) — u-cover, u1..u4 + closing
  // =========================================================================
  { slideId: "u-cover", spec: "spec/36-user-management/00-overview.md" },
  { slideId: "u-guide", spec: "spec/36-user-management/00-overview.md" },

  { slideId: "u1-1", spec: "spec/36-user-management/01-account-and-settings.md" },
  { slideId: "u1-2", spec: "spec/36-user-management/01-account-and-settings.md", anchor: "password" },
  { slideId: "u1-3", spec: "spec/36-user-management/01-account-and-settings.md", anchor: "mfa" },
  { slideId: "u1-4", spec: "spec/36-user-management/01-account-and-settings.md", anchor: "delete" },

  { slideId: "u2-1", spec: "spec/36-user-management/02-auth-flow.md" },
  { slideId: "u2-2", spec: "spec/36-user-management/02-auth-flow.md", anchor: "login" },
  { slideId: "u2-3", spec: "spec/36-user-management/02-auth-flow.md", anchor: "token" },
  { slideId: "u2-4", spec: "spec/36-user-management/02-auth-flow.md", anchor: "mfa" },

  { slideId: "u3-1", spec: "spec/36-user-management/03-rbac-helpers.md" },
  { slideId: "u3-2", spec: "spec/36-user-management/03-rbac-helpers.md", anchor: "require" },
  { slideId: "u3-3", spec: "spec/36-user-management/03-rbac-helpers.md", anchor: "escalation" },

  { slideId: "u4-1", spec: "spec/36-user-management/04-admin-ui.md" },
  { slideId: "u4-2", spec: "spec/36-user-management/04-admin-ui.md", anchor: "invite" },
  { slideId: "u4-3", spec: "spec/36-user-management/04-admin-ui.md", anchor: "audit" },

  { slideId: "u9-closing", spec: "spec/36-user-management/00-overview.md" },
];
