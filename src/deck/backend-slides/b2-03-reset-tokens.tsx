import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-2 · Reset tokens" title="Forgot-password flow" subtitle="Single-use, short-lived tokens. Same response whether email exists or not.">
      <SqlBlock caption="Email enumeration prevented: handler always returns 200 after fixed delay, regardless of whether the user exists.">{`// POST /wf/v1/auth/forgot
const u = await rootDb.queryOne(
  \`SELECT UserId FROM User WHERE Email = ? AND IsActive = 1\`, [email]);

if (u) {
  const token = randomBytes(32).toString("base64url");
  await rootDb.run(
    \`INSERT INTO PasswordResetToken
       (TokenHash, UserId, IssuedAt, ExpiresAt, UsedAt)
     VALUES (?, ?, datetime('now'), datetime('now', '+1 hour'), NULL)\`,
    [sha256(token), u.UserId]);
  await mailer.send(email, "reset", { link: \`https://wf.app/reset?t=\${token}\` });
}
await sleepUntil(startedAt + 250); // constant-time response
return { ok: true };

// POST /wf/v1/auth/reset { token, newPassword }
const t = await rootDb.queryOne(
  \`SELECT prt.UserId
     FROM PasswordResetToken prt
    WHERE prt.TokenHash = ?
      AND prt.UsedAt IS NULL
      AND datetime(prt.ExpiresAt) > datetime('now')\`,
  [sha256(token)]);
if (!t) throw new AuthError("invalid_or_expired");

await rootDb.tx(async tx => {
  await tx.run(\`UPDATE User SET PasswordHash = ? WHERE UserId = ?\`, [await hash(newPassword), t.UserId]);
  await tx.run(\`UPDATE PasswordResetToken SET UsedAt = datetime('now') WHERE TokenHash = ?\`, [sha256(token)]);
  await tx.run(\`UPDATE Session SET RevokedAt = datetime('now')
                   WHERE UserId = ? AND RevokedAt IS NULL\`, [t.UserId]); // log out everywhere
});`}</SqlBlock>
    </SlideLayout>
  );
}
