import { useState } from "react";
import Layout from "./Layout";
import { Edit3, MapPin, Link, Calendar } from "lucide-react";

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: 42, height: 24, borderRadius: 12, cursor: "pointer",
      background: checked ? "#0ea5b0" : "#cbd5e1",
      position: "relative", transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      position: "absolute", top: 3, left: checked ? 21 : 3,
      transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }} />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account Settings");
  const [prefs, setPrefs] = useState({
    privateProfile: false,
    pushNotifications: true,
    showOnlineStatus: true,
  });

  const tabs = ["Account Settings", "Activity", "Saved Items"];
  const skills = ["TypeScript", "Tailwind CSS", "UI Design", "React", "Public Speaking"];

  return (
    <Layout searchPlaceholder="Search communities...">
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Banner */}
        <div style={{ height: 160, background: "linear-gradient(135deg, #0ea5b0 0%, #0c7a84 40%, #1e293b 100%)", position: "relative" }} />

        <div style={{ padding: "0 32px 32px", maxWidth: 900 }}>
          {/* Profile row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, marginTop: -32 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid #fff", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", flexShrink: 0 }}>
                <div style={{ fontSize: 28 }}>👤</div>
              </div>
              <div style={{ paddingBottom: 8 }}>
                <h2 style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 700, color: "#1e293b" }}>Alex Rivera</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Computer Science Major • Class of 2025</p>
              </div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#0ea5b0", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>

          {/* Two column */}
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
            {/* Left – About */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e8ecf0" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>About</h3>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                  Passionate about UX/UI design and full-stack development. Building SRM Connect to bring the student community closer together. ☕ Coffee and code.
                </p>
                {[
                  { icon: <MapPin size={13} />, text: "San Francisco, CA" },
                  { icon: <Link size={13} />, text: "arivera.dev" },
                  { icon: <Calendar size={13} />, text: "Joined Sept 2021" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12, color: "#64748b" }}>
                    {icon} {text}
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e8ecf0" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#1e293b" }}>Skills & Interests</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((s) => (
                    <span key={s} style={{ background: "#f0fdfe", color: "#0ea5b0", border: "1px solid #b2eff3", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Settings panel */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", overflow: "hidden" }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #e8ecf0" }}>
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer",
                    fontSize: 13, fontWeight: 600,
                    color: activeTab === tab ? "#0ea5b0" : "#64748b",
                    borderBottom: activeTab === tab ? "2px solid #0ea5b0" : "2px solid transparent",
                    marginBottom: -1,
                  }}>{tab}</button>
                ))}
              </div>

              <div style={{ padding: 24 }}>
                {activeTab === "Account Settings" && (
                  <>
                    <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Preferences</h3>
                    <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94a3b8" }}>Manage your account security and notification settings.</p>

                    {[
                      {
                        key: "privateProfile",
                        icon: "🔒",
                        title: "Private Profile",
                        desc: "Only approved students can see your full activity.",
                        type: "toggle",
                      },
                      {
                        key: "twoFactor",
                        icon: "🔑",
                        title: "Two-Factor Authentication",
                        desc: "Add an extra layer of security to your SRM account.",
                        type: "link",
                        linkText: "Enable",
                      },
                      {
                        key: "pushNotifications",
                        icon: "🔔",
                        title: "Push Notifications",
                        desc: "Get alerted about event reminders and direct messages.",
                        type: "toggle",
                      },
                      {
                        key: "showOnlineStatus",
                        icon: "👁️",
                        title: "Show Online Status",
                        desc: "Show others when you are active on the platform.",
                        type: "toggle",
                      },
                    ].map(({ key, icon, title, desc, type, linkText }) => (
                      <div key={key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{title}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{desc}</div>
                        </div>
                        {type === "toggle" && (
                          <Toggle checked={prefs[key] || false} onChange={(val) => setPrefs((p) => ({ ...p, [key]: val }))} />
                        )}
                        {type === "link" && (
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#0ea5b0", cursor: "pointer" }}>{linkText}</span>
                        )}
                      </div>
                    ))}

                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                      <button style={{ padding: "9px 20px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Discard</button>
                      <button style={{ padding: "9px 20px", border: "none", borderRadius: 8, background: "#0ea5b0", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
                    </div>
                  </>
                )}
                {activeTab !== "Account Settings" && (
                  <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No content yet for {activeTab}.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
