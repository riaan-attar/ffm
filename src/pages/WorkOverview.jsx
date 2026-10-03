import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SplitText } from '../components/motion/SplitText';
import { CursorSpotlight } from '../components/motion/CursorSpotlight';
import { RevealImage } from '../components/motion/RevealImage';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import { WORK_DATA } from '../data/work';
import '../styles/work-overview.css';

export default function WorkOverview() {
  return (
    <>
      <header className="wov-hero">
        <CursorSpotlight />
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="wov-hero-container">
          <div className="wov-eyebrow">
            <span className="eyebrow-line" aria-hidden="true"></span>
            <span>The Full Archive</span>
          </div>

          <SplitText
            as="h1"
            className="wov-hero-title"
            text="Every Project, One Page"
          />

          <p className="wov-hero-copy">
            Four concepts, four very different problems. Scroll through the whole body of work.
          </p>
        </div>
      </header>

      <section className="wov-list">
        {WORK_DATA.map((project, index) => (
          <article key={project.id} className={`wov-item ${index % 2 === 1 ? 'wov-item-reverse' : ''}`}>
            <Link to={`/work/${project.id}`} className="wov-item-visual">
              <RevealImage
                src={project.image}
                alt={`${project.title} preview`}
                direction={index % 2 === 1 ? 'right' : 'left'}
                className="wov-item-reveal"
              />
            </Link>

            <div className="wov-item-content">
              <span className="wov-item-number">{project.number}</span>
              <h2 className="wov-item-title">{project.title}</h2>
              <div className="wov-item-tags">
                {project.tags.map((tag, i) => (
                  <React.Fragment key={tag}>
                    {i > 0 && <span className="wov-tag-dot" aria-hidden="true">&#9642;</span>}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
              <p className="wov-item-description">{project.description}</p>

              <MagneticWrap>
                <Link to={`/work/${project.id}`} className="wov-item-link">
                  <span>View Case Study</span>
                  <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="wov-item-arrow" />
                </Link>
              </MagneticWrap>
            </div>
          </article>
        ))}
      </section>

      <section className="wov-cta-section">
        <h2 className="wov-cta-title">Want to be the next one on this page?</h2>
        <MagneticWrap>
          <Link to="/contact" className="wov-cta-btn">
            <span>Start Your Project</span>
            <img src="/assets/services/service-arrow.svg" alt="" aria-hidden="true" className="wov-cta-arrow" />
          </Link>
        </MagneticWrap>
      </section>
    </>
  );
}
