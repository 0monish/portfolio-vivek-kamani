"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Detects user's prefers-reduced-motion setting AND provides a global toggle.
 * Returns { reducedMotion, toggleMotion } for AAA compliance.
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      if (userOverride === null) setReducedMotion(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [userOverride]);

  const toggleMotion = useCallback(() => {
    setUserOverride((prev) => {
      const next = prev === null ? !reducedMotion : !prev;
      setReducedMotion(!next);
      return next;
    });
  }, [reducedMotion]);

  return { reducedMotion, toggleMotion };
}
