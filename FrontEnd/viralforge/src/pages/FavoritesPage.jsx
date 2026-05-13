import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Zap, Clock, ArrowRight, Loader, AlertCircle, Sparkles, Copy, Check, Trash2, ExternalLink
} from 'lucide-react';
import { projectsAPI } from '../services/api';

/* ── Skeleton for favorite cards ── */
const FavoriteSkeleton = () => (
  <div className="dash-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div className="dash-skeleton" style={{ height: 20, width: '65%' }} />
      <div className="dash-skeleton" style={{ height: 20, width: 50, borderRadius: 12 }} />
    </div>
    <div className="dash-skeleton" style={{ height: 14, width: '100%', marginBottom: 6 }} />
    <div className="dash-skeleton" style={{ height: 14, width: '80%', marginBottom: 20 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--dash-border)', paddingTop: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="dash-skeleton" style={{ height: 20, width: 60, borderRadius: 6 }} />
        <div className="dash-skeleton" style={{ height: 20, width: 80, borderRadius: 6 }} />
      </div>
      <div className="dash-skeleton" style={{ height: 20, width: 20, borderRadius: 4 }} />
    </div>
  </div>
);

/* ── Favorite Project Card ── */
const FavoriteCard = memo(({ project, onToggleFavorite, onClick }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.hook || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleFavorite(project.id);
  };

  return (
    <div
      className="dash-card fav-card"
      style={{ cursor: 'pointer', position: 'relative' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, flex: 1, marginRight: 12, color: 'var(--dash-text)' }}>
          {project.title}
        </h3>
        <button 
          className="fav-toggle-btn active" 
          onClick={handleToggle}
          title="Remove from favorites"
          style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 4 }}
        >
          <Heart size={18} fill="#ff4d4f" />
        </button>
      </div>

      {project.hook && (
        <p style={{
          fontSize: 13, color: 'var(--dash-muted)', lineHeight: 1.5, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {project.hook}
        </p>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid var(--dash-border)', paddingTop: 12, marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, color: 'var(--dash-primary)',
            background: 'rgba(123,97,255,0.09)', padding: '3px 8px',
            borderRadius: 6, fontWeight: 600,
          }}>
            {project.platform || 'Reel'}
          </span>
          {project.viral_score > 0 && (
            <span style={{ fontSize: 12, color: project.viral_score >= 70 ? '#22C55E' : '#FFAB00', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={11} />{project.viral_score}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="dash-btn-ghost" onClick={handleCopy} style={{ padding: '4px', borderRadius: '4px' }}>
            {isCopied ? <Check size={14} style={{ color: '#22C55E' }} /> : <Copy size={14} />}
          </button>
          <button className="dash-btn-ghost" onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ padding: '4px', borderRadius: '4px' }}>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .fav-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fav-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.15);
        }
        .fav-toggle-btn {
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .fav-toggle-btn:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
});

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 18,
};

const FavoritesPage = () => {
  const navigate  = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getFavorites();
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id) => {
    // Optimistic UI update
    const originalProjects = [...projects];
    setProjects(projects.filter(p => p.id !== id));

    try {
      await projectsAPI.toggleFavorite(id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      setProjects(originalProjects); // Rollback
    }
  };

  return (
    <div className="dash-animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 className="dash-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Heart size={26} style={{ color: '#ff4d4f', flexShrink: 0 }} />
            Favorite Projects
          </h1>
          <p className="dash-page-subtitle">
            Your top-rated AI generations saved for quick access.
          </p>
        </div>
        {!loading && projects.length > 0 && (
           <button className="dash-btn-ghost" onClick={() => navigate('/dashboard/generator')} style={{ marginBottom: 8 }}>
             <Sparkles size={15} /> Generate More
           </button>
        )}
      </div>

      {error && (
        <div className="dash-error-banner">
          <AlertCircle size={16} style={{ flexShrink: 0 }} />{error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={GRID_STYLE} className="dash-stagger">
          {[0, 1, 2].map(i => <FavoriteSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && !error && (
        <div className="dash-card" style={{
          textAlign: 'center', padding: '64px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed var(--dash-border)'
        }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', 
            background: 'rgba(255, 77, 79, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 8
          }}>
            <Heart size={40} style={{ color: '#ff4d4f', opacity: 0.6 }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text)' }}>No favorites yet</h3>
          <p style={{ color: 'var(--dash-muted)', fontSize: 16, maxWidth: 420, lineHeight: 1.6 }}>
            Tap the heart icon on any project results or history card to save it here for later.
          </p>
          <button className="dash-btn-primary" onClick={() => navigate('/dashboard/generator')} style={{ marginTop: 8 }}>
            <Sparkles size={17} />Start Generating
          </button>
        </div>
      )}

      {/* Project cards */}
      {!loading && projects.length > 0 && (
        <div style={GRID_STYLE} className="dash-stagger">
          {projects.map(project => (
            <FavoriteCard
              key={project.id}
              project={project}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => navigate(`/dashboard/results/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
