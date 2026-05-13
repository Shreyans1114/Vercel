/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ==== Icons (inline SVG, lucide-ish) ==== */
const Icon = {
  ArrowRight: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  Play: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M8 5v14l11-7L8 5z"/></svg>,
  Plus: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Check: (p) => <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Warn: (p) => <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" {...p}><circle cx="12" cy="12" r="8"/></svg>,
  Clock: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="16" cy="16" r="12"/><path d="M16 9v7l5 3"/></svg>,
  Root: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4v8"/><path d="M16 12c-3 0-5 2-5 5v3M16 12c3 0 5 2 5 5v3M11 20c-1 2-3 3-5 4M21 20c1 2 3 3 5 4M16 12c0 4-2 6-2 10M16 12c0 4 2 6 2 10"/></svg>,
  Capsule: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="6" y="12" width="20" height="8" rx="4" transform="rotate(-25 16 16)"/><circle cx="20" cy="12.5" r="0.8" fill="currentColor"/></svg>,
  Shield: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4l10 4v8c0 6-4 10-10 12-6-2-10-6-10-12V8l10-4z"/><path d="M12 16l3 3 5-6"/></svg>,
  Brain: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 6c-3 0-5 2-5 5 0 1-1 2-2 3s0 3 1 4c-1 1-1 3 0 4s2 1 2 3 2 3 4 3 3-1 3-3V8c0-1-1-2-3-2z"/><path d="M20 6c3 0 5 2 5 5 0 1 1 2 2 3s0 3-1 4c1 1 1 3 0 4s-2 1-2 3-2 3-4 3-3-1-3-3V8c0-1 1-2 3-2z"/></svg>,
  Moon: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M24 19A10 10 0 1 1 13 8a8 8 0 0 0 11 11z"/></svg>,
  Smile: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="16" cy="16" r="12"/><path d="M11 19c1 2 3 3 5 3s4-1 5-3"/><circle cx="12" cy="13" r="1" fill="currentColor"/><circle cx="20" cy="13" r="1" fill="currentColor"/></svg>,
  Spark: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4v6M16 22v6M4 16h6M22 16h6M8 8l4 4M20 20l4 4M8 24l4-4M20 12l4-4"/></svg>,
  Plate: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="6"/></svg>,
  Heart: (p) => <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 26s-9-5-9-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-9 12-9 12z"/></svg>,
  Pill: (p) => <svg viewBox="0 0 40 48" width="40" height="48" fill="none" {...p}>
    <defs>
      <linearGradient id="pg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#faf0dc"/><stop offset="1" stopColor="#d9b97a"/></linearGradient>
      <linearGradient id="pg2" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#F4B868"/><stop offset="1" stopColor="#A96818"/></linearGradient>
    </defs>
    <rect x="6" y="2" width="28" height="22" rx="14" fill="url(#pg)"/>
    <rect x="6" y="24" width="28" height="22" rx="14" fill="url(#pg2)"/>
  </svg>,
  Bottle: (p) => <svg viewBox="0 0 40 48" width="40" height="48" fill="none" {...p}>
    <rect x="14" y="4" width="12" height="6" rx="1" fill="#4A341E"/>
    <path d="M10 12h20l2 6v24a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V18l2-6z" fill="url(#bg1)"/>
    <defs><linearGradient id="bg1" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#F4B868"/><stop offset="1" stopColor="#A96818"/></linearGradient></defs>
  </svg>,
  Gummy: (p) => <svg viewBox="0 0 48 48" width="44" height="44" fill="none" {...p}>
    <ellipse cx="24" cy="28" rx="16" ry="12" fill="url(#gg)"/>
    <ellipse cx="20" cy="23" rx="5" ry="2" fill="rgba(255,255,255,0.4)"/>
    <defs><linearGradient id="gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F4B868"/><stop offset="1" stopColor="#C8842B"/></linearGradient></defs>
  </svg>,
  Can: (p) => <svg viewBox="0 0 40 48" width="40" height="48" fill="none" {...p}>
    <path d="M8 8h24v32a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8z" fill="url(#cg)"/>
    <path d="M8 8h24v4H8z" fill="#4A341E"/>
    <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F4B868"/><stop offset="1" stopColor="#A96818"/></linearGradient></defs>
  </svg>,
  Stick: (p) => <svg viewBox="0 0 48 48" width="44" height="44" fill="none" {...p}>
    <rect x="14" y="6" width="20" height="36" rx="2" fill="url(#sg)"/>
    <path d="M14 14h20" stroke="#4A341E" strokeWidth="0.5" strokeDasharray="2 2"/>
    <defs><linearGradient id="sg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#F4B868"/><stop offset="1" stopColor="#C8842B"/></linearGradient></defs>
  </svg>,
  LinkedIn: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M4 4h4v16H4V4zm2-3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 8h4v2c1-1 2-2 4-2 3 0 4 2 4 5v7h-4v-6c0-2-1-3-2-3s-2 1-2 3v6h-4V8z"/></svg>,
  X: (p) => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l7-9L3 3h6l4 5 5-5z"/></svg>,
  Vimeo: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M22 7c-1 4-4 9-8 14-2 2-4 2-5-1l-2-8c0-1-1-1-2 0l-2 1-1-2 5-4c2-1 3 0 3 2l2 7c0 1 1 1 2 0 2-2 3-6 3-7s-1-1-3 0c1-3 4-5 7-5s3 2 1 3z"/></svg>,
  YouTube: (p) => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}><path d="M22 6s-.2-1.4-.9-2c-.8-.8-1.7-.8-2.1-.9C16 3 12 3 12 3s-4 0-7 .1c-.4 0-1.3 0-2.1.9C2.2 4.6 2 6 2 6S1.8 7.6 1.8 9.2v1.6C1.8 12.4 2 14 2 14s.2 1.4.9 2c.8.8 2 .8 2.5 1 2 .1 7 .1 7 .1s4 0 7-.1c.4 0 1.3 0 2.1-.9.7-.6.9-2 .9-2s.2-1.6.2-3.2V9.2C22.2 7.6 22 6 22 6zM10 13V7l5 3-5 3z"/></svg>,
};
window.Icon = Icon;
