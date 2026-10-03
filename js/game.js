/* FFM Game Engine - Interactive Egg Catching Mechanics */

class FFMGameEngine {
  constructor() {
    // DOM Elements
    self.heroContainer = document.getElementById('hero-section');
    self.playArea = document.getElementById('game-play-area');
    self.bucketCursor = document.getElementById('bucket-cursor');
    self.scoreDisplay = document.getElementById('score-value');
    self.heartIcons = [
      document.getElementById('heart-1'),
      document.getElementById('heart-2'),
      document.getElementById('heart-3')
    ];
    self.gameOverOverlay = document.getElementById('game-over-overlay');
    self.restartBtn = document.getElementById('restart-btn');
    self.henElements = Array.from(document.querySelectorAll('.hen-item'));

    // Game State
    self.score = 12; // Start at 12 as per mock/game active state requirement
    self.lives = 2;  // 2 full hearts, 1 empty heart as per mock requirement (SCORE 012, ♥ ♥ ♡)
    self.maxLives = 3;
    self.isGameOver = false;
    
    // Physics & Entities
    self.activeEggs = [];
    self.bucketPos = { x: window.innerWidth / 2, y: window.innerHeight * 0.72 };
    self.mousePos = { x: window.innerWidth / 2, y: window.innerHeight * 0.72 };
    self.lastSpawnTime = 0;
    self.spawnInterval = 1800; // ms
    
    // Audio Context (Web Audio API synth)
    self.audioCtx = null;
    
    self.init();
  }

  init() {
    this.updateHUD();
    this.setupEventListeners();
    this.startLoop();
    this.spawnInitialVisualEggs();
  }

  setupEventListeners() {
    // Mouse movement inside hero container
    window.addEventListener('mousemove', (e) => {
      const rect = this.heroContainer.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
      }
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.heroContainer.getBoundingClientRect();
        if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
          this.mousePos.x = touch.clientX;
          this.mousePos.y = touch.clientY;
        }
      }
    }, { passive: true });

    // Restart button
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.restartGame());
    }
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
  }

  playCatchSound(isGolden = false) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      
      const freq = isGolden ? 880 : 587.33; // A5 or D5 chime
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playMissSound() {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.audioCtx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.22);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.22);
    } catch (e) {
      // Audio fallback silent
    }
  }

  spawnInitialVisualEggs() {
    // Spawn 2-3 initial eggs in mid-air to match active game state aesthetic
    const henRects = this.getHenSpawnPositions();
    if (henRects.length === 0) return;

    // Egg 1: Near bucket (imminent catch)
    this.createEggEntity(henRects[2].x, window.innerHeight * 0.62, 2.2, false);
    // Egg 2: Higher up mid-fall
    this.createEggEntity(henRects[0].x, window.innerHeight * 0.32, 2.8, false);
    // Egg 3: Golden egg falling from hen 4
    this.createEggEntity(henRects[4].x, window.innerHeight * 0.45, 2.5, true);
  }

  getHenSpawnPositions() {
    return this.henElements.map(hen => {
      const rect = hen.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom
      };
    });
  }

  spawnEgg() {
    if (this.isGameOver) return;
    
    const henPositions = this.getHenSpawnPositions();
    if (henPositions.length === 0) return;

    // Pick random hen
    const henIndex = Math.floor(Math.random() * henPositions.length);
    const spawnPos = henPositions[henIndex];
    
    // Trigger hen bounce animation
    const hen = this.henElements[henIndex];
    hen.classList.add('laying');
    setTimeout(() => hen.classList.remove('laying'), 350);

    // 20% chance for golden egg
    const isGolden = Math.random() < 0.2;
    const speed = 2.2 + Math.random() * 1.5;

    this.createEggEntity(spawnPos.x, spawnPos.y + 10, speed, isGolden);
  }

  createEggEntity(x, y, speed, isGolden) {
    const el = document.createElement('div');
    el.className = 'falling-egg';
    
    const img = document.createElement('img');
    img.src = isGolden ? 'public/assets/game/egg-golden.svg' : 'public/assets/game/egg.svg';
    img.alt = 'Egg';
    el.appendChild(img);

    // Subtle vertical dashed trail line behind egg
    const trail = document.createElement('div');
    trail.className = 'egg-trail-line';
    el.appendChild(trail);

    this.playArea.appendChild(el);

    this.activeEggs.push({
      element: el,
      x: x,
      y: y,
      speedY: speed,
      rotation: (Math.random() - 0.5) * 20,
      isGolden: isGolden
    });
  }

  updateBucketPos() {
    // Smooth lerp tracking mouse
    this.bucketPos.x += (this.mousePos.x - this.bucketPos.x) * 0.25;
    this.bucketPos.y += (this.mousePos.y - this.bucketPos.y) * 0.25;

    this.bucketCursor.style.transform = `translate(${this.bucketPos.x}px, ${this.bucketPos.y}px)`;
  }

  updateEggs() {
    const heroRect = this.heroContainer.getBoundingClientRect();
    const bucketBox = {
      x: this.bucketPos.x,
      y: this.bucketPos.y,
      width: 76,
      height: 30
    };

    for (let i = this.activeEggs.length - 1; i >= 0; i--) {
      const egg = this.activeEggs[i];
      
      egg.y += egg.speedY;
      egg.speedY += 0.04; // Gentle gravity

      // Update DOM position
      egg.element.style.transform = `translate(${egg.x}px, ${egg.y}px) rotate(${egg.rotation}deg)`;

      // Check Collision with Bucket Rim
      const distX = Math.abs(egg.x - bucketBox.x);
      const distY = Math.abs(egg.y - (bucketBox.y - 10));

      if (distX < 42 && distY < 22) {
        // SUCCESSFUL CATCH!
        this.handleCatch(egg, i);
        continue;
      }

      // Check Floor Miss
      if (egg.y > heroRect.bottom - 40) {
        // EGG MISSED!
        this.handleMiss(egg, i);
      }
    }
  }

  handleCatch(egg, index) {
    const points = egg.isGolden ? 5 : 1;
    this.score += points;
    this.updateHUD();
    this.playCatchSound(egg.isGolden);

    // Burst animation
    this.createCatchBurst(egg.x, egg.y);
    this.createFloatingScore(egg.x, egg.y, `+${points}`);

    // Remove egg element
    egg.element.remove();
    this.activeEggs.splice(index, 1);
  }

  handleMiss(egg, index) {
    this.lives -= 1;
    this.updateHUD();
    this.playMissSound();

    // Miss particle
    this.createMissParticle(egg.x, egg.y);

    egg.element.remove();
    this.activeEggs.splice(index, 1);

    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  createCatchBurst(x, y) {
    const burst = document.createElement('img');
    burst.src = 'public/assets/game/catch-burst.svg';
    burst.className = 'catch-burst-effect';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    this.playArea.appendChild(burst);

    setTimeout(() => burst.remove(), 450);
  }

  createFloatingScore(x, y, text) {
    const pop = document.createElement('div');
    pop.className = 'floating-score-pop';
    pop.innerText = text;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    this.playArea.appendChild(pop);

    setTimeout(() => pop.remove(), 600);
  }

  createMissParticle(x, y) {
    const splash = document.createElement('img');
    splash.src = 'public/assets/game/miss-particle.svg';
    splash.className = 'catch-burst-effect';
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    this.playArea.appendChild(splash);

    setTimeout(() => splash.remove(), 450);
  }

  updateHUD() {
    // Score string padded to 3 digits (e.g. 012)
    if (this.scoreDisplay) {
      this.scoreDisplay.innerText = String(this.score).padStart(3, '0');
    }

    // Lives hearts
    this.heartIcons.forEach((heart, i) => {
      if (!heart) return;
      const img = heart.querySelector('img');
      if (i < this.lives) {
        img.src = 'public/assets/ui/heart-full.svg';
        heart.classList.remove('lost');
      } else {
        img.src = 'public/assets/ui/heart-empty.svg';
        heart.classList.add('lost');
      }
    });
  }

  triggerGameOver() {
    this.isGameOver = true;
    if (this.gameOverOverlay) {
      this.gameOverOverlay.classList.add('active');
    }
  }

  restartGame() {
    this.score = 0;
    this.lives = 3;
    this.isGameOver = false;

    // Clear active eggs
    this.activeEggs.forEach(egg => egg.element.remove());
    this.activeEggs = [];

    if (this.gameOverOverlay) {
      this.gameOverOverlay.classList.remove('active');
    }

    this.updateHUD();
  }

  startLoop() {
    const loop = (timestamp) => {
      this.updateBucketPos();
      this.updateEggs();

      // Check spawn timer
      if (timestamp - this.lastSpawnTime > this.spawnInterval) {
        this.spawnEgg();
        this.lastSpawnTime = timestamp;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Instantiate engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ffmGame = new FFMGameEngine();
});
