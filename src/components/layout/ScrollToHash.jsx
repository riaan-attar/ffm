import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles in-page anchor navigation (e.g. Link to="/#services") across route
 * changes, since React Router doesn't scroll to hash targets automatically.
 * Also resets scroll to top on plain route changes with no hash.
 */
export function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');

      // Pinned (GSAP ScrollTrigger) sections resize their pin-spacer shortly
      // after mount, which can grow the document height dramatically. A
      // smooth scroll started before that settles gets silently dropped by
      // the browser (the animation's target keeps moving under it), so we
      // jump instantly first, then re-correct with a smooth nudge once
      // layout has had time to stabilize.
      const scrollToEl = (behavior) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior });
      };

      const raf = requestAnimationFrame(() => scrollToEl('auto'));
      const settle = setTimeout(() => scrollToEl('smooth'), 400);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(settle);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash, key]);

  return null;
}
