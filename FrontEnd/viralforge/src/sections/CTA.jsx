import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, Clock, X } from 'lucide-react';
import BorderGlow from '../components/BorderGlow';
import './CTA.css';

const CTA = () => {
  const navigate = useNavigate();
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section id="cta" className="cta-section section-padding">
      <div className="container">
        <div className="cta-box reveal">
          <div className="cta-glow"></div>
          <div className="cta-content">
            <h2 className="cta-title">Ready to <span className="text-gradient">Break the Algorithm?</span></h2>
            <p className="cta-subtitle">Join 100,000+ creators and brands who are already using ViralForge to scale their social presence.</p>

            <div className="cta-actions">
              <BorderGlow
                className="border-glow-btn"
                edgeSensitivity={30}
                glowColor="268 100 76"
                backgroundColor="#5D3FD3"
                borderRadius={8}
                glowRadius={40}
                glowIntensity={1.2}
                coneSpread={25}
                animated={true}
                colors={['#9D4EDD', '#FF4FD8', '#7B61FF']}
              >
                <button className="btn-primary-solid" onClick={() => navigate('/auth')}>
                  Start Generating Free
                </button>
              </BorderGlow>
              <button className="btn-outline-play" onClick={() => setShowDemoModal(true)} style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Book a Demo</button>
            </div>

            <p className="cta-guarantee">No credit card required • 7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </div>

      {/* Demo Popup Modal */}
      {showDemoModal && (
        <div className="demo-modal-overlay" onClick={() => setShowDemoModal(false)}>
          <div className="demo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="demo-modal-close" onClick={() => setShowDemoModal(false)}>
              <X size={20} />
            </button>
            
            <h3 className="demo-modal-title">Book a Demo Session</h3>
            <p className="demo-modal-desc">Get in touch with our enterprise success team to plan your custom integration.</p>
            
            <div className="demo-contact-grid">
              <div className="contact-item">
                <div className="contact-icon-wrapper"><MapPin size={18} /></div>
                <div className="contact-text">
                  <span className="contact-label">HQ Address</span>
                  <p>1201 Innovation Boulevard, Suite 400, San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper"><Mail size={18} /></div>
                <div className="contact-text">
                  <span className="contact-label">Support Email</span>
                  <a href="mailto:demos@viralforge.ai">demos@viralforge.ai</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper"><Phone size={18} /></div>
                <div className="contact-text">
                  <span className="contact-label">Corporate Contact</span>
                  <p>+1 (888) 902-3457</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper"><Clock size={18} /></div>
                <div className="contact-text">
                  <span className="contact-label">Business Hours</span>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM (EST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTA;
