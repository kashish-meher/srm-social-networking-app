import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ UPDATED HANDLE SUBMIT (CONNECTED TO BACKEND)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.match(/@srmist\.edu\.in$|@srmuniversity\.ac\.in$/)) {
      setError('Only SRM emails allowed.');
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store token
        localStorage.setItem("token", data.token);

        // optional: store user info
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate('/home');
      } else {
        setError(data.message);
      }

    } catch (err) {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="lp-root">
      <div className="lp-card">

        {/* LEFT PANEL */}
        <div className="lp-left">
          <div className="lp-left-top">
            <div className="lp-brand">
              <div className="lp-brand-icon">✳</div>
              <span>SRM Connect</span>
            </div>
            <h1 className="lp-headline">
              Bridge your academic journey with the community.
            </h1>
            <p className="lp-tagline">
              Access courses, events, and campus discussions in one unified student hub.
            </p>
          </div>

          <div className="lp-testimonial">
            <p className="lp-quote">
              "The easiest way to stay updated with campus life. Everything I need is right here."
            </p>
            <div className="lp-testimonial-author">
              <div className="lp-author-avatar">A</div>
              <div>
                <div className="lp-author-name">Ananya Sharma</div>
                <div className="lp-author-role">Computer Science Major</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lp-right">
          <h2 className="lp-title">Welcome Back</h2>
          <p className="lp-sub">
            Please enter your credentials to access your portal
          </p>

          <form className="lp-form" onSubmit={handleSubmit}>
            {error && <div className="lp-error">{error}</div>}

            {/* EMAIL */}
            <div className="lp-field">
              <label>University Email</label>
              <div className="lp-input-wrap">
                <span className="lp-input-icon">✉</span>
                <input
                  type="email"
                  placeholder="reg_number@srmist.edu.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="lp-field">
              <div className="lp-field-header">
                <label>Password</label>
                <button type="button" className="lp-forgot">
                  Forgot Password?
                </button>
              </div>

              <div className="lp-input-wrap">
                <span className="lp-input-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <label className="lp-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Keep me logged in for 30 days
            </label>

            {/* SUBMIT */}
            <button type="submit" className="lp-btn-signin">
              Sign In to SRM Connect →
            </button>
          </form>

          <div className="lp-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <button className="lp-btn-google">
            <span className="lp-google-icon">G</span>
            Google Workspace
          </button>

          <p className="lp-signup-text">
            Don't have an account?{' '}
            <button
              className="lp-link-btn"
              onClick={() => navigate('/register')}
            >
              Register Now
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}