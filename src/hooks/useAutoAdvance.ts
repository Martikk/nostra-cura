// hooks/useAutoAdvance.ts
import { useEffect, useRef, useState, useCallback } from "react";

type Options = { interval?: number; respectVisibility?: boolean };

export function useAutoAdvance(onTick: () => void, { interval = 6000, respectVisibility = true }: Options = {}) {
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    const isVisible = !respectVisibility
      ? true
      : (typeof document !== "undefined" ? document.visibilityState === "visible" : true);

    if (!paused && isVisible) {
      timerRef.current = window.setInterval(onTick, interval);
    }
  }, [paused, onTick, interval, clear, respectVisibility]);

  useEffect(() => {
    start();
    return clear;
  }, [start, clear]);

  useEffect(() => {
    if (!respectVisibility || typeof document === "undefined") return;
    const onVis = () => { clear(); start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [start, clear, respectVisibility]);

  return { paused, setPaused };
}