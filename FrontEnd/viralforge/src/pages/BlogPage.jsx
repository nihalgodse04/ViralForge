import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Calendar, User, X, ChevronRight } from 'lucide-react';
import './BlogPage.css';

const mockBlogs = [
  {
    id: 1,
    title: "The Psychology Behind Viral Short-Form Content 🎬",
    category: "Social Media",
    date: "2026-05-10",
    author: "Alex Rivers",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600",
    summary: "Short-form content has completely transformed how audiences consume entertainment online. Discover the psychology behind what makes a video go viral.",
    content: (
      <>
        <p>Short-form content has completely transformed how audiences consume entertainment online. Platforms like Instagram Reels, TikTok, and YouTube Shorts reward creators who can capture attention within the first few seconds. But behind every viral video lies a deep understanding of human psychology.</p>
        <p>Successful creators often use:</p>
        <ul>
          <li>Curiosity gaps</li>
          <li>Emotional triggers</li>
          <li>Rapid pacing</li>
          <li>Relatable storytelling</li>
          <li>Visual pattern interrupts</li>
        </ul>
        <p>The first 3 seconds are now considered the "attention battlefield." If a creator fails to spark curiosity immediately, the audience scrolls away instantly.</p>
        <p>Modern content strategies focus less on perfect production and more on:</p>
        <ul>
          <li>Authenticity</li>
          <li>Retention optimization</li>
          <li>Emotional relatability</li>
          <li>Audience interaction</li>
        </ul>
        <p>Brands are now hiring creators not just for reach, but for attention engineering.</p>
        <p>As algorithms continue evolving, creators who understand audience behavior will outperform creators who simply follow trends.</p>
      </>
    )
  },
  {
    id: 2,
    title: "Why AI Is Becoming Every Creator's Secret Weapon 🤖",
    category: "AI & Tech",
    date: "2026-05-08",
    author: "Samantha Lee",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600",
    summary: "Artificial Intelligence is rapidly reshaping the creator economy. From script generation to thumbnail optimization, AI tools are helping creators produce better content faster.",
    content: (
      <>
        <p>Artificial Intelligence is rapidly reshaping the creator economy. From script generation to thumbnail optimization, AI tools are helping creators produce better content faster than ever before.</p>
        <p>Today's AI-powered workflows can:</p>
        <ul>
          <li>Generate hooks</li>
          <li>Predict viral potential</li>
          <li>Create thumbnail concepts</li>
          <li>Optimize captions</li>
          <li>Analyze audience behavior</li>
        </ul>
        <p>This allows creators to spend less time brainstorming and more time creating.</p>
        <p><strong>AI is not replacing creativity — it is amplifying it.</strong></p>
        <p>Small creators now have access to production-level tools that were previously available only to large media teams. As AI becomes more integrated into social media workflows, content creation is shifting from manual execution to strategic creative direction.</p>
        <p>The future creator will not just be an editor or influencer. They will become:</p>
        <ul>
          <li>Content strategist</li>
          <li>Data analyst</li>
          <li>Storyteller</li>
          <li>AI-assisted creative director</li>
        </ul>
      </>
    )
  },
  {
    id: 3,
    title: "The Rise of the Creator Economy 💡",
    category: "Entertainment",
    date: "2026-05-05",
    author: "Marcus Chen",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600",
    summary: "The creator economy is no longer a niche internet trend — it has become a global industry worth billions.",
    content: (
      <>
        <p>The creator economy is no longer a niche internet trend — it has become a global industry worth billions.</p>
        <p>Independent creators are building:</p>
        <ul>
          <li>Personal brands</li>
          <li>Digital products</li>
          <li>Communities</li>
          <li>Subscription businesses</li>
          <li>Media companies</li>
        </ul>
        <p>Platforms like YouTube, Instagram, and TikTok have enabled individuals to compete with traditional entertainment companies.</p>
        <p>What makes the creator economy powerful is accessibility. A single smartphone can now launch a career.</p>
        <p>Brands are increasingly shifting budgets away from traditional advertising and investing in:</p>
        <ul>
          <li>Influencer marketing</li>
          <li>UGC campaigns</li>
          <li>Creator partnerships</li>
          <li>Community-driven storytelling</li>
        </ul>
        <p>Creators with smaller but highly engaged audiences often outperform celebrity campaigns because audiences value authenticity over perfection.</p>
        <p>The next generation of entrepreneurs may not start companies first — they may start audiences first.</p>
      </>
    )
  },
  {
    id: 4,
    title: "Why Thumbnail Design Matters More Than Ever 🖼",
    category: "Design",
    date: "2026-05-02",
    author: "Elena Rodriguez",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600",
    summary: "Before a viewer watches a video, they decide whether it is worth clicking based on visual packaging. Learn the secrets of high-converting thumbnails.",
    content: (
      <>
        <p>A thumbnail is often the first impression of a piece of content. Before a viewer watches a video, they decide whether it is worth clicking based on visual packaging.</p>
        <p>Great thumbnails usually include:</p>
        <ul>
          <li>Strong emotional expressions</li>
          <li>Bold typography</li>
          <li>High contrast colors</li>
          <li>Clean visual hierarchy</li>
          <li>Curiosity-driven design</li>
        </ul>
        <p>Modern creators spend hours testing thumbnail variations because even small changes can dramatically affect click-through rates.</p>
        <p>The most successful thumbnails create an emotional reaction instantly:</p>
        <ul>
          <li>Surprise</li>
          <li>Curiosity</li>
          <li>Urgency</li>
          <li>Excitement</li>
        </ul>
        <p>As competition increases across platforms, thumbnail design has become both an art and a science.</p>
        <p>AI-generated thumbnail concepts are now helping creators test ideas faster and improve performance before publishing content.</p>
      </>
    )
  },
  {
    id: 5,
    title: "How Entertainment Content Is Changing in the TikTok Era 🎵",
    category: "Entertainment",
    date: "2026-04-28",
    author: "Jordan Smith",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&q=80&w=600",
    summary: "The entertainment industry has fundamentally changed because of short-form platforms. Find out how movies and music are adapting to virality.",
    content: (
      <>
        <p>The entertainment industry has fundamentally changed because of short-form platforms.</p>
        <p>Movies, music, and even television marketing strategies are now designed around:</p>
        <ul>
          <li>Virality</li>
          <li>Meme culture</li>
          <li>Short attention spans</li>
          <li>Audience participation</li>
        </ul>
        <p>Songs often become popular because of TikTok trends before they succeed on streaming platforms. Film studios now design scenes specifically for social media clips and edits.</p>
        <p>Entertainment is becoming:</p>
        <ul>
          <li>Faster</li>
          <li>More interactive</li>
          <li>Community-driven</li>
          <li>Algorithm-influenced</li>
        </ul>
        <p>Audiences are no longer passive consumers. They actively remix, react to, and redistribute content.</p>
        <p>This shift has blurred the line between audience, creator, marketer, and entertainer.</p>
        <p>The future of entertainment will likely belong to creators who understand both storytelling and platform algorithms.</p>
      </>
    )
  },
  {
    id: 6,
    title: "Why Consistency Beats Talent on Social Media 📈",
    category: "Social Media",
    date: "2026-04-25",
    author: "David Kim",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    summary: "Many successful creators are not necessarily the most talented — they are often the most consistent. Discover why algorithms favor momentum.",
    content: (
      <>
        <p>Many successful creators are not necessarily the most talented — they are often the most consistent.</p>
        <p>Algorithms reward:</p>
        <ul>
          <li>Posting frequency</li>
          <li>Audience retention</li>
          <li>Consistency</li>
          <li>Engagement signals</li>
        </ul>
        <p>Creators who upload consistently build stronger audience relationships over time.</p>
        <p>Consistency also improves:</p>
        <ul>
          <li>Editing speed</li>
          <li>Storytelling skills</li>
          <li>Camera confidence</li>
          <li>Audience understanding</li>
        </ul>
        <p>Many creators fail because they focus only on perfection instead of momentum.</p>
        <p>Growth on social media is usually the result of repetition, experimentation, and adaptation.</p>
        <p>The most successful creators treat content creation like a long-term system rather than a short-term motivation burst.</p>
      </>
    )
  },
  {
    id: 7,
    title: "The Future of AI-Generated Media 🎨",
    category: "AI & Tech",
    date: "2026-04-20",
    author: "Sophia Patel",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600",
    summary: "AI-generated media is evolving rapidly. We are entering a new era where creators can generate entire videos and music using AI.",
    content: (
      <>
        <p>AI-generated media is evolving rapidly. We are entering a new era where creators can generate:</p>
        <ul>
          <li>Scripts</li>
          <li>Images</li>
          <li>Videos</li>
          <li>Voiceovers</li>
          <li>Animations</li>
          <li>Music</li>
        </ul>
        <p>using AI-assisted tools.</p>
        <p>This shift is reducing production barriers dramatically.</p>
        <p>However, the future will likely reward creators who combine human creativity, emotional storytelling, and AI efficiency rather than relying entirely on automation.</p>
        <p>Audiences still connect most deeply with:</p>
        <ul>
          <li>Authenticity</li>
          <li>Personality</li>
          <li>Emotional honesty</li>
        </ul>
        <p>AI tools will become collaborative creative partners rather than replacements for creators.</p>
        <p>The creators who learn to integrate AI effectively into their workflow will gain a significant competitive advantage in the next generation of digital media.</p>
      </>
    )
  },
  {
    id: 8,
    title: "How Social Media Algorithms Shape Culture 🌍",
    category: "Social Media",
    date: "2026-04-15",
    author: "Emily Clark",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    summary: "Social media algorithms influence much more than entertainment — they shape modern culture itself.",
    content: (
      <>
        <p>Social media algorithms influence much more than entertainment — they shape modern culture itself.</p>
        <p>Algorithms determine:</p>
        <ul>
          <li>What trends people see</li>
          <li>What conversations spread</li>
          <li>Which creators grow</li>
          <li>What music becomes popular</li>
          <li>How news travels</li>
        </ul>
        <p>This creates a powerful relationship between technology and human behavior.</p>
        <p>Modern creators now study watch time, retention curves, click-through rates, and audience psychology almost as seriously as businesses study analytics.</p>
        <p>As algorithms continue evolving, creators must balance authenticity, performance optimization, and ethical influence.</p>
        <p>The future of social media will depend on how platforms balance engagement-driven systems with meaningful human experiences.</p>
      </>
    )
  }
];

const BlogPage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredBlogs = activeTab === 'All' ? mockBlogs : mockBlogs.filter(blog => blog.category.includes(activeTab));

  return (
    <div className="blog-page-container">
      {/* Background Elements */}
      <div className="blog-bg-gradient"></div>
      <div className="blog-bg-grid"></div>

      <header className="blog-header">
        <div className="blog-nav-top">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} className="theme-icon light" /> : <Moon size={20} className="theme-icon dark" />}
          </button>
        </div>
        
        <div className="blog-hero animate-slide-up">
          <div className="blog-badge">ViralForge Publications</div>
          <h1>Insights & <span className="text-gradient">Strategies</span></h1>
          <p>Master the algorithm. Learn the secrets of top creators and stay ahead of the curve with our exclusive guides.</p>
        </div>

        <div className="blog-tabs animate-fade-in-delayed">
          {['All', 'Social Media', 'Entertainment', 'AI & Tech', 'Design'].map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="blog-content">
        <div className="blog-grid">
          {filteredBlogs.map((blog, index) => (
            <article 
              key={blog.id} 
              className="blog-card reveal-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedBlog(blog)}
            >
              <div className="blog-card-image">
                <img src={blog.image} alt={blog.title} loading="lazy" />
                <div className="blog-card-tag">{blog.category}</div>
                <div className="blog-card-overlay">
                  <span>Read Article <ChevronRight size={16} /></span>
                </div>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span><Calendar size={14} /> {blog.date}</span>
                  <span><User size={14} /> {blog.author}</span>
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Blog Modal Reader */}
      <div className={`blog-modal-overlay ${selectedBlog ? 'open' : ''}`} onClick={() => setSelectedBlog(null)}>
        <div className={`blog-modal-content ${selectedBlog ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          {selectedBlog && (
            <>
              <button className="blog-modal-close" onClick={() => setSelectedBlog(null)}>
                <X size={24} />
              </button>
              <div className="blog-modal-header" style={{ backgroundImage: `url(${selectedBlog.image})` }}>
                <div className="blog-modal-header-overlay">
                  <span className="blog-modal-tag">{selectedBlog.category}</span>
                  <h2>{selectedBlog.title}</h2>
                  <div className="blog-modal-meta">
                    <span><Calendar size={14} /> {selectedBlog.date}</span>
                    <span className="meta-dot">•</span>
                    <span><User size={14} /> {selectedBlog.author}</span>
                  </div>
                </div>
              </div>
              <div className="blog-modal-body">
                <div className="prose">
                  {selectedBlog.content}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="blog-footer">
        <p>&copy; 2026 ViralForge AI. Educating the next generation of creators.</p>
      </footer>
    </div>
  );
};

export default BlogPage;
