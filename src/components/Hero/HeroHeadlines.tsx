import { forwardRef } from 'react';

export interface HeroHeadlinesRefs {
  leftHeadlineRef: React.RefObject<HTMLHeadingElement | null>;
  rightHeadlineRef: React.RefObject<HTMLHeadingElement | null>;
  subtextRef: React.RefObject<HTMLDivElement | null>;
}

interface HeroHeadlinesProps {
  refs: HeroHeadlinesRefs;
}

const HeroHeadlines = forwardRef<HTMLDivElement, HeroHeadlinesProps>(
  function HeroHeadlines({ refs }, _ref) {
    const { leftHeadlineRef, rightHeadlineRef, subtextRef } = refs;

    return (
      <div className="relative z-20 flex h-full w-full max-w-480 flex-col justify-between px-6 pt-24 pb-12 md:flex-row md:items-center md:px-12 lg:px-20 xl:px-32">
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
    );
  }
);

export default HeroHeadlines;
