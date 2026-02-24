import React, { useState } from 'react';
import './Rent.css';

function Rent() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    duration: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const rentalPackages = [
    {
      id: 1,
      name: 'Starter',
      price: '$99',
      duration: 'per day',
      features: [
        '1 Small Neon Sign',
        'Basic Setup Included',
        'Standard Delivery',
        '24/7 Support',
        'Free Collection'
      ],
      color: 'var(--neon-pink)',
      popular: false
    },
    {
      id: 2,
      name: 'Popular',
      price: '$199',
      duration: 'per day',
      features: [
        '2-3 Medium Neon Signs',
        'Professional Setup',
        'Same-Day Delivery',
        'Priority Support',
        'Free Collection',
        'Event Consultation'
      ],
      color: 'var(--neon-blue)',
      popular: true
    },
    {
      id: 3,
      name: 'Premium',
      price: '$349',
      duration: 'per day',
      features: [
        '4-6 Large Neon Signs',
        'Full Setup & Styling',
        'Express Delivery',
        'Dedicated Support',
        'Free Collection',
        'Event Design Service',
        'Photography Lighting'
      ],
      color: 'var(--neon-purple)',
      popular: false
    }
  ];

  const occasions = [
    { icon: '💍', name: 'Weddings', description: 'Make your special day unforgettable' },
    { icon: '🎉', name: 'Parties', description: 'Light up your celebration' },
    { icon: '💼', name: 'Corporate Events', description: 'Professional event lighting' },
    { icon: '📸', name: 'Photo Shoots', description: 'Perfect backdrop for photos' },
    { icon: '🎭', name: 'Performances', description: 'Stage and performance lighting' },
    { icon: '🏪', name: 'Pop-up Shops', description: 'Attract customers with neon' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Rental request submitted:', { ...formData, package: selectedPackage });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowContactForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        duration: '',
        message: ''
      });
    }, 3000);
  };

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowContactForm(true);
  };

  return (
    <div className="rent">
      <div className="rent-container">
        {/* Header */}
        <div className="rent-header">
          <h1 className="rent-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>Rent Neon Signs</span>
          </h1>
          <p className="rent-subtitle">
            Perfect lighting for your special events, parties, and celebrations
          </p>
        </div>

        {/* Benefits Section */}
        <section className="rent-benefits">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-blue)' }}>
            Why Rent From Us?
          </h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🚚</div>
              <h3>Free Delivery & Pickup</h3>
              <p>We handle all logistics for your event</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔧</div>
              <h3>Professional Setup</h3>
              <p>Our team ensures perfect installation</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💡</div>
              <h3>Premium Quality</h3>
              <p>High-quality LED neon signs that shine</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Affordable Pricing</h3>
              <p>Flexible packages for any budget</p>
            </div>
          </div>
        </section>

        {/* Occasions Section */}
        <section className="rent-occasions">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-purple)' }}>
            Perfect For Any Occasion
          </h2>
          <div className="occasions-grid">
            {occasions.map((occasion, index) => (
              <div key={index} className="occasion-card">
                <div className="occasion-icon">{occasion.icon}</div>
                <h3 className="occasion-name">{occasion.name}</h3>
                <p className="occasion-description">{occasion.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packages Section */}
        <section className="rent-packages">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-green)' }}>
            Rental Packages
          </h2>
          <div className="packages-grid">
            {rentalPackages.map(pkg => (
              <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                {pkg.popular && <div className="popular-badge">Most Popular</div>}
                <div className="package-header">
                  <h3 className="package-name" style={{ color: pkg.color }}>{pkg.name}</h3>
                  <div className="package-price">
                    <span className="price-amount neon-text" style={{ color: pkg.color }}>{pkg.price}</span>
                    <span className="price-duration">{pkg.duration}</span>
                  </div>
                </div>
                <ul className="package-features">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="package-btn neon-button"
                  style={{ borderColor: pkg.color, color: pkg.color }}
                  onClick={() => selectPackage(pkg)}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        {showContactForm && (
          <section className="rent-form-section">
            <div className="form-wrapper">
              <h2 className="form-heading neon-text" style={{ color: 'var(--neon-pink)' }}>
                Book Your Rental
              </h2>
              <p className="form-subheading">
                Selected Package: <strong style={{ color: selectedPackage?.color }}>
                  {selectedPackage?.name}
                </strong>
              </p>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <h3>Booking Request Received!</h3>
                  <p>We'll contact you within 24 hours to confirm your rental.</p>
                </div>
              ) : (
                <form className="rent-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="eventDate">Event Date *</label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="eventType">Event Type *</label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select event type...</option>
                        <option value="wedding">Wedding</option>
                        <option value="party">Party</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="photoshoot">Photo Shoot</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="duration">Rental Duration *</label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select duration...</option>
                        <option value="1">1 Day</option>
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="week">1 Week</option>
                        <option value="custom">Custom Duration</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Additional Details</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell us about your event, venue, and any special requirements..."
                    ></textarea>
                  </div>

                  <button type="submit" className="neon-button submit-btn">
                    Submit Booking Request
                  </button>
                </form>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Rent;
