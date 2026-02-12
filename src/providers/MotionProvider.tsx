'use client';

import { createContext, type ReactNode, useContext } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MotionContextValue {
  reducedMotion: boolean;
  toggleMotion: () => void;
}

const MotionContext = createContext<MotionContextValue>({
  reducedMotion: false,
  toggleMotion: () => {},
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const motion = useReducedMotion();

  return (
    <MotionContext.Provider value={motion}>{children}</MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}
