import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-10 · Enforcement" title="ESLint boundary rules" subtitle="The two-DB split (B-1) and contract layer (B-10.1) are enforced by lint, not discipline. Imports that cross boundaries fail CI.">
      <SqlBlock caption="`no-restricted-imports` is per-directory. Domain code can't reach into transport, transport can't reach into storage, and nobody imports raw `better-sqlite3` outside `src/db/`.">{`// .eslintrc.cjs (excerpts)
module.exports = {
  overrides: [
    // Domain layer — no I/O, no framework imports
    {
      files: ["src/domain/**/*.ts"],
      rules: {
        "no-restricted-imports": ["error", { patterns: [
          { group: ["express", "better-sqlite3", "node:fs", "node:net"],
            message: "Domain code must not depend on I/O. Pass it in." },
          { group: ["src/transport/*", "src/db/*"],
            message: "Domain cannot import outward layers." },
        ]}],
      },
    },

    // Transport — no SQL, no domain internals
    {
      files: ["src/transport/**/*.ts"],
      rules: {
        "no-restricted-imports": ["error", { patterns: [
          { group: ["better-sqlite3", "src/db/raw/*"],
            message: "Transport must go through domain services." },
        ]}],
        "no-restricted-syntax": ["error", {
          selector: "TemplateLiteral[expressions.length>0]",
          message: "No SQL template strings outside src/db/.",
        }],
      },
    },

    // App DB code can't touch templates DB and vice-versa
    {
      files: ["src/db/app/**/*.ts"],
      rules: { "no-restricted-imports": ["error", { patterns: ["src/db/templates/*"] }] },
    },
    {
      files: ["src/db/templates/**/*.ts"],
      rules: { "no-restricted-imports": ["error", { patterns: ["src/db/app/*"] }] },
    },
  ],
};

// Pre-commit + CI both run: eslint --max-warnings=0`}</SqlBlock>
    </SlideLayout>
  );
}
