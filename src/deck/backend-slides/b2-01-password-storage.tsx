import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-2 · Auth" title="Password storage" subtitle="Argon2id with per-user salt. Never reversible, never logged.">
      <SqlBlock caption="Hash on signup; verify on signin. Argon2id parameters tuned to ~250ms on prod hardware (memory-hard, GPU-resistant).">{`// signup
import { hash, verify } from "@node-rs/argon2";

const passwordHash = await hash(plaintext, {
  memoryCost: 19_456,   // 19 MiB
  timeCost: 2,
  parallelism: 1,
  algorithm: 2,         // argon2id
});

await rootDb.run(
  \`INSERT INTO User (Email, PasswordHash, DisplayName, Timezone, IsActive, IsVerified, CreatedAt)
   VALUES (?, ?, ?, ?, 1, 0, datetime('now'))\`,
  [email, passwordHash, displayName, tz]);

// signin
const row = await rootDb.queryOne(
  \`SELECT UserId, PasswordHash, IsActive FROM User WHERE Email = ? AND DeletedAt IS NULL\`, [email]);

if (!row || !row.IsActive) throw new AuthError("invalid_credentials");
if (!(await verify(row.PasswordHash, plaintext))) throw new AuthError("invalid_credentials");
// → row.UserId is authenticated`}</SqlBlock>
    </SlideLayout>
  );
}
