import React, { useRef, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORK_DATA } from '../data/work';
import { Navbar } from '../components/Navbar';
import { RevealImage } from '../components/motion/RevealImage';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import '../styles/case-study-detail.css';

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const project = WORK_DATA.find((p) => p.id === slug);

  const rootRef = useRef(null);
  const sectionRefs = useRef([]);
  const stackRef = useRef([]);
  const resultRowRefs = useRef([]);
  const resultCheckRefs = useRef([]);
  const titleBarRef = useRef(null);
  const dividerRef = useRef(null);
  const weeksValueRef = useRef(null);

  sectionRefs.current = [];
  stackRef.current = [];
  resultRowRefs.current = [];
  resultCheckRefs.current = [];

  const registerSection = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const registerStackPill = (el) => {
    if (el && !stackRef.current.includes(el)) {
      stackRef.current.push(el);
    }
  };

  const registerResultRow = (el) => {
    if (el && !resultRowRefs.current.includes(el)) {
      resultRowRefs.current.push(el);
    }
  };

  const registerResultCheck = (el) => {
    if (el && !resultCheckRefs.current.includes(el)) {
      resultCheckRefs.current.push(el);
    }
  };

  // The project timeline ("14 weeks") is real data already in work.js — we
  // count up to that number instead of inventing a metric that isn't there.
  const weeksMatch = project ? project.timeline.match(/\d+/) : null;
  const weeksTarget = weeksMatch ? parseInt(weeksMatch[0], 10) : null;

  useLayoutEffect(() => {
    if (!project) return;
    const root = rootRef.current;
    if (!root) return;

    const sections = sectionRefs.current.filter(Boolean);
    const pills = stackRef.current.filter(Boolean);
    const rows = resultRowRefs.current.filter(Boolean);
    const checks = resultCheckRefs.current.filter(Boolean);

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
              start: 'top 80%',
              once: true
            }
          }
        );
      });

      // Hero headline "declassifies" — a solid gold bar wipes off the
      // title on load, instead of the title simply fading in.
      if (titleBarRef.current) {
        gsap.to(titleBarRef.current, {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          delay: 0.2,
          transformOrigin: 'right center'
        });
      }

      if (pills.length) {
        gsap.fromTo(
          pills,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: pills[0],
              start: 'top 90%',
              once: true
            }
          }
        );
      }

      // Results read as a ledger: rows slide in from the left...
      if (rows.length) {
        gsap.fromTo(
          rows,
          { x: -36, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.13,
            scrollTrigger: {
              trigger: rows[0],
              start: 'top 85%',
              once: true
            }
          }
        );
      }

      // ...and each checkmark draws itself in with a stroke animation
      // instead of just appearing.
      checks.forEach((pathEl, i) => {
        if (!pathEl || typeof pathEl.getTotalLength !== 'function') return;
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2 + i * 0.13,
          scrollTrigger: {
            trigger: rows[0] || pathEl,
            start: 'top 85%',
            once: true
          }
        });
      });

      // The project timeline counts up from zero once the meta strip
      // scrolls into view.
      if (weeksValueRef.current && weeksTarget) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: weeksTarget,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: weeksValueRef.current,
            start: 'top 88%',
            once: true
          },
          onUpdate: () => {
            if (weeksValueRef.current) {
              weeksValueRef.current.textContent = Math.round(counter.val);
            }
          }
        });
      }

      // A thin gold divider draws itself between challenge & solution.
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.9,
            ease: 'power2.inOut',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: dividerRef.current,
              start: 'top 75%',
              once: true
            }
          }
        );
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const imgs = root.querySelectorAll('img');
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener('load', refresh, { once: true });
      });

      return () => {
        window.removeEventListener('load', refresh);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [slug, weeksTarget]);

  if (!project) {
    return (
      <div className="csd-page">
        <header className="csd-hero csd-hero-notfound">
          <div className="page-hero-nav-row">
            <Navbar />
          </div>
          <div className="csd-hero-container">
            <div className="csd-hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>Case Study</span>
            </div>
            <h1 className="csd-hero-title csd-hero-title-plain">Case study not found</h1>
            <p className="csd-hero-copy">
              We couldn&apos;t find the project you&apos;re looking for. It may have moved or no longer exists.
            </p>
          </div>
        </header>
        <div className="csd-notfound">
          <Link to="/" className="csd-notfound-link">
            <span>Return Home</span>
            <img
              src="/assets/services/service-arrow.svg"
              alt=""
              className="csd-notfound-arrow"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    );
  }

  const otherProjects = WORK_DATA.filter((p) => p.id !== project.id);

  return (
    <div ref={rootRef} key={slug} className="csd-page">
      {/* Bespoke hero — case-file framing: a stamped project number, a
          headline that "declassifies" itself, and the preview mockup
          wiping into view instead of fading, all in one dark block. */}
      <header className="csd-hero">
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="csd-hero-container">
          <Link to="/work" className="csd-hero-back">
            <span aria-hidden="true">&larr;</span> Back to Work
          </Link>

          <div className="csd-hero-top">
            <div className="csd-hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>Case Study</span>
            </div>
            <span className="csd-hero-stamp" aria-hidden="true">{project.number}</span>
          </div>

          <div className="csd-hero-title-wrap">
            <h1 className="csd-hero-title">{project.title}</h1>
            <span ref={titleBarRef} className="csd-hero-title-bar" aria-hidden="true"></span>
          </div>

          <p className="csd-hero-copy">{project.description}</p>
        </div>

        <div className="csd-hero-visual-container">
          <div className="csd-preview-frame">
            <div className="csd-preview-chrome">
              <span className="csd-chrome-dot" aria-hidden="true"></span>
              <span className="csd-chrome-dot" aria-hidden="true"></span>
              <span className="csd-chrome-dot" aria-hidden="true"></span>
            </div>
            <div className="csd-preview-visual">
              <RevealImage
                src={project.image}
                alt={`${project.title} concept preview`}
                direction="left"
                className="csd-preview-reveal"
              />
            </div>
          </div>
          <p className="csd-preview-caption">
            Concept visualization &mdash; illustrative mockup, not a live product screenshot.
          </p>
        </div>
      </header>

      {/* --- META STRIP --- */}
      <section ref={registerSection} className="csd-meta-section">
        <div className="csd-meta-container">
          <div className="csd-meta-item">
            <span className="csd-meta-label">Client</span>
            <span className="csd-meta-value">{project.client}</span>
          </div>
          <div className="csd-meta-divider" aria-hidden="true"></div>
          <div className="csd-meta-item">
            <span className="csd-meta-label">Role</span>
            <span className="csd-meta-value">{project.role}</span>
          </div>
          <div className="csd-meta-divider" aria-hidden="true"></div>
          <div className="csd-meta-item">
            <span className="csd-meta-label">Timeline</span>
            {weeksTarget ? (
              <span className="csd-meta-stat">
                <span ref={weeksValueRef} className="csd-meta-stat-number">0</span>
                <span className="csd-meta-stat-unit">weeks</span>
              </span>
            ) : (
              <span className="csd-meta-value">{project.timeline}</span>
            )}
          </div>
          <div className="csd-meta-divider" aria-hidden="true"></div>
          <div className="csd-meta-item">
            <span className="csd-meta-label">Focus</span>
            <div className="csd-meta-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="csd-meta-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CHALLENGE / SOLUTION --- */}
      <section ref={registerSection} className="csd-cs-section">
        <div className="csd-cs-container">
          <div className="csd-cs-col">
            <span className="csd-cs-kicker">The Challenge</span>
            <p className="csd-cs-copy">{project.challenge}</p>
          </div>
          <div ref={dividerRef} className="csd-cs-divider" aria-hidden="true"></div>
          <div className="csd-cs-col">
            <span className="csd-cs-kicker csd-cs-kicker-gold">The Solution</span>
            <p className="csd-cs-copy">{project.solution}</p>
          </div>
        </div>
      </section>

      {/* --- RESULTS LEDGER --- */}
      <section ref={registerSection} className="csd-results-section">
        <div className="csd-results-container">
          <div className="csd-section-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>DESIGN OUTCOMES</span>
          </div>
          <h2 className="csd-results-headline">
            What This Concept Was <span className="csd-highlight-gold">Built to Achieve</span>
          </h2>
          <div className="csd-results-ledger">
            {project.results.map((result, i) => (
              <div key={i} ref={registerResultRow} className="csd-result-row">
                <svg viewBox="0 0 24 24" fill="none" className="csd-result-check-svg" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
                  <path
                    ref={registerResultCheck}
                    d="M8 12.5l2.6 2.6L16 9.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="csd-result-text">{result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section ref={registerSection} className="csd-stack-section">
        <div className="csd-stack-container">
          <span className="csd-stack-label">Tech Stack</span>
          <div className="csd-stack-pills">
            {project.techStack.map((tech) => (
              <span key={tech} ref={registerStackPill} className="csd-stack-pill">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section ref={registerSection} className="csd-cta-section">
        <div className="csd-cta-container">
          <h2 className="csd-cta-headline">
            Have a similar idea <span className="csd-highlight-gold">in mind?</span>
          </h2>
          <p className="csd-cta-copy">
            Let's talk about what we could build for you.
          </p>
          <MagneticWrap>
            <Link to="/contact" className="csd-cta-btn">
              <span>Start a Project</span>
              <img
                src="/assets/services/service-arrow.svg"
                alt=""
                className="csd-cta-arrow"
                aria-hidden="true"
              />
            </Link>
          </MagneticWrap>
        </div>
      </section>

      {/* --- MORE CASE STUDIES --- */}
      <section className="csd-more-section">
        <div className="csd-more-container">
          <span className="csd-more-label">More Case Studies</span>
          <div className="csd-more-links">
            {otherProjects.map((p) => (
              <Link key={p.id} to={`/work/${p.id}`} className="csd-more-pill">
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
