"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/providers/MotionProvider";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const iPhoneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      // Hard-cut overlay reveal
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.8,
          ease: "power4.inOut",
          delay: 0.1,
        });
      }

      // Name fade in
      if (nameRef.current) {
        gsap.from(nameRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });
      }

      // Headline character scrubber
      if (headlineRef.current) {
        const headline = headlineRef.current;
        const text = headline.textContent || "";
        headline.innerHTML = "";
        headline.setAttribute("aria-label", text);

        const chars = text.split("").map((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.opacity = "0";
          span.style.display = "inline-block";
          span.setAttribute("aria-hidden", "true");
          headline.appendChild(span);
          return span;
        });

        gsap.to(chars, {
          opacity: 1,
          duration: 0.03,
          stagger: 0.05,
          ease: "none",
          delay: 0.9,
        });
      }

      // iPhone mockup scale in
      if (iPhoneRef.current) {
        gsap.from(iPhoneRef.current, {
          scale: 0.85,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 1.5,
        });
      }

      // ScrollTrigger: fade out on scroll
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          onLeave: () => {
            gsap.to(sectionRef.current, {
              opacity: 0,
              scale: 0.97,
              duration: 0.4,
              ease: "power2.in",
            });
          },
          onEnterBack: () => {
            gsap.to(sectionRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero — Vivek Kamani Video Editor"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-ink"
      style={{
        backgroundImage: `url('/hero-bg.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Background overlay for contrast */}
      <div
        className="absolute inset-0 bg-linear-to-b from-ink/80 via-ink/70 to-ink/80"
        aria-hidden="true"
      />

      {/* Hard-cut overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 bg-ink"
        aria-hidden="true"
      />

      {/* Name Tag — Top Absolute */}
      <div className="absolute top-16 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 sm:top-20 md:top-24 md:gap-3">
        <h2
          ref={nameRef}
          className="font-display text-base font-bold uppercase tracking-[0.3em] text-citrine/70 sm:text-lg md:text-xl lg:text-2xl"
        >
          Vivek Kamani
        </h2>
        <div className="h-px w-12 bg-calypso sm:w-16" aria-hidden="true" />
      </div>

      {/* iPhone Mockup — Absolute Center */}
      <div
        ref={iPhoneRef}
        className="absolute top-1/2 left-1/2 z-20 w-[min(80vw,280px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(60vw,320px)] md:w-80 lg:w-85 xl:w-90 2xl:w-95"
      >
        <div className="relative aspect-9/16">
          <Image
            src="/iPhone.svg"
            alt="iPhone mockup showcasing video editing work"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        
        {/* Glow effect around iPhone */}
        <div
          className="absolute inset-0 -z-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(111, 203, 230, 0.2) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Main Headline — Bottom Absolute */}
      <div className="absolute bottom-24 left-1/2 z-30 w-full max-w-5xl -translate-x-1/2 px-4 sm:bottom-28 sm:px-6 md:bottom-32 lg:bottom-36">
        <h1
          ref={headlineRef}
          className="text-center font-display text-2xl font-black uppercase leading-[0.95] tracking-tight text-citrine sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
        >
          VIDEO EDITOR WHO CRAFTS STORIES THAT SELL
        </h1>
      </div>

      {/* CTA Button — Bottom */}
      <a
        href="#contact"
        className="absolute bottom-12 left-1/2 z-30 flex h-12 -translate-x-1/2 items-center gap-2 rounded-full border-2 border-citrine px-6 text-xs font-bold uppercase tracking-[0.2em] text-citrine transition-all hover:scale-105 hover:bg-citrine hover:text-ink focus-visible:bg-citrine focus-visible:text-ink sm:bottom-14 sm:h-14 sm:gap-3 sm:px-8 sm:text-sm md:bottom-16 lg:px-10"
      >
        Let's Talk
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6 md:bottom-8"
        aria-hidden="true"
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-citrine/40 pt-1.5 sm:h-10 sm:w-6 sm:pt-2">
          <div className="h-1.5 w-0.5 animate-bounce rounded-full bg-citrine sm:h-2 sm:w-1" />
        </div>
      </div>
    </section>
  );
}
