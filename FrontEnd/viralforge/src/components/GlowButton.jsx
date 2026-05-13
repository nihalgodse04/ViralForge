import React from 'react';
import './GlowButton.css';

const GlowButton = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button className={`glow-button ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default GlowButton;
