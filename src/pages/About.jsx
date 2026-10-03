import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { ABOUT_VALUE_ICONS } from '../components/about/AboutIcons';
import { SplitText } from '../components/motion/SplitText';
import { CursorSpotlight } from '../components/motion/CursorSpotlight';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import { DragScroll } from '../components/motion/DragScroll';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

const VALUES_DATA = [
  {
    icon: 'fast',
    title: 'Fast',
    description: 'Launch in weeks, not quarters. We work in tight sprints with visible progress at every step.'
  },
  {
    icon: 'transparent',
    title: 'Transparent',
    description: 'No black boxes. You get straight answers, clear timelines, and direct access to the people building.'
  },
  {
    icon: 'results',
    title: 'Results-Driven',
    description: 'Every decision is measured against real outcomes, leads, conversions, and revenue, not vanity metrics.'
  },
  {
    icon: 'modern',
    title: 'Modern',
    description: 'We build with the current generation of tools, from modern frameworks to AI-assisted automation.'
  }
];

const PRINCIPLES_DATA = [
  {
    title: 'Clarity Over Complexity',
    description: 'We strip projects down to what actually moves the needle, then build that first.'
  },
  {
    title: 'Automation First',
    description: 'If a task can be automated, we automate it, freeing your team to focus on the work only humans can do.'
  },
  {
    title: 'Partnership, Not Projects',
    description: 'We stick around after launch, iterating alongside you as your business grows.'
  }
];

export default function About() {
  const pageRef = useRef(null);
  const storyLeftRef = useRef(null);
  const storyRightRef = useRef(null);
  const quoteSectionRef = useRef(null);
  const valuesSectionRef = useRef(null);
  const valueCardsRef = useRef([]);
  const principleCardsRef = useRef([]);
  const principleNumberRefs = useRef([]);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // Story section: heading slides from left, copy fades up
      gsap.fromTo(
        storyLeftRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: storyLeftRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      gsap.fromTo(
        storyRightRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: storyRightRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      // Pull-quote: the giant quote mark drifts in from a rotated, scaled-down
      // state rather than a plain fade, underlining that this section breaks
      // the page's usual full-width-band rhythm.
      gsap.fromTo(
        quoteSectionRef.current.querySelector('.about-quote-mark'),
        { opacity: 0, scale: 0.6, rotate: -8 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: quoteSectionRef.current,
            start: 'top 75%',
            once: true
          }
        }
      );

      // Values grid: staggered reveal (the hover flip + gradient shift are
      // handled entirely in CSS, see about.css)
      const valueCards = valueCardsRef.current.filter(Boolean);
      if (valueCards.length) {
        gsap.fromTo(
          valueCards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: valuesSectionRef.current,
              start: 'top 75%',
              once: true
            }
          }
        );
      }

      // Principles rail: cards settle in, then each ghost index number counts
      // up from 0 independently once it crosses the viewport threshold.
      const principleCards = principleCardsRef.current.filter(Boolean);
      if (principleCards.length) {
        gsap.fromTo(
          principleCards,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: principleCards[0],
              start: 'top 85%',
              once: true
            }
          }
        );

        principleCards.forEach((card, index) => {
          const numberEl = principleNumberRefs.current[index];
          if (!numberEl) return;
          const counter = { value: 0 };
          gsap.to(counter, {
            value: index + 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true
            },
            onUpdate: () => {
              numberEl.textContent = String(Math.round(counter.value)).padStart(2, '0');
            }
          });
        });
      }

      // Closing CTA banner
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            once: true
          }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header className="about-hero">
        <CursorSpotlight />
        <div className="page-hero-nav-row">
          <Navbar />
        </div>
        <div className="about-hero-container">
          <div className="about-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>About Us</span>
          </div>
          <SplitText
            as="h1"
            className="about-hero-title"
            text="We Turn Ideas Into Growth"
          />
          <p className="about-hero-description">
            FFM is a modern web development and automation agency. We design, build, and ship
            the websites and systems that help ambitious brands grow faster, with less busywork.
          </p>
        </div>
      </header>

      <main ref={pageRef}>
        {/* STORY / MISSION (cream) */}
        <section className="about-story-section">
          <div className="about-story-container">
            <div ref={storyLeftRef} className="about-story-left">
              <div className="about-eyebrow">
                <span className="eyebrow-line" aria-hidden="true"></span>
                <span>OUR MISSION</span>
              </div>
              <h2 className="about-story-headline">
                Built For Founders<br />
                Who <span className="highlight-gold">Move Fast</span>
              </h2>
            </div>

            <div ref={storyRightRef} className="about-story-right">
              <p>
                FFM started with a simple frustration: most agencies either move fast and cut
                corners, or move carefully and take forever. We didn&apos;t think it had to be
                one or the other.
              </p>
              <p>
                Today we work with ambitious brands to design, build, and automate the systems
                behind their growth, from marketing sites that convert to internal tools that
                save hours every week. Every project pairs senior design and engineering with a
                bias toward shipping.
              </p>
              <p>
                We measure ourselves the same way we measure your results: not by hours billed,
                but by what actually moved the needle.
              </p>
            </div>
          </div>
        </section>

        {/* PULL-QUOTE (navy, asymmetric / off-grid) */}
        <section ref={quoteSectionRef} className="about-quote-section">
          <span className="about-quote-mark" aria-hidden="true">&ldquo;</span>
          <div className="about-quote-container">
            <SplitText
              as="p"
              scroll
              className="about-quote-text"
              text="We'd rather ship the useful 80% in two weeks than debate the perfect 100% for two months."
            />
            <span className="about-quote-attribution">
              <span className="about-quote-line" aria-hidden="true"></span>
              FFM
            </span>
          </div>
        </section>

        {/* VALUES GRID (dark navy) */}
        <section ref={valuesSectionRef} className="about-values-section">
          <div className="about-values-container">
            <header className="about-values-header">
              <div className="about-eyebrow">
                <span className="eyebrow-line" aria-hidden="true"></span>
                <span>WHY WORK WITH US</span>
              </div>
              <h2 className="about-values-headline">
                What You Get<br />
                When You <span className="highlight-gold">Hire FFM</span>
              </h2>
            </header>

            <div className="about-values-grid">
              {VALUES_DATA.map((value, index) => {
                const Icon = ABOUT_VALUE_ICONS[value.icon];
                return (
                  <div
                    key={value.title}
                    ref={el => (valueCardsRef.current[index] = el)}
                    className="about-value-card"
                  >
                    <div className="about-value-card-inner">
                      <div className="about-value-icon-flip">
                        <div className="about-value-icon-rotator">
                          <div className="about-value-icon-face about-value-icon-front">
                            {Icon && <Icon className="about-value-icon-svg" />}
                          </div>
                          <div className="about-value-icon-face about-value-icon-back">
                            <span>{String(index + 1).padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="about-value-title">{value.title}</h3>
                      <p className="about-value-description">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRINCIPLES / HOW WE THINK (navy, drag-scrollable rail) */}
        <section className="about-principles-section">
          <div className="about-principles-container">
            <header className="about-principles-header">
              <div className="about-eyebrow">
                <span className="eyebrow-line" aria-hidden="true"></span>
                <span>HOW WE THINK</span>
              </div>
              <h2 className="about-principles-headline">
                The Principles Behind<br />
                <span className="highlight-gold">Every Project</span>
              </h2>
              <p className="about-principles-copy">
                We&apos;re a small, senior team, not a roster of account managers. These are the
                rules we hold ourselves to on every engagement. Drag sideways to browse.
              </p>
            </header>

            <DragScroll className="about-principles-rail">
              {PRINCIPLES_DATA.map((principle, index) => (
                <div
                  key={principle.title}
                  ref={el => (principleCardsRef.current[index] = el)}
                  className="about-principle-card"
                >
                  <span
                    ref={el => (principleNumberRefs.current[index] = el)}
                    className="about-principle-number"
                  >
                    00
                  </span>
                  <h3 className="about-principle-title">{principle.title}</h3>
                  <p className="about-principle-description">{principle.description}</p>
                </div>
              ))}
            </DragScroll>
          </div>
        </section>

        {/* CLOSING CTA (cream) */}
        <section className="about-cta-section">
          <div className="about-cta-container">
            <div ref={ctaRef} className="about-cta-card">
              <SplitText
                as="h2"
                scroll
                className="about-cta-headline"
                text="Ready To Build Something That Works As Hard As You Do?"
              />
              <p className="about-cta-copy">
                Tell us about your project and we&apos;ll get back to you within one business day.
              </p>
              <MagneticWrap>
                <Link to="/contact" className="about-cta-btn">
                  <span>Start Your Project</span>
                  <img
                    src="/assets/services/service-arrow.svg"
                    alt=""
                    className="about-cta-arrow"
                    aria-hidden="true"
                  />
                </Link>
              </MagneticWrap>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
