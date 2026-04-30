import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  applyOp,
  listBoardColumns,
  listItems,
  listMirrorMembers,
  listOps,
  listShares,
  resetPlayground,
} from "@/lib/applyOp";
import type {
  BoardColumn,
  Envelope,
  Item,
  MirrorMember,
  Op,
  ShareGrant,
  SharePermission,
} from "@/lib/applyOp/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Trash2, Plus, RotateCcw, Undo2, Diamond, X, Link2, AlertTriangle } from "lucide-react";

function envelopeSummary(e: Envelope<unknown>) {
  return `${e.Status.Code} ${e.Status.Message} · ${e.Attributes.TotalRecords} record(s)`;
}

export default function ApiPlayground() {
  const [items, setItems] = useState<Item[]>([]);
  const [ops, setOps] = useState<Op[]>([]);
  const [members, setMembers] = useState<MirrorMember[]>([]);
  const [shares, setShares] = useState<ShareGrant[]>([]);
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [content, setContent] = useState("");
  const [lastEnvelope, setLastEnvelope] = useState<Envelope<unknown> | null>(null);

  // Mirror form
  const [mirrorSourceId, setMirrorSourceId] = useState<string>("");
  const [mirrorParentId, setMirrorParentId] = useState<string>("__root__");

  // Share form
  const [shareItemId, setShareItemId] = useState<string>("");
  const [shareEmail, setShareEmail] = useState("");
  const [sharePerm, setSharePerm] = useState<SharePermission>("View");

  // Board form
  const [boardId, setBoardId] = useState<string>("");
  const [columnTitle, setColumnTitle] = useState("");
  const [cardContent, setCardContent] = useState("");
  const [activeColumnId, setActiveColumnId] = useState<string>("");

  async function refresh() {
    const [i, o, m, s, c] = await Promise.all([
      listItems({ includeTrashed: true }),
      listOps(),
      listMirrorMembers(),
      listShares(),
      listBoardColumns(),
    ]);
    setItems(i.Results);
    setOps(o.Results);
    setMembers(m.Results);
    setShares(s.Results);
    setColumns(c.Results);
  }

  useEffect(() => { refresh(); }, []);

  async function run<T>(label: string, fn: () => Promise<Envelope<T>>) {
    const env = await fn();
    setLastEnvelope(env);
    if (env.Status.IsSuccess) toast.success(`${label} → ${envelopeSummary(env)}`);
    else toast.error(`${label} → ${envelopeSummary(env)}`);
    await refresh();
  }

  const liveItems = items.filter((i) => !i.TrashedAt);
  const boards = liveItems.filter((i) => i.ItemType === "Board");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">applyOp Playground</h1>
          <p className="text-sm text-muted-foreground">
            Reference impl of the spec's op-journal pattern. PascalCase envelopes per{" "}
            <code className="text-xs">spec/31-app/06-endpoints</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/"><Button variant="ghost" size="sm">Home</Button></Link>
          <Link to="/backend-deck"><Button variant="ghost" size="sm">Backend deck</Button></Link>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await resetPlayground();
              const a = await applyOp("items.create", { ParentId: null, Content: "Cycle A", ItemType: "Task" });
              const aId = (a.Results[0] as Item)?.Id;
              const b = await applyOp("items.create", { ParentId: aId, Content: "Cycle B", ItemType: "Task" });
              const bId = (b.Results[0] as Item)?.Id;
              const c = await applyOp("items.create", { ParentId: bId, Content: "Cycle C", ItemType: "Task" });
              const cId = (c.Results[0] as Item)?.Id;
              // Attempt to move A under C → should fail with ERR_CYCLE
              const env = await applyOp("items.move", { Id: aId, NewParentId: cId });
              setLastEnvelope(env);
              await refresh();
              if (env.Status.Code === "ERR_CYCLE") {
                toast.error(`ERR_CYCLE blocked: ${envelopeSummary(env)}`);
              } else {
                toast.warning(`Expected ERR_CYCLE, got ${env.Status.Code}`);
              }
            }}
          >
            <AlertTriangle className="w-4 h-4 mr-1" /> Try cycle
          </Button>
          <Button variant="outline" size="sm" onClick={async () => { await resetPlayground(); await refresh(); toast.info("Playground reset"); }}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 p-6">
        <Tabs defaultValue="items" className="w-full">
          <TabsList>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="mirrors">Mirrors ({members.length})</TabsTrigger>
            <TabsTrigger value="shares">Shares ({shares.filter((s) => !s.RevokedAt).length})</TabsTrigger>
            <TabsTrigger value="boards">Boards ({boards.length})</TabsTrigger>
          </TabsList>

          {/* ITEMS */}
          <TabsContent value="items">
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Items ({liveItems.length})</h2>
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
                <Input placeholder="New item content…" value={content} onChange={(e) => setContent(e.target.value)} />
                <Button type="submit" size="icon"><Plus className="w-4 h-4" /></Button>
                <Button type="button" variant="outline" size="sm" onClick={() =>
                  content.trim() && run("items.create(Board)", () =>
                    applyOp("items.create", { ParentId: null, Content: content, ItemType: "Board" }),
                  ).then(() => setContent(""))
                }>+ Board</Button>
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
                      <Button variant="ghost" size="icon" className="h-6 w-6"
                        onClick={() => run("items.complete", () =>
                          applyOp("items.complete", { Id: it.Id, IsCompleted: !it.IsCompleted }),
                        )}>
                        <Check className={`w-4 h-4 ${it.IsCompleted ? "text-primary" : "text-muted-foreground"}`} />
                      </Button>
                      {it.PeerGroupId && (
                        <Diamond className="w-3 h-3 text-primary" aria-label="Mirror" />
                      )}
                      {it.ItemType === "Board" && <Badge variant="outline" className="h-5">Board</Badge>}
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
          </TabsContent>

          {/* MIRRORS */}
          <TabsContent value="mirrors">
            <Card className="p-4">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Diamond className="w-4 h-4 text-primary" /> Mirror Peer Groups
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Per <code>spec/31-app/01-features/09b</code>: peer-group identity, not source/copy. Editing
                content/notes/completion in any peer propagates to all peers.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Select value={mirrorSourceId} onValueChange={setMirrorSourceId}>
                  <SelectTrigger><SelectValue placeholder="Source item" /></SelectTrigger>
                  <SelectContent>
                    {liveItems.map((i) => (
                      <SelectItem key={i.Id} value={i.Id}>{i.Content}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={mirrorParentId} onValueChange={setMirrorParentId}>
                  <SelectTrigger><SelectValue placeholder="New parent" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__root__">— root —</SelectItem>
                    {liveItems.map((i) => (
                      <SelectItem key={i.Id} value={i.Id}>{i.Content}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" disabled={!mirrorSourceId} onClick={() =>
                run("mirrors.create", () => applyOp("mirrors.create", {
                  SourceItemId: mirrorSourceId,
                  NewParentId: mirrorParentId === "__root__" ? null : mirrorParentId,
                }))
              }>
                <Link2 className="w-4 h-4 mr-1" /> Create mirror
              </Button>

              <div className="mt-6 space-y-3">
                {Object.entries(
                  members.reduce<Record<string, MirrorMember[]>>((acc, m) => {
                    (acc[m.PeerGroupId] ??= []).push(m); return acc;
                  }, {}),
                ).map(([gid, ms]) => (
                  <div key={gid} className="rounded border border-border p-2">
                    <div className="text-[10px] text-muted-foreground font-mono mb-1">PeerGroup {gid.slice(0, 12)}…</div>
                    <ul className="space-y-1">
                      {ms.map((m) => {
                        const it = items.find((i) => i.Id === m.ItemId);
                        return (
                          <li key={m.ItemId} className="flex items-center gap-2 text-sm">
                            <Diamond className="w-3 h-3 text-primary" />
                            <span className="flex-1">{it?.Content ?? "(missing)"}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6"
                              onClick={() => run("mirrors.detach", () => applyOp("mirrors.detach", { ItemId: m.ItemId }))}>
                              <X className="w-4 h-4" />
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No mirror peer groups yet.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* SHARES */}
          <TabsContent value="shares">
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Share Grants</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Per <code>spec/31-app/01-features/08-share-dialog</code>: per-item ACL with View/Edit/Admin. Cascading.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <Select value={shareItemId} onValueChange={setShareItemId}>
                  <SelectTrigger><SelectValue placeholder="Item" /></SelectTrigger>
                  <SelectContent>
                    {liveItems.map((i) => (
                      <SelectItem key={i.Id} value={i.Id}>{i.Content}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="grantee@email" value={shareEmail} onChange={(e) => setShareEmail(e.target.value)} />
                <Select value={sharePerm} onValueChange={(v) => setSharePerm(v as SharePermission)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="View">View</SelectItem>
                    <SelectItem value="Edit">Edit</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="sm" disabled={!shareItemId || !shareEmail}
                onClick={() => run("shares.grant", () => applyOp("shares.grant", {
                  ItemId: shareItemId, GranteeEmail: shareEmail, Permission: sharePerm,
                })).then(() => setShareEmail(""))
              }>
                Grant access
              </Button>

              <ul className="mt-6 space-y-1.5">
                {shares.map((s) => {
                  const it = items.find((i) => i.Id === s.ItemId);
                  return (
                    <li key={s.ShareId} className={`flex items-center gap-2 rounded border border-border px-2 py-1.5 text-sm ${s.RevokedAt ? "opacity-50 line-through" : ""}`}>
                      <Badge variant="outline">{s.Permission}</Badge>
                      <span className="flex-1 truncate">
                        <span className="text-muted-foreground">{s.GranteeEmail}</span>
                        {" → "}
                        <span>{it?.Content ?? "(missing)"}</span>
                      </span>
                      {!s.RevokedAt && (
                        <Button variant="ghost" size="icon" className="h-6 w-6"
                          onClick={() => run("shares.revoke", () => applyOp("shares.revoke", { ShareId: s.ShareId }))}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </li>
                  );
                })}
                {shares.length === 0 && <li className="text-sm text-muted-foreground italic">No share grants.</li>}
              </ul>
            </Card>
          </TabsContent>

          {/* BOARDS */}
          <TabsContent value="boards">
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Boards</h2>
              <p className="text-xs text-muted-foreground mb-3">
                Per <code>spec/31-app/01-features/07-board-view</code>: a Board item has columns; cards are items
                with a <code>ColumnId</code>.
              </p>
              <div className="flex gap-2 mb-3">
                <Select value={boardId} onValueChange={(v) => { setBoardId(v); setActiveColumnId(""); }}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Pick a Board…" /></SelectTrigger>
                  <SelectContent>
                    {boards.map((b) => (
                      <SelectItem key={b.Id} value={b.Id}>{b.Content}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {boardId && (
                <>
                  <div className="flex gap-2 mb-3">
                    <Input placeholder="New column title…" value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)} />
                    <Button size="sm" disabled={!columnTitle.trim()} onClick={() =>
                      run("boards.addColumn", () => applyOp("boards.addColumn", { BoardItemId: boardId, Title: columnTitle }))
                        .then(() => setColumnTitle(""))
                    }>+ Column</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {columns.filter((c) => c.BoardItemId === boardId).map((col) => {
                      const cards = liveItems.filter((i) => i.ColumnId === col.ColumnId);
                      return (
                        <div key={col.ColumnId} className="rounded border border-border p-2 bg-muted/30">
                          <div className="text-sm font-medium mb-2">{col.Title} <span className="text-muted-foreground">({cards.length})</span></div>
                          <div className="flex gap-1 mb-2">
                            <Input placeholder="card…" value={activeColumnId === col.ColumnId ? cardContent : ""}
                              onFocus={() => setActiveColumnId(col.ColumnId)}
                              onChange={(e) => { setActiveColumnId(col.ColumnId); setCardContent(e.target.value); }} />
                            <Button size="icon" className="h-9 w-9" disabled={activeColumnId !== col.ColumnId || !cardContent.trim()}
                              onClick={() => run("items.create(card)", () => applyOp("items.create", {
                                ParentId: boardId, Content: cardContent, ItemType: "Bullet", ColumnId: col.ColumnId,
                              })).then(() => setCardContent(""))}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <ul className="space-y-1">
                            {cards.map((card) => (
                              <li key={card.Id} className="rounded bg-background border border-border px-2 py-1 text-xs flex items-center gap-1">
                                <span className="flex-1">{card.Content}</span>
                                <Select value="" onValueChange={(targetCol) =>
                                  targetCol && run("boards.moveCard", () => applyOp("boards.moveCard", {
                                    CardItemId: card.Id, TargetColumnId: targetCol,
                                  }))
                                }>
                                  <SelectTrigger className="h-6 w-16 text-[10px]"><SelectValue placeholder="move" /></SelectTrigger>
                                  <SelectContent>
                                    {columns.filter((c) => c.BoardItemId === boardId && c.ColumnId !== col.ColumnId).map((c) => (
                                      <SelectItem key={c.ColumnId} value={c.ColumnId}>{c.Title}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {boards.length === 0 && (
                <p className="text-sm text-muted-foreground italic mt-2">
                  No boards yet — create an item with type Board on the Items tab (use the “+ Board” button).
                </p>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* RIGHT COLUMN: journal + envelope */}
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Op Journal ({ops.length})</h2>
            <p className="text-xs text-muted-foreground mb-2">
              Append-only log; replays on the WordPress plugin during sync.
            </p>
            <ScrollArea className="h-[35vh] pr-2">
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
                    {op.ErrorMessage && <p className="text-[10px] text-destructive mt-1">{op.ErrorMessage}</p>}
                  </li>
                ))}
                {ops.length === 0 && <li className="text-sm text-muted-foreground italic">Journal is empty.</li>}
              </ul>
            </ScrollArea>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-2">Last Envelope</h2>
            <ScrollArea className="h-[35vh] pr-2">
              <pre className="text-[11px] leading-relaxed bg-muted/40 rounded p-3 whitespace-pre-wrap break-words">
{lastEnvelope ? JSON.stringify(lastEnvelope, null, 2) : "// run an op to see the envelope here"}
              </pre>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}
