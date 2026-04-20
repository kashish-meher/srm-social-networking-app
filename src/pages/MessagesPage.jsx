import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Video, Phone, MoreVertical, Smile, Paperclip, Image, Send } from 'lucide-react';

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const conversations = [
  { id: 1, name: 'Priya Sharma', avatar: 'PS', avatarColor: '#e11d48', preview: 'Can you share the alumni network link?', time: '10:04 AM', online: true },
  { id: 2, name: 'Marcus Chen (Alumnus)', avatar: 'MC', avatarColor: '#0ea5e9', preview: 'The internship applications are now open on the...', time: 'Yesterday' },
  { id: 3, name: 'AI & Robotics Club', avatar: 'AR', avatarColor: '#8b5cf6', preview: 'Siddharth: We need to finalize the bot design by...', time: 'Mar 12', isGroup: true },
  { id: 4, name: 'Sana Mirza', avatar: 'SM', avatarColor: '#f59e0b', preview: 'Thanks for the notes!', time: 'Mar 11' },
];

const messages = [
  { id: 1, from: 'other', text: 'Hey Alex! Did you manage to find that link for the alumni networking event next week?', time: '10:21 AM' },
  { id: 2, from: 'me', text: "Found it! Here's the direct link: srmconnect.edu/alumni/spring-2024", time: '10:23 AM', link: true },
  { id: 3, from: 'other', text: "Perfect! You're a lifesaver. Can you share the alumni network link? I need to register before the deadline tonight.", time: '10:24 AM' },
  { id: 4, from: 'other', typing: true },
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

export default function MessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = currentUser?.name || 'You';

  const [activeConv, setActiveConv] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const active = conversations.find(c => c.id === activeConv);

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f0f4f8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
      `}</style>

      {/* TOP NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 52, flexShrink: 0 }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0e8888', minWidth: 130 }}>SRM Connect</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>🔔</button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>💬</button>
          <NavAvatar navigate={navigate} />
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '20px 16px', gap: 20 }}>

        {/* SIDEBAR */}
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

          {/* User info at bottom */}
          <div style={{ marginTop: 24, padding: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <NavAvatar navigate={navigate} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{currentUserName}</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>{currentUser?.email?.split('@')[0]}</div>
            </div>
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
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
                  style={{ width: '100%', paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 12, color: '#64748b', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', cursor: 'pointer',
                    background: conv.id === activeConv ? '#e0f7f8' : 'transparent',
                    borderLeft: conv.id === activeConv ? '3px solid #0e8888' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: conv.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      {conv.isGroup ? '👥' : conv.avatar}
                    </div>
                    {conv.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{conv.name}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8', flexShrink: 0, marginLeft: 6 }}>{conv.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{conv.preview}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
            {/* Chat header */}
            <div style={{ padding: '12px 20px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: active?.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>{active?.avatar}</div>
                  {active?.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 8, height: 8, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: 'Sora, sans-serif' }}>{active?.name}</div>
                  {active?.online && <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>● ONLINE</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Video size={17} color="#64748b" style={{ cursor: 'pointer' }} />
                <Phone size={17} color="#64748b" style={{ cursor: 'pointer' }} />
                <MoreVertical size={17} color="#64748b" style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ background: '#e2e8f0', borderRadius: 12, padding: '4px 12px', fontSize: 11, color: '#64748b' }}>TODAY</span>
              </div>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 14, alignItems: 'flex-end', gap: 8 }}>
                  {msg.from === 'other' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: active?.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{active?.avatar}</div>
                  )}
                  <div>
                    {msg.typing ? (
                      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '18px 18px 18px 4px', padding: '10px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        maxWidth: 320, padding: '10px 14px',
                        background: msg.from === 'me' ? '#0e8888' : '#fff',
                        color: msg.from === 'me' ? '#fff' : '#1e293b',
                        borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        fontSize: 13, lineHeight: 1.5,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: msg.from === 'other' ? '1px solid #e2e8f0' : 'none',
                      }}>
                        {msg.text}
                        {msg.link && (
                          <div style={{ marginTop: 4 }}>
                            <a href="https://srmconnect.edu/alumni/spring-2024" target="_blank" rel="noreferrer" style={{ color: '#bef4f7', fontSize: 12, textDecoration: 'underline' }}>
                              srmconnect.edu/alumni/spring-2024
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.time && (
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3, textAlign: msg.from === 'me' ? 'right' : 'left' }}>
                        {msg.time}{msg.from === 'me' && ' ✓✓'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f1f5f9', borderRadius: 24, padding: '8px 16px' }}>
                <Smile size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} />
                <Paperclip size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} />
                <Image size={18} color="#94a3b8" style={{ cursor: 'pointer', flexShrink: 0 }} />
                <input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setMessageText('')}
                  placeholder="Type your message..."
                  style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1e293b', fontFamily: 'DM Sans, sans-serif' }}
                />
                <button
                  onClick={() => setMessageText('')}
                  style={{ background: '#0e8888', border: 'none', borderRadius: 20, padding: '6px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, fontFamily: 'DM Sans, sans-serif' }}
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