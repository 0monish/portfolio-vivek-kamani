'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

export default function ContactFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      // Hard-cut section reveal
      gsap.from(sectionRef.current, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // Character scrub on headline
      if (headlineRef.current) {
        const headline = headlineRef.current;
        const text = headline.textContent || '';
        headline.innerHTML = '';
        headline.setAttribute('aria-label', text);

        const chars = text.split('').map((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.opacity = '0';
          span.style.display = 'inline-block';
          span.setAttribute('aria-hidden', 'true');
          headline.appendChild(span);
          return span;
        });

        gsap.to(chars, {
          opacity: 1,
          duration: 0.02,
          stagger: 0.03,
          ease: 'none',
          scrollTrigger: {
            trigger: headline,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact section"
      className="bg-calypso relative flex min-h-screen flex-col items-center justify-center px-6 py-32"
    >
      {/* Playhead connector */}
      <div
        className="bg-citrine/30 absolute top-0 left-1/2 h-16 w-px -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="flex max-w-5xl flex-col items-center gap-12 text-center">
        <h2
          ref={headlineRef}
          className="font-display text-citrine text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl md:text-7xl lg:text-8xl"
        >
          READY TO EXPORT YOUR VISION?
        </h2>

        <p className="text-citrine/80 max-w-xl text-lg font-medium md:text-xl">
          Let&apos;s cut through the noise. Direct message, no forms, no fluff.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <a
            href="mailto:vivek@example.com"
            className="border-citrine text-citrine hover:bg-citrine hover:text-calypso focus-visible:bg-citrine focus-visible:text-calypso flex h-16 items-center justify-center border-2 px-12 text-sm font-bold tracking-[0.25em] uppercase transition-colors"
            aria-label="Send email to Vivek Kamani"
          >
            Email Me
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-citrine/40 text-citrine/80 hover:border-citrine hover:text-citrine focus-visible:border-citrine focus-visible:text-citrine flex h-16 items-center justify-center border-2 px-12 text-sm font-bold tracking-[0.25em] uppercase transition-colors"
            aria-label="Vivek Kamani on Twitter (opens in new tab)"
          >
            Twitter / X
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-citrine/40 text-citrine/80 hover:border-citrine hover:text-citrine focus-visible:border-citrine focus-visible:text-citrine flex h-16 items-center justify-center border-2 px-12 text-sm font-bold tracking-[0.25em] uppercase transition-colors"
            aria-label="Vivek Kamani on YouTube (opens in new tab)"
          >
            YouTube
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="absolute right-0 bottom-0 left-0 flex items-center justify-between px-6 py-6 md:px-12"
        role="contentinfo"
      >
        <span className="text-citrine/50 text-xs font-medium tracking-widest">
          &copy; {new Date().getFullYear()} VIVEK KAMANI
        </span>
        <span className="text-citrine/50 text-xs font-medium tracking-widest">
          ALL RIGHTS RESERVED
        </span>
      </footer>
    </section>
  );
}
