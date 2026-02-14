'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import TransitionLayer from '@/components/TransitionLayer';
import { gsap, useGSAP } from '@/lib/gsap';

const SCREEN_INSET_STYLE = {
  top: '1.5%',
  right: '2.8%',
  bottom: '1.5%',
  left: '2.8%',
  borderRadius: '1.9rem',
} as const;

const parsePercent = (value: string) => Number.parseFloat(value) / 100;

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
  const leftHeadlineRef = useRef<HTMLHeadingElement>(null);
  const rightHeadlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const iPhoneRef = useRef<HTMLDivElement>(null);
  const phoneBodyRef = useRef<HTMLDivElement>(null);
  const iPhoneFrameRef = useRef<HTMLImageElement>(null);
  const screenImageRef = useRef<HTMLDivElement>(null); // NEW: internal screen image
  const metricsOverlayActiveRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);

  // Cached initial clip-path (calculated once on mount)
  const initialClipPathRef = useRef<string>(
    'inset(46% 37% 46% 37% round 1.9rem)'
  );
  const mouseParallaxTweenRef = useRef<gsap.core.Tween | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // STEP 1: Calculate initial clip-path on mount (ONCE)
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

    // Debounced resize handler (optional: for responsive behavior)
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
  }, []);

  // STEP 2: Mouse parallax tracking
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // STEP 3: Mouse parallax tween
  React.useEffect(() => {
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
  }, [mousePos]);

  // STEP 4: Main scroll animation with metricsSection ownership
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const metricsSection = document.getElementById('metrics');
        const metricsInner = metricsSection?.querySelector(
          '[data-metrics-inner]'
        ) as HTMLDivElement | null;

        // ✨ POSITION: FIXED IS SET IN CSS (no toggling during animation)
        // Metrics section should have `position: fixed` in parent JS or CSS class

        if (metricsSection) {
          // Enable GPU rendering for smooth animation
          gsap.set(metricsSection, {
            inset: 0,
            width: '100vw',
            height: '100vh',
            margin: 0,
            zIndex: 30,
            pointerEvents: 'none',
            // Initial state: show only phone screen
            clipPath: initialClipPathRef.current,
            opacity: 1, // ✨ Set to 1 so metrics is visible after transition
          });

          // ✨ GPU Optimization: Force GPU layer promotion and stable compositing
          metricsSection.style.willChange = 'transform, clip-path';
          metricsSection.style.backfaceVisibility = 'hidden';
          metricsSection.style.isolation = 'isolate'; // ✨ NEW: Prevent z-fighting

          metricsOverlayActiveRef.current = true;
        }

        if (screenImageRef.current) {
          gsap.set(screenImageRef.current, {
            opacity: 1,
          });
        }

        if (metricsInner) {
          gsap.set(metricsInner, {
            yPercent: 40,
            opacity: 0,
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

        // Entrance animations
        const headlines = [leftHeadlineRef.current, rightHeadlineRef.current];
        if (headlines[0] && headlines[1]) {
          gsap.from(headlines, {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            delay: 0.8,
          });
        }

        if (subtextRef.current) {
          gsap.from(subtextRef.current.children, {
            opacity: 0,
            x: -20,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 1.2,
          });
        }

        if (phoneBodyRef.current) {
          gsap.from(phoneBodyRef.current, {
            scale: 0.88,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: 0.45,
          });

          // ✨ GPU Optimization: Force GPU layer promotion on phone (prevents layer desync)
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
          metricsSection
        ) {
          // ✨ GPU Optimization: Apply isolation to prevent z-fighting during massive scale-up
          gsap.set(iPhoneRef.current.parentElement, { isolation: 'isolate' });

          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true, // ✨ CRITICAL FIX: Direct 1-to-1 scroll mapping (was scrub: 1 = 1000ms lag)
              invalidateOnRefresh: true,
            },
          });

          // ✨ PHASE 1: General animations (0.00 - 0.68)
          heroTimeline
            .to(
              [leftHeadlineRef.current, rightHeadlineRef.current],
              {
                yPercent: -26,
                scale: 0.82,
                opacity: 0,
                ease: 'none',
              },
              0
            )
            .to(
              subtextRef.current,
              {
                yPercent: -18,
                scale: 0.86,
                opacity: 0,
                ease: 'none',
              },
              0.03
            )
            .to(
              [ctaRef.current, bottomTextRef.current],
              {
                yPercent: 40,
                scale: 0.9,
                opacity: 0,
                ease: 'none',
              },
              0.05
            )
            .to(
              iPhoneRef.current,
              {
                yPercent: -14,
                ease: 'none',
              },
              0
            )
            // ✨ PHASE 2-3: CONTINUOUS SCALE (0.00 - 0.83) - SINGLE SMOOTH TWEEN
            // One continuous tween eliminates stutter from multiple conflicting tweens
            .to(
              phoneBodyRef.current,
              {
                scale: 10, // Smooth interpolation from initial scale to 10x
                ease: 'power2.inOut',
                duration: 0.83, // Entire zoom range
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
            // ✨ PHASE 3: PORTAL EXPANSION (0.72 - 0.83) - SYNCHRONIZED
            // This is where the magic happens:
            // - Scale expands to 12x
            // - Clip-path expands to full viewport
            // - Both fade out (frame + internal image)
            // - Both start at exact same timeline position
            // - Both have exact same duration.
            .to(
              iPhoneFrameRef.current,
              {
                opacity: 0,
                ease: 'power2.inOut',
                duration: 0.11,
              },
              0.72
            )
            .to(
              screenImageRef.current,
              {
                opacity: 0, // NEW: Internal image fades too (prevents ghosting)
                ease: 'power2.inOut',
                duration: 0.11,
              },
              0.72
            )
            // ✨ CRITICAL: Scale and clip-path PERFECTLY SYNCHRONIZED
            .to(
              phoneBodyRef.current,
              {
                scale: 10, // Reduced from 12 to 10 for GPU stability
                ease: 'power2.inOut',
                duration: 0.11, // EXACT match with clip-path duration
              },
              0.72
            )
            .to(
              metricsSection,
              {
                clipPath: 'inset(0% 0% 0% 0% round 0px)', // Expand to full viewport
                ease: 'power2.inOut',
                duration: 0.11, // EXACT match with scale duration
              },
              0.72
            );
          // ✨ PHASE 4: Metrics fade in (0.75 - 1.00)
          // REMOVED: Opacity animation - metrics should always be visible
          // .to(
          //   metricsSection,
          //   {
          //     opacity: 1,
          //     ease: 'power2.out',
          //     duration: 0.1,
          //   },
          //   0.75
          // );

          // Metrics content slides up in parallel
          if (metricsInner) {
            heroTimeline.to(
              metricsInner,
              {
                yPercent: 0,
                opacity: 1,
                ease: 'power2.out',
                duration: 0.15,
              },
              0.72
            );
          }

          return () => {
            // Cleanup handled by useGSAP context.revert()
          };
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — Vivek Kamani Video Editor"
      className="bg-ink relative min-h-[300svh] w-full"
    >
      <div className="sticky top-0 flex h-svh w-full flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(31, 94, 143, 0.45), transparent 24%), linear-gradient(180deg, #020817 0%, #07162c 42%, #12060d 100%)',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 top-[48%] h-[34svh] bg-[radial-gradient(circle_at_50%_0%,rgba(85,171,228,0.45),transparent_58%)] blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[40svh] bg-[linear-gradient(180deg,transparent_0%,rgba(13,4,14,0.1)_15%,rgba(27,4,12,0.55)_100%)]"
          aria-hidden="true"
        />

        <div
          ref={overlayRef}
          className="bg-ink absolute inset-0 z-50"
          aria-hidden="true"
        />

        <div className="relative z-20 flex h-full w-full max-w-480 flex-col justify-between px-6 pt-24 pb-12 md:flex-row md:items-center md:px-12 lg:px-20 xl:px-32">
          <div className="flex flex-col items-start gap-6 text-left md:w-2/5 xl:w-1/3">
            <h1
              ref={leftHeadlineRef}
              className="font-display text-citrine text-5xl leading-[0.9] font-black tracking-wide uppercase sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            >
              STORIES
              <br />
              THAT
            </h1>

            <div ref={subtextRef} className="flex flex-col gap-4 pl-1">
              <h3 className="text-citrine text-xl font-medium sm:text-2xl">
                Your Content, Amplified
              </h3>
              <div className="bg-citrine/60 h-px w-16" aria-hidden="true" />
              <p className="text-citrine/80 max-w-xs text-sm leading-relaxed font-light sm:text-base">
                Every second is optimized for retention and impact, giving you
                the freedom to focus on creation while I handle the craft.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-end text-right md:mt-0 md:w-2/5 xl:w-1/3">
            <h1
              ref={rightHeadlineRef}
              className="font-display text-citrine text-5xl leading-[0.9] font-black tracking-wide uppercase sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            >
              CONVERT
              <br />& SELL
            </h1>
          </div>
        </div>

        <div
          ref={iPhoneRef}
          className="absolute top-1/2 left-1/2 z-20 w-[min(42vw,220px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(34vw,250px)] md:w-[min(28vw,320px)]"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            ref={phoneBodyRef}
            className="relative aspect-438/904"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ✨ NEW: Track internal screen image for fade */}
            <div
              ref={screenImageRef}
              className="absolute z-10 overflow-hidden"
              style={SCREEN_INSET_STYLE}
            >
              <Image
                src="/vivek.png"
                alt=""
                fill
                className="pointer-events-none absolute inset-0 object-cover"
              />
            </div>

            <Image
              ref={iPhoneFrameRef}
              src="/iPhone.svg"
              alt="iPhone frame"
              fill
              priority
              className="pointer-events-none absolute inset-0 z-20 object-contain"
            />
          </div>

          <div
            className="absolute inset-0 -z-10 scale-[1.1] blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(76, 180, 255, 0.22) 0%, rgba(250, 237, 217, 0.08) 35%, transparent 72%)',
            }}
            aria-hidden="true"
          />
        </div>

        <a
          ref={ctaRef}
          href="#contact"
          className="bg-citrine text-ink absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 hover:bg-white sm:bottom-16 md:bottom-20"
        >
          Start Your Project
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>

        <div
          ref={bottomTextRef}
          className="absolute right-8 bottom-8 z-30 hidden flex-col items-end gap-1 md:flex lg:right-16 lg:bottom-12"
        >
          <span className="text-citrine text-xs font-bold tracking-widest uppercase">
            Mood-driven edits
          </span>
          <span className="text-citrine/60 text-[0.65rem] tracking-[0.3em] uppercase">
            Scroll the frame
          </span>
        </div>

        <div className="absolute bottom-8 left-8 z-30 hidden flex-col items-start gap-1 md:flex lg:bottom-12 lg:left-16">
          <div className="text-citrine flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <div className="flex flex-col gap-1">
              <span className="bg-citrine/50 h-1.5 w-1.5 animate-pulse rounded-full"></span>
              <span className="bg-citrine h-1.5 w-1.5 animate-pulse rounded-full delay-75"></span>
            </div>
            Scroll Down
          </div>
        </div>
      </div>

      <TransitionLayer />
    </section>
  );
}
