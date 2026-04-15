import { useState } from "react";
import Layout from "./Layout";
import { SlidersHorizontal, Check } from "lucide-react";

const notificationsData = [
  {
    id: 1,
    avatar: "SW",
    avatarColor: "#e11d48",
    type: "like",
    typeIcon: "👍",
    content: (<><strong>Sarah Williams</strong> liked your post in <a href="#" style={{ color: "#0ea5b0", textDecoration: "none", fontWeight: 600 }}>Computer Science 101</a></>),
    quote: '"Great summary of the Big O notation concepts! This really helped..."',
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    avatar: "AC",
    avatarColor: "#0ea5e9",
    type: "message",
    typeIcon: "💬",
    content: (<><strong>Alex Chen</strong> sent you a direct message</>),
    time: "15 minutes ago",
    unread: true,
  },
  {
    id: 3,
    avatar: "PS",
    avatarColor: "#f59e0b",
    type: "comment",
    typeIcon: "💬",
    content: (<><strong>Priya Sharma</strong> commented on your event: <a href="#" style={{ color: "#0ea5b0", textDecoration: "none", fontWeight: 600 }}>Hackathon Pre-meetup</a></>),
    time: "1 hour ago",
    unread: false,
  },
  {
    id: 4,
    type: "event",
    isSystem: true,
    systemIcon: "📅",
    systemBg: "#e0f7f8",
    systemIconColor: "#0ea5b0",
    content: (<>Reminder: <strong>Annual Tech Symposium</strong> is starting in 2 hours at the Main Auditorium.</>),
    time: "2 hours ago",
    unread: false,
    actions: [
      { label: "View Event", primary: true },
      { label: "Dismiss", primary: false },
    ],
  },
  {
    id: 5,
    avatar: "MT",
    avatarColor: "#8b5cf6",
    type: "invite",
    typeIcon: "👤",
    content: (<><strong>Marcus Thorne</strong> invited you to join <a href="#" style={{ color: "#0ea5b0", textDecoration: "none", fontWeight: 600 }}>Digital Art Enthusiasts</a></>),
    time: "5 hours ago",
    unread: false,
    actions: [
      { label: "Accept", primary: true },
      { label: "Decline", primary: false },
    ],
  },
];

const yesterdayNotifications = [
  {
    id: 6,
    type: "system",
    isSystem: true,
    systemIcon: "🔄",
    systemBg: "#f1f5f9",
    content: "System Update: New library booking system is now live. Please check the Library tab.",
    time: "Yesterday, 10:45 AM",
    unread: false,
  },
];

const tabs = ["All", "Unread", "Mentions", "System"];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <Layout searchPlaceholder="Search notifications...">
      <div style={{ padding: "28px 32px", fontFamily: "'DM Sans', sans-serif", maxWidth: 760 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Notifications</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Stay updated with your academic and social circle</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#0ea5b0", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Check size={13} /> Mark all as read
            </button>
            <button style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
              <SlidersHorizontal size={15} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e8ecf0", marginBottom: 20 }}>
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              color: activeTab === tab ? "#0ea5b0" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #0ea5b0" : "2px solid transparent",
              marginBottom: -1,
            }}>{tab}</button>
          ))}
        </div>

        {/* Today's notifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {notificationsData.map((n) => (
            <NotifItem key={n.id} n={n} />
          ))}
        </div>

        {/* Yesterday */}
        <div style={{ margin: "20px 0 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 }}>YESTERDAY</div>
        {yesterdayNotifications.map((n) => <NotifItem key={n.id} n={n} />)}

        <button style={{ display: "block", margin: "24px auto 0", background: "none", border: "none", color: "#0ea5b0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Load older notifications
        </button>
      </div>
    </Layout>
  );
}

function NotifItem({ n }) {
  return (
    <div style={{
      background: n.unread ? "#f0fdfe" : "#fff",
      border: "1px solid",
      borderColor: n.unread ? "#b2eff3" : "#f1f5f9",
      borderRadius: 12, padding: "14px 16px",
      display: "flex", gap: 14, alignItems: "flex-start",
      marginBottom: 6, position: "relative",
    }}>
      {/* Avatar or system icon */}
      {n.isSystem ? (
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: n.systemBg || "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {n.systemIcon}
        </div>
      ) : (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: n.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {n.avatar}
          </div>
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#0ea5b0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, border: "2px solid #fff" }}>
            {n.typeIcon}
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.5 }}>{n.content}</div>
        {n.quote && (
          <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic", marginTop: 4, background: "#f8fafc", borderRadius: 6, padding: "6px 10px", borderLeft: "3px solid #e2e8f0" }}>
            {n.quote}
          </div>
        )}
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{n.time}</div>
        {n.actions && (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {n.actions.map(({ label, primary }) => (
              <button key={label} style={{
                padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: primary ? "#0ea5b0" : "#fff",
                color: primary ? "#fff" : "#475569",
                border: primary ? "none" : "1px solid #e2e8f0",
              }}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Unread dot */}
      {n.unread && (
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#0ea5b0", flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  );
}
