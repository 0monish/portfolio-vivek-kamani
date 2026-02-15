import { forwardRef } from 'react';
import Image from 'next/image';

import { SCREEN_INSET_STYLE } from '@/components/Hero/constants';

export interface PhoneMockupRefs {
  iPhoneRef: React.RefObject<HTMLDivElement | null>;
  phoneBodyRef: React.RefObject<HTMLDivElement | null>;
  iPhoneFrameRef: React.RefObject<HTMLImageElement | null>;
  screenImageRef: React.RefObject<HTMLDivElement | null>;
}

interface PhoneMockupProps {
  refs: PhoneMockupRefs;
}

const PhoneMockup = forwardRef<HTMLDivElement, PhoneMockupProps>(
  function PhoneMockup({ refs }, _ref) {
    const { iPhoneRef, phoneBodyRef, iPhoneFrameRef, screenImageRef } = refs;

    return (
      <div
        ref={iPhoneRef}
        className="absolute top-1/2 left-1/2 z-20 w-[min(42vw,220px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(34vw,250px)] md:w-[min(28vw,320px)]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          ref={phoneBodyRef}
          className="relative aspect-438/904"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Internal screen image for fade */}
          <div
            ref={screenImageRef}
            className="absolute z-10 overflow-hidden"
            style={SCREEN_INSET_STYLE}
          >
            <Image
              src="/vivek.png"
              alt=""
              fill
              className="pointer-events-none absolute inset-0 object-cover"
            />
          </div>

          <Image
            ref={iPhoneFrameRef}
            src="/iPhone.svg"
            alt="iPhone frame"
            fill
            priority
            className="pointer-events-none absolute inset-0 z-20 object-contain"
          />
        </div>

        <div
          className="absolute inset-0 -z-10 scale-[1.1] blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(76, 180, 255, 0.22) 0%, rgba(250, 237, 217, 0.08) 35%, transparent 72%)',
          }}
          aria-hidden="true"
        />
      </div>
    );
  }
);

export default PhoneMockup;
