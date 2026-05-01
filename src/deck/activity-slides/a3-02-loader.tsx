import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase A-3 · Feed UI" title="The loader is mirror-first, ≤16ms p95"
      subtitle="ADR-0023 loader↔queue contract: loaders read the local mirror, never the network. The queue worker handles egress.">
      <pre className="mt-6 rounded-lg border border-border bg-muted/20 p-5 text-sm font-mono leading-relaxed text-foreground overflow-x-auto">
{`// src/routes/page.$pageId.activity.loader.ts
export async function pageActivityLoader(
  { params, request }: LoaderArgs,
): Promise<FeedPage> {
  const { pageId } = z
    .object({ pageId: ItemIdSchema })
    .parse(params);

  const url    = new URL(request.url);
  const cursor = url.searchParams.get('cursor');

  // Reject malformed cursors at the boundary (G-34-UI-CURSOR-VALIDATE)
  if (cursor !== null && !/^\\d{13}_\\d+$/.test(cursor)) {
    throw new BoundaryParseError({ code: 'USR-34-CURSOR' });
  }

  // Mirror-first read — never api.get() from a loader (G-34-UI-MIRROR-FIRST)
  return idb.queryFeed({ pageId, cursor, limit: 50 });
}`}
      </pre>
      <p className="mt-6 text-base text-muted-foreground">
        FR-3: default page size is <strong>50</strong>, well below the 250-item
        view limit. Uncapped pagination is a Code-Red perf bug
        (<code>AT-ACTIVITYFEED-07</code>). Filter combination is server-side —
        no client-side filtering on the full table.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-MIRROR-FIRST</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">G-34-UI-CURSOR-VALIDATE</span>
        <span className="px-2 py-1 rounded bg-primary/15 text-primary font-mono">AT-ACTIVITYFEED-10</span>
      </div>
    </SlideLayout>
  );
}
