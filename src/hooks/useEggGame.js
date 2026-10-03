import { useState, useEffect, useRef, useCallback } from 'react';

export function useEggGame() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeEggs, setActiveEggs] = useState([]);
  const [effects, setEffects] = useState([]);
  const [isSplashingGold, setIsSplashingGold] = useState(false);
  const [bucketPos, setBucketPos] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.72 : 400
  });
  const [activeHenIndex, setActiveHenIndex] = useState(null);

  // References to keep game loop and event handlers stable without re-triggering effects
  const mousePosRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.72 : 400
  });
  const bucketPosRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.72 : 400
  });
  const activeEggsRef = useRef([]);
  const isSpawningRef = useRef(false);
  const audioCtxRef = useRef(null);

  // Sync ref
  useEffect(() => {
    activeEggsRef.current = activeEggs;
  }, [activeEggs]);

  // Audio Context (Web Audio API synth)
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  const playCatchSound = useCallback((isGolden) => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = isGolden ? 880 : 587.33;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }, [getAudioCtx]);

  const playCluckSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Pitch chirp 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      osc1.frequency.exponentialRampToValueAtTime(260, now + 0.16);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Pitch chirp 2 (the 'bok!')
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(420, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(620, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(300, now + 0.28);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.28);
    } catch (e) {}
  }, [getAudioCtx]);

  const playGoldSplashSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      [880, 1100, 1320, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.18, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.22);
      });
    } catch (e) {}
  }, [getAudioCtx]);

  const playBombSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);

      const bufferSize = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }, [getAudioCtx]);

  const playMissSound = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }, [getAudioCtx]);

  // Handle losing a life (resets game & score if 3 lives are gone)
  const deductLife = useCallback(() => {
    setLives(prevLives => {
      if (prevLives <= 1) {
        setScore(0);
        return 3;
      }
      return prevLives - 1;
    });
  }, []);

  // Spawn a new random egg/bomb from a specific or random hen
  const spawnEggFromHen = useCallback((henIndex = null, forceGolden = false) => {
    const henElements = document.querySelectorAll('.hen-item');
    if (henElements.length === 0) return;

    const actualHenIdx = henIndex !== null ? henIndex : Math.floor(Math.random() * henElements.length);
    const hen = henElements[actualHenIdx] || henElements[0];
    const rect = hen.getBoundingClientRect();

    setActiveHenIndex(actualHenIdx);
    setTimeout(() => setActiveHenIndex(null), 350);

    let isBomb = false;
    let isGolden = false;

    if (forceGolden) {
      isGolden = true;
    } else {
      const rand = Math.random();
      isBomb = rand < 0.20;
      isGolden = !isBomb && rand < 0.40;
    }

    const newEgg = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.bottom + 10,
      speedY: 2.5 + Math.random() * 1.2,
      isGolden,
      isBomb
    };

    activeEggsRef.current = [newEgg];
    setActiveEggs([newEgg]);
    isSpawningRef.current = false;
  }, []);

  // User interactive click on a hen
  const triggerHenLay = useCallback((henIndex) => {
    playCluckSound();
    // Drop a golden reward egg on user request
    spawnEggFromHen(henIndex, true);
  }, [playCluckSound, spawnEggFromHen]);

  // Trigger next automatic drop with delay
  const queueNextDrop = useCallback((delay = 350) => {
    if (isSpawningRef.current) return;
    isSpawningRef.current = true;
    setTimeout(() => {
      spawnEggFromHen();
    }, delay);
  }, [spawnEggFromHen]);

  // Track Mouse / Touch
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Main Continuous Game & Physics Loop
  useEffect(() => {
    let animId;

    // Initial drop on mount
    const startTimer = setTimeout(() => {
      spawnEggFromHen();
    }, 400);

    const loop = () => {
      // 1. Lerp bucket toward mouse
      const targetX = mousePosRef.current.x;
      const targetY = mousePosRef.current.y;
      bucketPosRef.current.x += (targetX - bucketPosRef.current.x) * 0.25;
      bucketPosRef.current.y += (targetY - bucketPosRef.current.y) * 0.25;

      setBucketPos({
        x: bucketPosRef.current.x,
        y: bucketPosRef.current.y
      });

      // 2. Process falling egg
      const currentEggs = activeEggsRef.current;
      const heroHeight = window.innerHeight;

      if (currentEggs.length > 0) {
        const nextEggs = [];
        for (const egg of currentEggs) {
          const updatedY = egg.y + egg.speedY;
          const updatedSpeed = egg.speedY + 0.04;

          const distX = Math.abs(egg.x - bucketPosRef.current.x);
          const distY = Math.abs(updatedY - (bucketPosRef.current.y - 10));

          // CATCH
          if (distX < 42 && distY < 22) {
            if (egg.isBomb) {
              // Catching bomb loses a life!
              deductLife();
              playBombSound();

              setEffects(eff => [
                ...eff,
                { id: Date.now() + Math.random(), type: 'burst', x: egg.x, y: updatedY, src: '/assets/game/bomb-explosion.svg' },
                { id: Date.now() + Math.random() + 1, type: 'pop', isDanger: true, x: egg.x, y: updatedY, text: '-1 LIFE' }
              ]);
            } else {
              // Catching egg gives score
              const points = egg.isGolden ? 5 : 1;
              setScore(s => s + points);

              if (egg.isGolden) {
                playGoldSplashSound();
                setIsSplashingGold(true);
                setTimeout(() => setIsSplashingGold(false), 600);
              } else {
                playCatchSound(false);
              }

              setEffects(eff => [
                ...eff,
                { id: Date.now() + Math.random(), type: 'burst', x: egg.x, y: updatedY, src: '/assets/game/catch-burst.svg' },
                { id: Date.now() + Math.random() + 1, type: 'pop', isDanger: false, x: egg.x, y: updatedY, text: `+${points}` }
              ]);
            }

            queueNextDrop(300);
            continue;
          }

          // MISS / BOTTOM REACHED
          if (updatedY > heroHeight - 40) {
            if (egg.isBomb) {
              setEffects(eff => [
                ...eff,
                { id: Date.now() + Math.random(), type: 'burst', x: egg.x, y: updatedY, src: '/assets/game/miss-particle.svg' }
              ]);
            } else {
              if (!egg.isGolden) {
                deductLife();
              }
              playMissSound();

              setEffects(eff => [
                ...eff,
                { id: Date.now() + Math.random(), type: 'burst', x: egg.x, y: updatedY, src: '/assets/game/miss-particle.svg' }
              ]);
            }

            queueNextDrop(300);
            continue;
          }

          nextEggs.push({
            ...egg,
            y: updatedY,
            speedY: updatedSpeed
          });
        }

        activeEggsRef.current = nextEggs;
        setActiveEggs(nextEggs);
      } else if (!isSpawningRef.current) {
        queueNextDrop(300);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(startTimer);
    };
  }, [spawnEggFromHen, queueNextDrop, deductLife, playCatchSound, playGoldSplashSound, playBombSound, playMissSound]);

  // Clean up expired visual effects
  useEffect(() => {
    if (effects.length > 0) {
      const timer = setTimeout(() => {
        setEffects(prev => prev.slice(1));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [effects]);

  return {
    score,
    lives,
    activeEggs,
    effects,
    bucketPos,
    activeHenIndex,
    isSplashingGold,
    triggerHenLay
  };
}
