import React from 'react';

export function InstructionsFooter({ score = 0, lives = 3 }) {
  const formattedScore = String(score).padStart(3, '0');

  return (
    <footer className="hero-footer-instructions">
      {/* Left Bottom Corner: Lives HUD & Guidance */}
      <div className="bottom-corner-hud bottom-left-hud">
        <div className="hud-badge-card lives-badge-card">
          <span className="hud-label">LIVES</span>
          <div className="bottom-lives-box" aria-label="Player Lives">
            {[0, 1, 2].map(index => {
              const isFull = index < lives;
              return (
                <div key={index} className={`heart-icon ${!isFull ? 'lost' : ''}`}>
                  <img
                    src={isFull ? '/assets/ui/heart-full.svg' : '/assets/ui/heart-empty.svg'}
                    alt={`Heart ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="instruction-subtext">
          <img src="/assets/ui/mouse-icon.svg" alt="" width="14" height="14" />
          <span>MOVE CURSOR TO CATCH</span>
        </div>
      </div>

      {/* Right Bottom Corner: Score HUD & Hazard Info */}
      <div className="bottom-corner-hud bottom-right-hud">
        <div className="hud-badge-card score-badge-card">
          <span className="hud-label">SCORE</span>
          <span className="hud-score-value">{formattedScore}</span>
        </div>
        <div className="instruction-subtext">
          <span>AVOID BOMBS · CATCH EGGS</span>
        </div>
      </div>
    </footer>
  );
}
