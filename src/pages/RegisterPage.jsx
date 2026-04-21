import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    terms: false
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const update = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }

    if (!form.email.match(/@srmist\.edu\.in$|@srmuniversity\.ac\.in$/)) {
      setError('Use a valid SRM email.');
      return;
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.terms) {
      setError('Please agree to Terms of Service.');
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Registered successfully!");
        navigate("/"); // go to login
      } else {
        setError(data.message);
      }

    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="rp-root">
      <div className="rp-card">

        {/* LEFT */}
        <div className="rp-left">
          <div className="rp-left-top">
            <div className="rp-brand">
              <span className="rp-brand-name">SRM Connect</span>
            </div>
            <p className="rp-tagline">
              Join the premier digital hub for modern campus life, collaboration, and academic growth.
            </p>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-icon">🎓</div>
            <div>
              <div className="rp-stat-num">10k+ Students</div>
              <div className="rp-stat-sub">Active in various communities</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rp-right">
          <h2 className="rp-title">Create Account</h2>
          <p className="rp-sub">Get started with your student credentials.</p>

          <form className="rp-form" onSubmit={handleSubmit}>
            {error && <div className="rp-error">{error}</div>}

            {/* NAME */}
            <div className="rp-field">
              <label>Full Name</label>
              <div className="rp-input-wrap">
                <span className="rp-icon">👤</span>
                <input
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="rp-field">
              <label>Email Address</label>
              <div className="rp-input-wrap">
                <span className="rp-icon">✉</span>
                <input
                  type="email"
                  placeholder="name@srmist.edu.in"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="rp-row">
              <div className="rp-field">
                <label>Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                  />
                </div>
              </div>

              {/* CONFIRM */}
              <div className="rp-field">
                <label>Confirm</label>
                <div className="rp-input-wrap">
                  <span className="rp-icon">🛡</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={e => update('confirm', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* TERMS */}
            <label className="rp-terms">
              <input
                type="checkbox"
                checked={form.terms}
                onChange={e => update('terms', e.target.checked)}
              />
              I agree to the <button type="button" className="rp-link">Terms</button> and <button type="button" className="rp-link">Privacy Policy</button>.
            </label>

            {/* BUTTON */}
            <button type="submit" className="rp-btn">
              Register Account
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="rp-signin-text">
            Already have an account?{' '}
            <button className="rp-link" onClick={() => navigate('/')}>
              Sign In
            </button>
          </p>

          <div className="rp-footer">
            <span>SECURE ENROLLMENT</span>
            <span>🛡 ✓</span>
          </div>
        </div>

      </div>
    </div>
  );
}