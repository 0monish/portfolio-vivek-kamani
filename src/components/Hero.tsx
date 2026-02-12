'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftHeadlineRef = useRef<HTMLHeadingElement>(null);
  const rightHeadlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const iPhoneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse parallax effect
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Apply parallax transform to phone
  useEffect(() => {
    if (reducedMotion || !iPhoneRef.current) return;

    const rotateY = mousePos.x * 15; // tilt left-right
    const rotateX = -mousePos.y * 15; // tilt top-bottom

    gsap.to(iPhoneRef.current, {
      rotateY,
      rotateX,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [mousePos, reducedMotion]);

  useGSAP(
    () => {
      if (reducedMotion) return;

      // Hard-cut overlay reveal
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.8,
          ease: 'power4.inOut',
          delay: 0.1,
        });
      }

      // Headlines fade in and slide
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

      // Subtext fade in
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

      // iPhone mockup scale in
      if (iPhoneRef.current) {
        gsap.from(iPhoneRef.current, {
          scale: 0.85,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5, // Starts earlier to be the anchor
        });
      }

      // CTA and Bottom Text
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

      // ScrollTrigger: Parallax/Fade out
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onLeave: () => {
            // Optional exit animation
          },
        });

        // Parallax for text vs phone
        if (
          iPhoneRef.current &&
          leftHeadlineRef.current &&
          rightHeadlineRef.current
        ) {
          gsap.to(iPhoneRef.current, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
          gsap.to([leftHeadlineRef.current, rightHeadlineRef.current], {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — Vivek Kamani Video Editor"
      className="bg-ink relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/hero-bg.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background overlay for contrast */}
      <div
        className="from-ink/80 via-ink/70 to-ink/80 absolute inset-0 bg-linear-to-b"
        aria-hidden="true"
      />

      {/* Hard-cut overlay */}
      <div
        ref={overlayRef}
        className="bg-ink absolute inset-0 z-50"
        aria-hidden="true"
      />

      {/* Main Grid/Flex Layout matching Reference */}
      <div className="relative z-20 flex h-full w-full max-w-480 flex-col justify-between px-6 pt-24 pb-12 md:flex-row md:items-center md:px-12 lg:px-20 xl:px-32">
        {/* LEFT COMPONENT */}
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
              Every second is optimized for retention and impact, giving you the
              freedom to focus on creation while I handle the craft.
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT */}
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

      {/* PHONE - ABSOLUTE CENTER */}
      {/* Positioned absolutely to sit in the center regardless of flex columns, z-index managed to be effectively 'behind' or 'interacted' with text visually if needed, but per reference it's the focal point */}
      <div
        ref={iPhoneRef}
        className="absolute top-1/2 left-1/2 z-10 w-[min(35vw,160px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(30vw,190px)] md:w-55 lg:w-65 xl:w-75"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="relative aspect-9/16"
          style={{
            transformStyle: 'preserve-3d',
            filter:
              'drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))',
          }}
        >
          <Image
            src="/iPhone.svg"
            alt="iPhone mockup showcasing video editing work"
            fill
            className="object-contain"
            priority
          />
          {/* Center Text on Phone/Window Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap opacity-90 mix-blend-overlay">
            <span className="font-display text-xl tracking-widest text-white/50 uppercase">
              Vivek Kamani
            </span>
          </div>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 -z-10 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(250, 237, 217, 0.15) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* BOTTOM ELEMENTS */}

      {/* Reference: CTA Button Bottom Center */}
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

      {/* Reference: Bottom Right Text */}
      <div
        ref={bottomTextRef}
        className="absolute right-8 bottom-8 z-30 hidden flex-col items-end gap-1 md:flex lg:right-16 lg:bottom-12"
      >
        <span className="text-citrine text-xs font-bold tracking-widest uppercase">
          Ready to scale?
        </span>
      </div>

      {/* Reference: Scroll Indicator Bottom Left */}
      <div className="absolute bottom-8 left-8 z-30 hidden flex-col items-start gap-1 md:flex lg:bottom-12 lg:left-16">
        <div className="text-citrine flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <div className="flex flex-col gap-1">
            <span className="bg-citrine/50 h-1.5 w-1.5 animate-pulse rounded-full"></span>
            <span className="bg-citrine h-1.5 w-1.5 animate-pulse rounded-full delay-75"></span>
          </div>
          Scroll Down
        </div>
      </div>
    </section>
  );
}
