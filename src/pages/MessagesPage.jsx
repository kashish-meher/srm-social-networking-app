import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Video, Phone, MoreVertical, Smile, Paperclip, Image, Send } from 'lucide-react';
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

function NavAvatar({ navigate }) {
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  const pic = u?.profilePic;
  const src = pic
    ? (pic.startsWith('http') ? pic : `http://localhost:5000/${pic.replace(/\\/g, '/')}`)
    : null;

  return (
    <div
      onClick={() => navigate('/settings')}
      
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: '#0e8888', overflow: 'hidden',
        cursor: 'pointer', border: '2px solid #0e8888',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}
    >
      {src
        ? <img src={src} alt="u" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
          {(u?.name || 'U')[0].toUpperCase()}
        </span>
      }
    </div>
  );
}

// FIX: helper to get initials/avatar color per user consistently
function getAvatarColor(name = '') {
  const colors = ['#0e8888', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#2563eb'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

function UserAvatar({ name = '', size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: getAvatarColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {name[0]?.toUpperCase() || '?'}
    </div>
  );
}

export default function MessagesPage() {
  const location = useLocation();
  const incomingUser = location.state; // { userId, userName }
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser?._id || currentUser?.id;
  const currentUserName = currentUser?.name || 'You';

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);
  const [search, setSearch] = useState('');
  const [activeConvId, setActiveConvId] = useState(null);

  const messagesEndRef = useRef(null); // FIX: auto-scroll to bottom

  const activeConv = conversations.find(c => c._id === activeConvId) || null;
  const otherUser = activeConv?.members?.find(m => m._id !== userId) || null;

  // ─── 1. Init socket ───────────────────────────────────────────────
  useEffect(() => {
    const s = io("http://localhost:5000");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // ─── 2. Register user with socket once both are ready ─────────────
  useEffect(() => {
    if (!socket || !userId) return;
    socket.emit("addUser", userId);
  }, [socket, userId]); // FIX: depend on both, not just socket

  // ─── 3. Listen for incoming messages ──────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      // FIX: give socket messages a stable temporary key
      setMessages(prev => [...prev, {
        _id: `sock_${Date.now()}_${Math.random()}`,
        sender: data.senderId,
        text: data.text,
        createdAt: new Date().toISOString(),
      }]);
    };

    socket.on("getMessage", handler);
    return () => socket.off("getMessage", handler);
  }, [socket]);


// ─── 4. Load all conversations on mount ───────────────────────────
const fetchConvs = async () => {
  if (!userId) return;
  try {
    const res = await fetch(`http://localhost:5000/api/conversations/${userId}`);
    const data = await res.json();
    setConversations(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("fetchConvs error:", err);
  }
};

useEffect(() => {
  fetchConvs();
}, [userId]);


  // ─── 5. If navigated here with a user, create/get their conversation ──
useEffect(() => {
  if (!incomingUser?.userId || !userId) return;

  const createOrGet = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: userId, receiverId: incomingUser.userId }),
      });
      const data = await res.json();

      // FIX: re-fetch all convs instead of manually merging
      // This guarantees no duplicates and keeps list in sync
      await fetchConvs();
      setActiveConvId(data._id);

    } catch (err) {
      console.error("createOrGet error:", err);
    }
  };

  createOrGet();
}, [incomingUser?.userId, userId]);

  // ─── 6. Load messages when active conversation changes ────────────
  useEffect(() => {
    if (!activeConvId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${activeConvId}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("fetchMessages error:", err);
      }
    };

    fetchMessages();
  }, [activeConvId]);

  // ─── 7. Auto-scroll to latest message ─────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── 8. Send message ──────────────────────────────────────────────
  const sendMessage = async () => {
    if (!messageText.trim() || !activeConv) return;

    const msg = {
      sender: userId,
      text: messageText,
      conversationId: activeConv._id,
    };

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      const saved = await res.json();
      setMessages(prev => [...prev, saved]);

      // Emit via socket to receiver
      const receiverId = activeConv.members?.find(m => m._id !== userId)?._id;
      if (receiverId && socket) {
        socket.emit("sendMessage", { senderId: userId, receiverId, text: messageText });
      }

      setMessageText('');
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  const filtered = conversations.filter(c => {
    const other = c.members?.find(m => m._id !== userId);
    return (other?.name || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f0f4f8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
        * { box-sizing: border-box; }
      `}</style>

      {/* TOP NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 52, flexShrink: 0 }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0e8888', minWidth: 130 }}>SRM Connect</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/notifications')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>🔔</button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>💬</button>
          <NavAvatar navigate={navigate} />
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '20px 16px', gap: 20 }}>

        {/* SIDEBAR NAV */}
        <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 72, alignSelf: 'start' }}>
          <div style={{ padding: '12px 8px 16px' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0e8888' }}>SRM Connect</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Student Portal</div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, border: 'none',
                  background: item.path === '/messages' ? '#e8f4f4' : 'none',
                  color: item.path === '/messages' ? '#0e8888' : '#64748b',
                  fontWeight: item.path === '/messages' ? 500 : 400,
                  fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 24, padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavAvatar navigate={navigate} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{currentUserName}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{currentUser?.email?.split('@')[0]}</div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT */}
        <div style={{ flex: 1, display: 'flex', background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', minHeight: 'calc(100vh - 112px)' }}>

          {/* CONVERSATION LIST */}
          <div style={{ width: 260, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#0e8888', fontFamily: 'Sora, sans-serif' }}>Messages</h2>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 12, color: '#64748b', outline: 'none', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.length === 0 && (
                <div style={{ padding: 20, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>No conversations yet</div>
              )}
              {filtered.map(conv => {
                const other = conv.members?.find(m => m._id !== userId);
                return (
                  <div
                    key={conv._id}
                    onClick={() => setActiveConvId(conv._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                      background: conv._id === activeConvId ? '#e0f7f8' : 'transparent',
                      borderLeft: conv._id === activeConvId ? '3px solid #0e8888' : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* FIX: use real name for avatar */}
                    <UserAvatar name={other?.name || '?'} size={38} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {other?.name || 'Unknown'}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Tap to open chat</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHAT AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

            {/* Chat header — FIX: show real name */}
            <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {otherUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <UserAvatar name={otherUser.name} size={36} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: 'Sora, sans-serif' }}>
                      {otherUser.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{otherUser.email}</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: '#94a3b8' }}>Select a conversation</div>
              )}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                
                { /*<Video size={17} color="#64748b" style={{ cursor: 'pointer' }} /> */ }
                { /* <Phone size={17} color="#64748b" style={{ cursor: 'pointer' }} /> */}
                <MoreVertical size={17} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px' }}>
              {!activeConvId && (
                <div style={{ textAlign: 'center', marginTop: 60, color: '#94a3b8', fontSize: 14 }}>
                  👈 Select a conversation to start chatting
                </div>
              )}
              {messages.map((msg, idx) => (
                // FIX: fallback key using index if _id missing
                <div key={msg._id || idx} style={{ display: 'flex', justifyContent: msg.sender === userId ? 'flex-end' : 'flex-start', marginBottom: 14, alignItems: 'flex-end', gap: 8 }}>
                  {msg.sender !== userId && (
                    <UserAvatar name={otherUser?.name || '?'} size={28} />
                  )}
                  <div>
                    <div style={{
                      maxWidth: 320, padding: '10px 14px',
                      background: msg.sender === userId ? '#0e8888' : '#fff',
                      color: msg.sender === userId ? '#fff' : '#1e293b',
                      borderRadius: msg.sender === userId ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      fontSize: 13, lineHeight: 1.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      border: msg.sender !== userId ? '1px solid #e2e8f0' : 'none',
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, textAlign: msg.sender === userId ? 'right' : 'left' }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      {msg.sender === userId && ' ✓✓'}
                    </div>
                  </div>
                </div>
              ))}
              {/* FIX: scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f1f5f9', borderRadius: 24, padding: '8px 16px' }}>
                <Smile size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} />
                <Paperclip size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} />
                
                 { /* <Image size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} /> */}

                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                  placeholder={activeConv ? "Type your message..." : "Select a conversation first"}
                  disabled={!activeConv}
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1e293b', fontFamily: 'DM Sans, sans-serif' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!activeConv}
                  style={{ background: activeConv ? '#0e8888' : '#cbd5e1', border: 'none', borderRadius: 20, padding: '6px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: activeConv ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}
                >
                  Send <Send size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}