"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/providers/MotionProvider";

interface Project {
  title: string;
  category: string;
  result: string;
  thumbnail: string;
  videoUrl?: string;
}

const PROJECTS: Project[] = [
  {
    title: "BRAND LAUNCH — APEX STUDIOS",
    category: "Commercial",
    result: "Retention increased by 40%",
    thumbnail: "/projects/project-01.jpg",
    videoUrl: "#",
  },
  {
    title: "SOCIAL SERIES — NOVA CREATORS",
    category: "YouTube / Social",
    result: "12M views in first week",
    thumbnail: "/projects/project-02.jpg",
    videoUrl: "#",
  },
  {
    title: "DOCUMENTARY — UNSEEN PATHS",
    category: "Documentary",
    result: "Selected for 3 film festivals",
    thumbnail: "/projects/project-03.jpg",
    videoUrl: "#",
  },
  {
    title: "MUSIC VIDEO — ECHOES",
    category: "Music Video",
    result: "500K views in 48 hours",
    thumbnail: "/projects/project-04.jpg",
    videoUrl: "#",
  },
  {
    title: "PRODUCT FILM — STEELCRAFT",
    category: "Product",
    result: "Conversion rate up 28%",
    thumbnail: "/projects/project-05.jpg",
    videoUrl: "#",
  },
];

export default function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();

  useGSAP(
    () => {
      if (reducedMotion || !sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll("[data-project-card]");

      // "Film strip" hard-cut reveal
      cards.forEach((card, i) => {
        // Clip-based reveal: card slides in like a film advancing
        gsap.from(card, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.7,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        });

        // Inner content stagger
        const inner = card.querySelector("[data-project-inner]");
        if (inner) {
          gsap.from(inner, {
            y: 40,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
            delay: 0.2,
          });
        }
      });

      // Playhead line animation
      const playhead = sectionRef.current.querySelector("[data-playhead]");
      if (playhead) {
        gsap.from(playhead, {
          scaleY: 0,
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Selected projects and work"
      className="relative bg-ink py-32 md:py-40"
    >
      {/* Section heading */}
      <div className="mx-auto mb-20 max-w-6xl px-6">
        <h2 className="font-display text-5xl font-black uppercase tracking-tight text-citrine sm:text-6xl md:text-7xl">
          SELECTED WORK
        </h2>
        <div className="mt-4 h-1 w-16 bg-calypso" aria-hidden="true" />
      </div>

      {/* Playhead line */}
      <div
        data-playhead
        className="absolute top-32 bottom-32 left-6 hidden w-px bg-calypso/30 md:left-12 md:block"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-calypso" />
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
              className="relative flex flex-col gap-6 border-b border-citrine/10 py-10 md:flex-row md:items-center md:gap-12 md:py-14"
              data-project-inner
            >
              {/* Index */}
              <span
                className="font-display text-4xl font-black tabular-nums text-calypso md:min-w-[80px] md:text-5xl"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Thumbnail placeholder */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-waikawa/20 md:w-72 lg:w-96"
                data-video-hover
              >
                <div
                  className="flex h-full w-full items-center justify-center"
                  role="img"
                  aria-label={`Thumbnail for ${project.title}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-citrine/50">
                    {project.category}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-ink/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-bold uppercase tracking-widest text-citrine">
                    View Project
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-3">
                <h3 className="font-display text-2xl font-black uppercase tracking-tight text-citrine md:text-3xl">
                  <a
                    href={project.videoUrl}
                    className="transition-colors hover:text-danube focus-visible:text-danube"
                    aria-label={`View project: ${project.title}`}
                  >
                    {project.title}
                  </a>
                </h3>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-spindle">
                  {project.category}
                </span>
              </div>

              {/* Result tag */}
              <div className="md:ml-auto md:text-right">
                <span className="inline-block border border-calypso px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-calypso">
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
