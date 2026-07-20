/* eslint-disable */
// Artboard — MOBILE (390×844). Landing (scrollable) + app screens + tab bar.

const MW = 390, MH = 844;

// ── Phone chrome ─────────────────────────────────────────────
const MStatus = ({ dark }) => (
  <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 0 28px', fontFamily: 'var(--font)', color: 'var(--t-1)' }}>
    <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em' }}>9:41</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx=".5"/><rect x="4.5" y="5" width="3" height="6" rx=".5"/><rect x="9" y="2.5" width="3" height="8.5" rx=".5"/><rect x="13.5" y="0" width="3" height="11" rx=".5"/></svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M1 4a10 10 0 0 1 13 0"/><path d="M3.5 6.5a6 6 0 0 1 8 0"/><circle cx="7.5" cy="9.3" r=".8" fill="currentColor"/></svg>
      <svg width="25" height="11" viewBox="0 0 25 11" fill="none"><rect x=".5" y=".5" width="21" height="10" rx="2.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="7" rx="1.3" fill="currentColor"/><rect x="22.5" y="3.5" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".5"/></svg>
    </div>
  </div>
);

const MTabBar = ({ active = 'home' }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'create', icon: 'sparkle-fill', label: 'Create' },
    { id: 'gallery', icon: 'gallery', label: 'Gallery' },
    { id: 'profile', icon: 'user', label: 'Profile' },
  ];
  return (
    <div style={{ flexShrink: 0, padding: '8px 14px 26px', background: 'linear-gradient(to top, var(--bg) 72%, transparent)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: 7, borderRadius: 24, background: 'var(--bg-glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border-mid)', boxShadow: '0 16px 40px -12px oklch(0 0 0 / 0.5)' }}>
        {tabs.map(tb => {
          const on = tb.id === active;
          return (
            <div key={tb.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0 6px', borderRadius: 18, cursor: 'pointer', background: on ? 'var(--bg-2)' : 'transparent' }}>
              <span style={{ color: on ? 'var(--acc)' : 'var(--t-3)', display: 'flex' }}><Icon name={tb.icon} size={21} stroke={on ? 2 : 1.8}/></span>
              <span style={{ fontSize: 10, fontWeight: on ? 600 : 500, color: on ? 'var(--t-1)' : 'var(--t-3)' }}>{tb.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MScreen = ({ children, tab, noTab }) => (
  <div className="ab" style={{ display: 'flex', flexDirection: 'column' }}>
    <MStatus/>
    <div className="ab-scroll" style={{ flex: 1 }}>{children}</div>
    {!noTab && <MTabBar active={tab}/>}
  </div>
);

// ═══════════════════════════════════════════════════════════
// MOBILE LANDING (scrollable, no tab bar)
// ═══════════════════════════════════════════════════════════
const MobileLanding = () => {
  const [menu, setMenu] = React.useState(false);
  const feats = [
    { icon: 'sliders', title: 'Infographics', tone: 'oklch(0.34 0.07 200)' },
    { icon: 'magic', title: 'Photo Editing', tone: 'oklch(0.32 0.08 25)' },
    { icon: 'sofa', title: 'Interior Design', tone: 'oklch(0.33 0.06 130)' },
    { icon: 'box', title: 'Mockups', tone: 'oklch(0.32 0.07 300)' },
    { icon: 'scissors', title: 'Backgrounds', tone: 'oklch(0.34 0.06 250)' },
    { icon: 'palette', title: 'Patterns', tone: 'oklch(0.34 0.08 70)' },
  ];
  const steps = [
    { n: '01', icon: 'upload', title: 'Upload', desc: 'Drop a single product photo.' },
    { n: '02', icon: 'grid', title: 'Choose style', desc: 'Pick a preset that fits your listing.' },
    { n: '03', icon: 'sparkle-fill', title: 'Generate', desc: 'Four polished variants in minutes.' },
  ];
  const gal = [
    { h: 150, l: 'Infographic', tone: 'oklch(0.34 0.07 200)' },
    { h: 110, l: 'Interior', tone: 'oklch(0.33 0.06 130)' },
    { h: 120, l: 'Mockup', tone: 'oklch(0.32 0.07 300)' },
    { h: 150, l: 'Pattern', tone: 'oklch(0.34 0.08 70)' },
  ];
  return (
    <div className="ab" style={{ display: 'flex', flexDirection: 'column' }}>
      <MStatus/>
      {/* nav */}
      <div style={{ flexShrink: 0, height: 56, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
        <ArtboardMark size={20}/>
        <div style={{ flex: 1 }}/>
        <button onClick={() => setMenu(m => !m)} style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name={menu ? 'close' : 'menu'} size={20}/></button>
      </div>
      {menu && (
        <div style={{ flexShrink: 0, padding: '12px 20px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg-1)' }}>
          {['Features', 'Pricing', 'Gallery', 'Docs'].map(l => <div key={l} className="ab-nav-link" style={{ padding: '11px 0', fontSize: 15 }}>{l}</div>)}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}><LangSwitch/></div>
        </div>
      )}
      <div className="ab-scroll" style={{ flex: 1 }}>
        {/* hero */}
        <div style={{ padding: '28px 22px 36px', position: 'relative', overflow: 'hidden' }}>
          <div className="ab-glow" style={{ width: 320, height: 260, background: 'var(--acc)', top: -100, left: '50%', transform: 'translateX(-50%)', opacity: 0.12 }}/>
          <div className="ab-chip ab-chip-acc" style={{ marginBottom: 18 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', animation: 'ab-blink 1.5s ease infinite' }}/> AI visuals for sellers</div>
          <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.02, margin: 0 }}>Stunning <span style={{ color: 'var(--acc)' }}>marketplace visuals</span> in seconds</h1>
          <p className="ab-body" style={{ fontSize: 15.5, marginTop: 16 }}>Turn a plain product photo into polished infographics and listing-ready cards — no studio, no designer.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
            <button className="ab-btn ab-btn-grad ab-btn-full ab-btn-lg">Start generating free <Icon name="arrow-right" size={17} stroke={2.2}/></button>
            <button className="ab-btn ab-btn-ghost ab-btn-full ab-btn-lg"><Icon name="play" size={12}/> Watch demo</button>
          </div>
          <div style={{ marginTop: 24 }}>
            <BeforeAfter height={300} radius={18}/>
          </div>
        </div>
        {/* logos */}
        <div style={{ padding: '0 22px 32px' }}>
          <div className="ab-eyebrow" style={{ textAlign: 'center', marginBottom: 16, fontSize: 10 }}>Trusted on every marketplace</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 20px', justifyContent: 'center', padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {['Wildberries', 'Ozon', 'Uzum', 'Yandex'].map(l => <span key={l} style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--t-2)', opacity: 0.55 }}>{l}</span>)}
          </div>
        </div>
        {/* features */}
        <div style={{ padding: '12px 22px 36px' }}>
          <SectionHead center tag="Six tools" title="Everything to sell better"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
            {feats.map(f => (
              <div key={f.title} className="ab-card" style={{ padding: 14 }}>
                <div style={{ height: 76, borderRadius: 11, background: f.tone, position: 'relative', overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 8px)' }}/>
                  <div style={{ position: 'absolute', top: 10, left: 10, width: 32, height: 32, borderRadius: 10, background: 'oklch(0 0 0 / 0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(1 0 0 / 0.95)' }}><Icon name={f.icon} size={17}/></div>
                </div>
                <div className="ab-h4" style={{ fontSize: 14.5 }}>{f.title}</div>
              </div>
            ))}
          </div>
        </div>
        {/* how it works */}
        <div style={{ padding: '12px 22px 36px', background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <SectionHead center tag="How it works" title="Three steps"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
            {steps.map((s, i) => (
              <div key={s.n} className="ab-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg)' }}>
                <div style={{ width: 50, height: 50, borderRadius: 15, flexShrink: 0, background: i === 2 ? 'var(--acc)' : 'var(--bg-2)', color: i === 2 ? 'var(--acc-ink)' : 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={24}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="ab-mono" style={{ color: 'var(--acc)', fontSize: 11 }}>{s.n}</span><span className="ab-h4" style={{ fontSize: 16 }}>{s.title}</span></div>
                  <div className="ab-body" style={{ fontSize: 13, marginTop: 3 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* gallery */}
        <div style={{ padding: '24px 22px 36px' }}>
          <SectionHead tag="Gallery" title="Made with Artboard"/>
          <div style={{ columnCount: 2, columnGap: 12, marginTop: 22 }}>
            {gal.map((g, i) => (
              <div key={i} style={{ breakInside: 'avoid', marginBottom: 12, borderRadius: 13, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative' }}>
                <div style={{ height: g.h, background: g.tone, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 9px)' }}/>
                  <div style={{ position: 'absolute', top: 9, left: 9, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', padding: '3px 7px', borderRadius: 100 }}>{g.l.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* pricing */}
        <div style={{ padding: '12px 22px 36px' }}>
          <SectionHead center tag="Pricing" title="Plans that scale"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
            {[
              { name: 'Starter', price: '0', credits: '30 credits / mo', sel: false },
              { name: 'Pro', price: '24', credits: '500 credits / mo', sel: true, save: 'Most popular' },
              { name: 'Business', price: '79', credits: '2,000 credits / mo', sel: false },
            ].map(t => (
              <div key={t.name} style={{ padding: 20, borderRadius: 20, position: 'relative', background: t.sel ? 'linear-gradient(160deg, oklch(0.89 0.2 132 / 0.10), var(--bg-1))' : 'var(--bg-1)', border: `1.5px solid ${t.sel ? 'var(--acc)' : 'var(--border)'}` }}>
                {t.save && <div style={{ position: 'absolute', top: -11, left: 20, background: 'var(--acc)', color: 'var(--acc-ink)', fontSize: 9, fontWeight: 700, padding: '4px 11px', borderRadius: 100, fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{t.save.toUpperCase()}</div>}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div>
                    <div className="ab-h4" style={{ fontSize: 17 }}>{t.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}><span style={{ fontSize: 14, color: 'var(--t-3)' }}>$</span><span style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.04em' }}>{t.price}</span><span className="ab-body" style={{ fontSize: 13 }}>/mo</span></div>
                  </div>
                  <button className={t.sel ? 'ab-btn ab-btn-primary ab-btn-sm' : 'ab-btn ab-btn-ghost ab-btn-sm'}>{t.price === '0' ? 'Start' : 'Choose'}</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '9px 12px', background: 'var(--bg-2)', borderRadius: 10 }}><Icon name="bolt" size={14} style={{ color: 'var(--acc)' }}/><span style={{ fontSize: 12.5, fontWeight: 600 }}>{t.credits}</span></div>
              </div>
            ))}
          </div>
        </div>
        {/* FAQ */}
        <div style={{ padding: '12px 22px 36px', background: 'var(--bg-1)', borderTop: '1px solid var(--border)' }}>
          <SectionHead tag="FAQ" title="Questions, answered"/>
          <div style={{ marginTop: 16 }}>
            <FaqItem q="Do I need design skills?" a="None. Upload a photo, pick a preset, and Artboard handles the rest." defaultOpen/>
            <FaqItem q="Which marketplaces work?" a="Exports include presets for Wildberries, Ozon, Uzum, Yandex, and more."/>
            <FaqItem q="Can I generate UZ/RU text?" a="Yes — on-image text can be UZ, RU, or EN, switchable per generation."/>
          </div>
        </div>
        {/* footer CTA */}
        <div style={{ padding: '32px 22px 40px' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--grad)', padding: '32px 24px', textAlign: 'center', color: 'var(--acc-ink)', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(0 0 0 / 0.04) 0 1px, transparent 1px 14px)' }}/>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.1 }}>Your next best-seller starts with one photo.</div>
              <button className="ab-btn ab-btn-full ab-btn-lg" style={{ marginTop: 22, background: 'var(--acc-ink)', color: 'var(--acc)' }}>Start free <Icon name="arrow-right" size={16} stroke={2.2}/></button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28 }}>
            <ArtboardMark size={19}/>
            <LangSwitch compact/>
          </div>
          <div className="ab-body" style={{ fontSize: 12, marginTop: 16, textAlign: 'center' }}>© 2026 Artboard. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MW, MH, MStatus, MTabBar, MScreen, MobileLanding });
