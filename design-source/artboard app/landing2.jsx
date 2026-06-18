/* eslint-disable */
// Artboard — Landing page, part 2: gallery, demo, pricing, testimonials, FAQ, footer

// ── STYLE SHOWCASE (masonry) ─────────────────────────────────
const Gallery = () => {
  const items = [
    { h: 300, label: 'Infographic', style: 'Glass', tone: 'oklch(0.34 0.07 200)' },
    { h: 220, label: 'Interior', style: 'Boutique', tone: 'oklch(0.33 0.06 130)' },
    { h: 260, label: 'Mockup', style: 'Flagship', tone: 'oklch(0.32 0.07 300)' },
    { h: 240, label: 'Lifestyle', style: 'Cards', tone: 'oklch(0.36 0.08 25)' },
    { h: 300, label: 'Pattern', style: 'Textile', tone: 'oklch(0.34 0.08 70)' },
    { h: 220, label: 'Background', style: 'Studio', tone: 'oklch(0.32 0.05 250)' },
    { h: 260, label: 'Infographic', style: 'Bold', tone: 'oklch(0.34 0.09 340)' },
    { h: 240, label: 'Interior', style: 'Minimal', tone: 'oklch(0.3 0.04 200)' },
  ];
  return (
    <Section id="gallery">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <SectionHead tag="Gallery" title="Made with Artboard" sub="Real outputs across every tool and style preset."/>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Infographics', 'Interiors', 'Mockups', 'Patterns'].map((t, i) => (
            <span key={t} className={i === 0 ? 'ab-chip ab-chip-acc' : 'ab-chip'} style={{ cursor: 'pointer' }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ columnCount: 4, columnGap: 18 }}>
        {items.map((it, i) => (
          <div key={i} style={{ breakInside: 'avoid', marginBottom: 18, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', cursor: 'pointer' }}>
            <div style={{ height: it.h, background: it.tone, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)' }}/>
              <div className="ab-glow" style={{ width: 160, height: 100, background: 'oklch(1 0 0)', top: -40, right: -20, opacity: 0.06 }}/>
              <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 100 }}>{it.label.toUpperCase()}</div>
              <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)' }}/>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'oklch(1 0 0 / 0.92)' }}>{it.style}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ── INTERACTIVE DEMO BLOCK ───────────────────────────────────
const DemoBlock = () => {
  const presets = ['Infographic', 'Lifestyle', 'Studio', 'Interior'];
  const [sel, setSel] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const tones = ['oklch(0.34 0.07 200)', 'oklch(0.36 0.08 25)', 'oklch(0.3 0.03 250)', 'oklch(0.33 0.06 130)'];
  const run = () => { setBusy(true); setTimeout(() => setBusy(false), 1600); };
  return (
    <Section id="demo">
      <div className="ab-card" style={{ borderRadius: 28, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative' }}>
        <div className="ab-glow" style={{ width: 420, height: 300, background: 'var(--acc)', top: -120, left: '30%', opacity: 0.08 }}/>
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', minHeight: 460 }}>
          {/* control panel */}
          <div style={{ padding: 32, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div className="ab-chip ab-chip-acc" style={{ alignSelf: 'flex-start', marginBottom: 20 }}><Icon name="wand" size={12}/> Try it live</div>
            <div className="ab-h3" style={{ fontSize: 24 }}>Generate a sample</div>
            <div className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>Pick a style and hit generate — no signup.</div>

            <div className="ab-eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>Style preset</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {presets.map((pre, i) => (
                <button key={pre} onClick={() => setSel(i)} style={{
                  padding: '14px 12px', borderRadius: 13, textAlign: 'left', cursor: 'pointer',
                  background: sel === i ? 'var(--acc-soft)' : 'var(--bg-2)',
                  border: `1.5px solid ${sel === i ? 'var(--acc)' : 'var(--border)'}`,
                  color: sel === i ? 'var(--acc)' : 'var(--t-2)', transition: 'all .15s ease',
                }}>
                  <Icon name={['sliders','sparkle-fill','image','sofa'][i]} size={18}/>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{pre}</div>
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }}/>
            <button onClick={run} className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 28 }} disabled={busy}>
              {busy ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--acc-ink)', borderTopColor: 'transparent', display: 'inline-block', animation: 'ab-spin .7s linear infinite' }}/> Generating…</> : <><Icon name="sparkle-fill" size={17}/> Generate · 1 credit</>}
            </button>
          </div>
          {/* preview */}
          <div style={{ padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '100%', maxWidth: 460, aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', background: tones[sel], transition: 'background .4s ease' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 11px)' }}/>
              <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '78%', borderRadius: '46% 46% 0 0 / 26% 26% 0 0', background: 'radial-gradient(ellipse at 50% 28%, oklch(1 0 0 / 0.18), transparent)' }}/>
              {busy && <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: 'var(--acc)', boxShadow: '0 0 20px var(--acc)', animation: 'ab-blink 0.8s ease infinite' }}/>}
              <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: busy ? 'var(--acc)' : 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.45)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100, fontWeight: 600 }}>
                {busy ? 'RENDERING…' : `${presets[sel].toUpperCase()} · READY`}
              </div>
              <div style={{ position: 'absolute', bottom: 14, right: 14, display: 'flex', gap: 7 }}>
                <button style={{ width: 36, height: 36, borderRadius: 10, background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(8px)', border: '1px solid oklch(1 0 0 / 0.15)', color: 'oklch(1 0 0 / 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="download" size={16}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

// ── PRICING ──────────────────────────────────────────────────
const Pricing = () => {
  const tiers = [
    { name: 'Starter', price: '0', unit: '/mo', desc: 'For trying things out', credits: '30 credits / mo', sel: false,
      feats: ['All 6 tools', 'Standard quality', '720p exports', 'Community support'] },
    { name: 'Pro', price: '24', unit: '/mo', desc: 'For active sellers', credits: '500 credits / mo', sel: true, save: 'Most popular',
      feats: ['Everything in Starter', 'Priority generation · 2×', 'HD & 4K exports', 'Marketplace size presets', 'Commercial license', 'No watermark'] },
    { name: 'Business', price: '79', unit: '/mo', desc: 'For teams & agencies', credits: '2,000 credits / mo', sel: false,
      feats: ['Everything in Pro', '5 team seats', 'Brand kit & presets', 'API access', 'Dedicated support'] },
  ];
  return (
    <Section id="pricing">
      <SectionHead center tag="Pricing" title="Plans that scale with your store" sub="Start free. Upgrade when you’re ready. Cancel anytime — pay with Click, Payme, or card."/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 48, alignItems: 'start' }}>
        {tiers.map(t => (
          <div key={t.name} style={{
            padding: 28, borderRadius: 24, position: 'relative',
            background: t.sel ? 'linear-gradient(165deg, oklch(0.89 0.2 132 / 0.10), var(--bg-1))' : 'var(--bg-1)',
            border: `1.5px solid ${t.sel ? 'var(--acc)' : 'var(--border)'}`,
            boxShadow: t.sel ? '0 30px 70px -34px var(--acc-line)' : 'none',
          }}>
            {t.save && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--acc)', color: 'var(--acc-ink)', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 100, letterSpacing: '0.06em', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{t.save.toUpperCase()}</div>}
            <div className="ab-h4" style={{ fontSize: 18 }}>{t.name}</div>
            <div className="ab-body" style={{ fontSize: 13, marginTop: 4 }}>{t.desc}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 20 }}>
              <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--t-3)' }}>$</span>
              <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-0.04em' }}>{t.price}</span>
              <span className="ab-body" style={{ fontSize: 14 }}>{t.unit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 14px', background: 'var(--bg-2)', borderRadius: 12 }}>
              <Icon name="bolt" size={16} style={{ color: 'var(--acc)' }}/>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t.credits}</span>
            </div>
            <button className={t.sel ? 'ab-btn ab-btn-primary ab-btn-full' : 'ab-btn ab-btn-ghost ab-btn-full'} style={{ marginTop: 18 }}>{t.price === '0' ? 'Start free' : `Choose ${t.name}`}</button>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.feats.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.sel ? 'var(--acc)' : 'var(--bg-3)', color: t.sel ? 'var(--acc-ink)' : 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="check" size={12} stroke={3}/></span>
                  <span style={{ fontSize: 13.5, color: 'var(--t-2)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ── TESTIMONIALS ─────────────────────────────────────────────
const Testimonials = () => {
  const quotes = [
    { q: 'We replaced a $400/shoot photographer with Artboard. Our infographics convert better than the originals.', who: 'Dilnoza R.', role: 'Brio Outwear · Uzum', init: 'DR', tone: 'var(--v-blue)' },
    { q: 'Background replacement alone saves me three hours a week. The cutouts are genuinely clean.', who: 'Marat S.', role: 'TechHub · Ozon', init: 'MS', tone: 'var(--v-violet)' },
    { q: 'Interior staging for our furniture listings looks like a real studio set. Customers ask which showroom it is.', who: 'Aziza K.', role: 'Uy Decor · Wildberries', init: 'AK', tone: 'var(--v-amber)' },
    { q: 'I launched 60 product cards in a weekend. Before Artboard that was a month of designer back-and-forth.', who: 'Bekzod T.', role: 'Sport Pro · Yandex', init: 'BT', tone: 'var(--acc)' },
  ];
  return (
    <Section id="testimonials" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <SectionHead center tag="Loved by sellers" title="Results, not just renders"/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginTop: 44 }}>
        {quotes.map((c, i) => (
          <div key={i} className="ab-card" style={{ padding: 26, background: 'var(--bg)' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>{[1,2,3,4,5].map(s => <Icon key={s} name="star-fill" size={14} style={{ color: 'var(--acc)' }}/>)}</div>
            <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.5, color: 'var(--t-1)' }}>“{c.q}”</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.tone, color: 'oklch(1 0 0 / 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, border: '1px solid var(--border-mid)' }}>{c.init}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.who}</div>
                <div className="ab-body" style={{ fontSize: 12.5 }}>{c.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ── FAQ ──────────────────────────────────────────────────────
const FAQ = () => {
  const faqs = [
    { q: 'Do I need any design skills?', a: 'None at all. Upload a product photo, pick a style preset, and Artboard handles composition, lighting, and text. You can fine-tune with a prompt if you want.', open: true },
    { q: 'Which marketplaces are supported?', a: 'Exports come with size presets for Wildberries, Ozon, Uzum, Yandex Market, and more — including the exact pixel dimensions each platform requires.' },
    { q: 'Can I generate text in Uzbek or Russian?', a: 'Yes. On-image text can be generated in UZ, RU, or EN, and you can switch languages per generation without re-uploading.' },
    { q: 'What about commercial rights?', a: 'Pro and Business plans include a full commercial license. Everything you generate is yours to use in listings and ads.' },
    { q: 'How do credits work?', a: 'Each generation uses credits based on quality and tool. Unused monthly credits roll over for 30 days on paid plans.' },
  ];
  return (
    <Section id="faq">
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 64 }}>
        <div>
          <SectionHead tag="FAQ" title="Questions, answered"/>
          <div className="ab-body" style={{ fontSize: 15, marginTop: 18 }}>Can’t find what you’re looking for?</div>
          <button className="ab-btn ab-btn-ghost" style={{ marginTop: 16 }}><Icon name="send" size={15}/> Contact support</button>
        </div>
        <div>
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={f.open}/>)}
        </div>
      </div>
    </Section>
  );
};

// ── CTA + FOOTER ─────────────────────────────────────────────
const FooterCTA = ({ hideCTA }) => (
  <Section id="footer" pad="0 100px 56px">
    {/* big CTA */}
    {!hideCTA && (
    <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--grad)', padding: '64px 56px', marginBottom: 72, textAlign: 'center', color: 'var(--acc-ink)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(0 0 0 / 0.04) 0 1px, transparent 1px 16px)' }}/>
      <div style={{ position: 'relative' }}>
        <div className="ab-h1" style={{ fontSize: 46, color: 'var(--acc-ink)' }}>Your next best-selling listing<br/>starts with one photo.</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <button className="ab-btn ab-btn-lg" style={{ background: 'var(--acc-ink)', color: 'var(--acc)' }}>Start generating free <Icon name="arrow-right" size={17} stroke={2.2}/></button>
          <button className="ab-btn ab-btn-lg" style={{ background: 'oklch(0 0 0 / 0.12)', color: 'var(--acc-ink)', border: '1px solid oklch(0 0 0 / 0.2)' }}>Book a demo</button>
        </div>
      </div>
    </div>
    )}
    {/* footer */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40, paddingBottom: 40 }}>
      <div>
        <ArtboardMark size={22}/>
        <div className="ab-body" style={{ fontSize: 13.5, marginTop: 16, maxWidth: 260 }}>AI-generated marketplace visuals for sellers across Central Asia and beyond.</div>
        <div style={{ marginTop: 20 }}><LangSwitch/></div>
      </div>
      {[
        { h: 'Product', links: ['Features', 'Pricing', 'Gallery', 'Changelog', 'Roadmap'] },
        { h: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
        { h: 'Resources', links: ['Docs', 'API', 'Marketplace guides', 'Support'] },
      ].map(col => (
        <div key={col.h}>
          <div className="ab-eyebrow" style={{ marginBottom: 16 }}>{col.h}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {col.links.map(l => <span key={l} className="ab-nav-link" style={{ fontSize: 13.5 }}>{l}</span>)}
          </div>
        </div>
      ))}
    </div>
    {/* bottom bar */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: '1px solid var(--border)' }}>
      <span className="ab-body" style={{ fontSize: 13 }}>© 2026 Artboard. All rights reserved.</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span className="ab-nav-link" style={{ fontSize: 13 }}>Privacy</span>
        <span className="ab-nav-link" style={{ fontSize: 13 }}>Terms</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['globe', 'send', 'heart'].map(ic => (
            <div key={ic} style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-3)', cursor: 'pointer' }}><Icon name={ic} size={16}/></div>
          ))}
        </div>
      </div>
    </div>
    {/* newsletter */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28, padding: 20, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 16 }}>
      <div style={{ flex: 1 }}>
        <div className="ab-h4" style={{ fontSize: 16 }}>Get product updates</div>
        <div className="ab-body" style={{ fontSize: 13, marginTop: 3 }}>New tools and styles, monthly. No spam.</div>
      </div>
      <div style={{ display: 'flex', gap: 8, width: 380 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 44, background: 'var(--bg)', border: '1px solid var(--border-mid)', borderRadius: 12, color: 'var(--t-3)' }}>
          <Icon name="send" size={15}/><span style={{ fontSize: 14 }}>you@store.com</span>
        </div>
        <button className="ab-btn ab-btn-primary">Subscribe</button>
      </div>
    </div>
  </Section>
);

Object.assign(window, { Gallery, DemoBlock, Pricing, Testimonials, FAQ, FooterCTA });
