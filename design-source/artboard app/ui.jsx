/* eslint-disable */
// Artboard — shared UI primitives (icons, mark, interactive bits)

const Icon = ({ name, size = 22, stroke = 1.8, style = {} }) => {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', style };
  switch (name) {
    case 'home': return <svg {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case 'grid': return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case 'user': return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>;
    case 'plus': return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus': return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-left': return <svg {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case 'arrow-up-right': return <svg {...p}><path d="M7 17L17 7M8 7h9v9"/></svg>;
    case 'chevron-down': return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-right': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'chevron-left': return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'close': return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'check': return <svg {...p}><path d="M4 12l5 5L20 6"/></svg>;
    case 'image': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>;
    case 'upload': return <svg {...p}><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></svg>;
    case 'download': return <svg {...p}><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></svg>;
    case 'gallery': return <svg {...p}><rect x="3" y="5" width="15" height="14" rx="2"/><rect x="6" y="2" width="15" height="14" rx="2"/></svg>;
    case 'star': return <svg {...p}><path d="M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2L12 17l-5.5 3 1-6.2L3 9.5l6.3-.9L12 3z"/></svg>;
    case 'star-fill': return <svg {...{...p, fill: 'currentColor'}}><path d="M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2L12 17l-5.5 3 1-6.2L3 9.5l6.3-.9L12 3z"/></svg>;
    case 'bolt': return <svg {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'bolt-fill': return <svg {...{...p, fill: 'currentColor', stroke: 'none'}}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>;
    case 'settings': return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
    case 'globe': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>;
    case 'shield': return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/></svg>;
    case 'sliders': return <svg {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>;
    case 'gem': return <svg {...p}><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M11 3l1 6L13 3M2 9h20"/></svg>;
    case 'eye': return <svg {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/></svg>;
    case 'filter': return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'heart': return <svg {...p}><path d="M20.8 7.5c-1.6-2.4-5-2.4-6.8 0L12 9.4l-2-2c-1.8-2.3-5.2-2.3-6.8 0-1.6 2.5-1 5.6 1 7.3L12 22l7.8-7.3c2-1.7 2.6-4.8 1-7.3z"/></svg>;
    case 'bell': return <svg {...p}><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>;
    case 'send': return <svg {...p}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case 'circle': return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
    case 'sparkle': return <svg {...p}><path d="M12 3v3M12 18v3M5 12H2M22 12h-3M19 5l-2 2M7 17l-2 2M19 19l-2-2M7 7L5 5"/><circle cx="12" cy="12" r="2.6"/></svg>;
    case 'sparkle-fill': return <svg {...{...p, fill: 'currentColor', stroke: 'none'}}><path d="M12 2l1.8 6.5 6.5 1.8-6.5 1.8L12 18l-1.8-5.9L3.7 10.3l6.5-1.8z"/></svg>;
    case 'trash': return <svg {...p}><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14"/></svg>;
    case 'share': return <svg {...p}><path d="M12 3v13M8 7l4-4 4 4M20 17v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3"/></svg>;
    case 'play': return <svg {...{...p, fill: 'currentColor', stroke: 'none'}}><path d="M6 4l14 8-14 8V4z"/></svg>;
    case 'wand': return <svg {...p}><path d="M15 4l5 5M14 5l5 5L8 21l-5-5L14 5z"/></svg>;
    case 'magic': return <svg {...p}><path d="M3 21L13 11M14 4l1.5 3 3 1.5-3 1.5L14 13l-1.5-3-3-1.5 3-1.5L14 4z"/></svg>;
    case 'history': return <svg {...p}><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.5M3 4v4h4"/><path d="M12 7v5l3 2"/></svg>;
    case 'crown': return <svg {...p}><path d="M2 8l5 5 5-9 5 9 5-5-2 12H4L2 8z"/></svg>;
    case 'layers': return <svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>;
    case 'zoom-in': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></svg>;
    case 'zoom-out': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M8 11h6"/></svg>;
    case 'sofa': return <svg {...p}><path d="M4 11V8a2 2 0 012-2h12a2 2 0 012 2v3"/><path d="M2 12a2 2 0 012 2v3h16v-3a2 2 0 114 0M4 17v2M20 17v2"/><path d="M4 14h16" opacity="0"/><path d="M2 12a2 2 0 012-2 2 2 0 012 2v2h12v-2a2 2 0 012-2 2 2 0 012 2"/></svg>;
    case 'box': return <svg {...p}><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>;
    case 'palette': return <svg {...p}><path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.6 0-.5-.2-.9-.5-1.2-.3-.4-.5-.7-.5-1.2 0-.8.7-1.5 1.5-1.5H16a5 5 0 005-5c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="8" r="1"/></svg>;
    case 'scissors': return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1L20 18M8.1 15.9L20 6"/></svg>;
    case 'maximize': return <svg {...p}><path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3"/></svg>;
    case 'menu': return <svg {...p}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'sun': return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>;
    case 'moon': return <svg {...p}><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>;
    case 'dashboard': return <svg {...p}><rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/><rect x="3" y="17" width="8" height="4" rx="1.5"/></svg>;
    default: return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="3"/></svg>;
  }
};

// ── Brand mark ───────────────────────────────────────────────
const ArtboardMark = ({ size = 24, mono = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{ width: size * 1.18, height: size * 1.18, borderRadius: size * 0.32, background: 'var(--acc)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px -6px var(--acc-line)' }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none" stroke="var(--acc-ink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 15l5-4 4 3 4-5 5 5"/>
      </svg>
    </div>
    {!mono && <span style={{ fontSize: size * 0.82, fontWeight: 600, letterSpacing: '-0.04em' }}>Artboard</span>}
  </div>
);

// ── Language switcher ────────────────────────────────────────
const LangSwitch = ({ compact = false }) => {
  const [lang, setLang] = React.useState('EN');
  const langs = ['UZ', 'RU', 'EN'];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 3, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 100 }}>
      {!compact && <Icon name="globe" size={15} style={{ color: 'var(--t-3)', margin: '0 4px 0 6px' }}/>}
      {langs.map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: compact ? '5px 9px' : '5px 11px', borderRadius: 100, border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
          background: lang === l ? 'var(--acc)' : 'transparent',
          color: lang === l ? 'var(--acc-ink)' : 'var(--t-3)',
          transition: 'all .15s ease',
        }}>{l}</button>
      ))}
    </div>
  );
};

// ── Before / after slider (draggable) ────────────────────────
const BeforeAfter = ({ height = 360, beforeLabel = 'Plain product', afterLabel = 'Generated', radius = 18, beforeTone = 'var(--bg-2)', afterTone }) => {
  const [pos, setPos] = React.useState(52);
  const ref = React.useRef(null);
  const drag = React.useRef(false);
  const move = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
    setPos(pct);
  };
  React.useEffect(() => {
    const mm = (e) => { if (drag.current) move(e.clientX ?? (e.touches && e.touches[0].clientX)); };
    const mu = () => { drag.current = false; };
    window.addEventListener('mousemove', mm); window.addEventListener('mouseup', mu);
    window.addEventListener('touchmove', mm); window.addEventListener('touchend', mu);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', mu); window.removeEventListener('touchmove', mm); window.removeEventListener('touchend', mu); };
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height, borderRadius: radius, overflow: 'hidden', border: '1px solid var(--border-mid)', cursor: 'ew-resize', userSelect: 'none' }}
      onMouseDown={(e) => { drag.current = true; move(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; move(e.touches[0].clientX); }}>
      {/* AFTER (full, underneath) */}
      <div className="ab-ph" style={{ position: 'absolute', inset: 0, border: 'none', background: afterTone || 'linear-gradient(150deg, oklch(0.42 0.12 25), oklch(0.26 0.06 25))', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.05) 0 1px, transparent 1px 10px)' }}/>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '44%', height: '84%', borderRadius: '48% 48% 0 0 / 28% 28% 0 0', background: 'radial-gradient(ellipse at 50% 28%, oklch(0.3 0.08 25), oklch(0.2 0.04 25))', opacity: 0.9 }}/>
        <div className="ab-glow" style={{ width: 240, height: 130, background: 'var(--v-amber)', top: '-6%', left: '50%', transform: 'translateX(-50%)', opacity: 0.25 }}/>
        <span style={{ position: 'absolute', bottom: 12, right: 12, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--acc)', background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 100, fontWeight: 600 }}>{afterLabel.toUpperCase()}</span>
      </div>
      {/* BEFORE (clipped) */}
      <div style={{ position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden', borderRight: '2px solid var(--acc)' }}>
        <div className="ab-ph" style={{ position: 'absolute', inset: 0, width: ref.current ? ref.current.offsetWidth : 600, border: 'none', background: beforeTone, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.04) 0 1px, transparent 1px 12px)' }}/>
          <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '38%', height: '60%', borderRadius: 12, background: 'oklch(0.32 0.01 264)', border: '1px solid var(--border-mid)' }}/>
          <span style={{ position: 'absolute', bottom: 12, left: 12, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--t-2)', background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 100 }}>{beforeLabel.toUpperCase()}</span>
        </div>
      </div>
      {/* handle */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--acc)', color: 'var(--acc-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px oklch(0 0 0 / 0.4)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>
        </div>
      </div>
    </div>
  );
};

// ── FAQ accordion item ───────────────────────────────────────
const FaqItem = ({ q, a, defaultOpen = false }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--t-1)' }}>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-0.02em' }}>{q}</span>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: open ? 'var(--acc)' : 'var(--bg-2)', color: open ? 'var(--acc-ink)' : 'var(--t-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s ease' }}>
          <Icon name={open ? 'minus' : 'plus'} size={17} stroke={2.2}/>
        </span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height .3s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--t-3)', padding: '0 50px 22px 4px' }}>{a}</div>
      </div>
    </div>
  );
};

// section eyebrow + heading block
const SectionHead = ({ tag, title, sub, center, light }) => (
  <div style={{ textAlign: center ? 'center' : 'left', maxWidth: center ? 640 : 'none', margin: center ? '0 auto' : 0 }}>
    {tag && <div className="ab-chip ab-chip-acc" style={{ marginBottom: 18 }}><Icon name="sparkle-fill" size={12}/> {tag}</div>}
    <div className="ab-h2">{title}</div>
    {sub && <div className="ab-body" style={{ marginTop: 14, fontSize: 16, maxWidth: center ? 560 : 600, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>{sub}</div>}
  </div>
);

Object.assign(window, { Icon, ArtboardMark, LangSwitch, BeforeAfter, FaqItem, SectionHead });
