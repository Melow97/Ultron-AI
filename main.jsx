import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  Home, MessageSquare, Map, FolderKanban, FileText, Plug, Zap,
  BarChart3, Users, Settings, Search, Bell, ChevronDown,
  Sparkles, Mail, Slack, Github, HardDrive, Calendar,
  CreditCard, FileStack, Cloud, Plus, X, FileSpreadsheet, Video,
  Music2, Figma, Trello, CheckSquare, SlidersHorizontal, ArrowUp,
  CheckCircle2, Clock, Globe, Copy, RotateCcw, CalendarPlus, Check,
  UserPlus, Trash2, Apple, PlayCircle, ArrowRight, ShieldCheck,
  Code2, Terminal, Bug, ShieldAlert, Radar, Lock, Braces, TrendingUp, Activity
} from "lucide-react";

const ACCENT = "#6E56CF";
const ACCENT_2 = "#22D3EE";
const SURFACE = "#131316";
const SURFACE_2 = "#16161A";
const BORDER = "rgba(255,255,255,0.07)";
const MUTED = "#75778A";
const GRAD = "linear-gradient(135deg,#8B5CF6,#3B82F6)";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "chat", label: "AI chat", icon: MessageSquare },
  { key: "map", label: "Map view", icon: Map },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "docs", label: "Documents", icon: FileText },
  { key: "integrations", label: "Integrations", icon: Plug },
  { key: "code", label: "Ultron Code", icon: Braces, pro: true },
  { key: "predict", label: "Ultron Predict", icon: TrendingUp, pro: true },
  { key: "shark", label: "Ultron Shark", icon: Activity, pro: true },
  { key: "automations", label: "Automations", icon: Zap },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "team", label: "Team", icon: Users },
  { key: "settings", label: "Settings", icon: Settings },
];

const ALL_APPS = [
  { key: "gmail", label: "Gmail", icon: Mail, tint: "#EA4335" },
  { key: "outlook", label: "Outlook", icon: Mail, tint: "#0A66C2" },
  { key: "slack", label: "Slack", icon: Slack, tint: "#ECB22E" },
  { key: "teams", label: "Microsoft Teams", icon: Users, tint: "#6264A7" },
  { key: "zoom", label: "Zoom", icon: Video, tint: "#2D8CFF" },
  { key: "notion", label: "Notion", icon: FileStack, tint: "#EDEDED" },
  { key: "docs", label: "Google Docs", icon: FileText, tint: "#4285F4" },
  { key: "excel", label: "Excel / Sheets", icon: FileSpreadsheet, tint: "#217346" },
  { key: "drive", label: "Google Drive", icon: HardDrive, tint: "#34A853" },
  { key: "onedrive", label: "OneDrive", icon: Cloud, tint: "#0364B8" },
  { key: "dropbox", label: "Dropbox", icon: Cloud, tint: "#0061FF" },
  { key: "github", label: "GitHub", icon: Github, tint: "#EDEDED" },
  { key: "calendar", label: "Calendar", icon: Calendar, tint: "#3B82F6" },
  { key: "stripe", label: "Stripe", icon: CreditCard, tint: "#635BFF" },
  { key: "spotify", label: "Spotify", icon: Music2, tint: "#1DB954" },
  { key: "figma", label: "Figma", icon: Figma, tint: "#F24E1E" },
  { key: "trello", label: "Trello", icon: Trello, tint: "#0079BF" },
  { key: "asana", label: "Asana", icon: CheckSquare, tint: "#F06A6A" },
  { key: "vscode", label: "VS Code", icon: Code2, tint: "#007ACC", category: "security" },
  { key: "nmap", label: "Nmap", icon: Terminal, tint: "#4E9A06", category: "security" },
  { key: "burp", label: "Burp Suite", icon: Bug, tint: "#FF6633", category: "security" },
  { key: "hackerone", label: "HackerOne", icon: ShieldAlert, tint: "#D42027", category: "security" },
  { key: "bugcrowd", label: "Bugcrowd", icon: Bug, tint: "#F26822", category: "security" },
  { key: "huntress", label: "Huntress", icon: Radar, tint: "#F2545B", category: "security" },
  { key: "snyk", label: "Snyk", icon: Lock, tint: "#4C4A73", category: "security" },
  { key: "wireshark", label: "Wireshark", icon: Activity, tint: "#1B6FA8", category: "security" },
];

const DEFAULT_CONNECTED = new Set(["gmail", "slack", "drive", "github", "calendar", "stripe"]);
const SCHEDULE = [{ time: "9:30", title: "Standup" }, { time: "11:00", title: "Design review" }, { time: "14:00", title: "Investor call" }, { time: "16:30", title: "1:1 with Sam" }];
const ACTIVITY = [
  { app: "Gmail", tint: "#EA4335", text: "Summarized 5 new emails", time: "2m" },
  { app: "Slack", tint: "#ECB22E", text: "Answered 3 mentions", time: "22m" },
  { app: "Stripe", tint: "#635BFF", text: "Payment received — €340", time: "1h" },
  { app: "GitHub", tint: "#EDEDED", text: "Pushed 2 commits", time: "2h" },
];
const SUGGESTIONS = ["What's the latest news on the EU AI Act?", "Summarize today's unread emails", "Pull this week's revenue from Stripe"];
const DOCS = [
  { title: "Q3 investor deck", type: "Slides", modified: "2h ago" },
  { title: "Product roadmap", type: "Doc", modified: "Yesterday" },
  { title: "Pricing model v3", type: "Sheet", modified: "2 days ago" },
  { title: "Onboarding flow notes", type: "Doc", modified: "3 days ago" },
];
const WEEK = [{ day: "Mon", value: 40 }, { day: "Tue", value: 65 }, { day: "Wed", value: 52 }, { day: "Thu", value: 78 }, { day: "Fri", value: 90 }, { day: "Sat", value: 30 }, { day: "Sun", value: 20 }];

const DEMO_MESSAGES = [
  { role: "user", content: "Summarize today's unread emails" },
  {
    role: "assistant",
    content:
      "You have 5 unread emails. Two need a reply today: a client asking to move Thursday's call up an hour, and an invoice query from your accountant. The rest are newsletters and a shipping notification. Want me to draft replies to the two urgent ones?",
  },
];

/* ---------------- shared bits ---------------- */

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} className="relative shrink-0 rounded-full transition-colors" style={{ width: 32, height: 18, background: checked ? ACCENT : "#2A2A31" }} aria-pressed={checked}>
      <span className="absolute top-0.5 rounded-full bg-white transition-transform" style={{ width: 14, height: 14, transform: checked ? "translateX(15px)" : "translateX(2px)" }} />
    </button>
  );
}
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl p-4 ${className}`} style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>{children}</div>;
}
function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-white mb-1">{title}</h1>
      {subtitle && <p className="text-sm" style={{ color: MUTED }}>{subtitle}</p>}
    </div>
  );
}

/* ---------------- landing page ---------------- */

function LandingPage({ onEnter }) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  async function startCheckout() {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Couldn't start checkout.");
    } catch (e) {
      alert("Couldn't reach the server. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }
  const HUB_APPS = [
    { icon: Mail, tint: "#EA4335", angle: -80 }, { icon: FileStack, tint: "#EDEDED", angle: -35 },
    { icon: Calendar, tint: "#3B82F6", angle: 10 }, { icon: CreditCard, tint: "#635BFF", angle: 55 },
    { icon: Cloud, tint: "#0061FF", angle: 100 }, { icon: Github, tint: "#EDEDED", angle: 145 },
    { icon: HardDrive, tint: "#34A853", angle: 190 }, { icon: Slack, tint: "#ECB22E", angle: 235 },
  ];
  const FEATURES = [
    { icon: MessageSquare, title: "AI chat", desc: "Smart conversations that get things done." },
    { icon: Map, title: "Map view", desc: "See your entire workflow at once." },
    { icon: Plug, title: "Integrations", desc: "Connect 100+ business tools." },
    { icon: Zap, title: "Automations", desc: "Automate repetitive tasks with AI." },
    { icon: BarChart3, title: "Analytics", desc: "Track performance and save time." },
    { icon: ShieldCheck, title: "Secure", desc: "Enterprise-grade security and privacy." },
    { icon: ShieldAlert, title: "Bug bounty & SOC", desc: "Burp Suite, Nmap, HackerOne, Bugcrowd and Huntress, wired into one workflow." },
  ];
  const STATS = [{ value: "10K+", label: "Active users" }, { value: "500K+", label: "Tasks automated" }, { value: "100+", label: "Integrations" }, { value: "99.9%", label: "Uptime" }];

  return (
    <div className="w-full overflow-y-auto" style={{ background: "#0A0B12", color: "#E7E7EC", maxHeight: "90vh" }}>
      <header className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-white" style={{ background: GRAD }}>U</div>
          <span className="font-semibold text-white text-sm tracking-wide">ULTRON AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: "#C7C8D3" }}>
          {["Product", "Solutions", "Integrations", "Pricing", "Resources"].map((l) => <a key={l} href="#" className="hover:text-white">{l}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onEnter} className="text-sm px-3 py-1.5" style={{ color: "#C7C8D3" }}>Sign in</button>
          <button onClick={onEnter} className="text-sm px-4 py-2 rounded-lg font-medium text-white" style={{ background: GRAD }}>Get started free</button>
        </div>
      </header>

      <section className="px-8 py-20 grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-5">
            <span className="text-white">One AI.</span><br /><span className="text-white">Every tool.</span><br />
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One workspace.</span>
          </h1>
          <p className="text-base mb-8 max-w-md" style={{ color: MUTED }}>UltronAI connects your favorite apps and automates your work with the power of AI. All in one beautiful workspace.</p>
          <div className="flex items-center gap-3 mb-8">
            <button onClick={onEnter} className="flex items-center gap-2 text-sm px-5 py-3 rounded-xl font-medium text-white" style={{ background: GRAD }}>Get started free <ArrowRight size={15} /></button>
            <button className="text-sm px-5 py-3 rounded-xl font-medium" style={{ border: `1px solid ${BORDER}`, color: "#E7E7EC" }}>See how it works</button>
          </div>
          <p className="text-xs mb-2" style={{ color: "#5C5E6E" }}>COMING TO</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ border: `1px solid ${BORDER}`, color: "#C7C8D3" }}><Apple size={13} /> App Store</div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ border: `1px solid ${BORDER}`, color: "#C7C8D3" }}><PlayCircle size={13} /> Google Play</div>
            <span className="text-xs" style={{ color: "#5C5E6E" }}>SOON</span>
          </div>
        </div>
        <div className="relative mx-auto" style={{ width: 340, height: 340 }}>
          {HUB_APPS.map((app, i) => {
            const rad = (app.angle * Math.PI) / 180;
            const x = 170 + 130 * Math.cos(rad), y = 170 + 130 * Math.sin(rad);
            const Icon = app.icon;
            return (
              <React.Fragment key={i}>
                <svg className="absolute inset-0 pointer-events-none" width="340" height="340"><line x1="170" y1="170" x2={x} y2={y} stroke="rgba(139,92,246,0.25)" strokeWidth="1" /></svg>
                <div className="absolute rounded-xl flex items-center justify-center" style={{ left: x - 22, top: y - 22, width: 44, height: 44, background: SURFACE, border: `1px solid ${BORDER}` }}><Icon size={18} style={{ color: app.tint }} /></div>
              </React.Fragment>
            );
          })}
          <div className="absolute rounded-2xl flex items-center justify-center text-white text-2xl font-semibold" style={{ left: 130, top: 130, width: 80, height: 80, background: GRAD, boxShadow: "0 0 50px rgba(139,92,246,0.4)" }}>U</div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-medium text-white text-center mb-2">Everything you need to scale your business</h2>
        <p className="text-sm text-center mb-10" style={{ color: MUTED }}>One workspace, every capability.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(139,92,246,0.12)" }}><Icon size={18} style={{ color: "#A78BFA" }} /></div>
                <p className="text-sm font-medium text-white mb-1">{f.title}</p>
                <p className="text-xs" style={{ color: MUTED }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-white text-center mb-2">Simple, transparent pricing</h2>
        <p className="text-sm text-center mb-10" style={{ color: MUTED }}>Choose the plan that's right for you.</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl p-6" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-medium text-white mb-3">Free</p>
            <p className="text-3xl font-medium text-white mb-1">€0<span className="text-sm font-normal" style={{ color: MUTED }}> /month</span></p>
            <p className="text-xs mb-5" style={{ color: MUTED }}>For individuals getting started.</p>
            <div className="flex flex-col gap-2.5 mb-6">
              {["20 AI messages per day", "3 integrations", "3 projects", "Basic AI models", "Community support"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "#C7C8D3" }}><Check size={14} style={{ color: "#6EE7B7" }} /> {f}</div>
              ))}
            </div>
            <button className="w-full text-sm py-2.5 rounded-xl font-medium" style={{ background: "white", color: "#0A0B12" }}>Get started free</button>
          </div>

          <div className="rounded-2xl p-6 relative" style={{ background: SURFACE, border: `1px solid rgba(139,92,246,0.5)` }}>
            <span className="absolute top-5 right-6 text-[10px] px-2 py-0.5 rounded-full font-medium text-white" style={{ background: GRAD }}>POPULAR</span>
            <p className="text-sm font-medium text-white mb-3">Pro</p>
            <p className="text-3xl font-medium text-white mb-1">€12<span className="text-sm font-normal" style={{ color: MUTED }}> /month</span></p>
            <p className="text-xs mb-5" style={{ color: MUTED }}>For professionals, teams, and security researchers.</p>
            <div className="flex flex-col gap-2.5 mb-6">
              {[
                "Unlimited AI messages", "Unlimited integrations", "Unlimited projects", "Advanced AI models",
                "Automations", "Priority support", "Security & bug bounty toolkit — Burp Suite, Nmap, HackerOne, Bugcrowd, Huntress",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "#C7C8D3" }}><Check size={14} style={{ color: "#6EE7B7" }} /> {f}</div>
              ))}
            </div>
            <button onClick={startCheckout} disabled={checkoutLoading} className="w-full text-sm py-2.5 rounded-xl font-medium text-white" style={{ background: GRAD, opacity: checkoutLoading ? 0.7 : 1 }}>{checkoutLoading ? "Redirecting..." : "Upgrade to Pro"}</button>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-xl font-medium text-white mb-8">Trusted by businesses worldwide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-medium" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-8 border-t flex items-center justify-between flex-wrap gap-4" style={{ borderColor: BORDER }}>
        <span className="text-xs" style={{ color: "#5C5E6E" }}>© 2026 UltronAI. All rights reserved.</span>
        <button onClick={onEnter} className="text-xs px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${BORDER}`, color: "#C7C8D3" }}>Sign in →</button>
      </footer>
    </div>
  );
}

/* ---------------- dashboard pages ---------------- */

function HomePage({ bgWidget }) {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Good to see you." subtitle="A quiet home base — customize what lives here from the sidebar." />
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs mb-3" style={{ color: MUTED }}>Today</p>
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={15} style={{ color: ACCENT_2 }} /><span className="text-lg font-medium text-white">24</span><span className="text-xs" style={{ color: MUTED }}>tasks completed</span></div>
          <div className="flex items-center gap-2"><Clock size={15} style={{ color: ACCENT }} /><span className="text-lg font-medium text-white">3.4h</span><span className="text-xs" style={{ color: MUTED }}>time saved</span></div>
        </Card>
        {bgWidget === "calendar" && (
          <Card>
            <div className="flex items-center gap-2 mb-3"><Calendar size={14} style={{ color: "#3B82F6" }} /><p className="text-xs" style={{ color: MUTED }}>Today's schedule</p></div>
            <div className="flex flex-col gap-2">{SCHEDULE.map((s) => (<div key={s.title} className="flex items-center gap-2 text-xs"><span style={{ color: MUTED, width: 36 }}>{s.time}</span><span style={{ color: "#D6D6DC" }}>{s.title}</span></div>))}</div>
          </Card>
        )}
        {bgWidget === "spotify" && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#1DB95422" }}><Music2 size={17} style={{ color: "#1DB954" }} /></div>
              <div className="min-w-0"><p className="text-sm truncate" style={{ color: "#E7E7EC" }}>Focus flow</p><p className="text-xs truncate" style={{ color: MUTED }}>Instrumental • 1:24</p></div>
            </div>
          </Card>
        )}
        {bgWidget === null && <Card><p className="text-xs" style={{ color: MUTED }}>No background widget selected. Pick one from Customize in the sidebar.</p></Card>}
        <Card className="col-span-2">
          <p className="text-xs mb-3" style={{ color: MUTED }}>Recent activity</p>
          <div className="flex flex-col gap-3">
            {ACTIVITY.map((a) => (<div key={a.text} className="flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.tint }} /><span className="flex-1" style={{ color: "#D6D6DC" }}><span style={{ color: MUTED }}>{a.app} · </span>{a.text}</span><span className="text-xs shrink-0" style={{ color: MUTED }}>{a.time}</span></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function MapViewPage({ connected }) {
  const [selected, setSelected] = useState(null);
  const apps = ALL_APPS.filter((a) => connected.has(a.key));
  const R = 150, center = { x: 220, y: 200 };
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Map view" subtitle="A live view of everything UltronAI is connected to right now." />
      <Card>
        <div className="relative mx-auto" style={{ width: 440, height: 400 }}>
          <svg className="absolute inset-0" width="440" height="400">
            {apps.map((app, i) => {
              const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
              const x = center.x + R * Math.cos(angle), y = center.y + R * Math.sin(angle);
              return <line key={app.key} x1={center.x} y1={center.y} x2={x} y2={y} stroke="rgba(110,86,207,0.3)" strokeWidth="1" />;
            })}
          </svg>
          <div className="absolute rounded-full flex items-center justify-center text-white font-semibold" style={{ left: center.x - 32, top: center.y - 32, width: 64, height: 64, background: ACCENT, boxShadow: `0 0 30px ${ACCENT}66` }}>U</div>
          {apps.map((app, i) => {
            const angle = (i / apps.length) * Math.PI * 2 - Math.PI / 2;
            const x = center.x + R * Math.cos(angle), y = center.y + R * Math.sin(angle);
            const Icon = app.icon;
            return <button key={app.key} onClick={() => setSelected(app)} className="absolute rounded-xl flex items-center justify-center transition-transform hover:scale-110" style={{ left: x - 22, top: y - 22, width: 44, height: 44, background: SURFACE_2, border: `1px solid ${BORDER}` }}><Icon size={18} style={{ color: app.tint }} /></button>;
          })}
        </div>
        {selected ? (
          <div className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
            <selected.icon size={16} style={{ color: selected.tint }} /><span className="text-sm text-white">{selected.label}</span><span className="text-xs ml-auto" style={{ color: MUTED }}>Connected · synced 2m ago</span>
          </div>
        ) : <p className="text-xs text-center mt-4" style={{ color: MUTED }}>Click a node to see its status.</p>}
      </Card>
    </div>
  );
}

function ProjectsPage() {
  const [columns, setColumns] = useState({ todo: [{ id: 1, title: "Design pricing page" }, { id: 2, title: "Write launch copy" }], inprogress: [{ id: 3, title: "Wire live search" }], done: [{ id: 4, title: "Set up Stripe billing" }] });
  const labels = { todo: "To do", inprogress: "In progress", done: "Done" };
  const addCard = (col) => setColumns((prev) => ({ ...prev, [col]: [...prev[col], { id: Date.now(), title: "New task" }] }));
  const removeCard = (col, id) => setColumns((prev) => ({ ...prev, [col]: prev[col].filter((c) => c.id !== id) }));
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Projects" subtitle="A lightweight board — click + to add a card, the trash icon to remove one." />
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(columns).map((col) => (
          <div key={col}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium" style={{ color: MUTED }}>{labels[col]}</span><button onClick={() => addCard(col)} style={{ color: ACCENT_2 }}><Plus size={14} /></button></div>
            <div className="flex flex-col gap-2">{columns[col].map((card) => (<div key={card.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#D6D6DC" }}>{card.title}<button onClick={() => removeCard(col, card.id)} style={{ color: MUTED }}><Trash2 size={13} /></button></div>))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const filtered = DOCS.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Documents" subtitle="Everything synced from connected drives, searchable in one place." />
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
        <Search size={14} style={{ color: MUTED }} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search documents..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#E7E7EC" }} />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((d) => (
          <div key={d.title} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-3"><FileText size={15} style={{ color: ACCENT_2 }} /><div><p className="text-sm" style={{ color: "#E7E7EC" }}>{d.title}</p><p className="text-xs" style={{ color: MUTED }}>{d.type}</p></div></div>
            <span className="text-xs" style={{ color: MUTED }}>{d.modified}</span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-center py-6" style={{ color: MUTED }}>No documents match "{query}".</p>}
      </div>
    </div>
  );
}

function IntegrationsPage({ connected, toggleApp }) {
  const general = ALL_APPS.filter((a) => a.category !== "security");
  const security = ALL_APPS.filter((a) => a.category === "security");
  const Grid = ({ apps }) => (
    <div className="grid grid-cols-3 gap-3">
      {apps.map((app) => {
        const Icon = app.icon;
        return (
          <div key={app.key} className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <Icon size={17} style={{ color: app.tint }} /><span className="text-sm flex-1" style={{ color: "#E7E7EC" }}>{app.label}</span><Toggle checked={connected.has(app.key)} onChange={() => toggleApp(app.key)} />
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Integrations" subtitle="Connect any app UltronAI can read from or act on your behalf in." />
      <Grid apps={general} />
      <div className="flex items-center gap-2 mt-8 mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(74,227,140,0.06)", border: "1px solid rgba(74,227,140,0.25)" }}>
        <ShieldAlert size={14} style={{ color: "#4AE38C" }} />
        <p className="text-xs font-medium" style={{ color: "#4AE38C", fontFamily: "var(--font-mono, monospace)" }}>security &amp; bug bounty — pro</p>
      </div>
      <Grid apps={security} />
    </div>
  );
}

function AutomationsPage() {
  const [rules, setRules] = useState([
    { id: 1, name: "Summarize new emails", trigger: "When Gmail receives a message", enabled: true },
    { id: 2, name: "Post daily standup", trigger: "Every weekday at 9:00", enabled: true },
    { id: 3, name: "Flag overdue invoices", trigger: "When Stripe payment fails", enabled: false },
  ]);
  const toggle = (id) => setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const addRule = () => setRules((prev) => [...prev, { id: Date.now(), name: "New automation", trigger: "Set a trigger", enabled: false }]);
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Automations" subtitle="Rules that run across your connected apps without you asking." />
      <button onClick={addRule} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl mb-4" style={{ background: "rgba(110,86,207,0.12)", color: "#B9A9F5", border: "1px solid rgba(110,86,207,0.3)" }}><Plus size={14} /> Create automation</button>
      <div className="flex flex-col gap-2">
        {rules.map((r) => (<div key={r.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}><div><p className="text-sm" style={{ color: "#E7E7EC" }}>{r.name}</p><p className="text-xs" style={{ color: MUTED }}>{r.trigger}</p></div><Toggle checked={r.enabled} onChange={() => toggle(r.id)} /></div>))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const max = Math.max(...WEEK.map((w) => w.value));
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Analytics" subtitle="How much UltronAI has been doing for you this week." />
      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card><p className="text-xs mb-1" style={{ color: MUTED }}>Messages sent</p><p className="text-lg font-medium text-white">1,204</p></Card>
        <Card><p className="text-xs mb-1" style={{ color: MUTED }}>Automations run</p><p className="text-lg font-medium text-white">86</p></Card>
        <Card><p className="text-xs mb-1" style={{ color: MUTED }}>Avg response time</p><p className="text-lg font-medium text-white">1.8s</p></Card>
      </div>
      <Card>
        <p className="text-xs mb-4" style={{ color: MUTED }}>Activity this week</p>
        <div className="flex items-end gap-3 h-32">{WEEK.map((w) => (<div key={w.day} className="flex-1 flex flex-col items-center gap-2" title={`${w.value} actions`}><div className="w-full rounded-t-md" style={{ height: `${(w.value / max) * 100}%`, background: ACCENT, opacity: 0.85 }} /><span className="text-[11px]" style={{ color: MUTED }}>{w.day}</span></div>))}</div>
      </Card>
    </div>
  );
}

function UltronCodePage() {
  const [code, setCode] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setOutput("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1400,
          system: "You are Ultron Code, a coding assistant inside UltronAI Pro. Given a code snippet and an instruction, respond with the corrected or requested code first, then a short plain-language explanation of what changed and why. Be concise.",
          messages: [{ role: "user", content: `Instruction: ${instruction || "Review this code and suggest improvements."}\n\nCode:\n${code}` }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n\n") || "No response — try again.";
      setOutput(text);
    } catch (e) {
      setOutput("Something went wrong reaching the model. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Ultron Code" subtitle="Paste code, describe what you need, and get a live AI review or fix." />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            rows={10}
            className="w-full px-3 py-3 rounded-xl text-xs outline-none resize-none"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E7E7EC", fontFamily: "var(--font-mono, monospace)" }}
          />
          <input
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Find bugs, add error handling, explain this..."
            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E7E7EC" }}
          />
          <button onClick={run} disabled={loading || !code.trim()} className="flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl font-medium text-white" style={{ background: code.trim() ? ACCENT : "#26262C", opacity: loading ? 0.7 : 1 }}>
            <Braces size={14} /> {loading ? "Reviewing..." : "Ask Ultron Code"}
          </button>
        </div>
        <div className="rounded-xl px-3 py-3 text-xs overflow-y-auto whitespace-pre-wrap" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#C7C8D3", fontFamily: "var(--font-mono, monospace)", minHeight: 260, maxHeight: 340 }}>
          {output || (loading ? "Thinking..." : "Output will appear here.")}
        </div>
      </div>
    </div>
  );
}

function UltronPredictPage() {
  const [scenario, setScenario] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function predict() {
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 600,
          system:
            'You are Ultron Predict, an AI forecasting assistant inside UltronAI Pro. Given a business or project scenario, respond with ONLY valid JSON, no markdown fences, no preamble, in this exact shape: {"probability": <0-100 integer>, "outcome": "<one sentence describing the most likely outcome>", "factors": ["<factor 1>", "<factor 2>", "<factor 3>"], "caveat": "<one sentence noting this is an AI estimate based only on the info given, not a guarantee>"}',
          messages: [{ role: "user", content: scenario }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("") || "{}";
      const cleaned = text.trim().replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "");
      setResult(JSON.parse(cleaned));
    } catch (e) {
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Ultron Predict" subtitle="Describe a scenario and get an AI-estimated likelihood, with the reasoning behind it." />
      <div className="flex flex-col gap-3 mb-6">
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="e.g. We're at €38k MRR with 12% monthly growth. Will we hit €50k by end of Q4?"
          rows={3}
          className="w-full px-3 py-3 rounded-xl text-sm outline-none resize-none"
          style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E7E7EC" }}
        />
        <button onClick={predict} disabled={loading || !scenario.trim()} className="flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl font-medium text-white self-start px-5" style={{ background: scenario.trim() ? ACCENT : "#26262C", opacity: loading ? 0.7 : 1 }}>
          <TrendingUp size={14} /> {loading ? "Estimating..." : "Estimate outcome"}
        </button>
      </div>

      {result && !result.error && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs" style={{ color: MUTED }}>Estimated likelihood</p>
            <p className="text-2xl font-medium text-white">{result.probability}%</p>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "#22242F" }}>
            <div className="h-full rounded-full" style={{ width: `${result.probability}%`, background: `linear-gradient(90deg,${ACCENT},${ACCENT_2})` }} />
          </div>
          <p className="text-sm text-white mb-4">{result.outcome}</p>
          <p className="text-xs mb-2" style={{ color: MUTED }}>Key factors</p>
          <ul className="flex flex-col gap-1.5 mb-4">
            {(result.factors || []).map((f, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "#C7C8D3" }}>
                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: ACCENT_2 }} />
                {f}
              </li>
            ))}
          </ul>
          <p className="text-xs italic" style={{ color: "#5C5E6E" }}>{result.caveat}</p>
        </Card>
      )}
      {result && result.error && <p className="text-sm" style={{ color: MUTED }}>Couldn't generate an estimate that time — try rephrasing the scenario.</p>}
    </div>
  );
}

function UltronSharkPage() {
  const SAMPLE_PACKETS = [
    { no: 1, src: "10.0.0.14", dst: "142.250.80.14", proto: "TLSv1.3", len: 1420, info: "Application Data" },
    { no: 2, src: "10.0.0.14", dst: "10.0.0.1", proto: "DNS", len: 74, info: "Standard query A api.stripe.com" },
    { no: 3, src: "203.0.113.55", dst: "10.0.0.14", proto: "TCP", len: 66, info: "44112 → 22 [SYN]" },
    { no: 4, src: "203.0.113.55", dst: "10.0.0.14", proto: "TCP", len: 66, info: "44113 → 22 [SYN]" },
    { no: 5, src: "203.0.113.55", dst: "10.0.0.14", proto: "TCP", len: 66, info: "44114 → 22 [SYN]" },
    { no: 6, src: "10.0.0.14", dst: "13.107.42.14", proto: "TLSv1.3", len: 890, info: "Client Hello" },
  ];
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (loading) return;
    setLoading(true);
    setAnalysis("");
    const table = SAMPLE_PACKETS.map((p) => `#${p.no} ${p.src} -> ${p.dst} [${p.proto}] len=${p.len} info="${p.info}"`).join("\n");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 700,
          system: "You are Ultron Shark, a defensive network-traffic analysis assistant inside UltronAI Pro. You are given a short exported capture summary (already recorded by the user's own Wireshark or equivalent tool) and answer questions about it — explaining protocols, flagging patterns worth investigating (like repeated SYNs from one source, which can indicate scanning), and suggesting what to check next. You never provide instructions for conducting attacks, only for understanding and defending against traffic already captured.",
          messages: [{ role: "user", content: `Capture summary:\n${table}\n\nQuestion: ${question || "Anything worth flagging in this capture?"}` }],
        }),
      });
      const data = await response.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n\n") || "No response — try again.";
      setAnalysis(text);
    } catch (e) {
      setAnalysis("Something went wrong reaching the model. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Ultron Shark" subtitle="AI-assisted reading of exported capture data — not live packet sniffing, which browsers can't do." />
      <Card className="mb-4">
        <p className="text-xs mb-3" style={{ color: MUTED, fontFamily: "var(--font-mono, monospace)" }}>sample_capture.pcapng — 6 packets</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono, monospace)", color: "#C7C8D3" }}>
            <thead>
              <tr style={{ color: MUTED }}>
                <th className="text-left pb-2 pr-3">No.</th><th className="text-left pb-2 pr-3">Source</th><th className="text-left pb-2 pr-3">Destination</th><th className="text-left pb-2 pr-3">Proto</th><th className="text-left pb-2 pr-3">Len</th><th className="text-left pb-2">Info</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_PACKETS.map((p) => (
                <tr key={p.no} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td className="py-1.5 pr-3">{p.no}</td><td className="py-1.5 pr-3">{p.src}</td><td className="py-1.5 pr-3">{p.dst}</td>
                  <td className="py-1.5 pr-3" style={{ color: "#4AE38C" }}>{p.proto}</td><td className="py-1.5 pr-3">{p.len}</td><td className="py-1.5">{p.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex items-center gap-2 mb-4">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about this capture, e.g. 'anything suspicious here?'" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E7E7EC" }} />
        <button onClick={analyze} disabled={loading} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl font-medium text-white shrink-0" style={{ background: ACCENT, opacity: loading ? 0.7 : 1 }}>
          <Activity size={14} /> {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      {analysis && (
        <Card>
          <p className="text-sm whitespace-pre-wrap" style={{ color: "#E7E7EC" }}>{analysis}</p>
        </Card>
      )}
    </div>
  );
}

function TeamPage() {
  const [team, setTeam] = useState([{ name: "Mel", role: "Owner", initials: "M", status: "#22D3EE" }, { name: "Alex Rivera", role: "Editor", initials: "AR", status: "#75778A" }]);
  const [email, setEmail] = useState("");
  const invite = () => { if (!email.trim()) return; setTeam((prev) => [...prev, { name: email, role: "Pending", initials: email[0].toUpperCase(), status: "#75778A" }]); setEmail(""); };
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Team" subtitle="Everyone with access to this UltronAI workspace." />
      <div className="flex items-center gap-2 mb-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite by email..." className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: "#E7E7EC" }} />
        <button onClick={invite} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl shrink-0" style={{ background: ACCENT, color: "white" }}><UserPlus size={14} /> Invite</button>
      </div>
      <div className="flex flex-col gap-2">{team.map((m) => (<div key={m.name} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0" style={{ background: ACCENT }}>{m.initials}</div><span className="text-sm flex-1" style={{ color: "#E7E7EC" }}>{m.name}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{ color: m.status, border: `1px solid ${m.status}44` }}>{m.role}</span></div>))}</div>
    </div>
  );
}

function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, push: true, weekly: false });
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Settings" subtitle="Your account, plan, and notification preferences." />
      <Card className="mb-4"><p className="text-xs mb-3" style={{ color: MUTED }}>Account</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ background: ACCENT }}>M</div><div><p className="text-sm text-white">Mel</p><p className="text-xs" style={{ color: MUTED }}>Dublin, Ireland</p></div></div></Card>
      <Card className="mb-4"><div className="flex items-center justify-between mb-1"><p className="text-xs" style={{ color: MUTED }}>Plan</p><button className="text-xs" style={{ color: ACCENT_2 }}>Manage</button></div><p className="text-sm text-white">Pro — €12/month</p></Card>
      <Card><p className="text-xs mb-3" style={{ color: MUTED }}>Notifications</p><div className="flex flex-col gap-3">{[["email", "Email notifications"], ["push", "Push notifications"], ["weekly", "Weekly summary"]].map(([key, label]) => (<div key={key} className="flex items-center justify-between"><span className="text-sm" style={{ color: "#D6D6DC" }}>{label}</span><Toggle checked={notifs[key]} onChange={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))} /></div>))}</div></Card>
    </div>
  );
}

function CustomizeModal({ open, onClose, connected, toggleApp, bgWidget, setBgWidget }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#0F0F12", border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}><span className="text-sm font-medium text-white">Customize</span><button onClick={onClose} style={{ color: MUTED }}><X size={16} /></button></div>
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs mb-2" style={{ color: MUTED }}>Background widget</p>
          <div className="flex gap-2">{[{ key: null, label: "None" }, { key: "calendar", label: "Schedule" }, { key: "spotify", label: "Spotify" }].map((opt) => (<button key={String(opt.key)} onClick={() => setBgWidget(opt.key)} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: bgWidget === opt.key ? "rgba(110,86,207,0.15)" : SURFACE_2, color: bgWidget === opt.key ? "#B9A9F5" : "#C7C8D3", border: `1px solid ${BORDER}` }}>{opt.label}</button>))}</div>
        </div>
        <div className="px-5 py-4 max-h-80 overflow-y-auto">
          <p className="text-xs mb-2" style={{ color: MUTED }}>Connect apps</p>
          <div className="flex flex-col gap-1">{ALL_APPS.map((app) => { const Icon = app.icon; return (<div key={app.key} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: SURFACE_2 }}><Icon size={15} style={{ color: app.tint }} /><span className="text-sm flex-1" style={{ color: "#E7E7EC" }}>{app.label}</span><Toggle checked={connected.has(app.key)} onChange={() => toggleApp(app.key)} /></div>); })}</div>
        </div>
      </div>
    </div>
  );
}

function MessageActions({ index, content, connected, isLast, onRegenerate }) {
  const [flash, setFlash] = useState(null);
  const flashThen = (key) => { setFlash(key); setTimeout(() => setFlash((f) => (f === key ? null : f)), 1500); };
  const copy = () => { try { navigator.clipboard.writeText(content); } catch (e) {} flashThen("copy"); };
  const actions = [{ key: "copy", label: flash === "copy" ? "Copied" : "Copy", icon: flash === "copy" ? Check : Copy, onClick: copy }];
  if (isLast) actions.push({ key: "regen", label: "Regenerate", icon: RotateCcw, onClick: () => onRegenerate(index) });
  if (connected.has("calendar")) actions.push({ key: "cal", label: flash === "cal" ? "Added" : "Add to calendar", icon: flash === "cal" ? Check : CalendarPlus, onClick: () => flashThen("cal") });
  if (connected.has("gmail") || connected.has("outlook")) actions.push({ key: "mail", label: flash === "mail" ? "Drafted" : "Draft email", icon: flash === "mail" ? Check : Mail, onClick: () => flashThen("mail") });
  if (connected.has("notion")) actions.push({ key: "notion", label: flash === "notion" ? "Saved" : "Save to Notion", icon: flash === "notion" ? Check : FileStack, onClick: () => flashThen("notion") });
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {actions.map((a) => { const Icon = a.icon; return (<button key={a.key} onClick={a.onClick} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-md" style={{ background: SURFACE_2, border: `1px solid ${BORDER}`, color: "#9497A6" }}><Icon size={11} />{a.label}</button>); })}
    </div>
  );
}

function ChatOverlay({ open, onClose, messages, loading, input, setInput, onSend, searchEnabled, setSearchEnabled, connected, onRegenerate }) {
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, loading, open]);
  if (!open) return null;
  const lastAssistantIndex = [...messages].map((m, i) => (m.role === "assistant" ? i : -1)).filter((i) => i >= 0).pop();
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl mb-24 rounded-3xl flex flex-col overflow-hidden" style={{ height: "72vh", background: "#0F0F12", border: `1px solid ${BORDER}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}><div className="flex items-center gap-2"><Sparkles size={14} style={{ color: ACCENT_2 }} /><span className="text-sm font-medium text-white">UltronAI</span></div><button onClick={onClose} style={{ color: MUTED }}><X size={16} /></button></div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="mt-8">
              <p className="text-sm text-center mb-4" style={{ color: MUTED }}>Ask anything — I can search the live web, or act across your connected apps.</p>
              <div className="flex flex-col gap-2 max-w-sm mx-auto">{SUGGESTIONS.map((s) => (<button key={s} onClick={() => onSend(s)} className="text-left text-sm px-3 py-2 rounded-xl" style={{ background: SURFACE_2, border: `1px solid ${BORDER}`, color: "#C7C8D3" }}>{s}</button>))}</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap" style={m.role === "user" ? { background: ACCENT, color: "white" } : { background: SURFACE_2, color: "#E7E7EC", border: `1px solid ${BORDER}` }}>{m.content}</div>
              {m.role === "assistant" && <MessageActions index={i} content={m.content} connected={connected} isLast={i === lastAssistantIndex} onRegenerate={onRegenerate} />}
            </div>
          ))}
          {loading && (<div className="flex justify-start"><div className="rounded-2xl px-4 py-2.5 text-sm flex items-center gap-1.5" style={{ background: SURFACE_2, color: MUTED, border: `1px solid ${BORDER}` }}><Sparkles size={14} />{searchEnabled ? "Searching and thinking..." : "Thinking..."}</div></div>)}
        </div>
        <div className="px-5 pb-5 pt-2">
          <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: SURFACE_2, border: `1px solid rgba(255,255,255,0.1)` }}>
            <button onClick={() => setSearchEnabled((v) => !v)} className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: searchEnabled ? "rgba(34,211,238,0.12)" : "transparent", color: searchEnabled ? ACCENT_2 : MUTED, border: `1px solid ${searchEnabled ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.08)"}` }} aria-pressed={searchEnabled}><Globe size={13} />Search</button>
            <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="Message UltronAI..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#E7E7EC" }} />
            <button onClick={() => onSend()} disabled={loading || !input.trim()} className="p-2 rounded-full shrink-0" style={{ background: input.trim() ? ACCENT : "#26262C", color: "white" }}><ArrowUp size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- dashboard shell ---------------- */

function Dashboard({ onSignOut }) {
  const [active, setActive] = useState("home");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [connected, setConnected] = useState(new Set(DEFAULT_CONNECTED));
  const [bgWidget, setBgWidget] = useState("calendar");
  const [searchEnabled, setSearchEnabled] = useState(true);

  const toggleApp = (key) => setConnected((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  async function startCheckout() {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Couldn't start checkout.");
    } catch (e) {
      alert("Couldn't reach the server. Try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function callModel(nextMessages) {
    setMessages(nextMessages);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: "You are the assistant inside UltronAI, an all-in-one AI workspace that connects tools like Gmail, Slack, Notion, Google Drive, GitHub, Calendar, Dropbox, Stripe, and — on Pro — a security toolkit (VS Code, Nmap, Burp Suite, HackerOne, Bugcrowd, Huntress, Snyk) for bug bounty and SOC workflows. Answer helpfully and concisely. When you use web search, cite what you found briefly and naturally. If asked to take an action in a connected app, describe what you would do, since this is a live product demo without real integration access yet. You can discuss security concepts, triage, and defensive practices, but never provide exploit code or step-by-step attack instructions against systems the user doesn't own or have explicit authorization to test.",
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          ...(searchEnabled ? { tools: [{ type: "web_search_20250305", name: "web_search" }] } : {}),
        }),
      });
      const data = await response.json();
      const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n\n") || "I couldn't generate a response just now — try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong reaching the model. Please try again." }]);
    } finally { setLoading(false); }
  }
  function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    if (!chatOpen) setChatOpen(true);
    setInput("");
    callModel([...messages, { role: "user", content }]);
  }
  function regenerate(index) { if (!loading) callModel(messages.slice(0, index)); }

  const connectedApps = ALL_APPS.filter((a) => connected.has(a.key));
  const pages = {
    home: <HomePage bgWidget={bgWidget} />, map: <MapViewPage connected={connected} />, projects: <ProjectsPage />,
    docs: <DocumentsPage />, integrations: <IntegrationsPage connected={connected} toggleApp={toggleApp} />,
    code: <UltronCodePage />, predict: <UltronPredictPage />, shark: <UltronSharkPage />,
    automations: <AutomationsPage />, analytics: <AnalyticsPage />, team: <TeamPage />, settings: <SettingsPage />,
  };

  return (
    <div className="w-full flex relative" style={{ background: "#0A0A0C", color: "#E7E7EC", minHeight: 680, fontFamily: "var(--font-sans, sans-serif)" }}>
      <CustomizeModal open={customizeOpen} onClose={() => setCustomizeOpen(false)} connected={connected} toggleApp={toggleApp} bgWidget={bgWidget} setBgWidget={setBgWidget} />
      <ChatOverlay open={chatOpen} onClose={() => setChatOpen(false)} messages={messages} loading={loading} input={input} setInput={setInput} onSend={sendMessage} searchEnabled={searchEnabled} setSearchEnabled={setSearchEnabled} connected={connected} onRegenerate={regenerate} />

      <aside className="w-60 shrink-0 flex flex-col justify-between border-r" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0D0D10" }}>
        <div>
          <button onClick={onSignOut} className="flex items-center gap-2 px-4 py-5 w-full text-left">
            <div className="rounded-lg flex items-center justify-center font-semibold text-white shrink-0" style={{ width: 30, height: 30, background: ACCENT }}>U</div>
            <span className="font-semibold tracking-wide text-sm text-white">ULTRON AI</span>
          </button>
          <nav className="mt-1 px-2 flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === "chat" ? chatOpen : active === item.key && !chatOpen;
              return (
                <button key={item.key} onClick={() => (item.key === "chat" ? setChatOpen(true) : (setActive(item.key), setChatOpen(false)))} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors" style={{ background: isActive ? "rgba(110,86,207,0.15)" : "transparent", color: isActive ? "#B9A9F5" : MUTED }}>
                  <Icon size={16} /><span className="flex-1 text-left">{item.label}</span>
                  {item.pro && <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ background: "rgba(110,86,207,0.2)", color: "#B9A9F5" }}>PRO</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-3 flex flex-col gap-3">
          <div className="rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: ACCENT }}><SlidersHorizontal size={11} color="white" /></div>
              <span className="text-xs font-medium text-white flex-1">Customize</span>
              <button onClick={() => setCustomizeOpen(true)} style={{ color: MUTED }}><Plus size={13} /></button>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {connectedApps.map((app) => { const Icon = app.icon; return (<button key={app.key} onClick={() => toggleApp(app.key)} title={app.label} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}><Icon size={12} style={{ color: app.tint }} /></button>); })}
              <button onClick={() => setCustomizeOpen(true)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: SURFACE_2, border: "1px dashed rgba(255,255,255,0.15)", color: MUTED }}><Plus size={12} /></button>
            </div>
          </div>
          <div className="rounded-xl p-3 text-xs" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-2"><span className="text-white font-medium">Pro plan</span><button onClick={startCheckout} disabled={checkoutLoading} className="text-[11px]" style={{ color: "#8B7CF6" }}>{checkoutLoading ? "..." : "Upgrade"}</button></div>
            <div className="flex items-center justify-between mb-1" style={{ color: MUTED }}><span>Usage</span><span>78%</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#22242F" }}><div className="h-full rounded-full" style={{ width: "78%", background: `linear-gradient(90deg,${ACCENT},${ACCENT_2})` }} /></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="text-sm font-medium" style={{ color: "#D6D6DC" }}>{NAV_ITEMS.find((n) => n.key === active)?.label}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm w-64" style={{ background: SURFACE, color: MUTED, border: `1px solid ${BORDER}` }}><Search size={13} /><span>Search...</span><span className="ml-auto text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#1B1B20" }}>⌘K</span></div>
            <Bell size={16} style={{ color: MUTED }} />
            <div className="flex items-center gap-1.5"><div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ background: ACCENT }}>U</div><ChevronDown size={13} style={{ color: MUTED }} /></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{pages[active]}</div>
        <div className="px-6 pb-6 flex justify-center">
          <button onClick={() => setChatOpen(true)} className="w-full max-w-2xl flex items-center gap-3 rounded-full px-5 py-3.5 text-left" style={{ background: SURFACE, border: `1px solid rgba(255,255,255,0.1)`, boxShadow: "0 10px 40px rgba(0,0,0,0.4)", color: MUTED }}>
            <Sparkles size={15} style={{ color: ACCENT_2 }} /><span className="text-sm flex-1">Ask UltronAI anything...</span><span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#1B1B20" }}>⌘J</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- root ---------------- */

function App() {
  const [page, setPage] = useState("landing");
  const [connected, setConnected] = useState(DEFAULT_CONNECTED);
  const [bgWidget, setBgWidget] = useState("calendar");

  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("dashboard")} />;
  }

  return <Dashboard page={page} setPage={setPage} connected={connected} setConnected={setConnected} bgWidget={bgWidget} setBgWidget={setBgWidget} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
