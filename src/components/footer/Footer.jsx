import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const wordmarkRef = useRef(null);

  useLayoutEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <nav className="footer-nav-primary" aria-label="Footer">
          <Link to="/services">Services</Link>
          <Link to="/work">Work</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer-nav-secondary">
          <Link to="/about">About</Link>
          <Link to="/#process">Our Process</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/contact">Start a Project</Link>
        </div>

        <div className="footer-mid-row">
          <div className="footer-tagline-block">
            <p className="footer-tagline">Pixels into profit.</p>
            <p className="footer-copy">
              &copy; {year}{' '}
              <a
                href="https://www.footfallmetrics.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-copy-link"
              >
                FFM Agency
              </a>
              . Modern websites, web apps and automations for businesses that want to grow.
            </p>
          </div>

          <div className="footer-socials">
            <a href="#" className="footer-social-link">Instagram</a>
            <a href="#" className="footer-social-link">LinkedIn</a>
          </div>
        </div>

        <div ref={wordmarkRef} className="footer-wordmark-wrap">
          <div className="footer-wordmark-shapes" aria-hidden="true">
            <span className="fw-shape fw-shape-circle"></span>
            <span className="fw-shape fw-shape-hexagon"></span>
            <span className="fw-shape fw-shape-triangle"></span>
            <span className="fw-shape fw-shape-square"></span>
            <span className="fw-shape fw-shape-bar"></span>
          </div>
          <h2 className="footer-wordmark">
            Design by{' '}
            <a
              href="https://www.footfallmetrics.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wordmark-link"
            >
              ffm
            </a>
          </h2>
        </div>
      </div>
    </footer>
  );
}
