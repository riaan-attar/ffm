import React from 'react';

const HENS_CONFIG = [
  {
    id: 1,
    name: 'Barnaby',
    src: '/assets/game/hen-01.svg',
    perchType: 'branch-left',
    perchSrc: '/assets/game/perch-branch-left.svg',
    className: 'perch-branch-l'
  },
  {
    id: 2,
    name: 'Cloudy',
    src: '/assets/game/hen-02.svg',
    perchType: 'cloud',
    perchSrc: '/assets/game/cloud-perch.svg',
    className: 'perch-cloud-l'
  },
  {
    id: 3,
    name: 'Goldie',
    src: '/assets/game/hen-03.svg',
    perchType: 'cloud-top-left',
    perchSrc: '/assets/game/cloud-perch.svg',
    className: 'perch-cloud-lc'
  },
  {
    id: 4,
    name: 'Sunny',
    src: '/assets/game/hen-01.svg',
    perchType: 'cloud-top-right',
    perchSrc: '/assets/game/cloud-perch.svg',
    className: 'perch-cloud-rc'
  },
  {
    id: 5,
    name: 'Nimbus',
    src: '/assets/game/hen-04.svg',
    perchType: 'cloud',
    perchSrc: '/assets/game/cloud-perch.svg',
    className: 'perch-cloud-r'
  },
  {
    id: 6,
    name: 'Twiggy',
    src: '/assets/game/hen-05.svg',
    perchType: 'branch-right',
    perchSrc: '/assets/game/perch-branch-right.svg',
    className: 'perch-branch-r'
  }
];

// Memoized: only activeHenIndex/onHenClick should trigger a re-render, not
// the hero's 60x/sec bucket-position state updates happening in the parent.
export const HenPerchScene = React.memo(function HenPerchScene({ activeHenIndex, onHenClick }) {
  return (
    <div className="hen-scene-container" aria-label="Interactive Hen Sanctuary">
      {HENS_CONFIG.map((hen, index) => {
        const isLaying = activeHenIndex === index;

        return (
          <div
            key={hen.id}
            className={`hen-perch-spot ${hen.className}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onHenClick) onHenClick(index);
            }}
            title={`Click ${hen.name} to lay an egg!`}
          >
            {/* Perch Base (Branch or Cloud) */}
            <div className="perch-base">
              <img src={hen.perchSrc} alt="" className="perch-graphic" aria-hidden="true" />
            </div>

            {/* Interactive Hen */}
            <div
              className={`hen-interactive-wrapper hen-item ${isLaying ? 'laying' : ''}`}
              id={`hen-${hen.id}`}
            >
              <img src={hen.src} alt={hen.name} className="hen-character" />
              <span className="hen-hover-badge">CLUCK! 🥚</span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
