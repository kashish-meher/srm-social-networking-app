import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const TABS = ['All', 'To-let', 'Resources', 'Events', 'General Discussions'];

const POSTS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Computer Science Alumni • 2h ago',
    avatar: 'PS',
    avatarColor: '#e07b54',
    tag: 'RESOURCES',
    tagColor: '#e07b54',
    content: 'Just shared my complete notes for the upcoming "Advanced Distributed Systems" finals. Hope this helps the juniors! Feel free to reach out if you have questions about the Paxos algorithm section. 📚',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80',
    likes: 124,
    comments: 16,
    shares: 5,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Mechanical Eng • 3h ago',
    avatar: 'RV',
    avatarColor: '#5b8dee',
    tag: 'TO LET',
    tagColor: '#3b82f6',
    content: 'Room Available in Abode Heights (Single Occupancy)\n\nLooking for a flatmate starting next month. The apartment is fully furnished, 5 mins walk from the main gate. DM for more pictures and details.',
    image: null,
    likes: 42,
    comments: 9,
    shares: 3,
  },
];

const TRENDING = [
  { category: 'TRENDING IN ENGINEERING', tag: '#SRMHackathon2024', meta: '2.4k students discussing' },
  { category: 'CAMPUS LIFE', tag: '#MilanFestival', meta: '1.6k posts today' },
  { category: 'PLACEMENTS', tag: '#GoogleHiring', meta: '856 discussions' },
];

const ALUMNI = [
  { name: 'Ankit Malhotra', role: 'SDE at Microsoft • Class of \'19', initials: 'AM', color: '#5b8dee' },
  { name: 'Sarah Thompson', role: 'Product Designer at Adobe', initials: 'ST', color: '#e07b54' },
];

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '👤', label: 'My Page', path: '/profile' },
  { icon: '🎓', label: 'Alumni', path: '/alumni' },
  { icon: '🏠', label: 'Accommodations', path: '/accommodations' },
  { icon: '🔭', label: 'Explore', path: '/explore' },
  { icon: '🔔', label: 'Notifications', path: '/notifications' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const navigate = useNavigate();

  const toggleLike = (id) => setLikedPosts(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="hp-root">
      {/* TOP NAV */}
      <header className="hp-topnav">
        <div className="hp-logo">SRM Connect</div>
        <div className="hp-search">
          <span className="hp-search-icon">🔍</span>
          <input placeholder="Search for peers, alumni or topics..." />
        </div>
        <div className="hp-nav-actions">
          <button className="hp-icon-btn">🔔</button>
          <div className="hp-avatar-circle" style={{ background: '#5b8dee' }}>U</div>
        </div>
      </header>

      <div className="hp-body">
        {/* LEFT SIDEBAR */}
        <aside className="hp-sidebar">
          <div className="hp-brand-card">
            <div className="hp-brand-avatar">SC</div>
            <div>
              <div className="hp-brand-name">SRM Connect</div>
              <div className="hp-brand-sub">The Modern Scholar</div>
            </div>
          </div>
          <nav className="hp-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                className={`hp-nav-item ${item.path === '/home' ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="hp-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <button className="hp-create-post-btn" onClick={() => document.getElementById('post-input').focus()}>
            + Create Post
          </button>
        </aside>

        {/* MAIN FEED */}
        <main className="hp-feed">
          {/* TABS */}
          <div className="hp-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`hp-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* POST COMPOSER */}
          <div className="hp-composer">
            <div className="hp-composer-avatar">U</div>
            <div className="hp-composer-box">
              <input
                id="post-input"
                placeholder="Share your academic journey or ask a question..."
                value={postText}
                onChange={e => setPostText(e.target.value)}
              />
              <div className="hp-composer-actions">
                <div className="hp-composer-tools">
                  <button title="Image">🖼️</button>
                  <button title="Attach">📎</button>
                  <button title="Calendar">📅</button>
                </div>
                <button className="hp-post-btn">Post</button>
              </div>
            </div>
          </div>

          {/* POSTS */}
          {POSTS.map(post => (
            <article key={post.id} className="hp-post-card">
              <div className="hp-post-header">
                <div className="hp-post-avatar" style={{ background: post.avatarColor }}>
                  {post.avatar}
                </div>
                <div className="hp-post-meta">
                  <div className="hp-post-name">{post.name}</div>
                  <div className="hp-post-role">{post.role}</div>
                </div>
                <span className="hp-post-tag" style={{ background: post.tagColor + '22', color: post.tagColor }}>
                  {post.tag}
                </span>
              </div>
              <div className="hp-post-content">
                {post.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {post.image && (
                <div className="hp-post-image">
                  <img src={post.image} alt="post visual" />
                </div>
              )}
              <div className="hp-post-footer">
                <button
                  className={`hp-action-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                  onClick={() => toggleLike(post.id)}
                >
                  ♡ {likedPosts[post.id] ? post.likes + 1 : post.likes}
                </button>
                <button className="hp-action-btn">💬 {post.comments}</button>
                <button className="hp-action-btn">↗ {post.shares}</button>
                <button className="hp-action-btn hp-bookmark">🔖</button>
              </div>
            </article>
          ))}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hp-right-sidebar">
          <div className="hp-widget">
            <h3 className="hp-widget-title">Trending Topics</h3>
            {TRENDING.map((t, i) => (
              <div key={i} className="hp-trending-item">
                <div className="hp-trending-category">{t.category}</div>
                <div className="hp-trending-tag">{t.tag}</div>
                <div className="hp-trending-meta">{t.meta}</div>
              </div>
            ))}
          </div>

          <div className="hp-widget">
            <h3 className="hp-widget-title">Suggested Alumni</h3>
            {ALUMNI.map((a, i) => (
              <div key={i} className="hp-alumni-item">
                <div className="hp-alumni-avatar" style={{ background: a.color }}>{a.initials}</div>
                <div className="hp-alumni-info">
                  <div className="hp-alumni-name">{a.name}</div>
                  <div className="hp-alumni-role">{a.role}</div>
                </div>
                <button className="hp-follow-btn">+</button>
              </div>
            ))}
            <button className="hp-view-all">View All Scholars</button>
          </div>
        </aside>
      </div>
    </div>
  );
}