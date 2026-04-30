import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applyOp, listItems, listOps, resetPlayground } from "@/lib/applyOp";
import type { Envelope, Item, Op } from "@/lib/applyOp/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Check, Trash2, Plus, RotateCcw, Undo2 } from "lucide-react";

function envelopeSummary(e: Envelope<unknown>) {
  return `${e.Status.Code} ${e.Status.Message} · ${e.Attributes.TotalRecords} record(s)`;
}

export default function ApiPlayground() {
  const [items, setItems] = useState<Item[]>([]);
  const [ops, setOps] = useState<Op[]>([]);
  const [content, setContent] = useState("");
  const [lastEnvelope, setLastEnvelope] = useState<Envelope<unknown> | null>(null);

  async function refresh() {
    const [i, o] = await Promise.all([listItems({ includeTrashed: true }), listOps()]);
    setItems(i.Results);
    setOps(o.Results);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function run<T>(label: string, fn: () => Promise<Envelope<T>>) {
    const env = await fn();
    setLastEnvelope(env);
    if (env.Status.IsSuccess) toast.success(`${label} → ${envelopeSummary(env)}`);
    else toast.error(`${label} → ${envelopeSummary(env)}`);
    await refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">applyOp Playground</h1>
          <p className="text-sm text-muted-foreground">
            Reference implementation of the spec's op-journal pattern. PascalCase envelopes per{" "}
            <code className="text-xs">spec/31-app/06-endpoints</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
          <Link to="/backend-deck"><Button variant="ghost" size="sm">Backend deck</Button></Link>
          <Button variant="outline" size="sm" onClick={async () => { await resetPlayground(); await refresh(); toast.info("Playground reset"); }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
        {/* Items column */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Items ({items.filter((i) => !i.TrashedAt).length})</h2>
          <form
            className="flex gap-2 mb-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!content.trim()) return;
              await run("items.create", () =>
                applyOp("items.create", { ParentId: null, Content: content, ItemType: "Bullet" }),
              );
              setContent("");
            }}
          >
            <Input
              placeholder="New item content…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button type="submit" size="icon"><Plus className="w-4 h-4" /></Button>
          </form>
          <ScrollArea className="h-[60vh] pr-2">
            <ul className="space-y-1.5">
              {items.length === 0 && (
                <li className="text-sm text-muted-foreground italic">No items. Create one above.</li>
              )}
              {items.map((it) => (
                <li
                  key={it.Id}
                  className={`flex items-center gap-2 rounded border border-border px-2 py-1.5 text-sm ${
                    it.TrashedAt ? "opacity-50 line-through" : ""
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      run("items.complete", () =>
                        applyOp("items.complete", { Id: it.Id, IsCompleted: !it.IsCompleted }),
                      )
                    }
                  >
                    <Check className={`w-4 h-4 ${it.IsCompleted ? "text-primary" : "text-muted-foreground"}`} />
                  </Button>
                  <span className={`flex-1 ${it.IsCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {it.Content}
                  </span>
                  <code className="text-[10px] text-muted-foreground">{it.Sort}</code>
                  {it.TrashedAt ? (
                    <Button variant="ghost" size="icon" className="h-6 w-6"
                      onClick={() => run("items.restore", () => applyOp("items.restore", { Id: it.Id }))}>
                      <Undo2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-6 w-6"
                      onClick={() => run("items.delete", () => applyOp("items.delete", { Id: it.Id }))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </Card>

        {/* Op journal */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Op Journal ({ops.length})</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Append-only log; this is what would replay on the WordPress plugin during sync.
          </p>
          <ScrollArea className="h-[65vh] pr-2">
            <ul className="space-y-2">
              {ops.map((op) => (
                <li key={op.OpId} className="rounded border border-border p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={op.Status === "Applied" ? "default" : "destructive"}>{op.Kind}</Badge>
                    <span className="text-muted-foreground">{new Date(op.ClientTs).toLocaleTimeString()}</span>
                  </div>
                  <pre className="mt-1.5 whitespace-pre-wrap break-words text-[10px] text-muted-foreground">
{JSON.stringify(op.Payload, null, 2)}
                  </pre>
                  {op.ErrorMessage && (
                    <p className="text-[10px] text-destructive mt-1">{op.ErrorMessage}</p>
                  )}
                </li>
              ))}
              {ops.length === 0 && (
                <li className="text-sm text-muted-foreground italic">Journal is empty.</li>
              )}
            </ul>
          </ScrollArea>
        </Card>

        {/* Last envelope */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Last Envelope</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Universal response shape — matches{" "}
            <code>97b-endpoint-envelope-fixtures.md</code>.
          </p>
          <ScrollArea className="h-[65vh] pr-2">
            <pre className="text-[11px] leading-relaxed bg-muted/40 rounded p-3 whitespace-pre-wrap break-words">
{lastEnvelope ? JSON.stringify(lastEnvelope, null, 2) : "// run an op to see the envelope here"}
            </pre>
          </ScrollArea>
        </Card>
      </main>
    </div>
  );
}
