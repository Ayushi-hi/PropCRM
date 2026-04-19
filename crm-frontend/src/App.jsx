import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0f1117",
  surface: "#1a1d27",
  surface2: "#22263a",
  surface3: "#2a2f45",
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.12)",
  accent: "#e8834a",
  accentDark: "#c96830",
  accentGlow: "rgba(232,131,74,0.15)",
  gold: "#f0c040",
  green: "#3ecf8e",
  greenLight: "rgba(62,207,142,0.12)",
  blue: "#4a90e2",
  blueLight: "rgba(74,144,226,0.12)",
  red: "#e84a4a",
  redLight: "rgba(232,74,74,0.12)",
  amber: "#f0a030",
  amberLight: "rgba(240,160,48,0.12)",
  purple: "#9b6fe8",
  purpleLight: "rgba(155,111,232,0.12)",
  text: "#f0ede8",
  textSec: "#9a9db0",
  textMuted: "#5a5d70",
};

const css = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const AGENTS = [
  { id: 1, name: "Priya Sharma", avatar: "PS", role: "Senior Agent", leads: 32, deals: 14, conversion: 43, phone: "+91 98200 11234", email: "priya@propcrm.com", city: "Mumbai", joined: "Jan 2022", commission: "₹18.4 L", active: true },
  { id: 2, name: "Rahul Mehta", avatar: "RM", role: "Agent", leads: 25, deals: 9, conversion: 36, phone: "+91 98100 22345", email: "rahul@propcrm.com", city: "Pune", joined: "Mar 2022", commission: "₹10.2 L", active: true },
  { id: 3, name: "Anika Patel", avatar: "AP", role: "Manager", leads: 28, deals: 11, conversion: 39, phone: "+91 99300 33456", email: "anika@propcrm.com", city: "Bengaluru", joined: "Nov 2021", commission: "₹14.6 L", active: true },
  { id: 4, name: "Vikram Singh", avatar: "VS", role: "Agent", leads: 20, deals: 7, conversion: 35, phone: "+91 97200 44567", email: "vikram@propcrm.com", city: "Delhi", joined: "Jun 2023", commission: "₹8.1 L", active: false },
];

const LEADS_DATA = [
  { id: 1, name: "Arjun Kapoor", phone: "+91 98200 11234", email: "arjun@email.com", source: "Website", budget: "₹1.2 Cr", score: 87, status: "Hot", agent: "Priya Sharma", nextAction: "Call Today", property: "Skyline Heights", lastContact: "Today" },
  { id: 2, name: "Meera Nair", phone: "+91 98100 22345", email: "meera@email.com", source: "Referral", budget: "₹80 L", score: 72, status: "Warm", agent: "Rahul Mehta", nextAction: "Send Options", property: "Green Valley", lastContact: "2 days ago" },
  { id: 3, name: "Suresh Iyer", phone: "+91 99300 33456", email: "suresh@email.com", source: "Google Ads", budget: "₹2.5 Cr", score: 91, status: "Hot", agent: "Anika Patel", nextAction: "Schedule Visit", property: "Prestige Towers", lastContact: "Today" },
  { id: 4, name: "Kavita Desai", phone: "+91 97200 44567", email: "kavita@email.com", source: "Facebook", budget: "₹60 L", score: 45, status: "Cold", agent: "Vikram Singh", nextAction: "Follow Up", property: "Sunrise Apartments", lastContact: "1 week ago" },
  { id: 5, name: "Rohan Gupta", phone: "+91 98500 55678", email: "rohan@email.com", source: "Website", budget: "₹1.8 Cr", score: 78, status: "Warm", agent: "Priya Sharma", nextAction: "Send Options", property: "Skyline Heights", lastContact: "3 days ago" },
  { id: 6, name: "Ananya Joshi", phone: "+91 99800 66789", email: "ananya@email.com", source: "Walk-in", budget: "₹95 L", score: 83, status: "Hot", agent: "Anika Patel", nextAction: "Call Today", property: "Palm Grove", lastContact: "Today" },
  { id: 7, name: "Deepak Verma", phone: "+91 97600 77890", email: "deepak@email.com", source: "Referral", budget: "₹3.2 Cr", score: 65, status: "Warm", agent: "Rahul Mehta", nextAction: "Schedule Visit", property: "Prestige Towers", lastContact: "5 days ago" },
  { id: 8, name: "Sonal Bhatia", phone: "+91 98900 88901", email: "sonal@email.com", source: "Google Ads", budget: "₹50 L", score: 38, status: "Cold", agent: "Vikram Singh", nextAction: "Follow Up", property: "Green Valley", lastContact: "2 weeks ago" },
];

const PROPERTIES = [
  { id: 1, title: "Skyline Heights", location: "Bandra West, Mumbai", price: "₹1.1–2.2 Cr", type: "2/3 BHK", status: "Available", amenities: ["Gym", "Pool", "Parking", "Security"], leads: 3, agent: "Priya Sharma", size: "1200 sq ft" },
  { id: 2, title: "Green Valley", location: "Whitefield, Bengaluru", price: "₹65–95 L", type: "2 BHK", status: "Limited", amenities: ["Garden", "Clubhouse", "Parking"], leads: 2, agent: "Rahul Mehta", size: "980 sq ft" },
  { id: 3, title: "Prestige Towers", location: "Juhu, Mumbai", price: "₹2.2–4 Cr", type: "3/4 BHK", status: "Available", amenities: ["Pool", "Gym", "Concierge", "Spa"], leads: 2, agent: "Anika Patel", size: "2200 sq ft" },
  { id: 4, title: "Sunrise Apartments", location: "Hadapsar, Pune", price: "₹48–72 L", type: "1/2 BHK", status: "Sold Out", amenities: ["Parking", "Security"], leads: 1, agent: "Vikram Singh", size: "750 sq ft" },
  { id: 5, title: "Palm Grove", location: "Koregaon Park, Pune", price: "₹85 L–1.1 Cr", type: "2/3 BHK", status: "Available", amenities: ["Garden", "Pool", "Gym"], leads: 1, agent: "Anika Patel", size: "1450 sq ft" },
  { id: 6, title: "Marina Bay Residences", location: "Worli, Mumbai", price: "₹4–8 Cr", type: "4 BHK Penthouse", status: "Available", amenities: ["Sea View", "Helipad", "Concierge", "Pool", "Gym"], leads: 0, agent: "Priya Sharma", size: "3800 sq ft" },
];

const DEALS_DATA = [
  { id: 1, client: "Suresh Iyer", property: "Prestige Towers", stage: "Negotiation", value: "₹2.8 Cr", commission: "₹5.6 L", agent: "Anika Patel", days: 12, priority: "High" },
  { id: 2, client: "Arjun Kapoor", property: "Skyline Heights", stage: "Site Visit", value: "₹1.4 Cr", commission: "₹2.8 L", agent: "Priya Sharma", days: 5, priority: "High" },
  { id: 3, client: "Meera Nair", property: "Green Valley", stage: "Proposal", value: "₹82 L", commission: "₹1.64 L", agent: "Rahul Mehta", days: 8, priority: "Medium" },
  { id: 4, client: "Ananya Joshi", property: "Palm Grove", stage: "Closed", value: "₹96 L", commission: "₹1.92 L", agent: "Anika Patel", days: 45, priority: "Low" },
  { id: 5, client: "Rohan Gupta", property: "Skyline Heights", stage: "Qualification", value: "₹1.8 Cr", commission: "₹3.6 L", agent: "Priya Sharma", days: 2, priority: "Medium" },
  { id: 6, client: "Deepak Verma", property: "Prestige Towers", stage: "Closed", value: "₹3.1 Cr", commission: "₹6.2 L", agent: "Rahul Mehta", days: 60, priority: "Low" },
];

const FOLLOWUPS = [
  { id: 1, lead: "Arjun Kapoor", agent: "Priya Sharma", action: "Call – Discuss 3BHK options", due: "Today", priority: "High", status: "Pending", type: "Call" },
  { id: 2, lead: "Suresh Iyer", agent: "Anika Patel", action: "Send revised quote for Prestige Towers", due: "Today", priority: "High", status: "Pending", type: "Email" },
  { id: 3, lead: "Meera Nair", agent: "Rahul Mehta", action: "Email property brochures", due: "Tomorrow", priority: "Medium", status: "Pending", type: "Email" },
  { id: 4, lead: "Kavita Desai", agent: "Vikram Singh", action: "Re-engagement call", due: "In 2 days", priority: "Low", status: "Pending", type: "Call" },
  { id: 5, lead: "Rohan Gupta", agent: "Priya Sharma", action: "Schedule site visit at Skyline", due: "Tomorrow", priority: "Medium", status: "Done", type: "Visit" },
  { id: 6, lead: "Ananya Joshi", agent: "Anika Patel", action: "Send token amount & docs", due: "In 3 days", priority: "High", status: "Pending", type: "Email" },
  { id: 7, lead: "Deepak Verma", agent: "Rahul Mehta", action: "Closing paperwork review", due: "In 4 days", priority: "High", status: "Pending", type: "Meeting" },
];

const ACTIVITIES = [
  { id: 1, type: "lead", text: "New lead Arjun Kapoor added from Website", time: "2 min ago", user: "System" },
  { id: 2, type: "deal", text: "Deal closed – Deepak Verma · ₹3.1 Cr", time: "1 hr ago", user: "Rahul Mehta" },
  { id: 3, type: "visit", text: "Site visit scheduled – Ananya Joshi at Palm Grove", time: "3 hr ago", user: "Anika Patel" },
  { id: 4, type: "call", text: "Call completed with Meera Nair", time: "5 hr ago", user: "Rahul Mehta" },
  { id: 5, type: "lead", text: "New lead Sonal Bhatia from Google Ads", time: "1 day ago", user: "System" },
  { id: 6, type: "deal", text: "Deal stage updated: Ananya Joshi → Negotiation", time: "2 days ago", user: "Anika Patel" },
  { id: 7, type: "doc", text: "Agreement uploaded for Deepak Verma deal", time: "2 days ago", user: "Admin" },
];

const MONTHLY = [
  { month: "Oct", leads: 38, deals: 8 },
  { month: "Nov", leads: 45, deals: 10 },
  { month: "Dec", leads: 40, deals: 9 },
  { month: "Jan", leads: 52, deals: 13 },
  { month: "Feb", leads: 48, deals: 11 },
  { month: "Mar", leads: 61, deals: 16 },
];

const STAGES = ["Qualification", "Proposal", "Site Visit", "Negotiation", "Closed"];

// ─── SMALL COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ label, size = "sm" }) => {
  const map = {
    Hot: [COLORS.red, COLORS.redLight], Warm: [COLORS.amber, COLORS.amberLight],
    Cold: [COLORS.blue, COLORS.blueLight], Available: [COLORS.green, COLORS.greenLight],
    Limited: [COLORS.amber, COLORS.amberLight], "Sold Out": [COLORS.textMuted, "rgba(255,255,255,0.06)"],
    Closed: [COLORS.green, COLORS.greenLight], Negotiation: [COLORS.purple, COLORS.purpleLight],
    Proposal: [COLORS.blue, COLORS.blueLight], "Site Visit": [COLORS.amber, COLORS.amberLight],
    Qualification: [COLORS.textSec, "rgba(255,255,255,0.06)"], High: [COLORS.red, COLORS.redLight],
    Medium: [COLORS.amber, COLORS.amberLight], Low: [COLORS.blue, COLORS.blueLight],
    Pending: [COLORS.amber, COLORS.amberLight], Done: [COLORS.green, COLORS.greenLight],
    Active: [COLORS.green, COLORS.greenLight], Inactive: [COLORS.textMuted, "rgba(255,255,255,0.06)"],
    Admin: [COLORS.accent, COLORS.accentGlow], Manager: [COLORS.purple, COLORS.purpleLight],
    Agent: [COLORS.blue, COLORS.blueLight],
  };
  const [color, bg] = map[label] || [COLORS.textSec, "rgba(255,255,255,0.06)"];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: size === "sm" ? "2px 9px" : "4px 12px", borderRadius: 20, fontSize: size === "sm" ? 11 : 12, fontWeight: 600, letterSpacing: "0.03em", background: bg, color }}>
      {label}
    </span>
  );
};

const Avatar = ({ initials, size = 36, color = COLORS.accent }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, color, flexShrink: 0, letterSpacing: "0.02em" }}>
    {initials}
  </div>
);

const ScoreBar = ({ score }) => {
  const color = score >= 80 ? COLORS.green : score >= 60 ? COLORS.amber : COLORS.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 64, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}</span>
    </div>
  );
};

const StatCard = ({ title, value, sub, color = COLORS.accent, icon }) => (
  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, borderRadius: "14px 14px 0 0", opacity: 0.7 }} />
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.textMuted, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textSec, marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
);

const Modal = ({ title, onClose, children, width = 540 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(4px)" }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 18, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text }}>{title}</div>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, cursor: "pointer", color: COLORS.textSec, fontSize: 18, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 5 }}>{label}</label>}
    <input {...props} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 5 }}>{label}</label>}
    <select {...props} style={{ width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
      {children}
    </select>
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style: s = {} }) => {
  const styles = {
    primary: { background: COLORS.accent, color: "#fff", border: "none" },
    secondary: { background: "rgba(255,255,255,0.06)", color: COLORS.text, border: `1px solid ${COLORS.border2}` },
    ghost: { background: "transparent", color: COLORS.textSec, border: "none" },
    danger: { background: COLORS.redLight, color: COLORS.red, border: `1px solid ${COLORS.red}33` },
    success: { background: COLORS.greenLight, color: COLORS.green, border: `1px solid ${COLORS.green}33` },
  };
  const sizes = { sm: { padding: "5px 12px", fontSize: 12 }, md: { padding: "8px 18px", fontSize: 13 }, lg: { padding: "12px 24px", fontSize: 14 } };
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, fontFamily: "inherit", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", ...styles[variant], ...sizes[size], ...s }}>
      {children}
    </button>
  );
};

// ─── MINI BAR CHART ──────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const maxLeads = Math.max(...data.map(d => d.leads));
  const maxDeals = Math.max(...data.map(d => d.deals));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 96 }}>
            <div style={{ flex: 1, background: COLORS.blue + "80", borderRadius: "3px 3px 0 0", height: `${(d.leads / maxLeads) * 100}%`, minHeight: 4 }} />
            <div style={{ flex: 1, background: COLORS.accent, borderRadius: "3px 3px 0 0", height: `${(d.deals / maxDeals) * 100}%`, minHeight: 4 }} />
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted }}>{d.month}</div>
        </div>
      ))}
    </div>
  );
};

// ─── PAGES ───────────────────────────────────────────────────────────────────
function Dashboard({ leads, deals, followups, setPage }) {
  const hotLeads = leads.filter(l => l.status === "Hot").length;
  const pending = followups.filter(f => f.status === "Pending").length;
  const closed = deals.filter(d => d.stage === "Closed").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Good Morning, Admin 👋</div>
        <div style={{ fontSize: 14, color: COLORS.textSec }}>Here's your pipeline overview for today — <span style={{ color: COLORS.accent }}>3 urgent actions</span> need attention.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14, marginBottom: 28 }}>
        <StatCard title="Total Leads" value={leads.length} sub="+4 this week" color={COLORS.blue} icon="👥" />
        <StatCard title="Hot Leads" value={hotLeads} sub="Needs attention now" color={COLORS.red} icon="🔥" />
        <StatCard title="Pending Follow-ups" value={pending} sub="Due today" color={COLORS.amber} icon="🔔" />
        <StatCard title="Closed Deals" value={closed} sub="This month" color={COLORS.green} icon="🤝" />
        <StatCard title="Conversion Rate" value="38%" sub="+3% vs last month" color={COLORS.purple} icon="📈" />
        <StatCard title="Active Agents" value="4" sub="All online" color={COLORS.accent} icon="⚡" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, marginBottom: 18 }}>
        {/* Recent leads */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>Recent Leads</div>
            <button onClick={() => setPage("leads")} style={{ fontSize: 12, color: COLORS.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.surface2 }}>
                  {["Lead", "Budget", "Score", "Status", "Next Action"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map(l => (
                  <tr key={l.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={l.name.split(" ").map(n => n[0]).join("").slice(0, 2)} size={30} />
                        <div>
                          <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 13 }}>{l.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{l.agent}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.text }}>{l.budget}</td>
                    <td style={{ padding: "12px 16px" }}><ScoreBar score={l.score} /></td>
                    <td style={{ padding: "12px 16px" }}><Badge label={l.status} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, background: COLORS.accentGlow, color: COLORS.accent, padding: "3px 9px", borderRadius: 6, fontWeight: 600 }}>{l.nextAction}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>Live Activity</div>
          </div>
          <div>
            {ACTIVITIES.map((a, i) => {
              const icons = { lead: "👤", deal: "✅", visit: "📍", call: "📞", doc: "📄" };
              const colors = { lead: COLORS.blue, deal: COLORS.green, visit: COLORS.amber, call: COLORS.purple, doc: COLORS.textSec };
              return (
                <div key={a.id} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: (colors[a.type] || COLORS.blue) + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icons[a.type]}</div>
                  <div>
                    <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.4 }}>{a.text}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{a.time} · {a.user}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly chart + Today's followups */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 6 }}>Monthly Overview</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.blue + "80" }} /><span style={{ fontSize: 11, color: COLORS.textSec }}>Leads</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.accent }} /><span style={{ fontSize: 11, color: COLORS.textSec }}>Deals</span></div>
          </div>
          <BarChart data={MONTHLY} />
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>Today's Follow-ups</div>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {followups.filter(f => f.due === "Today" && f.status === "Pending").map(f => (
              <div key={f.id} style={{ background: COLORS.surface2, borderRadius: 10, padding: "12px 14px", borderLeft: `3px solid ${COLORS.red}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{f.lead}</div>
                  <Badge label={f.priority} />
                </div>
                <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 10 }}>{f.action}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm" onClick={() => {}}>📞 Call</Btn>
                  <Btn size="sm" variant="secondary" onClick={() => {}}>Snooze</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsPage({ leads, setLeads }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", source: "Website", budget: "", score: 60, status: "Warm", agent: "Priya Sharma", nextAction: "Call Today", property: "" });

  const filtered = leads.filter(l => {
    const matchS = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchSt = statusFilter === "All" || l.status === statusFilter;
    return matchS && matchSt;
  });

  const add = () => {
    setLeads(prev => [...prev, { ...form, id: Date.now(), lastContact: "Just now" }]);
    setShowModal(false);
    setForm({ name: "", phone: "", email: "", source: "Website", budget: "", score: 60, status: "Warm", agent: "Priya Sharma", nextAction: "Call Today", property: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Leads</div>
          <div style={{ fontSize: 13, color: COLORS.textSec }}>{leads.length} total · {leads.filter(l => l.status === "Hot").length} hot</div>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Add Lead</Btn>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 18, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <input placeholder="🔍  Search leads…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 180, background: COLORS.surface2, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        {["All", "Hot", "Warm", "Cold"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${statusFilter === s ? COLORS.accent : COLORS.border2}`, background: statusFilter === s ? COLORS.accentGlow : "transparent", color: statusFilter === s ? COLORS.accent : COLORS.textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.surface2 }}>
                {["Lead", "Contact", "Source", "Budget", "Score", "Status", "Agent", "Next Action", "Last Contact"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={l.name.split(" ").map(n => n[0]).join("").slice(0, 2)} size={32} />
                      <div style={{ fontWeight: 600, color: COLORS.text }}>{l.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, color: COLORS.text }}>{l.phone}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{l.email}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: COLORS.textSec }}>{l.source}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.text }}>{l.budget}</td>
                  <td style={{ padding: "12px 16px" }}><ScoreBar score={l.score} /></td>
                  <td style={{ padding: "12px 16px" }}><Badge label={l.status} /></td>
                  <td style={{ padding: "12px 16px", color: COLORS.textSec, fontSize: 12 }}>{l.agent}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, background: COLORS.accentGlow, color: COLORS.accent, padding: "3px 9px", borderRadius: 6, fontWeight: 600, whiteSpace: "nowrap" }}>{l.nextAction}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: COLORS.textMuted, fontSize: 12 }}>{l.lastContact}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 48, color: COLORS.textMuted }}>No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Add New Lead" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Full Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rahul Kumar" />
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98xxx xxxxx" />
            <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            <Input label="Budget" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. ₹1.2 Cr" />
            <Input label="Property Interest" value={form.property} onChange={e => setForm(f => ({ ...f, property: e.target.value }))} placeholder="e.g. Skyline Heights" />
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.textSec, marginBottom: 5 }}>Lead Score: {form.score}</label>
              <input type="range" min={0} max={100} value={form.score} onChange={e => setForm(f => ({ ...f, score: Number(e.target.value) }))} style={{ width: "100%", accentColor: COLORS.accent }} />
            </div>
            <Select label="Source" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
              {["Website", "Referral", "Google Ads", "Facebook", "Walk-in", "Call"].map(s => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Hot", "Warm", "Cold"].map(s => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Assign Agent" value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))}>
              {AGENTS.map(a => <option key={a.id}>{a.name}</option>)}
            </Select>
            <Select label="Next Action" value={form.nextAction} onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))}>
              {["Call Today", "Send Options", "Schedule Visit", "Follow Up", "Move to Negotiation"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={add} style={{ opacity: !form.name ? 0.5 : 1 }}>Add Lead</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PropertiesPage() {
  const [props, setProps] = useState(PROPERTIES);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", location: "", price: "", type: "2 BHK", status: "Available", size: "", agent: "Priya Sharma" });

  const filtered = filterStatus === "All" ? props : props.filter(p => p.status === filterStatus);

  const add = () => {
    setProps(prev => [...prev, { ...form, id: Date.now(), amenities: [], leads: 0 }]);
    setShowModal(false);
  };

  const statusColor = { Available: COLORS.green, Limited: COLORS.amber, "Sold Out": COLORS.textMuted };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Properties</div>
          <div style={{ fontSize: 13, color: COLORS.textSec }}>{props.length} active listings</div>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ Add Property</Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Available", "Limited", "Sold Out"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${filterStatus === s ? COLORS.accent : COLORS.border2}`, background: filterStatus === s ? COLORS.accentGlow : "transparent", color: filterStatus === s ? COLORS.accent : COLORS.textSec, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.border2}
            onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
            <div style={{ height: 150, background: `linear-gradient(135deg, #1e2035 0%, #252840 50%, #1a1d2e 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 40, opacity: 0.15 }}>🏢</div>
              <div style={{ position: "absolute", top: 12, right: 12 }}><Badge label={p.status} /></div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 16px 12px", background: "linear-gradient(to top, rgba(15,17,23,0.9), transparent)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: COLORS.text }}>{p.title}</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 10 }}>📍 {p.location}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Price</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{p.price}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Type</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{p.type}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {p.amenities.slice(0, 4).map(a => (
                  <span key={a} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: COLORS.textSec, border: `1px solid ${COLORS.border}` }}>{a}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: COLORS.textSec }}>👥 {p.leads} linked lead{p.leads !== 1 ? "s" : ""}</div>
                <Btn size="sm">View Details</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Add New Property" onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}><Input label="Property Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Skyline Heights" /></div>
            <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Area, City" />
            <Input label="Price Range" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="₹xx L – ₹xx Cr" />
            <Input label="Size" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} placeholder="e.g. 1200 sq ft" />
            <Select label="Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "2/3 BHK", "3/4 BHK", "Penthouse"].map(t => <option key={t}>{t}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Available", "Limited", "Sold Out"].map(s => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Assigned Agent" value={form.agent} onChange={e => setForm(f => ({ ...f, agent: e.target.value }))}>
              {AGENTS.map(a => <option key={a.id}>{a.name}</option>)}
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={add}>Add Property</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function DealsPage({ deals, setDeals }) {
  const moveStage = (id, dir) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = STAGES.indexOf(d.stage);
      return { ...d, stage: STAGES[Math.max(0, Math.min(STAGES.length - 1, idx + dir))] };
    }));
  };

  const stageColor = { Qualification: COLORS.textSec, Proposal: COLORS.blue, "Site Visit": COLORS.amber, Negotiation: COLORS.purple, Closed: COLORS.green };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Deal Pipeline</div>
        <div style={{ fontSize: 13, color: COLORS.textSec }}>{deals.length} active deals · ₹{deals.reduce((s, d) => s + parseFloat(d.value.replace(/[₹, Cr L]/g, "")) * (d.value.includes("Cr") ? 1 : 0.1), 0).toFixed(1)} Cr total value</div>
      </div>

      {/* Kanban */}
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 12, marginBottom: 28 }}>
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const color = stageColor[stage] || COLORS.textSec;
          return (
            <div key={stage} style={{ minWidth: 220, flex: "0 0 220px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 2px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color }}>{stage}</div>
                <span style={{ background: color + "22", color, borderRadius: 12, fontSize: 11, fontWeight: 700, padding: "2px 8px" }}>{stageDeals.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {stageDeals.map(deal => (
                  <div key={deal.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px", borderTop: `2px solid ${color}` }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text, marginBottom: 2 }}>{deal.client}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 10 }}>{deal.property}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text, marginBottom: 2 }}>{deal.value}</div>
                    <div style={{ fontSize: 11, color: COLORS.green, marginBottom: 6 }}>Comm: {deal.commission}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 12 }}>👤 {deal.agent}</div>
                    {stage !== "Closed" && (
                      <div style={{ display: "flex", gap: 5 }}>
                        {STAGES.indexOf(stage) > 0 && <Btn size="sm" variant="secondary" onClick={() => moveStage(deal.id, -1)}>← Back</Btn>}
                        <Btn size="sm" onClick={() => moveStage(deal.id, 1)}>{STAGES.indexOf(stage) === STAGES.length - 2 ? "✓ Close" : "Advance →"}</Btn>
                      </div>
                    )}
                    {stage === "Closed" && <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.green }}>✓ Deal Closed</span>}
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div style={{ textAlign: "center", color: COLORS.textMuted, fontSize: 12, padding: 24, border: `2px dashed ${COLORS.border}`, borderRadius: 10 }}>Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deals table */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700, fontSize: 14, color: COLORS.text }}>All Deals</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.surface2 }}>
                {["Client", "Property", "Stage", "Deal Value", "Commission", "Agent", "Days"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map(d => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: COLORS.text }}>{d.client}</td>
                  <td style={{ padding: "12px 16px", color: COLORS.textSec }}>{d.property}</td>
                  <td style={{ padding: "12px 16px" }}><Badge label={d.stage} /></td>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: COLORS.text }}>{d.value}</td>
                  <td style={{ padding: "12px 16px", color: COLORS.green, fontWeight: 700 }}>{d.commission}</td>
                  <td style={{ padding: "12px 16px", color: COLORS.textSec, fontSize: 12 }}>{d.agent}</td>
                  <td style={{ padding: "12px 16px", color: COLORS.textMuted, fontSize: 12 }}>{d.days}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FollowupsPage({ followups, setFollowups }) {
  const [filter, setFilter] = useState("All");
  const markDone = id => setFollowups(prev => prev.map(f => f.id === id ? { ...f, status: "Done" } : f));
  const filtered = filter === "All" ? followups : followups.filter(f => f.status === filter || f.priority === filter);
  const typeIcon = { Call: "📞", Email: "📧", Visit: "📍", Meeting: "👥" };
  const priorityBorder = { High: COLORS.red, Medium: COLORS.amber, Low: COLORS.blue };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Follow-ups</div>
          <div style={{ fontSize: 13, color: COLORS.textSec }}>{followups.filter(f => f.status === "Pending").length} pending reminders</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Pending", "Done", "High", "Medium", "Low"].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${filter === t ? COLORS.accent : COLORS.border2}`, background: filter === t ? COLORS.accentGlow : "transparent", color: filter === t ? COLORS.accent : COLORS.textSec, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(f => (
          <div key={f.id} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", opacity: f.status === "Done" ? 0.6 : 1, borderLeft: `3px solid ${priorityBorder[f.priority]}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 18 }}>{typeIcon[f.type] || "📋"}</span>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{f.lead}</div>
                  <Badge label={f.priority} />
                  <Badge label={f.status} />
                </div>
                <div style={{ fontSize: 13, color: COLORS.textSec, marginBottom: 6 }}>{f.action}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>⏰ Due: <span style={{ color: f.due === "Today" ? COLORS.red : COLORS.textSec, fontWeight: 600 }}>{f.due}</span> · 👤 {f.agent}</div>
              </div>
              {f.status === "Pending" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  <Btn size="sm">📞 Call</Btn>
                  <Btn size="sm" variant="secondary">Reschedule</Btn>
                  <Btn size="sm" variant="success" onClick={() => markDone(f.id)}>✓ Done</Btn>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", color: COLORS.textMuted, padding: 48 }}>No follow-ups in this category.</div>}
      </div>
    </div>
  );
}

function AgentsPage() {
  const [selected, setSelected] = useState(null);
  const medals = ["🥇", "🥈", "🥉"];
  const sorted = [...AGENTS].sort((a, b) => b.deals - a.deals);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Agent Performance</div>
        <div style={{ fontSize: 13, color: COLORS.textSec }}>Ranked by closed deals</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 28 }}>
        {sorted.map((agent, i) => (
          <div key={agent.id} onClick={() => setSelected(agent)}
            style={{ background: COLORS.surface, border: `1px solid ${i === 0 ? COLORS.gold + "66" : COLORS.border}`, borderRadius: 16, padding: "20px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = i === 0 ? COLORS.gold + "66" : COLORS.border}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ position: "relative" }}>
                <Avatar initials={agent.avatar} size={48} color={i === 0 ? COLORS.gold : i === 1 ? "#aaa" : i === 2 ? "#c96" : COLORS.accent} />
                {i < 3 && <span style={{ position: "absolute", top: -8, right: -8, fontSize: 18 }}>{medals[i]}</span>}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>{agent.name}</div>
                <Badge label={agent.role} size="sm" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {[["Leads", agent.leads, COLORS.blue], ["Deals", agent.deals, COLORS.accent], ["Conv.", agent.conversion + "%", COLORS.green]].map(([l, v, c]) => (
                <div key={l} style={{ background: COLORS.surface2, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
              <span>Conversion Rate</span><span style={{ fontWeight: 700, color: COLORS.text }}>{agent.conversion}%</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: `${agent.conversion}%`, background: agent.conversion >= 40 ? COLORS.green : COLORS.accent, borderRadius: 3 }} />
            </div>
            <div style={{ background: COLORS.greenLight, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: COLORS.green, fontWeight: 600 }}>Total Commission</span>
              <span style={{ fontWeight: 800, color: COLORS.green }}>{agent.commission}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <Modal title="Agent Profile" onClose={() => setSelected(null)} width={480}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar initials={selected.avatar} size={72} color={COLORS.accent} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.text, marginTop: 12 }}>{selected.name}</div>
            <div style={{ marginTop: 6 }}><Badge label={selected.role} size="lg" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[["📧 Email", selected.email], ["📞 Phone", selected.phone], ["🏙 City", selected.city], ["📅 Joined", selected.joined], ["💼 Leads", selected.leads], ["🤝 Deals", selected.deals], ["📈 Conversion", selected.conversion + "%"], ["💰 Commission", selected.commission]].map(([k, v]) => (
              <div key={k} style={{ background: COLORS.surface2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Btn>Assign Lead</Btn>
            <Btn variant="secondary">View Deals</Btn>
            <Btn variant={selected.active ? "danger" : "success"} onClick={() => {}}>
              {selected.active ? "Deactivate" : "Activate"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AnalyticsPage() {
  const totalLeads = LEADS_DATA.length;
  const hotLeads = LEADS_DATA.filter(l => l.status === "Hot").length;
  const closedDeals = DEALS_DATA.filter(d => d.stage === "Closed").length;
  const convRate = ((closedDeals / totalLeads) * 100).toFixed(1);

  const sourceData = [
    { name: "Website", count: 3, color: COLORS.blue },
    { name: "Referral", count: 2, color: COLORS.green },
    { name: "Google Ads", count: 2, color: COLORS.amber },
    { name: "Facebook", count: 1, color: COLORS.purple },
  ];
  const totalSource = sourceData.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Analytics</div>
        <div style={{ fontSize: 13, color: COLORS.textSec }}>6-month performance overview</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard title="Total Leads" value={totalLeads} sub="All time" color={COLORS.blue} icon="👥" />
        <StatCard title="Hot Leads" value={hotLeads} sub="Score ≥ 80" color={COLORS.red} icon="🔥" />
        <StatCard title="Closed Deals" value={closedDeals} sub="This quarter" color={COLORS.green} icon="✅" />
        <StatCard title="Conversion" value={convRate + "%"} sub="Leads → Deals" color={COLORS.purple} icon="📈" />
        <StatCard title="Total Revenue" value="₹8.3 Cr" sub="Closed deals" color={COLORS.accent} icon="💰" />
        <StatCard title="Commission" value="₹16.6 L" sub="All agents" color={COLORS.gold} icon="🏆" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 6 }}>Leads vs Deals (6 Months)</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.blue + "80" }} /><span style={{ fontSize: 11, color: COLORS.textSec }}>Leads</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS.accent }} /><span style={{ fontSize: 11, color: COLORS.textSec }}>Deals</span></div>
          </div>
          <BarChart data={MONTHLY} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, padding: "0 4px" }}>
            {MONTHLY.map(d => <div key={d.month} style={{ flex: 1, textAlign: "center", fontSize: 10, color: COLORS.textMuted }}>{d.leads}/{d.deals}</div>)}
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 18 }}>Lead Source Breakdown</div>
          {sourceData.map(s => (
            <div key={s.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontSize: 12, color: COLORS.textSec }}>{s.count} leads ({((s.count / totalSource) * 100).toFixed(0)}%)</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(s.count / totalSource) * 100}%`, background: s.color, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700, fontSize: 14, color: COLORS.text }}>Agent Performance Summary</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: COLORS.surface2 }}>
                {["Rank", "Agent", "Leads", "Deals Closed", "Conversion", "Commission"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...AGENTS].sort((a, b) => b.deals - a.deals).map((a, i) => (
                <tr key={a.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "12px 16px", fontSize: 18 }}>{"🥇🥈🥉"[i] || `#${i + 1}`}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={a.avatar} size={30} />
                      <span style={{ fontWeight: 600, color: COLORS.text }}>{a.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: COLORS.textSec }}>{a.leads}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.green }}>{a.deals}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: a.conversion >= 40 ? COLORS.greenLight : COLORS.amberLight, color: a.conversion >= 40 ? COLORS.green : COLORS.amber }}>{a.conversion}%</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.gold }}>{a.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminProfile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [tab, setTab] = useState("profile");
  const [pwForm, setPwForm] = useState({ current: "", newpw: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState("");
  const [notifs, setNotifs] = useState({ emailAlerts: true, leadAssign: true, dealClose: true, followupReminder: true, weeklyReport: false, systemUpdates: true });

  const save = () => { setUser(form); setEditing(false); };

  const changePw = () => {
    if (pwForm.newpw !== pwForm.confirm) { setPwMsg("Passwords do not match."); return; }
    if (pwForm.newpw.length < 6) { setPwMsg("Password must be at least 6 characters."); return; }
    setPwMsg("✅ Password updated successfully!");
    setPwForm({ current: "", newpw: "", confirm: "" });
    setTimeout(() => setPwMsg(""), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.text }}>Admin Profile</div>
        <div style={{ fontSize: 13, color: COLORS.textSec }}>Manage your account settings and preferences</div>
      </div>

      {/* Profile hero */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: "32px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.gold})` }} />
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}44, ${COLORS.gold}44)`, border: `3px solid ${COLORS.accent}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: COLORS.accent }}>
              {user.avatar}
            </div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: COLORS.green, border: `2px solid ${COLORS.surface}` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{user.name}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge label="Admin" size="lg" />
              <Badge label="Super Admin" size="lg" />
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: COLORS.textSec }}>📧 {user.email}</span>
              <span style={{ fontSize: 13, color: COLORS.textSec }}>📞 {user.phone}</span>
              <span style={{ fontSize: 13, color: COLORS.textSec }}>🏙 {user.city}</span>
              <span style={{ fontSize: 13, color: COLORS.textSec }}>📅 Member since {user.joined}</span>
            </div>
          </div>
          <Btn onClick={() => setEditing(true)}>✏️ Edit Profile</Btn>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[["Total Agents", "4", COLORS.blue, "👥"], ["Total Leads", LEADS_DATA.length, COLORS.amber, "🎯"], ["Deals Closed", DEALS_DATA.filter(d => d.stage === "Closed").length, COLORS.green, "✅"], ["Revenue", "₹8.3 Cr", COLORS.accent, "💰"], ["Access Level", "Full", COLORS.gold, "🔑"]].map(([label, val, color, icon]) => (
          <div key={label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: COLORS.surface2, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
        {["profile", "security", "notifications", "permissions"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, textTransform: "capitalize", transition: "all 0.15s", background: tab === t ? COLORS.surface : "transparent", color: tab === t ? COLORS.text : COLORS.textSec }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 20 }}>Personal Information</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Full Name", user.name], ["Email Address", user.email], ["Phone Number", user.phone], ["City", user.city], ["Role", user.role], ["Account Status", "Active"]].map(([k, v]) => (
              <div key={k} style={{ background: COLORS.surface2, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "security" && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, maxWidth: 480 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 20 }}>Change Password</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Current Password" type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" />
            <Input label="New Password" type="password" value={pwForm.newpw} onChange={e => setPwForm(f => ({ ...f, newpw: e.target.value }))} placeholder="Min 6 characters" />
            <Input label="Confirm New Password" type="password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" />
            {pwMsg && <div style={{ fontSize: 13, color: pwMsg.startsWith("✅") ? COLORS.green : COLORS.red, fontWeight: 600 }}>{pwMsg}</div>}
            <Btn onClick={changePw}>Update Password</Btn>
          </div>
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 12 }}>Two-Factor Authentication</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface2, borderRadius: 10, padding: "14px 16px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Authenticator App</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>Add an extra layer of security</div>
              </div>
              <Btn variant="secondary" size="sm">Enable</Btn>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24, maxWidth: 540 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 20 }}>Notification Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(notifs).map(([key, val]) => {
              const labels = { emailAlerts: "Email Alerts", leadAssign: "Lead Assignment", dealClose: "Deal Closure", followupReminder: "Follow-up Reminders", weeklyReport: "Weekly Report", systemUpdates: "System Updates" };
              const descs = { emailAlerts: "Receive important alerts via email", leadAssign: "When a lead is assigned to you", dealClose: "When a deal is closed", followupReminder: "Reminder for upcoming follow-ups", weeklyReport: "Weekly performance summary", systemUpdates: "CRM updates and maintenance" };
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface2, borderRadius: 10, padding: "14px 16px" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{labels[key]}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{descs[key]}</div>
                  </div>
                  <div onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                    style={{ width: 44, height: 24, borderRadius: 12, background: val ? COLORS.green : "rgba(255,255,255,0.1)", cursor: "pointer", transition: "background 0.2s", position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: val ? 23 : 3, transition: "left 0.2s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "permissions" && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 20 }}>Admin Permissions</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {[
              ["🔑", "Full System Access", "Unrestricted access to all modules", true],
              ["👥", "User Management", "Create, edit and deactivate users", true],
              ["📊", "Analytics Access", "View all reports and analytics", true],
              ["💰", "Financial Data", "View commissions and revenue", true],
              ["🗑", "Delete Records", "Permanently delete any record", true],
              ["⚙️", "System Settings", "Configure CRM settings", true],
              ["📤", "Export Data", "Export leads, deals and reports", true],
              ["🔔", "Push Notifications", "Send system-wide notifications", true],
            ].map(([icon, title, desc, granted]) => (
              <div key={title} style={{ background: COLORS.surface2, borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8 }}>{desc}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: granted ? COLORS.greenLight : COLORS.redLight, color: granted ? COLORS.green : COLORS.red }}>{granted ? "✓ Granted" : "✗ Denied"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <Modal title="Edit Profile" onClose={() => setEditing(false)} width={500}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
            <Btn variant="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Changes</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("admin@propcrm.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const VALID = [
    { email: "admin@propcrm.com", password: "admin123", role: "Admin", name: "Admin Manager" },
    { email: "priya@propcrm.com", password: "agent123", role: "Agent", name: "Priya Sharma" },
    { email: "anika@propcrm.com", password: "agent123", role: "Manager", name: "Anika Patel" },
  ];

  const login = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const user = VALID.find(u => u.email === email && u.password === password);
      if (user) onLogin(user);
      else { setError("Invalid email or password. Try admin@propcrm.com / admin123"); setLoading(false); }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: COLORS.accentGlow, border: `2px solid ${COLORS.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>🏡</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.02em" }}>PropCRM</div>
          <div style={{ fontSize: 14, color: COLORS.textSec, marginTop: 4 }}>Smart Real Estate Platform</div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.text, marginBottom: 4 }}>Welcome back</div>
          <div style={{ fontSize: 13, color: COLORS.textSec, marginBottom: 24 }}>Sign in to your account</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@propcrm.com" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            {error && <div style={{ fontSize: 12, color: COLORS.red, background: COLORS.redLight, padding: "10px 12px", borderRadius: 8 }}>{error}</div>}

            <button onClick={login} disabled={loading}
              style={{ width: "100%", padding: "12px", background: loading ? COLORS.accentDark : COLORS.accent, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </div>

          <div style={{ marginTop: 24, padding: 14, background: COLORS.surface2, borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textSec, marginBottom: 8 }}>TEST ACCOUNTS</div>
            {[["Admin", "admin@propcrm.com", "admin123"], ["Manager", "anika@propcrm.com", "agent123"], ["Agent", "priya@propcrm.com", "agent123"]].map(([role, e, p]) => (
              <div key={role} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>
                <span style={{ color: COLORS.accent, fontWeight: 600 }}>{role}</span>
                <span>{e} / {p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "leads", label: "Leads", icon: "👥" },
  { id: "properties", label: "Properties", icon: "🏢" },
  { id: "deals", label: "Deals", icon: "🤝" },
  { id: "followups", label: "Follow-ups", icon: "🔔" },
  { id: "agents", label: "Agents", icon: "⭐" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

function Sidebar({ active, onNavigate, user, onLogout, collapsed, setCollapsed }) {
  return (
    <aside style={{ position: "fixed", top: 0, left: 0, width: collapsed ? 64 : 230, height: "100vh", background: "#0c0e16", borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", zIndex: 100, transition: "width 0.25s ease", overflow: "hidden" }}>
      <div style={{ padding: collapsed ? "18px 12px" : "18px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, flexShrink: 0 }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.text, lineHeight: 1.1 }}>PropCRM</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: "0.12em", marginTop: 2 }}>REAL ESTATE</div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)}
          style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, cursor: "pointer", color: COLORS.textSec, fontSize: 14, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px 10px", overflowY: "auto" }}>
        {!collapsed && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: COLORS.textMuted, padding: "6px 10px 8px", textTransform: "uppercase" }}>Navigation</div>}
        {NAV.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 12px" : "9px 12px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 9, border: "none", cursor: "pointer", background: isActive ? COLORS.accentGlow : "transparent", color: isActive ? COLORS.accent : COLORS.textSec, fontSize: 13, fontFamily: "inherit", fontWeight: isActive ? 700 : 400, marginBottom: 2, transition: "all 0.15s", borderLeft: `2px solid ${isActive ? COLORS.accent : "transparent"}` }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? "12px 8px" : "12px 14px", borderTop: `1px solid ${COLORS.border}`, flexShrink: 0 }}>
        {!collapsed ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials={user.avatar || user.name.split(" ").map(n => n[0]).join("").slice(0, 2)} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{user.role}</div>
            </div>
            <button onClick={onLogout} title="Logout" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 16, padding: 4 }}>⏻</button>
          </div>
        ) : (
          <button onClick={onLogout} title="Logout" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 18, padding: "6px 0", display: "flex", justifyContent: "center" }}>⏻</button>
        )}
      </div>
    </aside>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ page, user, onProfileClick, sidebarW }) {
  const labels = { dashboard: "Dashboard", leads: "Leads", properties: "Properties", deals: "Deals Pipeline", followups: "Follow-ups", agents: "Agent Performance", analytics: "Analytics", profile: "My Profile" };
  const [notifOpen, setNotifOpen] = useState(false);
  const notifs = [
    { text: "New hot lead: Suresh Iyer", time: "2m ago", read: false },
    { text: "Deal closed: Deepak Verma ₹3.1 Cr", time: "1h ago", read: false },
    { text: "Follow-up due: Arjun Kapoor", time: "3h ago", read: true },
  ];
  const unread = notifs.filter(n => !n.read).length;

  return (
    <header style={{ position: "sticky", top: 0, height: 64, background: COLORS.surface + "ee", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 16, zIndex: 50, backdropFilter: "blur(12px)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.text }}>{labels[page] || "PropCRM"}</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted }}>Real Estate CRM Platform</div>
      </div>

      <div style={{ position: "relative" }}>
        <input placeholder="🔍  Search…" style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border2}`, borderRadius: 8, padding: "7px 14px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none", width: 200 }} />
      </div>

      <div style={{ position: "relative" }}>
        <button onClick={() => setNotifOpen(o => !o)}
          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${COLORS.border}`, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, position: "relative" }}>
          🔔
          {unread > 0 && <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: COLORS.red, border: `1.5px solid ${COLORS.surface}` }} />}
        </button>
        {notifOpen && (
          <div style={{ position: "absolute", top: 46, right: 0, width: 300, background: COLORS.surface, border: `1px solid ${COLORS.border2}`, borderRadius: 14, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", zIndex: 200, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700, fontSize: 14, color: COLORS.text }}>Notifications <span style={{ fontSize: 11, color: COLORS.red, fontWeight: 600 }}>{unread} new</span></div>
            {notifs.map((n, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < notifs.length - 1 ? `1px solid ${COLORS.border}` : "none", background: n.read ? "transparent" : COLORS.accentGlow }}>
                <div style={{ fontSize: 13, color: COLORS.text }}>{n.text}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
            <div style={{ padding: "10px 16px", textAlign: "center" }}>
              <button onClick={() => setNotifOpen(false)} style={{ fontSize: 12, color: COLORS.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Mark all read</button>
            </div>
          </div>
        )}
      </div>

      <button onClick={onProfileClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <Avatar initials={user.avatar || user.name.split(" ").map(n => n[0]).join("").slice(0, 2)} size={38} color={COLORS.accent} />
      </button>
    </header>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [leads, setLeads] = useState(LEADS_DATA);
  const [deals, setDeals] = useState(DEALS_DATA);
  const [followups, setFollowups] = useState(FOLLOWUPS);

  const sidebarW = collapsed ? 64 : 230;

  const handleLogin = (u) => {
    setUser({ ...u, avatar: u.name.split(" ").map(n => n[0]).join("").slice(0, 2), phone: "+91 9800000001", city: "Mumbai", joined: "January 2021", role: u.role });
    setAuthed(true);
    setPage("dashboard");
  };

  const handleLogout = () => { setAuthed(false); setUser(null); setPage("dashboard"); };

  if (!authed) return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { background: ${COLORS.bg}; }`}</style>
      <AuthScreen onLogin={handleLogin} />
    </div>
  );

  const pages = { dashboard: <Dashboard leads={leads} deals={deals} followups={followups} setPage={setPage} />, leads: <LeadsPage leads={leads} setLeads={setLeads} />, properties: <PropertiesPage />, deals: <DealsPage deals={deals} setDeals={setDeals} />, followups: <FollowupsPage followups={followups} setFollowups={setFollowups} />, agents: <AgentsPage />, analytics: <AnalyticsPage />, profile: <AdminProfile user={user} setUser={u => setUser(prev => ({ ...prev, ...u }))} /> };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: COLORS.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 5px; height: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; } ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); } select option { background: #22263a; }`}</style>
      <Sidebar active={page} onNavigate={setPage} user={user} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ marginLeft: sidebarW, transition: "margin-left 0.25s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header page={page} user={user} onProfileClick={() => setPage("profile")} sidebarW={sidebarW} />
        <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1400 }}>
          {pages[page]}
        </main>
      </div>
    </div>
  );
}