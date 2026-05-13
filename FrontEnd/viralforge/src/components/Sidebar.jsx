import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, FolderKanban, LayoutTemplate,
  Clock, Heart, ChevronDown, Zap, Menu, X
} from 'lucide-react';
import { userAPI } from '../services/api';
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import '../styles/sidebar.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Sparkles, label: 'AI Generator', path: '/dashboard/generator' },
  { icon: FolderKanban, label: 'My Projects', path: '/dashboard/projects' },
  // { icon: LayoutTemplate,  label: 'Templates',    path: '/dashboard/templates' },
  { icon: Clock, label: 'History', path: '/dashboard/history' },
  { icon: Heart, label: 'Favorites', path: '/dashboard/favorites' },
];

const NavItem = memo(({ item, active, onClick }) => (
  <button
    className={`sidebar-nav-item ${active ? 'active' : ''}`}
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
  >
    <span className="nav-item-icon"><item.icon size={18} /></span>
    {item.label}
  </button>
));

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userName = sessionStorage.getItem('user_name') || 'Creator';
  const userEmail = sessionStorage.getItem('user_email') || '';
  const userInitials = userName.substring(0, 2).toUpperCase();

  const isActive = useCallback((path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  /* ── Credits ── */
  const [credits, setCredits] = useState({ credits: 0, max_credits: 10000 });

  useEffect(() => {
    let cancelled = false;
    userAPI.getCredits()
      .then(res => { if (!cancelled) setCredits(res.data); })
      .catch(() => { });
    return () => { cancelled = true; };
  }, []);

  // Live credit sync — fired by regeneration/generation flows
  useEffect(() => {
    const handler = (e) => {
      const { credits: newCredits } = e.detail || {};
      if (newCredits !== undefined) {
        setCredits(prev => ({ ...prev, credits: newCredits }));
      }
    };
    window.addEventListener('credits-updated', handler);
    return () => window.removeEventListener('credits-updated', handler);
  }, []);

  const progress = Math.min((credits.credits / credits.max_credits) * 100, 100);

  const handleNavClick = useCallback((path) => {
    navigate(path);
    if (window.innerWidth <= 1024) onToggle();
  }, [navigate, onToggle]);

  const openPlanModal = () => {
    window.dispatchEvent(new CustomEvent('open-plan-modal'));
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-mobile-toggle"
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Dim overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onToggle}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={logoLight} className="sidebar-logo-img light-only" alt="ViralForge" />
          <img src={logoDark} className="sidebar-logo-img dark-only" alt="ViralForge" />
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavItem
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onClick={() => handleNavClick(item.path)}
            />
          ))}
        </nav>

        {/* Credits card */}
        <div className="sidebar-pro-card">
          <div className="pro-badge">
            <Sparkles size={13} />
            Pro Plan
          </div>
          <div className="credits-label">Credits Left</div>
          <div className="credits-value">
            <span className="credits-number">{credits.credits.toLocaleString()}</span>
            <span className="credits-total">/{credits.max_credits.toLocaleString()}</span>
          </div>
          <div className="credits-bar-track">
            <div className="credits-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <button className="btn-upgrade" onClick={openPlanModal}>Upgrade Plan</button>
        </div>

        {/* User profile */}
        <div
          className="sidebar-user"
          onClick={() => handleNavClick('/dashboard/profile')}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-user-avatar">{userInitials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-email">{userEmail}</div>
          </div>
          <button className="sidebar-user-more" aria-label="User menu">
            <ChevronDown size={16} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
