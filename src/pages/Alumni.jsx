import { useState } from "react";

const Alumni = () => {
  const [activeFilter, setActiveFilter] = useState("All Alumni");

  const featured = [
    { name: "Priya Sharma", role: "Senior Architect @ Google", batch: "Class of 2019 • CSE", desc: "Open for Career Advice and Resume Reviews.", tags: ["Mentorship", "AI Expert"], img: "Priya" },
    { name: "Arjun Mehta", role: "VP Engineering @ FinTech", batch: "Class of 2012 • ECE", desc: "Actively providing Job Referrals in Fintech.", tags: ["Job Referrals", "Founder"], img: "Arjun" },
    { name: "Sara Khan", role: "UX Director @ Meta", batch: "Class of 2018 • IT", desc: "Offering Portfolio Reviews and Career Guidance.", tags: ["Design", "Mentorship"], img: "Sara" },
  ];

  const alumniList = [
    { name: "Rahul Varma", role: "Software Engineer at Microsoft", batch: "Class of 2021", desc: "Helping juniors with DSA prep and mock interviews.", tags: ["Python", "Azure", "Algorithms"], status: "ONLINE", statusColor: "#22c55e", img: "Rahul" },
    { name: "Anita Desai", role: "Product Manager at Adobe", batch: "Class of 2017", desc: "Reach out for transition tips from Dev to PM roles.", tags: ["Product Strategy", "Agile"], status: "LAST SEEN 5H AGO", statusColor: "#94a3b8", img: "Anita" },
    { name: "Vikram Singh", role: "Data Scientist at Uber", batch: "Class of 2019", desc: "Happy to discuss ML research and industrial applications.", tags: ["FinTech", "MLOps"], status: "OFFLINE", statusColor: "#94a3b8", img: "Vikram" },
  ];

  const filters = ["All Alumni", "Mentorship", "Job Referrals", "Career Advice"];
  const messages = [
    { name: "Ishani Raj", msg: "I've shared the referral li...", time: "17h" },
    { name: "Kunal Bose", msg: "Thanks for the update", time: "1d" },
    { name: "Megha Singh", msg: "Looking forward to our...", time: "Yesterday" },
  ];

  const tagColor = (tag) => {
    const map = { "Mentorship": "#eff6ff", "AI Expert": "#f0fdf4", "Job Referrals": "#fefce8", "Founder": "#fdf4ff", "Design": "#fff7ed", "Python": "#eff6ff", "Azure": "#f0f9ff", "Algorithms": "#f5f3ff", "Product Strategy": "#eff6ff", "Agile": "#f0fdf4", "FinTech": "#fefce8", "MLOps": "#fdf4ff" };
    return map[tag] || "#f1f5f9";
  };
  const tagText = (tag) => {
    const map = { "Mentorship": "#3b82f6", "AI Expert": "#22c55e", "Job Referrals": "#ca8a04", "Founder": "#a855f7", "Design": "#f97316", "Python": "#3b82f6", "Azure": "#0ea5e9", "Algorithms": "#8b5cf6", "Product Strategy": "#3b82f6", "Agile": "#22c55e", "FinTech": "#ca8a04", "MLOps": "#a855f7" };
    return map[tag] || "#64748b";
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a202c", minHeight: "100vh", backgroundColor: "#f7f8fc" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24 }}>
        {/* Main */}
        <div>
          {/* Featured Alumni */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700 }}>Featured Alumni</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Top contributors and mentors this month</p>
              </div>
              <a href="#" style={{ fontSize: 13, color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>View Hall of Fame →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {featured.map((a) => (
                <div key={a.name} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ height: 100, background: `linear-gradient(135deg, #667eea20, #764ba220)`, position: "relative" }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.img}`} alt={a.name} style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid #fff", position: "absolute", bottom: -20, left: 16, background: "#e8f0ff" }} />
                  </div>
                  <div style={{ padding: "28px 16px 16px" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500, marginBottom: 2 }}>{a.role}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>{a.batch}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{a.desc}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {a.tags.map(tag => (
                        <span key={tag} style={{ background: tagColor(tag), color: tagText(tag), fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{ border: "none", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeFilter === f ? "#1a202c" : "#fff", color: activeFilter === f ? "#fff" : "#64748b", boxShadow: activeFilter === f ? "none" : "0 1px 3px rgba(0,0,0,0.08)" }}>
                {f}
              </button>
            ))}
            <button style={{ marginLeft: "auto", background: "#fff", border: "none", borderRadius: 8, padding: "7px 10px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>

          {/* Alumni List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {alumniList.map((a) => (
              <div key={a.name} style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.img}`} alt={a.name} style={{ width: 52, height: 52, borderRadius: "50%", background: "#e8f0ff", border: "2px solid #f1f5f9" }} />
                  <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, background: a.status === "ONLINE" ? "#22c55e" : "#e2e8f0", borderRadius: "50%", border: "2px solid #fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{a.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: a.statusColor, textTransform: "uppercase", letterSpacing: 0.5 }}>{a.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 500, marginBottom: 2 }}>{a.role} • {a.batch}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{a.desc}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {a.tags.map(tag => (
                      <span key={tag} style={{ background: tagColor(tag), color: tagText(tag), fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#475569" }}>Chat</button>
                  <button style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#fff" }}>Connect</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Recent Messages */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Recent Messages</h4>
              <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 7px" }}>2 New</span>
            </div>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt={m.name} style={{ width: 36, height: 36, borderRadius: "50%", background: "#e8f0ff" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.msg}</div>
                </div>
                <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>{m.time}</span>
              </div>
            ))}
            <button style={{ width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#475569" }}>Open Messenger</button>
          </div>

          {/* Upcoming Webinar */}
          <div style={{ background: "#1e3a5f", borderRadius: 16, padding: 20, color: "#fff" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#93c5fd", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Upcoming Webinar</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>Transitioning to Ivy League Masters: Tips from SRM Alumni</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#93c5fd", marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Sept 28 • 6:00 PM
            </div>
            <button style={{ background: "#3b82f6", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#fff" }}>Remind Me</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
