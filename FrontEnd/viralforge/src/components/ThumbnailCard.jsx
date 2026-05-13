import React, { useState, memo } from 'react';
import { Play, Download, ImageOff } from 'lucide-react';
import './ThumbnailCard.css';

const ThumbnailCard = memo(({ title, variant = 'purple', badge = 'AI Concept', imageUrl = null, prompt = '' }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasImage = imageUrl && !imgError;

  const handleDownload = (e) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `viralforge-thumbnail-${Date.now()}.webp`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className={`thumbnail-gen-card ${hasImage ? 'thumbnail-has-image' : ''} thumbnail-variant-${variant}`}>
      {/* AI Generated Image */}
      {imageUrl && !imgError && (
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
      {imageUrl && !imgLoaded && !imgError && (
        <div className="thumbnail-shimmer" />
      )}

      {/* Fallback icon when no image */}
      {(!imageUrl || imgError) && (
        <div className="thumbnail-play-icon thumbnail-play-visible">
          {imgError ? <ImageOff size={24} /> : <Play fill="currentColor" size={24} style={{ marginLeft: '4px' }} />}
        </div>
      )}

      {/* Play icon on hover when image exists */}
      {hasImage && (
        <div className="thumbnail-play-icon">
          <Play fill="currentColor" size={24} style={{ marginLeft: '4px' }} />
        </div>
      )}

      {/* Download button */}
      {hasImage && imgLoaded && (
        <button className="thumbnail-download-btn" onClick={handleDownload} aria-label="Download thumbnail">
          <Download size={16} />
        </button>
      )}

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
