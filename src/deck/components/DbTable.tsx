export type DbInfo = {
  table: string;
  columns: string[];
  note?: string;
};

export function DbTable({ tables }: { tables: DbInfo[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {tables.map((t) => (
        <div key={t.table} className="rounded-xl border border-border bg-card p-5">
          <div className="font-mono text-xl font-semibold text-foreground">{t.table}</div>
          <div className="mt-2 font-mono text-sm text-muted-foreground">
            {t.columns.join(" · ")}
          </div>
          {t.note && <p className="mt-2 text-sm text-muted-foreground">{t.note}</p>}
        </div>
      ))}
    </div>
  );
}
