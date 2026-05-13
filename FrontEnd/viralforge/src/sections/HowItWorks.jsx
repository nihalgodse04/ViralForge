import React from 'react';
import GlassCard from '../components/GlassCard';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Enter Topic", desc: "Just type your idea or paste an article link." },
    { num: "02", title: "Generate Script", desc: "AI crafts the perfect hook and cinematic script." },
    { num: "03", title: "Customize", desc: "Tweak pacing, tone, and storyboard visuals." },
    { num: "04", title: "Export", desc: "Download ready-to-shoot scripts and assets." }
  ];

  return (
    <section id="how-it-works" className="how-it-works section-padding">
      <div className="blob blob-2"></div>
      
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <h2 className="section-title">
            From Idea to <span className="text-gradient-primary">Viral Reality</span>
          </h2>
          <p className="section-subtitle">
            A frictionless workflow designed specifically for high-output creators.
          </p>
        </div>

        <div className="hiw-content">
          <div className="hiw-steps">
            {steps.map((step, idx) => (
              <div className="step-item" key={idx}>
                <div className="step-number text-gradient">{step.num}</div>
                <div className="step-info">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hiw-preview">
            <GlassCard className="preview-card glow">
              <div className="card-header">
                <div className="window-controls">
                  <span></span><span></span><span></span>
                </div>
                <div className="card-title">Dashboard Preview</div>
              </div>
              
              <div className="preview-body">
                <div className="preview-sidebar">
                  <div className="sidebar-item active"></div>
                  <div className="sidebar-item"></div>
                  <div className="sidebar-item"></div>
                  <div className="sidebar-item"></div>
                </div>
                <div className="preview-main">
                  <div className="preview-search">
                    <span className="search-icon"></span>
                    <div className="search-line"></div>
                  </div>
                  <div className="preview-content-box">
                    <div className="box-header"></div>
                    <div className="box-line l-full"></div>
                    <div className="box-line l-full"></div>
                    <div className="box-line l-half"></div>
                  </div>
                  <div className="preview-content-box">
                    <div className="box-header"></div>
                    <div className="box-line l-full"></div>
                    <div className="box-line l-half"></div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
