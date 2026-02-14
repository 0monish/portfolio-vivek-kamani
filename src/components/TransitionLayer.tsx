'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';

/**
 * TransitionLayer Component
 *
 * Visual bridge between Hero zoom and Metrics reveal
 * - Radial bloom effect that builds during phone zoom
 * - Creates seamless visual continuity
 * - Fades out as metrics take over
 */
export default function TransitionLayer() {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!layerRef.current) return;

      // Start invisible
      gsap.set(layerRef.current, {
        opacity: 0,
      });

      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const transitionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Fade in during zoom (0.40 - 0.70)
      transitionTimeline.to(
        layerRef.current,
        {
          opacity: 1,
          ease: 'power2.out',
          duration: 0.3,
        },
        0.4
      );

      // Fade out after metrics visible (0.80 - 1.00)
      transitionTimeline.to(
        layerRef.current,
        {
          opacity: 0,
          ease: 'power2.in',
          duration: 0.2,
        },
        0.8
      );
    },
    { scope: layerRef }
  );

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-29"
      style={{
        background: `radial-gradient(
          circle at 50% 50%,
          rgba(54, 157, 219, 0.3) 0%,
          transparent 70%
        )`,
        backdropFilter: 'blur(2px)',
        willChange: 'opacity, backdrop-filter',
      }}
      aria-hidden="true"
    />
  );
}
