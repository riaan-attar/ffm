import React from 'react';

export function HeroTypography() {
  return (
    <main className="hero-content">
      <div className="hero-eyebrow">
        <img src="/assets/ui/score-icon.svg" alt="" width="16" height="16" />
        <span>WEB DEVELOPMENT AGENCY</span>
      </div>

      <h1 className="hero-headline">
        We Turn Ideas<br />
        <span className="highlight">Into Growth</span>
      </h1>

      <p className="hero-subtitle">
        Websites, web apps, automations and digital experiences built to help businesses move faster.
      </p>
    </main>
  );
}
