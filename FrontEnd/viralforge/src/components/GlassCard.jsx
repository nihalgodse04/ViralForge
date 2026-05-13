import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '', glow = false, ...props }) => {
  return (
    <div className={`glass-card ${glow ? 'glow' : ''} ${className}`} {...props}>
      <div className="glass-card-inner">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
