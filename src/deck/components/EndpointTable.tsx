export type Endpoint = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  purpose: string;
};

const methodColor: Record<Endpoint["method"], string> = {
  GET: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  POST: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  PUT: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  PATCH: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  DELETE: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export function EndpointTable({ endpoints }: { endpoints: Endpoint[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-muted/60">
          <tr className="text-base text-muted-foreground">
            <th className="px-5 py-3 w-32">Method</th>
            <th className="px-5 py-3">Path</th>
            <th className="px-5 py-3">Purpose</th>
          </tr>
        </thead>
        <tbody className="font-mono text-lg">
          {endpoints.map((e, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-5 py-3">
                <span className={`px-3 py-1 rounded-md text-sm font-semibold ${methodColor[e.method]}`}>
                  {e.method}
                </span>
              </td>
              <td className="px-5 py-3 text-foreground">{e.path}</td>
              <td className="px-5 py-3 text-muted-foreground font-sans text-base">{e.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
