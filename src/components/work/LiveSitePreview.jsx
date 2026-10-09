import React, { useState, useRef, useEffect } from 'react';

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Shows the real live site continuously (no click required) once it's
 * actually on screen, instead of paying the cost of loading a second full
 * website (its own JS bundle, fonts, analytics/tracking scripts, and - for
 * at least one of these projects - a live 3D scene) the instant the page
 * mounts, before the visitor has even scrolled to it.
 *
 * Self-managed by default: an IntersectionObserver mounts the real
 * `<iframe>` once this element is actually visible, and unmounts it again
 * once it's scrolled well out of view (400px buffer so it doesn't flicker
 * right at the viewport edge). A page with several of these in a row (e.g.
 * the /work archive) would otherwise end up with every one of them mounted
 * and running simultaneously after a single scroll-through — each is a
 * full second website with its own JS, and at least one runs a live 3D
 * scene, so that adds up to real main-thread/GPU cost fast. Pass `loaded`
 * explicitly to control it from the outside instead (used on the home
 * page's pinned card stack, where cards are moved on/off screen via
 * transform rather than normal scroll).
 */
export function LiveSitePreview({ url, title, className = '', scale = 0.4, showChrome = true, loaded: loadedProp }) {
  const [internalLoaded, setInternalLoaded] = useState(false);
  const loaded = loadedProp !== undefined ? loadedProp : internalLoaded;
  const containerRef = useRef(null);
  const domain = getDomain(url);

  useEffect(() => {
    if (loadedProp !== undefined) return; // externally controlled - skip self-observation
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInternalLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInternalLoaded(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '400px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadedProp]);

  if (!loaded) {
    return (
      <div ref={containerRef} className={`live-preview live-preview-static ${className}`}>
        {showChrome && (
          <div className="live-preview-chrome">
            <span className="live-preview-dot" aria-hidden="true"></span>
            <span className="live-preview-dot" aria-hidden="true"></span>
            <span className="live-preview-dot" aria-hidden="true"></span>
            <span className="live-preview-domain">{domain}</span>
          </div>
        )}
        <div className="live-preview-body">
          <span className="live-preview-domain-large">{domain}</span>
        </div>
      </div>
    );
  }

  const pct = 100 / scale;

  return (
    <div ref={containerRef} className={`live-preview ${className}`}>
      <iframe
        src={url}
        title={`${title} live preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        sandbox="allow-scripts allow-same-origin"
        style={{ width: `${pct}%`, height: `${pct}%`, transform: `scale(${scale})` }}
        className="live-preview-iframe"
      />
    </div>
  );
}
