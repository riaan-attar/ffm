import React from 'react';

export function StarRating({ rating = 5, max = 5, className = '' }) {
  return (
    <div className={`star-rating ${className}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`star-icon ${i < rating ? 'is-filled' : ''}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.63 6.03.58-4.6 4.07 1.38 5.92L10 14.77l-5.28 2.93 1.38-5.92-4.6-4.07 6.03-.58L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
