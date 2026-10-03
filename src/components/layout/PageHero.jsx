import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../Navbar';

/**
 * Shared banner for every inner (non-home) page: renders the navbar in
 * normal flow, a breadcrumb back-link, an eyebrow label, and a headline.
 * Keeps every inner page on the same dark-navy / gold editorial theme as
 * the home page sections.
 */
export function PageHero({ eyebrow, title, highlight, description, backTo, backLabel }) {
  return (
    <header className="page-hero">
      <div className="page-hero-nav-row">
        <Navbar />
      </div>

      <div className="page-hero-container">
        {backTo && (
          <Link to={backTo} className="page-hero-back">
            <span aria-hidden="true">&larr;</span> {backLabel || 'Back'}
          </Link>
        )}

        <div className="page-hero-eyebrow">
          <span className="eyebrow-line" aria-hidden="true"></span>
          <span>{eyebrow}</span>
        </div>

        <h1 className="page-hero-title">
          {title}
          {highlight && <span className="highlight-gold"> {highlight}</span>}
        </h1>

        {description && <p className="page-hero-description">{description}</p>}
      </div>
    </header>
  );
}
