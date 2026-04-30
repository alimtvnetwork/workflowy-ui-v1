// Shared virtual clock + auto-reaper. Models the daily cron from
// spec/31-app/01-features/11b-trash-reaper.md but compresses real time so a
// few seconds of wall-clock = one virtual day. Multiple pages
// (/sync-simulator, /trash-reaper) can subscribe to the same clock.

import { runReaper, type ReaperRun } from "./reaper";

type ClockListener = (state: ClockState) => void;
type ReapListener = (run: ReaperRun) => void;

export interface ClockState {
  /** Wall-clock ms when the clock was last reset/started. */
  AnchorMs: number;
  /** Compression factor: how many real ms = 1 virtual day. */
  MsPerVirtualDay: number;
  /** Whether the clock is auto-advancing. */
  Running: boolean;
  /** Whether the auto-reaper fires once per virtual day. */
  AutoReap: boolean;
  /** Retention in virtual days passed to runReaper. */
  RetentionDays: number;
}

const STORAGE_KEY = "spec-virtual-clock";

const DEFAULT: ClockState = {
  AnchorMs: Date.now(),
  MsPerVirtualDay: 5_000, // 5s real = 1 virtual day
  Running: false,
  AutoReap: false,
  RetentionDays: 30,
};

class VirtualClock {
  private state: ClockState = DEFAULT;
  private listeners = new Set<ClockListener>();
  private reapListeners = new Set<ReapListener>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private lastReapedDay = -1;
  private hydrated = false;

  private hydrate() {
    if (this.hydrated || typeof localStorage === "undefined") {
      this.hydrated = true;
      return;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { this.state = { ...DEFAULT, ...JSON.parse(raw) }; } catch { /* ignore */ }
    }
    this.hydrated = true;
    if (this.state.Running) this.startTimer();
  }

  private persist() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
  }

  /** Virtual ms (wall now + accumulated offset since anchor). */
  nowMs(): number {
    this.hydrate();
    if (!this.state.Running) return this.state.AnchorMs;
    const elapsed = Date.now() - this.state.AnchorMs;
    // 1 real ms = (1 / MsPerVirtualDay) virtual days = (86400000/MsPerVirtualDay) virtual ms.
    const virtualMs = elapsed * (86_400_000 / this.state.MsPerVirtualDay);
    return this.state.AnchorMs + virtualMs;
  }

  /** Days elapsed since AnchorMs in virtual time. */
  virtualDay(): number {
    return Math.floor((this.nowMs() - this.state.AnchorMs) / 86_400_000);
  }

  getState(): ClockState {
    this.hydrate();
    return { ...this.state };
  }

  setState(patch: Partial<ClockState>) {
    this.hydrate();
    const wasRunning = this.state.Running;
    this.state = { ...this.state, ...patch };
    this.persist();
    if (this.state.Running && !wasRunning) this.startTimer();
    if (!this.state.Running && wasRunning) this.stopTimer();
    this.emit();
  }

  reset() {
    this.stopTimer();
    this.state = { ...DEFAULT, AnchorMs: Date.now() };
    this.lastReapedDay = -1;
    this.persist();
    this.emit();
  }

  subscribe(fn: ClockListener) {
    this.hydrate();
    this.listeners.add(fn);
    fn(this.getState());
    return () => { this.listeners.delete(fn); };
  }

  subscribeReap(fn: ReapListener) {
    this.reapListeners.add(fn);
    return () => { this.reapListeners.delete(fn); };
  }

  private emit() {
    this.listeners.forEach((l) => l(this.getState()));
  }

  private startTimer() {
    if (this.timer) return;
    this.timer = setInterval(() => { void this.tick(); }, 250);
  }

  private stopTimer() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  private async tick() {
    this.emit();
    if (!this.state.AutoReap) return;
    const day = this.virtualDay();
    if (day > this.lastReapedDay) {
      this.lastReapedDay = day;
      const run = await runReaper({
        NowMs: this.nowMs(),
        RetentionDays: this.state.RetentionDays,
      });
      this.reapListeners.forEach((l) => l(run));
    }
  }
}

export const virtualClock = new VirtualClock();
