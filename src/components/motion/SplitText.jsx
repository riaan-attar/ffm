import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text into per-word spans and reveals them with a staggered
 * rise + slight rotation, instead of the site's default flat fade-up.
 * Use for hero headlines where the entrance itself should feel like part
 * of the page's personality.
 */
export function SplitText({ text, as: Tag = 'h1', className = '', scroll = false, delay = 0 }) {
  const rootRef = useRef(null);
  const words = useMemo(() => text.split(' '), [text]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const spans = root.querySelectorAll('.split-word-inner');

    const ctx = gsap.context(() => {
      const tween = {
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.9,
        ease: 'back.out(1.6)',
        stagger: 0.045,
        delay
      };

      if (scroll) {
        gsap.fromTo(spans, { y: '100%', opacity: 0, rotate: 4 }, {
          ...tween,
          scrollTrigger: { trigger: root, start: 'top 85%', once: true }
        });
      } else {
        gsap.fromTo(spans, { y: '100%', opacity: 0, rotate: 4 }, tween);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [words, scroll, delay]);

  return (
    <Tag ref={rootRef} className={`split-text ${className}`}>
      {words.map((word, i) => (
        <span className="split-word" key={i}>
          <span className="split-word-inner">{word}</span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
