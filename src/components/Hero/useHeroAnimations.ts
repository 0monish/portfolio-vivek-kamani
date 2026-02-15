'use client';

import { useEffect, useRef, useState } from 'react';

import { parsePercent, SCREEN_INSET_STYLE } from '@/components/Hero/constants';
import type { HeroHeadlinesRefs } from '@/components/Hero/HeroHeadlines';
import type { KineticTypographyRefs } from '@/components/Hero/KineticTypography';
import type { PhoneMockupRefs } from '@/components/Hero/PhoneMockup';
import { gsap, useGSAP } from '@/lib/gsap';

export interface HeroAnimationRefs {
  sectionRef: React.RefObject<HTMLElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  ctaRef: React.RefObject<HTMLAnchorElement | null>;
  bottomTextRef: React.RefObject<HTMLDivElement | null>;
  headlineRefs: HeroHeadlinesRefs;
  phoneRefs: PhoneMockupRefs;
  kineticRefs: KineticTypographyRefs;
}

export function useHeroAnimations(refs: HeroAnimationRefs) {
  const {
    sectionRef,
    overlayRef,
    ctaRef,
    bottomTextRef,
    headlineRefs,
    phoneRefs,
    kineticRefs,
  } = refs;

  const { leftHeadlineRef, rightHeadlineRef, subtextRef } = headlineRefs;
  const { iPhoneRef, phoneBodyRef, iPhoneFrameRef, screenImageRef } = phoneRefs;
  const { containerRef: kineticContainerRef, textRef1, textRef2 } = kineticRefs;

  // Cached initial clip-path (calculated once on mount)
  const initialClipPathRef = useRef<string>(
    'inset(46% 37% 46% 37% round 1.9rem)'
  );
  const mouseParallaxTweenRef = useRef<gsap.core.Tween | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate initial clip-path on mount (ONCE)
  useEffect(() => {
    if (!phoneBodyRef.current) return;

    const updateInitialClipPath = () => {
      const rect = phoneBodyRef.current!.getBoundingClientRect();
      const topInset = rect.height * parsePercent(SCREEN_INSET_STYLE.top);
      const rightInset = rect.width * parsePercent(SCREEN_INSET_STYLE.right);
      const bottomInset = rect.height * parsePercent(SCREEN_INSET_STYLE.bottom);
      const leftInset = rect.width * parsePercent(SCREEN_INSET_STYLE.left);

      const screenTop = rect.top + topInset;
      const screenRight = rect.right - rightInset;
      const screenBottom = rect.bottom - bottomInset;
      const screenLeft = rect.left + leftInset;

      const topPct = (screenTop / window.innerHeight) * 100;
      const rightPct = 100 - (screenRight / window.innerWidth) * 100;
      const bottomPct = 100 - (screenBottom / window.innerHeight) * 100;
      const leftPct = (screenLeft / window.innerWidth) * 100;

      initialClipPathRef.current = `inset(${topPct}% ${rightPct}% ${bottomPct}% ${leftPct}% round 1.9rem)`;
    };

    // Calculate on mount
    updateInitialClipPath();

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateInitialClipPath, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [phoneBodyRef]);

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse parallax tween
  useEffect(() => {
    if (!iPhoneRef.current) return;

    if (mouseParallaxTweenRef.current) {
      mouseParallaxTweenRef.current.kill();
    }

    mouseParallaxTweenRef.current = gsap.to(iPhoneRef.current, {
      rotateY: mousePos.x * 14,
      rotateX: -mousePos.y * 14,
      duration: 0.45,
      ease: 'power2.out',
    });
  }, [mousePos, iPhoneRef]);

  // Main scroll animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (screenImageRef.current) {
          gsap.set(screenImageRef.current, {
            opacity: 1,
          });
        }

        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 0.8,
            ease: 'power4.inOut',
            delay: 0.1,
          });
        }

        // NOTE: Headline and subtext entrance animations REMOVED
        // They conflicted with scroll-triggered fadeout animations.
        // Headlines now start visible and only animate on scroll.

        if (phoneBodyRef.current) {
          gsap.from(phoneBodyRef.current, {
            scale: 0.88,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.45,
          });

          // GPU Optimization: Force GPU layer promotion
          phoneBodyRef.current.style.willChange = 'transform';
          phoneBodyRef.current.style.backfaceVisibility = 'hidden';
        }

        if (ctaRef.current) {
          gsap.from(ctaRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.5,
          });
        }

        if (bottomTextRef.current) {
          gsap.from(bottomTextRef.current, {
            opacity: 0,
            x: 20,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1.6,
          });
        }

        if (
          sectionRef.current &&
          iPhoneRef.current &&
          phoneBodyRef.current &&
          iPhoneFrameRef.current &&
          screenImageRef.current &&
          leftHeadlineRef.current &&
          rightHeadlineRef.current &&
          subtextRef.current &&
          ctaRef.current &&
          bottomTextRef.current &&
          kineticContainerRef.current &&
          textRef1.current &&
          textRef2.current
        ) {
          // GPU Optimization: Apply isolation to prevent z-fighting
          gsap.set(iPhoneRef.current.parentElement, { isolation: 'isolate' });

          const kineticTiming = {
            revealStart: 0.2, // Start reveal earlier
            revealDuration: 0.05, // Quick reveal
            peakOpacity: 0.65,
          } as const;

          // CRITICAL: Kill any entrance animations and clear their inline styles
          // before scroll timeline takes control
          const heroIntroElements = [
            leftHeadlineRef.current,
            rightHeadlineRef.current,
            subtextRef.current,
            ctaRef.current,
            bottomTextRef.current,
          ].filter(Boolean);

          gsap.killTweensOf(heroIntroElements);
          // Force clear inline styles set by entrance animations
          gsap.set(heroIntroElements, { clearProps: 'all' });
          // Set explicit starting state for scroll animations
          gsap.set(heroIntroElements, {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            y: 0,
          });

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom 20%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // PHASE 1: Hero intro elements fade out VERY FAST (0.00 - 0.08)
          // Must complete WELL BEFORE kinetic text appears at 28%
          // Initial state already set by gsap.set() above
          heroTimeline
            .to(
              [leftHeadlineRef.current, rightHeadlineRef.current],
              {
                yPercent: -30,
                scale: 0.75,
                opacity: 0,
                ease: 'power3.in',
                duration: 0.08,
              },
              0
            )
            .to(
              subtextRef.current,
              {
                yPercent: -25,
                scale: 0.8,
                opacity: 0,
                ease: 'power3.in',
                duration: 0.06,
              },
              0.02
            )
            .to(
              [ctaRef.current, bottomTextRef.current],
              {
                yPercent: 50,
                scale: 0.85,
                opacity: 0,
                ease: 'power3.in',
                duration: 0.05,
              },
              0.03
            )
            .to(
              iPhoneRef.current,
              {
                yPercent: -14,
                ease: 'none',
              },
              0
            )
            // PHASE 2-3: CONTINUOUS SCALE (0.00 - 0.83)
            .to(
              phoneBodyRef.current,
              {
                scale: 8,
                ease: 'power2.inOut',
                duration: 0.6,
              },
              0
            )
            .to(
              iPhoneRef.current,
              {
                yPercent: -20,
                ease: 'power1.out',
              },
              0.64
            )
            // PHASE 3: PORTAL EXPANSION (0.60 - 0.72)
            .to(
              iPhoneFrameRef.current,
              {
                opacity: 0,
                ease: 'power2.inOut',
                duration: 0.05,
              },
              0.4
            )
            .to(
              screenImageRef.current,
              {
                opacity: 0,
                ease: 'power2.inOut',
                duration: 0.08,
              },
              0.4
            )
            // Scale and clip-path synchronized
            .to(
              phoneBodyRef.current,
              {
                scale: 10,
                ease: 'power2.inOut',
                duration: 0.08,
              },
              0.4
            );

          // KINETIC TYPOGRAPHY - Horizontal scroll tied to vertical scroll
          // Reveal kinetic text
          heroTimeline.fromTo(
            kineticContainerRef.current,
            { opacity: 0 },
            {
              opacity: kineticTiming.peakOpacity,
              ease: 'power2.out',
              duration: kineticTiming.revealDuration,
            },
            kineticTiming.revealStart
          );

          // Horizontal scroll tied to vertical scroll progress - continuous scroll
          // Text scrolls throughout the hero section, clipped by overflow-hidden on sticky container
          // Using smaller xPercent so text stays visible longer during scroll
          const scrollDuration = 1 - kineticTiming.revealStart; // Fill entire remaining timeline

          // Row 1: scrolls left - slower speed keeps text visible longer
          heroTimeline.to(
            textRef1.current,
            {
              xPercent: -80, // Slower scroll - text visible throughout hero
              ease: 'none',
              duration: scrollDuration,
            },
            kineticTiming.revealStart
          );

          // Row 2: scrolls right (opposite direction) - slower speed
          heroTimeline.to(
            textRef2.current,
            {
              xPercent: 80, // Slower scroll - text visible throughout hero
              ease: 'none',
              duration: scrollDuration,
            },
            kineticTiming.revealStart
          );

          // No cleanup needed - scroll-tied animations are killed with timeline
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return { initialClipPathRef };
}
