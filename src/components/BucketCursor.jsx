import React, { useEffect, useState, useRef } from 'react';

export function BucketCursor({ bucketPos, isSplashingGold }) {
  const [stardust, setStardust] = useState([]);
  const lastPosRef = useRef({ x: bucketPos.x, y: bucketPos.y });

  // Generate stardust trail when moving swiftly
  useEffect(() => {
    const dx = bucketPos.x - lastPosRef.current.x;
    const dy = bucketPos.y - lastPosRef.current.y;
    const speed = Math.hypot(dx, dy);

    if (speed > 4) {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: bucketPos.x + (Math.random() - 0.5) * 24,
        y: bucketPos.y + 10 + (Math.random() - 0.5) * 12,
        size: Math.random() * 6 + 4,
        opacity: Math.min(1, speed / 15)
      };

      setStardust(prev => [...prev.slice(-18), newParticle]);
    }

    lastPosRef.current = { x: bucketPos.x, y: bucketPos.y };
  }, [bucketPos]);

  // Clean old stardust particles
  useEffect(() => {
    if (stardust.length > 0) {
      const timer = setTimeout(() => {
        setStardust(prev => prev.slice(1));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [stardust]);

  return (
    <>
      {/* Golden Stardust Trail */}
      <div className="stardust-layer">
        {stardust.map(p => (
          <div
            key={p.id}
            className="stardust-sparkle"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      {/* Main Interactive Bucket */}
      <div
        className={`bucket-cursor-wrapper ${isSplashingGold ? 'splashing-gold' : ''}`}
        style={{
          transform: `translate(${bucketPos.x}px, ${bucketPos.y}px)`
        }}
      >
        {/* Golden Liquid Splash Effect */}
        {isSplashingGold && (
          <div className="gold-splash-aura">
            <div className="gold-splash-ring"></div>
            <div className="gold-liquid-droplet d1"></div>
            <div className="gold-liquid-droplet d2"></div>
            <div className="gold-liquid-droplet d3"></div>
            <div className="gold-liquid-droplet d4"></div>
          </div>
        )}

        <div className="bucket-motion-lines">
          <span className="motion-line"></span>
          <span className="motion-line"></span>
        </div>

        <img
          src="/assets/game/bucket-cursor.svg"
          alt="Bucket Cursor"
          className="bucket-graphic"
        />
      </div>
    </>
  );
}
