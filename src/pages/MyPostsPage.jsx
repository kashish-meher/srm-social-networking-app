import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyPostsPage.css';

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

function ProfileAvatar({ size = 48, className = '', style = {} }) {
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  const pic = u?.profilePic;
  const src = pic
    ? (pic.startsWith('http') ? pic : `http://localhost:5000/${pic.replace(/\\/g, '/')}`)
    : null;
  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: '#0e8888', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, ...style,
      }}
    >
      {src
        ? <img src={src} alt="u" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: 'white', fontWeight: 700, fontSize: size * 0.35, fontFamily: 'Sora, sans-serif' }}>
            {(u?.name || 'U')[0].toUpperCase()}
          </span>
      }
    </div>
  );
}

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [editPost, setEditPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');
  const [saving, setSaving] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = currentUser?.name || currentUser?.email || 'User';
  const userId = currentUser?.id || currentUser?._id;

  const filters = ['All', 'Web Development', 'Computer Science', 'Artificial Intelligence', 'Rent', 'Events', 'Hackathon'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();
        const userName = (currentUser?.name || '').toLowerCase().trim();
        const myPosts = data.filter(post => {
          if (userId && post.userId && post.userId === userId) return true;
          const postUserName = (post.userName || '').toLowerCase().trim();
          if (userName && postUserName && postUserName === userName) return true;
          const postUser = (post.user || '').toLowerCase().trim();
          if (userName && postUser && postUser === userName) return true;
          return false;
        });
        setPosts(myPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter(post => {
    if (filter === 'All') return true;
    return post.tags?.some(tag => tag.toLowerCase() === filter.toLowerCase());
  });

  const handleLike = async (postId) => {
    setLiked(l => ({ ...l, [postId]: !l[postId] }));
    await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openEdit = (post) => {
    setEditPost(post);
    setEditContent(post.content || '');
    setEditTags((post.tags || []).join(', '));
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setSaving(true);
    try {
      const updatedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await fetch(`http://localhost:5000/api/posts/${editPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: editContent, tags: updatedTags }),
      });
      if (res.ok) {
        setPosts(prev => prev.map(p => p._id === editPost._id ? { ...p, content: editContent, tags: updatedTags } : p));
      } else {
        setPosts(prev => prev.map(p => p._id === editPost._id ? { ...p, content: editContent, tags: updatedTags } : p));
      }
      setEditPost(null);
    } catch (err) {
      setPosts(prev => prev.map(p => p._id === editPost._id ? { ...p, content: editContent, tags: editTags.split(',').map(t => t.trim()).filter(Boolean) } : p));
      setEditPost(null);
    } finally {
      setSaving(false);
    }
  };

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
          <button className="mp-icon-btn" onClick={() => navigate('/messages')}>💬</button>
          <NavAvatar navigate={navigate} />
        </div>
      </header>

      <div className="mp-body">
        {/* SIDEBAR */}
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

        {/* MAIN */}
        <main className="mp-main">
          {/* TABS */}
          <div className="mp-tabs">
            {filters.map(f => (
              <button
                key={f}
                className={`mp-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>

          <div className="mp-grid">
            {/* LEFT: FEED */}
            <div className="mp-feed">
              {loading && <div className="mp-loading">Loading your posts...</div>}

              {!loading && filtered.length === 0 && (
                <div className="mp-empty">
                  <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontFamily: 'Sora, sans-serif' }}>No posts found</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {filter !== 'All'
                      ? `No posts tagged "${filter}". Try a different filter.`
                      : "You haven't posted anything yet. Click + New Post!"}
                  </div>
                </div>
              )}

              {!loading && filtered.map(post => (
                <div key={post._id} className="mp-post-card">
                  <div className="mp-author-row">
                    {/* Show profile pic on own posts */}
                    <ProfileAvatar size={38} />
                    <div>
                      <div className="mp-author-name">{post.userName || post.user || 'Unknown'}</div>
                      <div className="mp-author-meta">
                        {new Date(post.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="mp-post-actions-top">
                      <button className="mp-edit-btn" onClick={() => openEdit(post)}>✏️ Edit</button>
                      <button className="mp-delete-btn" onClick={() => handleDelete(post._id)}>🗑 Delete</button>
                    </div>
                  </div>

                  <p className="mp-post-body">{post.content}</p>

                  {post.images?.length > 0 && (
                    <div className="mp-image-grid">
                      {post.images.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000/${img.replace(/\\/g, '/')}`}
                          alt="post"
                          className="mp-post-img"
                        />
                      ))}
                    </div>
                  )}

                  <div className="mp-tags-row">
                    {post.tags?.map((tag, i) => (
                      <span key={i} className="mp-tag-chip">#{tag}</span>
                    ))}
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="mp-comments-preview">
                      {post.comments.slice(0, 2).map((c, i) => (
                        <div key={i} className="mp-comment-item">
                          <b>{c.user}</b>: {c.text}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mp-post-footer">
                    <button
                      className={`mp-like-btn${liked[post._id] ? ' liked' : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                      {liked[post._id] ? '❤️' : '♡'} {(post.likes || 0) + (liked[post._id] ? 1 : 0)}
                    </button>
                    <span className="mp-comment-count">💬 {post.comments?.length || 0}</span>
                    <span className="mp-post-date">
                      {new Date(post.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="mp-right-col">
              <div className="mp-widget">
                <div className="mp-widget-title">⚡ Quick Actions</div>
                <button className="mp-quick-btn" onClick={() => navigate('/uploadpost')}>+ Create New Post</button>
                <button className="mp-quick-btn secondary" onClick={() => navigate('/home')}>🏠 Go to Feed</button>
                <button className="mp-quick-btn secondary" onClick={() => navigate('/settings')}>👤 Edit Profile</button>
              </div>

              {posts.length > 0 && (
                <div className="mp-widget">
                  <div className="mp-widget-title">🏷️ Your Tags</div>
                  <div className="mp-widget-tags">
                    {[...new Set(posts.flatMap(p => p.tags || []))].map((tag, i) => (
                      <span
                        key={i}
                        className={`mp-widget-tag${filter === tag ? ' active' : ''}`}
                        onClick={() => setFilter(tag)}
                      >#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <button className="mp-fab" onClick={() => navigate('/uploadpost')}>+</button>

      {/* EDIT MODAL */}
      {editPost && (
        <div className="mp-modal-overlay" onClick={() => setEditPost(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <div className="mp-modal-header">
              <h3>Edit Post</h3>
              <button className="mp-modal-close" onClick={() => setEditPost(null)}>✕</button>
            </div>
            <div className="mp-modal-body">
              <label className="mp-modal-label">Content</label>
              <textarea
                className="mp-modal-textarea"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={5}
                placeholder="What's on your mind?"
              />
              <label className="mp-modal-label" style={{ marginTop: 14 }}>
                Tags <span style={{ color: '#94a3b8', fontWeight: 400 }}>(comma separated)</span>
              </label>
              <input
                className="mp-modal-input"
                value={editTags}
                onChange={e => setEditTags(e.target.value)}
                placeholder="e.g. Web Development, Computer Science"
              />
              {editTags && (
                <div className="mp-tags-row" style={{ marginTop: 8 }}>
                  {editTags.split(',').map(t => t.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="mp-tag-chip">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="mp-modal-footer">
              <button className="mp-modal-cancel" onClick={() => setEditPost(null)}>Cancel</button>
              <button className="mp-modal-save" onClick={handleSaveEdit} disabled={saving || !editContent.trim()}>
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}