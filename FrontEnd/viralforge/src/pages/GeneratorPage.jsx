import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video, HelpCircle, Tag, Users, Smile, Clock,
  List, FileEdit, Globe, Film, Sparkles, ChevronDown, Loader
} from 'lucide-react';
import { generateAPI } from '../services/api';
import BorderGlow from '../components/BorderGlow';
import '../styles/generator.css';

const GeneratorPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: '',
    audience: 'Students & Young Professionals',
    tone: 'Motivational',
    videoLength: '30 – 45 seconds',
    keyPoints: '',
    instructions: '',
    language: 'English',
    contentType: 'Instagram Reel',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.topic.trim()) {
      setError('Please enter a topic or title.');
      return;
    }

    setLoading(true);

    try {
      // Map frontend field names to backend field names
      const payload = {
        title: formData.topic,
        audience: formData.audience,
        tone: formData.tone,
        platform: formData.contentType,
        video_length: formData.videoLength,
        key_points: formData.keyPoints,
        instructions: formData.instructions,
        language: formData.language,
      };

      const response = await generateAPI.generate(payload);
      const projectId = response.data.project_id;
      const { credits_remaining, total_generations } = response.data;

      if (credits_remaining !== undefined) {
        window.dispatchEvent(new CustomEvent('credits-updated', {
          detail: { credits: credits_remaining, total_generations }
        }));
      }

      // Navigate to results page with the real project ID
      navigate(`/dashboard/results/${projectId}`);

    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generator-page">
      {/* Header */}
      <div className="generator-header">
        <div className="generator-header-left">
          <div className="generator-header-icon">
            <Video size={22} />
          </div>
          <div className="generator-header-text">
            <h1>Video Information</h1>
            <p>Provide details about your reel to generate engaging scripts,<br />hook lines, hashtags and thumbnails.</p>
          </div>
        </div>
        <button className="btn-need-help">
          <HelpCircle size={16} />
          Need Help?
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          color: '#ff4d4f',
          background: 'rgba(255, 77, 79, 0.1)',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '14px',
          border: '1px solid rgba(255, 77, 79, 0.3)',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form className="generator-form" onSubmit={handleGenerate}>

        {/* Topic / Title */}
        <div className="dash-input-group">
          <label className="dash-input-label">
            Topic / Title <span className="required">*</span>
          </label>
          <div className="dash-input-wrapper">
            <span className="input-icon"><Tag size={18} /></span>
            <input
              type="text"
              placeholder="e.g. 5 Habits That Changed My Life"
              value={formData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              maxLength={100}
              required
            />
            <span className="char-count">{formData.topic.length}/100</span>
          </div>
          <span className="dash-input-helper">Enter a catchy topic or title for your reel.</span>
        </div>

        {/* Target Audience */}
        <div className="dash-input-group">
          <label className="dash-input-label">Target Audience</label>
          <div className="dash-select-wrapper">
            <span className="input-icon"><Users size={18} /></span>
            <select
              value={formData.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
            >
              <option>Students & Young Professionals</option>
              <option>Gen Z Content Creators</option>
              <option>Entrepreneurs & Founders</option>
              <option>Fitness Enthusiasts</option>
              <option>Tech Enthusiasts</option>
              <option>General Audience</option>
            </select>
            <span className="select-chevron"><ChevronDown size={16} /></span>
          </div>
          <span className="dash-input-helper">Choose the audience you want to reach.</span>
        </div>

        {/* Tone / Style + Video Length */}
        <div className="generator-row">
          <div className="dash-input-group">
            <label className="dash-input-label">Tone / Style</label>
            <div className="dash-select-wrapper">
              <span className="input-icon"><Smile size={18} /></span>
              <select
                value={formData.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
              >
                <option>Motivational</option>
                <option>Educational</option>
                <option>Humorous</option>
                <option>Inspirational</option>
                <option>Professional</option>
                <option>Casual & Fun</option>
              </select>
              <span className="select-chevron"><ChevronDown size={16} /></span>
            </div>
            <span className="dash-input-helper">Select the tone of your content.</span>
          </div>

          <div className="dash-input-group">
            <label className="dash-input-label">Video Length</label>
            <div className="dash-select-wrapper">
              <span className="input-icon"><Clock size={18} /></span>
              <select
                value={formData.videoLength}
                onChange={(e) => handleChange('videoLength', e.target.value)}
              >
                <option>15 – 30 seconds</option>
                <option>30 – 45 seconds</option>
                <option>45 – 60 seconds</option>
                <option>60 – 90 seconds</option>
              </select>
              <span className="select-chevron"><ChevronDown size={16} /></span>
            </div>
            <span className="dash-input-helper">Select the ideal length for your reel.</span>
          </div>
        </div>

        {/* Key Points / Outline */}
        <div className="dash-input-group">
          <label className="dash-input-label">
            Key Points / Outline <span className="optional">(Optional)</span>
          </label>
          <div className="dash-textarea-wrapper">
            <div className="textarea-top">
              <span className="input-icon"><List size={18} /></span>
              <textarea
                placeholder={"1. Wake up early\n2. Daily exercise\n3. Read books\n4. No social media in morning\n5. Plan your day"}
                value={formData.keyPoints}
                onChange={(e) => handleChange('keyPoints', e.target.value)}
                maxLength={500}
              />
            </div>
            <div className="textarea-footer">
              <span className="char-count">{formData.keyPoints.length}/500</span>
            </div>
          </div>
          <span className="dash-input-helper">Add key points or outline to help AI create better content.</span>
        </div>

        {/* Additional Instructions */}
        <div className="dash-input-group">
          <label className="dash-input-label">
            Additional Instructions <span className="optional">(Optional)</span>
          </label>
          <div className="dash-textarea-wrapper">
            <div className="textarea-top">
              <span className="input-icon"><FileEdit size={18} /></span>
              <textarea
                placeholder="e.g. Include personal examples, keep it simple and relatable, add a call to action at the end."
                value={formData.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                maxLength={300}
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="textarea-footer">
              <span className="char-count">{formData.instructions.length}/300</span>
            </div>
          </div>
          <span className="dash-input-helper">Add any specific instructions for the AI.</span>
        </div>

        {/* Language + Content Type */}
        <div className="generator-row">
          <div className="dash-input-group">
            <label className="dash-input-label">Language</label>
            <div className="dash-select-wrapper">
              <span className="input-icon"><Globe size={18} /></span>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Portuguese</option>
              </select>
              <span className="select-chevron"><ChevronDown size={16} /></span>
            </div>
          </div>

          <div className="dash-input-group">
            <label className="dash-input-label">Content Type</label>
            <div className="dash-select-wrapper">
              <span className="input-icon"><Film size={18} /></span>
              <select
                value={formData.contentType}
                onChange={(e) => handleChange('contentType', e.target.value)}
              >
                <option>Instagram Reel</option>
                <option>TikTok</option>
                <option>YouTube Shorts</option>
                <option>Twitter/X Thread</option>
                <option>LinkedIn Post</option>
              </select>
              <span className="select-chevron"><ChevronDown size={16} /></span>
            </div>
          </div>
        </div>

        {/* What will be generated card */}
        <div className="generator-preview-card">
          <div className="preview-card-icon">
            <Sparkles size={20} />
          </div>
          <div className="preview-card-text">
            <h3>What will be generated?</h3>
            <p>AI will generate: <span>Reel Script</span>, <span>Hook Lines</span>, <span>Hashtags</span>, <span>Thumbnail</span> & <span>Caption</span></p>
          </div>
        </div>

        {/* Generate Button */}
        <BorderGlow
          className="border-glow-btn"
          style={{ width: '100%' }}
          edgeSensitivity={30}
          glowColor="252 100 66" // pink/purple tone
          backgroundColor="linear-gradient(135deg, #7B61FF, #6B4FE0)"
          borderRadius={13}
          glowRadius={45}
          glowIntensity={1.2}
          coneSpread={25}
          animated={true}
          colors={['#FF4FD8', '#7B61FF', '#00E5FF']}
        >
          <button type="submit" className="btn-generate" disabled={loading}>
            {loading ? (
              <>
                <Loader size={20} className="spin-animation" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Content
              </>
            )}
          </button>
        </BorderGlow>

      </form>
    </div>
  );
};

export default GeneratorPage;
