// Shared data — case-study build by Harry Cotton.

window.APW_DATA = {
  author: {
    name: "Harry Cotton",
    firm: "Deloitte",
    context: "Personal project, paternity leave · May 2026",
    intro: "I'm a Deloitte consultant. I built this on my paternity leave to test what an agent — not a chat assistant, an actual tool-using, looping agent — can do for federal capture work. The architecture is real. The runs are real. The data is intentionally synthetic.",
  },

  // What Harry wants the partner to do
  ask: {
    primary: "Let me build this internally at Deloitte, on real past-performance data.",
    secondary: "Consider me for staffing on AI and Claude-led client engagements.",
    why: "The architecture is sound and the cost numbers are right. With real PP, real win-loss data, and access to the federal practice's voice library, this becomes a capability asset — not a side project. I'd like to be the person who builds it.",
  },

  // Pretend firm profile used inside the demo
  firmProfile: {
    label: "demo firm profile",
    note: "Generic, illustrative — not a real Deloitte engagement.",
    capabilities: ["Advertising & creative services", "Computer systems design", "Strategic communications"],
    naicsCovered: ["541810", "541512", "541613"],
    setAside: "Unrestricted (no certifications held)",
    primeEligible: true,
  },

  // Top-level metrics
  systemNumbers: [
    { label: "Agentic patterns", value: 5, note: "routing · parallelization · orchestrator-workers · evaluator-optimizer · tool-use loop" },
    { label: "Agent tools",     value: 11, note: "sam_fetcher · extractor_multi · pp_select · pp_writer · proposal_writer · compliance_matrix · …" },
    { label: "Models in rotation", value: 3, note: "Sonnet 4.6 · Opus 4.6 · Haiku 4.5" },
    { label: "Output formats",  value: 3, note: ".docx · .xlsx · .json" },
  ],
  impact: [
    { label: "Opportunities extracted",  value: 7,    big: "7"     },
    { label: "Proposal drafts generated",value: 7,    big: "7"     },
    { label: "Analyst hours saved",      value: 280,  big: "~280", note: "at 40 hrs/first-pass baseline, $250/hr analyst rate" },
    { label: "API spend to date",        value: 21,   big: "$21",  note: "Opus drafting + Haiku summarization · all seven runs" },
  ],

  // Discovery
  discoveryStats: { tracked: 22, highFit: 17, closingSoon: 11 },
  fitDistribution: [
    { band: "0–9", count: 0 }, { band: "10–19", count: 1 }, { band: "20–29", count: 0 },
    { band: "30–39", count: 0 }, { band: "40–49", count: 0 }, { band: "50–59", count: 4 },
    { band: "60–69", count: 0 }, { band: "70–79", count: 9 }, { band: "80–89", count: 0 },
    { band: "90–99", count: 8 },
  ],

  opportunities: [
    { id:"c92e4b80a7104c1bb3e5a6cbc8637c45", fit:100, elig:"Prime", title:"Notice of Intent to Sole Source: Defense Stockpile Management Systems (DSMS) Support", agency:"DEPT OF DEFENSE › DTRA › DEFENSE THREAT REDUCTION AGENCY", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2026-06-03", type:"Presolicitation", sol:"HDTRA1-26-R-0064" },
    { id:"a4f3091c2bb8e711ca44d5b0d72e7831", fit:100, elig:"Prime", title:"AMC/A6 Information Technology Needs Commercial Solutions Opening (CSO)", agency:"DEPT OF DEFENSE › DEPT OF THE AIR FORCE › AIR MOBILITY COMMAND", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2031-02-26", type:"Special Notice", sol:"FA300126CSO001" },
    { id:"b1e7c2249f5641d2856e0fa3edc40dcc", fit:100, elig:"Prime", title:"Industry Day and Presolicitation Notice — HITS-UIII", agency:"DEPT OF DEFENSE › DEPT OF THE ARMY › US ARMY CORPS OF ENGINEERS", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2026-06-10", type:"Presolicitation", sol:"W912DY26R0019" },
    { id:"f88d4c41ab934a4e891aee5d29a2c0f1", fit:100, elig:"Prime", title:"Input/Output (I/O) Configuration for Refreshed Data Concentrator Unit (DCU)", agency:"HOMELAND SECURITY › US COAST GUARD › AVIATION LOGISTICS CTR", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2026-06-26", type:"Combined Synopsis/Solicitation", sol:"70Z03826Q12345DCU" },
    { id:"6731e992cb40a1f37dd97e3a87bb02e0", fit:100, elig:"Prime", title:"BOSS System Link 16", agency:"DEPT OF DEFENSE › DEPT OF THE AIR FORCE › AIR FORCE MATERIEL COMMAND", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2026-05-29", type:"Combined Synopsis/Solicitation", sol:"FA862126Q0118" },
    { id:"4c1d5a0f6b3148fdab90234b7e851ee2", fit:75,  elig:"Prime", title:"R708 — Digital and TV Advertising Questions and Answers (Dayton VA)", agency:"VETERANS AFFAIRS › 250-NETWORK CONTRACT OFFICE", naics:"541810", naicsTitle:"Advertising Agencies", setAside:"Unrestricted", deadline:"2026-05-25", type:"Combined Synopsis/Solicitation", sol:"36C25026Q0487" },
    { id:"d20fa8e9b1c6437bb5b88c3041e15a0a", fit:75,  elig:"Prime", title:"R701 — Amending RFQ 36C25026Q0485 to answer Questions Submitted", agency:"VETERANS AFFAIRS › 250-NETWORK CONTRACT OFFICE", naics:"541810", naicsTitle:"Advertising Agencies", setAside:"Unrestricted", deadline:"2026-05-25", type:"Combined Synopsis/Solicitation", sol:"36C25026Q0485" },
    { id:"e7f3a5b2944c81d6ae1f7c3b5fe19234", fit:75,  elig:"Prime", title:"U.S. Navy's Marketing and Advertising Program — Commander, Navy Recruiting", agency:"DEPT OF DEFENSE › DEPT OF THE NAVY › NAVSUP", naics:"541810", naicsTitle:"Advertising Agencies", setAside:"Unrestricted", deadline:"2026-06-05", type:"Sources Sought", sol:"N0018926R0014" },
    { id:"3a2c81d77f4b9e0c4ad94216b701ff42", fit:55,  elig:"Prime", title:"Multi-Channel Recruiting Campaign — Army National Guard", agency:"DEPT OF DEFENSE › ARMY › NATIONAL GUARD BUREAU", naics:"541810", naicsTitle:"Advertising Agencies", setAside:"Unrestricted", deadline:"2026-06-19", type:"Solicitation", sol:"W9133L26R0007" },
    { id:"81bc3f44e72a09cd56e7b41a25dd1077", fit:55,  elig:"Prime", title:"Mission Software Support — Cyber Operations", agency:"DEPT OF DEFENSE › ARMY › CYBER COMMAND", naics:"541512", naicsTitle:"Computer Systems Design Services", setAside:"Unrestricted", deadline:"2026-07-02", type:"Solicitation", sol:"W56JSR26R0004" },
  ],

  // Agent run timeline
  runSteps: [
    { t: "00:00", agent: "bd_agent",         tool: "—",                action: "Receive task",      detail: "Draft Volume I for HDTRA1-26-R-0064 (DSMS Support)",                 cls: "system" },
    { t: "00:02", agent: "bd_agent",         tool: "sam_fetcher",      action: "Fetch solicitation",detail: "Pulled 9 PDFs from SAM.gov · 2.4 MB · cache hit on Amendment 02",   cls: "tool"   },
    { t: "00:11", agent: "extractor_multi",  tool: "orchestrator",     action: "Dispatch workers",  detail: "PWS · Sec L · Sec M · Q&A in parallel (4 workers)",                  cls: "fanout" },
    { t: "00:24", agent: "extractor_multi",  tool: "Haiku 4.5",        action: "Worker · PWS",      detail: "Parsed 47 requirements, 12 deliverables, 3 ambiguities flagged",     cls: "claude" },
    { t: "00:26", agent: "extractor_multi",  tool: "Haiku 4.5",        action: "Worker · Sec L",    detail: "Submission format: Vol I (40p), Vol II pricing, Vol III past perf",  cls: "claude" },
    { t: "00:31", agent: "extractor_multi",  tool: "Haiku 4.5",        action: "Worker · Sec M",    detail: "Evaluation: Technical · Past Perf · Price; trade-off, technical paramount", cls: "claude" },
    { t: "00:34", agent: "extractor_multi",  tool: "Haiku 4.5",        action: "Worker · Q&A",      detail: "No Q&A posted (presolicitation phase)",                              cls: "claude" },
    { t: "00:38", agent: "extractor_multi",  tool: "merge",            action: "Cross-doc dedupe",  detail: "extraction.json · 18 KB · 0 discrepancies between PWS and Sec L",   cls: "system" },
    { t: "00:41", agent: "bd_agent",         tool: "pp_select",        action: "Past-performance match", detail: "Sonnet picked 4 PP refs (CBP, TSA, DTRA-IT, Army Med)",          cls: "claude" },
    { t: "00:48", agent: "bd_agent",         tool: "proposal_writer",  action: "Draft Vol I begins",detail: "Opus 4.6 streaming · 14 sections planned",                            cls: "claude" },
    { t: "02:14", agent: "evaluator",        tool: "post_draft_checks",action: "Compliance pass",   detail: "Banned-words: 0 · em-dash density: ok · PP coverage: 92% (1 gap)",   cls: "loop"   },
    { t: "02:18", agent: "bd_agent",         tool: "proposal_writer",  action: "Patch · §4.2",      detail: "Re-drafted Past-Perf §4.2 to cover gap (DTRA-IT reference)",         cls: "claude" },
    { t: "03:02", agent: "compliance_matrix",tool: "extractor",        action: "Build matrix",      detail: "47 requirements → cells with ¶ map · compliance.xlsx · 22 KB",       cls: "tool"   },
    { t: "03:07", agent: "bd_agent",         tool: "—",                action: "Task complete",     detail: "proposal.docx (~22 pp) · pp.docx (5 narratives) · compliance.xlsx",  cls: "done"   },
  ],

  // Sample doc previews
  samples: {
    proposal: {
      title: "Volume I — Technical Proposal",
      sol: "HDTRA1-26-R-0064 · Defense Stockpile Management Systems Support",
      pages: 43,
      excerpt:
`§1.0 EXECUTIVE SUMMARY

We submit this proposal in response to Defense Threat Reduction Agency (DTRA) Solicitation HDTRA1-26-R-0064 for sustainment and modernization of the Defense Stockpile Management Systems (DSMS). Our proposed solution combines fifteen years of demonstrated DoD systems-design experience with a proven, low-risk delivery model that has supported analogous mission-critical asset-management systems at the Customs and Border Protection (CBP), Transportation Security Administration (TSA), and U.S. Army Medical Command (MEDCOM).

§1.1 UNDERSTANDING

The Government requires uninterrupted operation and incremental modernization of DSMS — the system of record for the Nation's strategic and critical materials inventory. Section L specifies a phased transition with no operational downtime; Section M weights technical approach and past performance above price, with a trade-off selection. We have organized this proposal to address each evaluation factor in turn (§§ 2.0 – 5.0)…`
    },
    pp: {
      title: "Volume III — Past Performance",
      pages: 18,
      excerpt:
`PP-1 · U.S. CUSTOMS AND BORDER PROTECTION — Modernization of Trade-Compliance Inventory Platform

Contract: HSBP1018D00007 · Period: 2019 – 2024 · Value: $14.2M · Role: Prime

Relevance to DSMS: Both engagements require the secure, auditable management of a federally-mandated strategic inventory across geographically distributed nodes, with zero-downtime cutover and continuous FIPS-aligned access control. Under the CBP engagement, the team delivered…`
    },
    compliance: {
      title: "Compliance Matrix",
      pages: 1,
      rows: [
        { sec: "L.4.1", req: "Page count — Vol I shall not exceed 40 pages, excluding cover and ToC", para: "§Cover, §ToC", status: "compliant" },
        { sec: "L.4.2", req: "Font shall be Times New Roman 12pt minimum", para: "Document style", status: "compliant" },
        { sec: "L.4.3", req: "Submit electronic copies in .docx and signed .pdf", para: "—", status: "noted" },
        { sec: "L.5.1", req: "Volume II pricing submitted separately (sealed)", para: "—", status: "deferred" },
        { sec: "M.2.a", req: "Technical approach for zero-downtime cutover", para: "§3.2", status: "compliant" },
        { sec: "M.2.b", req: "Phased transition plan with measurable milestones", para: "§3.4", status: "compliant" },
        { sec: "M.3.a", req: "Three (3) relevant past-performance citations, ≤5 years", para: "Vol III · PP-1, PP-2, PP-3", status: "compliant" },
        { sec: "M.3.b", req: "Past-performance shall be of equivalent scope and complexity", para: "Vol III · §1.0", status: "compliant" },
        { sec: "M.4",   req: "Price reasonableness narrative", para: "Vol II · §2", status: "deferred" },
      ]
    }
  },

  scoring: {
    fit: 100,
    breakdown: [
      { factor: "NAICS alignment",       max: 50, score: 50, note: "Exact match · 541512 in firm profile" },
      { factor: "Set-aside eligibility", max: 25, score: 25, note: "Unrestricted · firm is prime-eligible" },
      { factor: "Capability keywords",   max: 15, score: 12, note: "5 matches: 'inventory', 'sustainment', 'modernization', 'systems integration', 'cutover'" },
      { factor: "Past-performance fit",  max: 10, score: 10, note: "4 strong PP references identified" },
    ],
  },
};
