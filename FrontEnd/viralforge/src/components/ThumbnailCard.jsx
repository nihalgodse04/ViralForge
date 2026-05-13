import React, { useState, memo } from 'react';
import { Play, Download, ImageOff, Copy, Check } from 'lucide-react';
import './ThumbnailCard.css';

const ThumbnailCard = memo(({ title, variant = 'purple', badge = 'AI Concept', imageUrl = null, prompt = '' }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const isFallback = imageUrl && imageUrl.includes('default-thumbnail.jpg');
  const hasImage = imageUrl && !imgError && !isFallback;

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `viralforge-thumbnail-${Date.now()}.webp`;
    link.target = '_blank';
    link.click();
  };

  const handleCopyPrompt = (e) => {
    e.stopPropagation();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className={`thumbnail-gen-card ${hasImage ? 'thumbnail-has-image' : ''} thumbnail-variant-${variant}`}>
      {/* AI Generated Image */}
      {imageUrl && !imgError && !isFallback && (
        <img
          src={imageUrl}
          alt={title}
          className={`thumbnail-ai-image ${imgLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Shimmer skeleton while loading */}
      {imageUrl && !imgLoaded && !imgError && !isFallback && (
        <div className="thumbnail-shimmer" />
      )}

      {/* Fallback icon when no image or error */}
      {(!imageUrl || imgError || isFallback) && (
        <div className="thumbnail-play-icon thumbnail-play-visible">
          {(imgError || isFallback) ? <ImageOff size={24} /> : <Play fill="currentColor" size={24} style={{ marginLeft: '4px' }} />}
        </div>
      )}

      {/* Play icon on hover when image exists */}
      {hasImage && (
        <div className="thumbnail-play-icon">
          <Play fill="currentColor" size={24} style={{ marginLeft: '4px' }} />
        </div>
      )}

      {/* Actions (Download / Copy Prompt) */}
      <div className="thumbnail-actions">
        {prompt && (
          <button className="thumbnail-action-btn" onClick={handleCopyPrompt} aria-label="Copy Prompt" title="Copy Prompt">
            {copiedPrompt ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
        {hasImage && imgLoaded && (
          <button className="thumbnail-action-btn" onClick={handleDownload} aria-label="Download thumbnail" title="Download Image">
            <Download size={14} />
          </button>
        )}
      </div>

      {/* Title overlay */}
      <div className="thumbnail-title-overlay">
        {badge && (
          <span className="thumbnail-badge">
            <span className="badge-dot"></span>
            {hasImage ? 'AI Generated' : badge}
          </span>
        )}
        <h3 className="thumbnail-gen-title">{title}</h3>
      </div>
    </div>
  );
});

export default ThumbnailCard;
