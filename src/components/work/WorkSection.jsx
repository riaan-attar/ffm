import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORK_DATA } from '../../data/work';
import { WorkItem } from './WorkItem';

gsap.registerPlugin(ScrollTrigger);

export function WorkSection() {
  const sectionRef = useRef(null);
  const stackTrackRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const totalCards = cards.length;

      // Only the first card sits in place; the rest wait fully off-screen below the stage
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          yPercent: i === 0 ? 0 : 100,
          scale: 1,
          opacity: 1,
          force3D: true
        });
      });

      const isMobile = window.innerWidth <= 768;
      const scrollPerCard = isMobile ? 550 : 750;

      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalCards * scrollPerCard}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              totalCards - 1,
              Math.floor(self.progress * totalCards)
            );
            setActiveIndex(index);
          }
        }
      });

      timelineRef.current = tl;

      // Each subsequent card climbs up from below and fully covers the one before it
      for (let i = 1; i < totalCards; i++) {
        const prevCard = cards[i - 1];
        const currentCard = cards[i];

        tl.to(currentCard, {
          yPercent: 0,
          duration: 1
        }, `card-${i}`);

        tl.to(prevCard, {
          scale: 0.95,
          opacity: 0.5,
          duration: 0.8
        }, `card-${i}-stack`);
      }

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      window.addEventListener('resize', refresh);

      const imgs = section.querySelectorAll('img');
      imgs.forEach(img => {
        if (!img.complete) img.addEventListener('load', refresh, { once: true });
      });

      return () => {
        window.removeEventListener('load', refresh);
        window.removeEventListener('resize', refresh);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const goTo = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(WORK_DATA.length - 1, index));
    if (timelineRef.current && timelineRef.current.scrollTrigger) {
      const st = timelineRef.current.scrollTrigger;
      const step = 1 / (WORK_DATA.length - 1);
      const targetProgress = Math.min(1, Math.max(0, clampedIndex * step));
      const targetScroll = st.start + targetProgress * (st.end - st.start) + 2;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setActiveIndex(clampedIndex);
    }
  }, []);

  return (
    <section id="work" ref={sectionRef} className="work-section">
      <div className="work-container">
        <header className="work-header">
          <div className="work-header-left">
            <div className="work-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>FEATURED WORK</span>
            </div>

            <h2 className="work-headline">
              Projects<br />
              That <span className="highlight-gold">Create Impact</span>
            </h2>
          </div>

          <div className="work-header-right">
            <p className="work-header-copy">
              From modern websites to complex web applications, we build solutions that deliver real results.
            </p>

            <a href="#contact" className="work-view-all-btn">
              <span>View All Work</span>
              <img
                src="/assets/services/service-arrow.svg"
                alt=""
                className="work-view-all-arrow"
                aria-hidden="true"
              />
            </a>
          </div>
        </header>

        <div className="work-stage">
          <div ref={stackTrackRef} className="work-stack-track">
            {WORK_DATA.map((project, index) => (
              <div
                key={project.id}
                ref={el => (cardsRef.current[index] = el)}
                className="work-stack-card-wrapper"
              >
                <WorkItem
                  project={project}
                  reverse={index % 2 === 1}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="work-progress-dots" role="tablist" aria-label="Case studies">
          {WORK_DATA.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Go to ${project.title}`}
              className={`work-progress-dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
