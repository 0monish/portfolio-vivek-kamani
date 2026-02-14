'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

/**
 * Detects user's prefers-reduced-motion setting AND provides a global toggle.
 * Returns { reducedMotion, toggleMotion } for AAA compliance.
 */
export function useReducedMotion() {
  const systemReducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', onStoreChange);

      return () => mediaQuery.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
  const [userOverride, setUserOverride] = useState<boolean | null>(null);

  const reducedMotion = userOverride ?? systemReducedMotion;

  const toggleMotion = useCallback(() => {
    setUserOverride((prev) => (prev === null ? !systemReducedMotion : !prev));
  }, [systemReducedMotion]);

  return { reducedMotion, toggleMotion };
}
