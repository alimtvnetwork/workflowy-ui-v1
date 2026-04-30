// Crockford-base32 ULID-ish id (not strictly compliant but monotonic + sortable enough for demo).
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
let _lastTs = 0;
let _lastRand = 0n;

export function ulid(): string {
  let ts = Date.now();
  if (ts <= _lastTs) ts = _lastTs;
  if (ts === _lastTs) {
    _lastRand += 1n;
  } else {
    _lastTs = ts;
    _lastRand = BigInt(Math.floor(Math.random() * 2 ** 40));
  }
  const tsPart = encode(BigInt(ts), 10);
  const randPart = encode(_lastRand, 16);
  return tsPart + randPart;
}

function encode(value: bigint, length: number): string {
  let out = "";
  let v = value;
  for (let i = 0; i < length; i++) {
    out = ALPHABET[Number(v & 31n)] + out;
    v >>= 5n;
  }
  return out;
}

// Fractional sort key — midpoint between two existing keys (or extend).
// Simple lexicographic midpoint generator — sufficient for demo purposes.
export function sortAfter(prev: string | null, next: string | null): string {
  if (!prev && !next) return "a0";
  if (!prev && next) return prefixDecrement(next);
  if (prev && !next) return prefixIncrement(prev);
  return midpoint(prev!, next!);
}

function prefixIncrement(s: string): string {
  // bump last char, wrap by appending '0'
  const last = s[s.length - 1];
  const next = String.fromCharCode(last.charCodeAt(0) + 1);
  if (next > "z") return s + "0";
  return s.slice(0, -1) + next;
}
function prefixDecrement(s: string): string {
  const last = s[s.length - 1];
  if (last === "0") return s + "0"; // safe fallback
  const prev = String.fromCharCode(last.charCodeAt(0) - 1);
  return s.slice(0, -1) + prev + "z";
}
function midpoint(a: string, b: string): string {
  // naive: append 'm' to the smaller one
  return (a < b ? a : b) + "m";
}

export function nowIso(): string {
  return new Date().toISOString();
}
