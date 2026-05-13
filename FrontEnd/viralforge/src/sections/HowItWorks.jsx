import React from 'react';
import GlassCard from '../components/GlassCard';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works section-padding">
      <div className="container">
        <div className="section-header text-center reveal">
          <h2 className="section-title">The <span className="text-gradient">Viral Workflow</span></h2>
          <p className="section-subtitle">Go from a vague idea to a platform-ready viral hit in less than 60 seconds.</p>
        </div>

        <div className="hiw-content">
          <div className="hiw-steps reveal-left">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-info">
                <h3 className="step-title">Describe Your Vision</h3>
                <p className="step-desc">Enter a topic, a product, or even just a mood. Our AI understands context across any niche.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-info">
                <h3 className="step-title">AI Content Generation</h3>
                <p className="step-desc">ViralForge generates scripts, hooks, and thumbnail concepts optimized for retention.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-info">
                <h3 className="step-title">Refine & Export</h3>
                <p className="step-desc">Fine-tune the output with our workspace tools and export directly to your production suite.</p>
              </div>
            </div>
          </div>

          <div className="hiw-preview reveal-right">
            <GlassCard className="preview-card" glow>
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span><span></span><span></span>
                </div>
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
                    <div className="search-icon"></div>
                    <div className="search-line"></div>
                  </div>
                  <div className="preview-content-box">
                    <div className="box-header"></div>
                    <div className="box-line l-full"></div>
                    <div className="box-line l-full"></div>
                    <div className="box-line l-half"></div>
                  </div>
                  <div className="preview-content-box">
                    <div className="box-header" style={{ width: '30%' }}></div>
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
