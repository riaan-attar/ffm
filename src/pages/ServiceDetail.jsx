import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES_DATA } from '../data/services';
import { Navbar } from '../components/Navbar';
import { SplitText } from '../components/motion/SplitText';
import { CursorSpotlight } from '../components/motion/CursorSpotlight';
import { DragScroll } from '../components/motion/DragScroll';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import '../styles/service-detail.css';

gsap.registerPlugin(ScrollTrigger);

/* Simple hand-drawn line icons, matching the style of
   src/components/process/ProcessIcons.jsx — no external assets needed. */
function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.6 2.6L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTarget(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES_DATA.find((s) => s.id === slug);

  const sectionRefs = useRef([]);
  const benefitRefs = useRef([]);
  const idealRefs = useRef([]);
  const ghostNumberRef = useRef(null);
  const processRowWrapRef = useRef(null);

  // Reset refs each render so stale nodes from a previous slug never linger.
  sectionRefs.current = [];
  benefitRefs.current = [];
  idealRefs.current = [];

  // Which benefit cards are tap-flipped (for touch devices, where :hover
  // never fires). Keyed by index; reset for free whenever the slug changes
  // because the whole page remounts via the `key={slug}` below.
  const [flippedBenefits, setFlippedBenefits] = useState({});

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };
  const addBenefitRef = (el) => {
    if (el && !benefitRefs.current.includes(el)) benefitRefs.current.push(el);
  };
  const addIdealRef = (el) => {
    if (el && !idealRefs.current.includes(el)) idealRefs.current.push(el);
  };

  const toggleFlip = (i) => {
    setFlippedBenefits((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  useLayoutEffect(() => {
    if (!service) return;

    const sections = sectionRefs.current.filter(Boolean);
    const benefits = benefitRefs.current.filter(Boolean);
    const idealCards = idealRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              once: true
            }
          }
        );
      });

      // Benefit cards tilt up out of a slight 3D lean instead of a flat
      // slide — they also flip on hover/tap (handled in CSS), so the
      // entrance sets up the same 3D plane the flip will use.
      if (benefits.length) {
        gsap.fromTo(
          benefits,
          { y: 36, opacity: 0, rotateX: -18 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: benefits[0].closest('.sd-benefits-grid') || benefits[0],
              start: 'top 80%',
              once: true
            }
          }
        );
      }

      // Whole drag-scroll process row fades up as a unit — the row itself
      // is interactive (drag), so individual-card stagger would fight the
      // pointer handlers.
      if (processRowWrapRef.current) {
        gsap.fromTo(
          processRowWrapRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: processRowWrapRef.current,
              start: 'top 80%',
              once: true
            }
          }
        );
      }

      // Ideal-for cards fan in with alternating rotation instead of a
      // uniform lift, so the grid doesn't read like the benefits grid.
      if (idealCards.length) {
        idealCards.forEach((card, i) => {
          const tilt = (i % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 2);
          gsap.fromTo(
            card,
            { y: 30, opacity: 0, rotate: tilt },
            {
              y: 0,
              opacity: 1,
              rotate: 0,
              duration: 0.7,
              ease: 'back.out(1.4)',
              delay: i * 0.09,
              scrollTrigger: {
                trigger: idealCards[0].closest('.sd-ideal-grid') || card,
                start: 'top 82%',
                once: true
              }
            }
          );
        });
      }

      // Giant ghost numeral behind the hero drifts slightly as the hero
      // scrolls past, instead of sitting static.
      if (ghostNumberRef.current) {
        gsap.to(ghostNumberRef.current, {
          yPercent: -16,
          ease: 'none',
          scrollTrigger: {
            trigger: ghostNumberRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      // Refresh so ScrollTrigger recalculates against the freshly-mounted
      // content when navigating directly between service slugs.
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [slug]);

  if (!service) {
    return (
      <div className="sd-notfound">
        <div className="sd-notfound-inner">
          <h1>Service not found</h1>
          <p>The service you&apos;re looking for doesn&apos;t exist or may have moved.</p>
          <Link to="/" className="sd-notfound-link">
            <span aria-hidden="true">&larr;</span> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const otherServices = SERVICES_DATA.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <div key={slug} className="service-detail-page">
      {/* Bespoke hero — split-text headline over a giant drifting ghost
          numeral, instead of the shared PageHero banner. */}
      <header className="sd-hero">
        <CursorSpotlight />
        <span ref={ghostNumberRef} className="sd-hero-ghost-number" aria-hidden="true">
          {service.number}
        </span>

        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="sd-hero-container">
          <Link to="/services" className="sd-hero-back">
            <span aria-hidden="true">&larr;</span> Back to Services
          </Link>

          <div className="sd-hero-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>Service {service.number}</span>
          </div>

          <SplitText as="h1" className="sd-hero-title" text={service.title} />

          <p className="sd-hero-tagline">{service.tagline}</p>
        </div>
      </header>

      {/* Expanded description — cream */}
      <section ref={addSectionRef} className="sd-section sd-intro sd-bg-cream">
        <div className="sd-container">
          <span className="sd-kicker">{service.number} / Overview</span>
          <p className="sd-longdesc">{service.longDescription}</p>
        </div>
      </section>

      {/* Benefits — navy, flip-to-reveal cards */}
      <section ref={addSectionRef} className="sd-section sd-benefits sd-bg-navy">
        <div className="sd-container">
          <header className="sd-section-header">
            <div className="sd-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>WHY IT WORKS</span>
            </div>
            <h2 className="sd-section-title">
              Outcomes you can <span className="highlight-gold">actually measure</span>
            </h2>
            <p className="sd-section-hint">Tap or hover a card to flip it.</p>
          </header>

          <div className="sd-benefits-grid">
            {service.benefits.map((benefit, i) => (
              <div
                key={i}
                ref={addBenefitRef}
                className={`sd-benefit-card ${flippedBenefits[i] ? 'is-flipped' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => toggleFlip(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(i);
                  }
                }}
              >
                <div className="sd-benefit-card-inner">
                  <div className="sd-benefit-face sd-benefit-front">
                    <div className="sd-benefit-icon">
                      <IconCheck className="sd-icon-svg" />
                    </div>
                    <p className="sd-benefit-text">{benefit}</p>
                  </div>
                  <div className="sd-benefit-face sd-benefit-back">
                    <span className="sd-benefit-back-number">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sd-benefit-back-label">Why it works</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — navy, drag-scroll instead of another vertical stack */}
      <section ref={addSectionRef} className="sd-section sd-process sd-bg-navy">
        <div className="sd-container">
          <header className="sd-section-header">
            <div className="sd-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>HOW WE DELIVER IT</span>
            </div>
            <h2 className="sd-section-title">
              Our process for <span className="highlight-gold">{service.title}</span>
            </h2>
          </header>

          <span className="sd-process-hint">
            <span className="sd-process-hint-arrow" aria-hidden="true">&larr;</span>
            Drag through the steps
            <span className="sd-process-hint-arrow" aria-hidden="true">&rarr;</span>
          </span>
        </div>

        <div ref={processRowWrapRef} className="sd-process-row-wrap">
          <DragScroll className="sd-process-row">
            {service.process.map((step) => (
              <div key={step.step} className="sd-process-card">
                <span className="sd-process-step-number">{step.step}</span>
                <h3 className="sd-process-step-title">{step.title}</h3>
                <p className="sd-process-step-description">{step.description}</p>
              </div>
            ))}
          </DragScroll>
        </div>
      </section>

      {/* Ideal for — cream */}
      <section ref={addSectionRef} className="sd-section sd-ideal sd-bg-cream">
        <div className="sd-container">
          <header className="sd-section-header">
            <div className="sd-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>IDEAL FOR</span>
            </div>
            <h2 className="sd-section-title">
              Is this <span className="highlight-gold">right for you?</span>
            </h2>
          </header>

          <div className="sd-ideal-grid">
            {service.idealFor.map((item, i) => (
              <div key={i} ref={addIdealRef} className="sd-ideal-card">
                <div className="sd-ideal-icon">
                  <IconTarget className="sd-icon-svg" />
                </div>
                <p className="sd-ideal-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA banner */}
      <section ref={addSectionRef} className="sd-section sd-cta sd-bg-navy">
        <div className="sd-container sd-cta-inner">
          <h2 className="sd-cta-title">
            Ready to get started with <span className="highlight-gold">{service.title}</span>?
          </h2>
          <p className="sd-cta-copy">
            Tell us about your project and we&apos;ll come back with a clear plan — no fluff, no pressure.
          </p>
          <MagneticWrap>
            <Link to="/contact" className="sd-cta-btn">
              <span>Start Your Project</span>
              <img
                src="/assets/services/service-arrow.svg"
                alt=""
                className="sd-cta-arrow"
                aria-hidden="true"
              />
            </Link>
          </MagneticWrap>
        </div>
      </section>

      {/* Other services cross-links */}
      <section className="sd-section sd-other sd-bg-cream">
        <div className="sd-container sd-other-inner">
          <span className="sd-other-label">Explore other services</span>
          <div className="sd-other-pills">
            {otherServices.map((s) => (
              <Link key={s.id} to={`/services/${s.id}`} className="sd-other-pill">
                {s.title}
                <img
                  src="/assets/services/service-arrow.svg"
                  alt=""
                  className="sd-other-pill-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
