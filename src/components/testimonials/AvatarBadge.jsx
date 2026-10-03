import React from 'react';

/**
 * Initials badge standing in for a client photo. Deliberately not a stock
 * photo or fabricated headshot — swap for a real <img>/<video> poster once
 * real client media exists.
 */
export function AvatarBadge({ initials, color = 'gold', size = 'md', hasVideo = false, className = '' }) {
  return (
    <div className={`avatar-badge avatar-badge-${size} avatar-badge-${color} ${className}`}>
      <span>{initials}</span>
      {hasVideo && (
        <span className="avatar-badge-play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}
    </div>
  );
}
