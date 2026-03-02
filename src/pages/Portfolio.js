import React, { useCallback, useEffect, useState } from 'react';
import { getPortfolio } from '../api/contentService';
import './Portfolio.css';

const fallbackPortfolioItems = [
  { id: 1, title: 'Good Vibes Only', category: 'quotes', color: 'pink', imageUrl: '' },
  { id: 2, title: 'OPEN', category: 'business', color: 'blue', imageUrl: '' },
  { id: 3, title: 'Love', category: 'wedding', color: 'purple', imageUrl: '' },
  { id: 4, title: 'Dream Big', category: 'quotes', color: 'green', imageUrl: '' },
  { id: 5, title: 'BAR', category: 'business', color: 'orange', imageUrl: '' },
  { id: 6, title: 'Mr & Mrs', category: 'wedding', color: 'pink', imageUrl: '' },
  { id: 7, title: 'Hello Beautiful', category: 'quotes', color: 'blue', imageUrl: '' },
  { id: 8, title: 'COFFEE', category: 'business', color: 'yellow', imageUrl: '' },
  { id: 9, title: 'Just Married', category: 'wedding', color: 'purple', imageUrl: '' },
  { id: 10, title: 'Be Kind', category: 'quotes', color: 'green', imageUrl: '' },
  { id: 11, title: 'PIZZA', category: 'business', color: 'orange', imageUrl: '' },
  { id: 12, title: 'Forever', category: 'wedding', color: 'pink', imageUrl: '' },
];

const categories = [
  { id: 'all', label: 'All Designs' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'business', label: 'Business' },
  { id: 'wedding', label: 'Wedding' },
];

const normalizeCategory = (category = '') => category.toLowerCase();
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const resolveImageUrl = (rawUrl = '') => {
  if (!rawUrl) return '';
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  if (rawUrl.startsWith('//')) return `https:${rawUrl}`;
  if (rawUrl.startsWith('/')) return `${API_BASE_URL}${rawUrl}`;
  return `${API_BASE_URL}/${rawUrl}`;
};

const getItemImageUrl = (item = {}) => {
  const raw =
    item.imageUrl ||
    item.imageURL ||
    item.image ||
    item.url ||
    item.photoUrl ||
    item.thumbnailUrl ||
    item.fileUrl ||
    item?.media?.url ||
    item?.image?.url ||
    '';
  return resolveImageUrl(raw);
};

function Portfolio() {
  const [filter, setFilter] = useState('all');
  const [portfolioItems, setPortfolioItems] = useState(fallbackPortfolioItems);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await getPortfolio();
        const apiItems = Array.isArray(response.data) ? response.data : [];
        const normalizedItems = apiItems
          .filter((item) => item?.active !== false)
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((item, index) => ({
            id: item.id ?? index,
            title: item.title || 'Untitled',
            category: normalizeCategory(item.category || 'quotes'),
            color: item.color || 'pink',
            imageUrl: getItemImageUrl(item),
          }));

        if (normalizedItems.length) {
          setPortfolioItems(normalizedItems);
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const filteredItems = filter === 'all'
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === filter);
  const activeItem = filteredItems[activeIndex];

  const openLightbox = (index) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft' && filteredItems.length > 1) showPrev();
      if (event.key === 'ArrowRight' && filteredItems.length > 1) showNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeLightbox, filteredItems.length, isLightboxOpen, showNext, showPrev]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="portfolio">
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1 className="portfolio-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>Our Portfolio</span>
          </h1>
          <p className="portfolio-subtitle">
            Explore our stunning collection of custom neon signs
          </p>
        </div>

        <div className="portfolio-filter">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="portfolio-item"
              style={{ color: item.color || 'var(--neon-pink)' }}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openLightbox(index);
                }
              }}
            >
              <div className={`portfolio-neon neon-${item.color}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="portfolio-image" loading="lazy" />
                ) : (
                  <span className="neon-text">{item.title}</span>
                )}
              </div>
              <div className="portfolio-overlay">
                <h3 className="portfolio-item-title">{item.title}</h3>
                <p className="portfolio-item-category">
                  {categories.find((c) => c.id === item.category)?.label || item.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="portfolio-cta">
          <h2 className="cta-title neon-text" style={{ color: 'var(--neon-blue)' }}>
            Have Your Own Design in Mind?
          </h2>
          <p className="cta-text">
            Let us bring your vision to life with a custom neon sign
          </p>
          <button className="neon-button order-now-glow" onClick={() => window.location.href = '/order'}>
            Start Designing
          </button>
        </div>
      </div>

      {isLightboxOpen && activeItem && (
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          <div className="portfolio-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close image">
              ×
            </button>

            {filteredItems.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={showPrev} aria-label="Previous image">
                  ‹
                </button>
                <button className="lightbox-nav lightbox-next" onClick={showNext} aria-label="Next image">
                  ›
                </button>
              </>
            )}

            {activeItem.imageUrl ? (
              <img src={activeItem.imageUrl} alt={activeItem.title} className="lightbox-image" />
            ) : (
              <div className="lightbox-fallback neon-text">{activeItem.title}</div>
            )}

            <div className="lightbox-caption">
              <h3>{activeItem.title}</h3>
              <p>{categories.find((c) => c.id === activeItem.category)?.label || activeItem.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
