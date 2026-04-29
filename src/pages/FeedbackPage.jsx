import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FeedbackPage.css';

const NAV = [
  { icon: '🏠', label: 'Home', path: '/home' },
  { icon: '📅', label: 'My Details', path: '/mydetails' },
  { icon: '📚', label: 'Messages', path: '/messages' },
  { icon: '📝', label: 'My Posts', path: '/myposts' },
  { icon: '⚙️', label: 'Settings', path: '/settings' },
];

const CATEGORIES = [
  { value: '', label: 'Select a category' },
  { value: 'bug', label: '🐛 Bug Report' },
  { value: 'feature', label: '✨ Feature Request' },
  { value: 'ui', label: '🎨 UI / UX Feedback' },
  { value: 'content', label: '📄 Content Issue' },
  { value: 'other', label: '💬 Other' },
];

const RATINGS = [
  { value: 5, emoji: '😍', label: 'Love it' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '😕', label: 'Poor' },
  { value: 1, emoji: '😠', label: 'Bad' },
];

const TITLE_MAX = 80;
const FEEDBACK_MAX = 500;

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
          </span>}
    </div>
  );
}

export default function FeedbackPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: '',
    title: '',
    feedback: '',
    rating: null,
    anonymous: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.category) e.category = 'Please select a category.';
    if (!form.title.trim()) e.title = 'Title is required.';
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters.';
    else if (form.title.length > TITLE_MAX) e.title = `Title must be under ${TITLE_MAX} characters.`;
    if (!form.feedback.trim()) e.feedback = 'Feedback message is required.';
    else if (form.feedback.trim().length < 20) e.feedback = 'Please write at least 20 characters.';
    else if (form.feedback.length > FEEDBACK_MAX) e.feedback = `Feedback must be under ${FEEDBACK_MAX} characters.`;
    if (!form.rating) e.rating = 'Please rate your experience.';
    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
  const e = validate();
  if (Object.keys(e).length > 0) { setErrors(e); return; }

  setSubmitting(true);

  try {
    const token = localStorage.getItem('token'); // adjust key if yours differs
    const res = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrors({ feedback: data.message || 'Submission failed. Try again.' });
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
  } catch (err) {
    setErrors({ feedback: 'Network error. Please try again.' });
  }

  setSubmitting(false);
};

  const handleReset = () => {
    setForm({ category: '', title: '', feedback: '', rating: null, anonymous: false });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="fp-root">
      {/* TOP NAV */}
      <header className="fp-topnav">
        <div className="fp-logo">SRM Connect</div>
        <div className="fp-nav-right">
          <button className="fp-icon-btn">🔔</button>
          <button className="fp-icon-btn" onClick={() => navigate('/messages')}>💬</button>
          <NavAvatar navigate={navigate} />
        </div>
      </header>

      <div className="fp-body">
        {/* SIDEBAR */}
        <aside className="fp-sidebar">
          <div className="fp-brand-block">
            <div className="fp-brand-title">SRM Connect</div>
            <div className="fp-brand-sub">Student Portal</div>
          </div>
          <nav className="fp-nav">
            {NAV.map(item => (
              <button
                key={item.label}
                className="fp-nav-item"
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="fp-main">
          {submitted ? (
            /* ── SUCCESS STATE ── */
            <div className="fp-success-card">
              <div className="fp-success-icon">🎉</div>
              <h2 className="fp-success-title">Thank you for your feedback!</h2>
              <p className="fp-success-sub">
                Your response has been recorded. We'll use it to make SRM Connect better for everyone.
              </p>
              <div className="fp-success-actions">
                <button className="fp-btn-primary" onClick={() => navigate('/home')}>
                  Back to Home
                </button>
                <button className="fp-btn-outline" onClick={handleReset}>
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="fp-page-header">
                <h1 className="fp-page-title">Share Feedback</h1>
                <p className="fp-page-sub">Help us improve SRM Connect for the entire campus community</p>
              </div>

              <div className="fp-form-card">

                {/* RATING */}
                <div className={`fp-field${errors.rating ? ' has-error' : ''}`}>
                  <label className="fp-label">Overall Experience <span className="fp-required">*</span></label>
                  <div className="fp-rating-row">
                    {RATINGS.map(r => (
                      <button
                        key={r.value}
                        type="button"
                        className={`fp-rating-btn${form.rating === r.value ? ' selected' : ''}`}
                        onClick={() => handleChange('rating', r.value)}
                      >
                        <span className="fp-rating-emoji">{r.emoji}</span>
                        <span className="fp-rating-label">{r.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.rating && <div className="fp-error">{errors.rating}</div>}
                </div>

                {/* CATEGORY */}
                <div className={`fp-field${errors.category ? ' has-error' : ''}`}>
                  <label className="fp-label">Category <span className="fp-required">*</span></label>
                  <select
                    className="fp-select"
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value} disabled={c.value === ''}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="fp-error">{errors.category}</div>}
                </div>

                {/* TITLE */}
                <div className={`fp-field${errors.title ? ' has-error' : ''}`}>
                  <label className="fp-label">
                    Title <span className="fp-required">*</span>
                    <span className="fp-char-count">
                      {form.title.length}/{TITLE_MAX}
                    </span>
                  </label>
                  <input
                    className="fp-input"
                    placeholder="e.g. Search doesn't filter by tags correctly"
                    value={form.title}
                    maxLength={TITLE_MAX}
                    onChange={e => handleChange('title', e.target.value)}
                  />
                  {errors.title && <div className="fp-error">{errors.title}</div>}
                </div>

                {/* FEEDBACK */}
                <div className={`fp-field${errors.feedback ? ' has-error' : ''}`}>
                  <label className="fp-label">
                    Your Feedback <span className="fp-required">*</span>
                    <span className={`fp-char-count${form.feedback.length >= FEEDBACK_MAX ? ' limit' : ''}`}>
                      {form.feedback.length}/{FEEDBACK_MAX}
                    </span>
                  </label>
                  <textarea
                    className="fp-textarea"
                    placeholder="Describe your feedback in detail. What happened? What did you expect?"
                    value={form.feedback}
                    maxLength={FEEDBACK_MAX}
                    onChange={e => handleChange('feedback', e.target.value)}
                    rows={5}
                  />
                  {form.feedback.length >= FEEDBACK_MAX && (
                    <div className="fp-warning">Character limit reached</div>
                  )}
                  {errors.feedback && <div className="fp-error">{errors.feedback}</div>}
                </div>

                {/* ANONYMOUS TOGGLE */}
                <div className="fp-field fp-anon-row">
                  <label className="fp-toggle-label">
                    <div className="fp-toggle-info">
                      <span className="fp-toggle-title">Submit anonymously</span>
                      <span className="fp-toggle-sub">Your name won't be shown with this feedback</span>
                    </div>
                    <div
                      className={`fp-toggle${form.anonymous ? ' on' : ''}`}
                      onClick={() => handleChange('anonymous', !form.anonymous)}
                    >
                      <div className="fp-toggle-thumb" />
                    </div>
                  </label>
                </div>

                {/* ACTIONS */}
                <div className="fp-form-actions">
                  <button
                    type="button"
                    className="fp-btn-outline"
                    onClick={handleReset}
                    disabled={submitting}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="fp-btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="fp-spinner" />
                    ) : 'Submit Feedback'}
                  </button>
                </div>

              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
