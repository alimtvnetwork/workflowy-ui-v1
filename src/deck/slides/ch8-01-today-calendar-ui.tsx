import { SlideLayout } from "../SlideLayout";
import { MockWindow, MockPanel, Chip } from "../components/MockUI";

const days = Array.from({ length: 30 }, (_, i) => i + 1);

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 8 · Today & Calendar" title="Date-driven views over the same items">
      <div className="grid grid-cols-2 gap-8">
        <MockWindow title="★ Today">
          <div className="p-6 bg-background min-h-[440px]">
            <div className="text-sm text-muted-foreground mb-4">Wed · 30 Apr 2026</div>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-center gap-2"><input type="checkbox" /> Pay rent</li>
              <li className="flex items-center gap-2"><input type="checkbox" /> Standup notes</li>
              <li className="flex items-center gap-2 text-muted-foreground line-through"><input type="checkbox" defaultChecked /> Review PR</li>
            </ul>
            <button className="mt-6 text-sm text-primary">＋ Add item to today</button>
          </div>
        </MockWindow>
        <MockWindow title="📅 Calendar">
          <div className="p-6 bg-background min-h-[440px]">
            <div className="flex items-center justify-between mb-4">
              <button className="text-muted-foreground">◀</button>
              <div className="font-semibold">April 2026</div>
              <button className="text-muted-foreground">▶</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => (
                <div
                  key={d}
                  className={`aspect-square flex flex-col items-center justify-center rounded text-sm ${
                    d === 30 ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>{d}</span>
                  {[3, 9, 15, 22, 30].includes(d) && d !== 30 && <span className="size-1 rounded-full bg-primary mt-0.5" />}
                </div>
              ))}
            </div>
            <MockPanel className="mt-4" title="30 Apr">
              <div className="flex items-center gap-2 text-sm"><Chip tone="warn">Due</Chip> Pay rent</div>
            </MockPanel>
          </div>
        </MockWindow>
      </div>
      <p className="mt-4 text-center text-base text-muted-foreground">
        Quick Add (⌘⇧N) appends to Inbox with optional due-date pill.
      </p>
    </SlideLayout>
  );
}
