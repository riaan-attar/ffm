import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_DATA } from '../../data/process';
import { PROCESS_ICONS } from './ProcessIcons';

gsap.registerPlugin(ScrollTrigger);

// Leaf sprout SVG decoration for the tree branch effect
function BranchLeafIcon({ side = 'left', className = '' }) {
  return (
    <svg
      className={`process-tree-leaf leaf-${side} ${className}`}
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`leaf-grad-${side}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9942C" />
          <stop offset="100%" stopColor="#F9D776" />
        </linearGradient>
      </defs>
      {side === 'left' ? (
        <>
          {/* Branch stem curve */}
          <path
            d="M38 24 C26 22 14 18 4 6"
            stroke="#E5AE45"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Main Leaf */}
          <path
            d="M22 17 C16 12 10 7 2 6 C4 14 10 19 20 20 Z"
            fill={`url(#leaf-grad-${side})`}
            opacity="0.9"
          />
          {/* Small Top Leaf */}
          <path
            d="M32 21 C28 16 23 12 18 11 C20 17 24 20 30 22 Z"
            fill={`url(#leaf-grad-${side})`}
            opacity="0.75"
          />
        </>
      ) : (
        <>
          {/* Branch stem curve */}
          <path
            d="M2 24 C14 22 26 18 36 6"
            stroke="#E5AE45"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Main Leaf */}
          <path
            d="M18 17 C24 12 30 7 38 6 C36 14 30 19 20 20 Z"
            fill={`url(#leaf-grad-${side})`}
            opacity="0.9"
          />
          {/* Small Top Leaf */}
          <path
            d="M8 21 C12 16 17 12 22 11 C20 17 16 20 10 22 Z"
            fill={`url(#leaf-grad-${side})`}
            opacity="0.75"
          />
        </>
      )}
    </svg>
  );
}

// Memoized: this section takes no props and must not re-render on every
// 60x/sec hero game-loop update happening elsewhere on the Home page.
export const ProcessSection = React.memo(function ProcessSection() {
  const sectionRef = useRef(null);
  const stepsContainerRef = useRef(null);
  const lineRef = useRef(null);
  const trunkProgressRef = useRef(null);
  const stepsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current.filter(Boolean);
    const stepsContainer = stepsContainerRef.current;
    if (!section || steps.length === 0) return;

    const mm = gsap.matchMedia();

    // DESKTOP ANIMATIONS (> 768px)
    mm.add('(min-width: 769px)', () => {
      if (lineRef.current) {
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
      }

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
    });

    // MOBILE TREE GROWING BRANCH ANIMATION (<= 768px)
    mm.add('(max-width: 768px)', () => {
      // 1. Central Tree Trunk Growth scrubbed with scroll
      if (trunkProgressRef.current && stepsContainer) {
        gsap.fromTo(
          trunkProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: stepsContainer,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.5
            }
          }
        );
      }

      // 2. Individual step branch bloom & card growth
      steps.forEach((stepEl, idx) => {
        const icon = stepEl.querySelector('.process-step-icon');
        const leaves = stepEl.querySelectorAll('.process-tree-leaf');
        const content = stepEl.querySelector('.process-step-card');
        const node = stepEl.querySelector('.process-tree-node-dot');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stepEl,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        });

        tl.fromTo(
          node,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }
        )
        .fromTo(
          leaves,
          { scale: 0, opacity: 0, rotation: idx % 2 === 0 ? -25 : 25 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.08 },
          '-=0.2'
        )
        .fromTo(
          icon,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
          '-=0.3'
        )
        .fromTo(
          content,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="process-section">
      <div className="process-container">
        <header className="process-header">
          <div className="process-header-left">
            <div className="process-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>OUR PROCESS</span>
              <span className="eyebrow-line eyebrow-line-right" aria-hidden="true"></span>
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

        <div ref={stepsContainerRef} className="process-steps">
          {/* Desktop horizontal connection line */}
          <div ref={lineRef} className="process-steps-line" aria-hidden="true"></div>

          {/* Mobile vertical tree trunk container */}
          <div className="process-tree-trunk" aria-hidden="true">
            <div className="process-trunk-track"></div>
            <div ref={trunkProgressRef} className="process-trunk-progress"></div>
            <div className="process-tree-root-sprout" title="Project Seed">🌱</div>
            <div className="process-tree-flourish-node" title="Launch Bloom">✨</div>
          </div>

          {PROCESS_DATA.map((step, index) => {
            const Icon = PROCESS_ICONS[step.icon];
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.number}
                ref={el => (stepsRef.current[index] = el)}
                className={`process-step ${isEven ? 'step-branch-left' : 'step-branch-right'}`}
              >
                {/* Mobile Tree Branch sprout nodes */}
                <div className="process-tree-sprout-wrapper" aria-hidden="true">
                  <div className="process-tree-node-dot"></div>
                  <BranchLeafIcon side="left" className="branch-leaf-l" />
                  <BranchLeafIcon side="right" className="branch-leaf-r" />
                </div>

                <div className="process-step-icon">
                  {Icon && <Icon className="process-step-icon-svg" />}
                  <span className="process-step-badge">{step.number}</span>
                </div>

                <div className="process-step-card">
                  <span className="process-step-number">{step.number}</span>
                  <h3 className="process-step-title">{step.title}</h3>
                  <p className="process-step-description">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

