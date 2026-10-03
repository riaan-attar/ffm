import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES_DATA } from '../../data/services';
import { ServicesHeader } from './ServicesHeader';
import { ServiceCard } from './ServiceCard';

gsap.registerPlugin(ScrollTrigger);

// Memoized: this section takes no props and must not re-render on every
// 60x/sec hero game-loop update happening elsewhere on the Home page.
export const ServicesSection = React.memo(function ServicesSection() {
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

      // Card 0 in place, cards 1..N wait off-screen to the right
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          xPercent: i === 0 ? 0 : 100,
          scale: 1,
          opacity: 1,
          y: 0,
          force3D: true
        });
      });

      const isMobile = window.innerWidth <= 768;
      const scrollPerCard = isMobile ? 500 : 650;

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
            setActiveCardIndex(index);
          }
        }
      });

      timelineRef.current = tl;

      // Animate each subsequent card sliding in over the previous card
      for (let i = 1; i < totalCards; i++) {
        const prevCard = cards[i - 1];
        const currentCard = cards[i];

        tl.to(currentCard, {
          xPercent: 0,
          duration: 1
        }, `card-${i}`);

        tl.to(prevCard, {
          scale: 0.94,
          y: -8,
          opacity: 0.6,
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

  const goToCard = useCallback((index) => {
    const clampedIndex = Math.max(0, Math.min(SERVICES_DATA.length - 1, index));
    if (timelineRef.current && timelineRef.current.scrollTrigger) {
      const st = timelineRef.current.scrollTrigger;
      const step = 1 / (SERVICES_DATA.length - 1);
      const targetProgress = clampedIndex * step;
      const targetScroll = st.start + targetProgress * (st.end - st.start) + 2;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setActiveCardIndex(clampedIndex);
    }
  }, []);

  const handlePrev = useCallback(() => {
    goToCard(activeCardIndex - 1);
  }, [activeCardIndex, goToCard]);

  const handleNext = useCallback(() => {
    goToCard(activeCardIndex + 1);
  }, [activeCardIndex, goToCard]);

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
                  ref={el => (cardsRef.current[index] = el)}
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
});
