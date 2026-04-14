import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (val) => {
    if (val && !val.match(/@srmist\.edu\.in$|@srmuniversity\.ac\.in$/)) {
      setEmailError('Only @srmist.edu.in or @srmuniversity.ac.in addresses allowed.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!emailError && email && password) {
    navigate('/home');
  }
};

  return (
    <div className="login-root">
      {/* Background overlay */}
      <div className="login-bg" />

      {/* Left Side */}
      <div className="login-left">
        <div className="brand">
          <h1 className="brand-title">SRM Connect</h1>
          <p className="brand-sub">
            Step into the digital heartbeat of our university. Research, network,
            and thrive in an ecosystem built for the{' '}
            <span className="brand-highlight">Modern Scholar.</span>
          </p>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Academic Hub</h3>
            <p>Connect with professors and peers in focused research communities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Alumni Network</h3>
            <p>Unlock career opportunities through our global alumni database.</p>
          </div>
        </div>

        <div className="scholars-badge">
          <span className="badge-dot" />
          2,401 SCHOLARS ONLINE
        </div>
      </div>

      {/* Right Side — Login Card */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="card-title">Welcome Back</h2>
          <p className="card-sub">Please enter your institutional details.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label>Institutional Email</label>
              <div className="input-wrap">
                <span className="input-icon">@</span>
                <input
                  type="email"
                  placeholder="yourname@srmist.edu.in"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                />
              </div>
              {emailError
                ? <p className="field-error">{emailError}</p>
                : <p className="field-hint">Only @srmist.edu.in or @srmuniversity.ac.in addresses allowed.</p>
              }
            </div>

            <div className="field-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#forgot" className="forgot-link">Forgot Password?</a>
              </div>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-signin">Sign In</button>
          </form>

          <div className="divider"><span>OR CONTINUE WITH</span></div>

          <button className="btn-gsuite">
            <span className="gsuite-icon">G</span>
            University G-Suite
          </button>

          <p className="signup-text">
            New to the connect?{' '}
            <a href="#register" className="signup-link">Create an Account</a>
          </p>

          <div className="card-footer">
            <a href="#terms">Terms of Service</a>
            <span>·</span>
            <a href="#privacy">Privacy Policy</a>
            <span>·</span>
            <a href="#access">Institutional Access</a>
          </div>
        </div>
      </div>
    </div>
  );
}