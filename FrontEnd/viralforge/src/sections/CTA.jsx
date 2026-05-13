import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section id="cta" className="cta-section section-padding">
      <div className="container">
        <div className="cta-box reveal">
          <div className="cta-glow"></div>
          <div className="cta-content">
            <h2 className="cta-title">Ready to <span className="text-gradient">Break the Algorithm?</span></h2>
            <p className="cta-subtitle">Join 100,000+ creators and brands who are already using ViralForge to scale their social presence.</p>
            
            <div className="cta-actions">
              <button className="btn-primary-solid">Start Generating Free</button>
              <button className="btn-outline-play" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Book a Demo</button>
            </div>
            
            <p className="cta-guarantee">No credit card required • 7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
