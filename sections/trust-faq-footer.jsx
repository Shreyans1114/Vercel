/* global React */
const { useState, useEffect, useRef } = React;

/* ==== Trust (Section 10) ==== */
function Trust() {
  const certs = ['Root Only', 'USP Withanolides', 'Clean Label Certified', 'NABL-Accredited CoA', 'DNA Barcoding / HPTLC', 'Published PK Data'];
  // Stylized world map with saffron patent markers
  const markers = [
    { name: 'UK', x: 470, y: 140, status: 'granted', detail: 'Ashwanova patent' },
    { name: 'South Korea', x: 800, y: 200, status: 'pending', detail: 'KFDA submission in progress' },
    { name: 'Japan', x: 830, y: 195, status: 'granted', detail: 'TurmXTRA family' },
    { name: 'USA', x: 220, y: 200, status: 'granted', detail: 'Multiple trademarks & patents' },
    { name: 'Canada', x: 225, y: 135, status: 'pending', detail: 'NPN submission in progress' },
    { name: 'India', x: 720, y: 240, status: 'granted', detail: 'Origin & manufacturing' },
    { name: 'EU', x: 500, y: 165, status: 'granted', detail: 'EFSA-compatible registration' },
  ];
  const partners = ['VITA LABS', 'NORDIC BOTANICA', 'SEABRIGHT PHARMA', 'KINDRED CO.', 'RELM NUTRITION', 'BLUEFINCH', 'HAMMONDS & SOUL', 'TERRAFORM', 'NORTHRIDGE', 'ROOT STUDIO'];

  return (
    <section className="section-pad trust-wrap">
      <div className="container" style={{position:'relative'}}>
        <div style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>THE STANDARD</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--coffee-900)', textWrap: 'balance'}}>Root only is the new baseline.</h2>
          <p className="body-l" style={{marginTop: 24, color: 'var(--coffee-700)', maxWidth: 720, margin: '24px auto 0'}}>
            Three tiers separate a good ingredient from the right one: compliant (root only, confirmed), verified (not just claimed), and differentiated (clinically validated, market-ready).
          </p>
        </div>

        <div className="certs-row">
          {certs.map(c => (
            <span key={c} className="cert">
              <svg className="cert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {c}
            </span>
          ))}
        </div>

        <div className="map-wrap">
          <WorldMap markers={markers}/>
          <div className="map-caption">COMPLIANT · VERIFIED · DIFFERENTIATED — ONE INGREDIENT MEETS ALL THREE</div>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="marquee-item">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorldMap({ markers }) {
  const [hover, setHover] = useState(null);
  return (
    <svg className="map-svg" viewBox="0 0 1000 500" style={{overflow: 'visible'}}>
      {/* Abstract continents as simplified dotted blobs */}
      <g fill="#EDE3D0" stroke="none">
        {/* North America */}
        <path d="M120 120 Q180 80 260 100 Q320 120 300 200 Q290 260 220 270 Q160 260 130 220 Q100 170 120 120Z"/>
        {/* South America */}
        <path d="M260 290 Q300 280 310 340 Q300 410 270 430 Q240 410 250 350 Q250 310 260 290Z"/>
        {/* Europe */}
        <path d="M450 120 Q510 110 530 150 Q520 190 480 200 Q440 190 440 160 Q440 135 450 120Z"/>
        {/* Africa */}
        <path d="M470 220 Q520 210 540 270 Q540 350 500 380 Q460 370 450 320 Q450 260 470 220Z"/>
        {/* Asia */}
        <path d="M560 120 Q700 100 820 140 Q870 180 850 230 Q780 260 680 250 Q600 240 560 200 Q540 160 560 120Z"/>
        {/* Australia */}
        <path d="M790 330 Q850 325 870 360 Q860 395 820 400 Q780 395 780 365 Q780 345 790 330Z"/>
        {/* India subcontinent accent */}
        <path d="M700 220 Q730 215 740 255 Q720 285 700 280 Q685 260 690 235 Q695 225 700 220Z"/>
      </g>

      {/* Subtle grid dots */}
      <g fill="#E89B3C" opacity="0.12">
        {Array.from({length: 140}).map((_, i) => {
          const x = 80 + (i % 20) * 45;
          const y = 80 + Math.floor(i / 20) * 50;
          return <circle key={i} cx={x} cy={y} r="1"/>;
        })}
      </g>

      {/* Markers */}
      {markers.map((m, i) => (
        <g key={m.name}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          style={{cursor: 'pointer'}}
        >
          <circle className="map-dot" cx={m.x} cy={m.y} r={m.status === 'granted' ? 10 : 8}
            fill={m.status === 'granted' ? 'rgba(232,155,60,0.25)' : 'rgba(212,160,76,0.2)'}
            style={{animationDelay: `${i * 0.25}s`, transformOrigin: `${m.x}px ${m.y}px`}}
          />
          <circle cx={m.x} cy={m.y} r={m.status === 'granted' ? 5 : 4}
            fill={m.status === 'granted' ? '#E89B3C' : '#D4A04C'}
            stroke="#fff" strokeWidth="1.5"
          />
          {hover === i && (
            <g>
              <rect x={m.x - 70} y={m.y - 52} width="140" height="38" rx="8" fill="#2D1F0F"/>
              <text x={m.x} y={m.y - 34} textAnchor="middle" fontSize="11" fill="#FAF6EE" fontFamily="var(--font-display)" fontWeight="600">{m.name} — {m.status === 'granted' ? 'GRANTED' : 'PENDING'}</text>
              <text x={m.x} y={m.y - 20} textAnchor="middle" fontSize="9" fill="rgba(250,246,238,0.7)" fontFamily="var(--font-mono)">{m.detail}</text>
            </g>
          )}
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(40, 450)">
        <circle cx="6" cy="6" r="5" fill="#E89B3C"/>
        <text x="18" y="10" fontSize="11" fill="#6B4F2A" fontFamily="var(--font-mono)" letterSpacing="0.08em">GRANTED</text>
        <circle cx="110" cy="6" r="4" fill="#D4A04C"/>
        <text x="122" y="10" fontSize="11" fill="#6B4F2A" fontFamily="var(--font-mono)" letterSpacing="0.08em">PENDING</text>
      </g>
    </svg>
  );
}
window.Trust = Trust;

/* ==== FAQ (Section 11) ==== */
function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'What makes Ashwanova™ different from conventional ashwagandha extracts?',
      a: 'Ashwanova™ is a root-only, sustained-release Ashwagandha extract standardized to 4 percent or more USP withanolides. It is purpose-built using Nutriventia\u2019s patented EDGE™ technology to deliver controlled, all-day withanolide exposure from a single daily dose. Ashwanova™ is engineered to last, not spike, and to remain robust as regulatory and category expectations evolve.' },
    { q: 'Why does Ashwanova™ use only the root of Ashwagandha?',
      a: 'Ashwanova™ is built on first principles. Across Ayurveda, Siddha, and Unani systems, the root of Withania somnifera is the therapeutically relevant part of the plant. Current regulatory frameworks and classical references consistently recognize the root, while guidance around leaf usage remains fragmented across regions. By remaining root-only, Ashwanova™ aligns with tradition, science, and long-term regulatory clarity.' },
    { q: 'How does Ashwanova™ approach the question of Ashwagandha leaves?',
      a: 'Ashwanova™ takes a clarity-first approach rather than engaging in debate. Leaf-based Ashwagandha lacks consistent historical use, harmonized regulatory acceptance, and long-term clinical positioning across global markets. Ashwanova™ removes this ambiguity entirely by focusing exclusively on the plant part — the root — with enduring therapeutic and regulatory recognition.' },
    { q: 'What consumer benefits can be expected from Ashwanova™?',
      a: 'Across multiple human clinical studies, Ashwanova™ has demonstrated support for stress reduction, improved sleep quality, enhanced mood, cognitive clarity, emotional resilience, and healthier stress-related eating behavior. These benefits are delivered as comprehensive, all-day stress management from a single low dose.' },
    { q: 'How does the sustained-release technology work?',
      a: 'Ashwanova™ leverages Nutriventia\u2019s EDGE™ microbead matrix to deliver controlled, extended release of withanolides throughout the day. This design avoids sharp concentration spikes and rapid drop-offs, aligning ingredient performance with human stress physiology rather than dosing convenience alone.' },
    { q: 'What clinical evidence supports Ashwanova™?',
      a: 'Ashwanova™ is supported by three randomized, double-blind, placebo-controlled clinical trials and one human pharmacokinetic study, all published in peer-reviewed journals. Together, these studies demonstrate sustained plasma presence and statistically significant improvements in perceived stress, cortisol levels, sleep quality, and psychological well-being.' },
    { q: 'Can Ashwanova™ address both mental and physical aspects of stress?',
      a: 'Yes. Ashwanova™ works holistically by supporting regulation of cortisol and physiological stress responses, while also improving mood, cognitive performance, and emotional balance. Clinical data also show reductions in stress-related eating behavior, reflecting benefits across both psychological and metabolic dimensions.' },
    { q: 'How does Ashwanova™ support cognitive performance?',
      a: 'Using validated neurocognitive tools such as CANTAB, Ashwanova™ has demonstrated improvements in memory recall, visual memory, and sustained attention. By reducing stress and improving sleep quality, it helps create the conditions necessary for consistent mental clarity and focus.' },
    { q: 'What is the recommended dosage and formulation flexibility?',
      a: 'Ashwanova™ is clinically effective at doses starting at 150 mg once daily, enabled by its enhanced bioavailability and sustained-release design. Its clean-label, low-dose profile makes it suitable for a wide range of formats including capsules, tablets, gummies, stick packs, and ready-to-drink applications.' },
    { q: 'Is Ashwanova™ suitable for global formulations and future regulatory environments?',
      a: 'Yes. Ashwanova™ is GRAS self-affirmed, USP standardized, and Clean Label Project certified. It is designed to align with FDA, EFSA, and emerging global regulatory expectations. Its root-only design reduces reinterpretation risk as compliance frameworks continue to evolve, making it a durable choice for globally scalable formulations.' },
  ];
  return (
    <section className="section-pad" id="faq">
      <div className="container">
        <div style={{textAlign: 'center'}}>
          <span className="eyebrow" style={{color: 'var(--coffee-700)'}}>QUESTIONS, ANSWERED</span>
          <h2 className="display-l" style={{marginTop: 20, color: 'var(--coffee-900)'}}>What formulators ask us most.</h2>
        </div>
        <div className="faq">
          {items.map((it, i) => (
            <FAQItem key={i} {...it} isOpen={open === i} onClick={() => setOpen(open === i ? -1 : i)}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a, isOpen, onClick }) {
  const innerRef = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (innerRef.current) setH(innerRef.current.scrollHeight);
  }, []);
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-q" onClick={onClick}>
        <span>{q}</span>
        <span className="faq-icon"><window.Icon.Plus/></span>
      </button>
      <div className="faq-a" style={{maxHeight: isOpen ? h + 40 : 0}}>
        <div className="faq-a-inner" ref={innerRef}>{a}</div>
      </div>
    </div>
  );
}
window.FAQ = FAQ;

/* ==== Final CTA (Section 12) ==== */
function FinalCTA() {
  return (
    <section className="section-pad-lg final-cta" id="cta">
      <window.EmberParticles/>
      <div className="container" style={{position: 'relative', zIndex: 1, textAlign: 'center'}}>
        <span className="eyebrow">REQUEST THE DOSSIER</span>
        <h2 className="display-l" style={{marginTop: 20}}>Ready to look closer? We are.</h2>
        <p className="body-l sub">
          The full Ashwanova clinical file — pharmacokinetic data, USP withanolide profile, RDBPC trial summaries, CoA template, and regulatory documentation. Sent within 24 hours. No pitch. Just clarity.
        </p>
        <div style={{marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="https://www.nutriventia.com/contact-us/" target="_blank" rel="noopener noreferrer" className="btn btn-white btn-lg">Request the technical dossier <window.Icon.ArrowRight className="arrow"/></a>
        </div>
        <a href="formula-check.html" className="final-cta-link">
          → Or book a 20-minute consultation with the Nutriventia team
        </a>
      </div>
    </section>
  );
}
window.FinalCTA = FinalCTA;

/* ==== Footer (Section 13) ==== */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="nav-logo" style={{color: 'var(--cream-50)'}}>
              <span className="mark" aria-hidden="true"></span>
              <span>
                <span className="parent">Nutriventia</span>
                <span className="wordmark">Ashwanova™</span>
              </span>
            </div>
            <p className="footer-tagline">Verified root-only Ashwagandha since before the regulation required it.</p>
            <a href="mailto:sales@nutriventia.com" className="footer-email">sales@nutriventia.com</a>
            <div className="footer-socials">
              <a href="#" aria-label="LinkedIn"><window.Icon.LinkedIn/></a>
              <a href="#" aria-label="X"><window.Icon.X/></a>
              <a href="#" aria-label="Vimeo"><window.Icon.Vimeo/></a>
              <a href="#" aria-label="YouTube"><window.Icon.YouTube/></a>
            </div>
          </div>
          <div>
            <h5>Ashwanova</h5>
            <ul>
              <li><a href="#why">Why Ashwanova</a></li>
              <li><a href="#science">The Science</a></li>
              <li><a href="#science">Clinical Studies</a></li>
              <li><a href="#applications">Applications</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Latest Updates</a></li>
              <li><a href="#">E.D.G.E. Platform</a></li>
              <li><a href="#">All Health Offerings</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Stay Informed</h5>
            <p style={{color: 'rgba(250,246,238,0.55)', fontSize: 14, lineHeight: 1.55}}>New studies, formulation guides, and category insights — once a month.</p>
            <div className="newsletter">
              <input type="email" placeholder="your@email.com"/>
              <button aria-label="Subscribe"><window.Icon.ArrowRight/></button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Nutriventia. Designed by <a href="#" style={{color: 'var(--saffron-500)'}}>Side Kick</a>.</div>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
