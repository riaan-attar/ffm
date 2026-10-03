import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * An image that reveals via a clip-path wipe as it scrolls into view,
 * instead of a plain opacity fade. `direction` controls which edge the
 * wipe uncovers from.
 */
export function RevealImage({ src, alt, className = '', direction = 'left' }) {
  const wrapRef = useRef(null);
  const clipRef = useRef(null);

  const clipFrom = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(100% 0 0 0)',
    bottom: 'inset(0 0 100% 0)'
  }[direction];

  useLayoutEffect(() => {
    const el = clipRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: clipFrom, webkitClipPath: clipFrom },
        {
          clipPath: 'inset(0 0 0 0)',
          webkitClipPath: 'inset(0 0 0 0)',
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true }
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [clipFrom]);

  // The clip-path animates on an inner element, not the wrapper itself, so
  // the wrapper's own background/border/shadow (the "frame" around the
  // image) stays visible the whole time instead of disappearing along with
  // the clipped content before the reveal fires.
  return (
    <div ref={wrapRef} className={`reveal-image-wrap ${className}`}>
      <div ref={clipRef} className="reveal-image-clip">
        <img src={src} alt={alt} className="reveal-image-img" loading="lazy" />
      </div>
    </div>
  );
}
