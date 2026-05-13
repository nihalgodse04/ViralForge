import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BorderGlow from '../components/BorderGlow';
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#hero" className="logo">
          <img src={theme === 'light' ? logoLight : logoDark} alt="ViralForge" className="logo-image" />
        </a>

        <div className="nav-links desktop-only">
          <a href="#hero" className="nav-pill active">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>Blog</a>
          <a href="#cta">Join Us</a>
        </div>

        <div className="nav-actions desktop-only">
          <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>Sign In</a>
          <BorderGlow
            className="border-glow-btn"
            edgeSensitivity={30}
            glowColor="268 100 76"
            backgroundColor="#5D3FD3"
            borderRadius={8}
            glowRadius={25}
            glowIntensity={1.0}
            coneSpread={25}
            animated={false}
            colors={['#9D4EDD', '#FF4FD8', '#7B61FF']}
          >
            <button className="btn-get-started" onClick={() => navigate('/auth')}>Get Started</button>
          </BorderGlow>
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className={`theme-icon ${theme}`}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </button>
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#hero" onClick={() => setMobileMenuOpen(false)}>Home</a>
        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        <a href="/blog" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/blog'); }}>Blog</a>
        <a href="#cta" onClick={() => setMobileMenuOpen(false)}>Join Us</a>
        
        <div className="mobile-nav-actions">
          <div className="mobile-theme-row" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div className={`theme-icon ${theme}`}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500' }}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <a href="#" className="login-link" style={{ textAlign: 'center', borderBottom: 'none' }} onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>Sign In</a>
          <BorderGlow
            className="border-glow-btn"
            style={{ width: '100%' }}
            edgeSensitivity={30}
            glowColor="268 100 76"
            backgroundColor="#5D3FD3"
            borderRadius={8}
            glowRadius={25}
            glowIntensity={1.0}
            coneSpread={25}
            animated={false}
            colors={['#9D4EDD', '#FF4FD8', '#7B61FF']}
          >
            <button className="btn-get-started" style={{ width: '100%', padding: '12px' }} onClick={() => navigate('/auth')}>Get Started</button>
          </BorderGlow>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
