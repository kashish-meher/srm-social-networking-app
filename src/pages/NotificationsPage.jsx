import { useState, useEffect, useCallback } from "react";
import Layout from "./Layout";
import { SlidersHorizontal, Check, Trash2 } from "lucide-react";
import { socket } from '../App.js';

const API_URL    = "http://localhost:5000/api";

const TYPE_META = {
  like:         { icon: "👍", color: "#e11d48" },
  comment:      { icon: "💬", color: "#0ea5e9" },
  message:      { icon: "✉️", color: "#8b5cf6" },
  follow:       { icon: "👤", color: "#f59e0b" },
  announcement: { icon: "📢", color: "#0ea5b0", isSystem: true },
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const tabs = ["All", "Unread", "Mentions", "System"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab]         = useState("All");
  const [loading, setLoading]             = useState(true);

  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  // ── Fetch from backend ──────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Socket.io real-time ─────────────────────────────────────
  // ── NEW — add this instead ──
useEffect(() => {
  socket.on('newNotification', (notif) => {
    console.log('🔔 Got notification:', notif);
    setNotifications(prev => [notif, ...prev]);
  });

  return () => {
    socket.off('newNotification'); // ✅ remove listener only, never disconnect
  };
}, []);

  // ── Mark all read ───────────────────────────────────────────
  const markAllRead = async () => {
    await fetch(`${API_URL}/notifications/mark-all-read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── Mark one read ───────────────────────────────────────────
  const markRead = async (id) => {
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  // ── Delete ──────────────────────────────────────────────────
  const deleteNotif = async (id) => {
    await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  // ── Tab filter ──────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    if (activeTab === "Unread")   return !n.read;
    if (activeTab === "System")   return n.type === "announcement";
    if (activeTab === "Mentions") return n.type === "comment";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Group by date ───────────────────────────────────────────
  const today     = filtered.filter(n => new Date(n.createdAt) > new Date(Date.now() - 86400000));
  const yesterday = filtered.filter(n => {
    const d = new Date(n.createdAt);
    return d <= new Date(Date.now() - 86400000) && d > new Date(Date.now() - 172800000);
  });
  const older = filtered.filter(n => new Date(n.createdAt) <= new Date(Date.now() - 172800000));

  return (
    <Layout searchPlaceholder="Search notifications...">
      <div style={{ padding: "28px 32px", fontFamily: "'DM Sans', sans-serif", maxWidth: 760 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ marginLeft: 10, background: "#0ea5b0", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Stay updated with your academic and social circle</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={markAllRead} style={{ display: "flex", alignItems: "center", gap: 6, background: "#0ea5b0", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Check size={13} /> Mark all as read
            </button>
            <button style={{ display: "flex", alignItems: "center", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", cursor: "pointer" }}>
              <SlidersHorizontal size={15} color="#64748b" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e8ecf0", marginBottom: 20 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              color: activeTab === tab ? "#0ea5b0" : "#64748b",
              borderBottom: activeTab === tab ? "2px solid #0ea5b0" : "2px solid transparent",
              marginBottom: -1,
            }}>{tab}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 60, fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
            No notifications yet
          </div>
        ) : (
          <>
            {today.length > 0 && (
              <>
                <div style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 }}>TODAY</div>
                {today.map(n => <NotifItem key={n._id} n={n} onRead={markRead} onDelete={deleteNotif} />)}
              </>
            )}
            {yesterday.length > 0 && (
              <>
                <div style={{ margin: "20px 0 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 }}>YESTERDAY</div>
                {yesterday.map(n => <NotifItem key={n._id} n={n} onRead={markRead} onDelete={deleteNotif} />)}
              </>
            )}
            {older.length > 0 && (
              <>
                <div style={{ margin: "20px 0 8px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 1 }}>OLDER</div>
                {older.map(n => <NotifItem key={n._id} n={n} onRead={markRead} onDelete={deleteNotif} />)}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

function NotifItem({ n, onRead, onDelete }) {
  const meta      = TYPE_META[n.type] || TYPE_META.announcement;
  const isSystem  = n.type === "announcement";
  const senderName = n.sender?.name || "Someone";
  const initials   = senderName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const contentText = {
    like:         <><strong>{senderName}</strong> liked your post</>,
    comment:      <><strong>{senderName}</strong> commented on your post</>,
    message:      <><strong>{senderName}</strong> sent you a message</>,
    follow:       <><strong>{senderName}</strong> started following you</>,
    announcement: <>{n.message}</>,
  }[n.type];

  return (
    <div
      onClick={() => !n.read && onRead(n._id)}
      style={{
        background: n.read ? "#fff" : "#f0fdfe",
        border: "1px solid",
        borderColor: n.read ? "#f1f5f9" : "#b2eff3",
        borderRadius: 12, padding: "14px 16px",
        display: "flex", gap: 14, alignItems: "flex-start",
        marginBottom: 6, position: "relative",
        cursor: n.read ? "default" : "pointer",
        transition: "background 0.2s",
      }}
    >
      {/* Avatar */}
      {isSystem ? (
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e0f7f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          {meta.icon}
        </div>
      ) : (
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {n.sender?.profilePic
              ? <img src={`http://localhost:5000/${n.sender.profilePic}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : initials}
          </div>
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: "#0ea5b0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, border: "2px solid #fff" }}>
            {meta.icon}
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.5 }}>{contentText}</div>
        {n.postId?.content && (
          <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic", marginTop: 4, background: "#f8fafc", borderRadius: 6, padding: "6px 10px", borderLeft: "3px solid #e2e8f0" }}>
            "{n.postId.content.slice(0, 80)}..."
          </div>
        )}
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{timeAgo(n.createdAt)}</div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {!n.read && (
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#0ea5b0" }} />
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(n._id); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.4 }}
        >
          <Trash2 size={13} color="#64748b" />
        </button>
      </div>
    </div>
  );
}