import { forwardRef } from 'react';

interface HeroBackgroundProps {
  overlayRef: React.RefObject<HTMLDivElement | null>;
}

const HeroBackground = forwardRef<HTMLDivElement, HeroBackgroundProps>(
  function HeroBackground({ overlayRef }, _ref) {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(31, 94, 143, 0.45), transparent 24%), linear-gradient(180deg, #020817 0%, #07162c 42%, #12060d 100%)',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 top-[48%] h-[34svh] bg-[radial-gradient(circle_at_50%_0%,rgba(85,171,228,0.45),transparent_58%)] blur-3xl"
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-[40svh] bg-[linear-gradient(180deg,transparent_0%,rgba(13,4,14,0.1)_15%,rgba(27,4,12,0.55)_100%)]"
          aria-hidden="true"
        />

        <div
          ref={overlayRef}
          className="bg-ink absolute inset-0 z-50"
          aria-hidden="true"
        />
      </>
    );
  }
);

export default HeroBackground;
