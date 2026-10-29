# Recent session — 2026-10-29

This note records what was created and shipped on 2026-10-29. Paths below are relative git paths.

## go-email-reader

- Specifications for warm-up sequences 08 through 13 are in `02-spec/21-app/08-ui-and-warm-up-algorithm-improvements/` through `02-spec/21-app/13-ui-and-warm-up-algorithm-improvements/`.
- Plans are in `.ai-memory/plans/pending/08-ui-and-warm-up-algorithm-improvements.md` through `.ai-memory/plans/pending/13-ui-and-warm-up-algorithm-improvements.md`.
- Sequence 08 is the connector and gate map. Sequence 09 is brakes. Sequence 10 is the send lease and cool-down. Sequence 11 is the shadow compare. Sequence 12 is the pace envelope. Sequence 13 is the shared quiet window.
- The live tick now consults `internal/warmup/gatefeed.go`. A peer can tighten the remaining-send cap and cannot raise it. An absent or stale peer does not stop local warm-up. Local quiet hours hold. A quiet skip does not send. A dry run does not spend the cap. The gate order is health, cadence, connector, theme.
- The reader UI gate map reads `GET /api/warmup/gates`.
- Commit `f3864ee` is on `main` and is pushed. The remote uses SSH.
- Sequences 08 through 13 stay pending as catalogs. Only the gate engine is implemented.
- `user.email` is `local@gitmap`. The name is `gitmap automation`.

## gitmap-v28

- Cursor-like IDE setup landed in `cli/cmdide/ide_setup.go`, `cli/cmdide/setup/`, and `cli/cmdui/ui_server_ide_setup.go`.
- The spec is `02-spec/21-app/352-cursor-like-ide-setup-from-gitmap/`.
- Pushed commits include `3229df9b4`, `864012968`, and `04690b952`.
- `cli/cov` is a coverage profile and was not committed.

## repo-cache

- Commit `f474298` stores heatmap databases, including `.heatmap/06-cursor/go-email-reader/heatmap.db`.
- SQLite `-shm` and `-wal` sidecars were not committed.

## Push denied

These local commits are still unpushed because GitHub denied `alimtvnetwork`:

- `alim.karim.profile` (19 commits)
- `kubernetes-training-v1` (19 commits)
- `common-linux-installer` (1 commit)

## Rules learned

- Do not put a personal access token in a git remote URL. Use SSH.
- Do not commit coverage profiles or SQLite sidecar files.

## Last 30 commits in this repo

```text
f6823d1 chore(version) - bump to v0.0.53
c9f4c07 feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts (29-Oct-26 06:33 pm)
36b110d chore(version) - bump to v0.0.52
24faecb feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts (29-Oct-26 04:24 pm)
8f16fd2 chore(version) - bump to v0.0.51
68af8fa feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts (29-Oct-26 03:18 pm)
59caf37 chore(version) - bump to v0.0.50
a4e2988 feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts (29-Oct-26 02:55 pm)
4cc71c6 chore(version) - bump to v0.0.49
b2233af feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts (28-Oct-26 10:19 am)
9783bb5 chore(version) - bump to v0.0.48
2d6d2c2 feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts
bc71a46 chore(version) - bump to v0.0.47
63f9635 feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts
d821a07 chore(version): bump to v0.0.46
0b29a86 feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
9db4b69 chore(version): bump to v0.0.45
8c2a18f feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
8ecda7f chore(version): bump to v0.0.44
a003300 feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
c11b60d chore(version): bump to v0.0.43
65cabc8 feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
44f4a47 chore(version): bump to v0.0.42
3b1f173 feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
a55c89e chore(version) - bump to v0.0.41
b1af1d9 feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts
d6657c3 chore(version): bump to v0.0.40
342350d feat(sync): sync canonical prompts, skills, gitmap agent standards, and purge deprecated 46 task manager
a63cedf chore(version) - bump to v0.0.39
4efabde feat(sync) - sync canonical v6 execute suite, gitmap heatmap telemetry, skills, and prompts
```
