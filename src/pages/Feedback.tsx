import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug, Lightbulb, Heart, HelpCircle, Send, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  type FeedbackReport,
  type FeedbackStatus,
  type FeedbackType,
  FEEDBACK_STATUSES,
  FEEDBACK_TYPES,
  TRANSITIONS,
  captureDiagnostics,
  clearFeedback,
  listFeedback,
  purgeExpiredFeedback,
  submitFeedback,
  subscribeFeedback,
  transitionFeedback,
} from "@/lib/applyOp/feedback";

const TYPE_ICON: Record<FeedbackType, React.ComponentType<{ className?: string }>> = {
  Bug: Bug,
  Idea: Lightbulb,
  Praise: Heart,
  Question: HelpCircle,
};

const STATUS_VARIANT: Record<FeedbackStatus, "default" | "secondary" | "destructive" | "outline"> = {
  New: "default",
  Triaged: "secondary",
  InProgress: "secondary",
  Resolved: "outline",
  WontFix: "destructive",
  Duplicate: "outline",
};

export default function Feedback() {
  const [reports, setReports] = useState<FeedbackReport[]>([]);
  const [type, setType] = useState<FeedbackType>("Bug");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");

  const refresh = async () => setReports(await listFeedback());
  useEffect(() => {
    void refresh();
    return subscribeFeedback(() => { void refresh(); });
  }, []);

  async function submit() {
    try {
      await submitFeedback({
        FeedbackType: type,
        Title: title,
        Body: body,
        Diagnostics: captureDiagnostics(),
      });
      setTitle(""); setBody("");
      toast.success("Feedback submitted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submission failed");
    }
  }

  async function transition(id: number, to: FeedbackStatus) {
    try {
      await transitionFeedback(id, to);
      toast.success(`#${id} → ${to}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Transition failed");
    }
  }

  const filtered = useMemo(
    () => statusFilter === "all" ? reports : reports.filter((r) => r.Status === statusFilter),
    [reports, statusFilter],
  );

  return (
    <div className="min-h-screen bg-background p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">Feedback Report</h1>
          <p className="text-sm text-muted-foreground">
            Reference impl of <code>spec/33-feedback-report/</code> — closed enums, transition matrix, 90-day PurgeAfter.
          </p>
        </div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SUBMISSION FORM */}
        <Card className="p-4 space-y-3">
          <h2 className="text-sm font-medium">Submit feedback</h2>

          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FEEDBACK_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-muted-foreground">({title.length}/120)</span></Label>
            <Input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary…" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Body <span className="text-muted-foreground">({body.length}/2000)</span></Label>
            <Textarea value={body} maxLength={2000} rows={6} onChange={(e) => setBody(e.target.value)}
              placeholder="What happened? What did you expect?" />
          </div>

          <div className="rounded border border-border bg-muted/30 p-2 text-[10px] text-muted-foreground space-y-1">
            <div className="font-medium text-xs text-foreground">Auto-captured diagnostics</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(captureDiagnostics(), null, 2)}</pre>
          </div>

          <Button onClick={submit} disabled={!title.trim() || !body.trim()} className="w-full">
            <Send className="w-4 h-4 mr-1" /> Submit
          </Button>
        </Card>

        {/* INBOX */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h2 className="text-sm font-medium">Admin inbox ({filtered.length})</h2>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FeedbackStatus | "all")}>
                <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {FEEDBACK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={async () => {
                const n = await purgeExpiredFeedback();
                toast.message(`Purged ${n} expired`);
              }}>
                <Trash2 className="w-3 h-3 mr-1" /> Purge
              </Button>
              <Button size="sm" variant="ghost" onClick={async () => { await clearFeedback(); }}>
                <RotateCcw className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[60vh] pr-2">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No reports. Submit one on the left.</p>
            )}
            <ul className="space-y-2">
              {filtered.map((r) => {
                const Icon = TYPE_ICON[r.FeedbackType];
                const allowed = TRANSITIONS[r.Status];
                return (
                  <li key={r.FeedbackReportId} className="rounded border border-border p-3 text-xs space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-mono">#{r.FeedbackReportId}</Badge>
                      <Icon className="w-3.5 h-3.5" />
                      <Badge variant="outline">{r.FeedbackType}</Badge>
                      <Badge variant={STATUS_VARIANT[r.Status]}>{r.Status}</Badge>
                      <span className="ml-auto text-muted-foreground">
                        {new Date(r.SubmittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="font-medium">{r.Title}</div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{r.Body}</p>
                    {allowed.length > 0 ? (
                      <div className="flex gap-1 flex-wrap pt-1">
                        <span className="text-muted-foreground self-center">→</span>
                        {allowed.map((to) => (
                          <Button
                            key={to}
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] px-2"
                            onClick={() => transition(r.FeedbackReportId, to)}
                          >
                            {to}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">Terminal state — immutable.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
