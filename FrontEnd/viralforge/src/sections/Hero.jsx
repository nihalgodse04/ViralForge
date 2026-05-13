import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlowButton from '../components/GlowButton';
import { Play } from 'lucide-react';
import HeroImg from '../assets/HeroImg.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="hero" className="hero">
      {/* Background elements */}
      <div className="hero-grid-bg"></div>
      <div className="hero-glow-center"></div>

      {/* Bottom Colorful Bars */}
      <div className="bottom-bars">
        <div className="bar color-1"></div>
        <div className="bar color-2"></div>
        <div className="bar color-3"></div>
        <div className="bar color-4"></div>
      </div>

      <div className="container hero-container">
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">
            <div className="badge-avatars">
              <div className="badge-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=5')" }}></div>
              <div className="badge-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=6')" }}></div>
              <div className="badge-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=7')" }}></div>
              <div className="badge-avatar" style={{ backgroundImage: "url('https://i.pravatar.cc/100?img=8')" }}></div>
            </div>
            <span className="badge-text">Using <span>100k+</span> people worldwide</span>
          </div>

          <h1 className="hero-title">
            <span className="title-highlight">Your Social Co-Pilot.</span><br />
            The new intelligence layer
          </h1>

          <p className="hero-subtitle">
            ViralForge learns your brand's to generate content, automate engagement, and uncover predictive insights. In a single, intelligent workspace.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-solid" onClick={() => navigate('/auth')}>Get Started</button>
            <button className="btn-outline-play" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              <Play fill="currentColor" size={14} />
              How it Works
            </button>
          </div>
        </div>

        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="visual-wrapper">
            <img src={HeroImg} alt="Hero Visual" className="hero-main-image" />
          </div>
        </div>
      </div>

      {/* <div className="bottom-pill">Top Brands Insight</div> */}
    </section>
  );
};

export default Hero;


// 