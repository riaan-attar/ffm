import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { SplitText } from '../components/motion/SplitText';
import { CursorSpotlight } from '../components/motion/CursorSpotlight';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import { SERVICES_DATA } from '../data/services';
import '../styles/services-overview.css';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesOverview() {
  const indexRef = useRef(null);
  const rowRefs = useRef([]);

  useLayoutEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (rows.length === 0) return;

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        const ghost = row.querySelector('.sov-row-ghost-number');
        const visual = row.querySelector('.sov-row-visual');
        const content = row.querySelectorAll('.sov-row-content > *');

        gsap.fromTo(
          content,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.07,
            scrollTrigger: { trigger: row, start: 'top 78%', once: true }
          }
        );

        if (visual) {
          gsap.fromTo(
            visual,
            { scale: 0.85, opacity: 0, rotate: -3 },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              duration: 0.8,
              ease: 'back.out(1.5)',
              scrollTrigger: { trigger: row, start: 'top 75%', once: true }
            }
          );
        }

        if (ghost) {
          gsap.to(ghost, {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
          });
        }
      });

      let refreshTimer = null;
      const scheduleRefresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
      };
      const imgs = indexRef.current ? indexRef.current.querySelectorAll('img') : [];
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener('load', scheduleRefresh, { once: true });
      });

      return () => clearTimeout(refreshTimer);
    }, indexRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header className="sov-hero">
        <CursorSpotlight />
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="sov-hero-container">
          <div className="sov-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>Everything We Do</span>
          </div>

          <SplitText
            as="h1"
            className="sov-hero-title"
            text="Six Ways We Help You Grow"
          />

          <p className="sov-hero-copy">
            From the first line of code to the automation that runs while you sleep — one connected
            practice, six disciplines deep.
          </p>
        </div>
      </header>

      <section ref={indexRef} className="sov-index">
        {SERVICES_DATA.map((service, index) => (
          <Link
            to={`/services/${service.id}`}
            key={service.id}
            ref={(el) => (rowRefs.current[index] = el)}
            className={`sov-row sov-row-${service.theme}`}
          >
            <span className="sov-row-ghost-number" aria-hidden="true">{service.number}</span>

            <div className="sov-row-inner">
              <div className="sov-row-content">
                <span className="sov-row-number">{service.number} / 06</span>
                <h2 className="sov-row-title">{service.title}</h2>
                <p className="sov-row-tagline">{service.tagline}</p>

                <div className="sov-row-features">
                  {service.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="sov-row-feature-chip">{feature}</span>
                  ))}
                </div>

                <span className="sov-row-cta">
                  <span>Explore {service.title}</span>
                  <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="sov-row-arrow" />
                </span>
              </div>

              <div className="sov-row-visual">
                <img src={service.image} alt="" className="sov-row-img" loading="lazy" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="sov-cta-section">
        <h2 className="sov-cta-title">
          Not sure which one you need?
        </h2>
        <p className="sov-cta-copy">Tell us what you're trying to build — we'll point you at the right fit.</p>
        <MagneticWrap>
          <Link to="/contact" className="sov-cta-btn">
            <span>Talk To Us</span>
            <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="sov-cta-arrow" />
          </Link>
        </MagneticWrap>
      </section>
    </>
  );
}
