import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import SigninBG from '../assets/SigninBG.png';
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email)    { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    if (!isLogin) {
      if (!name) { setError('Full Name is required.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match!'); return; }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await authAPI.login({ username: email, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        localStorage.setItem('user_name', res.data.name);
        localStorage.setItem('user_email', res.data.email);
        navigate('/dashboard');
      } else {
        await authAPI.register({ email, password, name, username: email });
        alert('Registration successful! Please sign in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Authentication failed';
      if (data) {
        if (data.detail) {
          msg = data.detail;
        } else if (typeof data === 'object') {
          const first = Object.values(data)[0];
          msg = Array.isArray(first) ? first[0] : first;
        }
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Unleash Your Content.</h1>
          <p>Join 1000+ creators building their brand with AI</p>
          <div className="auth-image-placeholder" style={{ marginTop: 36 }}>
            <img
              src={SigninBG}
              alt="ViralForge Dashboard Preview"
              loading="lazy"
              width="600"
            />
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo-wrapper">
            <img src={logoLight} className="auth-logo light-theme-logo" alt="ViralForge Logo" width="120" height="44" />
            <img src={logoDark}  className="auth-logo dark-theme-logo"  alt="ViralForge Logo" width="120" height="44" />
          </div>

          <div className="auth-header">
            <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p>{isLogin ? 'Please enter your details to sign in.' : 'Join ViralForge and unleash your content.'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="auth-name">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="auth-password">Password</label>
                {isLogin && <a href="#" className="forgot-password">Forgot password?</a>}
              </div>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="auth-confirm">Confirm Password</label>
                <input
                  id="auth-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            )}

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? 'Please wait…' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <div className="social-login">
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <GoogleLogin
                onSuccess={res => console.log(res)}
                onError={() => console.log('Login Failed')}
                shape="pill"
                size="medium"
                theme="outline"
                text={isLogin ? 'signin_with' : 'signup_with'}
                width="250"
              />
            </div>
          </div>

          <p className="auth-footer">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <a href="#" onClick={e => { e.preventDefault(); setIsLogin(p => !p); }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
