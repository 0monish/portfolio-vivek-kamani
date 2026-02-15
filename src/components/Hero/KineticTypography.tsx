import { forwardRef } from 'react';

export interface KineticTypographyRefs {
  containerRef: React.RefObject<HTMLDivElement | null>;
  textRef1: React.RefObject<HTMLHeadingElement | null>;
  textRef2: React.RefObject<HTMLHeadingElement | null>;
}

interface KineticTypographyProps {
  refs: KineticTypographyRefs;
}

const KineticTypography = forwardRef<HTMLDivElement, KineticTypographyProps>(
  function KineticTypography({ refs }, _ref) {
    const { containerRef, textRef1, textRef2 } = refs;

    return (
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 z-[30] flex flex-col items-center justify-center overflow-hidden opacity-0"
      >
        <h1
          ref={textRef1}
          className="text-[15vw] leading-none font-black whitespace-nowrap text-white uppercase"
        >
          VIVEK KAMANI VIVEK KAMANI
        </h1>
        <h1
          ref={textRef2}
          className="stroke-white text-[15vw] leading-none font-black whitespace-nowrap text-transparent uppercase"
          style={{ WebkitTextStroke: '2px white' }}
        >
          VIDEO EDITOR VIDEO EDITOR
        </h1>
      </div>
    );
  }
);

export default KineticTypography;
