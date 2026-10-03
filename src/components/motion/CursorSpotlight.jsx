import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * A soft gold glow that follows the pointer within its parent (which must
 * be position:relative or position:absolute). Drop it as the first child
 * of a dark hero/banner section for a subtle "alive" feel. Ignored on
 * touch devices since there's no persistent pointer to track.
 */
export function CursorSpotlight() {
  const dotRef = useRef(null);

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    const handleMove = (e) => {
      const rect = parent.getBoundingClientRect();
      gsap.to(el, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.5,
        ease: 'power3.out'
      });
    };

    const handleEnter = () => gsap.to(el, { opacity: 1, duration: 0.3 });
    const handleLeave = () => gsap.to(el, { opacity: 0, duration: 0.3 });

    parent.addEventListener('mousemove', handleMove);
    parent.addEventListener('mouseenter', handleEnter);
    parent.addEventListener('mouseleave', handleLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMove);
      parent.removeEventListener('mouseenter', handleEnter);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return <div ref={dotRef} className="cursor-spotlight" aria-hidden="true"></div>;
}
