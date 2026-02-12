'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

interface Metric {
  value: string;
  suffix: string;
  label: string;
}

const METRICS: Metric[] = [
  { value: '150', suffix: '+', label: 'Projects Delivered' },
  { value: '2.4', suffix: 'B', label: 'Views Generated' },
  { value: '30', suffix: '+', label: 'Client Retainers' },
];

export default function Metrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll('[data-metric]');

      // Hard-cut entrance: each card clips in from the bottom
      cards.forEach((card, i) => {
        gsap.from(card, {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.6,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.1,
        });
      });

      // Animate numbers counting up
      const numbers = sectionRef.current.querySelectorAll('[data-count]');
      numbers.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-count') || '0');
        const isFloat = target % 1 !== 0;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = isFloat
              ? obj.val.toFixed(1)
              : Math.floor(obj.val).toString();
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="metrics"
      aria-label="Key metrics and statistics"
      className="bg-citrine relative py-32 md:py-40"
    >
      {/* Playhead connector line */}
      <div
        className="bg-calypso absolute top-0 left-1/2 h-16 w-px -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              data-metric
              className="border-ink flex flex-col items-center gap-4 border-b-[3px] pb-8 md:items-start md:border-b-0 md:border-l-[3px] md:pb-0 md:pl-8"
            >
              <div className="flex items-baseline gap-1">
                <span
                  data-count={metric.value}
                  className="font-display text-ink text-7xl font-black tabular-nums md:text-8xl lg:text-9xl"
                  aria-label={`${metric.value}${metric.suffix}`}
                >
                  {reducedMotion ? metric.value : '0'}
                </span>
                <span className="font-display text-calypso text-5xl font-black md:text-6xl">
                  {metric.suffix}
                </span>
              </div>
              <span className="text-ink/70 text-sm font-semibold tracking-[0.25em] uppercase">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
