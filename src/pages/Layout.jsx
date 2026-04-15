import { NavLink } from "react-router-dom";
import { Home, Calendar, BookOpen, Settings, Bell, MessageSquare } from "lucide-react";

export default function Layout({ children, searchPlaceholder = "Search..." }) {
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#f5f7fa", color: "#1a1a2e" }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: "#fff", borderRight: "1px solid #e8ecf0", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #e8ecf0" }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0ea5b0" }}>SRM Connect</div>
          <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Student Portal</div>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {[
            { to: "/", icon: <Home size={16} />, label: "Home" },
            { to: "/events", icon: <Calendar size={16} />, label: "Events" },
            { to: "/library", icon: <BookOpen size={16} />, label: "Library" },
            { to: "/settings", icon: <Settings size={16} />, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500,
                color: isActive ? "#0ea5b0" : "#64748b",
                background: isActive ? "#e0f7f8" : "transparent",
                marginBottom: 4,
              })}
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
        {/* User profile at bottom */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e8ecf0", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0ea5b0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            AR
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>Alex Rivera</div>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>Computer Science</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <header style={{ height: 52, background: "#fff", borderBottom: "1px solid #e8ecf0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
          <input
            placeholder={searchPlaceholder}
            style={{ border: "1px solid #e2e8f0", borderRadius: 20, padding: "6px 14px", fontSize: 13, color: "#64748b", background: "#f8fafc", outline: "none", width: 220 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Bell size={18} color="#64748b" style={{ cursor: "pointer" }} />
            <MessageSquare size={18} color="#64748b" style={{ cursor: "pointer" }} />
          </div>
        </header>

        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
