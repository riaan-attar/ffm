import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="navbar-wrapper">
      <header className="navbar-capsule">
        <div className="nav-brand-container">
          <Link to="/" className="brand-logo" title="FFM Agency" onClick={closeMenu}>
            <img src="/assets/brand/ffm-logo-icon.png" alt="FFM" className="brand-logo-icon" />
            <span className="brand-logo-text">DESIGN by FFM</span>
          </Link>
        </div>

        <nav className="nav-center-menu" aria-label="Main Navigation">
          <ul className="nav-links">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/services">Services</NavLink></li>
            <li><NavLink to="/work">Work</NavLink></li>
            <li><NavLink to="/testimonials">Testimonials</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </nav>

        <div className="nav-cta-container">
          <Link to="/contact" className="nav-cta-btn" onClick={closeMenu}>
            <span>START A PROJECT</span>
            <img src="/assets/ui/arrow-right.svg" alt="" width="14" height="14" aria-hidden="true" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'is-active' : ''}`} onClick={closeMenu}>
        <div className="mobile-nav-panel" onClick={e => e.stopPropagation()}>
          <div className="mobile-nav-header">
            <Link to="/" className="brand-logo" title="FFM Agency" onClick={closeMenu}>
              <img src="/assets/brand/ffm-logo-icon.png" alt="FFM" className="brand-logo-icon" />
              <span className="brand-logo-text">DESIGN by FFM</span>
            </Link>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <ul className="mobile-nav-links">
            <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/services" onClick={closeMenu}>Services</NavLink></li>
            <li><NavLink to="/work" onClick={closeMenu}>Work</NavLink></li>
            <li><NavLink to="/testimonials" onClick={closeMenu}>Testimonials</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          </ul>

          <div className="mobile-nav-cta">
            <Link to="/contact" className="mobile-cta-btn" onClick={closeMenu}>
              <span>START A PROJECT</span>
              <img src="/assets/ui/arrow-right.svg" alt="" width="14" height="14" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
