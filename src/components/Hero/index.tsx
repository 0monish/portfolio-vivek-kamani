'use client';

import { useRef } from 'react';

import HeroBackground from '@/components/Hero/HeroBackground';
import HeroCTA from '@/components/Hero/HeroCTA';
import HeroHeadlines from '@/components/Hero/HeroHeadlines';
import HeroIndicators from '@/components/Hero/HeroIndicators';
import KineticTypography from '@/components/Hero/KineticTypography';
import PhoneMockup from '@/components/Hero/PhoneMockup';
import { useHeroAnimations } from '@/components/Hero/useHeroAnimations';

/**
 * Portal Transition Production Component
 *
 * Requirements:
 * - NO runtime getBoundingClientRect() during scroll
 * - All geometry calculated ONCE on mount
 * - Perfect timeline synchronization (scale + clip-path)
 * - Internal image fade (prevents ghosting)
 * - GPU optimization (smooth 60 FPS)
 * - Never toggle position: fixed
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);

  // Headline refs
  const leftHeadlineRef = useRef<HTMLHeadingElement>(null);
  const rightHeadlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);

  // Phone mockup refs
  const iPhoneRef = useRef<HTMLDivElement>(null);
  const phoneBodyRef = useRef<HTMLDivElement>(null);
  const iPhoneFrameRef = useRef<HTMLImageElement>(null);
  const screenImageRef = useRef<HTMLDivElement>(null);

  // Kinetic typography refs
  const kineticContainerRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);

  // Bundle refs for the animation hook
  const headlineRefs = { leftHeadlineRef, rightHeadlineRef, subtextRef };
  const phoneRefs = { iPhoneRef, phoneBodyRef, iPhoneFrameRef, screenImageRef };
  const kineticRefs = {
    containerRef: kineticContainerRef,
    textRef1,
    textRef2,
  };

  // Initialize all animations
  useHeroAnimations({
    sectionRef,
    overlayRef,
    ctaRef,
    bottomTextRef,
    headlineRefs,
    phoneRefs,
    kineticRefs,
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — Vivek Kamani Video Editor"
      className="bg-ink relative z-[10] min-h-[200vh] w-full"
    >
      <div className="sticky top-0 isolate flex h-svh w-full flex-col items-center justify-center overflow-hidden">
        <HeroBackground overlayRef={overlayRef} />

        <HeroHeadlines refs={headlineRefs} />

        <PhoneMockup refs={phoneRefs} />

        <HeroCTA ref={ctaRef} />

        <HeroIndicators ref={bottomTextRef} />

        <KineticTypography refs={kineticRefs} />
      </div>
    </section>
  );
}
