/* global React */
const { useState, useEffect, useRef } = React;

/* ==== Regulatory Banner ==== */
function RegulatoryBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ashwanova_banner_dismissed') === '1') {
        setVisible(false);
        document.body.classList.remove('has-banner');
        return;
      }
    } catch (e) {}
    document.body.classList.add('has-banner');
  }, []);

  const dismiss = () => {
    try { sessionStorage.setItem('ashwanova_banner_dismissed', '1'); } catch (e) {}
    setVisible(false);
    document.body.classList.remove('has-banner');
  };

  if (!visible) return null;

  return (
    <div className="reg-banner" role="region" aria-label="Regulatory notice">
      <div className="reg-banner-accent" aria-hidden="true"></div>
      <div className="reg-banner-inner container">
        <div className="reg-banner-left">
          <span className="reg-banner-dot" aria-hidden="true"></span>
          <span className="reg-banner-text body-s">
            FSSAI Schedule IV enforces root-only Ashwagandha (April 2026). Ashwanova is <span className="reg-highlight">root-only</span>.
          </span>
        </div>
        <div className="reg-banner-right">
          <a href="formula-check.html" className="reg-banner-link body-s">Take the health check <window.Icon.ArrowRight/></a>
          <button className="reg-banner-close" onClick={dismiss} aria-label="Dismiss notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6l-12 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
window.RegulatoryBanner = RegulatoryBanner;

/* ==== Regulatory Moment ==== */
function RegulatoryMoment() {
  const [ref, shown] = window.useReveal(0.2);

  const milestones = [
    {
      date: '2021',
      title: 'Ministry of AYUSH Advisory',
      body: 'Leaf not endorsed as ASU medicine.',
    },
    {
      date: 'APRIL 2026',
      title: 'FSSAI Schedule IV Enforcement',
      body: 'State authorities directed to act against non-compliant products.',
    },
  ];

  return (
    <section className="section-pad reg-moment" id="regulatory">
      <div className="container reg-moment-grid" ref={ref}>
        <div className="reg-moment-left">
          <span className="eyebrow" style={{color: 'var(--saffron-600)'}}>THE ADVISORY</span>
          <h2 className="h1" style={{marginTop: 20, color: 'var(--coffee-900)', maxWidth: 480, textWrap: 'balance'}}>
            What FSSAI's advisory actually says — and what it doesn't.
          </h2>
          <p className="body-m" style={{marginTop: 32, color: 'var(--coffee-700)', maxWidth: 560, fontStyle: 'italic'}}>
            “Withania somnifera leaves either in crude or extract or any other form for therapeutic purposes under the ambit of ASU drugs is not permitted.”
          </p>
          <p className="body-m reg-moment-emphasis" style={{marginTop: 24, maxWidth: 560}}>
            Only root is permitted. FSSAI Schedule IV has always allowed only dried mature root of Withania somnifera in nutraceuticals. The April 2026 advisory is enforcement of an existing rule — not new legislation.
          </p>
          <p className="body-s" style={{marginTop: 24, color: 'var(--coffee-500)', maxWidth: 560}}>
            Leaf was never permitted under Schedule IV. State authorities have been directed to take legal action against non-compliant products. A label claim is not protection — the label and the Certificate of Analysis must agree. Regulators check both.
          </p>

          <div style={{marginTop: 40}}>
            <a href="formula-check.html" className="btn btn-primary btn-lg">
              Take the 2-min health check <window.Icon.ArrowRight className="arrow"/>
            </a>
          </div>

          <a href="docs/ayush-ashwagandha-advisory-2021.pdf" target="_blank" rel="noopener noreferrer" className="reg-citation">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
            </svg>
Source: Ministry of AYUSH Advisory 2021 · FSSAI Schedule IV (April 2026)
          </a>
        </div>

        <div className={`reg-moment-right ${shown ? 'in' : ''}`}>
          <div className="timeline">
            <div className="timeline-line" aria-hidden="true"></div>
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item" style={{transitionDelay: `${1000 + i * 150}ms`}}>
                <span className="timeline-marker" aria-hidden="true"></span>
                <div className="timeline-content">
                  <div className="timeline-date eyebrow no-line">{m.date}</div>
                  <h4 className="h4 timeline-title">{m.title}</h4>
                  <p className="body-s timeline-body">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
window.RegulatoryMoment = RegulatoryMoment;
