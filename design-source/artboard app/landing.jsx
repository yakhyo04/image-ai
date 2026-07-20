/* eslint-disable */
// Artboard — Landing page, part 1: nav, hero, logos, features, how-it-works

const PAGE_W = 1440;

// shared section container
const Section = ({ children, pad = '96px 100px', style = {}, id }) => (
  <div data-screen-label={id} style={{ padding: pad, position: 'relative', ...style }}>{children}</div>
);

// ── NAV ──────────────────────────────────────────────────────
const LandingNav = () => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 50, height: 70,
    display: 'flex', alignItems: 'center', gap: 18, padding: '0 40px',
    background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--border)',
  }}>
    <ArtboardMark size={23}/>
    <div style={{ display: 'flex', gap: 26, marginLeft: 30 }}>
      {['Features', 'Pricing', 'Gallery', 'Docs'].map(l => <span key={l} className="ab-nav-link">{l}</span>)}
    </div>
    <div style={{ flex: 1 }}/>
    <LangSwitch/>
    <span className="ab-nav-link">Log in</span>
    <button className="ab-btn ab-btn-grad ab-btn-sm" style={{ padding: '10px 18px' }}>Get Started <Icon name="arrow-right" size={15} stroke={2.2}/></button>
  </div>
);

// ── HERO ─────────────────────────────────────────────────────
const LandingHero = () => (
  <Section id="hero" pad="72px 100px 80px" style={{ overflow: 'hidden' }}>
    <div className="ab-glow" style={{ width: 560, height: 420, background: 'var(--acc)', top: -120, left: '50%', transform: 'translateX(-50%)', opacity: 0.10 }}/>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative' }}>
      <div>
        <div className="ab-chip ab-chip-acc" style={{ marginBottom: 22 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', animation: 'ab-blink 1.5s ease infinite' }}/>
          AI visuals for marketplace sellers
        </div>
        <h1 className="ab-display" style={{ fontSize: 60 }}>
          Generate stunning <span style={{ color: 'var(--acc)' }}>marketplace visuals</span> in seconds
        </h1>
        <p className="ab-body" style={{ fontSize: 18, marginTop: 22, maxWidth: 460 }}>
          Turn a plain product photo into polished infographics, lifestyle shots, and listing-ready cards — no studio, no designer, no waiting.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button className="ab-btn ab-btn-grad ab-btn-lg">Start generating free <Icon name="arrow-right" size={17} stroke={2.2}/></button>
          <button className="ab-btn ab-btn-ghost ab-btn-lg"><Icon name="play" size={13}/> Watch demo</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {['var(--v-blue)', 'var(--v-violet)', 'var(--v-amber)', 'var(--acc)'].map((c, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid var(--bg)', marginLeft: i ? -8 : 0 }}/>
              ))}
            </div>
            <span className="ab-body" style={{ fontSize: 13 }}>2,400+ sellers</span>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[1,2,3,4,5].map(i => <Icon key={i} name="star-fill" size={14} style={{ color: 'var(--acc)' }}/>)}
            <span className="ab-body" style={{ fontSize: 13, marginLeft: 4 }}>4.9 / 5</span>
          </div>
        </div>
      </div>
      {/* hero preview — before/after */}
      <div style={{ position: 'relative' }}>
        <div className="ab-card" style={{ padding: 14, borderRadius: 26, boxShadow: 'var(--sh-pop)', background: 'var(--bg-1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['var(--err)', 'var(--warn)', 'var(--ok)'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }}/>)}
            </div>
            <span className="ab-mono" style={{ color: 'var(--t-3)', marginLeft: 6 }}>artboard.ai / generate</span>
            <span className="ab-chip ab-chip-acc" style={{ marginLeft: 'auto', padding: '3px 9px', fontSize: 10 }}><Icon name="bolt-fill" size={10}/> 1.8s</span>
          </div>
          <BeforeAfter height={400} radius={16}/>
        </div>
        <div style={{ position: 'absolute', bottom: -18, left: -22, background: 'var(--bg-1)', border: '1px solid var(--border-mid)', borderRadius: 14, padding: '12px 16px', boxShadow: 'var(--sh-2)', display: 'flex', alignItems: 'center', gap: 10, animation: 'ab-float 4s ease-in-out infinite' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--acc-soft)', color: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="sparkle-fill" size={17}/></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>+38% conversion</div>
            <div className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 10 }}>avg. listing uplift</div>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

// ── LOGO STRIP ───────────────────────────────────────────────
const LogoStrip = () => {
  const logos = ['Wildberries', 'Ozon', 'Uzum', 'Yandex Market', 'KazanExpress', 'AliExpress'];
  return (
    <Section id="logos" pad="0 100px 64px">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <span className="ab-eyebrow">Trusted by sellers on every major marketplace</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '28px 40px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {logos.map(l => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 9, opacity: 0.55, filter: 'grayscale(1)' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--t-3)', opacity: 0.4 }}/>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--t-2)' }}>{l}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ── FEATURES GRID ────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, tone, span }) => (
  <div className="ab-card" style={{ padding: 22, gridColumn: span, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    {/* mini visual */}
    <div style={{ height: 116, borderRadius: 14, marginBottom: 18, position: 'relative', overflow: 'hidden', background: tone, border: '1px solid var(--border-mid)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 9px)' }}/>
      <div style={{ position: 'absolute', top: 12, left: 12, width: 38, height: 38, borderRadius: 11, background: 'oklch(0 0 0 / 0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(1 0 0 / 0.95)' }}><Icon name={icon} size={20}/></div>
      {/* faux UI bits */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', gap: 6 }}>
        <div style={{ flex: 2, height: 8, borderRadius: 4, background: 'oklch(1 0 0 / 0.25)' }}/>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--acc)', opacity: 0.85 }}/>
      </div>
    </div>
    <div className="ab-h4" style={{ fontSize: 16.5 }}>{title}</div>
    <div className="ab-body" style={{ fontSize: 13.5, marginTop: 7 }}>{desc}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, color: 'var(--acc)', fontSize: 13, fontWeight: 600 }}>Learn more <Icon name="arrow-right" size={14} stroke={2.2}/></div>
  </div>
);

const FeaturesGrid = () => {
  const feats = [
    { icon: 'sliders', title: 'Marketplace Infographics', desc: 'Auto-generate feature callouts, badges, and benefit text sized for every marketplace.', tone: 'oklch(0.34 0.07 200)' },
    { icon: 'magic', title: 'Photo Editing', desc: 'Inpaint, retouch, and restyle with a simple brush-and-prompt workflow.', tone: 'oklch(0.32 0.08 25)' },
    { icon: 'sofa', title: 'Interior Design', desc: 'Drop furniture and decor into staged rooms, or restyle a space in any aesthetic.', tone: 'oklch(0.33 0.06 130)' },
    { icon: 'box', title: 'Product Mockups', desc: 'Wrap your design onto packaging, apparel, and devices in photoreal scenes.', tone: 'oklch(0.32 0.07 300)' },
    { icon: 'scissors', title: 'Background Replacement', desc: 'One-click cutouts with clean edges, then any backdrop you can describe.', tone: 'oklch(0.34 0.06 250)' },
    { icon: 'palette', title: 'Pattern Design', desc: 'Seamless, tileable patterns and textures for textiles, packaging, and prints.', tone: 'oklch(0.34 0.08 70)' },
  ];
  return (
    <Section id="features">
      <SectionHead center tag="Six tools, one studio" title="Everything you need to sell better" sub="A complete visual toolkit built for marketplace sellers — not a general-purpose image generator."/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 48 }}>
        {feats.map(f => <FeatureCard key={f.title} {...f}/>)}
      </div>
    </Section>
  );
};

// ── HOW IT WORKS ─────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    { n: '01', icon: 'upload', title: 'Upload', desc: 'Drop a single product photo — phone snapshot is fine.', tone: 'var(--v-blue)' },
    { n: '02', icon: 'grid', title: 'Choose style', desc: 'Pick a preset: infographic, lifestyle, studio, interior, mockup.', tone: 'var(--v-violet)' },
    { n: '03', icon: 'sparkle-fill', title: 'Generate', desc: 'Get four polished, marketplace-ready variants in under two minutes.', tone: 'var(--acc)' },
  ];
  return (
    <Section id="how" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <SectionHead center tag="How it works" title="Three steps to a better listing" sub="No briefs, no revisions, no back-and-forth. From raw photo to ready in minutes."/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 52, position: 'relative' }}>
        {/* connecting line */}
        <div style={{ position: 'absolute', top: 54, left: '17%', right: '17%', height: 2, background: 'repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 16px)' }}/>
        {steps.map((s, i) => (
          <div key={s.n} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 108, height: 108, borderRadius: 28, margin: '0 auto', background: 'var(--bg)', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'var(--sh-2)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 17, background: i === 2 ? 'var(--acc)' : 'var(--bg-2)', color: i === 2 ? 'var(--acc-ink)' : s.tone, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={28}/></div>
              <span style={{ position: 'absolute', top: -10, right: -6, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--acc)', background: 'var(--acc-soft)', border: '1px solid var(--acc-line)', padding: '2px 8px', borderRadius: 100 }}>{s.n}</span>
            </div>
            <div className="ab-h3" style={{ fontSize: 21, marginTop: 24 }}>{s.title}</div>
            <div className="ab-body" style={{ fontSize: 14.5, marginTop: 10, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </Section>
  );
};

Object.assign(window, { PAGE_W, Section, LandingNav, LandingHero, LogoStrip, FeaturesGrid, HowItWorks });
