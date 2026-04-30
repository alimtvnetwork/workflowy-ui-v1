import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-9 · Migrations" title="Versioning & runner" subtitle="Migrations are numbered SQL files run inside a transaction with `PRAGMA user_version` as the source of truth. No external tool — the runner is ~80 lines.">
      <SqlBlock caption="`PRAGMA foreign_keys = OFF` during migration prevents constraint thrash on table rebuilds. Each file runs in its own transaction so a partial failure rolls back atomically.">{`// migrations/0001_init.sql, 0002_add_mirror_of.sql, ...
// Filename pattern: NNNN_description.sql, NNNN is monotonic.

interface Migration { version: number; name: string; sql: string }

function loadMigrations(): Migration[] {
  return fs.readdirSync("migrations")
    .filter(f => /^\\d{4}_.+\\.sql$/.test(f))
    .map(f => ({
      version: parseInt(f.slice(0, 4), 10),
      name:    f.slice(5, -4),
      sql:     fs.readFileSync(\`migrations/\${f}\`, "utf8"),
    }))
    .sort((a, b) => a.version - b.version);
}

export function migrate(db: Database) {
  const current = db.prepare("PRAGMA user_version").get().user_version as number;
  const pending = loadMigrations().filter(m => m.version > current);

  db.pragma("foreign_keys = OFF");
  for (const m of pending) {
    log.info("migrate", { version: m.version, name: m.name });
    db.transaction(() => {
      db.exec(m.sql);
      db.pragma(\`user_version = \${m.version}\`);
    })();
  }
  db.pragma("foreign_keys = ON");
  db.pragma("foreign_key_check");        // throws on dangling refs
}`}</SqlBlock>
    </SlideLayout>
  );
}
