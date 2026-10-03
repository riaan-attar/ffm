import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AvatarBadge } from './AvatarBadge';

/**
 * Lightbox for a video testimonial. Fully functional once `testimonial.videoUrl`
 * points to a real file/embed — until then it shows an honest "not recorded
 * yet" state instead of faking footage.
 */
export function VideoModal({ testimonial, onClose }) {
  const backdropRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(cardRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power3.out' });

    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!testimonial) return null;

  return (
    <div ref={backdropRef} className="video-modal-backdrop" onClick={onClose}>
      <div ref={cardRef} className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="video-modal-close" onClick={onClose} aria-label="Close video">
          &#10005;
        </button>

        {testimonial.videoUrl ? (
          <video
            className="video-modal-video"
            src={testimonial.videoUrl}
            controls
            autoPlay
          />
        ) : (
          <div className="video-modal-empty">
            <AvatarBadge
              initials={testimonial.avatarInitials}
              color={testimonial.avatarColor}
              size="lg"
            />
            <h3>Video coming soon</h3>
            <p>
              We&apos;re still collecting a recorded testimonial from {testimonial.name}. In the
              meantime, here&apos;s what they told us:
            </p>
            <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
          </div>
        )}

        <div className="video-modal-meta">
          <strong>{testimonial.name}</strong>
          <span>{testimonial.role}, {testimonial.company}</span>
        </div>
      </div>
    </div>
  );
}
