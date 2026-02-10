"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/providers/MotionProvider";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { reducedMotion } = useMotion();
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    // Only show custom cursor on pointer devices
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.15,
          ease: "power2.out",
        });
      }
    };

    const onMouseEnterVideo = () => setIsHoveringVideo(true);
    const onMouseLeaveVideo = () => setIsHoveringVideo(false);

    document.addEventListener("mousemove", onMouseMove);

    // Observe for [data-video-hover] elements
    const observer = new MutationObserver(() => {
      const videoElements = document.querySelectorAll("[data-video-hover]");
      videoElements.forEach((el) => {
        el.addEventListener("mouseenter", onMouseEnterVideo);
        el.addEventListener("mouseleave", onMouseLeaveVideo);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    const videoElements = document.querySelectorAll("[data-video-hover]");
    videoElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterVideo);
      el.addEventListener("mouseleave", onMouseLeaveVideo);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      videoElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterVideo);
        el.removeEventListener("mouseleave", onMouseLeaveVideo);
      });
    };
  }, [reducedMotion]);

  useGSAP(() => {
    if (!cursorRef.current || reducedMotion) return;

    if (isHoveringVideo) {
      gsap.to(cursorRef.current, {
        width: 80,
        height: 80,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursorRef.current, {
        width: 12,
        height: 12,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHoveringVideo, reducedMotion]);

  if (reducedMotion || !isVisible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full mix-blend-difference"
      style={{
        width: 12,
        height: 12,
        backgroundColor: isHoveringVideo ? "transparent" : "#FAEDD9",
        border: isHoveringVideo ? "2px solid #FAEDD9" : "none",
      }}
    >
      {isHoveringVideo && (
        <span
          ref={textRef}
          className="text-[10px] font-bold tracking-widest text-citrine"
        >
          PLAY
        </span>
      )}
    </div>
  );
}
