import { SlideLayout } from "../SlideLayout";

export default function Slide() {
  return (
    <SlideLayout chapter="Chapter 4 · Floating toolbar" title="Selection-driven formatting">
      <div className="grid grid-cols-2 gap-10">
        <div className="rounded-2xl border border-border p-8">
          <div className="text-2xl font-semibold mb-4">When it appears</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>• Select any text inside an Item</li>
            <li>• Toolbar floats above the selection</li>
            <li>• Hides on caret-only / blur</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border p-8">
          <div className="text-2xl font-semibold mb-4">What's on it</div>
          <ul className="space-y-3 text-xl text-muted-foreground">
            <li>• B / I / U / S — bold, italic, underline, strike</li>
            <li>• H1–H5 — heading levels</li>
            <li>• 11 text colors + 11 highlight colors (locked palette)</li>
            <li>• Inline code · Quote · Link</li>
            <li>• Markdown shortcuts auto-convert as you type</li>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}
