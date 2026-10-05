import React, { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import { DragScroll } from '../components/motion/DragScroll';
import { AvatarBadge } from '../components/testimonials/AvatarBadge';
import { StarRating } from '../components/testimonials/StarRating';
import { VideoModal } from '../components/testimonials/VideoModal';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { WORK_DATA } from '../data/work';
import '../styles/testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const AVERAGE_RATING = (
  TESTIMONIALS_DATA.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS_DATA.length
).toFixed(1);

const AUTO_ADVANCE_MS = 6500;

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalTestimonial, setModalTestimonial] = useState(null);

  const heroStarsRef = useRef(null);
  const spotlightRef = useRef(null);
  const quoteRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const timerRef = useRef(null);

  const active = TESTIMONIALS_DATA[activeIndex];

  // --- Hero star stroke-draw on mount ---
  useLayoutEffect(() => {
    const stars = heroStarsRef.current?.querySelectorAll('path');
    if (!stars) return;
    stars.forEach((star) => {
      const length = star.getTotalLength();
      star.style.strokeDasharray = length;
      star.style.strokeDashoffset = length;
    });
    gsap.to(stars, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.12,
      delay: 0.2
    });
  }, []);

  // --- Grid reveal ---
  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true }
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  // --- Spotlight crossfade when active testimonial changes ---
  useLayoutEffect(() => {
    if (!quoteRef.current) return;
    gsap.fromTo(
      quoteRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [activeIndex]);

  const goTo = useCallback((index, { userInitiated = true } = {}) => {
    setActiveIndex(index);
    if (userInitiated && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // --- Auto-advance carousel, paused after manual interaction ---
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  // Repeat the base set enough times that the track is always wider than
  // any viewport, then duplicate that whole block once more — translating
  // exactly -50% of the doubled track lines the seam up perfectly, so the
  // loop never shows a gap or a visible jump, no matter how few real logos
  // there are.
  const marqueeLogoBase = Array.from({ length: 5 }, () => WORK_DATA).flat();
  const marqueeLogos = [...marqueeLogoBase, ...marqueeLogoBase];

  return (
    <>
      <header className="tst-hero">
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="tst-hero-container">
          <div className="tst-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>Client Stories</span>
          </div>

          <h1 className="tst-hero-title">
            Don&apos;t Just Take <span className="highlight-gold">Our Word</span> For It
          </h1>

          <p className="tst-hero-copy">
            Real projects, real outcomes — told by the people who commissioned them.
          </p>

          <div className="tst-rating-stat">
            <div ref={heroStarsRef} className="tst-rating-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="tst-rating-star">
                  <path
                    d="M10 1.5l2.47 5.63 6.03.58-4.6 4.07 1.38 5.92L10 14.77l-5.28 2.93 1.38-5.92-4.6-4.07 6.03-.58L10 1.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              ))}
            </div>
            <span className="tst-rating-value">{AVERAGE_RATING} average</span>
            <span className="tst-rating-count">from {TESTIMONIALS_DATA.length} clients</span>
          </div>
        </div>

        <div className="tst-marquee tst-logo-marquee" aria-hidden="true">
          <div className="tst-marquee-track tst-logo-marquee-track">
            {marqueeLogos.map((project, i) => (
              <div key={project.id + i} className="tst-logo-item">
                <img src={project.logo} alt="" loading="lazy" className="tst-logo-img" />
                <span className="tst-logo-name">{project.title}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section ref={spotlightRef} className="tst-spotlight-section">
        <div className="tst-spotlight-container">
          <div className="tst-spotlight-visual">
            <button
              type="button"
              className="tst-spotlight-avatar-btn"
              onClick={() => setModalTestimonial(active)}
              aria-label={`Watch ${active.name}'s story`}
            >
              <AvatarBadge
                initials={active.avatarInitials}
                color={active.avatarColor}
                size="xl"
                hasVideo={active.hasVideo}
              />
            </button>
          </div>

          <div ref={quoteRef} className="tst-spotlight-content">
            <span className="tst-quote-mark" aria-hidden="true">&ldquo;</span>
            <StarRating rating={active.rating} />
            <p className="tst-spotlight-quote">{active.quote}</p>
            <div className="tst-spotlight-byline">
              <strong>{active.name}</strong>
              <span>{active.role}, {active.company}</span>
            </div>

            {active.projectId && (
              <Link to={`/work/${active.projectId}`} className="tst-project-tag">
                <span>View the project</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </div>

        <div className="tst-selector-wrap">
          <DragScroll className="tst-selector">
            {TESTIMONIALS_DATA.map((t, index) => (
              <button
                key={t.id}
                type="button"
                className={`tst-selector-item ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => goTo(index)}
              >
                <AvatarBadge initials={t.avatarInitials} color={t.avatarColor} size="sm" />
              </button>
            ))}
          </DragScroll>
        </div>
      </section>

      <section className="tst-grid-section">
        <div className="tst-grid-header">
          <div className="tst-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>Every Story</span>
          </div>
          <h2 className="tst-grid-title">
            All <span className="highlight-gold">{TESTIMONIALS_DATA.length} Clients</span>, All Their Stories
          </h2>
        </div>

        <div ref={gridRef} className="tst-grid">
          {TESTIMONIALS_DATA.map((t, index) => (
            <article
              key={t.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="tst-card"
            >
              <button
                type="button"
                className="tst-card-play"
                onClick={() => setModalTestimonial(t)}
                aria-label={`View ${t.name}'s full story`}
              >
                <AvatarBadge initials={t.avatarInitials} color={t.avatarColor} size="md" hasVideo={t.hasVideo} />
              </button>

              <StarRating rating={t.rating} className="tst-card-rating" />
              <p className="tst-card-quote">&ldquo;{t.quote}&rdquo;</p>

              <div className="tst-card-byline">
                <strong>{t.name}</strong>
                <span>{t.role}, {t.company}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="tst-cta-section">
        <h2 className="tst-cta-title">Want to be the next story on this page?</h2>
        <MagneticWrap>
          <Link to="/contact" className="tst-cta-btn">
            <span>Start Your Project</span>
            <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="tst-cta-arrow" />
          </Link>
        </MagneticWrap>
      </section>

      {modalTestimonial && (
        <VideoModal testimonial={modalTestimonial} onClose={() => setModalTestimonial(null)} />
      )}
    </>
  );
}
