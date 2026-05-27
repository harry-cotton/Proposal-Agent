/* global React, APW_DATA */
// Working app — dark dashboard. Three tabs: Discovery, Detail, Run.
// Internal nav lives in the parent (TopBar). This file exports WorkingApp.

const { useState: useStateW, useEffect: useEffectW, useRef: useRefW } = React;
const D_W = window.APW_DATA;

// ─── tokens ─────────────────────────────────────────────────────
const KW = {
  bg: "#0b0b0e", panel: "#13131a", panelHi: "#1a1a22", panelInset: "#08080b",
  border: "#252530", borderHi: "#36363f",
  text: "#e6e6ec", text2: "#a3a3b0", text3: "#6c6c78", dim: "#4a4a55",
  mint: "#5eead4", amber: "#f5a524", green: "#4ade80", rose: "#f87171", violet: "#a78bfa",
};

// ─── primitives ─────────────────────────────────────────────────
const W_Display = ({ children, size = 56, weight = 500, style }) => (
  <div style={{
    fontFamily: '"Space Grotesk", sans-serif', fontWeight: weight,
    fontSize: size, lineHeight: 1.02, letterSpacing: -1.2, color: KW.text, ...style,
  }}>{children}</div>
);

const W_Mono = ({ children, size = 12, color = KW.text2, weight = 400, style }) => (
  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: size, color, fontWeight: weight, ...style }}>{children}</span>
);

const W_Eyebrow = ({ children, color = KW.text3, style }) => (
  <div style={{
    fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5,
    letterSpacing: 1.6, textTransform: "uppercase", fontWeight: 500, color, ...style,
  }}>{children}</div>
);

const W_Tag = ({ children, tone = "neutral", style, dot = false }) => {
  const tones = {
    neutral: { bg: KW.panel, fg: KW.text2, bd: KW.border, dotC: KW.text3 },
    mint:    { bg: "rgba(94,234,212,.08)", fg: KW.mint, bd: "rgba(94,234,212,.3)", dotC: KW.mint },
    amber:   { bg: "rgba(245,165,36,.08)", fg: KW.amber, bd: "rgba(245,165,36,.3)", dotC: KW.amber },
    green:   { bg: "rgba(74,222,128,.08)", fg: KW.green, bd: "rgba(74,222,128,.3)", dotC: KW.green },
    rose:    { bg: "rgba(248,113,113,.08)", fg: KW.rose, bd: "rgba(248,113,113,.3)", dotC: KW.rose },
    violet:  { bg: "rgba(167,139,250,.08)", fg: KW.violet, bd: "rgba(167,139,250,.3)", dotC: KW.violet },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "2px 8px", border: `1px solid ${tones.bd}`, background: tones.bg, color: tones.fg,
      fontFamily: '"JetBrains Mono", monospace', fontSize: 11, lineHeight: 1.55, whiteSpace: "nowrap", ...style,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: 3, background: tones.dotC }} />}
      {children}
    </span>
  );
};

const W_Counter = ({ value, prefix = "", suffix = "", duration = 900 }) => {
  const [n, setN] = useStateW(0);
  const ref = useRefW(null);
  const fired = useRefW(false);
  useEffectW(() => {
    const el = ref.current; if (!el) return;
    const animate = () => {
      if (fired.current) return;
      fired.current = true;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(value * eased);
        if (p < 1) requestAnimationFrame(tick); else setN(value);
      };
      requestAnimationFrame(tick);
    };
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) && r.bottom > 0) { animate(); return; }
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) animate();
    }, { threshold: 0 });
    io.observe(el);
    const safety = setTimeout(() => {
      if (!fired.current) { fired.current = true; setN(value); }
    }, 1500);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [value, duration]);
  return <span ref={ref}>{prefix}{Math.round(n).toLocaleString()}{suffix}</span>;
};

const W_Sparkline = ({ data, color = KW.mint, width = 80, height = 22 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={height - 2 - ((data[data.length - 1] - min) / span) * (height - 4)} r="2" fill={color} />
    </svg>
  );
};

const W_Panel = ({ title, action, children, style, padded = true, inset = false }) => (
  <section style={{ border: `1px solid ${KW.border}`, background: inset ? KW.panelInset : KW.panel, ...style }}>
    {title && (
      <header style={{ padding: "10px 14px", borderBottom: `1px solid ${KW.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <W_Mono size={10.5} color={KW.text3} style={{ letterSpacing: 1.4, textTransform: "uppercase" }}>{title}</W_Mono>
        <div style={{ flex: 1 }} />
        {action}
      </header>
    )}
    <div style={padded ? { padding: 18 } : null}>{children}</div>
  </section>
);

// ─── shared utilities ────────────────────────────────────────────
const W_Content = ({ children, style }) => (
  <div style={{ padding: "40px 56px 80px", maxWidth: 1400, margin: "0 auto", ...style }}>{children}</div>
);

const W_Head = ({ kicker, title, lead, right }) => (
  <header style={{ display: "flex", alignItems: "flex-start", gap: 32, marginBottom: 32 }}>
    <div style={{ flex: 1, maxWidth: 880 }}>
      {kicker && <W_Eyebrow color={KW.mint} style={{ marginBottom: 14 }}>{kicker}</W_Eyebrow>}
      <W_Display size={44} weight={600}>{title}</W_Display>
      {lead && <div style={{ marginTop: 14, color: KW.text2, fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>{lead}</div>}
    </div>
    {right}
  </header>
);

// ════════════════════════════════════════════════════════════════
// DISCOVERY
// ════════════════════════════════════════════════════════════════
function DiscoveryTab({ selectOpp }) {
  const [primeOnly, setPrimeOnly] = useStateW(false);
  const [minFit, setMinFit] = useStateW(25);
  const [search, setSearch] = useStateW("");
  const filtered = D_W.opportunities.filter((o) =>
    (!primeOnly || o.elig === "Prime") &&
    o.fit >= minFit &&
    (!search || (o.title + o.agency).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <W_Content>
      {/* live demo banner — first thing the partner sees after clicking
          through from the case study. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", marginBottom: 24,
        border: `1px solid ${KW.mint}`, background: "rgba(94,234,212,.06)",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: KW.mint }} className="pulse-dot" />
        <W_Mono size={11.5} color={KW.text}>
          <b style={{ color: KW.mint }}>Real data, real architecture.</b> The opportunities below come straight from SAM.gov; the agent run on the next tab is real captured output. Happy to demo a fresh solicitation end-to-end on a call.
        </W_Mono>
      </div>

      <W_Head
        kicker="$ bd_agent --discover"
        title={<>22 cached opportunities. <span style={{ color: KW.amber }}>17 high fit.</span> <span style={{ color: KW.rose }}>11 close in 14 days.</span></>}
        lead="Scored against a demo firm profile — three NAICS codes (541810, 541512, 541613), unrestricted set-aside, prime-eligible. Fit = NAICS alignment + eligibility + capability keywords + past-performance match."
        right={<button style={workingBtnPrimary}>↓ refresh from sam.gov</button>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 24 }}>
        <W_Panel title="snapshot">
          {[
            { l: "opportunities_tracked", v: 22 },
            { l: "high_fit (>=75)",       v: 17, tone: KW.amber },
            { l: "closing_within_14_days", v: 11, tone: KW.rose },
          ].map((r, i) => (
            <div key={r.l} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${KW.border}` : "none" }}>
              <W_Mono size={11.5} color={KW.text3}>{r.l}</W_Mono>
              <W_Display size={32} weight={600} style={{ color: r.tone || KW.text }}><W_Counter value={r.v} /></W_Display>
            </div>
          ))}
        </W_Panel>
        <W_Panel title="fit_score distribution" action={<W_Mono size={10.5} color={KW.text3}>bimodal · advertising + IT</W_Mono>}>
          <W_FitChart bins={D_W.fitDistribution} />
          <W_Mono size={11} color={KW.text3} style={{ display: "block", marginTop: 12, fontStyle: "italic" }}>
            Each bar = count of cached opportunities in that fit-score band. Two peaks (70–79 and 90–99) reflect the demo firm's two strength areas matching different NAICS pools.
          </W_Mono>
        </W_Panel>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, padding: "12px 16px", border: `1px solid ${KW.border}`, background: KW.panel }}>
        <W_Mono size={10.5} color={KW.text3} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>filter</W_Mono>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: KW.text2, cursor: "pointer" }}>
          <input type="checkbox" checked={primeOnly} onChange={(e) => setPrimeOnly(e.target.checked)} style={{ accentColor: KW.mint }} />
          <W_Mono size={11.5} color={KW.text2}>prime_eligible_only</W_Mono>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <W_Mono size={11.5} color={KW.text2}>min_fit</W_Mono>
          <input type="range" min="0" max="100" value={minFit} onChange={(e) => setMinFit(+e.target.value)} style={{ width: 140, accentColor: KW.mint }} />
          <W_Mono size={11.5} color={KW.mint} style={{ width: 30 }}>{minFit}</W_Mono>
        </label>
        <div style={{ flex: 1 }} />
        <input type="text" placeholder="grep title or agency…" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ border: `1px solid ${KW.border}`, background: KW.panelInset, padding: "6px 10px", fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: KW.text, width: 280, outline: "none" }} />
      </div>

      <div style={{ border: `1px solid ${KW.border}`, background: KW.panel }}>
        <div style={{
          display: "grid", gridTemplateColumns: "60px 90px 1fr 280px 90px 110px 60px",
          padding: "10px 14px", borderBottom: `1px solid ${KW.border}`,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: 1.2, textTransform: "uppercase", color: KW.text3, background: KW.panelInset,
        }}>
          <div>fit</div><div>elig</div><div>title</div><div>agency</div><div>naics</div><div>deadline</div><div></div>
        </div>
        {filtered.map((o, i) => (
          <button key={o.id} onClick={() => selectOpp(o.id)} style={{
            display: "grid", gridTemplateColumns: "60px 90px 1fr 280px 90px 110px 60px",
            width: "100%", padding: "11px 14px",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.012)",
            borderBottom: `1px solid ${KW.border}`,
            border: "none", cursor: "pointer", textAlign: "left",
            alignItems: "center", fontFamily: "inherit", fontSize: 12.5, color: KW.text, transition: "background .12s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(94,234,212,.04)"}
            onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,.012)"}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: o.fit >= 90 ? KW.green : o.fit >= 70 ? KW.amber : KW.dim }} />
              <W_Mono size={12} color={KW.text} weight={500}>{o.fit}</W_Mono>
            </div>
            <W_Tag tone={o.elig === "Prime" ? "green" : "neutral"} dot>{o.elig.toLowerCase()}</W_Tag>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{o.title}</div>
            <W_Mono size={10.5} color={KW.text3} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.agency}</W_Mono>
            <W_Mono size={11} color={KW.text2}>{o.naics}</W_Mono>
            <W_Mono size={11} color={KW.text2}>{o.deadline}</W_Mono>
            <div style={{ textAlign: "right", color: KW.mint, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>→</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: KW.text3 }}>
        <span>loaded {filtered.length}/{D_W.opportunities.length} · 3 cache files: 2026-05-15 · 2026-05-18 · 2026-05-27</span>
        <span>rows · {filtered.length}</span>
      </div>
    </W_Content>
  );
}

function W_FitChart({ bins }) {
  const max = Math.max(...bins.map((b) => b.count));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, paddingBottom: 24, borderBottom: `1px solid ${KW.border}` }}>
      {bins.map((b, i) => (
        <div key={b.band} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          <W_Mono size={10} color={b.count ? KW.mint : "transparent"} style={{ marginBottom: 4 }}>{b.count}</W_Mono>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%", height: `${(b.count / Math.max(max,1)) * 100}%`,
              background: i >= 9 ? KW.green : i >= 7 ? KW.mint : i >= 5 ? KW.amber : KW.borderHi,
              minHeight: b.count ? 3 : 0, transition: "height .6s cubic-bezier(.2,.7,.3,1)",
            }} />
          </div>
          <W_Mono size={10} color={KW.text3} style={{ marginTop: 6 }}>{b.band}</W_Mono>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// OPPORTUNITY DETAIL
// ════════════════════════════════════════════════════════════════
function DetailTab({ oppId, setTab }) {
  const o = D_W.opportunities.find((x) => x.id === oppId) || D_W.opportunities[0];
  const sc = D_W.scoring;
  return (
    <W_Content>
      <button onClick={() => setTab("discovery")} style={{
        background: "transparent", border: "none", cursor: "pointer", padding: 0,
        color: KW.text3, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, marginBottom: 24,
      }}>← cd ../discovery</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <W_Tag tone="mint" dot>{o.type}</W_Tag>
            <W_Tag tone="amber">NAICS {o.naics}</W_Tag>
            <W_Tag tone="green" dot>prime · {o.setAside.toLowerCase()}</W_Tag>
            <W_Tag tone="rose" dot>deadline · {o.deadline}</W_Tag>
          </div>
          <W_Display size={38} weight={600}>{o.title}</W_Display>
          <W_Mono size={12} color={KW.text3} style={{ display: "block", marginTop: 14 }}>{o.agency}</W_Mono>
        </div>
        <W_Panel title="fit_score" inset>
          <W_Display size={88} weight={700} style={{ color: KW.green, lineHeight: 1, fontFamily: '"JetBrains Mono", monospace' }}>
            <W_Counter value={sc.fit} />
            <W_Mono size={28} color={KW.text3} style={{ marginLeft: 4 }}>/100</W_Mono>
          </W_Display>
          <div style={{ height: 1, background: KW.border, margin: "16px 0" }} />
          <W_Mono size={10.5} color={KW.text3} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>verdict</W_Mono>
          <W_Display size={18} weight={600} style={{ marginTop: 6, color: KW.mint }}>Strong match — pursue.</W_Display>
        </W_Panel>
      </div>

      <W_Panel title="metadata" style={{ marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {[
            { l: "notice_id",     v: o.id, mono: true },
            { l: "solicitation",  v: o.sol, mono: true },
            { l: "posted",        v: "2026-05-18" },
            { l: "deadline",      v: o.deadline, tone: KW.amber },
            { l: "naics",         v: `${o.naics} — ${o.naicsTitle}` },
            { l: "set_aside",     v: o.setAside },
          ].map((r, i) => (
            <div key={r.l} style={{
              padding: 16, borderTop: i >= 3 ? `1px solid ${KW.border}` : "none",
              borderLeft: i % 3 ? `1px solid ${KW.border}` : "none",
            }}>
              <W_Mono size={10.5} color={KW.text3} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>{r.l}</W_Mono>
              <div style={{
                marginTop: 6, fontFamily: r.mono ? '"JetBrains Mono", monospace' : "inherit",
                fontSize: r.mono ? 12 : 14, color: r.tone || KW.text, wordBreak: "break-all",
              }}>{r.v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${KW.border}`, background: KW.panelInset }}>
          <W_Mono size={11} color={KW.text3}>sam.gov · </W_Mono>
          <a href="#" style={{ color: KW.mint, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>
            https://sam.gov/workspace/contract/opp/{o.id}/view
          </a>
        </div>
      </W_Panel>

      <W_Panel title="scoring_breakdown" style={{ marginBottom: 24 }} action={<W_Mono size={10.5} color={KW.green}>● all factors green</W_Mono>}>
        {sc.breakdown.map((b) => (
          <div key={b.factor} style={{
            display: "grid", gridTemplateColumns: "240px 1fr 160px 80px",
            padding: "14px 0", borderBottom: `1px solid ${KW.border}`, alignItems: "center", gap: 24,
          }}>
            <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600, fontSize: 15 }}>{b.factor}</div>
            <W_Mono size={11.5} color={KW.text2} style={{ lineHeight: 1.5 }}>{b.note}</W_Mono>
            <div style={{ height: 6, background: KW.panelInset, position: "relative", border: `1px solid ${KW.border}` }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(b.score / b.max) * 100}%`,
                background: b.score === b.max ? KW.green : KW.amber,
              }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <W_Mono size={22} weight={600} color={b.score === b.max ? KW.green : KW.text}>{b.score}</W_Mono>
              <W_Mono size={12} color={KW.text3}>/{b.max}</W_Mono>
            </div>
          </div>
        ))}
      </W_Panel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button style={workingActionCard}>
          <W_Mono size={10.5} color={KW.text3} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>step_01</W_Mono>
          <W_Display size={22} weight={600} style={{ marginTop: 8, marginBottom: 6 }}>$ fetch_notice</W_Display>
          <W_Mono size={11} color={KW.text3}>9 PDFs · 2.4 MB · ~22 s</W_Mono>
        </button>
        <button onClick={() => setTab("run")} style={{ ...workingActionCard, background: "rgba(94,234,212,.06)", borderColor: KW.mint }}>
          <W_Mono size={10.5} color={KW.mint} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>step_02 · primary</W_Mono>
          <W_Display size={22} weight={600} style={{ marginTop: 8, marginBottom: 6, color: KW.mint }}>$ bd_agent --run → {o.sol}</W_Display>
          <W_Mono size={11} color={KW.text2}>drafts Vol I + Vol III + compliance.xlsx · ~3 min · ~$3 spend</W_Mono>
        </button>
      </div>
    </W_Content>
  );
}

// ════════════════════════════════════════════════════════════════
// AGENT RUN
// ════════════════════════════════════════════════════════════════
function AgentRunTab() {
  const [tick, setTick] = useStateW(0);
  const [playing, setPlaying] = useStateW(true);
  const [speed, setSpeed] = useStateW(1);

  useEffectW(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTick((t) => Math.min(t + 1, D_W.runSteps.length));
    }, 650 / speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const done = tick >= D_W.runSteps.length;
  const elapsed = done ? "03:07" : D_W.runSteps[Math.max(0, tick - 1)]?.t || "00:00";
  const reset = () => { setTick(0); setPlaying(true); };

  return (
    <W_Content>
      <W_Head
        kicker="$ bd_agent --run HDTRA1-26-R-0064"
        title={<>Agent run · <span style={{ color: KW.mint }}>{D_W.opportunities[0].sol}</span></>}
        lead="Receive task → fan out extraction → pick past-performance → draft technical volume → compliance checks → patch gaps → emit artifacts."
        right={
          <W_Panel inset padded={false} style={{ minWidth: 280 }}>
            <div style={{ padding: "12px 14px", borderBottom: `1px solid ${KW.border}` }}>
              <W_Mono size={10.5} color={KW.text3} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>elapsed</W_Mono>
              <W_Display size={36} weight={600} style={{ color: done ? KW.green : KW.mint, fontFamily: '"JetBrains Mono", monospace', marginTop: 2 }}>{elapsed}</W_Display>
            </div>
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setPlaying((p) => !p)} style={workingIconBtn}>{playing ? "❚❚" : "▶"}</button>
              <button onClick={reset} style={workingIconBtn}>↻</button>
              <div style={{ flex: 1 }} />
              <W_Mono size={10.5} color={KW.text3}>speed</W_Mono>
              <select value={speed} onChange={(e) => setSpeed(+e.target.value)} style={{
                border: `1px solid ${KW.border}`, background: KW.panelInset, color: KW.text,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11, padding: "3px 6px",
              }}>
                <option value={0.5}>0.5×</option><option value={1}>1×</option>
                <option value={2}>2×</option><option value={4}>4×</option>
              </select>
            </div>
          </W_Panel>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <W_Panel title="bd_agent.log · trace" inset padded={false}>
          <div style={{ padding: "14px 18px", fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: 1.6 }}>
            {D_W.runSteps.slice(0, tick).map((s, i) => {
              const active = i === tick - 1;
              const c = colorFor(s.cls);
              return (
                <div key={i} className="trace-row" style={{
                  display: "grid", gridTemplateColumns: "70px 110px 1fr",
                  gap: 12, padding: "6px 0",
                  borderBottom: `1px solid ${KW.border}`,
                  alignItems: "baseline",
                }}>
                  <W_Mono size={11} color={active ? KW.mint : KW.text3}>[{s.t}]</W_Mono>
                  <W_Mono size={11} color={c}>{s.agent}</W_Mono>
                  <div>
                    <W_Mono size={11.5} color={KW.text}>
                      {s.tool !== "—" && <span style={{ color: KW.text3 }}>{s.tool} </span>}
                      {s.action}
                      {active && <span className="caret" style={{ marginLeft: 6, color: KW.mint }}>▮</span>}
                    </W_Mono>
                    <W_Mono size={11} color={KW.text3} style={{ display: "block", marginTop: 2 }}>↳ {s.detail}</W_Mono>
                  </div>
                </div>
              );
            })}
            {done && (
              <div style={{ paddingTop: 14, color: KW.green, fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>
                ✓ run complete · 3 artifacts written · exit 0
              </div>
            )}
          </div>
          <div style={{ padding: "10px 18px", borderTop: `1px solid ${KW.border}`, display: "flex", alignItems: "center", gap: 12, background: KW.panel }}>
            <W_Mono size={11} color={KW.text3}>step {tick}/{D_W.runSteps.length}</W_Mono>
            <div style={{ flex: 1, height: 4, background: KW.border, position: "relative" }}>
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: `${(tick / D_W.runSteps.length) * 100}%`,
                background: done ? KW.green : KW.mint, transition: "width .4s ease",
              }} />
            </div>
            <W_Mono size={11} color={done ? KW.green : KW.mint}>{Math.round((tick / D_W.runSteps.length) * 100)}%</W_Mono>
          </div>
        </W_Panel>
        <W_RunArtifacts tick={tick} done={done} />
      </div>
    </W_Content>
  );
}

function colorFor(cls) {
  return { system: KW.text2, tool: KW.text, claude: KW.mint, fanout: KW.violet, loop: KW.amber, done: KW.green }[cls] || KW.text2;
}

function W_RunArtifacts({ tick, done }) {
  const artifacts = [
    { name: "extraction.json",       size: "18 KB",                available: tick >= 8,  type: "JSON" },
    { name: "pp_selection.json",     size: "3 KB",                 available: tick >= 9,  type: "JSON" },
    { name: "proposal.docx",         size: "~58 KB · 22 pp",        available: tick >= 12, type: "DOC" },
    { name: "pp.docx",               size: "47 KB · 5 narratives", available: tick >= 12, type: "DOC" },
    { name: "compliance.xlsx",       size: "22 KB · 47 reqs",      available: tick >= 13, type: "XLS" },
  ];
  return (
    <div style={{ position: "sticky", top: 60, alignSelf: "start" }}>
      <W_Panel title="$ ls artifacts/">
        {artifacts.map((a) => (
          <div key={a.name} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 0",
            opacity: a.available ? 1 : 0.4, borderBottom: `1px solid ${KW.border}`,
            transition: "opacity .5s ease",
          }}>
            <div style={{
              width: 28, height: 28,
              border: `1px solid ${a.available ? (a.type === "JSON" ? KW.violet : a.type === "XLS" ? KW.green : KW.mint) : KW.border}`,
              color: a.available ? (a.type === "JSON" ? KW.violet : a.type === "XLS" ? KW.green : KW.mint) : KW.dim,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 600,
            }}>{a.type}</div>
            <div style={{ flex: 1 }}>
              <W_Mono size={11.5} color={KW.text}>{a.name}</W_Mono>
              <W_Mono size={10.5} color={KW.text3} style={{ display: "block" }}>{a.size}</W_Mono>
            </div>
            {a.available && <W_Tag tone="green" dot>ready</W_Tag>}
          </div>
        ))}
      </W_Panel>
      {done && (
        <W_Panel title="// summary" inset style={{ marginTop: 12, borderColor: KW.mint }}>
          <W_Display size={28} weight={600} style={{ color: KW.mint, fontFamily: '"JetBrains Mono", monospace' }}>03:07 · $3</W_Display>
          <W_Mono size={11.5} color={KW.text2} style={{ display: "block", marginTop: 8, lineHeight: 1.5 }}>
            saved approximately 40 analyst hours of first-pass work.
          </W_Mono>
        </W_Panel>
      )}
    </div>
  );
}

// ─── shared buttons (uniquely named to avoid scope collision) ────
const workingBtnPrimary = {
  border: `1px solid ${KW.mint}`, background: KW.mint, color: KW.bg,
  padding: "10px 18px", cursor: "pointer", fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11.5, fontWeight: 600, letterSpacing: 0.4,
};
const workingIconBtn = {
  width: 28, height: 26, border: `1px solid ${KW.border}`, background: KW.panelInset,
  color: KW.text, cursor: "pointer", fontSize: 10, fontFamily: '"JetBrains Mono", monospace',
};
const workingActionCard = {
  textAlign: "left", padding: 20, border: `1px solid ${KW.border}`, background: KW.panel,
  cursor: "pointer", fontFamily: "inherit",
};

// ════════════════════════════════════════════════════════════════
// WorkingApp — routes between Discovery, Detail, Run
// ════════════════════════════════════════════════════════════════
function WorkingApp({ tab, setTab, oppId, setOppId }) {
  const selectOpp = (id) => { setOppId(id); setTab("detail"); };
  return (
    <div style={{ background: KW.bg, color: KW.text, minHeight: "100vh" }}>
      {tab === "discovery" && <DiscoveryTab selectOpp={selectOpp} />}
      {tab === "detail"    && <DetailTab oppId={oppId} setTab={setTab} />}
      {tab === "run"       && <AgentRunTab />}
    </div>
  );
}

window.WorkingApp = WorkingApp;
window.W_TOKENS = KW;
