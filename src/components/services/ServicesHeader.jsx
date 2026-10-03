import React from 'react';
import { ServiceNavigation } from './ServiceNavigation';

export function ServicesHeader({ onPrev, onNext, canScrollPrev, canScrollNext }) {
  return (
    <header className="services-header">
      {/* Left Column: Eyebrow + Headline */}
      <div className="services-header-left">
        <div className="services-eyebrow">
          <span className="eyebrow-line" aria-hidden="true"></span>
          <span>OUR SERVICES</span>
        </div>

        <h2 className="services-headline">
          Digital Solutions<br />
          for <span className="highlight-gold">Real Growth</span>
        </h2>
      </div>

      {/* Right Column: Copy + Carousel Navigation Controls */}
      <div className="services-header-right">
        <p className="services-header-copy">
          We build modern websites, web apps and automations that help businesses scale, save time and achieve real results.
        </p>

        <ServiceNavigation
          onPrev={onPrev}
          onNext={onNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
        />
      </div>
    </header>
  );
}
