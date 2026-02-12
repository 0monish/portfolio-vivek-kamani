'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Detects user's prefers-reduced-motion setting AND provides a global toggle.
 * Returns { reducedMotion, toggleMotion } for AAA compliance.
 */
export function useReducedMotion() {
  const [systemReducedMotion, setSystemReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => {
      setSystemReducedMotion(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const reducedMotion = userOverride ?? systemReducedMotion;

  const toggleMotion = useCallback(() => {
    setUserOverride((prev) => (prev === null ? !systemReducedMotion : !prev));
  }, [systemReducedMotion]);

  return { reducedMotion, toggleMotion };
}
