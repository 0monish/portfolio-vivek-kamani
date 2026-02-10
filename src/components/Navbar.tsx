"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/providers/MotionProvider";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { reducedMotion, toggleMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !navRef.current) return;

      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: navRef, dependencies: [reducedMotion] },
  );

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
    >
      <a
        href="#hero"
        className="font-display text-2xl font-bold tracking-tight text-ink"
        aria-label="Go to top"
      >
        VK<span className="text-calypso">.</span>
      </a>

      <div className="flex items-center gap-6">
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {[
            { label: "Work", href: "#work" },
            { label: "About", href: "#metrics" },
            { label: "Contact", href: "#contact" },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-calypso focus-visible:text-calypso"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Motion Toggle — AAA A11y Compliance */}
        <button
          onClick={toggleMotion}
          aria-label={
            reducedMotion ? "Enable animations" : "Reduce motion"
          }
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-citrine focus-visible:bg-ink focus-visible:text-citrine"
          type="button"
        >
          {reducedMotion ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
