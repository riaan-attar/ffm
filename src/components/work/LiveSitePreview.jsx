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
 * `<iframe>` the moment this element is actually visible, and only once
 * (it then stays loaded). Pass `loaded` explicitly to control it from the
 * outside instead (used on the home page's pinned card stack, where cards
 * are moved on/off screen via transform rather than normal scroll, so each
 * one loads exactly when it becomes the active card).
 */
export function LiveSitePreview({ url, title, className = '', scale = 0.4, showChrome = true, loaded: loadedProp }) {
  const [internalLoaded, setInternalLoaded] = useState(false);
  const loaded = loadedProp !== undefined ? loadedProp : internalLoaded;
  const containerRef = useRef(null);
  const domain = getDomain(url);

  useEffect(() => {
    if (loadedProp !== undefined) return; // externally controlled - skip self-observation
    if (internalLoaded) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInternalLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInternalLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadedProp, internalLoaded]);

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
