import { SlideLayout } from "../SlideLayout";
import { Code, Footer } from "./e1-01-no-any";

export default function Slide() {
  return (
    <SlideLayout chapter="Phase E-1 · Generics" title="R2 — No `unknown` returns from public surfaces"
      subtitle="`unknown` is fine as a parser input. It is forbidden as an exported return.">
      <div className="mt-8 grid grid-cols-2 gap-8">
        <Code label="Forbidden — caller has to re-narrow" tone="bad">{`export function readSetting(
  key: string
): unknown { … }`}</Code>
        <Code label="Required — narrow inside, expose typed" tone="good">{`export function readSetting<K extends SettingKey>(
  key: K
): SettingValue<K> { … }`}</Code>
      </div>
      <Footer gate="G-35-RT-NO-UNKNOWN" at="AT-ENFORCEMENTRULES-02"
        rule="No exported function or hook returns `unknown` — narrow at the boundary, expose the narrow type." />
    </SlideLayout>
  );
}
