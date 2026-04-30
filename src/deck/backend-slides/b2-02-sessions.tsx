import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-2 · Sessions" title="Cookie format & validation" subtitle="HttpOnly, Secure, SameSite=Lax. Opaque token; secret stays server-side.">
      <div className="grid grid-cols-2 gap-4">
        <SqlBlock size={17} caption="Issued on signin.">{`// create session
const token = randomBytes(32).toString("base64url");
const tokenHash = sha256(token);

await rootDb.run(
  \`INSERT INTO Session
     (SessionId, UserId, TokenHash, IssuedAt, ExpiresAt, UserAgent, IpHash)
   VALUES (?, ?, ?, datetime('now'),
           datetime('now', '+30 days'), ?, ?)\`,
  [uuid(), userId, tokenHash, ua, ipHash]);

setCookie(res, "wf_sess", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
});`}</SqlBlock>
        <SqlBlock size={17} caption="Validated on every request — middleware before any handler.">{`// authenticate middleware
const token = req.cookies.wf_sess;
if (!token) throw new AuthError("no_session");

const tokenHash = sha256(token);
const s = await rootDb.queryOne(
  \`SELECT s.SessionId, s.UserId, s.ExpiresAt,
          u.IsActive, u.DeletedAt
     FROM Session s
     JOIN User u ON u.UserId = s.UserId
    WHERE s.TokenHash = ?
      AND s.RevokedAt IS NULL\`, [tokenHash]);

if (!s) throw new AuthError("invalid_session");
if (Date.now() > Date.parse(s.ExpiresAt))
  throw new AuthError("expired");
if (!s.IsActive || s.DeletedAt)
  throw new AuthError("inactive");

req.user = { userId: s.UserId, sessionId: s.SessionId };`}</SqlBlock>
      </div>
    </SlideLayout>
  );
}
