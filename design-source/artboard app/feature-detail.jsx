/* eslint-disable */
// Artboard — reusable feature detail page (driven by a TOOLS entry)

const FeatureDetail = ({ tool }) => {
  const d = tool;
  return (
    <div className="ab" style={{ height: 'auto' }}>
      <div style={{ background: 'var(--bg)' }}>
        <LandingNav/>

        {/* ── HERO ── */}
        <Section id={`${d.id}-hero`} pad="40px 100px 64px" style={{ overflow: 'hidden' }}>
          <div className="ab-glow" style={{ width: 520, height: 360, background: d.tone, top: -120, left: '46%', opacity: 0.22 }}/>
          {/* breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 30, position: 'relative' }}>
            <span className="ab-nav-link" style={{ fontSize: 13 }}>Features</span>
            <Icon name="chevron-right" size={14} style={{ color: 'var(--t-4)' }}/>
            <span style={{ fontSize: 13, color: 'var(--t-1)', fontWeight: 500 }}>{d.name}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', position: 'relative' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: d.tone, border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(1 0 0 / 0.95)' }}><Icon name={d.icon} size={22}/></div>
                <span className="ab-eyebrow">{d.eyebrow}</span>
              </div>
              <h1 className="ab-display" style={{ fontSize: 52 }}>{d.titleA} <span style={{ color: 'var(--acc)' }}>{d.titleAccent}</span></h1>
              <p className="ab-body" style={{ fontSize: 17, marginTop: 20, maxWidth: 480 }}>{d.desc}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
                <button className="ab-btn ab-btn-grad ab-btn-lg">Try {d.name.split(' ')[0]} free <Icon name="arrow-right" size={17} stroke={2.2}/></button>
                <button className="ab-btn ab-btn-ghost ab-btn-lg"><Icon name="play" size={13}/> Watch demo</button>
              </div>
              {/* stats */}
              <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
                {d.stats.map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--acc)' }}>{v}</div>
                    <div className="ab-body" style={{ fontSize: 12.5, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* hero visual */}
            <div>
              {d.heroType === 'beforeafter' ? (
                <div className="ab-card" style={{ padding: 14, borderRadius: 24, boxShadow: 'var(--sh-pop)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>{['var(--err)','var(--warn)','var(--ok)'].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:'50%',background:c,opacity:.7}}/>)}</div>
                    <span className="ab-mono" style={{ color: 'var(--t-3)', marginLeft: 6, fontSize: 11 }}>artboard.ai / {d.id}</span>
                    <span className="ab-chip ab-chip-acc" style={{ marginLeft: 'auto', padding: '3px 9px', fontSize: 10 }}>Drag →</span>
                  </div>
                  <BeforeAfter height={400} radius={16} beforeLabel={d.beforeLabel} afterLabel={d.afterLabel} afterTone={`linear-gradient(160deg, ${d.tone}, oklch(0.22 0.03 264))`}/>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, height: 440 }}>
                  {d.gallery.map((g, i) => (
                    <div key={i} style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', background: g.tone, gridRow: i === 0 ? 'span 2' : 'auto' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)' }}/>
                      <div className="ab-glow" style={{ width: 160, height: 100, background: 'oklch(1 0 0)', top: -40, right: -20, opacity: 0.07 }}/>
                      <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', backdropFilter: 'blur(8px)', padding: '3px 8px', borderRadius: 100 }}>{g.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ── HOW IT WORKS ── */}
        <Section id={`${d.id}-how`} pad="72px 100px" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <SectionHead center tag="How it works" title={`From upload to ready in three steps`}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 38, left: '17%', right: '17%', height: 2, background: 'repeating-linear-gradient(90deg, var(--border-mid) 0 8px, transparent 8px 16px)' }}/>
            {d.steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ width: 76, height: 76, borderRadius: 22, margin: '0 auto', background: 'var(--bg)', border: '1px solid var(--border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'var(--sh-2)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: i === 2 ? 'var(--acc)' : 'var(--bg-2)', color: i === 2 ? 'var(--acc-ink)' : 'var(--t-1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.icon} size={22}/></div>
                  <span style={{ position: 'absolute', top: -8, right: -6, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--acc)', background: 'var(--acc-soft)', border: '1px solid var(--acc-line)', padding: '2px 7px', borderRadius: 100 }}>0{i+1}</span>
                </div>
                <div className="ab-h3" style={{ fontSize: 19, marginTop: 20 }}>{s.title}</div>
                <div className="ab-body" style={{ fontSize: 14, marginTop: 8, maxWidth: 260, margin: '8px auto 0' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CAPABILITIES ── */}
        <Section id={`${d.id}-caps`} pad="80px 100px">
          <SectionHead tag="Capabilities" title="What this tool can do" sub={`Everything ${d.name} brings to your product photography workflow.`}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 44 }}>
            {d.caps.map((c, i) => (
              <div key={i} className="ab-card" style={{ padding: 24, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: 'var(--acc-soft)', color: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={c.icon} size={22}/></div>
                <div>
                  <div className="ab-h4" style={{ fontSize: 17 }}>{c.title}</div>
                  <div className="ab-body" style={{ fontSize: 14, marginTop: 6 }}>{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── GALLERY ── */}
        <Section id={`${d.id}-gallery`} pad="0 100px 80px">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
            <SectionHead tag="Examples" title={`${d.name} in action`}/>
            <button className="ab-btn ab-btn-ghost">View full gallery <Icon name="arrow-up-right" size={16}/></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, alignItems: 'start' }}>
            {d.gallery.map((g, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-mid)', position: 'relative', background: g.tone, height: g.h }}>
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(1 0 0 / 0.06) 0 1px, transparent 1px 10px)' }}/>
                <div className="ab-glow" style={{ width: 140, height: 90, background: 'oklch(1 0 0)', top: -30, right: -10, opacity: 0.06 }}/>
                <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'oklch(1 0 0 / 0.85)', background: 'oklch(0 0 0 / 0.4)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 100 }}>{g.label.toUpperCase()}</div>
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)' }}/>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'oklch(1 0 0 / 0.92)' }}>{d.name.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── USE CASES + SPECS ── */}
        <Section id={`${d.id}-use`} pad="80px 100px" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56 }}>
            <div>
              <SectionHead tag="Use cases" title="Who it's for"/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32 }}>
                {d.useCases.map((u, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 18, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: d.tone, color: 'oklch(1 0 0 / 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={u.icon} size={20}/></div>
                    <div>
                      <div className="ab-h4" style={{ fontSize: 16 }}>{u.title}</div>
                      <div className="ab-body" style={{ fontSize: 13.5, marginTop: 3 }}>{u.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* specs */}
            <div>
              <SectionHead tag="Specs" title="Details"/>
              <div className="ab-card" style={{ marginTop: 32, overflow: 'hidden', background: 'var(--bg)' }}>
                {d.specs.map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: i < d.specs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span className="ab-body" style={{ fontSize: 14 }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t-1)', fontFamily: k.includes('cost') || k.includes('resolution') || k.includes('time') || k.includes('Batch') || k.includes('Colorways') ? 'var(--font-mono)' : 'var(--font)' }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: '16px 20px', background: 'var(--acc-soft)', border: '1px solid var(--acc-line)', borderRadius: 14 }}>
                <Icon name="bolt" size={18} style={{ color: 'var(--acc)' }}/>
                <span style={{ fontSize: 13.5, color: 'var(--t-2)' }}>Included in every plan — from the free tier up.</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── FAQ ── */}
        <Section id={`${d.id}-faq`} pad="80px 100px">
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 64 }}>
            <div>
              <SectionHead tag="FAQ" title={`About ${d.name}`}/>
              <div className="ab-body" style={{ fontSize: 15, marginTop: 18 }}>More questions about this tool?</div>
              <button className="ab-btn ab-btn-ghost" style={{ marginTop: 16 }}><Icon name="send" size={15}/> Ask support</button>
            </div>
            <div>{d.faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0}/>)}</div>
          </div>
        </Section>

        {/* ── CTA ── */}
        <Section id={`${d.id}-cta`} pad="0 100px 64px">
          <div style={{ position: 'relative', borderRadius: 32, overflow: 'hidden', background: 'var(--grad)', padding: '60px 56px', textAlign: 'center', color: 'var(--acc-ink)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg, oklch(0 0 0 / 0.04) 0 1px, transparent 1px 16px)' }}/>
            <div style={{ position: 'relative' }}>
              <div className="ab-h1" style={{ fontSize: 42, color: 'var(--acc-ink)' }}>Ready to try {d.name}?</div>
              <p style={{ fontSize: 16, marginTop: 14, opacity: 0.8, maxWidth: 460, margin: '14px auto 0' }}>Start free — no card required. Your first generations are on us.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 30 }}>
                <button className="ab-btn ab-btn-lg" style={{ background: 'var(--acc-ink)', color: 'var(--acc)' }}>Start generating free <Icon name="arrow-right" size={17} stroke={2.2}/></button>
                <button className="ab-btn ab-btn-lg" style={{ background: 'oklch(0 0 0 / 0.12)', color: 'var(--acc-ink)', border: '1px solid oklch(0 0 0 / 0.2)' }}>See pricing</button>
              </div>
            </div>
          </div>
        </Section>

        {/* footer reuse */}
        <FooterCTA hideCTA/>
      </div>
    </div>
  );
};

window.FeatureDetail = FeatureDetail;
