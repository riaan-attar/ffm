import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS_DATA } from '../../data/stats';

gsap.registerPlugin(ScrollTrigger);

function StatItem({ stat, valueRef }) {
  return (
    <div className="stats-item">
      <div className="stats-value">
        <span ref={valueRef}>0</span>{stat.suffix}
      </div>
      <div className="stats-label">{stat.label}</div>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = useRef(null);
  const valueRefs = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const counters = STATS_DATA.map((stat, i) => ({ target: valueRefs.current[i], value: stat.value }));

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          counters.forEach(({ target, value }) => {
            if (!target) return;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: value,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                target.textContent = Math.round(counter.val).toString();
              }
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="stats-section">
      <div className="stats-container">
        {STATS_DATA.map((stat, index) => (
          <StatItem
            key={stat.label}
            stat={stat}
            valueRef={el => (valueRefs.current[index] = el)}
          />
        ))}
      </div>
    </section>
  );
}
