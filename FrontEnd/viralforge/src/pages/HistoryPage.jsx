import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban, Zap, Clock, ArrowRight, Loader, AlertCircle, Sparkles, Heart
} from 'lucide-react';
import { projectsAPI } from '../services/api';

/* ── Skeleton for project cards ── */
const ProjectSkeleton = () => (
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

/* ── Memoised project card ── */
const ProjectCard = memo(({ project, onToggleFavorite, onClick }) => {
  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleFavorite(project.id);
  };

  return (
    <div
      className="dash-card"
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
          className={`fav-toggle-btn ${project.is_favorite ? 'active' : ''}`}
          onClick={handleToggle}
          style={{ background: 'none', border: 'none', color: project.is_favorite ? '#ff4d4f' : 'var(--dash-muted)', cursor: 'pointer', padding: 4 }}
        >
          <Heart size={18} fill={project.is_favorite ? '#ff4d4f' : 'none'} />
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
        borderTop: '1px solid var(--dash-border)', paddingTop: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 11, color: 'var(--dash-primary)',
            background: 'rgba(123,97,255,0.09)', padding: '3px 8px',
            borderRadius: 6, fontWeight: 600,
          }}>
            {project.platform || 'Reel'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--dash-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={11} />
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
        {project.viral_score > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: project.viral_score >= 70 ? '#22C55E' : '#FFAB00',
            fontSize: 12, fontWeight: 700,
          }}>
            <Zap size={12} />{project.viral_score}
          </span>
        )}
      </div>
    </div>
  );
});

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 18,
};

const HistoryPage = () => {
  const navigate  = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    let cancelled = false;
    projectsAPI.getAll()
      .then(res => { if (!cancelled) setProjects(res.data); })
      .catch(() => { if (!cancelled) setError('Failed to load project history.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleToggleFavorite = async (id) => {
    // Optimistic update
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
    ));

    try {
      await projectsAPI.toggleFavorite(id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // Rollback
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
      ));
    }
  };

  return (
    <div className="dash-animate-in">
      <h1 className="dash-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FolderKanban size={26} style={{ color: 'var(--dash-primary)', flexShrink: 0 }} />
        Project History
      </h1>
      <p className="dash-page-subtitle" style={{ marginBottom: 28 }}>
        All your AI-generated projects in one place.
      </p>

      {error && (
        <div className="dash-error-banner">
          <AlertCircle size={16} style={{ flexShrink: 0 }} />{error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={GRID_STYLE} className="dash-stagger">
          {[0, 1, 2, 3, 4, 5].map(i => <ProjectSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && !error && (
        <div className="dash-card" style={{
          textAlign: 'center', padding: '56px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
        }}>
          <Sparkles size={38} style={{ color: 'var(--dash-primary)', opacity: 0.55 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--dash-text)' }}>No projects yet</h3>
          <p style={{ color: 'var(--dash-muted)', fontSize: 15, maxWidth: 380 }}>
            Generate your first piece of AI content to see it appear here.
          </p>
          <button className="dash-btn-primary" onClick={() => navigate('/dashboard/generator')}>
            <Sparkles size={17} />Open AI Generator
          </button>
        </div>
      )}

      {/* Project cards */}
      {!loading && projects.length > 0 && (
        <div style={GRID_STYLE} className="dash-stagger">
          {projects.map(project => (
            <ProjectCard
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

export default HistoryPage;
