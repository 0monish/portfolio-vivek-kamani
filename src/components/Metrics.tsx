'use client';

import { useRef } from 'react';

import StoryBridge from '@/components/StoryBridge';
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
      const numbers = sectionRef.current.querySelectorAll('[data-count]');

      // Single unified timeline for all metrics animations
      // This ensures coordinated entrance and proper staggering
      const metricsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'top 25%',
          scrub: true, // ✨ Changed from scrub: 1 to immediate sync
          toggleActions: 'play none none reverse',
        },
      });

      // Animate all cards with clip-path reveal + stagger
      metricsTimeline.from(
        cards,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.6,
          ease: 'power4.out',
          stagger: 0.1, // Consolidated stagger in timeline
        },
        0
      );

      // Parallel: animate numbers counting up at same time
      // Use object tweens for each number to avoid multiple scroll listeners
      numbers.forEach((el, i) => {
        const target = parseFloat(el.getAttribute('data-count') || '0');
        const isFloat = target % 1 !== 0;
        const obj = { val: 0 };

        // Add to same timeline to keep everything synchronized
        metricsTimeline.to(
          obj,
          {
            val: target,
            duration: 0.8,
            ease: 'power2.out',
            onUpdate: () => {
              (el as HTMLElement).textContent = isFloat
                ? obj.val.toFixed(1)
                : Math.floor(obj.val).toString();
            },
          },
          i * 0.08 // Stagger matches card stagger
        );
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
      style={{
        marginTop: 0,
      }}
    >
      {/* Playhead connector line */}
      <div
        className="bg-calypso absolute top-0 left-1/2 h-16 w-px -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6" data-metrics-inner>
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

      <StoryBridge />
    </section>
  );
}
