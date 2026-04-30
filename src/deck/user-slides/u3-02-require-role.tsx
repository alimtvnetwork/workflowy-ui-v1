import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./_primitives";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase U-3 · RBAC" title="`requireRole` — the loader guard"
      subtitle="Throw early. Let the AuthBoundary render the 403.">
      <div className="mt-6 grid grid-cols-2 gap-8">
        <Code label="Helper">{`async function requireRole(
  userId: UserId,
  role: AppRole,
): Promise<void> {
  if (!(await hasRole(userId, role))) {
    throw new ForbiddenError({
      Code: "RBAC_FORBIDDEN",
      Message: \`Requires \${role}\`,
    });
  }
}`}</Code>
        <Code label="Loader chokepoint">{`// src/routes/guards/requireAdmin.ts
export function requireAdmin<T>(loader) {
  return async (args) => {
    const session = await getSessionOrThrow();
    await Auth.requireRole(session.userId, "Admin");
    return loader({ ...args, session });
  };
}`}</Code>
      </div>
      <Footer at="AT-USERMANAGEMENT-05" gate="G-36-ADMIN-UI-GUARD"
        rule="Every admin route loader is wrapped in requireAdmin; failures throw to AdminBoundary which renders the 403 view." />
    </SlideLayout>
  );
}
