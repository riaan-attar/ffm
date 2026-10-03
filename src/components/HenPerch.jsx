import React from 'react';

const HENS = [
  '/assets/game/hen-01.svg',
  '/assets/game/hen-02.svg',
  '/assets/game/hen-03.svg',
  '/assets/game/hen-04.svg',
  '/assets/game/hen-05.svg'
];

export function HenPerch({ activeHenIndex }) {
  return (
    <div class="hen-perch-container">
      {HENS.map((henSrc, index) => (
        <div
          key={index}
          className={`hen-item ${activeHenIndex === index ? 'laying' : ''}`}
          id={`hen-${index + 1}`}
        >
          <img src={henSrc} alt={`Hen ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}
