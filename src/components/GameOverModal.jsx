import React from 'react';

export function GameOverModal({ isGameOver, onRestart }) {
  return (
    <div className={`game-over-overlay ${isGameOver ? 'active' : ''}`}>
      <div className="game-over-card">
        <h2 className="game-over-title">GAME OVER</h2>
        <p className="game-over-subtitle">You missed 3 eggs! Ready to catch more?</p>
        <button onClick={onRestart} className="restart-btn">
          TRY AGAIN ↻
        </button>
      </div>
    </div>
  );
}
