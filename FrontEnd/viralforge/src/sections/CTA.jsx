import React from 'react';
import GlowButton from '../components/GlowButton';
import LogoLoop from '../components/LogoLoop';
import { SiTiktok, SiInstagram, SiX, SiYoutube, SiLogmein, SiFacebook, SiSnapchat } from 'react-icons/si';
import './CTA.css';

const techLogos = [
  { node: <SiTiktok color="var(--text)" />, title: "TikTok", href: "https://tiktok.com" },
  { node: <SiInstagram color="#E1306C" />, title: "Instagram", href: "https://instagram.com" },
  { node: <SiX color="var(--text)" />, title: "X", href: "https://x.com" },
  { node: <SiYoutube color="#FF0000" />, title: "YouTube", href: "https://youtube.com" },
  { node: <SiLogmein color="#0077B5" />, title: "LinkedIn", href: "https://linkedin.com" },
  { node: <SiFacebook color="#1877F2" />, title: "Facebook", href: "https://facebook.com" },
  { node: <SiSnapchat color="#FFFC00" />, title: "Snapchat", href: "https://snapchat.com" },
];

const CTA = () => {
  return (
    <section className="cta-section section-padding">
      <div className="container">
        <div className="cta-box">
          <div className="cta-glow"></div>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Dominate the Algorithm?</h2>
            <p className="cta-subtitle">
              Join 10,000+ creators who are scaling their audience with ViralForge AI.
              Start your 7-day free trial today.
            </p>
            <div className="cta-actions">
              <GlowButton variant="primary">Start Free Trial</GlowButton>
              <GlowButton variant="secondary">View Pricing</GlowButton>
            </div>
            <p className="cta-guarantee">No credit card required. Cancel anytime.</p>
          </div>
        </div>

        <div className="cta-logo-loop-wrapper" style={{ marginTop: '80px', textAlign: 'center' }}>
          <div style={{ position: 'relative', overflow: 'hidden', padding: '20px 0' }}>
            {/* Basic horizontal loop */}
            <LogoLoop
              logos={techLogos}
              speed={90}
              direction="left"
              logoHeight={60}
              gap={60}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="var(--bg)"
              ariaLabel="Technology partners"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
