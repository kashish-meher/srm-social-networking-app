import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/HomePage.css';

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = currentUser?.name || 'User';

  return (
    <div className="hp-root">
      {/* TOP NAV */}
      <header className="hp-topnav">
        <div className="hp-logo">SRM Connect</div>
        <div className="hp-search">
          <span>🔍</span>
          <input placeholder="Search ..." />
        </div>
        <div className="hp-nav-right">
          <button className="hp-icon-btn">🔔</button>
          <button className="hp-icon-btn" onClick={() => navigate('/messages')}>💬</button>
          <div className="hp-avatar">{currentUserName?.[0]?.toUpperCase() || 'U'}</div>
        </div>
      </header>

      <div className="hp-body">
        {/* SIDEBAR */}
        <aside className="hp-sidebar">
          <div className="hp-brand-block">
            <div className="hp-brand-title">SRM Connect</div>
            <div className="hp-brand-sub">Student Portal</div>
          </div>
          <nav className="hp-nav">
            {NAV.map(item => (
              <button
                key={item.label}
                className={`hp-nav-item${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* PAGE CONTENT */}
        <main className="hp-main">
          {children}
        </main>
      </div>
    </div>
  );
}