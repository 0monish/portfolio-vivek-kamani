'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

interface Project {
  title: string;
  category: string;
  result: string;
  thumbnail: string;
  videoUrl?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'BRAND LAUNCH — APEX STUDIOS',
    category: 'Commercial',
    result: 'Retention increased by 40%',
    thumbnail: '/projects/project-01.jpg',
    videoUrl: '#',
  },
  {
    title: 'SOCIAL SERIES — NOVA CREATORS',
    category: 'YouTube / Social',
    result: '12M views in first week',
    thumbnail: '/projects/project-02.jpg',
    videoUrl: '#',
  },
  {
    title: 'DOCUMENTARY — UNSEEN PATHS',
    category: 'Documentary',
    result: 'Selected for 3 film festivals',
    thumbnail: '/projects/project-03.jpg',
    videoUrl: '#',
  },
  {
    title: 'MUSIC VIDEO — ECHOES',
    category: 'Music Video',
    result: '500K views in 48 hours',
    thumbnail: '/projects/project-04.jpg',
    videoUrl: '#',
  },
  {
    title: 'PRODUCT FILM — STEELCRAFT',
    category: 'Product',
    result: 'Conversion rate up 28%',
    thumbnail: '/projects/project-05.jpg',
    videoUrl: '#',
  },
];

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const blendLayer = sectionRef.current.querySelector(
        '[data-work-blend]'
      ) as HTMLDivElement | null;
      const cards = sectionRef.current.querySelectorAll('[data-project-card]');

      // Initial state setup
      gsap.set(sectionRef.current, {
        y: 24,
        opacity: 1, // ✨ Changed from 0.9 to 1 (no fading)
      });

      if (blendLayer) {
        gsap.set(blendLayer, {
          opacity: 0, // ✨ Start invisible so it doesn't show
        });
      }

      // Boundary animation: section entrance (no fading)
      const boundaryTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true, // ✨ Changed from scrub: 1 to immediate sync
        },
      });

      boundaryTimeline.to(
        sectionRef.current,
        {
          y: 0,
          opacity: 1, // ✨ Just move into place, no fading
          ease: 'none',
        },
        0
      );

      // Blend layer stays invisible (removed fade animation)
      // if (blendLayer) {
      //   boundaryTimeline.to(
      //     blendLayer,
      //     {
      //       opacity: 0,
      //       ease: 'none',
      //     },
      //     0
      //   );
      // }

      // Project card animations: unified timeline with stagger
      const cardsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true, // ✨ Changed from scrub: 1 to immediate sync
          toggleActions: 'play none none reverse',
        },
      });

      // Film strip reveal: all cards animate with unified clip-path
      cardsTimeline.from(
        cards,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.7,
          ease: 'power4.out',
          stagger: 0.12, // Coordinated stagger
        },
        0
      );

      // Inner content stagger: parallel animation for card content
      cards.forEach((card, i) => {
        const inner = card.querySelector('[data-project-inner]');
        if (inner) {
          cardsTimeline.from(
            inner,
            {
              y: 40,
              opacity: 0,
              duration: 0.5,
              ease: 'power3.out',
            },
            i * 0.12 + 0.1 // Stagger + offset after clip starts
          );
        }
      });

      // Playhead line animation (independent element)
      const playhead = sectionRef.current.querySelector('[data-playhead]');
      if (playhead) {
        gsap.from(playhead, {
          scaleY: 0,
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true, // ✨ Changed from scrub: 1 to immediate sync
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected projects and work"
      className="bg-ink relative -mt-px overflow-hidden py-32 md:py-40"
    >
      <div
        data-work-blend
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#faedd9_0%,rgba(250,237,217,0)_100%)]"
        aria-hidden="true"
      />

      {/* Section heading */}
      <div className="mx-auto mb-20 max-w-6xl px-6">
        <h2 className="font-display text-citrine text-5xl font-black tracking-tight uppercase sm:text-6xl md:text-7xl">
          SELECTED WORK
        </h2>
        <div className="bg-calypso mt-4 h-1 w-16" aria-hidden="true" />
      </div>

      {/* Playhead line */}
      <div
        data-playhead
        className="bg-calypso/30 absolute top-32 bottom-32 left-6 hidden w-px md:left-12 md:block"
        aria-hidden="true"
      >
        <div className="bg-calypso absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" />
      </div>

      {/* Project cards — vertical film strip */}
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6">
        {PROJECTS.map((project, index) => (
          <article
            key={project.title}
            data-project-card
            className="group relative overflow-hidden"
          >
            <div
              className="border-citrine/10 relative flex flex-col gap-6 border-b py-10 md:flex-row md:items-center md:gap-12 md:py-14"
              data-project-inner
            >
              {/* Index */}
              <span
                className="font-display text-calypso text-4xl font-black tabular-nums md:min-w-20 md:text-5xl"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Thumbnail placeholder */}
              <div
                className="bg-waikawa/20 relative aspect-video w-full overflow-hidden md:w-72 lg:w-96"
                data-video-hover
              >
                <div
                  className="flex h-full w-full items-center justify-center"
                  role="img"
                  aria-label={`Thumbnail for ${project.title}`}
                >
                  <span className="text-citrine/50 text-xs font-semibold tracking-widest uppercase">
                    {project.category}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="bg-ink/60 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-citrine text-sm font-bold tracking-widest uppercase">
                    View Project
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-3">
                <h3 className="font-display text-citrine text-2xl font-black tracking-tight uppercase md:text-3xl">
                  <a
                    href={project.videoUrl}
                    className="hover:text-danube focus-visible:text-danube transition-colors"
                    aria-label={`View project: ${project.title}`}
                  >
                    {project.title}
                  </a>
                </h3>
                <span className="text-spindle text-xs font-semibold tracking-[0.3em] uppercase">
                  {project.category}
                </span>
              </div>

              {/* Result tag */}
              <div className="md:ml-auto md:text-right">
                <span className="border-calypso text-calypso inline-block border px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase">
                  {project.result}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
