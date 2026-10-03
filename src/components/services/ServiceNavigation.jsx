import React from 'react';

export function ServiceNavigation({ onPrev, onNext, canScrollPrev, canScrollNext }) {
  return (
    <div className="services-nav-controls" aria-label="Services carousel controls">
      <button
        type="button"
        className={`services-nav-btn services-prev-btn ${!canScrollPrev ? 'disabled' : ''}`}
        onClick={onPrev}
        disabled={!canScrollPrev}
        aria-label="Previous services"
      >
        <img src="/assets/services/services-prev.svg" alt="" aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`services-nav-btn services-next-btn ${!canScrollNext ? 'disabled' : ''}`}
        onClick={onNext}
        disabled={!canScrollNext}
        aria-label="Next services"
      >
        <img src="/assets/services/services-next.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
