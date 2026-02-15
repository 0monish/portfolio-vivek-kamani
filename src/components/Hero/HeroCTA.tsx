import { forwardRef } from 'react';

const HeroCTA = forwardRef<HTMLAnchorElement>(function HeroCTA(_props, ref) {
  return (
    <a
      ref={ref}
      href="#contact"
      className="bg-citrine text-ink absolute right-0 bottom-12 left-0 z-40 mx-auto flex w-max items-center gap-3 rounded-full px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 hover:bg-white sm:bottom-16 md:bottom-20"
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
  );
});

export default HeroCTA;
