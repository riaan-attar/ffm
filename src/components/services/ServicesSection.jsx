import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES_DATA } from '../../data/services';
import { ServicesHeader } from './ServicesHeader';
import { ServiceCard } from './ServiceCard';

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardsTrackRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) return;

    const ctx = gsap.context(() => {
      const totalCards = cards.length;

      // Setup initial positions & z-indexes: only the first card is in view,
      // the rest wait fully off-screen to the right (one card at a time).
      // xPercent (relative to the card's own width) is used instead of a
      // measured pixel width so this stays correct regardless of viewport
      // size, orientation changes, or layout timing on mobile.
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          xPercent: i === 0 ? 0 : 100,
          scale: 1,
          opacity: 1,
          force3D: true
        });
      });

      // Master Timeline for ScrollTrigger
      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalCards * 650}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              totalCards - 1,
              Math.floor(self.progress * totalCards)
            );
            setActiveCardIndex(index);
          }
        }
      });

      timelineRef.current = tl;

      // Animate each subsequent card sliding in fully over the previous one,
      // so only one card is ever visible at a time
      for (let i = 1; i < totalCards; i++) {
        const prevCard = cards[i - 1];
        const currentCard = cards[i];

        // Slide the current card fully in from the right, covering the previous one
        tl.to(currentCard, {
          xPercent: 0,
          duration: 1
        }, `card-${i}`);

        // Slightly scale down and dim the previous card as it gets covered.
        // Opacity is used instead of a CSS filter so this stays smooth/cheap
        // to render on mobile GPUs.
        tl.to(prevCard, {
          scale: 0.94,
          y: -8,
          opacity: 0.6,
          duration: 0.8
        }, `card-${i}-stack`);
      }

      // Layout can shift once hero/game assets and card images finish loading,
      // so recalc the pin distances instead of leaving the first (wrong) measurement.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh);
      const imgs = section.querySelectorAll('img');
      imgs.forEach(img => {
        if (!img.complete) img.addEventListener('load', refresh, { once: true });
      });

      return () => window.removeEventListener('load', refresh);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePrev = useCallback(() => {
    if (timelineRef.current && timelineRef.current.scrollTrigger) {
      const st = timelineRef.current.scrollTrigger;
      const step = 1 / (SERVICES_DATA.length - 1);
      const targetProgress = Math.max(0, st.progress - step);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  const handleNext = useCallback(() => {
    if (timelineRef.current && timelineRef.current.scrollTrigger) {
      const st = timelineRef.current.scrollTrigger;
      const step = 1 / (SERVICES_DATA.length - 1);
      const targetProgress = Math.min(1, st.progress + step);
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="services" ref={sectionRef} className="services-section">
      <div ref={containerRef} className="services-container">
        {/* Left Column: Vertical Marquee + Vertical Rule */}
        <aside className="services-vertical-marquee-sidebar" aria-label="Services Section Indicator">
          <div className="vertical-marquee-wrapper">
            <div className="vertical-marquee-track">
              <div className="vertical-marquee-content">
                <span className="marquee-num">01</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-word">Services</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-num">01</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-word">Services</span>
                <span className="marquee-dot">▪</span>
              </div>
              <div className="vertical-marquee-content" aria-hidden="true">
                <span className="marquee-num">01</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-word">Services</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-num">01</span>
                <span className="marquee-dot">▪</span>
                <span className="marquee-word">Services</span>
                <span className="marquee-dot">▪</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="services-main-content">
          <ServicesHeader
            onPrev={handlePrev}
            onNext={handleNext}
            canScrollPrev={activeCardIndex > 0}
            canScrollNext={activeCardIndex < SERVICES_DATA.length - 1}
          />

          {/* GSAP Stacking Parallax Card Stage */}
          <div className="services-parallax-stage">
            <div ref={cardsTrackRef} className="services-stack-track">
              {SERVICES_DATA.map((service, index) => (
                <div
                  key={service.id || index}
                  ref={el => cardsRef.current[index] = el}
                  className="services-stack-card-wrapper"
                >
                  <ServiceCard
                    service={service}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
