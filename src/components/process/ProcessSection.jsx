import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_DATA } from '../../data/process';
import { PROCESS_ICONS } from './ProcessIcons';

gsap.registerPlugin(ScrollTrigger);

// Memoized: this section takes no props and must not re-render on every
// 60x/sec hero game-loop update happening elsewhere on the Home page.
export const ProcessSection = React.memo(function ProcessSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const stepsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current.filter(Boolean);
    if (!section || steps.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true
          }
        }
      );

      gsap.fromTo(
        steps,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="process-section">
      <div className="process-container">
        <header className="process-header">
          <div className="process-header-left">
            <div className="process-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>OUR PROCESS</span>
            </div>

            <h2 className="process-headline">
              From Idea<br />
              to <span className="highlight-gold">Real Results</span>
            </h2>
          </div>

          <div className="process-header-right">
            <p className="process-header-copy">
              A simple, transparent process to turn your vision into a high-performing digital product.
            </p>

            <Link to="/contact" className="process-cta-btn">
              <span>Start Your Project</span>
              <img
                src="/assets/services/service-arrow.svg"
                alt=""
                className="process-cta-arrow"
                aria-hidden="true"
              />
            </Link>
          </div>
        </header>

        <div className="process-steps">
          <div ref={lineRef} className="process-steps-line" aria-hidden="true"></div>

          {PROCESS_DATA.map((step, index) => {
            const Icon = PROCESS_ICONS[step.icon];
            return (
              <div
                key={step.number}
                ref={el => (stepsRef.current[index] = el)}
                className="process-step"
              >
                <div className="process-step-icon">
                  {Icon && <Icon className="process-step-icon-svg" />}
                </div>
                <span className="process-step-number">{step.number}</span>
                <h3 className="process-step-title">{step.title}</h3>
                <p className="process-step-description">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
