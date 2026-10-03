import React from 'react';

export function GameCanvas({ activeEggs, effects }) {
  return (
    <div id="game-play-area" className="game-play-area">
      {/* Falling Item (White Egg, Golden Egg, or Bomb) */}
      {activeEggs.map(egg => {
        let imgSrc = '/assets/game/egg.svg';
        let itemClass = 'falling-egg';
        let altText = 'Falling Egg';

        if (egg.isBomb) {
          imgSrc = '/assets/game/bomb.svg';
          itemClass = 'falling-egg falling-bomb';
          altText = 'Falling Bomb Hazard';
        } else if (egg.isGolden) {
          imgSrc = '/assets/game/egg-golden.svg';
          itemClass = 'falling-egg falling-golden';
          altText = 'Falling Golden Egg';
        }

        return (
          <div
            key={egg.id}
            className={itemClass}
            style={{
              transform: `translate(${egg.x}px, ${egg.y}px)`
            }}
          >
            <img src={imgSrc} alt={altText} />
          </div>
        );
      })}

      {/* Dynamic Particle & Score / Danger Effects */}
      {effects.map(fx => {
        if (fx.type === 'burst') {
          return (
            <img
              key={fx.id}
              src={fx.src}
              alt=""
              className="catch-burst-effect"
              style={{ left: `${fx.x}px`, top: `${fx.y}px` }}
            />
          );
        }
        if (fx.type === 'pop') {
          return (
            <div
              key={fx.id}
              className={`floating-score-pop ${fx.isDanger ? 'score-pop-danger' : ''}`}
              style={{ left: `${fx.x}px`, top: `${fx.y}px` }}
            >
              {fx.text}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
