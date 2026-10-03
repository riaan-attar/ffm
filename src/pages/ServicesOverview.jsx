import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SplitText } from '../components/motion/SplitText';
import { CursorSpotlight } from '../components/motion/CursorSpotlight';
import { DragScroll } from '../components/motion/DragScroll';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import { SERVICES_DATA } from '../data/services';
import '../styles/services-overview.css';

export default function ServicesOverview() {
  return (
    <>
      <header className="sov-hero">
        <CursorSpotlight />
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="sov-hero-container">
          <div className="sov-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>Everything We Do</span>
          </div>

          <SplitText
            as="h1"
            className="sov-hero-title"
            text="Six Ways We Help You Grow"
          />

          <p className="sov-hero-copy">
            From the first line of code to the automation that runs while you sleep — drag through
            everything FFM builds.
          </p>

          <span className="sov-drag-hint">
            <span className="sov-drag-hint-arrow" aria-hidden="true">&larr;</span>
            Drag to explore
            <span className="sov-drag-hint-arrow" aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </header>

      <section className="sov-gallery-section">
        <DragScroll className="sov-gallery">
          {SERVICES_DATA.map((service) => (
            <Link to={`/services/${service.id}`} key={service.id} className="sov-card">
              <div className="sov-card-top">
                <span className="sov-card-number">{service.number}</span>
                <img src={service.image} alt="" className="sov-card-img" loading="lazy" />
              </div>
              <div className="sov-card-body">
                <h3 className="sov-card-title">{service.title}</h3>
                <p className="sov-card-tagline">{service.tagline}</p>
                <span className="sov-card-link">
                  <span>Explore</span>
                  <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </DragScroll>
      </section>

      <section className="sov-cta-section">
        <h2 className="sov-cta-title">
          Not sure which one you need?
        </h2>
        <p className="sov-cta-copy">Tell us what you're trying to build — we'll point you at the right fit.</p>
        <MagneticWrap>
          <Link to="/contact" className="sov-cta-btn">
            <span>Talk To Us</span>
            <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="sov-cta-arrow" />
          </Link>
        </MagneticWrap>
      </section>
    </>
  );
}
