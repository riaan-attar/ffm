import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ServiceCard } from './ServiceCard';

export function ServicesCarousel({ services, carouselRef, onScrollStateChange }) {
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const checkScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const canPrev = scrollLeft > 10;
    const canNext = scrollLeft < scrollWidth - clientWidth - 10;
    if (onScrollStateChange) {
      onScrollStateChange({ canPrev, canNext });
    }
  }, [carouselRef, onScrollStateChange]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [carouselRef, checkScrollState]);

  // Mouse drag-to-scroll functionality
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = 'grabbing';
    carouselRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (!carouselRef.current) return;
    isDraggingRef.current = false;
    carouselRef.current.style.cursor = 'grab';
    carouselRef.current.style.removeProperty('user-select');
  };

  return (
    <div className="services-carousel-wrapper">
      <div
        ref={carouselRef}
        className="services-carousel-track"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {services.map((service, index) => (
          <ServiceCard
            key={service.id || index}
            service={service}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
