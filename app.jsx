/* global React, ReactDOM, APW_DATA, AboutPage, WorkingApp */

const { useState, useEffect } = React;

// ════════════════════════════════════════════════════════════════
// Persistent top bar — flips theme based on which tab is active.
// About is the editorial "case study" mode; the others are the dark
// working dashboard.
// ════════════════════════════════════════════════════════════════
function TopBar({ tab, setTab }) {
  const dark = tab !== "about";
  const t = dark ? darkChrome : lightChrome;

  const tabs = [
    { id: "about",     label: "About",       sub: "case study" },
    { id: "discovery", label: "Discovery",   sub: "22 cached" },
    { id: "detail",    label: "Opportunity", sub: "selected" },
    { id: "run",       label: "Agent Run",   sub: "live trace" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: t.barBg,
      borderBottom: `1px solid ${t.rule}`,
      backdropFilter: "saturate(140%) blur(10px)",
      transition: "background .3s ease, border-color .3s ease",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "0 56px",
        height: 68, display: "flex", alignItems: "center", gap: 32,
      }}>
        {/* wordmark */}
        <button onClick={() => setTab("about")} style={{
          display: "flex", alignItems: "center", gap: 12, padding: 0,
          background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 5,
            background: dark ? "linear-gradient(135deg,#5eead4 0%,#f5a524 100%)" : "#1a1814",
            color: dark ? "#0b0b0e" : "#faf7f0",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 13,
            transition: "background .3s ease, color .3s ease",
          }}>HC</div>
          <div style={{ textAlign: "left" }}>
            <div style={{
              fontFamily: dark ? '"Space Grotesk", sans-serif' : '"Instrument Serif", serif',
              fontSize: dark ? 15 : 19,
              fontWeight: dark ? 600 : 400,
              lineHeight: 1, color: t.text,
              transition: "color .3s ease",
            }}>
              Harry Cotton {dark ? null : <span style={{ color: t.accent, fontStyle: "italic" }}> · Proposal Agent</span>}
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9.5, color: t.text3, letterSpacing: 1.4,
              textTransform: "uppercase", marginTop: 3,
              transition: "color .3s ease",
            }}>
              {dark ? "$ bd_agent · working prototype" : "case study · paternity-leave build"}
            </div>
          </div>
        </button>

        {/* tabs */}
        <nav style={{ display: "flex", gap: 2, marginLeft: "auto" }}>
          {tabs.map((tabItem) => {
            const active = tabItem.id === tab;
            return (
              <button key={tabItem.id} onClick={() => setTab(tabItem.id)} style={{
                border: "none", background: "transparent",
                padding: "10px 14px", cursor: "pointer",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11, letterSpacing: 1.3,
                textTransform: "uppercase",
                color: active ? t.text : t.text3,
                position: "relative",
                transition: "color .2s ease",
              }}>
                {tabItem.label}
                {active && <div style={{
                  position: "absolute", left: 14, right: 14, bottom: 4, height: 1,
                  background: t.accent,
                }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 12 }}>
          {dark ? (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, color: "#5eead4",
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px",
              border: "1px solid rgba(94,234,212,.3)",
              background: "rgba(94,234,212,.08)",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: "#5eead4" }} />
              live
            </span>
          ) : (
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: "#7a2e2e",
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px", borderRadius: 999,
              border: "1px solid rgba(122,46,46,.25)", background: "rgba(122,46,46,.06)",
              letterSpacing: 0.4, textTransform: "uppercase",
            }}>
              ▸ case study
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

const lightChrome = {
  barBg: "rgba(243,239,232,.92)",
  rule: "#d6cdba",
  text: "#1a1814",
  text3: "#6d6657",
  accent: "#7a2e2e",
};
const darkChrome = {
  barBg: "rgba(11,11,14,.92)",
  rule: "#252530",
  text: "#e6e6ec",
  text3: "#6c6c78",
  accent: "#5eead4",
};

// ════════════════════════════════════════════════════════════════
// Footer (light) — always present
// ════════════════════════════════════════════════════════════════
function Footer({ dark }) {
  const palette = dark ? {
    bg: "#08080b", rule: "#252530", text: "#6c6c78", text2: "#a3a3b0", accent: "#5eead4",
  } : {
    bg: "#ebe5d9", rule: "#d6cdba", text: "#6d6657", text2: "#3a342c", accent: "#7a2e2e",
  };
  return (
    <footer style={{
      background: palette.bg, borderTop: `1px solid ${palette.rule}`,
      transition: "background .3s ease",
    }}>
      <div style={{
        maxWidth: 1400, margin: "0 auto", padding: "40px 56px 48px",
        display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 40,
        color: palette.text, fontFamily: dark ? '"IBM Plex Sans", sans-serif' : '"IBM Plex Sans", sans-serif',
      }}>
        <div>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5,
            letterSpacing: 1.6, textTransform: "uppercase",
            color: palette.accent, fontWeight: 500,
          }}>Built by</div>
          <div style={{
            marginTop: 8,
            fontFamily: dark ? '"Space Grotesk", sans-serif' : '"Instrument Serif", serif',
            fontSize: dark ? 18 : 22, color: palette.text2, fontWeight: dark ? 600 : 400,
          }}>Harry Cotton</div>
          <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.55 }}>
            Consultant at Deloitte. Personal project built on paternity leave.<br/>
            Not a Deloitte product. Not affiliated with the firm's federal practice.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: 1.6, textTransform: "uppercase", color: palette.accent, fontWeight: 500 }}>Status</div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: palette.text2 }}>9 agent runs logged</div>
          <div style={{ fontSize: 12.5, color: palette.text2 }}>22 opportunities tracked</div>
          <div style={{ fontSize: 12.5, color: palette.text2 }}>7 proposal drafts generated</div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: 1.6, textTransform: "uppercase", color: palette.accent, fontWeight: 500 }}>Models</div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: palette.text2, fontFamily: '"JetBrains Mono", monospace' }}>Sonnet 4.6 · routing</div>
          <div style={{ fontSize: 12.5, color: palette.text2, fontFamily: '"JetBrains Mono", monospace' }}>Opus 4.6 · drafting</div>
          <div style={{ fontSize: 12.5, color: palette.text2, fontFamily: '"JetBrains Mono", monospace' }}>Haiku 4.5 · summary</div>
        </div>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: 1.6, textTransform: "uppercase", color: palette.accent, fontWeight: 500 }}>Version</div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: palette.text2 }}>v0.1 · research prototype</div>
          <div style={{ fontSize: 12.5, color: palette.text2, fontFamily: '"JetBrains Mono", monospace' }}>build 2026-05-27</div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: palette.text, fontStyle: "italic" }}>
            Pretty please don't submit anything generated here without a human edit.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════════
// Root
// ════════════════════════════════════════════════════════════════
function App() {
  const [tab, setTab] = useState("about");
  const [oppId, setOppId] = useState(APW_DATA.opportunities[0].id);
  const dark = tab !== "about";

  // tiny CSS injection for caret animation (used in working tabs)
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `.caret{animation:caret 1s steps(2,end) infinite}@keyframes caret{50%{opacity:0}}.trace-row{animation:trace-in .28s ease forwards}@keyframes trace-in{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}.pulse-dot{animation:pulsedot 1.6s ease-in-out infinite}@keyframes pulsedot{0%,100%{opacity:1}50%{opacity:.4}}`;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Keyboard nav: g + a/d/o/r
  useEffect(() => {
    let pending = false;
    let timer;
    const on = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;
      if (e.key === "g") {
        pending = true;
        clearTimeout(timer);
        timer = setTimeout(() => { pending = false; }, 800);
        return;
      }
      if (pending) {
        const map = { a: "about", d: "discovery", o: "detail", r: "run" };
        if (map[e.key]) { setTab(map[e.key]); pending = false; }
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  // Scroll to top on tab change so the user sees the new page from the top.
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  return (
    <div style={{
      background: dark ? "#0b0b0e" : "#f3efe8",
      transition: "background .3s ease",
      minHeight: "100vh",
    }}>
      <TopBar tab={tab} setTab={setTab} />
      {tab === "about"
        ? <AboutPage openApp={() => setTab("discovery")} />
        : <WorkingApp tab={tab} setTab={setTab} oppId={oppId} setOppId={setOppId} />
      }
      <Footer dark={dark} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
