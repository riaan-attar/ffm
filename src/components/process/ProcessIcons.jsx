import React from 'react';

/* Simple hand-drawn line icons, no external image assets needed. */

export function IconUnderstand(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.36.8.9.8 1.5V16h5.4v-.6c0-.6.3-1.14.8-1.5A6 6 0 0 0 12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlan(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 3.5h7l3.5 3.5V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3.5V7h3.5M9 12h6M9 15.5h6M9 8.5h2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconBuild(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLaunch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.5 9.5c1.8-2.6 2-5 1.8-6.3-1.3-.2-3.7 0-6.3 1.8C7.7 6.7 6 9.3 5.2 11.3c-.2.5-.1 1 .3 1.4l2 2c.4.4 1 .5 1.4.3 2-.8 4.6-2.5 6.3-4.7L14.5 9.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.5 14.5 7 17M14 10a1.2 1.2 0 1 0 0-2.4A1.2 1.2 0 0 0 14 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15.5c-1.5 0-2.5.6-3 3.5 2.9-.5 3.5-1.5 3.5-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PROCESS_ICONS = {
  understand: IconUnderstand,
  plan: IconPlan,
  build: IconBuild,
  launch: IconLaunch
};
