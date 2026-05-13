import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FolderKanban, Clock, TrendingUp } from 'lucide-react';
import DotGrid from '../components/DotGrid';
import { dashboardAPI } from '../services/api';

/* ── Skeleton loader for stat cards ── */
const StatSkeleton = () => (
  <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'default' }}>
    <div className="dash-skeleton" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
    <div style={{ flex: 1 }}>
      <div className="dash-skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
      <div className="dash-skeleton" style={{ height: 24, width: '40%' }} />
    </div>
  </div>
);

/* ── Memoised stat card ── */
const StatCard = memo(({ stat }) => (
  <div
    className="dash-card"
    style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'default' }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: `${stat.color}18`, border: `1px solid ${stat.color}35`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: stat.color, flexShrink: 0,
    }}>
      <stat.icon size={20} />
    </div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--dash-muted)', marginBottom: 2 }}>
        {stat.label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: 'var(--dash-text)' }}>
        {stat.value}
      </div>
    </div>
  </div>
));

const STATS_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 16,
  marginBottom: 28,
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem('user_name') || 'Creator';

  const [stats, setStats] = useState({
    total_projects: 0,
    total_generations: 0,
    hours_saved: 0,
    engagement_rate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await dashboardAPI.getStats();
        if (!cancelled) setStats(res.data);
      } catch {
        // fail silently; stats stay at default
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const dashboardStats = [
    { icon: FolderKanban, label: 'Total Projects',   value: stats.total_projects,   color: '#7B61FF' },
    { icon: Sparkles,     label: 'AI Generations',   value: stats.total_generations, color: '#FF4FD8' },
    { icon: Clock,        label: 'Hours Saved',       value: `${stats.hours_saved}h`, color: '#2ED3FF' },
    { icon: TrendingUp,   label: 'Engagement Rate',   value: `+${stats.engagement_rate}%`, color: '#22C55E' },
  ];

  return (
    <div className="dash-animate-in">
      <h1 className="dash-page-title">Welcome back, {userName} 👋</h1>
      <p className="dash-page-subtitle" style={{ marginBottom: 28 }}>
        Ready to create viral content? Let's get started.
      </p>

      {/* Stats Grid */}
      <div style={STATS_GRID} className="dash-stagger">
        {loading
          ? [0, 1, 2, 3].map(i => <StatSkeleton key={i} />)
          : dashboardStats.map((stat, i) => <StatCard key={i} stat={stat} />)
        }
      </div>

      {/* CTA Box with DotGrid */}
      <div
        className="dash-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(36px, 6vw, 60px) 20px',
          textAlign: 'center',
          border: '1px solid rgba(123, 97, 255, 0.2)',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        {/* Dot grid background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.55 }}>
          <DotGrid
            dotSize={2}
            gap={16}
            baseColor="#9BA6C7"
            activeColor="#FF4FD8"
            proximity={100}
            shockRadius={150}
            shockStrength={4}
            resistance={750}
            returnDuration={2.5}
          />
        </div>

        {/* Aurora blobs */}
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 500, margin: '0 auto' }}>
          <h3 style={{
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 800,
            marginBottom: 12,
            color: 'var(--dash-text)',
            letterSpacing: '-0.5px',
          }}>
            Unleash Your Content
          </h3>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 16px)',
            color: 'var(--dash-muted)',
            lineHeight: 1.6,
          }}>
            Generate high-performing scripts, viral hooks, and trending hashtags
            in seconds with our AI agent.
          </p>
        </div>

        <button
          className="dash-btn-primary"
          style={{ position: 'relative', zIndex: 1, padding: '13px 32px', fontSize: 16 }}
          onClick={() => navigate('/dashboard/generator')}
        >
          <Sparkles size={19} />
          Go to agent
        </button>
      </div>

      <style>{`
        .aurora-blob {
          position: absolute;
          filter: blur(60px);
          z-index: 0;
          opacity: 0.45;
          animation: aurora-float 10s infinite alternate ease-in-out;
          pointer-events: none;
          will-change: transform;
        }
        .aurora-blob-1 {
          top: -30%; left: 10%;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(123,97,255,0.6) 0%, rgba(123,97,255,0) 70%);
        }
        .aurora-blob-2 {
          bottom: -30%; right: 10%;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(255,79,216,0.6) 0%, rgba(255,79,216,0) 70%);
          animation-delay: -5s;
        }
        @keyframes aurora-float {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(30px,-20px) scale(1.08); }
          100% { transform: translate(-20px,30px) scale(0.93); }
        }
        @media (max-width: 480px) {
          .aurora-blob-1, .aurora-blob-2 { width: 180px; height: 180px; }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;