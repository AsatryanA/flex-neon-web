import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeatures, getShowcase } from '../api/contentService';
import './Home.css';

function Home() {
  const [features, setFeatures] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [featuresRes, showcaseRes] = await Promise.all([
        getFeatures(),
        getShowcase(),
      ]);

      setFeatures(featuresRes.data);
      setShowcase(showcaseRes.data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>Illuminate</span>
              <br />
              Your Space
            </h1>
            <p className="hero-subtitle">
              Custom Neon Signs for Every Occasion
            </p>
            <p className="hero-description">
              Transform any space with stunning, handcrafted neon signs. Perfect for homes, businesses, events, and special occasions.
            </p>
            <div className="hero-buttons">
              <Link to="/order" className="neon-button order-now-glow">
                Design Your Sign
              </Link>
              <Link to="/portfolio" className="hero-btn-secondary">
                View Gallery
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="neon-display">
              <div className="neon-sign-demo neon-text" style={{ color: 'var(--neon-pink)' }}>
                NEON
              </div>
              <div className="neon-sign-demo neon-text" style={{ color: 'var(--neon-blue)', fontSize: '60px' }}>
                DREAMS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">
            <span className="neon-text" style={{ color: 'var(--neon-blue)' }}>Why Choose Us</span>
          </h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <div className="showcase-container">
          <h2 className="section-title">
            <span className="neon-text" style={{ color: 'var(--neon-purple)' }}>Popular Designs</span>
          </h2>
          <div className="showcase-grid">
            {showcase.map((item) => (
              <div key={item.id} className="showcase-item">
                <div className={`showcase-neon neon-${item.color}`}>
                  <span className="neon-text" style={{ color: item.color }}>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="showcase-cta">
            <Link to="/portfolio" className="neon-button">
              See More Designs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title neon-text" style={{ color: 'var(--neon-pink)' }}>
            Ready to Light Up Your Space?
          </h2>
          <p className="cta-description">
            Create your custom neon sign today or rent one for your special event
          </p>
          <div className="cta-buttons">
            <Link to="/order" className="neon-button order-now-glow">
              Order Custom Sign
            </Link>
            <Link to="/rent" className="neon-button" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>
              Rent a Sign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
