import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, CreditCard, Edit2, Zap, ShieldCheck, LogOut } from 'lucide-react';
import { dashboardAPI, userAPI } from '../services/api';
import '../styles/profile.css';

const ProfilePage = () => {
  const [stats, setStats] = useState({ total_projects: 0, total_generations: 0 });
  const [credits, setCredits] = useState({ credits: 0, max_credits: 10000 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = sessionStorage.getItem('user_name') || 'Creator';
  const userEmail = sessionStorage.getItem('user_email') || 'creator@example.com';
  const userInitials = userName.substring(0, 2).toUpperCase();
  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); // Mocked for now

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [statsRes, creditsRes] = await Promise.all([
          dashboardAPI.getStats(),
          userAPI.getCredits()
        ]);
        if (!cancelled) {
          setStats(statsRes.data);
          setCredits(creditsRes.data);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Live credit sync — fires when generation/regeneration happens anywhere
  useEffect(() => {
    const handler = (e) => {
      const { credits: newCredits, total_generations: newGens } = e.detail || {};
      if (newCredits !== undefined) {
        setCredits(prev => ({ ...prev, credits: newCredits }));
      }
      if (newGens !== undefined) {
        setStats(prev => ({ ...prev, total_generations: newGens }));
      }
    };
    window.addEventListener('credits-updated', handler);
    return () => window.removeEventListener('credits-updated', handler);
  }, []);

  const openPlanModal = () => {
    window.dispatchEvent(new CustomEvent('open-plan-modal'));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/auth');
  };

  const progress = Math.min(((credits.max_credits - credits.credits) / credits.max_credits) * 100, 100) || 0;

  if (loading) {
    return (
      <div className="dash-animate-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spin-animation" style={{ color: 'var(--dash-primary)' }}><Zap size={32} /></div>
      </div>
    );
  }

  return (
    <div className="profile-page dash-animate-in">
      <div className="profile-header">
        <h1 className="dash-page-title">My Profile</h1>
        <p className="dash-page-subtitle">Manage your account settings and subscription plan.</p>
      </div>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card dash-card">
          <div className="profile-avatar-large">
            {userInitials}
            <button className="profile-edit-avatar" aria-label="Edit avatar">
              <Edit2 size={14} />
            </button>
          </div>
          
          <h2 className="profile-name">{userName}</h2>
          <p className="profile-email">{userEmail}</p>

          <div className="profile-badge-plan">Free Plan</div>

          <div className="profile-stats">
            <div className="profile-stat-item">
              <span className="stat-value">{stats.total_generations}</span>
              <span className="stat-label">Generations</span>
            </div>
            <div className="profile-stat-divider"></div>
            <div className="profile-stat-item">
              <span className="stat-value">{credits.credits.toLocaleString()}</span>
              <span className="stat-label">Credits Left</span>
            </div>
          </div>
          
          <button className="dash-btn-outline" style={{ width: '100%', marginTop: '16px' }} onClick={() => alert("Edit profile UI only.")}>
            Edit Profile
          </button>
          
          <button 
            className="dash-btn-outline" 
            style={{ width: '100%', marginTop: '12px', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }} 
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="profile-details-column">
          {/* Account Information */}
          <div className="dash-card profile-details-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Account Information</h3>
            </div>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon"><User size={18} /></div>
                <div className="info-content">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{userName}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon"><Mail size={18} /></div>
                <div className="info-content">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{userEmail}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><Calendar size={18} /></div>
                <div className="info-content">
                  <span className="info-label">Joined</span>
                  <span className="info-value">{joinedDate}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><ShieldCheck size={18} /></div>
                <div className="info-content">
                  <span className="info-label">Account Status</span>
                  <span className="info-value" style={{ color: '#22C55E' }}>Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Information */}
          <div className="dash-card profile-plan-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Plan & Billing</h3>
            </div>

            <div className="plan-banner">
              <div className="plan-banner-left">
                <div className="plan-icon"><CreditCard size={24} /></div>
                <div>
                  <h4 className="plan-name">Free Plan</h4>
                  <p className="plan-desc">Standard AI limits</p>
                </div>
              </div>
              <button className="dash-btn-primary" onClick={openPlanModal}>
                <Zap size={16} /> Upgrade Plan
              </button>
            </div>

            <div className="plan-usage">
              <div className="usage-header">
                <span className="usage-title">Credits Usage</span>
                <span className="usage-numbers">
                  <strong>{credits.credits.toLocaleString()}</strong> / {credits.max_credits.toLocaleString()} left
                </span>
              </div>
              
              <div className="usage-bar-track">
                <div className="usage-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="usage-hint">You have used {progress.toFixed(1)}% of your available credits.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
