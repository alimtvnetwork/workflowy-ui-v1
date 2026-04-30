import { SlideLayout } from "../SlideLayout";
import { SqlBlock } from "../components/SqlBlock";

export default function Slide() {
  return (
    <SlideLayout chapter="B-4 · Item ops" title="Fractional indexing math" subtitle="Sibling order is a string in base-62. Inserts compute a key strictly between two neighbors — no renumbering, no contention.">
      <SqlBlock caption="Keys compare lexicographically. `between(a,b)` returns the shortest string s such that a < s < b. Worst-case growth is one char per ~62 inserts at the same gap.">{`const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const MID = "V"; // index 31, midpoint of 62

export function between(a: string | null, b: string | null): string {
  if (!a && !b) return MID;
  if (!a) return prevKey(b!);
  if (!b) return nextKey(a);

  // Walk both strings char-by-char until they diverge.
  let i = 0;
  while (a[i] === b[i] && i < Math.min(a.length, b.length)) i++;

  const ca = a.charCodeAt(i) ?? 0;
  const cb = b.charCodeAt(i) ?? ALPHABET.length;
  if (cb - ca > 1) {
    return a.slice(0, i) + ALPHABET[Math.floor((ca + cb) / 2)];
  }
  // Adjacent — append a midpoint char to extend resolution.
  return a.slice(0, i + 1) + MID;
}

// Properties enforced in tests:
//   1. between(a,b) > a  &&  between(a,b) < b
//   2. Idempotent: same (a,b) → same string
//   3. No global lock needed; clients can pre-compute optimistically`}</SqlBlock>
    </SlideLayout>
  );
}
