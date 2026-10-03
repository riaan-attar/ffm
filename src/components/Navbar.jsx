import React from 'react';

export function Navbar() {
  return (
    <div className="navbar-wrapper">
      <header className="navbar-capsule">
        <div className="nav-brand-container">
          <a href="#" className="brand-logo" title="FFM Agency">
            <img src="/assets/brand/ffm-logo.svg" alt="FFM Logo" />
          </a>
        </div>

        <nav className="nav-center-menu">
          <ul className="nav-links">
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#work">Work</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="nav-cta-container">
          <a href="#contact" className="nav-cta-btn">
            <span>START A PROJECT</span>
            <img src="/assets/ui/arrow-right.svg" alt="" width="14" height="14" />
          </a>
        </div>
      </header>
    </div>
  );
}
