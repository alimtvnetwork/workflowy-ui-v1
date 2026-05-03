import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockNavbar, MockPanel, Chip } from "../components/MockUI";

function Stat({ label, value, tone }: { label: string; value: string; tone?: "primary" | "warn" | "danger" | "success" }) {
  const colors = {
    primary: "text-primary",
    warn: "text-yellow-500",
    danger: "text-red-500",
    success: "text-green-500",
  };
  return (
    <MockPanel>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-4xl font-bold ${tone ? colors[tone] : "text-foreground"}`}>{value}</div>
    </MockPanel>
  );
}

const spark = [2, 3, 4, 6, 8, 7, 4, 3, 5, 7, 8, 8, 6, 4];

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 9 · Dashboard view" title="Aggregated counts across the workspace">
      <MockWindow className="mx-auto max-w-[1400px]">
        <MockNavbar breadcrumb="Home › 📊 Dashboard" />
        <div className="p-6 bg-background min-h-[480px] space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Stat label="Tasks open" value="127" tone="primary" />
            <Stat label="Due today" value="8" tone="warn" />
            <Stat label="Overdue" value="3" tone="danger" />
            <Stat label="Done 7d" value="42" tone="success" />
          </div>
          <MockPanel title="Activity (last 14 days)">
            <div className="flex items-end gap-1 h-20">
              {spark.map((v, i) => (
                <div key={i} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${v * 10}%` }} />
              ))}
            </div>
          </MockPanel>
          <div className="grid grid-cols-2 gap-4">
            <MockPanel title="Top tags">
              <div className="flex flex-wrap gap-2">
                {["#q3", "#design", "#bug", "#spike", "#ux", "#mvp"].map((t) => (
                  <Chip key={t} tone="primary">{t}</Chip>
                ))}
              </div>
            </MockPanel>
            <MockPanel title="Recently completed">
              <ul className="space-y-1 text-sm text-foreground">
                <li>✓ Pay rent</li>
                <li>✓ Review PR</li>
                <li>✓ Send Q3 report</li>
              </ul>
            </MockPanel>
          </div>
        </div>
      </MockWindow>
    </SlideLayout>
  );
}
