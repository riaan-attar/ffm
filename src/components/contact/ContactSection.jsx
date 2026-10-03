import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_FORM = {
  name: '',
  email: '',
  budget: '',
  message: ''
};

// Memoized: hideIntro never changes after mount for a given usage site, and
// this must not re-render on every 60x/sec hero game-loop update happening
// elsewhere on the Home page.
export const ContactSection = React.memo(function ContactSection({ hideIntro = false } = {}) {
  const sectionRef = useRef(null);
  const infoRef = useRef(null);
  const formCardRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const targets = [infoRef.current, formCardRef.current].filter(Boolean);
      gsap.fromTo(
        targets,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend is wired up yet - this simulates a send so the UI/UX can be
    // reviewed end to end. Wire this up to a real endpoint (e.g. Formspree,
    // EmailJS, or your own API route) before relying on it in production.
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className={`contact-container ${hideIntro ? 'contact-container-compact' : ''}`}>
        {!hideIntro && (
          <div ref={infoRef} className="contact-info">
            <div className="contact-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>GET IN TOUCH</span>
            </div>

            <h2 className="contact-headline">
              Let&apos;s Build<br />
              Something <span className="highlight-gold">Great</span>
            </h2>

            <p className="contact-copy">
              Tell us about your project and we&apos;ll get back to you within one business day.
            </p>

            <div className="contact-details">
              <a href="mailto:hello@footfallmetrics.in" className="contact-detail-item">
                <span className="contact-detail-label">Email</span>
                <span className="contact-detail-value">hello@footfallmetrics.in</span>
              </a>
              <a href="tel:+910000000000" className="contact-detail-item">
                <span className="contact-detail-label">Phone</span>
                <span className="contact-detail-value">+91 00000 00000</span>
              </a>
            </div>
          </div>
        )}

        <div ref={formCardRef} className="contact-form-card">
          {submitted ? (
            <div className="contact-success">
              <h3>Message sent.</h3>
              <p>Thanks for reaching out — we&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <label className="contact-field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className="contact-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    required
                  />
                </label>
              </div>

              <label className="contact-field">
                <span>Project Budget</span>
                <select name="budget" value={form.budget} onChange={handleChange} required>
                  <option value="" disabled>Select a range</option>
                  <option value="under-5k">Under $5k</option>
                  <option value="5k-15k">$5k – $15k</option>
                  <option value="15k-50k">$15k – $50k</option>
                  <option value="50k-plus">$50k+</option>
                </select>
              </label>

              <label className="contact-field">
                <span>Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us a bit about your project..."
                  rows={5}
                  required
                />
              </label>

              <button type="submit" className="contact-submit-btn">
                <span>Send Message</span>
                <img
                  src="/assets/services/service-arrow.svg"
                  alt=""
                  className="contact-submit-arrow"
                  aria-hidden="true"
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
});
