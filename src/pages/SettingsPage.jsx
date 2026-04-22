import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      width: 42, height: 24, borderRadius: 12, cursor: 'pointer',
      background: checked ? '#0e8888' : '#cbd5e1',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      position: 'absolute', top: 3, left: checked ? 21 : 3,
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </div>
);

const API = 'http://localhost:5000/api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser?.id || currentUser?._id;
  const currentUserName = currentUser?.name || 'User';
  const currentUserEmail = currentUser?.email || '';

  const [prefs, setPrefs] = useState({
    privateProfile: false,
    pushNotifications: true,
    showOnlineStatus: true,
  });
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [website, setWebsite] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');
  const [editingWebsite, setEditingWebsite] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [editingLocation, setEditingLocation] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [joinedDate, setJoinedDate] = useState('');

  // Load from MongoDB on mount
  useEffect(() => {
    if (!userId) return;
    fetch(`${API}/auth/profile/${userId}`)
      .then(r => r.json())
      .then(user => {
        if (user.prefs) setPrefs(user.prefs);
        if (user.bio) { setBio(user.bio); setBioInput(user.bio); }
        if (user.website) { setWebsite(user.website); setWebsiteInput(user.website); }
        if (user.location) { setUserLocation(user.location); setLocationInput(user.location); }
        if (user.profilePic) setProfilePic(user.profilePic);
        if (user.createdAt) setJoinedDate(user.createdAt);

        // Sync localStorage user with latest from DB
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, profilePic: user.profilePic, bio: user.bio, location: user.location, website: user.website }));
      })
      .catch(() => {
        // fallback to localStorage
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        if (stored.profilePic) setProfilePic(stored.profilePic);
        if (stored.bio) { setBio(stored.bio); setBioInput(stored.bio); }
        if (stored.location) { setUserLocation(stored.location); setLocationInput(stored.location); }
        if (stored.website) { setWebsite(stored.website); setWebsiteInput(stored.website); }
      });
  }, [userId]);

  const showSaved = () => {
    setSavedMsg('Saved ✓');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const saveToBackend = async (data) => {
    try {
      const res = await fetch(`${API}/auth/settings/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      // Keep localStorage in sync
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, ...data }));
      showSaved();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  // Auto-save prefs on toggle
  const updatePref = (key, val) => {
    const newPrefs = { ...prefs, [key]: val };
    setPrefs(newPrefs);
    saveToBackend({ prefs: newPrefs, bio, website, location: userLocation });
  };

  // Bio
  const handleBioSave = () => {
    const trimmed = bioInput.trim();
    setBio(trimmed);
    setEditingBio(false);
    saveToBackend({ prefs, bio: trimmed, website, location: userLocation });
  };

  // Website
  const handleWebsiteSave = () => {
    let url = websiteInput.trim();
    if (url && !url.startsWith('http')) url = 'https://' + url;
    setWebsite(url);
    setWebsiteInput(url);
    setEditingWebsite(false);
    saveToBackend({ prefs, bio, website: url, location: userLocation });
  };
  const handleWebsiteDelete = () => {
    setWebsite(''); setWebsiteInput(''); setEditingWebsite(false);
    saveToBackend({ prefs, bio, website: '', location: userLocation });
  };

  // Location
  const handleLocationSave = () => {
    const loc = locationInput.trim();
    setUserLocation(loc); setEditingLocation(false);
    saveToBackend({ prefs, bio, website, location: loc });
  };
  const handleLocationDelete = () => {
    setUserLocation(''); setLocationInput(''); setEditingLocation(false);
    saveToBackend({ prefs, bio, website, location: '' });
  };

  // Profile pic upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      const res = await fetch(`${API}/auth/upload-profile-pic/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.profilePicUrl) {
        setProfilePic(data.profilePicUrl);
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.profilePic = data.profilePicUrl;
        localStorage.setItem('user', JSON.stringify(stored));
        showSaved();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const avatarSrc = profilePic
    ? (profilePic.startsWith('http') ? profilePic : `${API.replace('/api', '')}/${profilePic.replace(/\\/g, '/')}`)
    : null;

  const inputStyle = {
    border: '1.5px solid #0e8888', borderRadius: 6, padding: '6px 10px',
    fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif', width: '100%',
  };
  const saveBtnStyle = {
    padding: '5px 12px', background: '#0e8888', color: 'white',
    border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600,
  };
  const cancelBtnStyle = {
    padding: '5px 10px', background: 'none', border: '1px solid #e2e8f0',
    borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#64748b',
  };
  const deleteBtnStyle = {
    padding: '5px 10px', background: 'none', border: '1px solid #fee2e2',
    borderRadius: 6, fontSize: 12, cursor: 'pointer', color: '#dc2626',
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#f0f4f8' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');`}</style>

      {/* TOP NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px', height: 52 }}>
        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0e8888', minWidth: 130 }}>SRM Connect</div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>🔔</button>
          <button onClick={() => navigate('/messages')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 17, padding: 6, borderRadius: 8 }}>💬</button>
          {/* Profile pic in topnav */}
          <div
            onClick={() => navigate('/settings')}
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#0e8888', overflow: 'hidden', cursor: 'pointer', border: '2px solid #0e8888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {avatarSrc
              ? <img src={avatarSrc} alt="u" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>{currentUserName?.[0]?.toUpperCase()}</span>
            }
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', maxWidth: 1100, margin: '0 auto', padding: '20px 16px', gap: 20, width: '100%' }}>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 72, alignSelf: 'start' }}>
          <div style={{ padding: '12px 8px 16px' }}>
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0e8888' }}>SRM Connect</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Student Portal</div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(item => (
              <button key={item.label} onClick={() => navigate(item.path)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif',
                textAlign: 'left', width: '100%', transition: 'all 0.15s',
                background: location.pathname === item.path ? '#e8f4f4' : 'none',
                color: location.pathname === item.path ? '#0e8888' : '#64748b',
                fontWeight: location.pathname === item.path ? 500 : 400,
              }}>
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main style={{ minWidth: 0 }}>

          {/* BANNER + PROFILE HEADER */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ height: 130, background: 'radial-gradient(ellipse at 20% 50%, #1a1a4e 0%, #0d0d2b 40%, #000510 70%), radial-gradient(circle at 80% 20%, #0e2a5e 0%, transparent 50%)', position: 'relative', overflow: 'hidden' }}>
  {/* Stars */}
  {[...Array(40)].map((_, i) => (
    <div key={i} style={{
      position: 'absolute',
      width: i % 5 === 0 ? 2.5 : 1.5,
      height: i % 5 === 0 ? 2.5 : 1.5,
      borderRadius: '50%',
      background: 'white',
      opacity: 0.4 + Math.random() * 0.6,
      top: `${(i * 37 + 11) % 100}%`,
      left: `${(i * 61 + 7) % 100}%`,
    }} />
  ))}
</div>
            <div style={{ padding: '0 28px 24px', marginTop: -28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 0 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{ width: 88, height: 88, borderRadius: '50%', border: '4px solid white', background: '#0e8888', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
                      onClick={() => fileInputRef.current.click()}
                      title="Click to change photo"
                    >
                      {avatarSrc
                        ? <img src={avatarSrc} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ color: 'white', fontWeight: 700, fontSize: '2rem', fontFamily: 'Sora, sans-serif' }}>{currentUserName?.[0]?.toUpperCase()}</span>
                      }
                    </div>
                    <button
  onClick={() => fileInputRef.current.click()}
  disabled={uploading}
  style={{ position: 'absolute', bottom: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: '#0e8888', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}
>
  {uploading ? '⏳' : '📷'}
</button>
<input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />

{/* Remove profile pic button — only shows when pic exists */}
{avatarSrc && (
  <button
    onClick={async () => {
      setProfilePic('');
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.profilePic = '';
      localStorage.setItem('user', JSON.stringify(stored));
      try {
        await fetch(`${API}/auth/settings/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePic: '' }),
        });
      } catch (err) { console.error(err); }
      showSaved();
    }}
    title="Remove photo"
    style={{
      position: 'absolute', top: 0, right: -2,
      width: 22, height: 22, borderRadius: '50%',
      background: '#dc2626', border: '2px solid white',
      cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: 10, color: 'white', fontWeight: 700,
    }}
  >
    ✕
  </button>
)}
                  </div>

                  <div style={{ paddingBottom: 10 }}>
                    <h2 style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 700, color: '#1e293b', fontFamily: 'Sora, sans-serif' }}>{currentUserName}</h2>
                    <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>{currentUserEmail}</p>
                  </div>
                </div>
                {savedMsg && (
                  <div style={{ paddingBottom: 10, fontSize: 13, color: '#0e8888', fontWeight: 600, background: '#e0f7f8', padding: '6px 14px', borderRadius: 20 }}>
                    {savedMsg}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TWO COLUMN */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

            {/* LEFT — About */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1e293b', fontFamily: 'Sora, sans-serif' }}>About</h3>

                {/* BIO */}
                <div style={{ marginBottom: 14 }}>
                  {editingBio ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <textarea
                        value={bioInput}
                        onChange={e => setBioInput(e.target.value)}
                        rows={4}
                        autoFocus
                        placeholder="Write something about yourself..."
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                      />
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={handleBioSave} style={saveBtnStyle}>Save</button>
                        <button onClick={() => { setEditingBio(false); setBioInput(bio); }} style={cancelBtnStyle}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => { setEditingBio(true); setBioInput(bio); }}
                      style={{ fontSize: 13, color: bio ? '#475569' : '#94a3b8', cursor: 'pointer', lineHeight: 1.6, padding: '8px 10px', borderRadius: 8, border: '1.5px dashed #e2e8f0', minHeight: 60, background: '#fafafa' }}
                    >
                      {bio || 'Click to write about yourself...'}
                    </div>
                  )}
                </div>

                {/* LOCATION */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }}>📍</span>
                    {editingLocation ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                        <input
                          value={locationInput}
                          onChange={e => setLocationInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleLocationSave(); if (e.key === 'Escape') setEditingLocation(false); }}
                          placeholder="e.g. Chennai, India"
                          autoFocus
                          style={inputStyle}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={handleLocationSave} style={saveBtnStyle}>Save</button>
                          <button onClick={() => setEditingLocation(false)} style={cancelBtnStyle}>Cancel</button>
                          {userLocation && <button onClick={handleLocationDelete} style={deleteBtnStyle}>Delete</button>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                        <span
                          onClick={() => { setEditingLocation(true); setLocationInput(userLocation); }}
                          style={{ fontSize: 13, color: userLocation ? '#475569' : '#94a3b8', cursor: 'pointer', flex: 1 }}
                        >
                          {userLocation || 'Add location...'}
                        </span>
                        {userLocation && (
                          <button onClick={handleLocationDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12, padding: 0 }}>✕</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* WEBSITE */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }}>🔗</span>
                    {editingWebsite ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                        <input
                          value={websiteInput}
                          onChange={e => setWebsiteInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleWebsiteSave(); if (e.key === 'Escape') setEditingWebsite(false); }}
                          placeholder="https://yourwebsite.com"
                          autoFocus
                          style={inputStyle}
                        />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={handleWebsiteSave} style={saveBtnStyle}>Save</button>
                          <button onClick={() => setEditingWebsite(false)} style={cancelBtnStyle}>Cancel</button>
                          {website && <button onClick={handleWebsiteDelete} style={deleteBtnStyle}>Delete</button>}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                        {website ? (
                          <>
                            <a href={website} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#0e8888', wordBreak: 'break-all', flex: 1 }}>{website}</a>
                            <button onClick={() => { setEditingWebsite(true); setWebsiteInput(website); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, padding: 0, flexShrink: 0 }}>✏️</button>
                            <button onClick={handleWebsiteDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12, padding: 0, flexShrink: 0 }}>✕</button>
                          </>
                        ) : (
                          <span onClick={() => setEditingWebsite(true)} style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>Add website link...</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* JOINED DATE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15 }}>📅</span>
                  <span style={{ fontSize: 13, color: '#64748b' }}>
                    Joined {new Date(joinedDate || currentUser.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — Preferences */}
            <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: '#1e293b', fontFamily: 'Sora, sans-serif' }}>Preferences</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Manage your account security and notification settings.</p>
              </div>

              <div style={{ padding: '0 24px' }}>
                {[
                  { key: 'privateProfile', icon: '🔒', title: 'Private Profile', desc: 'Only approved students can see your full activity.', type: 'toggle' },
                  { key: 'pushNotifications', icon: '🔔', title: 'Push Notifications', desc: 'Get alerted about event reminders and direct messages.', type: 'toggle' },
                  { key: 'showOnlineStatus', icon: '👁️', title: 'Show Online Status', desc: 'Show others when you are active on the platform.', type: 'toggle' },
                  { key: 'feedback', icon: '📝', title: 'Feedback', desc: 'Share your experience or report issues.', type: 'link', linkText: 'Open' },
                ].map(({ key, icon, title, desc, type, linkText }, idx, arr) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: idx < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f0fdfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{title}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                    </div>
                    {type === 'toggle' && (
                      <Toggle checked={prefs[key] || false} onChange={val => updatePref(key, val)} />
                    )}
                    {type === 'link' && (
  <span
    onClick={() => {
      if (key === 'feedback') navigate('/feedback');
    }}
    style={{ fontSize: 13, fontWeight: 600, color: '#0e8888', cursor: 'pointer' }}
  >
    {linkText}
  </span>
)}
                  </div>
                ))}
              </div>

              {/* Danger zone */}
              <div style={{ margin: '16px 24px 20px', padding: 16, borderRadius: 10, border: '1px solid #fee2e2', background: '#fef2f2' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>Danger Zone</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>Deleting your account is permanent. All your data will be removed from SRM Connect servers.</div>
                <button style={{ padding: '7px 16px', border: '1.5px solid #dc2626', borderRadius: 8, background: 'white', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}