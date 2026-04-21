import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const TABS = ['All Posts', 'Rent', 'Resources', 'Events', 'Product', 'Hackathon'];

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

function PostAvatar({ post }) {
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = u?.id || u?._id;
  const isMe = post.userId === userId ||
    (post.userName || '').toLowerCase() === (u?.name || '').toLowerCase();

  const pic = isMe ? u?.profilePic : null;
  const src = pic
    ? (pic.startsWith('http') ? pic : `http://localhost:5000/${pic.replace(/\\/g, '/')}`)
    : null;
  const initial = (post.userName || post.user || 'U')[0].toUpperCase();

  return (
    <div className="hp-author-avatar" style={{ overflow: 'hidden', background: '#0e8888' }}>
      {src
        ? <img src={src} alt="u" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initial
      }
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('All Posts');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
  fetch('http://localhost:5000/api/posts')
    .then(res => res.json())
    .then(data => {
      console.log("API RESPONSE:", data);

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.error("Expected array, got:", data);
        setPosts([]);
      }
    })
    .catch(err => {
      console.error(err);
      setPosts([]);
    });
}, []);
  const filteredPosts = posts.filter(post => {
    const keyword = search.toLowerCase();
    const matchesSearch = !search.trim() ||
      post.tags?.some(tag => tag.toLowerCase().includes(keyword));
    const matchesTab = activeTab === 'All Posts' ||
      post.tags?.some(tag => tag.toLowerCase() === activeTab.toLowerCase());
    return matchesSearch && matchesTab;
  });

  const handleUserClick = (postUser) => {
    if (!postUser) return;
    setSelectedUser(postUser);
    setShowConnectPopup(true);
  };

  const openComment = (post) => {
    setCurrentPost(post);
    setShowCommentBox(true);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
  userName: currentUser?.name || 'You',
  text: commentText,
  createdAt: new Date()
};
    setPosts(prev => prev.map(p =>
      p._id === currentPost._id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    ));
    setCommentText('');
    setShowCommentBox(false);
const res = await fetch(`http://localhost:5000/api/posts/comment/${currentPost._id}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ text: commentText })
});

const updatedPost = await res.json();
setCurrentPost(updatedPost);

setPosts(prev =>
  prev.map(p => p._id === updatedPost._id ? updatedPost : p)
);
  };

  const handleLike = async (postId) => {
    const userId = currentUser?.id || currentUser?._id;
    if (!userId) return;
    setPosts(prev => prev.map(p => {
      if (p._id !== postId) return p;
      const alreadyLiked = p.likedBy?.includes(userId);
      return {
        ...p,
        likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
        likedBy: alreadyLiked
          ? p.likedBy.filter(id => id !== userId)
          : [...(p.likedBy || []), userId],
      };
    }));
const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const updatedPost = await res.json();

setPosts(prev =>
  prev.map(p => p._id === updatedPost._id ? updatedPost : p)
);
  };

  return (
    <div className="hp-root">
      {/* TOP NAV */}
      <header className="hp-topnav">
        <div className="hp-logo">SRM Connect</div>
        <div className="hp-search">
          <span>🔍</span>
          <input
            placeholder="Search ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="hp-nav-right">
          <button className="hp-icon-btn" onClick={() => navigate('/notifications')}>🔔</button>
          <button className="hp-icon-btn" onClick={() => navigate('/messages')}>💬</button>
          <NavAvatar navigate={navigate} />
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

          <div className="hp-grid">
            {/* LEFT: FEED */}
            <div className="hp-feed">
              {filteredPosts.length === 0 ? (
                <div className="hp-empty">No posts yet</div>
              ) : (
                filteredPosts.map(post => (
                  <div key={post._id} className="hp-post-big">
                    <div className="hp-post-big-body">
                      <div className="hp-author-row">
                        <PostAvatar post={post} />
                        <div>
                          <div
                            className="hp-author-name clickable"
                            onClick={() => handleUserClick({
                              userId: post.userId,
                              userName: post.userName || post.user
                            })}
                          >
                            {post.userName || post.user || 'Unknown'}
                          </div>
                          <div className="hp-author-meta">
                            {new Date(post.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <p className="hp-post-body">{post.content}</p>

                      {/* Images */}
                      {post.images?.filter(img => img && img.trim() !== '').length > 0 && (
  <div className="hp-image-grid">
    {post.images
      .filter(img => img && img.trim() !== '')
      .slice(0, 4)
      .map((img, i) => {
        const cleanPath = img.replace(/\\/g, '/').replace(/^\//, '');
        const url = `http://localhost:5000/${cleanPath}`;
        return (
          <img
            key={i}
            src={url}
            className="hp-post-img"
            alt="post"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        );
      })}
  </div>
)}

                      {/* Tags */}
                      <div style={{ marginTop: 8 }}>
                        {post.tags?.map((tag, i) => (
                          <span key={i} style={{ marginRight: 6, color: '#0ea5b0' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="hp-post-actions">
                        <span
                          onClick={() => handleLike(post._id)}
                          className={`hp-action${post.likedBy?.includes(currentUser?.id || currentUser?._id) ? ' liked' : ''}`}
                        >
                          ❤️ {post.likes || 0}
                        </span>
<span
onClick={() => {
  setCurrentPost(post);
  setShowCommentBox(true);
}}
  className="hp-action"
>
  💬 {post.comments?.length || 0}
</span>
                      </div>

                      {/* Comments */}

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hp-small-col">
              <div className="hp-rent-card">
                <div className="hp-rent-header">
                  <span className="hp-tag tag-rent">RENT</span>
                  <span className="hp-rent-price">30k<span>/mo</span></span>
                </div>
                <div className="hp-rent-title">Room available in Green Park</div>
                <p className="hp-rent-body">Looking for a tidy roommate to share a 2BHK. 5 mins walk from Campus Gate 3. Fully furnished with AC.</p>
                <div className="hp-rent-location">📍 Potheri, Chennai</div>
                <button className="hp-contact-btn">Contact Owner</button>
              </div>

              <div className="hp-product-card">
                <img src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80" alt="book" className="hp-product-img" />
                <div className="hp-product-info">
                  <span className="hp-tag tag-products">PRODUCTS</span>
                  <div className="hp-product-title">Engineering Physics Vol 1 & 2</div>
                  <div className="hp-product-row">
                    <span className="hp-product-by">By Sarah J.</span>
                    <button className="hp-cart-btn">🛒</button>
                  </div>
                  <div className="hp-product-price">400</div>
                </div>
              </div>

              <div className="hp-event-card">
                <div className="hp-tag tag-events">EVENTS</div>
                <div className="hp-event-title">HackSRM 2026</div>
                <p className="hp-event-body">Join the biggest 36-hour hackathon on campus. Prizes worth $5000+ up for grabs!</p>
                <div className="hp-event-meta">
                  <span>📅 Oct 12-14</span>
                  <span>👥 450 Registered</span>
                </div>
                <button className="hp-register-btn">Register Now</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAB */}
      <button className="hp-fab" onClick={() => navigate('/uploadpost')}>+</button>

      {/* COMMENT MODAL */}
{showCommentBox && currentPost && (
  <div className="hp-modal-overlay">
    <div className="hp-modal">
      <h3>Comments</h3>

      {/* Existing comments */}
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 10 }}>
        {currentPost.comments?.length > 0 ? (
          currentPost.comments.map((c, i) => (
            <div key={i}>
              <b>{c.userName}</b>: {c.text}
            </div>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </div>

      {/* Add new comment */}
      <textarea
        placeholder="Write something..."
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
      />

      <div className="hp-modal-actions">
        <button onClick={() => setShowCommentBox(false)}>Close</button>
        <button onClick={submitComment}>Post</button>
      </div>
    </div>
  </div>
)}

      {/* CONNECT POPUP */}
      {showConnectPopup && (
        <div className="hp-modal-overlay">
          <div className="hp-modal">
            <h3>Connect</h3>
            <p>Connect with <b>{selectedUser?.userName}</b>?</p>
            <div className="hp-modal-actions">
              <button onClick={() => setShowConnectPopup(false)}>Cancel</button>
              <button onClick={() => {
  if (!selectedUser?.userId) {
    alert("Can't chat with this user — missing profile data.");
    return;
  }
  setShowConnectPopup(false);
  navigate('/messages', {
    state: {
      userId: selectedUser.userId,
      userName: selectedUser.userName
    }
  });
}}>Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}