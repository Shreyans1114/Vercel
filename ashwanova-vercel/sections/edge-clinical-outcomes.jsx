/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ==== E.D.G.E. Platform (Section 6) ==== */
function EdgePlatform() {
  const [ref, shown] = window.useReveal(0.2);
  const [cursorHour, setCursorHour] = useState(8);
  const svgRef = useRef(null);

  // Chart dims
  const W = 1200, H = 360;
  const PAD_L = 60, PAD_R = 40, PAD_T = 30, PAD_B = 50;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const xFor = (h) => PAD_L + (h / 24) * plotW;
  const yFor = (v) => PAD_T + plotH - (v / 100) * plotH;

  // Standard extract: sharp spike hour 1, drops by 4, flat by 8
  const standardAt = (h) => {
    if (h < 0.2) return 5 + h * 30;
    if (h < 1.2) return 11 + (h - 0.2) * 78;
    if (h < 4) return 89 - (h - 1.2) * 28;
    if (h < 8) return 11 - (h - 4) * 2;
    return Math.max(0, 3 - (h - 8) * 0.2);
  };
  // Ashwanova: rises to plateau hour 2, holds until 22, declines to 24
  const ashwanovaAt = (h) => {
    if (h < 2) return 10 + h * 32;
    if (h < 22) return 74 + Math.sin((h - 2) * 0.4) * 3;
    return 74 - (h - 22) * 22;
  };

  const standardPath = Array.from({length: 121}, (_, i) => {
    const h = (i / 120) * 24;
    return `${i === 0 ? 'M' : 'L'}${xFor(h).toFixed(1)} ${yFor(standardAt(h)).toFixed(1)}`;
  }).join(' ');

  const ashwanovaPath = Array.from({length: 121}, (_, i) => {
    const h = (i / 120) * 24;
    return `${i === 0 ? 'M' : 'L'}${xFor(h).toFixed(1)} ${yFor(ashwanovaAt(h)).toFixed(1)}`;
  }).join(' ');

  const ashwanovaAreaPath = ashwanovaPath + ` L${xFor(24).toFixed(1)} ${yFor(0).toFixed(1)} L${xFor(0).toFixed(1)} ${yFor(0).toFixed(1)} Z`;

  const onDrag = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const ratio = (x / rect.width) * W;
    const h = Math.max(0, Math.min(24, ((ratio - PAD_L) / plotW) * 24));
    setCursorHour(h);
  };

  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  const features = [
    { icon: <window.Icon.Clock/>, title: 'Sustained release', body: '7.1-hour plasma half-life vs 2.3 hr for comparator branded Ashwagandha. Once daily.' },
    { icon: <window.Icon.Root/>, title: 'Clean Label certified', body: '130+ contaminants independently tested. Third-party certification covering pesticide residues, heavy metals, and plasticisers.' },
    { icon: <window.Icon.Capsule/>, title: '150mg, once daily', body: 'Sustained-release format validated at clinical dose. Multiple RDBPC trials including Thanawala S et al., Medicine 2026.' },
  ];

  return (
    <section className="section-pad" id="science">
      <div className="container" ref={ref}>
        <div style={{textAlign: 'center', maxWidth: 880, margin: '0 auto'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>BIOAVAILABILITY</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--coffee-900)', textWrap: 'balance'}}>12× higher withanolide AUC. 7.1-hour plasma half-life.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'var(--coffee-700)', maxWidth: 720, margin: '24px auto 0'}}>
            Published pharmacokinetic evidence: 12× higher withanolide AUC and 7.1-hour plasma half-life vs 2.3 hr for comparator branded Ashwagandha. 150mg SR, once daily. Clinically validated in multiple RDBPC trials.
          </p>
        </div>

        <div className="chart-wrap">
          <div className="chart-head">
            <div>
              <span className="eyebrow" style={{color: 'var(--coffee-500)'}}>BIOACTIVE LEVELS — 24 HOURS</span>
              <div className="chart-legend" style={{marginTop: 16}}>
                <div className="legend-item"><span className="legend-swatch a"/> Standard Ashwagandha</div>
                <div className="legend-item"><span className="legend-swatch b"/> Ashwanova</div>
              </div>
            </div>
            <div className="chart-values">
              <div className="chart-value a">
                <span>Standard @ {cursorHour.toFixed(1)}h</span>
                <span className="num">{Math.round(standardAt(cursorHour))}</span>
              </div>
              <div className="chart-value b">
                <span>Ashwanova @ {cursorHour.toFixed(1)}h</span>
                <span className="num">{Math.round(ashwanovaAt(cursorHour))}</span>
              </div>
            </div>
          </div>

          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="chart-svg"
            onPointerDown={(e) => { setDragging(true); onDrag(e); }}
            onPointerMove={(e) => dragging && onDrag(e)}
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#E89B3C" stopOpacity="0.32"/>
                <stop offset="1" stopColor="#E89B3C" stopOpacity="0"/>
              </linearGradient>
              <filter id="saffronGlow">
                <feGaussianBlur stdDeviation="3"/>
              </filter>
            </defs>

            {/* Y gridlines */}
            {[0, 25, 50, 75, 100].map(v => (
              <g key={v}>
                <line x1={PAD_L} y1={yFor(v)} x2={W - PAD_R} y2={yFor(v)} stroke="#EDE3D0" strokeWidth="1" strokeDasharray={v === 0 ? '0' : '3 4'}/>
                <text x={PAD_L - 10} y={yFor(v) + 4} className="chart-axis-label" textAnchor="end">{v}</text>
              </g>
            ))}
            {/* X ticks */}
            {[0, 4, 8, 12, 16, 20, 24].map(h => (
              <g key={h}>
                <text x={xFor(h)} y={H - PAD_B + 24} className="chart-axis-label" textAnchor="middle">{h}h</text>
              </g>
            ))}

            {/* Standard line */}
            <path d={standardPath} fill="none" stroke="#6B4F2A" strokeWidth="2" strokeLinejoin="round" strokeDasharray={shown ? '0' : '2000'} strokeDashoffset={shown ? '0' : '2000'} style={{transition: 'stroke-dashoffset 1800ms var(--ease-out)'}}/>
            {/* Ashwanova area */}
            <path d={ashwanovaAreaPath} fill="url(#areaFill)" opacity={shown ? 1 : 0} style={{transition: 'opacity 1200ms var(--ease-out) 800ms'}}/>
            {/* Ashwanova line */}
            <path d={ashwanovaPath} fill="none" stroke="#E89B3C" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={shown ? '0' : '2000'} strokeDashoffset={shown ? '0' : '2000'} style={{transition: 'stroke-dashoffset 1800ms var(--ease-out) 300ms'}}/>

            {/* Cursor line */}
            <g style={{opacity: shown ? 1 : 0, transition: 'opacity 400ms 2000ms'}}>
              <line x1={xFor(cursorHour)} y1={PAD_T} x2={xFor(cursorHour)} y2={H - PAD_B} stroke="#2D1F0F" strokeWidth="1" strokeDasharray="4 4" opacity="0.35"/>
              <circle cx={xFor(cursorHour)} cy={yFor(standardAt(cursorHour))} r="6" fill="#6B4F2A"/>
              <circle cx={xFor(cursorHour)} cy={yFor(standardAt(cursorHour))} r="3" fill="#fff"/>
              <circle cx={xFor(cursorHour)} cy={yFor(ashwanovaAt(cursorHour))} r="7" fill="#E89B3C" filter="url(#saffronGlow)"/>
              <circle cx={xFor(cursorHour)} cy={yFor(ashwanovaAt(cursorHour))} r="5" fill="#E89B3C"/>
              <circle cx={xFor(cursorHour)} cy={yFor(ashwanovaAt(cursorHour))} r="2" fill="#fff"/>
              {/* Handle at bottom */}
              <g transform={`translate(${xFor(cursorHour)}, ${H - PAD_B + 2})`}>
                <rect x="-14" y="0" width="28" height="18" rx="9" fill="#2D1F0F"/>
                <text x="0" y="12" textAnchor="middle" fontSize="10" fill="#FAF6EE" fontFamily="var(--font-mono)">⇔</text>
              </g>
            </g>
          </svg>
          <div style={{marginTop: 16, fontSize: 12, color: 'var(--coffee-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textAlign: 'center'}}>DRAG THE CURSOR TO EXPLORE BIOACTIVE LEVELS ACROSS THE DAY</div>
        </div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className={`feature-card reveal ${shown ? 'in' : ''}`} style={{transitionDelay: `${i * 120 + 400}ms`}}>
              <div className="icon">{f.icon}</div>
              <h4 className="h4">{f.title}</h4>
              <p className="body-m" style={{marginTop: 10}}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.EdgePlatform = EdgePlatform;

/* ==== Clinical Evidence (Section 7) ==== */
function ClinicalEvidence() {
  const [ref, shown] = window.useReveal(0.2);
  const studies = [
    {
      eyebrow: 'PHARMACOKINETIC STUDY',
      num: 12, decimals: 0, suffix: '×',
      label: 'higher withanolide AUC vs comparator',
      body: '7.1-hour plasma half-life vs 2.3 hr for comparator branded Ashwagandha. 150mg SR, once daily.',
      citation: 'Alluri VKR et al., IJBCP 2022.'
    },
    {
      eyebrow: 'USP WITHANOLIDES',
      num: 4, decimals: 0, suffix: '%',
      label: 'NLT across all 10 USP compounds',
      body: 'Not a generic total withanolides percentage. Every compound in the USP Withania somnifera Root Monograph — individually quantified, from root only.',
      citation: 'USP Withania somnifera Root Monograph.'
    },
    {
      eyebrow: 'CLINICAL VALIDATION',
      num: 130, decimals: 0, suffix: '+',
      label: 'contaminants independently tested',
      body: 'Clean Label Project certification covering pesticide residues, heavy metals, and plasticisers. Multiple RDBPC trials including Thanawala S et al., Medicine 2026.',
      citation: 'Thanawala S et al., Medicine 2026.'
    },
  ];
  return (
    <section className="section-pad dark">
      <window.EmberParticles/>
      <div className="container" ref={ref}>
        <div style={{textAlign: 'center', maxWidth: 880, margin: '0 auto'}}>
          <span className="eyebrow">CLINICAL EVIDENCE</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--cream-50)', textWrap: 'balance'}}>Verified, not just claimed.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'rgba(250,246,238,0.75)', maxWidth: 720, margin: '24px auto 0'}}>
            Independent third-party CoA from a NABL-accredited lab. USP withanolide profile across all 10 compounds. Clean Label Project certified. Published human pharmacokinetic data. Multiple randomised, double-blind, placebo-controlled human clinical trials.
          </p>
        </div>

        <div className="study-grid">
          {studies.map((s, i) => <StudyCard key={i} {...s} shown={shown} delay={i * 150}/>)}
        </div>

        <div className="meta-stats">
          {[
            { num: 27, lab: 'Countries' },
            { num: 36, lab: 'Patents Applied' },
            { num: 12, lab: 'Patents Granted' },
            { num: 22, lab: 'Clinical Studies' },
          ].map((m, i) => <MetaStat key={i} {...m} shown={shown} delay={i * 100}/>)}
        </div>
      </div>
    </section>
  );
}

function StudyCard({ eyebrow, num, decimals, suffix, label, body, citation, shown, delay }) {
  const val = window.useCountUp(num, shown, 1500);
  return (
    <div className={`study-card reveal ${shown ? 'in' : ''}`} style={{transitionDelay: `${delay}ms`}}>
      <span className="eyebrow" style={{color: 'var(--saffron-500)'}}>{eyebrow}</span>
      <div className="data-xl big-num">
        {val.toFixed(decimals)}<span>{suffix}</span>
      </div>
      <div className="label">{label}</div>
      <p className="body">{body}</p>
      <div className="citation">{citation}</div>
    </div>
  );
}

function MetaStat({ num, lab, shown, delay }) {
  const val = window.useCountUp(num, shown, 1200);
  return (
    <div className="meta-stat reveal" style={{opacity: shown?1:0, transform: shown?'translateY(0)':'translateY(16px)', transitionDelay: `${delay + 600}ms`}}>
      <div className="data-l num">{Math.round(val)}</div>
      <div className="eyebrow lab no-line">{lab}</div>
    </div>
  );
}
window.ClinicalEvidence = ClinicalEvidence;

/* ==== Outcomes (Section 8) ==== */
function Outcomes() {
  const [ref, shown] = window.useReveal(0.15);
  const benefits = [
    { icon: <window.Icon.Shield/>, title: 'Root only, confirmed', body: 'Withania somnifera root. No leaf. No stem. No blended extract. No ambiguity. Every batch independently verified.' },
    { icon: <window.Icon.Smile/>, title: 'USP withanolides', body: 'NLT 4% across all 10 USP compounds — individually quantified from root only.' },
    { icon: <window.Icon.Moon/>, title: 'Clean Label certified', body: '130+ contaminants independently tested. Not self-declared. Not a supplier claim.' },
    { icon: <window.Icon.Heart/>, title: '12× bioavailability', body: '12× higher withanolide AUC vs comparator branded Ashwagandha.' },
    { icon: <window.Icon.Brain/>, title: '7.1-hour half-life', body: 'Plasma half-life of 7.1 hr vs 2.3 hr for comparator. Sustained-release format validated at clinical dose.' },
    { icon: <window.Icon.Plate/>, title: '3,000+ years', body: 'Ayurvedic texts have specified root only for internal therapeutic use. The API, Part I, Vol. I confirms it.' },
  ];
  return (
    <section className="section-pad">
      <div className="container" ref={ref}>
        <div style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>THE BENCHMARK</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--coffee-900)'}}>Clinically validated. Market-ready.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'var(--coffee-700)', maxWidth: 640, margin: '24px auto 0'}}>
            One ingredient designed to meet every level of the framework — before this regulation was enforced.
          </p>
        </div>
        <div className="benefit-grid">
          {benefits.map((b, i) => (
            <div key={i} className={`benefit-card reveal ${shown?'in':''}`} style={{transitionDelay: `${i * 80}ms`}}>
              <div className="icon">{b.icon}</div>
              <h3 className="h3">{b.title}</h3>
              <p>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Outcomes = Outcomes;

/* ==== Applications (Section 9) ==== */
function Applications() {
  const formats = [
    { icon: <window.Icon.Pill/>, title: '6 questions', body: 'About your current ingredient, your CoA, and your label.' },
    { icon: <window.Icon.Bottle/>, title: '2-minute average', body: 'No hints. Immediate results. Score shared on LinkedIn.' },
    { icon: <window.Icon.Gummy/>, title: 'A–D grade result', body: 'Find out exactly where your brand stands.' },
    { icon: <window.Icon.Can/>, title: 'Sent to your email', body: 'No spam. No automated follow-up without permission.' },
    { icon: <window.Icon.Stick/>, title: 'Start the conversation', body: 'Brands that begin early have more options and less disruption.' },
  ];
  return (
    <section className="section-pad" id="applications">
      <div className="container">
        <div style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>BRAND HEALTH CHECK</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--coffee-900)'}}>Find out where your brand stands — in 2 minutes.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'var(--coffee-700)', maxWidth: 640, margin: '24px auto 0'}}>
            Do you have Ashwagandha in any of your products? Take this 6-question health check to find out exactly where your brand stands. No hints. Immediate results. Your results are sent to your email.
          </p>
        </div>
        <div className="apps-row">
          {formats.map((f, i) => <AppCard key={i} {...f}/>)}
        </div>
      </div>
    </section>
  );
}

function AppCard({ icon, title, body }) {
  const ref = useRef(null);
  const visualRef = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `rotateX(${-cy * 8}deg) rotateY(${cx * 8}deg)`;
    if (visualRef.current) visualRef.current.style.transform = `translate3d(${-cx * 8}px, ${-cy * 8}px, 20px)`;
  };
  const onLeave = () => {
    ref.current.style.transform = '';
    if (visualRef.current) visualRef.current.style.transform = '';
  };
  return (
    <div className="app-card" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="app-visual" ref={visualRef}>{icon}</div>
      <div>
        <h4 className="h4">{title}</h4>
        <p>{body}</p>
      </div>
    </div>
  );
}
window.Applications = Applications;
