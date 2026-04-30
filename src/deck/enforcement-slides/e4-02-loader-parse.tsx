import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-4 · Boundaries" title="Loaders parse params before access"
      subtitle="React Router loaders/actions read untrusted inputs from the URL. Parse before any field access.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <Code label="Forbidden — raw param access" tone="bad">{`export const loader = ({ params }) => {
  const id = params.pageId;     // any
  return load(id);
};`}</Code>
        <Code label="Required — Zod-parse first" tone="good">{`const ParamsSchema = z.object({
  pageId: z.string().brand<'PageId'>(),
});
export const loader = ({ params }) => {
  const { pageId } = ParamsSchema.parse(params);
  return load(pageId);
};`}</Code>
      </div>
      <Footer gate="G-35-BE-LOADER-PARSE" at="AT-ENFORCEMENTRULES-14"
        rule="Every React Router loader/action reading `params` or `request.url` parses through a Zod schema before any field access." />
    </SlideLayout>
  );
}
