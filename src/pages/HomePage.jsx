import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const TABS = ['All Posts', 'Rent', 'Resources', 'Events', 'Products'];

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'Events', path: '/events' },
  { icon: '📚', label: 'Library', path: '/library' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const TRENDING = [
  { cat: '#PLACEMENT_DIARIES', title: 'FAANG Interview Experience' },
  { cat: '#CAMPUS_LIFE', title: 'New Canteen Review' },
  { cat: '#EXAM_PREP', title: 'MA101 Important Questions' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('All Posts');
  const [liked, setLiked] = useState({});
  const navigate = useNavigate();

  return (
    <div className="hp-root">
      {/* TOP NAV */}
      <header className="hp-topnav">
        <div className="hp-logo">SRM Connect</div>
        <div className="hp-search">
          <span>🔍</span>
          <input placeholder="Search communities, notes, or events..." />
        </div>
        <div className="hp-nav-right">
          <button className="hp-icon-btn">🔔</button>
          <button className="hp-icon-btn">💬</button>
          <div className="hp-avatar">U</div>
        </div>
      </header>

      <div className="hp-body">
        {/* LEFT SIDEBAR */}
        <aside className="hp-sidebar">
          <div className="hp-brand-block">
            <div className="hp-brand-title">SRM Connect</div>
            <div className="hp-brand-sub">Student Portal</div>
          </div>
          <nav className="hp-nav">
            {NAV.map(item => (
              <button
                key={item.label}
                className={`hp-nav-item${item.path === '/home' ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN FEED */}
        <main className="hp-main">
          {/* TABS */}
          <div className="hp-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`hp-tab${activeTab === t ? ' active' : ''}`}
                onClick={() => setActiveTab(t)}
              >{t}</button>
            ))}
          </div>

          {/* GRID */}
          <div className="hp-grid">
            {/* BIG POST — Resources */}
            <div className="hp-post-big">
              <div className="hp-tag tag-resources">RESOURCES</div>
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
                alt="study" className="hp-big-img"
              />
              <div className="hp-post-big-body">
                <div className="hp-author-row">
                  <div className="hp-author-avatar" style={{ background: '#5b8dee' }}>A</div>
                  <div>
                    <div className="hp-author-name">Alex Rivera</div>
                    <div className="hp-author-meta">2 hours ago • Computer Science</div>
                  </div>
                </div>
                <h2 className="hp-post-title">Ultimate Data Structures Study Guide for Mid-Terms</h2>
                <p className="hp-post-body">I've compiled all my handwritten notes and practice problems from the last 3 years. Includes Big O cheatsheet and common algorithms explained simply.</p>
                <div className="hp-post-footer">
                  <button className={`hp-like-btn${liked[1] ? ' liked' : ''}`} onClick={() => setLiked(l => ({ ...l, 1: !l[1] }))}>
                    ♡ {liked[1] ? 125 : 124}
                  </button>
                  <button className="hp-comment-btn">💬 18</button>
                  <button className="hp-dl-btn">Download PDF</button>
                </div>
              </div>
            </div>

            {/* SMALL CARDS COLUMN */}
            <div className="hp-small-col">
              {/* RENT CARD */}
              <div className="hp-rent-card">
                <div className="hp-rent-header">
                  <span className="hp-tag tag-rent">RENT</span>
                  <span className="hp-rent-price">$450<span>/mo</span></span>
                </div>
                <div className="hp-rent-title">Room available in Green Park</div>
                <p className="hp-rent-body">Looking for a tidy roommate to share a 2BHK. 5 mins walk from Campus Gate 3. Fully furnished with AC.</p>
                <div className="hp-rent-location">📍 Potheri, Chennai</div>
                <button className="hp-contact-btn">Contact Owner</button>
              </div>

              {/* PRODUCT CARD */}
              <div className="hp-product-card">
                <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80" alt="book" className="hp-product-img" />
                <div className="hp-product-info">
                  <span className="hp-tag tag-products">PRODUCTS</span>
                  <div className="hp-product-title">Engineering Physics Vol 1 & 2</div>
                  <div className="hp-product-row">
                    <span className="hp-product-by">By Sarah J.</span>
                    <button className="hp-cart-btn">🛒</button>
                  </div>
                  <div className="hp-product-price">$25</div>
                </div>
              </div>

              {/* EVENT CARD */}
              <div className="hp-event-card">
                <div className="hp-tag tag-events">EVENTS</div>
                <div className="hp-event-title">HackSRM 2024</div>
                <p className="hp-event-body">Join the biggest 36-hour hackathon on campus. Prizes worth $5000+ up for grabs!</p>
                <div className="hp-event-meta">
                  <span>📅 Oct 12-14</span>
                  <span>👥 450 Registered</span>
                </div>
                <button className="hp-register-btn">Register Now</button>
              </div>
            </div>

            {/* TRENDING */}
            <div className="hp-trending-widget">
              <div className="hp-widget-title">↗ Trending Topics</div>
              {TRENDING.map((t, i) => (
                <div key={i} className="hp-trending-item">
                  <div className="hp-trending-cat">{t.cat}</div>
                  <div className="hp-trending-title">{t.title}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button className="hp-fab">+</button>
    </div>
  );
}