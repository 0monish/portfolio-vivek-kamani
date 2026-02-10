"use client";

import { MotionProvider } from "@/providers/MotionProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Playhead from "@/components/Playhead";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import ProjectShowcase from "@/components/ProjectShowcase";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <MotionProvider>
      <SmoothScrollProvider>
        <CustomCursor />
        <Navbar />
        <Playhead />
        <main id="main-content" role="main">
          <Hero />
          <Metrics />
          <ProjectShowcase />
          <ContactFooter />
        </main>
      </SmoothScrollProvider>
    </MotionProvider>
  );
}
