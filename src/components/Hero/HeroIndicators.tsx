import { forwardRef } from 'react';

const HeroIndicators = forwardRef<HTMLDivElement>(
  function HeroIndicators(_props, ref) {
    return (
      <>
        <div
          ref={ref}
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
      </>
    );
  }
);

export default HeroIndicators;
