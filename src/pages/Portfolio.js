import React, { useState } from 'react';
import './Portfolio.css';

function Portfolio() {
  const [filter, setFilter] = useState('all');

  const portfolioItems = [
    { id: 1, title: 'Good Vibes Only', category: 'quotes', color: 'pink' },
    { id: 2, title: 'OPEN', category: 'business', color: 'blue' },
    { id: 3, title: 'Love', category: 'wedding', color: 'purple' },
    { id: 4, title: 'Dream Big', category: 'quotes', color: 'green' },
    { id: 5, title: 'BAR', category: 'business', color: 'orange' },
    { id: 6, title: 'Mr & Mrs', category: 'wedding', color: 'pink' },
    { id: 7, title: 'Hello Beautiful', category: 'quotes', color: 'blue' },
    { id: 8, title: 'COFFEE', category: 'business', color: 'yellow' },
    { id: 9, title: 'Just Married', category: 'wedding', color: 'purple' },
    { id: 10, title: 'Be Kind', category: 'quotes', color: 'green' },
    { id: 11, title: 'PIZZA', category: 'business', color: 'orange' },
    { id: 12, title: 'Forever', category: 'wedding', color: 'pink' }
  ];

  const categories = [
    { id: 'all', label: 'All Designs' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'business', label: 'Business' },
    { id: 'wedding', label: 'Wedding' }
  ];

  const filteredItems = filter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="portfolio">
      <div className="portfolio-container">
        {/* Header */}
        <div className="portfolio-header">
          <h1 className="portfolio-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>Our Portfolio</span>
          </h1>
          <p className="portfolio-subtitle">
            Explore our stunning collection of custom neon signs
          </p>
        </div>

        {/* Filter */}
        <div className="portfolio-filter">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="portfolio-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="portfolio-item">
              <div className={`portfolio-neon neon-${item.color}`}>
                <span className="neon-text">{item.title}</span>
              </div>
              <div className="portfolio-overlay">
                <h3 className="portfolio-item-title">{item.title}</h3>
                <p className="portfolio-item-category">
                  {categories.find(c => c.id === item.category)?.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
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
    </div>
  );
}

export default Portfolio;
