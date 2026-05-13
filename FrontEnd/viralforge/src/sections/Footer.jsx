import React from 'react';
import { Sparkles, Globe, Share2, Video } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <Sparkles className="logo-icon" size={24} color="var(--primary)" />
              <span className="logo-text">ViralForge <span className="text-gradient">AI</span></span>
            </div>
            <p className="footer-desc">
              The AI co-pilot for top-tier creators. Scale your content output without sacrificing quality.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><Share2 size={20} /></a>
              <a href="#" className="social-link"><Video size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Use Cases</a></li>
              <li><a href="#">Integrations</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Creator Academy</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ViralForge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
