import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPostsPage.css';

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

// Sample posts — replace with your real data / API call
const MY_POSTS = [
  {
    id: 1,
    type: 'RESOURCES',
    title: 'Ultimate Data Structures Study Guide for Mid-Terms',
    body: "I've compiled all my handwritten notes and practice problems from the last 3 years. Includes Big O cheatsheet and common algorithms explained simply.",
    date: '2 hours ago',
    likes: 124,
    comments: 18,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
  },
  {
    id: 2,
    type: 'PRODUCTS',
    title: 'Engineering Physics Vol 1 & 2',
    body: 'Selling my engineering physics textbooks. Both volumes in great condition. Perfect for first-year students.',
    date: '1 day ago',
    likes: 32,
    comments: 5,
    price: '$25',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80',
  },
  {
    id: 3,
    type: 'EVENTS',
    title: 'HackSRM 2024 — Team Looking for Members',
    body: 'Looking for 2 more teammates for HackSRM 2024. Need a frontend dev and a designer. Drop a comment if interested!',
    date: '3 days ago',
    likes: 67,
    comments: 23,
    image: null,
  },
  {
    id: 4,
    type: 'RENT',
    title: 'Room available in Green Park',
    body: 'Looking for a tidy roommate to share a 2BHK. 5 mins walk from Campus Gate 3. Fully furnished with AC.',
    date: '5 days ago',
    likes: 14,
    comments: 8,
    price: '$450/mo',
    image: null,
  },
];

const TAG_COLORS = {
  RESOURCES: 'tag-resources',
  PRODUCTS: 'tag-products',
  EVENTS: 'tag-events',
  RENT: 'tag-rent',
};

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Resources', 'Products', 'Events', 'Rent'];

  const filtered = MY_POSTS.filter(p =>
    filter === 'All' ? true : p.type === filter.toUpperCase()
  );

  return (
    <div className="mp-root">
      {/* TOP NAV */}
      <header className="mp-topnav">
        <div className="mp-logo">SRM Connect</div>
        <div className="mp-search">
          <span>🔍</span>
          <input placeholder="Search ..." />
        </div>
        <div className="mp-nav-right">
          <button className="mp-icon-btn">🔔</button>
          <button className="mp-icon-btn">💬</button>
          <div className="mp-avatar">U</div>
        </div>
      </header>

      <div className="mp-body">
        {/* LEFT SIDEBAR */}
        <aside className="mp-sidebar">
          <div className="mp-brand-block">
            <div className="mp-brand-title">SRM Connect</div>
            <div className="mp-brand-sub">Student Portal</div>
          </div>
          <nav className="mp-nav">
            {NAV.map(item => (
              <button
                key={item.label}
                className={`mp-nav-item${item.path === '/myposts' ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="mp-main">
          {/* PAGE HEADER */}
          <div className="mp-page-header">
            <div>
              <h1 className="mp-page-title">My Posts</h1>
              <p className="mp-page-sub">{MY_POSTS.length} posts published</p>
            </div>
            <button className="mp-new-btn" onClick={() => navigate('/home')}>
              + New Post
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="mp-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`mp-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* POSTS LIST */}
          <div className="mp-posts-list">
            {filtered.length === 0 && (
              <div className="mp-empty">No posts in this category yet.</div>
            )}
            {filtered.map(post => (
              <div key={post.id} className="mp-post-card">
                {post.image && (
                  <img src={post.image} alt={post.title} className="mp-post-img" />
                )}
                <div className="mp-post-content">
                  <div className="mp-post-top">
                    <span className={`mp-tag ${TAG_COLORS[post.type]}`}>{post.type}</span>
                    {post.price && <span className="mp-price">{post.price}</span>}
                    <span className="mp-post-date">{post.date}</span>
                  </div>
                  <h2 className="mp-post-title">{post.title}</h2>
                  <p className="mp-post-body">{post.body}</p>
                  <div className="mp-post-footer">
                    <button
                      className={`mp-like-btn${liked[post.id] ? ' liked' : ''}`}
                      onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                    >
                      ♡ {liked[post.id] ? post.likes + 1 : post.likes}
                    </button>
                    <button className="mp-comment-btn">💬 {post.comments}</button>
                    <div className="mp-post-actions">
                      <button className="mp-edit-btn">✏️ Edit</button>
                      <button className="mp-delete-btn">🗑 Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}