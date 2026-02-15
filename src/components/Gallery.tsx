'use client';

import { SpiralGallery } from '@/components/SpiralGallery';

export default function Gallery() {
  const galleryImages = Array.from(
    { length: 12 },
    (_, i) => `/gallery/img${i + 1}.jpg`
  );

  return (
    <SpiralGallery
      title="VISUAL STORIES"
      imageUrls={galleryImages}
      imageHeightPreset="lg"
      ariaLabel="Visual stories gallery - explore artistic photography"
      className="-mt-[30vh] bg-black"
      titleClassName="mb-12 px-8"
      overlayContentZIndex={10}
      enableMouseParallax
      pauseWhenOffscreen
    />
  );
}
