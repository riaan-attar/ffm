import React, { useState, useEffect, useRef, useCallback } from 'react';

const SHOW_AFTER_PX = 480;

/**
 * Finds the first ancestor (walking up from `el`) that actually paints a
 * background color, skipping transparent wrapper divs, and reports whether
 * it reads as a dark or light color so the button can invert to stay
 * legible against whatever section is currently behind it.
 */
function isUnderlyingBackgroundDark(el) {
  let node = el;
  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    const match = bg.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const [r, g, b, a = 1] = match[1].split(',').map(Number);
      if (a > 0.5) {
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
      }
    }
    node = node.parentElement;
  }
  return true;
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const btnRef = useRef(null);
  const tickingRef = useRef(false);

  const updateTheme = useCallback(() => {
    // Sample from the viewport center rather than the button's own corner.
    // Some sections (the pinned GSAP stacking animations on Services/Work)
    // wrap their content in a transparent spacer element that can leave
    // empty gaps right at the viewport edges, which would otherwise fall
    // through to the global page background instead of the section's own
    // color. The center of the viewport reliably lands on actual painted
    // section content.
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const underEl = document.elementFromPoint(x, y);

    if (underEl) {
      setOnDark(isUnderlyingBackgroundDark(underEl));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);

      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(() => {
          updateTheme();
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateTheme]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      className={`scroll-top-btn ${visible ? 'is-visible' : ''} ${onDark ? 'theme-on-dark' : 'theme-on-light'}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
