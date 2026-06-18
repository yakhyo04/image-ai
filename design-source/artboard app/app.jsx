/* eslint-disable */
// Artboard — canvas app: full landing (one tall frame) + dashboard screens + Tweaks

const TWK = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "lime",
  "density": "comfortable",
  "radius": "18"
}/*EDITMODE-END*/;

// Full landing composed from sections
const LandingPage = () => (
  <div className="ab" style={{ height: 'auto' }}>
    <div style={{ background: 'var(--bg)' }}>
      <LandingNav/>
      <LandingHero/>
      <LogoStrip/>
      <FeaturesGrid/>
      <HowItWorks/>
      <Gallery/>
      <DemoBlock/>
      <Pricing/>
      <Testimonials/>
      <FAQ/>
      <FooterCTA/>
    </div>
  </div>
);

const ACC = {
  lime:   { a: 'oklch(0.89 0.20 132)', a2: 'oklch(0.80 0.18 132)', ink: 'oklch(0.19 0.06 132)', soft: 'oklch(0.89 0.20 132 / 0.15)', line: 'oklch(0.89 0.20 132 / 0.32)' },
  blue:   { a: 'oklch(0.70 0.16 250)', a2: 'oklch(0.62 0.15 250)', ink: 'oklch(0.98 0.02 250)', soft: 'oklch(0.70 0.16 250 / 0.16)', line: 'oklch(0.70 0.16 250 / 0.34)' },
  violet: { a: 'oklch(0.68 0.19 300)', a2: 'oklch(0.60 0.18 300)', ink: 'oklch(0.98 0.02 300)', soft: 'oklch(0.68 0.19 300 / 0.16)', line: 'oklch(0.68 0.19 300 / 0.34)' },
  amber:  { a: 'oklch(0.82 0.16 70)',  a2: 'oklch(0.74 0.15 70)',  ink: 'oklch(0.20 0.05 70)',  soft: 'oklch(0.82 0.16 70 / 0.16)',  line: 'oklch(0.82 0.16 70 / 0.34)' },
};

function App() {
  const [t, setTweak] = useTweaks(TWK);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.theme);
    const a = ACC[t.accent] || ACC.lime;
    root.style.setProperty('--acc', a.a);
    root.style.setProperty('--acc-2', a.a2);
    root.style.setProperty('--acc-ink', a.ink);
    root.style.setProperty('--acc-soft', a.soft);
    root.style.setProperty('--acc-line', a.line);
    root.style.setProperty('--grad', `linear-gradient(120deg, ${a.a}, ${a.a2})`);
  }, [t.theme, t.accent]);

  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="brand" title="Artboard" subtitle="AI marketplace-visual studio · dark, electric-lime, Space Grotesk · landing + dashboard">
          <DCArtboard id="landing" label="Landing page · full" width={1440} height={7140}>
            <LandingPage/>
          </DCArtboard>
        </DCSection>

        <DCSection id="dash" title="Generation dashboard" subtitle="3-panel workspace, live progress, gallery — collapsible sidebar, marketplace export presets">
          <DCArtboard id="dash-workspace" label="Workspace · generate" width={1440} height={900}>
            <DashWorkspace/>
          </DCArtboard>
          <DCArtboard id="dash-progress" label="Generating · progress" width={1440} height={900}>
            <DashProgress/>
          </DCArtboard>
          <DCArtboard id="dash-gallery" label="Gallery / history" width={1440} height={900}>
            <DashGallery/>
          </DCArtboard>
        </DCSection>

        <DCSection id="features-pages" title="Feature detail pages" subtitle="One marketing page per tool — hero, how-it-works, capabilities, examples, use cases, specs, FAQ">
          {TOOLS.map((tl) => (
            <DCArtboard key={tl.id} id={`feat-${tl.id}`} label={tl.name} width={1440} height={({infographics:4280,editor:4180,interior:4180,mockups:4160,backgrounds:4184,patterns:4140}[tl.id]) || 4280}>
              <FeatureDetail tool={tl}/>
            </DCArtboard>
          ))}
        </DCSection>

        <DCSection id="mobile" title="Mobile" subtitle="Same system at 390×844 — scrollable landing + app screens with bottom tab bar">
          <DCArtboard id="m-landing" label="Landing · mobile" width={390} height={844}>
            <MobileLanding/>
          </DCArtboard>
          <DCArtboard id="m-home" label="App · home" width={390} height={844}>
            <MobileHome/>
          </DCArtboard>
          <DCArtboard id="m-generate" label="App · generate" width={390} height={844}>
            <MobileGenerate/>
          </DCArtboard>
          <DCArtboard id="m-progress" label="App · generating" width={390} height={844}>
            <MobileProgress/>
          </DCArtboard>
          <DCArtboard id="m-result" label="App · result" width={390} height={844}>
            <MobileResult/>
          </DCArtboard>
          <DCArtboard id="m-gallery" label="App · gallery" width={390} height={844}>
            <MobileGallery/>
          </DCArtboard>
        </DCSection>

        <DCPostIt top={120} left={1500} rotate={-2.5} width={232}>
          One design system across a desktop landing page + full dashboard. Toggle Tweaks → switch the LIGHT variant, swap accent, or change density.
        </DCPostIt>
        <DCPostIt top={420} left={1500} rotate={2} width={232}>
          Interactive: drag the before/after sliders, open the FAQ, run the live demo block, flip the UZ/RU/EN switchers, collapse the dashboard sidebar.
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel title="Artboard · Tweaks">
        <TweakSection label="Theme"/>
        <TweakRadio label="Mode" value={t.theme}
          options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
          onChange={(v) => setTweak('theme', v)}/>
        <TweakSection label="Accent"/>
        <TweakRadio label="Color" value={t.accent}
          options={[{ value: 'lime', label: 'Lime' }, { value: 'blue', label: 'Blue' }, { value: 'violet', label: 'Violet' }, { value: 'amber', label: 'Amber' }]}
          onChange={(v) => setTweak('accent', v)}/>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
