import React, { useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Wraps any element (button, Link, etc.) and makes it subtly "pull" toward
 * the cursor within `radius` px, snapping back with an elastic ease on
 * leave. Use sparingly on primary CTAs — it loses its impact if every
 * button on a page does it.
 */
export function MagneticWrap({ children, strength = 0.35, radius = 80, className = '' }) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - dist / (radius + rect.width / 2));

    gsap.to(el, {
      x: dx * strength * influence,
      y: dy * strength * influence,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <span
      ref={ref}
      className={`magnetic-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </span>
  );
}
