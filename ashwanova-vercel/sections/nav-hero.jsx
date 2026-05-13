/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ==== Hooks ==== */
function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {setShown(true);io.disconnect();}
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown];
}
window.useReveal = useReveal;

function useCountUp(target, shown, duration = 1400) {
  const [val, setVal] = useState(target); // default to target, not 0 — fallback-safe
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!shown || hasAnimated.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {setVal(target);return;}
    hasAnimated.current = true;
    setVal(0);
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);else
      setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown, target, duration]);
  return val;
}
window.useCountUp = useCountUp;

/* ==== Nav ==== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
      const sections = ['why', 'science', 'applications', 'faq'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top < 200 && r.bottom > 200) {setActive(id);return;}
        }
      }
      setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-logo">
          <span className="mark" aria-hidden="true"></span>
          <span>
            <span className="parent">Nutriventia</span>
            <span className="wordmark">Ashwanova<sup style={{ fontSize: '9px', opacity: 0.6, marginLeft: 2 }}>™</sup></span>
          </span>
        </a>
        <div className="nav-links">
          <a href="#why" className={active === 'why' ? 'active' : ''}>Why Ashwanova</a>
          <a href="#science" className={active === 'science' ? 'active' : ''}>The Science</a>
          <a href="#applications" className={active === 'applications' ? 'active' : ''}>Applications</a>
          <a href="#faq" className={active === 'faq' ? 'active' : ''}>FAQ</a>
        </div>
        <a href="https://www.nutriventia.com/contact-us/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Contact Us <window.Icon.ArrowRight className="arrow" /></a>
        <button className="nav-burger" aria-label="Menu"><span /></button>
      </div>
    </nav>);

}
window.Nav = Nav;

/* ==== Hero ==== */
function Hero() {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);
  const coverRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fade out black cover
    const t = setTimeout(() => {
      if (coverRef.current) coverRef.current.style.opacity = '0';
      setMounted(true);
    }, 50);
    return () => clearTimeout(t);
  }, []);

  // Cursor parallax + glow
  useEffect(() => {
    const onMove = (e) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      if (wrapRef.current) wrapRef.current.style.transform = `translate(${-cx * 12}px, ${-cy * 12}px) scale(1.03)`;
      if (textRef.current) textRef.current.style.transform = `translate(${cx * 4}px, ${cy * 4}px)`;
      if (glowRef.current) {
        glowRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        glowRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Scroll-driven exit
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, y / (vh * 0.9)));
      if (wrapRef.current) {
        wrapRef.current.style.opacity = String(1 - p * 0.6);
        wrapRef.current.style.filter = `blur(${p * 8}px)`;
      }
      if (textRef.current) {
        textRef.current.style.opacity = String(1 - p * 0.8);
        textRef.current.style.translate = `0 ${-p * 24}px`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-video-wrap" ref={wrapRef}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline preload="auto"
          aria-hidden="true">
          
          <source src="assets/hero-loop.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="hero-cover" ref={coverRef}></div>
      <div className="hero-glow" ref={glowRef}></div>

      <div className="hero-content container">
        <div className="hero-text" ref={textRef} style={{ transform: "translate(1.96095px, -0.947646px)" }}>
          <Scramble className={`eyebrow hero-eyebrow ${mounted ? 'in' : ''}`} text="ASHWANOVA · NUTRIVENTIA · APRIL 2026" delay={400} />
          <h1 className="display-xl" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 900ms var(--ease-out) 600ms, transform 900ms var(--ease-out) 600ms' }}>
            <ScrambleHeadline text="Ashwagandha just changed. Is your brand ready?" active={mounted} />
          </h1>
          <p className="body-l hero-sub" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 700ms var(--ease-out) 1200ms, transform 700ms var(--ease-out) 1200ms', maxWidth: 520, fontSize: "15px" }}>FSSAI's April 2026 advisory enforces Schedule IV: only Ashwagandha root is permitted in nutraceuticals. If your product contains Ashwagandha, here is what it means — and what to do next.

          </p>
          <div className="hero-ctas" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)', transition: 'opacity 600ms var(--ease-out) 1500ms, transform 600ms var(--ease-out) 1500ms' }}>
            <a href="https://www.nutriventia.com/contact-us/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Take the 2-min health check <window.Icon.ArrowRight className="arrow" /></a>
            <a href="#science" className="btn btn-ghost-dark btn-lg"><window.Icon.Play /> See what changed</a>
          </div>
          <a href="formula-check.html" className="hero-compliance-link" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 500ms var(--ease-out) 1800ms' }}>
            → Is your formula still compliant? Take the health check
          </a>
        </div>
      </div>

      <div className="hero-scroll" style={{ opacity: mounted ? 1 : 0, transition: 'opacity 500ms var(--ease-out) 2000ms' }}>
        <span className="line"></span>
        <span className="eyebrow no-line" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>SCROLL</span>
      </div>
    </section>);

}

function ScrambleHeadline({ text, active }) {
  // On mount, do a brief scramble of each character, then settle.
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const target = text;
    let frame = 0;
    const total = 28;
    const startDelay = 600;
    let rafId;
    const t0 = performance.now();
    const tick = (now) => {
      const elapsed = now - t0;
      if (elapsed < startDelay) {rafId = requestAnimationFrame(tick);return;}
      frame++;
      const progress = Math.min(1, (elapsed - startDelay) / 1100);
      const revealUpTo = Math.floor(progress * target.length * 1.15);
      const out = target.split('').map((ch, i) => {
        if (i < revealUpTo || ch === ' ' || ch === '.' || ch === '—') return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      setDisplay(out);
      if (progress < 1) rafId = requestAnimationFrame(tick);else
      setDisplay(target);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, text]);
  return <span style={{ fontSize: "70px" }}>{display}</span>;
}

function Scramble({ text, className, delay = 0 }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <span className={className} style={{ opacity: shown ? 1 : 0, transform: shown ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 600ms var(--ease-out), transform 600ms var(--ease-out)', display: 'inline-flex' }}>
      {text}
    </span>);

}

window.Hero = Hero;