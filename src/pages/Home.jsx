import React from 'react';
import { useEggGame } from '../hooks/useEggGame';
import { Navbar } from '../components/Navbar';
import { HenPerchScene } from '../components/HenPerchScene';
import { HeroTypography } from '../components/HeroTypography';
import { GameCanvas } from '../components/GameCanvas';
import { BucketCursor } from '../components/BucketCursor';
import { InstructionsFooter } from '../components/InstructionsFooter';
import { ServicesSection } from '../components/services/ServicesSection';
import { WorkSection } from '../components/work/WorkSection';
import { StatsSection } from '../components/stats/StatsSection';
import { ProcessSection } from '../components/process/ProcessSection';
import { ContactSection } from '../components/contact/ContactSection';

export default function Home() {
  const {
    score,
    lives,
    activeEggs,
    effects,
    bucketPos,
    activeHenIndex,
    isSplashingGold,
    triggerHenLay
  } = useEggGame();

  return (
    <>
      {/* 1. Hero World Section with Minigame */}
      <section id="hero-section" className="hero-container">
        {/* Clean Glassmorphic Navbar */}
        <Navbar />

        {/* Interactive Hen Perch Sanctuary */}
        <HenPerchScene
          activeHenIndex={activeHenIndex}
          onHenClick={triggerHenLay}
        />

        {/* Hero Central Typography */}
        <HeroTypography />

        {/* Dynamic Game Canvas & Particles */}
        <GameCanvas
          activeEggs={activeEggs}
          effects={effects}
        />

        {/* Custom Bucket Mouse Cursor with Stardust & Liquid Gold Splash */}
        <BucketCursor
          bucketPos={bucketPos}
          isSplashingGold={isSplashingGold}
        />

        {/* Footer with Lives on Left & Score on Right */}
        <InstructionsFooter
          score={score}
          lives={lives}
        />
      </section>

      {/* 2. Premium Minimalist Services Section (Solid Cream Background) */}
      <ServicesSection />

      {/* 3. Case Studies / Featured Work Section (Dark Navy Background) */}
      <WorkSection />

      {/* 4. Trust Stats Bar (Cream Background) */}
      <StatsSection />

      {/* 5. Process / How We Work Section (Dark Navy Background) */}
      <ProcessSection />

      {/* 6. Contact Form Section (Dark Navy Background) */}
      <ContactSection />
    </>
  );
}
