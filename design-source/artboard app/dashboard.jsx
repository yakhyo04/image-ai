/* eslint-disable */
// Artboard — Dashboard (generation workspace, progress, gallery view)

// ── Sidebar ──────────────────────────────────────────────────
const DashSidebar = ({ active = 'infographics', collapsed = false }) => {
  const tools = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'infographics', icon: 'sliders', label: 'Marketplace Infographics' },
    { id: 'editor', icon: 'magic', label: 'Photo Editor' },
    { id: 'interior', icon: 'sofa', label: 'Interior Design' },
    { id: 'mockups', icon: 'box', label: 'Product Mockups' },
    { id: 'backgrounds', icon: 'scissors', label: 'Backgrounds' },
  ];
  const lib = [
    { id: 'gallery', icon: 'gallery', label: 'Gallery / History' },
    { id: 'credits', icon: 'gem', label: 'Credits', badge: '500' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];
  const W = collapsed ? 72 : 248;
  const Row = (t) => {
    const on = t.id === active;
    return (
      <div key={t.id} title={t.label} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '11px 0' : '10px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 11, cursor: 'pointer', position: 'relative',
        background: on ? 'var(--bg-2)' : 'transparent', border: on ? '1px solid var(--border)' : '1px solid transparent',
        color: on ? 'var(--t-1)' : 'var(--t-3)',
      }}>
        {on && <div style={{ position: 'absolute', left: collapsed ? 4 : -13, top: '50%', transform: 'translateY(-50%)', width: 3, height: 18, borderRadius: 3, background: 'var(--acc)' }}/>}
        <span style={{ color: on ? 'var(--acc)' : 'var(--t-3)', display: 'flex', flexShrink: 0 }}><Icon name={t.icon} size={20} stroke={on ? 2 : 1.8}/></span>
        {!collapsed && <span style={{ flex: 1, fontSize: 13.5, fontWeight: on ? 600 : 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>}
        {!collapsed && t.badge && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, color: 'var(--acc)', background: 'var(--acc-soft)', padding: '2px 7px', borderRadius: 100 }}>{t.badge}</span>}
      </div>
    );
  };
  return (
    <div style={{ width: W, flexShrink: 0, height: '100%', background: 'var(--bg)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: collapsed ? '20px 12px' : '20px 16px', transition: 'width .2s ease' }}>
      <div style={{ padding: collapsed ? '0' : '0 6px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 22 }}>
        <ArtboardMark size={22} mono={collapsed}/>
      </div>
      <button className="ab-btn ab-btn-primary ab-btn-full" style={{ padding: collapsed ? '12px 0' : '12px 16px', borderRadius: 12, marginBottom: 22 }}>
        <Icon name="plus" size={17} stroke={2.4}/>{!collapsed && ' New generation'}
      </button>
      {!collapsed && <div className="ab-eyebrow" style={{ padding: '0 8px 10px', fontSize: 10 }}>Tools</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{tools.map(Row)}</div>
      <div style={{ height: 1, background: 'var(--border)', margin: '16px 6px' }}/>
      {!collapsed && <div className="ab-eyebrow" style={{ padding: '0 8px 10px', fontSize: 10 }}>Library</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{lib.map(Row)}</div>
      <div style={{ flex: 1 }}/>
      {!collapsed ? (
        <div style={{ borderRadius: 16, padding: 16, background: 'linear-gradient(160deg, oklch(0.89 0.2 132 / 0.12), oklch(0.89 0.2 132 / 0.02))', border: '1px solid var(--acc-line)', position: 'relative', overflow: 'hidden' }}>
          <div className="ab-glow" style={{ width: 120, height: 120, background: 'var(--acc)', bottom: -50, right: -30, opacity: 0.25 }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700 }}><Icon name="crown" size={15} stroke={2} style={{ color: 'var(--acc)' }}/> Pro plan</div>
            <div className="ab-body" style={{ fontSize: 11.5, marginTop: 6 }}>500 credits left this month.</div>
            <button className="ab-btn ab-btn-primary ab-btn-full ab-btn-sm" style={{ marginTop: 12 }}>Manage plan</button>
          </div>
        </div>
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--acc-soft)', color: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Icon name="crown" size={18}/></div>
      )}
    </div>
  );
};

// ── Topbar ───────────────────────────────────────────────────
const DashTopbar = ({ title, onToggle }) => (
  <div style={{ height: 64, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: 'var(--bg)' }}>
    <button onClick={onToggle} style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: '1px solid var(--border)', color: 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="menu" size={18}/></button>
    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
    <div style={{ flex: 1 }}/>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 240, height: 40, padding: '0 14px', borderRadius: 11, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--t-3)' }}>
      <Icon name="search" size={16}/><span style={{ fontSize: 13 }}>Search generations…</span>
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--t-4)', border: '1px solid var(--border-mid)', borderRadius: 5, padding: '1px 5px' }}>⌘K</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 14px', borderRadius: 11, background: 'var(--acc-soft)', border: '1px solid var(--acc-line)', color: 'var(--acc)', fontWeight: 700, fontSize: 14 }}><Icon name="bolt" size={15}/> 500</div>
    <LangSwitch compact/>
    <button style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
      <Icon name="bell" size={18}/>
      <span style={{ position: 'absolute', top: 9, right: 10, width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', border: '1.5px solid var(--bg-1)' }}/>
    </button>
    <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--v-blue)', color: 'oklch(1 0 0 / 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, border: '1px solid var(--border-mid)' }}>DR</div>
  </div>
);

const DashFrame = ({ active, title, collapsed, onToggle, children }) => (
  <div className="ab ab-row">
    <DashSidebar active={active} collapsed={collapsed}/>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg)' }}>
      <DashTopbar title={title} onToggle={onToggle}/>
      <div className="ab-scroll" style={{ flex: 1 }}>{children}</div>
    </div>
  </div>
);

// ── WORKSPACE (3-panel generation) ───────────────────────────
const DashWorkspace = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [preset, setPreset] = React.useState(0);
  const [ratio, setRatio] = React.useState('3:4');
  const [advOpen, setAdvOpen] = React.useState(false);
  const [lang, setLang] = React.useState('UZ');
  const presets = [
    { t: 'Glass', tone: 'oklch(0.34 0.07 200)' },
    { t: 'Cards', tone: 'oklch(0.36 0.08 25)' },
    { t: 'Flagship', tone: 'oklch(0.32 0.07 300)' },
    { t: 'Bold', tone: 'oklch(0.34 0.09 340)' },
    { t: 'Minimal', tone: 'oklch(0.3 0.03 250)' },
    { t: 'Boutique', tone: 'oklch(0.33 0.06 130)' },
  ];
  const history = ['oklch(0.36 0.08 25)', 'oklch(0.34 0.07 200)', 'oklch(0.32 0.07 300)', 'oklch(0.33 0.06 130)', 'oklch(0.34 0.09 340)'];
  return (
    <DashFrame active="infographics" title="Marketplace Infographics" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}>
      <div style={{ display: 'grid', gridTemplateColumns: '316px 1fr 296px', height: '100%', minHeight: 760 }}>
        {/* LEFT — controls */}
        <div className="ab-scroll" style={{ borderRight: '1px solid var(--border)', padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>01 · Source image</div>
          <div style={{ aspectRatio: '4/3', borderRadius: 14, border: '1.5px dashed var(--border-strong)', background: 'var(--bg-1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--t-2)', position: 'relative', overflow: 'hidden' }}>
            <div className="ab-glow" style={{ width: 120, height: 120, background: 'var(--acc)', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.1 }}/>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: 'var(--acc)', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}><Icon name="upload" size={24} stroke={2}/></div>
            <div style={{ fontSize: 13.5, fontWeight: 600, position: 'relative' }}>Drop or browse</div>
            <div className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 10.5, position: 'relative' }}>JPG · PNG · WEBP</div>
          </div>

          <div className="ab-eyebrow" style={{ margin: '24px 0 12px' }}>02 · Style preset</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {presets.map((pr, i) => (
              <button key={pr.t} onClick={() => setPreset(i)} style={{ borderRadius: 11, overflow: 'hidden', border: `1.5px solid ${preset === i ? 'var(--acc)' : 'var(--border)'}`, cursor: 'pointer', background: 'var(--bg-1)', padding: 0 }}>
                <div style={{ height: 52, background: pr.tone, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.07) 0 1px, transparent 1px 6px)' }}/>
                  {preset === i && <div style={{ position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: '50%', background: 'var(--acc)', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={10} stroke={3}/></div>}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '6px 4px', color: preset === i ? 'var(--t-1)' : 'var(--t-3)' }}>{pr.t}</div>
              </button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: '24px 0 12px' }}>03 · Aspect ratio</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['1:1', '3:4', '4:5', '9:16'].map(r => (
              <button key={r} onClick={() => setRatio(r)} style={{ height: 60, borderRadius: 10, border: `1px solid ${ratio === r ? 'var(--acc)' : 'var(--border)'}`, background: ratio === r ? 'var(--acc-soft)' : 'var(--bg-1)', color: ratio === r ? 'var(--acc)' : 'var(--t-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                <div style={{ width: r === '1:1' ? 16 : r === '9:16' ? 11 : 14, height: r === '1:1' ? 16 : r === '9:16' ? 20 : 18, border: '1.4px solid currentColor', borderRadius: 2 }}/>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{r}</span>
              </button>
            ))}
          </div>

          <div className="ab-eyebrow" style={{ margin: '24px 0 12px' }}>04 · On-image text language</div>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 11 }}>
            {['UZ', 'RU', 'EN'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, background: lang === l ? 'var(--acc)' : 'transparent', color: lang === l ? 'var(--acc-ink)' : 'var(--t-3)' }}>{l}</button>
            ))}
          </div>

          {/* advanced accordion */}
          <button onClick={() => setAdvOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '12px 0', background: 'none', border: 'none', borderTop: '1px solid var(--border)', cursor: 'pointer', color: 'var(--t-2)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Advanced options</span>
            <Icon name="chevron-down" size={16} style={{ transform: advOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}/>
          </button>
          {advOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
              {[['Variants', '4'], ['Quality', 'HD'], ['Seed', 'Random'], ['Negative prompt', 'Off']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--t-3)' }}>{k}</span>
                  <span style={{ color: 'var(--t-1)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <button className="ab-btn ab-btn-primary ab-btn-full ab-btn-lg" style={{ marginTop: 20 }}><Icon name="sparkle-fill" size={18}/> Generate · 5 credits</button>
        </div>

        {/* CENTER — canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ height: 52, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px' }}>
            <span className="ab-chip ab-chip-acc" style={{ padding: '4px 10px' }}><Icon name="check" size={12} stroke={3}/> Ready</span>
            <span className="ab-mono" style={{ color: 'var(--t-3)' }}>Glass · 3:4 · UZ</span>
            <div style={{ flex: 1 }}/>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="zoom-out" size={16}/></button>
            <span className="ab-mono" style={{ color: 'var(--t-2)', width: 42, textAlign: 'center' }}>100%</span>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="zoom-in" size={16}/></button>
            <button style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-1)', border: '1px solid var(--border)', color: 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="maximize" size={16}/></button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, position: 'relative', backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
            <div style={{ height: '100%', maxHeight: 560, aspectRatio: '3/4', position: 'relative' }}>
              <BeforeAfter height={560} radius={16} afterTone="linear-gradient(160deg, oklch(0.4 0.07 200), oklch(0.24 0.04 200))" beforeLabel="Original" afterLabel="Infographic"/>
            </div>
          </div>
        </div>

        {/* RIGHT — variations + export */}
        <div className="ab-scroll" style={{ borderLeft: '1px solid var(--border)', padding: 20 }}>
          <div className="ab-eyebrow" style={{ marginBottom: 12 }}>Variations</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {history.slice(0, 4).map((c, i) => (
              <div key={i} style={{ aspectRatio: '3/4', borderRadius: 11, background: c, border: i === 0 ? '2px solid var(--acc)' : '1px solid var(--border-mid)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 8px)' }}/>
                <span style={{ position: 'absolute', bottom: 6, left: 6, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'oklch(1 0 0 / 0.8)', background: 'oklch(0 0 0 / 0.4)', padding: '1px 5px', borderRadius: 4 }}>0{i + 1}</span>
              </div>
            ))}
          </div>
          <button className="ab-btn ab-btn-ghost ab-btn-full ab-btn-sm" style={{ marginTop: 12 }}><Icon name="sparkle" size={14}/> Regenerate</button>

          <div className="ab-eyebrow" style={{ margin: '24px 0 12px' }}>Export</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Uzum', '1024×1365'], ['Wildberries', '900×1200'], ['Ozon', '1000×1000'], ['Yandex', '1080×1440']].map(([m, s]) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, background: 'var(--bg-1)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-2)' }}><Icon name="image" size={15}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m}</div>
                  <div className="ab-mono" style={{ color: 'var(--t-3)', fontSize: 10 }}>{s}</div>
                </div>
                <Icon name="download" size={16} style={{ color: 'var(--t-3)' }}/>
              </div>
            ))}
          </div>
          <button className="ab-btn ab-btn-primary ab-btn-full" style={{ marginTop: 14 }}><Icon name="download" size={16} stroke={2}/> Download HD</button>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="share" size={15}/> Share</button>
            <button className="ab-btn ab-btn-ghost" style={{ flex: 1 }}><Icon name="heart" size={15}/> Save</button>
          </div>
        </div>
      </div>
    </DashFrame>
  );
};

// ── PROGRESS STATE ───────────────────────────────────────────
const DashProgress = () => {
  const steps = [
    { l: 'Image analyzed', done: true },
    { l: 'Subject isolated', done: true },
    { l: 'Composing infographic layout', loading: true, eta: '~14s' },
    { l: 'Rendering text · UZ', pending: true },
    { l: 'Upscaling to HD', pending: true },
  ];
  return (
    <DashFrame active="infographics" title="Generating…">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 760, padding: 40, position: 'relative' }}>
        <div className="ab-glow" style={{ width: 460, height: 460, background: 'var(--acc)', top: '20%', left: '42%', opacity: 0.12 }}/>
        <div style={{ display: 'grid', gridTemplateColumns: '440px 380px', gap: 36, position: 'relative' }}>
          {/* preview */}
          <div style={{ aspectRatio: '3/4', borderRadius: 22, border: '1px solid var(--border-mid)', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, oklch(0.4 0.07 200) 0%, oklch(0.4 0.07 200) 58%, oklch(0.24 0.04 200) 100%)' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '58%', background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.08) 0 1px, transparent 1px 9px)' }}/>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '58%', height: 3, background: 'var(--acc)', boxShadow: '0 0 16px var(--acc), 0 0 36px var(--acc-line)' }}/>
            <div style={{ position: 'absolute', top: 14, left: 14, padding: '6px 11px', borderRadius: 100, background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--acc)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', animation: 'ab-blink 0.8s ease infinite' }}/>RENDER · 58%
            </div>
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div className="ab-mono" style={{ fontSize: 9, color: 'oklch(1 0 0 / 0.6)' }}>GLASS · 3:4</div>
              <div className="ab-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--acc)' }}>00:46</div>
            </div>
          </div>
          {/* steps */}
          <div>
            <div className="ab-chip ab-chip-acc" style={{ marginBottom: 18 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', animation: 'ab-blink 1s ease infinite' }}/> Processing · no queue</div>
            <div className="ab-h3" style={{ fontSize: 26 }}>Building your infographic</div>
            <div className="ab-body" style={{ fontSize: 14, marginTop: 8 }}>This usually takes under a minute. We’ll notify you when all four variants are ready.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 13, background: (s.done || s.loading) ? 'var(--bg-1)' : 'transparent', border: '1px solid var(--border)', opacity: s.pending ? 0.45 : 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.done ? 'var(--acc)' : 'transparent', border: s.loading ? '2px solid var(--acc)' : s.pending ? '1px solid var(--border-mid)' : 'none', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.done ? <Icon name="check" size={13} stroke={3}/> : s.loading ? <div style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid var(--acc)', borderTopColor: 'transparent', animation: 'ab-spin .7s linear infinite' }}/> : null}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{s.l}</span>
                  {s.eta && <span className="ab-mono" style={{ color: 'var(--acc)', fontSize: 12 }}>{s.eta}</span>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
                <span style={{ color: 'var(--t-2)', fontWeight: 600 }}>Overall</span>
                <span className="ab-mono" style={{ color: 'var(--acc)', fontWeight: 700 }}>58%</span>
              </div>
              <div style={{ height: 8, borderRadius: 100, background: 'var(--bg-3)', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, var(--acc-2), var(--acc))' }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashFrame>
  );
};

// ── GALLERY VIEW ─────────────────────────────────────────────
const DashGallery = () => {
  const types = ['All', 'Infographics', 'Interiors', 'Mockups', 'Backgrounds', 'Patterns'];
  const items = Array.from({ length: 15 }).map((_, i) => ({
    h: [300, 240, 280, 320, 240, 300, 260, 240, 320, 280, 300, 240, 280, 260, 300][i],
    type: ['Infographic', 'Interior', 'Mockup', 'Pattern', 'Background'][i % 5],
    style: ['Glass', 'Boutique', 'Flagship', 'Bold', 'Studio', 'Minimal'][i % 6],
    tone: ['oklch(0.34 0.07 200)', 'oklch(0.33 0.06 130)', 'oklch(0.32 0.07 300)', 'oklch(0.34 0.08 70)', 'oklch(0.36 0.08 25)'][i % 5],
    when: i < 3 ? 'Today' : i < 7 ? 'Yesterday' : `${i - 4}d ago`,
  }));
  return (
    <DashFrame active="gallery" title="Gallery / History">
      <div style={{ padding: 24 }}>
        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[['238', 'Total generations'], ['96%', 'Success rate', true], ['54', 'Saved & exported'], ['1,240', 'Credits used']].map(([v, l, acc], i) => (
            <div key={i} className="ab-card" style={{ padding: 18 }}>
              <div className="ab-eyebrow" style={{ fontSize: 10, color: acc ? 'var(--acc)' : 'var(--t-3)' }}>{l}</div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.04em', marginTop: 6, color: acc ? 'var(--acc)' : 'var(--t-1)' }}>{v}</div>
            </div>
          ))}
        </div>
        {/* filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
            {types.map((t, i) => (
              <span key={t} style={{ padding: '8px 14px', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: i === 0 ? 'var(--bg-3)' : 'transparent', color: i === 0 ? 'var(--t-1)' : 'var(--t-3)' }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="ab-btn ab-btn-ghost ab-btn-sm"><Icon name="filter" size={15}/> Style</button>
            <button style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="grid" size={17}/></button>
          </div>
        </div>
        {/* masonry */}
        <div style={{ columnCount: 5, columnGap: 16 }}>
          {items.map((it, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: 16, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', cursor: 'pointer' }}>
              <div style={{ height: it.h, background: it.tone, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)' }}/>
                <div style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.06em', color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 100 }}>{it.type.toUpperCase()}</div>
                <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'oklch(1 0 0 / 0.92)' }}>{it.style}</span>
                  <span className="ab-mono" style={{ fontSize: 9, color: 'oklch(1 0 0 / 0.7)' }}>{it.when}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashFrame>
  );
};

Object.assign(window, { DashSidebar, DashTopbar, DashFrame, DashWorkspace, DashProgress, DashGallery });
