/* eslint-disable */
// Artboard — MOBILE app screens: home, generate, progress, result, gallery

// ── HOME ─────────────────────────────────────────────────────
const MobileHome = () => {
  const tools = [
    { icon: 'sliders', title: 'Infographics', tone: 'oklch(0.34 0.07 200)', hot: true },
    { icon: 'magic', title: 'Photo Editor', tone: 'oklch(0.32 0.08 25)' },
    { icon: 'sofa', title: 'Interior', tone: 'oklch(0.33 0.06 130)' },
    { icon: 'box', title: 'Mockups', tone: 'oklch(0.32 0.07 300)' },
    { icon: 'scissors', title: 'Backgrounds', tone: 'oklch(0.34 0.06 250)' },
    { icon: 'palette', title: 'Patterns', tone: 'oklch(0.34 0.08 70)', neu: true },
  ];
  const recent = ['oklch(0.36 0.08 25)', 'oklch(0.34 0.07 200)', 'oklch(0.32 0.07 300)'];
  return (
    <MScreen tab="home">
      <div style={{ padding: '4px 22px 24px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div className="ab-eyebrow" style={{ fontSize: 10 }}>Thu, May 1</div>
            <div className="ab-h2" style={{ fontSize: 27, marginTop: 4 }}>Hi, Dilnoza</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 12px', borderRadius: 11, background: 'var(--acc-soft)', border: '1px solid var(--acc-line)', color: 'var(--acc)', fontWeight: 700, fontSize: 13 }}><Icon name="bolt" size={14}/> 500</div>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--v-blue)', color: 'oklch(1 0 0 / 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>DR</div>
          </div>
        </div>
        {/* hero CTA */}
        <div style={{ borderRadius: 22, overflow: 'hidden', background: 'var(--grad)', padding: '22px', color: 'var(--acc-ink)', position: 'relative', marginBottom: 28 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(0 0 0 / 0.04) 0 1px, transparent 1px 13px)' }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: 220 }}>Turn one photo into a full listing</div>
            <button className="ab-btn ab-btn-lg" style={{ marginTop: 18, background: 'var(--acc-ink)', color: 'var(--acc)' }}><Icon name="sparkle-fill" size={16}/> New generation</button>
          </div>
        </div>
        {/* tools grid */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="ab-h4" style={{ fontSize: 17 }}>Tools</div>
          <span className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 11 }}>06</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {tools.map(tl => (
            <div key={tl.title} style={{ borderRadius: 18, overflow: 'hidden', background: tl.tone, border: '1px solid var(--border-mid)', padding: 16, height: 130, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 9px)' }}/>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'oklch(0 0 0 / 0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(1 0 0 / 0.95)' }}><Icon name={tl.icon} size={19}/></div>
                {(tl.hot || tl.neu) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, padding: '3px 6px', borderRadius: 6, background: tl.hot ? 'var(--acc)' : 'oklch(0 0 0 / 0.35)', color: tl.hot ? 'var(--acc-ink)' : 'oklch(1 0 0 / 0.9)', letterSpacing: '0.06em' }}>{tl.hot ? 'HOT' : 'NEW'}</span>}
              </div>
              <div style={{ position: 'relative', fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'oklch(1 0 0 / 0.95)' }}>{tl.title}</div>
            </div>
          ))}
        </div>
        {/* recent */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '28px 0 16px' }}>
          <div className="ab-h4" style={{ fontSize: 17 }}>Recent</div>
          <span style={{ fontSize: 12.5, color: 'var(--acc)' }}>See all</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {recent.map((c, i) => (
            <div key={i} style={{ aspectRatio: '3/4', borderRadius: 13, background: c, border: '1px solid var(--border-mid)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 8px)' }}/>
            </div>
          ))}
        </div>
      </div>
    </MScreen>
  );
};

// ── GENERATE (create) ────────────────────────────────────────
const MobileGenerate = () => {
  const [preset, setPreset] = React.useState(0);
  const [ratio, setRatio] = React.useState('3:4');
  const [lang, setLang] = React.useState('UZ');
  const presets = [
    { t: 'Glass', tone: 'oklch(0.34 0.07 200)' },
    { t: 'Cards', tone: 'oklch(0.36 0.08 25)' },
    { t: 'Flagship', tone: 'oklch(0.32 0.07 300)' },
    { t: 'Bold', tone: 'oklch(0.34 0.09 340)' },
  ];
  return (
    <div className="ab" style={{ display: 'flex', flexDirection: 'column' }}>
      <MStatus/>
      <div style={{ flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '1px solid var(--border)' }}>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrow-left" size={19}/></button>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Infographics</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: 'var(--acc)' }}><Icon name="bolt" size={14}/> 500</div>
      </div>
      <div className="ab-scroll" style={{ flex: 1, padding: '18px 22px 16px' }}>
        <h1 className="ab-h2" style={{ fontSize: 26 }}>One photo. <span style={{ color: 'var(--acc)' }}>A whole series.</span></h1>
        {/* upload */}
        <div className="ab-eyebrow" style={{ margin: '22px 0 10px', fontSize: 10 }}>01 · Source image</div>
        <div style={{ aspectRatio: '4/3', borderRadius: 16, border: '1.5px dashed var(--border-strong)', background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--t-2)', position: 'relative', overflow: 'hidden' }}>
          <div className="ab-glow" style={{ width: 140, height: 140, background: 'var(--acc)', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.1 }}/>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: 'var(--acc)', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><Icon name="upload" size={26} stroke={2}/></div>
          <div style={{ fontSize: 14.5, fontWeight: 600, position: 'relative' }}>Drop a flat-lay photo</div>
          <div className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 11, position: 'relative' }}>JPG · PNG · up to 24MB</div>
        </div>
        {/* preset */}
        <div className="ab-eyebrow" style={{ margin: '24px 0 10px', fontSize: 10 }}>02 · Style preset</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {presets.map((pr, i) => (
            <button key={pr.t} onClick={() => setPreset(i)} style={{ borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${preset === i ? 'var(--acc)' : 'var(--border)'}`, cursor: 'pointer', background: 'var(--bg-1)', padding: 0 }}>
              <div style={{ height: 54, background: pr.tone, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.07) 0 1px, transparent 1px 6px)' }}/>
                {preset === i && <div style={{ position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: '50%', background: 'var(--acc)', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={10} stroke={3}/></div>}
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, padding: '6px 2px', color: preset === i ? 'var(--t-1)' : 'var(--t-3)' }}>{pr.t}</div>
            </button>
          ))}
        </div>
        {/* ratio + lang inline */}
        <div className="ab-eyebrow" style={{ margin: '24px 0 10px', fontSize: 10 }}>03 · Aspect</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {['1:1', '3:4', '4:5', '9:16'].map(r => (
            <button key={r} onClick={() => setRatio(r)} style={{ height: 52, borderRadius: 11, border: `1px solid ${ratio === r ? 'var(--acc)' : 'var(--border)'}`, background: ratio === r ? 'var(--acc-soft)' : 'var(--bg-1)', color: ratio === r ? 'var(--acc)' : 'var(--t-2)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{r}</button>
          ))}
        </div>
        <div className="ab-eyebrow" style={{ margin: '24px 0 10px', fontSize: 10 }}>04 · On-image text</div>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12 }}>
          {['UZ', 'RU', 'EN'].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: '11px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, background: lang === l ? 'var(--acc)' : 'transparent', color: lang === l ? 'var(--acc-ink)' : 'var(--t-3)' }}>{l}</button>
          ))}
        </div>
      </div>
      {/* sticky footer */}
      <div style={{ flexShrink: 0, padding: '14px 22px 30px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <button className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg"><Icon name="sparkle-fill" size={18}/> Generate · 5 credits</button>
      </div>
    </div>
  );
};

// ── PROGRESS ─────────────────────────────────────────────────
const MobileProgress = () => {
  const steps = [
    { l: 'Image analyzed', done: true },
    { l: 'Subject isolated', done: true },
    { l: 'Composing layout', loading: true, eta: '~14s' },
    { l: 'Rendering text · UZ', pending: true },
  ];
  return (
    <div className="ab" style={{ display: 'flex', flexDirection: 'column' }}>
      <MStatus/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 22px 30px', position: 'relative', overflow: 'hidden' }}>
        <div className="ab-glow" style={{ width: 300, height: 300, background: 'var(--acc)', top: '14%', left: '50%', transform: 'translateX(-50%)', opacity: 0.12 }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div className="ab-chip ab-chip-acc"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', animation: 'ab-blink 1s ease infinite' }}/> Processing</div>
          <span className="ab-mono" style={{ color: 'var(--acc)', fontWeight: 700 }}>58%</span>
        </div>
        {/* preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: 220, aspectRatio: '3/4', borderRadius: 18, border: '1px solid var(--border-mid)', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, oklch(0.4 0.07 200) 0%, oklch(0.4 0.07 200) 58%, oklch(0.24 0.04 200) 100%)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '58%', background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.08) 0 1px, transparent 1px 8px)' }}/>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '58%', height: 3, background: 'var(--acc)', boxShadow: '0 0 16px var(--acc)' }}/>
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span className="ab-mono" style={{ fontSize: 9, color: 'oklch(1 0 0 / 0.6)' }}>GLASS · 3:4</span>
              <span className="ab-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--acc)' }}>00:46</span>
            </div>
          </div>
        </div>
        {/* steps */}
        <div>
          <div className="ab-h3" style={{ fontSize: 22 }}>Building your infographic</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: (s.done || s.loading) ? 'var(--bg-1)' : 'transparent', border: '1px solid var(--border)', opacity: s.pending ? 0.45 : 1 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.done ? 'var(--acc)' : 'transparent', border: s.loading ? '2px solid var(--acc)' : s.pending ? '1px solid var(--border-mid)' : 'none', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.done ? <Icon name="check" size={12} stroke={3}/> : s.loading ? <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid var(--acc)', borderTopColor: 'transparent', animation: 'ab-spin .7s linear infinite' }}/> : null}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{s.l}</span>
                {s.eta && <span className="ab-mono" style={{ color: 'var(--acc)', fontSize: 11 }}>{s.eta}</span>}
              </div>
            ))}
          </div>
          <div style={{ height: 8, borderRadius: 100, background: 'var(--bg-3)', overflow: 'hidden', marginTop: 18 }}>
            <div style={{ width: '58%', height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, var(--acc-2), var(--acc))' }}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── RESULT ───────────────────────────────────────────────────
const MobileResult = () => {
  const [rating, setRating] = React.useState(4);
  const variants = ['oklch(0.4 0.07 200)', 'oklch(0.36 0.08 25)', 'oklch(0.32 0.07 300)', 'oklch(0.34 0.09 340)'];
  const [sel, setSel] = React.useState(0);
  return (
    <div className="ab" style={{ display: 'flex', flexDirection: 'column' }}>
      <MStatus/>
      <div style={{ flexShrink: 0, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={19}/></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', background: 'var(--acc)', color: 'var(--acc-ink)', borderRadius: 100 }}><Icon name="check" size={12} stroke={3}/><span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>READY</span></div>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="heart" size={18}/></button>
      </div>
      <div className="ab-scroll" style={{ flex: 1, padding: '8px 22px 16px' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', aspectRatio: '3/4', background: `linear-gradient(180deg, ${variants[sel]}, oklch(0.22 0.04 25))`, transition: 'background .3s ease' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 10px)' }}/>
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '44%', height: '82%', borderRadius: '48% 48% 0 0 / 28% 28% 0 0', background: 'radial-gradient(ellipse at 50% 28%, oklch(1 0 0 / 0.16), transparent)' }}/>
          <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'oklch(1 0 0 / 0.9)', background: 'oklch(0 0 0 / 0.45)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100 }}>GLASS · 1024×1365</div>
        </div>
        {/* variants */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
          {variants.map((c, i) => (
            <button key={i} onClick={() => setSel(i)} style={{ aspectRatio: '3/4', borderRadius: 11, background: c, border: sel === i ? '2px solid var(--acc)' : '1px solid var(--border-mid)', position: 'relative', overflow: 'hidden', cursor: 'pointer', padding: 0 }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 7px)' }}/>
            </button>
          ))}
        </div>
        {/* rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '14px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14 }}>
          <span style={{ fontSize: 13.5, color: 'var(--t-2)' }}>Rate this result</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map(i => <button key={i} onClick={() => setRating(i)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: i <= rating ? 'var(--acc)' : 'var(--t-4)' }}><Icon name={i <= rating ? 'star-fill' : 'star'} size={22}/></button>)}
          </div>
        </div>
        {/* export presets */}
        <div className="ab-eyebrow" style={{ margin: '22px 0 10px', fontSize: 10 }}>Export · marketplace size</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {[['Uzum','1024×1365'],['Wildberries','900×1200'],['Ozon','1000×1000']].map(([m,s]) => (
            <div key={m} style={{ flexShrink: 0, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div>
              <div className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 10, marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, padding: '12px 22px 30px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: 10 }}>
        <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="share" size={16}/> Share</button>
        <button className="ab-btn ab-btn-primary" style={{ flex: 2 }}><Icon name="download" size={17} stroke={2}/> Download HD</button>
      </div>
    </div>
  );
};

// ── GALLERY ──────────────────────────────────────────────────
const MobileGallery = () => {
  const filters = ['All', 'Infographics', 'Interiors', 'Mockups', 'Patterns'];
  const items = [
    { h: 180, type: 'Infographic', tone: 'oklch(0.34 0.07 200)' },
    { h: 130, type: 'Interior', tone: 'oklch(0.33 0.06 130)' },
    { h: 150, type: 'Mockup', tone: 'oklch(0.32 0.07 300)' },
    { h: 180, type: 'Pattern', tone: 'oklch(0.34 0.08 70)' },
    { h: 150, type: 'Background', tone: 'oklch(0.36 0.08 25)' },
    { h: 130, type: 'Infographic', tone: 'oklch(0.34 0.09 340)' },
  ];
  return (
    <MScreen tab="gallery">
      <div style={{ padding: '4px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div className="ab-eyebrow" style={{ fontSize: 10 }}>Your archive</div>
            <div className="ab-h2" style={{ fontSize: 27, marginTop: 4 }}>Gallery</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="ab-h2" style={{ fontSize: 27, color: 'var(--acc)' }}>238</div>
            <div className="ab-eyebrow" style={{ fontSize: 9 }}>generations</div>
          </div>
        </div>
        {/* filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 18, paddingBottom: 4 }}>
          {filters.map((f, i) => <span key={f} className={i === 0 ? 'ab-chip ab-chip-acc' : 'ab-chip'} style={{ flexShrink: 0, cursor: 'pointer' }}>{f}</span>)}
        </div>
        {/* masonry */}
        <div style={{ columnCount: 2, columnGap: 12 }}>
          {items.map((it, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: 12, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative' }}>
              <div style={{ height: it.h, background: it.tone, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 9px)' }}/>
                <div style={{ position: 'absolute', top: 9, left: 9, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', padding: '3px 7px', borderRadius: 100 }}>{it.type.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MScreen>
  );
};

Object.assign(window, { MobileHome, MobileGenerate, MobileProgress, MobileResult, MobileGallery });
