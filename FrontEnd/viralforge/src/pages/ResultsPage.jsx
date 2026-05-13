import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Save, RefreshCw, Sparkles,
  FileText, Zap, Hash, Image, MessageSquare,
  Clock, AlignLeft, CheckCircle, Edit3, Loader, AlertCircle, Copy, Check, ImagePlus, Heart
} from 'lucide-react';
import { projectsAPI } from '../services/api';
import ThumbnailCard from '../components/ThumbnailCard';
import '../styles/results.css';

const tabs = [
  { id: 'all', label: 'All Results', icon: CheckCircle },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'hooks', label: 'Hook Lines', icon: Zap },
  { id: 'hashtags', label: 'Hashtags', icon: Hash },
  { id: 'caption', label: 'Caption', icon: MessageSquare },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
];

const ResultsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [regenThumbs, setRegenThumbs] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHookIndex, setCopiedHookIndex] = useState(null);

  // ─── Fetch Project Data ──────────────────────────────────

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await projectsAPI.getById(id);
        setProject(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load project.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // ─── Regenerate Handler ──────────────────────────────────

  const handleRegenerate = async () => {

    try {

      setRegenerating(true);

      // Clear old errors FIRST
      setError("");

      const res =
        await projectsAPI.regenerate(id);

      const {
        data: aiData,
        credits_remaining,
        total_generations
      } = res.data;

      // Update project UI instantly
      setProject(prev => ({

        ...prev,

        script:
          aiData.script,

        hook:
          aiData.hook,

        alternative_hooks:
          aiData.alternative_hooks,

        hashtags:
          aiData.hashtags,

        caption:
          aiData.caption,

        viral_score:
          aiData.viral_score,

        thumbnail_titles:
          aiData.thumbnail_titles,

        thumbnail_images:
          aiData.thumbnail_images || [],
      }));

      // Live credit sync
      if (
        credits_remaining !== undefined
      ) {

        window.dispatchEvent(

          new CustomEvent(

            "credits-updated",

            {
              detail: {

                credits:
                  credits_remaining,

                total_generations:
                  total_generations
              }
            }
          )
        );
      }

      // IMPORTANT:
      // clear error after success
      setError("");

    } catch (err) {

      console.error(err);

      const backendError =
        err.response?.data?.error;

      setError(

        backendError ||

        "Regeneration failed."
      );

    } finally {

      setRegenerating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!project) return;
    
    // Optimistic update
    const newIsFavorite = !project.is_favorite;
    setProject(prev => ({ ...prev, is_favorite: newIsFavorite }));

    try {
      await projectsAPI.toggleFavorite(id);
    } catch (err) {
      console.error('Favorite toggle failed:', err);
      // Rollback
      setProject(prev => ({ ...prev, is_favorite: !newIsFavorite }));
    }
  };


  // ─── Loading State ───────────────────────────────────────

  if (loading) {
    return (
      <div className="results-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <Loader size={32} className="spin-animation" style={{ color: 'var(--dash-primary)' }} />
        <p style={{ color: 'var(--dash-muted)', fontSize: '15px' }}>Loading your project...</p>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────

  if (error && !project) {
    return (
      <div className="results-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
        <AlertCircle size={32} style={{ color: '#ff4d4f' }} />
        <p style={{ color: '#ff4d4f', fontSize: '15px' }}>{error}</p>
        <button className="dash-btn-primary" onClick={() => navigate('/dashboard/generator')}>
          Back to Generator
        </button>
      </div>
    );
  }

  // ─── Copy State ──────────────────────────────────────────

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyHook = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedHookIndex(index);
    setTimeout(() => setCopiedHookIndex(null), 2000);
  };

  // ─── Parse Data ──────────────────────────────────────────

  const scriptText = project?.script || '';
  const parseScript = (text) => {
    if (!text) return [];
    const segments = [];
    const regex = /\[(.*?)\]\s*([^\[]*)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match[1].trim() || match[2].trim()) {
        segments.push({
          tag: match[1].trim(),
          content: match[2].trim()
        });
      }
    }
    if (segments.length === 0) {
      segments.push({ tag: '', content: text });
    }
    return segments;
  };
  const scriptSegments = parseScript(scriptText);

  const hookText = project?.hook || '';
  const alternativeHooks = project?.alternative_hooks || [];
  const allHooks = [hookText, ...alternativeHooks].filter(Boolean);
  const hashtags = project?.hashtags || [];
  const caption = project?.caption || '';
  const viralScore = project?.viral_score || 0;
  const thumbnailTitles = project?.thumbnail_titles || [];
  const thumbnailImages = project?.thumbnail_images || [];
  const createdAt = project?.created_at
    ? new Date(project.created_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    : '';

  const summaryItems = [
    scriptText ? 'Generated engaging video script' : null,
    hookText ? 'Created powerful hook line' : null,
    hashtags.length ? `Suggested ${hashtags.length} relevant hashtags` : null,
    caption ? 'Written social media caption' : null,
    viralScore ? `Viral score: ${viralScore}/100` : null,
    thumbnailTitles.length ? `Generated ${thumbnailTitles.length} thumbnail ideas` : null,
  ].filter(Boolean);

  return (
    <div className="results-page">
      {/* Back Link */}
      <button className="results-back" onClick={() => navigate('/dashboard/generator')}>
        <ArrowLeft size={16} />
        Back to Generator
      </button>

      {/* Error Banner */}
      {error && (
        <div style={{
          color: '#ff4d4f', background: 'rgba(255, 77, 79, 0.1)',
          padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
          fontSize: '14px', border: '1px solid rgba(255, 77, 79, 0.3)',
        }}>
          {error}
        </div>
      )}

      {/* Top Header */}
      <div className="results-top-header">
        <div className="results-title-group">
          <h1>
            Results for: {project?.title || 'Untitled Project'}
            <span className="edit-icon"><Pencil size={16} /></span>
          </h1>
          <p className="results-meta">Generated on {createdAt}</p>
        </div>
        <div className="results-actions">
          <button 
            className={`btn-favorite ${project?.is_favorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            title={project?.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart size={18} fill={project?.is_favorite ? '#ff4d4f' : 'none'} color={project?.is_favorite ? '#ff4d4f' : 'currentColor'} />
            {project?.is_favorite ? 'Favorited' : 'Favorite'}
          </button>
          <button className="btn-regenerate" onClick={handleRegenerate} disabled={regenerating}>
            {regenerating ? <Loader size={16} className="spin-animation" /> : <RefreshCw size={16} />}
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button className="btn-generate-new" onClick={() => navigate('/dashboard/generator')}>
            <Sparkles size={16} />
            Generate New
          </button>
        </div>
      </div>

      {/* Viral Score Badge */}
      {viralScore > 0 && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: viralScore >= 70 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 171, 0, 0.1)',
          border: `1px solid ${viralScore >= 70 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 171, 0, 0.3)'}`,
          padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', fontSize: '14px', fontWeight: 600,
          color: viralScore >= 70 ? '#22C55E' : '#FFAB00',
        }}>
          <Zap size={16} />
          Viral Score: {viralScore}/100
        </div>
      )}

      {/* Tabs */}
      <div className="dash-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon"><tab.icon size={15} /></span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Grid — Top Row */}
      <div className="results-grid dash-stagger">

        {/* Reel Script Card */}
        {(activeTab === 'all' || activeTab === 'script') && scriptText && (
          <div className="result-card script-card-container" style={{ animationDelay: '0.05s', gridColumn: activeTab === 'script' ? '1 / -1' : 'auto' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <FileText size={16} className="card-icon" />
                Reel Script
              </span>
              <button className="dash-btn-ghost copy-btn" onClick={handleCopyScript}>
                {copiedScript ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedScript ? 'Copied!' : 'Copy Script'}
              </button>
            </div>
            <div className="script-content-wrapper">
              {scriptSegments.map((seg, i) => {
                const isHook = seg.tag.toLowerCase().includes('hook');
                const isCta = seg.tag.toLowerCase().includes('cta');
                let highlightClass = '';
                if (isHook) highlightClass = 'script-tag-hook';
                else if (isCta) highlightClass = 'script-tag-cta';
                else highlightClass = 'script-tag-scene';

                return (
                  <div className={`script-segment-modern ${highlightClass}`} key={i}>
                    {seg.tag && (
                      <div className="script-timestamp-modern">
                        <span className="script-tag-badge">{seg.tag.split('|')[0]?.trim()}</span>
                        {seg.tag.includes('|') && <span className="script-time-badge"><Clock size={12} /> {seg.tag.split('|')[1]?.trim()}</span>}
                      </div>
                    )}
                    <div className="script-text-modern">{seg.content}</div>
                  </div>
                );
              })}
            </div>
            <div className="script-meta">
              <span><Clock size={12} /> {scriptSegments.length} scenes</span>
              <span><AlignLeft size={12} /> {scriptText.split(/\s+/).length} Words</span>
            </div>
          </div>
        )}

        {/* Hook Lines Card */}
        {(activeTab === 'all' || activeTab === 'hooks') && allHooks.length > 0 && (
          <div className="result-card hook-card-container" style={{ animationDelay: '0.1s', gridColumn: activeTab === 'hooks' ? '1 / -1' : 'auto' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <Zap size={16} className="card-icon" />
                Viral Hooks
              </span>
            </div>
            <div className="hook-list-wrapper">
              {allHooks.map((h, i) => (
                <div className={`hook-item-modern ${i === 0 ? 'primary-hook' : 'alt-hook'}`} key={i}>
                  <div className="hook-item-content">
                    {i === 0 && <span className="hook-badge-primary">🔥 Top Choice</span>}
                    <span className="hook-text-modern">{h}</span>
                  </div>
                  <button className="hook-copy-btn" onClick={() => handleCopyHook(h, i)}>
                    {copiedHookIndex === i ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtags Card */}
        {(activeTab === 'all' || activeTab === 'hashtags') && hashtags.length > 0 && (
          <div className="result-card" style={{ animationDelay: '0.15s' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <Hash size={16} className="card-icon" />
                Hashtags
              </span>
            </div>
            <div className="hashtag-grid">
              {hashtags.map((tag, i) => (
                <span className="hashtag-chip" key={i}>{tag}</span>
              ))}
            </div>
            <div className="hashtag-count">{hashtags.length} Hashtags</div>
          </div>
        )}

        {/* Thumbnails Card */}
        {(activeTab === 'all' || activeTab === 'thumbnails') && (thumbnailTitles.length > 0 || thumbnailImages.length > 0) && (
          <div className="result-card" style={{ animationDelay: '0.2s', gridColumn: '1 / -1' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <Image size={16} className="card-icon" />
                Thumbnail Ideas
              </span>
              <button
                className="btn-regen-thumbnails"
                disabled={regenThumbs}
                onClick={async () => {
                  setRegenThumbs(true);
                  try {
                    const res = await projectsAPI.regenerateThumbnails(id);
                    setProject(prev => ({
                      ...prev,
                      thumbnail_images: res.data.thumbnail_images || [],
                    }));
                  } catch (err) {
                    console.error('Thumbnail regeneration failed:', err);
                  } finally {
                    setRegenThumbs(false);
                  }
                }}
              >
                {regenThumbs ? <Loader size={14} className="spin-animation" /> : <ImagePlus size={14} />}
                {regenThumbs ? 'Generating...' : 'Regenerate Thumbnails'}
              </button>
            </div>

            {/* AI Generated Thumbnails */}
            {thumbnailImages.length > 0 && (
              <>
                <div style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  AI Generated
                </div>
                <div className="thumbnail-grid-container" style={{ marginBottom: 24 }}>
                  {thumbnailImages.map((thumb, i) => {
                    const variants = ['purple', 'dark', 'blue', 'gold'];
                    return (
                      <ThumbnailCard
                        key={`ai-${i}`}
                        title={thumb.prompt?.split(',')[0] || thumbnailTitles[i] || 'AI Thumbnail'}
                        variant={variants[i % variants.length]}
                        imageUrl={thumb.image_url ? `http://localhost:8000${thumb.image_url}` : null}
                        prompt={thumb.prompt}
                        badge="AI Generated"
                      />
                    );
                  })}
                </div>
              </>
            )}

            {/* Concept Thumbnails (text-only) */}
            {thumbnailTitles.length > 0 && (
              <>
                <div style={{ fontSize: 12, color: 'var(--dash-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Concept Ideas
                </div>
                <div className="thumbnail-grid-container">
                  {thumbnailTitles.map((title, i) => {
                    const variants = ['purple', 'dark', 'blue', 'gold'];
                    return (
                      <ThumbnailCard
                        key={`concept-${i}`}
                        title={title}
                        variant={variants[i % variants.length]}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Results Grid — Bottom Row */}
      <div className="results-bottom-grid dash-stagger">

        {/* Caption Card */}
        {(activeTab === 'all' || activeTab === 'caption') && caption && (
          <div className="result-card" style={{ animationDelay: '0.25s' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <MessageSquare size={16} className="card-icon" />
                Caption
              </span>
            </div>
            <div className="caption-text">{caption}</div>
            {hashtags.length > 0 && (
              <div className="caption-hashtags">
                {hashtags.join(' ')}
              </div>
            )}
          </div>
        )}

        {/* AI Summary Card */}
        {activeTab === 'all' && summaryItems.length > 0 && (
          <div className="result-card" style={{ animationDelay: '0.3s' }}>
            <div className="result-card-header">
              <span className="result-card-title">
                <Sparkles size={16} className="card-icon" />
                AI Summary
              </span>
            </div>
            {summaryItems.map((item, i) => (
              <div className="summary-item" key={i}>
                <div className="summary-check">
                  <div className="summary-check-icon" />
                </div>
                <span className="summary-text">{item}</span>
              </div>
            ))}
            <div className="summary-progress">
              <div className="summary-progress-label">{summaryItems.length}/{summaryItems.length} Completed</div>
              <div className="summary-progress-bar">
                <div className="summary-progress-fill" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {/* CTA Card */}
        {activeTab === 'all' && (
          <div className="result-card cta-card" style={{ animationDelay: '0.35s' }}>
            <div className="cta-card-icon">
              <Sparkles size={22} />
            </div>
            <h3>Want even better results?</h3>
            <p>Edit your inputs or add more details to generate more personalized content.</p>
            <button className="btn-edit-inputs" onClick={() => navigate('/dashboard/generator')}>
              <Edit3 size={16} />
              Edit Inputs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
