import { useEffect, useState, useCallback } from "react";

export function useDeckNav(total: number) {
  const [index, setIndex] = useState(0);
  const [grid, setGrid] = useState(false);

  const go = useCallback((i: number) => {
    setIndex(Math.max(0, Math.min(total - 1, i)));
  }, [total]);

  const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "g" || e.key === "G") {
        setGrid((g) => !g);
      } else if (e.key === "f" || e.key === "F") {
        const el = document.documentElement;
        if (!document.fullscreenElement) el.requestFullscreen?.();
        else document.exitFullscreen?.();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) document.exitFullscreen?.();
        setGrid(false);
      } else if (e.key === "Home") {
        setIndex(0);
      } else if (e.key === "End") {
        setIndex(total - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, total]);

  return { index, setIndex: go, next, prev, grid, setGrid };
}
