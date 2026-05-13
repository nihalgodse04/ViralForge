import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import PlanModal from '../components/PlanModal';
import '../styles/dashboard.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showThemeHint, setShowThemeHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowThemeHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, []);

  // Close sidebar on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener('open-plan-modal', handleOpenModal);
    return () => window.removeEventListener('open-plan-modal', handleOpenModal);
  }, []);

  return (
    <div className="dash-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <PlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="dash-main">
        <div className="dash-topbar">
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleTheme}
              className="dash-theme-toggle"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {showThemeHint && (
              <div className="theme-hint-tooltip">
                Change Theme
              </div>
            )}
          </div>
        </div>

        <div className="dash-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .theme-hint-tooltip {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 14px;
          background: var(--dash-primary);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 6px 20px rgba(123, 97, 255, 0.3);
          animation: bounceHint 2s infinite, dashFadeIn 0.4s ease-out;
          pointer-events: none;
          z-index: 100;
        }

        .theme-hint-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          right: 14px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent var(--dash-primary) transparent;
        }

        @keyframes bounceHint {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
