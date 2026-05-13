/* global React */
const { useState, useEffect, useRef } = React;

/* ==== Problem (Section 3) ==== */
function Problem() {
  const [ref, shown] = window.useReveal(0.3);
  const stats = [
    { num: 20, suffix: '×', label: 'higher Withaferin A concentration in ashwagandha leaf vs root', cap: 'Source: Winther K. Nutrients 2026;18(5):871' },
    { num: 6, suffix: '×', label: 'higher Withanone concentration in ashwagandha leaf vs root', cap: 'Source: Winther K. Nutrients 2026;18(5):871' },
    { num: 3000, suffix: '+ yr', label: 'Ayurvedic texts have specified root only for internal therapeutic use', cap: 'API, Part I, Vol. I' },
  ];
  return (
    <section className="section-pad" id="problem">
      <div className="container" ref={ref}>
        <div style={{textAlign: 'center', maxWidth: 880, margin: '0 auto'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>THE SCIENCE</span>
          <h2 className="h1" style={{marginTop: 20, color: 'var(--coffee-900)', textWrap: 'balance'}}>The root and the leaf are two different ingredients.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'var(--coffee-700)', maxWidth: 720, margin: '24px auto 0'}}>The root is where the beneficial withanolides — the compounds your formulation depends on for its efficacy claims — are concentrated. The leaf carries a fundamentally different chemical profile. Withanone, present at 6× higher concentration in the leaf, has been shown in peer-reviewed research to cause DNA damage under conditions of glutathione depletion — a potential mechanism behind Ashwagandha-induced liver injury (AILI) cases now documented across multiple countries. Ask your supplier for a toxicity profile. If they cannot provide one, that is your answer.</p>
        </div>
        <div className="stat-grid">
          {stats.map((s, i) => <StatCard key={i} {...s} shown={shown} delay={i * 120}/>)}
        </div>
      </div>
    </section>
  );
}

function StatCard({ num, suffix, label, cap, shown, delay }) {
  const val = window.useCountUp(num, shown, 1400);
  const display = num >= 100 ? Math.round(val) : val.toFixed(0);
  return (
    <div className={`card stat-card reveal ${shown ? 'in' : ''}`} style={{transitionDelay: `${delay}ms`}}>
      <div className="accent-line"></div>
      <div className="data-xl stat-number"><span>{display}</span><span className="sym">{suffix}</span></div>
      <div className="stat-label">{label}</div>
      <div className="stat-caption">{cap}</div>
    </div>
  );
}
window.Problem = Problem;

/* ==== Meet Ashwanova (Section 4) ==== */
function Meet() {
  const stageRef = useRef(null);
  const capsuleRef = useRef(null);
  const [rotY, setRotY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, 1 - (r.top + r.height * 0.5) / (vh)));
      setRotY(p * 60 - 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onMove = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    if (capsuleRef.current) {
      capsuleRef.current.style.setProperty('--rx', `${-cy * 12}deg`);
      capsuleRef.current.style.setProperty('--ry', `${cx * 12 + rotY}deg`);
    }
  };
  const onLeave = () => {
    if (capsuleRef.current) {
      capsuleRef.current.style.setProperty('--rx', `0deg`);
      capsuleRef.current.style.setProperty('--ry', `${rotY}deg`);
    }
  };
  useEffect(() => {
    if (capsuleRef.current) capsuleRef.current.style.setProperty('--ry', `${rotY}deg`);
  }, [rotY]);

  const pills = ['Root Only', 'USP Withanolides', 'Clean Label Certified', '12× Bioavailability', 'NLT 4% Withanolides'];

  // Pre-compute particle positions
  const particles = Array.from({length: 12}).map((_, i) => ({
    x: 10 + Math.random() * 80,
    y: 50 + Math.random() * 50,
    dx: (Math.random() - 0.5) * 40,
    dy: -80 - Math.random() * 80,
    delay: Math.random() * 9,
  }));

  // Pre-compute beads inside capsule
  const beads = Array.from({length: 18}).map((_, i) => ({
    x: 20 + (i * 11) % 60,
    y: 55 + (i * 7) % 40,
  }));

  return (
    <section className="section-pad" id="meet">
      <div className="container two-col">
        <div>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>THE SOLUTION</span>
          <h2 className="display-l" style={{marginTop: 16, color: 'var(--coffee-900)'}}>We were already there.</h2>
          <p className="body-l" style={{marginTop: 32, color: 'var(--coffee-700)', maxWidth: 480}}>
            Ashwanova (Prolanza) by Nutriventia was designed <strong style={{color:'var(--saffron-600)', fontWeight: 600}}>root-only</strong> from its inception — not in response to a regulation, but because Ayurveda was right and modern science was always going to confirm it. Root-only was not our response to FSSAI. It was our starting point.
          </p>
          <div className="pill-row">
            {pills.map(p => (
              <span key={p} className="pill"><span className="dot"></span>{p}</span>
            ))}
          </div>
        </div>
        <div className="capsule-stage" ref={stageRef} onPointerMove={onMove} onPointerLeave={onLeave}>
          {particles.map((p, i) => (
            <span key={i} className="particle" style={{
              left: `${p.x}%`, top: `${p.y}%`,
              '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
              animationDelay: `${p.delay}s`,
            }}/>
          ))}
          <div className="capsule" ref={capsuleRef}>
            <div className="half top"></div>
            <div className="half bot">
              {beads.map((b, i) => (
                <span key={i} className="bead" style={{left: `${b.x}%`, top: `${b.y}%`, opacity: 0.7 + (i%3)*0.1}}/>
              ))}
            </div>
            <div className="seam"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Meet = Meet;

/* ==== Why Root Only (Section 5) ==== */
function WhyRootOnly() {
  const [ref, shown] = window.useReveal(0.25);
  const leftRows = [
    "Supply chain: does your CoA explicitly state 'Withania somnifera root' as the botanical source?",
    "Label compliance: do your labels, e-commerce listings, and website accurately describe the plant part?",
    "Withanolide claims: is your % a USP profile (all 10 compounds individually identified) — or a generic total?",
    "Reformulation timeline: switching ingredients typically takes 3–9 months. Have you started?",
  ];
  const rightRows = [
    "Root only, confirmed by independent third-party CoA from a NABL-accredited lab",
    "Plant part explicitly stated: Withania somnifera root. No leaf, no stem, no blended extract",
    "USP withanolide profile — all 10 compounds individually quantified, NLT 4%",
    "Adulteration tested by independent lab (DNA barcoding or HPTLC); Clean Label Project certified",
    "Published human pharmacokinetic data and multiple RDBPC clinical trials",
  ];
  return (
    <section className="section-pad-lg dark" id="why">
      <EmberParticles/>
      <div className="container">
        <div style={{textAlign: 'center', maxWidth: 960, margin: '0 auto'}}>
          <span className="eyebrow">YOUR BRAND</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--cream-50)'}}>Four things worth checking for your brand.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'rgba(250,246,238,0.75)', maxWidth: 720, margin: '24px auto 0', textWrap: 'balance'}}>
            Not a compliance checklist. Four practical questions a brand professional should be asking their QA and procurement teams — and the standard one ingredient was already designed to meet.
          </p>
        </div>

        <div className={`compare-grid ${shown ? 'in' : ''}`} ref={ref}>
          <div className="compare-card left">
            <span className="eyebrow" style={{color: 'var(--coffee-500)'}}>QUESTIONS TO ASK</span>
            <h3 className="h2" style={{marginTop: 14, color: 'var(--cream-50)'}}>Where does your brand stand?</h3>
            <div className="compare-list">
              {leftRows.map((t, i) => (
                <div key={i} className="compare-row" style={{transitionDelay: `${600 + i*100}ms`}}>
                  <span className="compare-indicator warn"><window.Icon.Warn/></span>
                  <span className="compare-text">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="compare-divider"></div>
          <div className="compare-card right">
            <span className="eyebrow" style={{color: 'var(--saffron-500)'}}>THE STANDARD</span>
            <h3 className="h2" style={{marginTop: 14, color: 'var(--cream-50)'}}>Root only is the new baseline.</h3>
            <div className="compare-list">
              {rightRows.map((t, i) => (
                <div key={i} className="compare-row" style={{transitionDelay: `${800 + i*100}ms`}}>
                  <span className="compare-indicator check"><window.Icon.Check/></span>
                  <span className="compare-text">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pullquote">
          “Not sure where you stand? Take the 2-minute brand health check.”
          <span className="attrib">— Start the conversation before you need to.</span>
        </div>
      </div>
    </section>
  );
}

function EmberParticles() {
  const particles = Array.from({length: 18}).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 12,
    dur: 10 + Math.random() * 8,
  }));
  return (
    <div className="ember-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <span key={i} style={{left: `${p.left}%`, bottom: 0, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`}}/>
      ))}
    </div>
  );
}
window.WhyRootOnly = WhyRootOnly;
window.EmberParticles = EmberParticles;
