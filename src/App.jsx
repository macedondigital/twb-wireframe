import { useState, useRef } from "react";

const screens = { DASHBOARD: "dashboard", NEW_REPORT: "new_report", EDITOR: "editor", EXPORT: "export" };

const patients = {
  jones: {
    name: "Redacted Jones", pmkeys: "8558141", sessions: 6, lastReport: "—", referrer: "Andrew", unit: "1 UNIT",
    rank: "Senior Clerk", status: "due", reportNum: 1,
    k10: { total: 25, severity: "Moderate levels of distress" },
    pcl5: { total: 35, reexp: 7, avoid: 6, negalt: 13, hyper: 9 },
    audit: { total: 7, severity: "elevated risk alcohol consumption" },
    dass21: { total: 56, dep: "12 (mild)", anx: "20 (extremely severe)", stress: "24 (moderate)" },
    goals: ["Reduce anxiety.", "Develop sustainable strategies for managing stress.", "Gain deeper insight into the underlying drivers of her worry and fatigue"],
    context: "symptoms consistent with adjustment disorder, occurring in the context of medical recovery, uncertainty about her professional future, and family stress",
  },
  neal: {
    name: "Alaina Neal", pmkeys: "8259284", sessions: 18, lastReport: "5 May. 25", referrer: "Chau", unit: "1 HB",
    rank: "ADF Member", status: "due", reportNum: 2,
    k10: { total: 32, severity: "Severe" },
    pcl5: { total: 28, reexp: 5, avoid: 4, negalt: 11, hyper: 8 },
    audit: { total: 3, severity: "low risk" },
    dass21: { total: 42, dep: "14 (moderate)", anx: "16 (severe)", stress: "12 (mild)" },
    goals: ["Preparing for a pending discharge from the ADF.", "Processing the impacts of the events that led to her pending medical separation"],
    context: "symptoms of anxiety. This was in the context of an upcoming medical separation from the ADF",
  },
  edwards: {
    name: "Paul Edwards", pmkeys: "8160579", sessions: 5, lastReport: "—", referrer: "Kerry", unit: "RAAF Darwin",
    rank: "Unit Aviation Safety Officer", status: "upcoming", reportNum: 0,
    k10: { total: 38, severity: "Severe" },
    pcl5: { total: 44, reexp: 10, avoid: 8, negalt: 15, hyper: 11 },
    audit: { total: 12, severity: "hazardous alcohol use" },
    dass21: { total: 68, dep: "18 (moderate)", anx: "22 (extremely severe)", stress: "28 (severe)" },
    goals: ["Address low moods to get back to socializing with the view of finding a new partner."],
    context: "symptoms consistent with major depressive disorder and complicated grief, in the context of the death of his wife and subsequent social isolation",
  },
};

const reportData = {
  progress: {
    jones: [
      { id: "header", label: "Header", source: "auto", content: "admin@territorywellbeing.com.au\n\n4 Mar. 26\n\nName: Redacted Jones\nPMKeyS: 8558141" },
      { id: "salutation", label: "Salutation", source: "auto", content: "Dear Andrew," },
      { id: "opening", label: "Opening", source: "scaffold", content: "I had my 6th appointment this week with Redacted from 1 UNIT. This is a brief letter to report on the progress of our work together thus far and outline the treatment plan for our future sessions." },
      { id: "context", label: "Context", source: "scaffold", content: "I've included my initial letter below for quick reference, however Redacted initially presented with symptoms consistent with adjustment disorder, occurring in the context of medical recovery, uncertainty about her professional future, and family stress." },
      { id: "goals", label: "Goals", source: "scaffold", content: "Redacted's initial goals for treatment included:\n\n1. Reduce anxiety.\n2. Develop sustainable strategies for managing stress.\n3. Gain deeper insight into the underlying drivers of her worry and fatigue" },
      { id: "progress", label: "Progress ✦", source: "ai", highlight: true, content: "Overall Redacted is making steady progress towards these goals. Sessions thus far have focused on supporting Redacted to manage persistent anxiety and sleep disturbance in the context of multiple concurrent stressors. Cognitive behavioural strategies were introduced to address anticipatory worry, including thought challenging, scheduled worry time, and grounding techniques. Redacted engaged positively with these approaches and reported incremental improvements in her capacity to manage anxious thoughts during the day, though sleep remained disrupted.\n\nRedacted described a pattern of longstanding anxiety characterised by chronic physiological tension, anticipatory worry, and nervous system hyperarousal, which appeared to be contributing to fragmented sleep and fatigue. We explored how early experiences of instability and responsibility may have shaped her need for control and predictability, and how this pattern was being activated by current uncertainty around her medical classification and future.\n\nWork-related stress was also a focus, particularly in relation to the recent receipt of a J52 medical classification determination and the associated decision making required within a limited timeframe. Redacted expressed frustration at the lack of clarity and support in navigating this process, which appeared to compound her general sense of overwhelm." },
      { id: "treatment", label: "Treatment Plan ✦", source: "ai", highlight: true, content: "Ongoing counselling with Redacted will continue to focus on consolidating anxiety regulation strategies, improving sleep through nervous system down-regulation, and supporting her to tolerate uncertainty around her medical and professional future. Upcoming sessions will also begin to explore underlying schema patterns, particularly around control, self-reliance, and perceived vulnerability, using a schema-informed framework. In order to facilitate this treatment plan can I ask you to consider raising an extension of care for an additional six sessions." },
      { id: "risk", label: "Risk Assessment", source: "boilerplate", content: "Redacted denied any current ideation, intent, or planning about harming herself or others. She was consequently assessed as not currently at risk of harm to herself and others in comparison to her baseline levels. I will keep you updated if these risk levels change throughout the therapy process." },
      { id: "closing", label: "Closing", source: "auto", content: "Please don't hesitate to contact me if you have any questions about Redacted's care.\n\nSincerely,\n\nPat Smith\nPsychologist\nTerritory Wellbeing\nM: 0434 506 372" },
    ],
    neal: [
      { id: "header", label: "Header", source: "auto", content: "admin@territorywellbeing.com.au\n\n4 Mar. 26\n\nName: Alaina Neal\nPMKeyS: 8259284" },
      { id: "salutation", label: "Salutation", source: "auto", content: "Dear Chau," },
      { id: "opening", label: "Opening", source: "scaffold", content: "I had my 18th appointment this week with Alaina from 1 HB. This is a brief letter to report on the progress of our work together thus far and outline the treatment plan for our future sessions." },
      { id: "context", label: "Context", source: "scaffold", content: "I've included my initial letter below for quick reference, however Alaina initially presented with symptoms of anxiety. This was in the context of an upcoming medical separation from the ADF." },
      { id: "goals", label: "Goals", source: "scaffold", content: "Alaina's initial goals for treatment included:\n\n1. Preparing for a pending discharge from the ADF.\n2. Processing the impacts of the events that led to her pending medical separation" },
      { id: "progress", label: "Progress ✦", source: "ai", highlight: true, content: "Alaina is making steady progress in therapy and has been adjusting well to significant changes in her living arrangements and family circumstances. She has engaged positively in schema therapy, developing a clearer understanding of how her core beliefs were shaped during earlier stressful periods and recognising that these beliefs, while once adaptive, are no longer helpful in the present. This framework has supported meaningful discussion of her 'survival strategies' in response to past career stressors and how these patterns continue to affect her." },
      { id: "treatment", label: "Treatment Plan ✦", source: "ai", highlight: true, content: "Alongside therapy, Alaina has also been managing the added stress of her father's health complications, and sessions have provided space to process these concerns. Ongoing treatment will continue to consolidate her gains and support progress toward her goals, with sessions scheduled at fortnightly intervals. In order to facilitate this treatment plan can I ask you to consider raising an extension of care for an additional six sessions." },
      { id: "risk", label: "Risk Assessment", source: "boilerplate", content: "Alaina denied any ideation, intent, or planning about harming herself or others. She was consequently assessed as having no foreseeable level of risk of harming herself or others. I will keep you updated if these risk levels change throughout the therapy process." },
      { id: "closing", label: "Closing", source: "auto", content: "Please don't hesitate to contact me if you have any questions about Alaina's care.\n\nSincerely,\n\nPat Smith\nPsychologist\nTerritory Wellbeing\nM: 0434 506 372" },
    ],
  },
  initial: {
    jones: [
      { id: "header", label: "Header", source: "auto", content: "admin@territorywellbeing.com.au\n\n4 Mar. 26\n\nName: Redacted Jones\nPMKeyS: 8558141" },
      { id: "salutation", label: "Salutation", source: "auto", content: "Dear Andrew," },
      { id: "opening", label: "Opening", source: "auto", content: "I had my first appointment this week with Redacted from 1 UNIT. This is a brief letter to convey my initial impressions and proposed treatment plan." },
      { id: "presenting", label: "Context & Presenting ✦", source: "ai", highlight: true, content: "Redacted is a long term ADF member, serving as a senior clerk in the Army. She was referred for psychological support following several months of medical leave due to significant low back pain. While the physical injury prompted the referral, the broader clinical picture reflected a pattern of escalating anxiety, sleep disturbance, and emotional fatigue that had been building over the preceding 12 months." },
      { id: "problems", label: "Main Problems ✦", source: "ai", highlight: true, content: "Redacted's anxiety has increased in recent months, particularly around the potential return of her back pain and the uncertainty surrounding her own medical separation from service, which she anticipated may occur in 2026. She reported persistent worry about how she would manage financially and logistically as a single mother outside of Defence, along with frustration at the lack of clarity around the J52 process." },
      { id: "functioning", label: "Functioning ✦", source: "ai", highlight: true, content: "Redacted described a strong preference for order, structure, and control in daily routines, and became stressed when plans were disrupted, particularly in co-parenting arrangements with her former husband. She reported that relationships outside of work had become narrower over recent years, partly due to the demands of solo parenting and partly due to a tendency to withdraw when feeling overwhelmed." },
      { id: "testing", label: "Testing", source: "scores", content: "Testing:\nK10: 25 – Moderate levels of distress\nPCL – 5: Total – 35\n    Re-Experiencing: 7\n    Avoidance: 6\n    Negative Alterations in Cognition and Mood: 13\n    Hyper-Arousal: 9\nAUDIT: 7 – elevated risk alcohol consumption\nDASS21: Total 56\n    Depression: 12 (mild)\n    Anxiety: 20 (extremely severe)\n    Stress: 24 (moderate)" },
      { id: "occupational", label: "Occupational ✦", source: "ai", highlight: true, content: "From an occupational perspective, Redacted is currently on medical leave and expects to transition out of the ADF in 2026. She reported ambivalence about this change, acknowledging that her body needs rest but expressing concern about the loss of identity, routine, and financial security that military service has provided." },
      { id: "impressions", label: "Impressions ✦", source: "ai", highlight: true, content: "Initial impressions suggest Redacted is experiencing symptoms consistent with adjustment disorder, occurring in the context of medical recovery, uncertainty about her professional future, and family stress. Her presentation is characterised by chronic anxiety, nervous system hyperarousal, sleep disturbance, and a longstanding pattern of over-functioning and self-reliance that may be maintaining her distress." },
      { id: "treatmentPlan", label: "Treatment Plan ✦", source: "ai", highlight: true, content: "Redacted's therapeutic goals focus on reducing anxiety, developing sustainable strategies for managing stress, and gaining deeper insight into the underlying drivers of her worry and fatigue. She aims to rebuild her confidence and develop greater psychological flexibility. It is recommended that treatment continue for a further 6 sessions at fortnightly intervals to consolidate anxiety management strategies and begin exploratory schema work." },
      { id: "risk", label: "Risk Assessment", source: "boilerplate", content: "Redacted denied any ideation, intent, or planning about harming herself or others. She was consequently assessed as having no foreseeable level of risk of harming herself or others. I will keep you updated if these risk levels change throughout the therapy process." },
      { id: "closing", label: "Closing", source: "auto", content: "If you have any questions about this treatment plan or any aspect of Redacted's care please don't hesitate to contact me.\n\nSincerely,\n\nPat Smith\nPsychologist\nTerritory Wellbeing\nM: 0434 506 372" },
    ],
  },
};

const sourceColors = {
  auto: { label: "Auto-populated", color: "#6B7280" },
  scaffold: { label: "From previous report", color: "#3B82F6" },
  ai: { label: "AI-generated (Claude)", color: "#16A34A" },
  boilerplate: { label: "Boilerplate (editable)", color: "#D97706" },
  scores: { label: "From Halaxy questionnaires", color: "#7C3AED" },
};

const StatusBadge = ({ status }) => {
  const s = { due: { bg: "#FEF3C7", color: "#92400E", border: "#FCD34D", label: "Report Due" }, upcoming: { bg: "#DBEAFE", color: "#1E40AF", border: "#93C5FD", label: "Session 6 Soon" }, current: { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7", label: "On Track" } }[status];
  return <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{s.label}</span>;
};

const stepScreens = [screens.DASHBOARD, screens.NEW_REPORT, screens.NEW_REPORT, screens.EDITOR, screens.EXPORT];

const StepIndicator = ({ steps, current, onNav }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24, flexWrap: "wrap" }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center" }}>
        <div onClick={() => i <= current && onNav && onNav(stepScreens[i])} style={{ display: "flex", alignItems: "center", gap: 6, cursor: i <= current ? "pointer" : "default" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, backgroundColor: i <= current ? "#1B2D4F" : "#E5E7EB", color: i <= current ? "#fff" : "#9CA3AF" }}>{i + 1}</div>
          <span style={{ fontSize: 11, fontWeight: i === current ? 700 : 500, color: i <= current ? "#1B2D4F" : "#9CA3AF", whiteSpace: "nowrap" }}>{step}</span>
        </div>
        {i < steps.length - 1 && <div style={{ width: 28, height: 2, margin: "0 5px", backgroundColor: i < current ? "#1B2D4F" : "#E5E7EB" }} />}
      </div>
    ))}
  </div>
);

const Card = ({ children, style, onClick }) => {
  const [h, setH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ backgroundColor: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", padding: 18, cursor: onClick ? "pointer" : "default", boxShadow: h && onClick ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)", ...style }}>{children}</div>;
};

const Btn = ({ children, primary, small, onClick, disabled, style: s }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding: small ? "6px 14px" : "10px 20px", borderRadius: 8, border: primary ? "none" : "1px solid #D1D5DB", backgroundColor: primary ? (disabled ? "#9CA3AF" : "#1B2D4F") : "#fff", color: primary ? "#fff" : "#374151", fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", ...s }}>{children}</button>
);

const Ann = ({ children, position }) => (
  <div style={{ position: "absolute", ...position, backgroundColor: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 6, padding: "5px 9px", fontSize: 10, fontWeight: 600, color: "#92400E", maxWidth: 170, lineHeight: 1.4, zIndex: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
    <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", marginBottom: 2, opacity: 0.7 }}>AUTOMATION</div>
    {children}
  </div>
);

const Label = ({ children }) => <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 6 }}>{children}</div>;

/* ─── SCREENS ─── */

const Dashboard = ({ onNav }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2 mins ago");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setLastSync("just now"); }, 1500);
  };

  const allPatients = Object.values(patients);
  const filtered = allPatients.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.pmkeys.includes(search) || p.referrer.toLowerCase().includes(search.toLowerCase()) || p.unit.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = { all: allPatients.length, due: allPatients.filter(p => p.status === "due").length, upcoming: allPatients.filter(p => p.status === "upcoming").length, current: allPatients.filter(p => p.status === "current").length };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: "#1B2D4F", fontWeight: 700 }}>Patients</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>{allPatients.length} active · {statusCounts.due} reports due</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={handleSync} disabled={syncing} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #D1D5DB", backgroundColor: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: syncing ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: syncing ? 0.7 : 1 }}>
            <span style={{ display: "inline-block", transition: "transform 0.3s", transform: syncing ? "rotate(360deg)" : "none" }}>&#x21BB;</span>
            {syncing ? "Syncing..." : "Sync Halaxy"}
          </button>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Updated {lastSync}</span>
          <Btn primary onClick={() => onNav(screens.NEW_REPORT)}>+ New Report</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, PMKeyS, referrer, or unit..." style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit", color: "#1B2D4F", backgroundColor: "#fff", boxSizing: "border-box" }} />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9CA3AF", pointerEvents: "none" }}>&#x2315;</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "all", label: "All" }, { id: "due", label: "Report Due" }, { id: "upcoming", label: "Session 6 Soon" }, { id: "current", label: "On Track" }].map(s => (
            <button key={s.id} onClick={() => setStatusFilter(s.id)} style={{ padding: "5px 12px", borderRadius: 20, border: statusFilter === s.id ? "2px solid #1B2D4F" : "1px solid #D1D5DB", backgroundColor: statusFilter === s.id ? "#1B2D4F" : "#fff", color: statusFilter === s.id ? "#fff" : "#6B7280", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {s.label}{statusCounts[s.id] > 0 ? ` (${statusCounts[s.id]})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 1fr 1fr 0.7fr", padding: "6px 18px", fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        <span>Patient</span><span>PMKeyS</span><span>Sessions</span><span>Last Report</span><span>Status</span><span />
      </div>
      {filtered.length === 0 && <div style={{ padding: "24px 18px", textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>No patients match your search.</div>}
      {filtered.map((p, i) => (
        <Card key={i} onClick={() => onNav(screens.NEW_REPORT)} style={{ padding: "12px 18px", marginBottom: 5 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.6fr 1fr 1fr 0.7fr", alignItems: "center" }}>
            <div><div style={{ fontWeight: 600, fontSize: 13, color: "#1B2D4F" }}>{p.name}</div><div style={{ fontSize: 10, color: "#9CA3AF" }}>{p.unit} · Dr {p.referrer}</div></div>
            <span style={{ fontSize: 12, color: "#6B7280", fontFamily: "monospace" }}>{p.pmkeys}</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{p.sessions}</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{p.lastReport}</span>
            <StatusBadge status={p.status} />
            <div style={{ textAlign: "right" }}><Btn small onClick={e => { e.stopPropagation(); onNav(screens.NEW_REPORT); }}>Write Report</Btn></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const progressStructure = [
  { label: "Header", desc: "Date, name, PMKeyS", source: "auto" },
  { label: "Salutation", desc: "\"Dear [Referrer],\"", source: "auto" },
  { label: "Opening", desc: "\"I had my Nth appointment...\"", source: "scaffold" },
  { label: "Context", desc: "Initial presentation summary", source: "scaffold" },
  { label: "Goals", desc: "Numbered list from initial report", source: "scaffold" },
  { label: "Progress", desc: "What was worked on, progress toward goals", source: "ai" },
  { label: "Treatment Plan", desc: "Next steps + extension of care request", source: "ai" },
  { label: "Risk Assessment", desc: "Standard risk statement", source: "boilerplate" },
  { label: "Closing", desc: "Sign-off with contact details", source: "auto" },
];

const initialStructure = [
  { label: "Header", desc: "Date, name, PMKeyS", source: "auto" },
  { label: "Salutation", desc: "\"Dear [Referrer],\"", source: "auto" },
  { label: "Opening", desc: "\"I had my first appointment...\"", source: "auto" },
  { label: "Context & Presenting", desc: "Background, referral reason, history", source: "ai" },
  { label: "Main Problems", desc: "Onset, frequency, duration, severity", source: "ai" },
  { label: "Functioning", desc: "Personal, relational, social", source: "ai" },
  { label: "Testing", desc: "K10, PCL-5, AUDIT, DASS21 scores", source: "scores" },
  { label: "Occupational", desc: "Work and daily functioning", source: "ai" },
  { label: "Impressions", desc: "Clinical formulation and diagnosis", source: "ai" },
  { label: "Treatment Plan", desc: "Goals, session count, frequency", source: "ai" },
  { label: "Risk Assessment", desc: "Standard risk statement", source: "boilerplate" },
  { label: "Closing", desc: "Sign-off with contact details", source: "auto" },
];

const NewReport = ({ onNav }) => {
  const [type, setType] = useState("progress");
  const [sel, setSel] = useState("jones");
  const [transcript, setTranscript] = useState("");
  const p = patients[sel];
  const structure = type === "progress" ? progressStructure : initialStructure;
  const aiCount = structure.filter(s => s.source === "ai").length;

  return (
    <div>
      <StepIndicator steps={["Select Patient", "Paste Transcript", "Generate", "Review & Edit", "Export"]} current={1} onNav={onNav} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <Label>Patient</Label>
            <select value={sel} onChange={e => setSel(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: "inherit", color: "#1B2D4F", backgroundColor: "#fff" }}>
              {Object.entries(patients).map(([k, v]) => <option key={k} value={k}>{v.name} — {v.pmkeys}</option>)}
            </select>
          </Card>

          <Card>
            <Label>Report Type</Label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ id: "initial", label: "Initial Report", desc: "First session — full new report" }, { id: "progress", label: "Progress Report", desc: "6-session review — 2 new paragraphs" }].map(t => (
                <div key={t.id} onClick={() => setType(t.id)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer", border: type === t.id ? "2px solid #1B2D4F" : "1px solid #E5E7EB", backgroundColor: type === t.id ? "#F0F4FF" : "#fff" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1B2D4F" }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Label>Auto-populated from Halaxy</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
              {[["Referrer", `Dr ${p.referrer}`], ["Unit", p.unit], ["Session #", `${p.sessions}`], ["PMKeyS", p.pmkeys]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", backgroundColor: "#F9FAFB", borderRadius: 5 }}>
                  <span style={{ color: "#9CA3AF" }}>{k}</span>
                  <span style={{ color: "#1B2D4F", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              {type === "progress" && p.reportNum > 0 && <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "space-between", padding: "5px 8px", backgroundColor: "#F9FAFB", borderRadius: 5 }}><span style={{ color: "#9CA3AF" }}>Scaffold from</span><span style={{ color: "#1B2D4F", fontWeight: 600, fontFamily: "monospace", fontSize: 11 }}>Progress{p.reportNum}_{p.name.split(" ").pop()}_{p.pmkeys}.pdf</span></div>}
            </div>
          </Card>

          {type === "initial" && (
            <Card>
              <Label>Questionnaire Scores (auto-included in report)</Label>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: "#374151" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", backgroundColor: "#F0F4FF", borderRadius: 4, marginBottom: 3 }}><span style={{ fontWeight: 700 }}>K10: {p.k10.total}</span><span style={{ color: "#6B7280", fontSize: 11 }}>{p.k10.severity}</span></div>
                <div style={{ padding: "4px 8px", backgroundColor: "#F9FAFB", borderRadius: 4, marginBottom: 3 }}>
                  <div style={{ fontWeight: 700 }}>PCL-5: Total – {p.pcl5.total}</div>
                  <div style={{ paddingLeft: 14, fontSize: 10, color: "#6B7280", marginTop: 1 }}>Re-Experiencing: {p.pcl5.reexp} · Avoidance: {p.pcl5.avoid} · Neg. Cognition & Mood: {p.pcl5.negalt} · Hyper-Arousal: {p.pcl5.hyper}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", backgroundColor: "#F0F4FF", borderRadius: 4, marginBottom: 3 }}><span style={{ fontWeight: 700 }}>AUDIT: {p.audit.total}</span><span style={{ color: "#6B7280", fontSize: 11 }}>{p.audit.severity}</span></div>
                <div style={{ padding: "4px 8px", backgroundColor: "#F9FAFB", borderRadius: 4 }}>
                  <div style={{ fontWeight: 700 }}>DASS21: Total {p.dass21.total}</div>
                  <div style={{ paddingLeft: 14, fontSize: 10, color: "#6B7280", marginTop: 1 }}>Depression: {p.dass21.dep} · Anxiety: {p.dass21.anx} · Stress: {p.dass21.stress}</div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <Label>Report Structure Preview</Label>
            <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 10, lineHeight: 1.4 }}>
              {type === "progress"
                ? `${aiCount} sections generated by AI from your transcript. The rest is carried forward from the previous report.`
                : `${aiCount} sections generated by AI from your transcript. This is a comprehensive first-session report.`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {structure.map((s, i) => {
                const sc = sourceColors[s.source];
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 5, borderLeft: `3px solid ${sc.color}`, backgroundColor: s.source === "ai" ? "#F0FDF4" : "#F9FAFB" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1B2D4F" }}>{s.source === "ai" ? "✦ " : ""}{s.label}</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: 6 }}>{s.desc}</span>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: sc.color, whiteSpace: "nowrap" }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              {Object.entries(sourceColors).filter(([k]) => structure.some(s => s.source === k)).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: v.color }} />
                  <span style={{ fontSize: 9, color: "#6B7280" }}>{v.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Label>Heidi Transcript</Label>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8, lineHeight: 1.4 }}>
              {type === "progress"
                ? "Paste your latest session transcript. Claude will use it to write the Progress and Treatment Plan sections."
                : "Paste the first session transcript. Claude will use it to generate the full initial report — presenting problem, functioning, impressions, treatment plan, and more."}
            </div>
            <textarea value={transcript} onChange={e => setTranscript(e.target.value)} placeholder="Paste your Heidi session transcript here...&#10;&#10;Copy from Heidi browser tab (Cmd+A, Cmd+C) — same as your current workflow." style={{ flex: 1, minHeight: 400, padding: 12, borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: "inherit", color: "#374151", resize: "none", lineHeight: 1.6 }} />
          </Card>
          <Btn primary onClick={() => onNav(screens.EDITOR)} style={{ width: "100%", padding: 14, fontSize: 15 }}>✦ Generate {type === "initial" ? "Initial" : "Progress"} Report</Btn>
        </div>
      </div>
    </div>
  );
};

const EditorScreen = ({ onNav }) => {
  const [type, setType] = useState("progress");
  const [sel, setSel] = useState("jones");
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [sectionEdits, setSectionEdits] = useState({});
  const editRef = useRef(null);

  const sections = (reportData[type]?.[sel] || reportData.progress.jones);
  const getContent = (s) => sectionEdits[type + sel + s.id] || s.content;
  const setContent = (s, val) => setSectionEdits(prev => ({ ...prev, [type + sel + s.id]: val }));

  const handleFeedback = () => {
    if (!feedback.trim()) return;
    setFeedbackHistory(prev => [...prev, { role: "user", text: feedback }]);
    const fb = feedback;
    setFeedback("");
    setTimeout(() => {
      setFeedbackHistory(prev => [...prev, { role: "ai", text: `Done — I've revised the green ✦ sections based on your feedback: "${fb.slice(0, 60)}${fb.length > 60 ? '...' : ''}". The scaffold and boilerplate sections are unchanged. Review the updated text in the editor.` }]);
    }, 800);
  };

  return (
    <div>
      <StepIndicator steps={["Select Patient", "Paste Transcript", "Generate", "Review & Edit", "Export"]} current={3} onNav={onNav} />

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[{ id: "initial", label: "Initial Report" }, { id: "progress", label: "Progress Report" }].map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{ padding: "5px 14px", borderRadius: 20, border: type === t.id ? "2px solid #1B2D4F" : "1px solid #D1D5DB", backgroundColor: type === t.id ? "#1B2D4F" : "#fff", color: type === t.id ? "#fff" : "#6B7280", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.label}</button>
        ))}
        <span style={{ fontSize: 12, color: "#1B2D4F", fontWeight: 600, alignSelf: "center", marginLeft: 8 }}>{patients[sel].name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 260px", gap: 14 }}>
        {/* NAV */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4, padding: "0 6px" }}>Sections</div>
          {sections.map(s => (
            <div key={s.id} onClick={() => document.getElementById(`s-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })} style={{ padding: "5px 8px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 600, backgroundColor: s.highlight ? "#F0FDF4" : "transparent", color: s.highlight ? "#16A34A" : "#6B7280", border: s.highlight ? "1px solid #BBF7D0" : "1px solid transparent" }}>{s.label}</div>
          ))}
          <div style={{ marginTop: 10, padding: 8, backgroundColor: "#F9FAFB", borderRadius: 6 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Legend</div>
            {Object.entries(sourceColors).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: v.color }} />
                <span style={{ fontSize: 8, color: "#6B7280" }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1B2D4F" }}>Report Editor</span>
              <span style={{ fontSize: 10, color: "#9CA3AF", padding: "2px 6px", backgroundColor: "#F3F4F6", borderRadius: 4 }}>{type === "initial" ? "Initial" : "Progress"} — {patients[sel].name}</span>
            </div>
            <span style={{ fontSize: 9, color: "#9CA3AF" }}>Click any section to edit inline</span>
          </div>

          <div style={{ maxHeight: 640, overflowY: "auto", padding: "6px 16px 16px" }}>
            {sections.map(s => {
              const sc = sourceColors[s.source];
              const isEditing = editingId === s.id;
              return (
                <div key={s.id} id={`s-${s.id}`} onClick={() => { if (!isEditing) { setEditingId(s.id); setTimeout(() => editRef.current?.focus(), 50); } }} style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 6, backgroundColor: isEditing ? "#FAFFFE" : "transparent", borderLeft: `3px solid ${sc.color}`, cursor: "text" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: sc.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{sc.label}</span>
                    {isEditing && <span style={{ fontSize: 8, color: "#16A34A", fontWeight: 700, backgroundColor: "#F0FDF4", padding: "1px 6px", borderRadius: 3 }}>EDITING</span>}
                  </div>
                  {isEditing ? (
                    <textarea ref={editRef} value={getContent(s)} onChange={e => setContent(s, e.target.value)} onBlur={() => setEditingId(null)} style={{ width: "100%", minHeight: Math.max(80, getContent(s).split("\n").length * 22), padding: 8, borderRadius: 4, border: "1px solid #BBF7D0", fontSize: 12.5, lineHeight: 1.7, color: "#374151", fontFamily: "'Georgia', serif", resize: "vertical", backgroundColor: "#FAFFFE", boxSizing: "border-box" }} />
                  ) : (
                    <div style={{ fontSize: 12.5, lineHeight: 1.7, color: "#374151", whiteSpace: "pre-wrap", fontFamily: "'Georgia', serif" }}>{getContent(s)}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* FEEDBACK CHAT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Card style={{ flex: 1, display: "flex", flexDirection: "column", padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1B2D4F", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 13 }}>✦</span> AI Revision Chat
            </div>

            <div style={{ flex: 1, minHeight: 180, maxHeight: 400, overflowY: "auto", marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              {feedbackHistory.length === 0 && (
                <div style={{ fontSize: 11, color: "#9CA3AF", lineHeight: 1.5, padding: "4px 0" }}>
                  Not happy with the AI output? Give Claude feedback and it will revise the green ✦ sections.
                  <div style={{ marginTop: 8, fontSize: 10, fontStyle: "italic" }}>Try:</div>
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2, lineHeight: 1.6 }}>
                    "Focus more on the schema therapy work we did"<br />
                    "She was more engaged than this suggests"<br />
                    "Add mention of sleep improvements"<br />
                    "Make the treatment plan shorter"<br />
                    "The anxiety context should mention the J52 process"
                  </div>
                </div>
              )}
              {feedbackHistory.map((msg, i) => (
                <div key={i} style={{ padding: "6px 9px", borderRadius: 8, fontSize: 11, lineHeight: 1.5, backgroundColor: msg.role === "user" ? "#EFF6FF" : "#F0FDF4", color: msg.role === "user" ? "#1E40AF" : "#065F46", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%" }}>
                  {msg.role === "ai" && <div style={{ fontSize: 8, fontWeight: 700, marginBottom: 2, opacity: 0.7 }}>CLAUDE</div>}
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 4 }}>
              <input value={feedback} onChange={e => setFeedback(e.target.value)} onKeyDown={e => e.key === "Enter" && handleFeedback()} placeholder="Tell Claude what to revise..." style={{ flex: 1, padding: "7px 9px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 11, fontFamily: "inherit" }} />
              <Btn small primary onClick={handleFeedback} disabled={!feedback.trim()} style={{ padding: "6px 10px" }}>Revise ✦</Btn>
            </div>
            <p style={{ fontSize: 8, color: "#9CA3AF", margin: "4px 0 0", lineHeight: 1.3 }}>Only green ✦ sections are regenerated. Scaffold and boilerplate are untouched.</p>
          </Card>

          <Btn primary onClick={() => onNav(screens.EXPORT)} style={{ width: "100%", padding: 11 }}>Continue to Export →</Btn>
          <Btn small onClick={() => onNav(screens.NEW_REPORT)} style={{ alignSelf: "flex-start" }}>← Back</Btn>
        </div>
      </div>
    </div>
  );
};

const ExportScreen = ({ onNav }) => {
  const type = "progress";
  const sel = "jones";
  const p = patients[sel];
  const sections = reportData[type][sel];
  const initialSections = reportData.initial[sel];
  const isProgress = type === "progress";
  const filename = isProgress ? `Progress${p.reportNum}_${p.name.split(" ").pop()}_${p.pmkeys}` : `Initial_${p.name.split(" ").pop()}_${p.pmkeys}`;

  const PdfPage = ({ children, pageLabel }) => (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 4, padding: "32px 36px", fontFamily: "'Georgia', serif", fontSize: 11, lineHeight: 1.8, color: "#374151", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", position: "relative" }}>
      {pageLabel && <div style={{ position: "absolute", top: 8, right: 12, fontSize: 9, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif" }}>{pageLabel}</div>}
      {children}
    </div>
  );

  return (
    <div>
      <StepIndicator steps={["Select Patient", "Paste Transcript", "Generate", "Review & Edit", "Export"]} current={4} onNav={onNav} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Label>PDF Preview</Label>

          <PdfPage pageLabel="Page 1">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2D4F", fontFamily: "'DM Sans', sans-serif" }}>Territory Wellbeing</div>
              <div style={{ fontSize: 9, color: "#6B7280" }}>82 Smith St Darwin</div>
              <div style={{ fontSize: 9, color: "#3B82F6" }}>admin@territorywellbeing.com.au</div>
            </div>
            {sections.map(s => (
              <div key={s.id} style={{ marginBottom: s.id === "header" ? 0 : 10, whiteSpace: "pre-wrap" }}>
                {s.id === "header" ? (
                  <>
                    <div style={{ textAlign: "right", marginBottom: 16 }}>4 Mar. 26</div>
                    <div style={{ marginBottom: 2 }}>Name: {p.name}</div>
                    <div style={{ marginBottom: 14 }}>PMKeyS: {p.pmkeys}</div>
                  </>
                ) : (
                  <div>{s.content}</div>
                )}
              </div>
            ))}
          </PdfPage>

          {isProgress && initialSections && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
                <div style={{ flex: 1, height: 1, backgroundColor: "#D1D5DB" }} />
                <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, whiteSpace: "nowrap" }}>Appended: Initial Letter</span>
                <div style={{ flex: 1, height: 1, backgroundColor: "#D1D5DB" }} />
              </div>

              <PdfPage pageLabel="Page 2+">
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2D4F", fontFamily: "'DM Sans', sans-serif" }}>Territory Wellbeing</div>
                  <div style={{ fontSize: 9, color: "#6B7280" }}>82 Smith St Darwin</div>
                  <div style={{ fontSize: 9, color: "#3B82F6" }}>admin@territorywellbeing.com.au</div>
                </div>
                {initialSections.map(s => (
                  <div key={s.id} style={{ marginBottom: s.id === "header" ? 0 : 10, whiteSpace: "pre-wrap" }}>
                    {s.id === "header" ? (
                      <>
                        <div style={{ textAlign: "right", marginBottom: 16 }}>4 Mar. 26</div>
                        <div style={{ marginBottom: 2 }}>Name: {p.name}</div>
                        <div style={{ marginBottom: 14 }}>PMKeyS: {p.pmkeys}</div>
                      </>
                    ) : (
                      <div>{s.content}</div>
                    )}
                  </div>
                ))}
              </PdfPage>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 20 }}>
          <Card>
            <Label>File Details</Label>
            {[["Filename", filename], ["Google Drive", `${p.name}/`], ["Format", isProgress ? "PDF + initial letter appended" : "PDF"], ["Pages", isProgress ? "~4 (report + initial letter)" : "~2"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", backgroundColor: "#F9FAFB", borderRadius: 5, marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1B2D4F", fontFamily: k === "Filename" ? "monospace" : "inherit" }}>{v}</span>
              </div>
            ))}
          </Card>

          <Card>
            <Label>Export Actions</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn primary style={{ width: "100%", padding: 13, fontSize: 14 }}>Save as PDF to Google Drive</Btn>
              <Btn style={{ width: "100%", padding: 11 }}>Download as DOCX (editable)</Btn>
              <Btn style={{ width: "100%", padding: 11 }}>Copy to Clipboard</Btn>
            </div>
          </Card>

          <Card style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>Next Steps (Manual)</div>
            <div style={{ fontSize: 12, color: "#065F46", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 3 }}>☐ Upload PDF to Bupa ERBS portal</div>
              <div>☐ Select "Continued with Care Plan" on appointment</div>
            </div>
          </Card>
          <Btn small onClick={() => onNav(screens.DASHBOARD)} style={{ alignSelf: "flex-start" }}>← Back to Dashboard</Btn>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState(screens.DASHBOARD);
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F6F8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", zoom: 1.2 }}>
      <div style={{ backgroundColor: "#1B2D4F", padding: "9px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Territory Wellbeing</span>
          <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, padding: "2px 7px", backgroundColor: "#ffffff15", borderRadius: 4 }}>Report Automation</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span onClick={() => setScreen(screens.DASHBOARD)} style={{ fontSize: 12, fontWeight: 600, cursor: "pointer", color: screen === screens.DASHBOARD ? "#fff" : "#94A3B8" }}>Dashboard</span>
          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>PS</div>
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 16px" }}>
        {screen === screens.DASHBOARD && <Dashboard onNav={setScreen} />}
        {screen === screens.NEW_REPORT && <NewReport onNav={setScreen} />}
        {screen === screens.EDITOR && <EditorScreen onNav={setScreen} />}
        {screen === screens.EXPORT && <ExportScreen onNav={setScreen} />}
      </div>
    </div>
  );
}
