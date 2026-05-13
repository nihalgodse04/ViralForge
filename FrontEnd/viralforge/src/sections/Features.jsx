import React from 'react';
import GlassCard from '../components/GlassCard';
import './Features.css';
import { Sparkles, Video, BarChart3, LayoutTemplate, Share2, Layers, Repeat, TrendingUp } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <GlassCard className={`feature-card animate-fade-in`} style={{ animationDelay: `${delay}s` }} glow>
      <div className="feature-icon-wrapper">
        <Icon size={24} className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </GlassCard>
  );
};

const Features = () => {
  const featuresList = [
    {
      icon: Sparkles,
      title: "Viral Hook Generator",
      description: "AI-crafted opening hooks that capture attention in the critical first 3 seconds."
    },
    {
      icon: LayoutTemplate,
      title: "AI Script Writer",
      description: "Full cinematic scripts tailored to your specific niche and target audience."
    },
    {
      icon: Video,
      title: "Thumbnail Generator",
      description: "High-CTR thumbnail concepts that perfectly match your video's hook."
    },
    {
      icon: BarChart3,
      title: "Viral Score Analysis",
      description: "Predictive AI scoring to gauge the viral potential before you even hit record."
    },
    {
      icon: Layers,
      title: "Storyboards",
      description: "Visual scene-by-scene breakdown to streamline your production process."
    },
    {
      icon: Share2,
      title: "Multi-platform Sync",
      description: "Automatically adapt your script for TikTok, Shorts, and Reels formats."
    },
    {
      icon: Repeat,
      title: "Carousel Conversion",
      description: "Turn your video scripts into high-engaging text carousels for LinkedIn and IG."
    },
    {
      icon: TrendingUp,
      title: "Trending Suggestions",
      description: "Real-time niche trends directly integrated into your content generation."
    }
  ];

  return (
    <section id="features" className="features section-padding">
      <div className="container">
        <div className="section-header text-center animate-fade-in">
          <h2 className="section-title">
            The Ultimate <span className="text-gradient">Creator Arsenal</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to ideate, script, and optimize content that breaks the algorithm.
          </p>
        </div>

        <div className="features-grid">
          {featuresList.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
