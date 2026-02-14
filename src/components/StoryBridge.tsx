'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';

/**
 * StoryBridge Component
 *
 * Continuation element between Metrics and Work sections
 * - Bridges metrics energy into project showcase
 * - Eliminates dead space
 * - Maintains narrative momentum
 */
export default function StoryBridge() {
  const bridgeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!bridgeRef.current) return;

      // Start invisible and below
      gsap.set(bridgeRef.current, {
        opacity: 0,
        y: 40,
      });

      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const bridgeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Fade in and slide up as metrics ends (0.85 - 1.00)
      bridgeTimeline.to(
        bridgeRef.current,
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.15,
        },
        0.85
      );

      // Optional: Animate glow line entrance
      if (glowLineRef.current) {
        gsap.set(glowLineRef.current, { scaleX: 0, transformOrigin: 'left' });
        bridgeTimeline.to(
          glowLineRef.current,
          {
            scaleX: 1,
            ease: 'power2.out',
            duration: 0.2,
          },
          0.85
        );
      }
    },
    { scope: bridgeRef }
  );

  return (
    <div ref={bridgeRef} className="relative py-16 text-center">
      <p
        ref={textRef}
        className="font-display text-citrine text-4xl font-black tracking-tight uppercase sm:text-5xl"
      >
        Every Frame Tells a Story
      </p>
      <div
        ref={glowLineRef}
        className="bg-calypso mx-auto mt-6 h-1 w-24"
        aria-hidden="true"
      />
    </div>
  );
}
