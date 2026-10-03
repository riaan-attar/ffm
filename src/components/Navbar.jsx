import React, { useState, useEffect } from 'react';

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
          <a href="#" className="brand-logo" title="FFM Agency" onClick={closeMenu}>
            <img src="/assets/brand/ffm-logo.svg" alt="FFM Logo" />
          </a>
        </div>

        <nav className="nav-center-menu" aria-label="Main Navigation">
          <ul className="nav-links">
            <li><a href="#hero-section" className="active">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="nav-cta-container">
          <a href="#contact" className="nav-cta-btn" onClick={closeMenu}>
            <span>START A PROJECT</span>
            <img src="/assets/ui/arrow-right.svg" alt="" width="14" height="14" aria-hidden="true" />
          </a>

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
            <a href="#" className="brand-logo" title="FFM Agency" onClick={closeMenu}>
              <img src="/assets/brand/ffm-logo.svg" alt="FFM Logo" />
            </a>
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
            <li><a href="#hero-section" onClick={closeMenu}>Home</a></li>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#work" onClick={closeMenu}>Work</a></li>
            <li><a href="#process" onClick={closeMenu}>Our Process</a></li>
            <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
          </ul>

          <div className="mobile-nav-cta">
            <a href="#contact" className="mobile-cta-btn" onClick={closeMenu}>
              <span>START A PROJECT</span>
              <img src="/assets/ui/arrow-right.svg" alt="" width="14" height="14" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
