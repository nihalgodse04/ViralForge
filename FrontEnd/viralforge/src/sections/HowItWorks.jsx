import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import dash from '../assets/dash.png';
import dash1 from '../assets/dash1.png';
import dash2 from '../assets/dash2.png';
import './HowItWorks.css';

const HowItWorks = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [dash, dash1, dash2];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Slide changes every 4 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

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
              <div className="preview-slideshow-container">
                {slides.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`preview-slide ${idx === currentSlide ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Dashboard preview ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
