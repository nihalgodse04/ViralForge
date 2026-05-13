import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import './Navbar.css';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <img src={theme === 'light' ? logoLight : logoDark} alt="ViralForge" className="logo-image" />
        </div>

        <div className="nav-links desktop-only">
          <div className="nav-pill active">Products</div>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About <span className="chevron">v</span></a>
          <a href="#resources">Resources</a>
        </div>

        <div className="nav-actions desktop-only">
          <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>Sign In</a>
          <button className="btn-get-started" onClick={() => navigate('/auth')}>Get Started</button>
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className={`theme-icon ${theme}`}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
          </button>
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#products" onClick={() => setMobileMenuOpen(false)}>Products</a>
        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
        <a href="#resources" onClick={() => setMobileMenuOpen(false)}>Resources</a>
        <div className="mobile-nav-actions">
          <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>Sign In</a>
          <button className="btn-get-started" style={{ width: '100%' }} onClick={() => navigate('/auth')}>Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
