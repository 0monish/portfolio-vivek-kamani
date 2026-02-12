'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

/**
 * Vertical playhead line that scrubs down the page, connecting all sections
 * like a timeline cursor in an NLE.
 */
export default function Playhead() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !lineRef.current) return;

      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });
    },
    { dependencies: [reducedMotion] }
  );

  if (reducedMotion) return null;

  return (
    <div
      ref={lineRef}
      className="bg-danube/40 pointer-events-none fixed top-0 left-4 z-40 hidden h-screen w-px md:block"
      aria-hidden="true"
    >
      <div className="border-danube bg-ink absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2" />
    </div>
  );
}
