import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-3 · RBAC" title="One central `hasRole`"
      subtitle="Every authorization check reads from one helper. No ad-hoc role lookups in callers.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Required" tone="good">{`// Auth::hasRole — security-definer, server-side only
function hasRole(
  userId: UserId,
  role: AppRole,
): Promise<boolean> {
  // 1. cache hit (60 s TTL keyed by userId)
  // 2. SELECT 1 FROM UserRole
  //    WHERE UserId = ? AND Role = ?
  // 3. cache miss → read & set
}`}</Code>
        <Code label="Forbidden" tone="bad">{`// in a REST controller
if (req.user.roles.includes("admin")) { … }   // ✗ trusts client claim

// in a React component
if (user.role === "admin") show(<AdminMenu />); // ✗ client-side gate

// inline DB lookup
const ok = db.query("SELECT … FROM UserRole …"); // ✗ duplicates helper`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-04" gate="G-RBAC-CENTRAL"
        rule="All RBAC decisions go through Auth::hasRole; ESLint forbids inline role lookups in controllers and components." />
    </SlideLayout>
  );
}
