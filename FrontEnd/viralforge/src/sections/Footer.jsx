import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import { ExternalLink } from 'lucide-react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const navigate = useNavigate();
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid reveal">
          <div className="footer-brand">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src={theme === 'light' ? logoLight : logoDark} alt="ViralForge" className="logo-image" style={{ height: '40px' }} />
            </div>
            <p className="footer-desc">
              Empowering the next generation of creators with AI-driven viral insights and content automation.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link"><FaTwitter size={20} /></a>
              <a href="#" className="social-link"><FaInstagram size={20} /></a>
              <a href="#" className="social-link"><FaLinkedin size={20} /></a>
              <a href="#" className="social-link"><ExternalLink size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#cta">Case Studies</a></li>
              <li><a href="#cta">API Access</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Company</h4>
            <ul>
              <li><a href="#hero">About Us</a></li>
              <li><a href="#cta">Careers</a></li>
              <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>Blog</a></li>
              <li><a href="#cta">Press Kit</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Support</h4>
            <ul>
              <li><a href="#cta">Documentation</a></li>
              <li><a href="#cta">Help Center</a></li>
              <li><a href="#cta">Privacy Policy</a></li>
              <li><a href="#cta">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ViralForge AI. All rights reserved. Crafted with passion for creators.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
