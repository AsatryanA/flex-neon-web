import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeatures, getShowcase } from '../api/contentService';
import { useLanguage } from '../i18n/LanguageContext';
import './Home.css';

function Home() {
  const { t } = useLanguage();
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
    return <div className="loading">{t('auth.loading')}</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>{t('home.heroTitle1')}</span>
              <br />
              {t('home.heroTitle2')}
            </h1>
            <p className="hero-subtitle">
              {t('home.heroSubtitle')}
            </p>
            <p className="hero-description">
              {t('home.heroDescription')}
            </p>
            <div className="hero-buttons">
              <Link to="/order" className="neon-button order-now-glow">
                {t('home.designYourSign')}
              </Link>
              <Link to="/portfolio" className="hero-btn-secondary">
                {t('home.viewGallery')}
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
            <span className="neon-text" style={{ color: 'var(--neon-blue)' }}>{t('home.whyChooseUs')}</span>
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
            <span className="neon-text" style={{ color: 'var(--neon-purple)' }}>{t('home.popularDesigns')}</span>
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
              {t('home.seeMoreDesigns')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title neon-text" style={{ color: 'var(--neon-pink)' }}>
            {t('home.readyTitle')}
          </h2>
          <p className="cta-description">
            {t('home.readyDescription')}
          </p>
          <div className="cta-buttons">
            <Link to="/order" className="neon-button order-now-glow">
              {t('home.orderCustomSign')}
            </Link>
            <Link to="/rent" className="neon-button" style={{ borderColor: 'var(--neon-blue)', color: 'var(--neon-blue)' }}>
              {t('home.rentASign')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
