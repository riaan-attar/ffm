import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '../components/Navbar';
import { ContactSection } from '../components/contact/ContactSection';
import { MagneticWrap } from '../components/motion/MagneticWrap';
import '../styles/contact-page.css';

gsap.registerPlugin(ScrollTrigger);

const FAQ_DATA = [
  {
    question: 'How long does a typical project take?',
    answer:
      "It depends on scope, but most engagements run 4 to 10 weeks from kickoff to launch. Smaller sprints (a single landing page or a focused audit) can wrap in under two weeks, while larger builds with custom integrations are scoped week by week so you always know where things stand."
  },
  {
    question: 'Do you offer ongoing support?',
    answer:
      "Yes. Most clients move into a retainer after launch so we can monitor performance, ship iterations, and keep things running smoothly. Support plans are flexible — month-to-month or longer-term — and scale with how hands-on you want us to be."
  },
  {
    question: "What's your pricing model?",
    answer:
      'We quote fixed project fees for defined scopes, and monthly retainers for ongoing work. Give us a rough budget range in the form above and we\'ll come back with a proposal that fits it rather than a one-size-fits-all rate card.'
  },
  {
    question: 'Can you work with our existing team?',
    answer:
      "Absolutely. We regularly plug into existing design, engineering, and marketing teams — picking up a workstream, running a specific phase, or acting as an embedded extension of your team rather than a separate vendor."
  },
  {
    question: 'What do you need from us to get started?',
    answer:
      "Just a sense of the problem you're solving and any existing brand or technical assets you have. We'll handle discovery, scoping, and a proposal from there — no lengthy brief required to get the conversation moving."
  }
];

function FaqItem({ item, index, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="faq-question-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="faq-question-text">{item.question}</span>
        <span className="faq-icon" aria-hidden="true">
          <span className="faq-icon-line faq-icon-line-h"></span>
          <span className="faq-icon-line faq-icon-line-v"></span>
        </span>
      </button>

      <div className="faq-answer-wrapper">
        <div className="faq-answer-inner">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const faqSectionRef = useRef(null);
  const faqRailRef = useRef(null);
  const faqListRef = useRef(null);
  const faqItemRefs = useRef([]);
  const [openIndex, setOpenIndex] = useState(0);

  // Hero "status card" tilts toward the pointer — a tactile, physical read
  // (you're reaching toward us) rather than the word-by-word text reveal
  // used on the About page.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const card = cardRef.current;
    if (!hero || !card) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: px * 14,
        rotateX: py * -14,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleLeave = () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    };

    hero.addEventListener('mousemove', handleMove);
    hero.addEventListener('mouseleave', handleLeave);

    return () => {
      hero.removeEventListener('mousemove', handleMove);
      hero.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useLayoutEffect(() => {
    const section = faqSectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [faqRailRef.current, faqListRef.current],
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
    }, faqSectionRef);

    return () => ctx.revert();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const handleNavJump = (index) => {
    setOpenIndex(index);
    const target = faqItemRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <header ref={heroRef} className="contact-hero">
        <div className="page-hero-nav-row">
          <Navbar />
        </div>

        <div className="contact-hero-container">
          <div className="contact-hero-copy">
            <div className="contact-hero-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>Get In Touch</span>
            </div>

            <h1 className="contact-hero-title">
              Let&apos;s talk about your <span className="highlight-gold">project</span>
            </h1>

            <p className="contact-hero-description">
              Share a few details about what you&apos;re building and we&apos;ll come back with
              next steps — no lengthy intake forms, no sales runaround.
            </p>

            <MagneticWrap className="contact-hero-email-wrap">
              <a href="mailto:hello@footfallmetrics.in" className="contact-hero-email">
                <span>Prefer email?</span>
                <strong>hello@footfallmetrics.in</strong>
              </a>
            </MagneticWrap>
          </div>

          <div className="contact-hero-card-wrap">
            <div ref={cardRef} className="contact-hero-card">
              <span className="contact-hero-card-dot" aria-hidden="true"></span>
              <span className="contact-hero-card-status">Currently taking new projects</span>
              <span className="contact-hero-card-divider" aria-hidden="true"></span>
              <span className="contact-hero-card-response">
                Typical response time<strong>1 business day</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <ContactSection hideIntro />

      <section ref={faqSectionRef} className="contact-faq-section">
        <div className="contact-faq-container">
          <div ref={faqRailRef} className="contact-faq-rail">
            <div className="contact-faq-eyebrow">
              <span className="eyebrow-line" aria-hidden="true"></span>
              <span>FAQ</span>
            </div>

            <h2 className="contact-faq-headline">
              Questions, <span className="highlight-gold">Answered</span>
            </h2>

            <p className="contact-faq-copy">
              Everything prospective clients usually ask before kicking off a project with us.
            </p>

            <nav className="contact-faq-nav" aria-label="Jump to question">
              {FAQ_DATA.map((item, index) => (
                <button
                  key={item.question}
                  type="button"
                  className={`contact-faq-nav-item ${openIndex === index ? 'is-active' : ''}`}
                  onClick={() => handleNavJump(index)}
                >
                  <span className="contact-faq-nav-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="contact-faq-nav-label">{item.question}</span>
                </button>
              ))}
            </nav>
          </div>

          <div ref={faqListRef} className="contact-faq-list">
            {FAQ_DATA.map((item, index) => (
              <div key={item.question} ref={el => (faqItemRefs.current[index] = el)}>
                <FaqItem
                  item={item}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
