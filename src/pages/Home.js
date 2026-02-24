import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const features = [
    {
      icon: '✨',
      title: 'Custom Designs',
      description: 'Create your unique neon sign with our easy-to-use design tool. Any text, any color, any size.'
    },
    {
      icon: '🎨',
      title: 'Professional Quality',
      description: 'Handcrafted by expert artisans using premium LED neon technology that lasts for years.'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Quick turnaround times with secure shipping. Get your custom neon sign in 2-3 weeks.'
    },
    {
      icon: '💰',
      title: 'Rent Options',
      description: 'Perfect for events, parties, and weddings. Rent stunning neon signs at affordable rates.'
    }
  ];

  const showcase = [
    { id: 1, title: 'Good Vibes Only', color: 'pink' },
    { id: 2, title: 'Hello Beautiful', color: 'blue' },
    { id: 3, title: 'Dream Big', color: 'purple' },
    { id: 4, title: 'Let\'s Party', color: 'green' }
  ];

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
              <Link to="/order" className="neon-button">
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
                  <span className="neon-text">{item.title}</span>
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
            <Link to="/order" className="neon-button">
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
