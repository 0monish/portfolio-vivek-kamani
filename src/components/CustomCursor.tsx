'use client';

import { useEffect, useRef, useState } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { useMotion } from '@/providers/MotionProvider';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { reducedMotion } = useMotion();
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(false);

  // Debounced mouse position
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Detect fine pointer support
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const updatePointerState = (event?: MediaQueryListEvent) => {
      setHasFinePointer(event?.matches ?? mediaQuery.matches);
    };

    updatePointerState();
    mediaQuery.addEventListener('change', updatePointerState);

    return () => mediaQuery.removeEventListener('change', updatePointerState);
  }, []);

  // Debounced mouse movement handler (not GSAP)
  useEffect(() => {
    if (reducedMotion || !hasFinePointer || !cursorRef.current) return;

    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Clear previous timeout to batch updates
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    };
  }, [hasFinePointer, reducedMotion]);

  // Video hover state with mutation observer
  useEffect(() => {
    if (reducedMotion || !hasFinePointer) return;

    const onMouseEnterVideo = () => setIsHoveringVideo(true);
    const onMouseLeaveVideo = () => setIsHoveringVideo(false);

    const bindVideoListeners = () => {
      const elements = document.querySelectorAll('[data-video-hover]');
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterVideo);
        el.removeEventListener('mouseleave', onMouseLeaveVideo);
        el.addEventListener('mouseenter', onMouseEnterVideo);
        el.addEventListener('mouseleave', onMouseLeaveVideo);
      });

      return elements;
    };

    // Observe for [data-video-hover] elements
    const observer = new MutationObserver(() => {
      bindVideoListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial bind
    const videoElements = bindVideoListeners();

    return () => {
      observer.disconnect();
      videoElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterVideo);
        el.removeEventListener('mouseleave', onMouseLeaveVideo);
      });
    };
  }, [hasFinePointer, reducedMotion]);

  // Consolidated GSAP animations: position tracking + size toggling
  useGSAP(
    () => {
      if (!cursorRef.current || reducedMotion || !hasFinePointer) return;

      // Use gsap.context() for proper cleanup
      const ctx = gsap.context(() => {
        // Single tween for cursor position (kills previous on update)
        gsap.to(cursorRef.current, {
          x: mousePos.x,
          y: mousePos.y,
          duration: 0.15,
          ease: 'power2.out',
          overwrite: 'auto', // Prevents tween buildup
        });

        // Single tween for cursor size based on hover state
        gsap.to(cursorRef.current, {
          width: isHoveringVideo ? 80 : 12,
          height: isHoveringVideo ? 80 : 12,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }, cursorRef);

      return () => ctx.revert();
    },
    { dependencies: [mousePos, isHoveringVideo, reducedMotion, hasFinePointer] }
  );

  if (reducedMotion || !hasFinePointer) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full mix-blend-difference"
      style={{
        width: 12,
        height: 12,
        backgroundColor: isHoveringVideo ? 'transparent' : '#FAEDD9',
        border: isHoveringVideo ? '2px solid #FAEDD9' : 'none',
      }}
    >
      {isHoveringVideo && (
        <span
          ref={textRef}
          className="text-citrine text-[10px] font-bold tracking-widest"
        >
          PLAY
        </span>
      )}
    </div>
  );
}
