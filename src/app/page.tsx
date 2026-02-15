'use client';

import ContactFooter from '@/components/ContactFooter';
import CustomCursor from '@/components/CustomCursor';
import Gallery from '@/components/Gallery';
import Hero from '@/components/Hero/index';
import Navbar from '@/components/Navbar';
import Playhead from '@/components/Playhead';
import ProjectShowcase from '@/components/ProjectShowcase';
import { MotionProvider } from '@/providers/MotionProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';

export default function Home() {
  return (
    <MotionProvider>
      <SmoothScrollProvider>
        <CustomCursor />
        <Navbar />
        <Playhead />
        <main id="main-content" role="main">
          <Hero />
          <Gallery />
          <ProjectShowcase />
          <ContactFooter />
        </main>
      </SmoothScrollProvider>
    </MotionProvider>
  );
}
