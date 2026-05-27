/* global React, APW_DATA */
// About — the case-study front door. Light editorial.
// Scope: only AboutPage is exported to window; everything else lives here.

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;
const D_ABOUT = window.APW_DATA;

// ─── editorial palette ────────────────────────────────────
const CA = {
  paper: "#f3efe8",     paperDeep: "#ebe5d9",    paperLift: "#faf7f0",
  ink: "#1a1814",       ink2: "#3a342c",          ink3: "#6d6657",
  mute: "#9d9586",      rule: "#d6cdba",          ruleSoft: "#e3dccb",
  ox: "#7a2e2e",        oxSoft: "#a8534b",
  gold: "#b48a55",      good: "#3f6b3a",          warn: "#a5762a",
};

// ─── primitives (scoped) ──────────────────────────────────
const A_Eyebrow = ({ children, color = CA.ox, style }) => (
  <div style={{
    fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5,
    letterSpacing: 1.6, textTransform: "uppercase",
    color, fontWeight: 500, ...style,
  }}>{children}</div>
);

const A_Serif = ({ children, size = 48, weight = 400, italic = false, style }) => (
  <div style={{
    fontFamily: '"Instrument Serif", serif',
    fontWeight: weight, fontSize: size,
    fontStyle: italic ? "italic" : "normal",
    lineHeight: 1.05, letterSpacing: -0.5,
    color: CA.ink, ...style,
  }}>{children}</div>
);

const A_Mono = ({ children, size = 12, color = CA.ink2, style }) => (
  <span style={{
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: size, color, ...style,
  }}>{children}</span>
);

const A_Pill = ({ children, tone = "neutral", style }) => {
  const tones = {
    neutral: { bg: "transparent", fg: CA.ink3, bd: CA.rule },
    ox: { bg: "rgba(122,46,46,.06)", fg: CA.ox, bd: "rgba(122,46,46,.25)" },
    good: { bg: "rgba(63,107,58,.08)", fg: CA.good, bd: "rgba(63,107,58,.25)" },
    gold: { bg: "rgba(180,138,85,.10)", fg: "#7d5e2f", bd: "rgba(180,138,85,.35)" },
    ink: { bg: CA.ink, fg: CA.paperLift, bd: CA.ink },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", border: `1px solid ${tones.bd}`,
      background: tones.bg, color: tones.fg,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11, letterSpacing: 0.4, textTransform: "uppercase",
      borderRadius: 999, whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
};

const A_Counter = ({ value, prefix = "", suffix = "", duration = 1100 }) => {
  const [n, setN] = useStateA(0);
  const ref = useRefA(null);
  const fired = useRefA(false);
  useEffectA(() => {
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
    // If already visible on first paint, animate now.
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) && r.bottom > 0) { animate(); return; }
    // Otherwise wait for it to scroll into view.
    const io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) animate();
    }, { threshold: 0 });
    io.observe(el);
    // Safety fallback — if nothing triggers (PDF export, headless render,
    // weird viewport), just show the final value after 1.5s.
    const safety = setTimeout(() => {
      if (!fired.current) { fired.current = true; setN(value); }
    }, 1500);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [value, duration]);
  return <span ref={ref}>{prefix}{Math.round(n).toLocaleString()}{suffix}</span>;
};

const A_Page = ({ children }) => (
  <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 56px" }}>{children}</div>
);

const A_SectionHead = ({ kicker, title, lead, kickerNumber }) => (
  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40, alignItems: "baseline", marginBottom: 28 }}>
    <div>
      {kickerNumber && <A_Mono size={11} color={CA.ox} style={{ display: "block", marginBottom: 4 }}>§ {kickerNumber}</A_Mono>}
      <A_Eyebrow>{kicker}</A_Eyebrow>
    </div>
    <div>
      <A_Serif size={36}>{title}</A_Serif>
      {lead && <div style={{ marginTop: 12, color: CA.ink2, fontSize: 16, lineHeight: 1.55, maxWidth: 720 }}>{lead}</div>}
    </div>
  </div>
);

// ─── architecture diagram (light version) ─────────────────
function A_ArchDiagram() {
  const L = {
    user: { x: 480, y: 30, w: 240, h: 50, kind: "user", t: 'User: "Draft proposal for solnum X"' },
    agent: { x: 480, y: 130, w: 240, h: 76, kind: "claude", t: "bd_agent", s: "Sonnet 4.6 · tool-use loop · maintains state" },
    autonomous: { x: 770, y: 144, w: 220, h: 50, kind: "pattern", t: "AUTONOMOUS AGENT", s: "LLM drives tool calls until task complete" },
    routing: { x: 165, y: 246, w: 200, h: 44, kind: "pattern", t: "ROUTING", s: "agent picks one tool at a time" },
    sam: { x: 60, y: 326, w: 180, h: 64, kind: "tool", t: "sam_fetcher", s: "SAM.gov API · cache + retry" },
    extract: { x: 250, y: 326, w: 200, h: 64, kind: "tool", t: "extractor_multi", s: "parses PWS, attachments, cross-doc" },
    ppselect: { x: 460, y: 326, w: 180, h: 64, kind: "tool", t: "pp_select", s: "Sonnet picks 3–5 PP refs · cached" },
    ppwriter: { x: 650, y: 326, w: 200, h: 64, kind: "claude", t: "proposal_writer", s: "Opus 4.6 · streaming · PP-grounded" },
    compliance: { x: 860, y: 326, w: 180, h: 64, kind: "tool", t: "compliance_matrix", s: "extraction → xlsx · req → ¶ map" },
    workers: { x: 250, y: 422, w: 200, h: 40, kind: "pattern", t: "ORCHESTRATOR · WORKERS" },
    pws: { x: 250, y: 486, w: 44, h: 30, kind: "minor", t: "PWS" },
    secl: { x: 300, y: 486, w: 44, h: 30, kind: "minor", t: "Sec L" },
    secm: { x: 356, y: 486, w: 44, h: 30, kind: "minor", t: "Sec M" },
    qa: { x: 406, y: 486, w: 44, h: 30, kind: "minor", t: "Q&A" },
    evaluator: { x: 650, y: 422, w: 200, h: 44, kind: "pattern", t: "EVALUATOR · OPTIMIZER" },
    checks: { x: 650, y: 478, w: 200, h: 72, kind: "minor", t: "post-draft checks", s: "banned words · em-dash density · PP citation coverage" },
    out1: { x: 60, y: 580, w: 180, h: 40, kind: "out", t: "9 PDFs" },
    out2: { x: 250, y: 580, w: 200, h: 40, kind: "out", t: "extraction.json" },
    out3: { x: 460, y: 580, w: 180, h: 40, kind: "out", t: "pp_selection.json" },
    out4: { x: 650, y: 580, w: 200, h: 40, kind: "out", t: "proposal.docx + pp.docx" },
    out5: { x: 860, y: 580, w: 180, h: 40, kind: "out", t: "compliance.xlsx" },
  };
  const sty = (k) => ({
    user: { fill: "#fff", stroke: CA.ink, color: CA.ink, font: '"IBM Plex Sans", sans-serif', size: 13, weight: 500 },
    claude: { fill: CA.ox, stroke: CA.ox, color: "#fff", font: '"IBM Plex Sans", sans-serif', size: 14, weight: 600 },
    tool: { fill: "#fff", stroke: CA.ink2, color: CA.ink, font: '"IBM Plex Mono", monospace', size: 12, weight: 500 },
    pattern: { fill: "rgba(180,138,85,0.10)", stroke: CA.gold, dash: "4 3", color: "#7d5e2f", font: '"IBM Plex Mono", monospace', size: 10.5, weight: 500, upper: true },
    minor: { fill: CA.paperDeep, stroke: CA.rule, color: CA.ink2, font: '"IBM Plex Mono", monospace', size: 10.5 },
    out: { fill: CA.paperDeep, stroke: CA.rule, color: CA.ink2, font: '"IBM Plex Mono", monospace', size: 11.5 },
  })[k];
  const Box = ({ k }) => {
    const b = L[k]; const s = sty(b.kind);
    return (
      <g>
        <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={s.fill} stroke={s.stroke} strokeWidth="1" strokeDasharray={s.dash} rx="2" />
        <text x={b.x + b.w/2} y={b.y + (b.s ? b.h/2 - 6 : b.h/2 + 4)} fill={s.color} fontFamily={s.font} fontSize={s.size} fontWeight={s.weight||500} textAnchor="middle" style={{ letterSpacing: s.upper ? 1.2 : 0, textTransform: s.upper ? "uppercase" : "none" }}>{b.t}</text>
        {b.s && <text x={b.x + b.w/2} y={b.y + b.h/2 + 12} fill={b.kind === "claude" ? "rgba(255,255,255,.8)" : CA.ink3} fontFamily='"IBM Plex Sans", sans-serif' fontSize="10.5" textAnchor="middle">{b.s}</text>}
      </g>
    );
  };
  return (
    <svg viewBox="0 0 1080 670" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={CA.ink2} /></marker>
        <marker id="arrOx" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={CA.ox} /></marker>
      </defs>
      <line x1="600" y1="80" x2="600" y2="128" stroke={CA.ink2} markerEnd="url(#arr)" />
      <line x1="720" y1="170" x2="768" y2="170" stroke={CA.gold} strokeDasharray="4 3" />
      <path d={`M 600 ${L.agent.y + L.agent.h} L 600 240 L ${L.routing.x + L.routing.w/2} 240 L ${L.routing.x + L.routing.w/2} ${L.routing.y - 2}`} fill="none" stroke={CA.gold} strokeDasharray="4 3" markerEnd="url(#arr)" />
      {[150, 350, 550, 750, 950].map((x) => (
        <path key={x} d={`M 600 320 L 600 308 L ${x} 308 L ${x} 326`} fill="none" stroke={CA.ink2} markerEnd="url(#arr)" />
      ))}
      <path d={`M 150 ${L.sam.y + L.sam.h} L 150 580`} fill="none" stroke={CA.ink2} strokeDasharray="3 3" markerEnd="url(#arr)" />
      <path d={`M 350 ${L.extract.y + L.extract.h} L 350 ${L.workers.y}`} fill="none" stroke={CA.gold} strokeDasharray="4 3" />
      <path d={`M 350 ${L.workers.y + L.workers.h} L 350 480`} fill="none" stroke={CA.ink2} />
      <path d={`M 350 ${L.pws.y + L.pws.h} L 350 580`} fill="none" stroke={CA.ink2} strokeDasharray="3 3" markerEnd="url(#arr)" />
      <path d={`M 550 ${L.ppselect.y + L.ppselect.h} L 550 580`} fill="none" stroke={CA.ink2} strokeDasharray="3 3" markerEnd="url(#arr)" />
      <path d={`M 750 ${L.ppwriter.y + L.ppwriter.h} L 750 ${L.evaluator.y}`} fill="none" stroke={CA.gold} strokeDasharray="4 3" />
      <path d={`M 750 ${L.evaluator.y + L.evaluator.h} L 750 ${L.checks.y}`} fill="none" stroke={CA.ox} strokeDasharray="4 3" />
      <path d={`M ${L.checks.x} ${L.checks.y + 36} C 620 ${L.checks.y + 36}, 620 ${L.ppwriter.y + 30}, ${L.ppwriter.x} ${L.ppwriter.y + 30}`} fill="none" stroke={CA.ox} strokeDasharray="3 3" markerEnd="url(#arrOx)" />
      <path d={`M 750 ${L.checks.y + L.checks.h} L 750 580`} fill="none" stroke={CA.ink2} strokeDasharray="3 3" markerEnd="url(#arr)" />
      <path d={`M 950 ${L.compliance.y + L.compliance.h} L 950 580`} fill="none" stroke={CA.ink2} strokeDasharray="3 3" markerEnd="url(#arr)" />
      {Object.keys(L).map((k) => <Box key={k} k={k} />)}
      <g transform="translate(60, 640)">
        <rect x="0" y="-12" width="14" height="14" fill={CA.ox} stroke={CA.ox} />
        <text x="20" y="0" fontFamily='"IBM Plex Sans", sans-serif' fontSize="11" fill={CA.ink2}>LLM call (Claude)</text>
        <rect x="148" y="-12" width="14" height="14" fill="#fff" stroke={CA.ink2} />
        <text x="168" y="0" fontFamily='"IBM Plex Sans", sans-serif' fontSize="11" fill={CA.ink2}>deterministic script</text>
        <rect x="298" y="-12" width="14" height="14" fill="rgba(180,138,85,0.10)" stroke={CA.gold} strokeDasharray="3 2" />
        <text x="318" y="0" fontFamily='"IBM Plex Sans", sans-serif' fontSize="11" fill={CA.ink2}>pattern label</text>
        <rect x="430" y="-12" width="14" height="14" fill={CA.paperDeep} stroke={CA.rule} />
        <text x="450" y="0" fontFamily='"IBM Plex Sans", sans-serif' fontSize="11" fill={CA.ink2}>output artifact</text>
        <text x="580" y="0" fontFamily='"IBM Plex Sans", sans-serif' fontSize="11" fill={CA.ink3} fontStyle="italic">dashed = data flow · solid = control flow</text>
      </g>
    </svg>
  );
}

// ─── sample outputs (clickable modal) ─────────────────────
function A_SampleOutputs() {
  const [open, setOpen] = useStateA(null);
  const items = [
    { id: "proposal",   kind: ".docx", title: "Volume I — Technical proposal",  meta: "~22 pp · streamed by Opus 4.6 · grounded in 5 PP refs", accent: CA.ox },
    { id: "pp",         kind: ".docx", title: "Volume III — Past performance",  meta: "5 PP narratives · evaluator-ready format",             accent: CA.gold },
    { id: "compliance", kind: ".xlsx", title: "Compliance matrix",              meta: "Requirement-by-requirement traceability · 47 rows",   accent: CA.good },
  ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {items.map((it) => (
          <button key={it.id} onClick={() => setOpen(it.id)} style={{
            textAlign: "left", padding: 0, border: `1px solid ${CA.rule}`, background: CA.paperLift, cursor: "pointer", fontFamily: "inherit",
          }}>
            <div style={{ height: 240, position: "relative", background: "#fff", overflow: "hidden", borderBottom: `1px solid ${CA.rule}` }}>
              <div style={{ position: "absolute", inset: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 6, width: "60%", background: it.accent }} />
                {[85, 92, 70].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: "#e6e2d8" }} />)}
                <div style={{ height: 12 }} />
                {[95, 88, 92, 60].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: "#ece8de" }} />)}
                <div style={{ height: 12 }} />
                {[82, 76].map((w, i) => <div key={i} style={{ height: 4, width: `${w}%`, background: "#ece8de" }} />)}
              </div>
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <A_Pill><A_Mono size={10}>{it.kind}</A_Mono></A_Pill>
              </div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, color: CA.ink, lineHeight: 1.2 }}>{it.title}</div>
              <div style={{ marginTop: 6, fontSize: 12, color: CA.ink3 }}>{it.meta}</div>
              <div style={{ marginTop: 14, fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: CA.ox, letterSpacing: 1.2, textTransform: "uppercase" }}>Read sample →</div>
            </div>
          </button>
        ))}
      </div>
      {open && <A_SampleModal id={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function A_SampleModal({ id, onClose }) {
  const s = id === "proposal" ? D_ABOUT.samples.proposal : id === "pp" ? D_ABOUT.samples.pp : D_ABOUT.samples.compliance;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(26,24,20,.5)", backdropFilter: "blur(8px)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 60,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: CA.paperLift, maxWidth: 880, width: "100%", maxHeight: "90vh", overflow: "hidden",
        display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,.3)",
      }}>
        <div style={{ padding: "20px 32px", borderBottom: `1px solid ${CA.rule}`, display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <A_Mono size={10.5} color={CA.ox} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>Sample output</A_Mono>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 26, color: CA.ink, marginTop: 2 }}>{s.title}</div>
          </div>
          <div style={{ flex: 1 }} />
          <A_Pill>{id === "compliance" ? ".xlsx" : ".docx"} · {s.pages} pp</A_Pill>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 22, color: CA.ink2, cursor: "pointer", width: 32, height: 32 }}>×</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "36px 60px", background: "#fdfaf4" }}>
          {id === "compliance" ? <A_ComplianceSample rows={s.rows} /> :
            <pre style={{ fontFamily: '"Instrument Serif", serif', fontSize: 18, lineHeight: 1.55, color: CA.ink, whiteSpace: "pre-wrap", margin: 0 }}>{s.excerpt}</pre>}
        </div>
      </div>
    </div>
  );
}

function A_ComplianceSample({ rows }) {
  const tone = (s) => s === "compliant" ? "good" : s === "deferred" ? "gold" : "neutral";
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead><tr style={{ borderBottom: `2px solid ${CA.ink}` }}>{["Section", "Requirement", "Mapped paragraph", "Status"].map((h) => (
        <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, letterSpacing: 1.4, textTransform: "uppercase", color: CA.ink3 }}>{h}</th>
      ))}</tr></thead>
      <tbody>{rows.map((r, i) => (
        <tr key={i} style={{ borderBottom: `1px solid ${CA.rule}` }}>
          <td style={{ padding: "10px 14px", fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: CA.ox }}>{r.sec}</td>
          <td style={{ padding: "10px 14px", color: CA.ink, maxWidth: 380 }}>{r.req}</td>
          <td style={{ padding: "10px 14px", fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: CA.ink2 }}>{r.para}</td>
          <td style={{ padding: "10px 14px" }}><A_Pill tone={tone(r.status)}>{r.status}</A_Pill></td>
        </tr>
      ))}</tbody>
    </table>
  );
}

// ════════════════════════════════════════════════════════════════
// The About page (case study front door)
// ════════════════════════════════════════════════════════════════
function AboutPage({ openApp }) {
  const a = D_ABOUT.author;
  return (
    <main style={{ background: CA.paper, color: CA.ink }}>
      {/* HERO ─────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${CA.rule}`, paddingBottom: 60 }}>
        <A_Page>
          <div style={{ paddingTop: 64, display: "grid", gridTemplateColumns: "180px 1fr", gap: 40 }}>
            <div>
              <A_Mono size={11} color={CA.ox}>§ 00 · COVER</A_Mono>
              <div style={{ marginTop: 12, color: CA.ink3, fontSize: 12, lineHeight: 1.55, fontFamily: '"IBM Plex Mono", monospace' }}>
                Case study<br/>27 May 2026<br/>Personal project, paternity leave
              </div>
              <div style={{ marginTop: 24 }}>
                <A_Pill tone="ox">▸ Case Study</A_Pill>
              </div>
            </div>
            <div>
              <A_Eyebrow style={{ marginBottom: 16 }}>By {a.name} · {a.firm} (personal project)</A_Eyebrow>
              <A_Serif size={88} weight={400} style={{ letterSpacing: -1.2, lineHeight: 1.06 }}>
                I built an agent that drafts a <span style={{ fontStyle: "italic", color: CA.ox }}>federal proposal volume</span> in under four minutes.
              </A_Serif>
              <div style={{ marginTop: 44, maxWidth: 800, fontSize: 19, lineHeight: 1.5, color: CA.ink2 }}>
                Not a chat assistant — an actual tool-using, looping agent that finds federal contract opportunities, parses their requirements end-to-end, and produces a submission-ready first-pass response with built-in compliance checks. Seven production runs to date. Median cost: <i>$3 of compute per draft</i>. Median analyst time replaced: <i>about forty hours</i>.
              </div>
              <div style={{ marginTop: 32, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={openApp} style={aboutBtnPrimary}>Explore the prototype →</button>
                <button onClick={() => document.getElementById("ask")?.scrollIntoView({ behavior: "smooth" })} style={aboutBtnGhost}>Read the ask</button>
                <div style={{ flex: 1, minWidth: 20 }} />
                <A_Mono size={11} color={CA.mute}>build 2026-05-27 · v0.1 · personal project</A_Mono>
              </div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, color: CA.ink3, fontSize: 13 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: CA.good }} />
                <span><b style={{ color: CA.ink }}>Real data, real architecture.</b> The next three tabs show real SAM.gov opportunities and a real agent run — happy to walk through a fresh solicitation end-to-end on a call.</span>
              </div>
            </div>
          </div>
        </A_Page>
      </section>

      {/* IMPACT NUMBERS ─────────────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="Impact, seven runs in" kickerNumber="01"
            title={<>Seven runs. Twenty-one dollars. <span style={{ fontStyle: "italic", color: CA.ox }}>Two hundred eighty hours.</span></>}
            lead="Hours-saved is calculated against a 40-hour first-pass baseline at a $250/hour analyst rate. Each draft replaces approximately $10,000 of labor for roughly $3 of compute." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 12, borderTop: `1px solid ${CA.rule}` }}>
            {D_ABOUT.impact.map((m, i) => (
              <div key={m.label} style={{
                padding: "32px 28px 28px",
                borderRight: i < 3 ? `1px solid ${CA.rule}` : "none",
                borderBottom: `1px solid ${CA.rule}`,
              }}>
                <A_Mono size={10.5} color={CA.ink3} style={{ letterSpacing: 1.4, textTransform: "uppercase" }}>
                  {String(i+1).padStart(2,"0")} · {m.label}
                </A_Mono>
                <A_Serif size={84} style={{ marginTop: 16, fontFeatureSettings: '"lnum"' }}>
                  {m.label === "API spend to date" ? <A_Counter value={21} prefix="$" /> :
                   m.label === "Analyst hours saved" ? <A_Counter value={280} prefix="~" /> :
                   <A_Counter value={m.value} />}
                </A_Serif>
                {m.note && <div style={{ marginTop: 12, fontSize: 12, color: CA.ink3, lineHeight: 1.5 }}>{m.note}</div>}
              </div>
            ))}
          </div>
        </A_Page>
      </section>

      {/* ABOUT THE PROJECT / AUTHOR ────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="About the project" kickerNumber="02"
            title="Why I built this." />
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 40 }}>
            <div></div>
            <div>
              <A_Eyebrow style={{ marginBottom: 8 }}>Origin</A_Eyebrow>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1.35, color: CA.ink, marginBottom: 16 }}>
                After working on countless RFPs and RFIs — copying and pasting paragraphs into Sidekick over and over — I wanted to see what could be done with a real API connection to Claude. Not chat. A tool-using, looping agent that handles the whole boring middle of the job.
              </div>
              <div style={{ fontSize: 14, color: CA.ink2, lineHeight: 1.65 }}>
                Everything you see is a working prototype. The agent shell, the parallel extractor, the evaluator–optimizer loop, the cost numbers — all real, running against real SAM.gov data. The past-performance corpus is intentionally synthetic — the architecture is the proof point, not the content. Built solo while the baby was napping.
              </div>
            </div>
            <div>
              <A_Eyebrow style={{ marginBottom: 8 }}>What this project shows</A_Eyebrow>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14, color: CA.ink2, lineHeight: 1.7 }}>
                <li style={{ marginBottom: 8 }}>A real agentic system — Claude calling tools in a loop, not a single prompt — drafting a federal proposal volume in under four minutes.</li>
                <li style={{ marginBottom: 8 }}>Five of Anthropic's documented agentic patterns composed inside one shell: routing, parallelization, orchestrator-workers, evaluator-optimizer, autonomous loop.</li>
                <li style={{ marginBottom: 8 }}>Sonnet, Opus, and Haiku each doing the part they're best at — about three dollars of compute per draft.</li>
                <li>Architecture that gets sharply better the moment it points at real firm voice and past performance.</li>
              </ul>
            </div>
          </div>
        </A_Page>
      </section>

      {/* BY THE NUMBERS / SYSTEM ────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="System composition" kickerNumber="03"
            title="One autonomous agent, five composed patterns, eleven tools."
            lead="Five Anthropic-blogged patterns composed inside a single tool-use agent shell: routing, parallelization, orchestrator-workers, evaluator-optimizer, and the autonomous agent itself." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${CA.rule}` }}>
            {D_ABOUT.systemNumbers.map((m, i) => (
              <div key={m.label} style={{
                padding: "28px 24px", borderRight: i < 3 ? `1px solid ${CA.rule}` : "none",
                borderBottom: `1px solid ${CA.rule}`,
              }}>
                <A_Eyebrow color={CA.ink3}>{m.label}</A_Eyebrow>
                <A_Serif size={56} style={{ marginTop: 14, lineHeight: 1 }}><A_Counter value={m.value} /></A_Serif>
                <div style={{ marginTop: 10, fontSize: 12, color: CA.ink3, lineHeight: 1.5 }}>{m.note}</div>
              </div>
            ))}
          </div>
        </A_Page>
      </section>

      {/* ARCHITECTURE ──────────────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="How it works" kickerNumber="04"
            title="A tool-using agent, looped by an evaluator."
            lead="The agent shell (Sonnet 4.6) routes between specialized tools. Extraction parallelizes across solicitation documents. Drafting (Opus 4.6) is wrapped in post-draft compliance checks that feed back into the voice-guidance file — the evaluator–optimizer loop." />
          <div style={{ marginTop: 12, padding: 24, background: CA.paperLift, border: `1px solid ${CA.rule}` }}>
            <A_ArchDiagram />
          </div>
        </A_Page>
      </section>

      {/* MODEL SELECTION ─────────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="Model selection" kickerNumber="05" title="The right Claude for each job." />
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr", gap: 32 }}>
            <div></div>
            {[
              { model: "Sonnet 4.6", role: "Orchestration", body: "Fast tool-use, strong instruction following, low latency between tool calls. The agent's decision loop runs every few seconds; Opus would be slower and more expensive with no measurable benefit for routing." },
              { model: "Opus 4.6",   role: "Drafting",      body: "Best long-form prose quality. The 40-page proposal draft is where token quality matters most — voice consistency, persuasive structure, evidence-grounded paragraphs. Cost premium is justified by the single highest-leverage step." },
              { model: "Haiku 4.5",  role: "Summarization", body: "Capability tagging for 15+ opportunities per search is a fan-out, bulk-classification job. Haiku handles it for fractions of a cent each at sub-second latency, where Opus or Sonnet would be 10–100× the cost." },
            ].map((m) => (
              <div key={m.model} style={{ paddingTop: 12, borderTop: `2px solid ${CA.ink}` }}>
                <A_Mono size={11} color={CA.ox} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>{m.role}</A_Mono>
                <A_Serif size={28} style={{ marginTop: 8, marginBottom: 12 }}>{m.model}</A_Serif>
                <div style={{ fontSize: 14, color: CA.ink2, lineHeight: 1.6 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </A_Page>
      </section>

      {/* WHAT IT IS / ISN'T ──────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="What this is — and what it isn't" kickerNumber="06" title="Read this before the demo." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div style={{ padding: "28px 32px", background: "rgba(180,138,85,0.07)", borderLeft: `2px solid ${CA.gold}` }}>
              <A_Eyebrow color="#7d5e2f">Disclosure · synthetic data</A_Eyebrow>
              <A_Serif size={22} style={{ marginTop: 10, marginBottom: 12 }}>The past-performance data is synthetic.</A_Serif>
              <div style={{ fontSize: 14, color: CA.ink2, lineHeight: 1.65 }}>
                The ten past-performance decks in the PP folder are hand-built representative examples — Army recruiting, TSA, HHS Salesforce, etc. — not real client engagements. They demonstrate the <i>shape</i> of the system: how PP gets selected, cited, and woven into a draft, not the <i>content</i> of a production deployment.
              </div>
            </div>
            <div style={{ padding: "28px 32px", background: "rgba(63,107,58,0.07)", borderLeft: `2px solid ${CA.good}` }}>
              <A_Eyebrow color={CA.good}>What it unlocks with real data</A_Eyebrow>
              <A_Serif size={22} style={{ marginTop: 10, marginBottom: 12 }}>The architecture is ready. The data is the next investment.</A_Serif>
              <div style={{ fontSize: 14, color: CA.ink2, lineHeight: 1.65 }}>
                Pointed at 100+ real PP examples and a corpus of well-written reference RFPs from past wins, the system would learn firm-specific voice, capability framing, and recurring win patterns far more sharply than it can today.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <A_Eyebrow>Known limitations</A_Eyebrow>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${CA.rule}` }}>
              {[
                { t: "First-pass drafts only", b: "Output is designed to be edited by a human proposal lead, not submitted as-is. Compliance checks catch the obvious; SME review catches the rest." },
                { t: "No live pricing intelligence", b: "The tool reads CLINs from the solicitation but does not generate competitive pricing. Volume II is left for the pricing team." },
                { t: "SAM.gov rate-limited", b: "Public API key allows ~1,000 calls/day. Heavy use during a single morning can exhaust the quota until midnight UTC." },
                { t: "Synthetic past performance", b: "See data disclosure above. Replace with real client narratives to unlock production deployment." },
              ].map((x, i) => (
                <div key={x.t} style={{ padding: "22px 22px", borderRight: i < 3 ? `1px solid ${CA.rule}` : "none" }}>
                  <A_Mono size={10.5} color={CA.ox} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>0{i+1}</A_Mono>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, marginTop: 8, marginBottom: 10, color: CA.ink }}>{x.t}</div>
                  <div style={{ fontSize: 13, color: CA.ink2, lineHeight: 1.55 }}>{x.b}</div>
                </div>
              ))}
            </div>
          </div>
        </A_Page>
      </section>

      {/* SAMPLE OUTPUTS ────────────────────────────────── */}
      <section style={{ padding: "60px 0", borderBottom: `1px solid ${CA.rule}` }}>
        <A_Page>
          <A_SectionHead kicker="Sample outputs" kickerNumber="07"
            title="Read what the system produced."
            lead="Real drafts generated on real federal solicitations, grounded in synthetic past performance. Click through any document to read the full sample inline." />
          <A_SampleOutputs />
        </A_Page>
      </section>

      {/* THE ASK ─────────────────────────────────────── */}
      <section id="ask" style={{ padding: "80px 0", background: CA.ink, color: CA.paperLift }}>
        <A_Page>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40 }}>
            <div>
              <A_Mono size={11} color="rgba(243,239,232,0.6)" style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>§ 08 · The ask</A_Mono>
            </div>
            <div>
              <A_Eyebrow color="rgba(243,239,232,0.6)" style={{ marginBottom: 16 }}>What I'd like to do next</A_Eyebrow>
              <A_Serif size={56} style={{ color: CA.paperLift, letterSpacing: -0.8 }}>
                Two things I'd like you to consider.
              </A_Serif>
              <div style={{ marginTop: 28, fontSize: 16, color: "rgba(243,239,232,0.75)", lineHeight: 1.6, maxWidth: 760 }}>
                {D_ABOUT.ask.why}
              </div>

              <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{ padding: "28px 28px", borderLeft: `2px solid #d4a04a` }}>
                  <A_Mono size={10.5} color="#d4a04a" style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>Primary ask</A_Mono>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 32, lineHeight: 1.15, marginTop: 10, color: CA.paperLift }}>
                    {D_ABOUT.ask.primary}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, color: "rgba(243,239,232,0.7)", lineHeight: 1.6 }}>
                    The architecture is sitting here, working. Real client PP, real win narratives, real partner voice — and the system gets sharply better. I'd like to be the person who builds the internal version.
                  </div>
                </div>
                <div style={{ padding: "28px 28px", borderLeft: `2px solid #d4a04a` }}>
                  <A_Mono size={10.5} color="#d4a04a" style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>Also</A_Mono>
                  <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 32, lineHeight: 1.15, marginTop: 10, color: CA.paperLift }}>
                    {D_ABOUT.ask.secondary}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 13, color: "rgba(243,239,232,0.7)", lineHeight: 1.6 }}>
                    Whatever the AI mandate looks like inside the practice — capability builds, client engagements, internal tooling — I'd like to be on it. This is the kind of work I want to do, and the kind I can demonstrably ship.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 48, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={openApp} style={{ ...aboutBtnPrimary, background: CA.paperLift, color: CA.ink, borderColor: CA.paperLift }}>
                  Explore the prototype →
                </button>
                <a href="mailto:hcotton@deloitte.com" style={{ ...aboutBtnGhost, color: CA.paperLift, borderColor: "rgba(243,239,232,0.25)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  Reach out
                </a>
              </div>
            </div>
          </div>
        </A_Page>
      </section>

    </main>
  );
}

const aboutBtnPrimary = {
  border: `1px solid ${CA.ink}`, background: CA.ink, color: CA.paperLift,
  padding: "12px 22px", cursor: "pointer", fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase",
};
const aboutBtnGhost = {
  border: `1px solid ${CA.rule}`, background: "transparent", color: CA.ink,
  padding: "12px 22px", cursor: "pointer", fontFamily: '"IBM Plex Mono", monospace',
  fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase",
};

window.AboutPage = AboutPage;
window.A_TOKENS = CA;
