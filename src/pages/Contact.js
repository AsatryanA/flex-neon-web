import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      info: 'info@flexneon.am',
      link: 'mailto:hello@flexneon.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      info: '+374 (91) 12-09-01',
      link: 'tel:+37491120901'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      info: 'Nor Nork 5 distinct, Yerevan',
      link: 'https://maps.google.com'
    },
    {
      icon: '⏰',
      title: 'Working Hours',
      info: 'Mon-Fri: 10AM - 7PM',
      link: null
    }
  ];

  return (
    <div className="contact">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1 className="contact-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>Get In Touch</span>
          </h1>
          <p className="contact-subtitle">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-grid">
          {contactInfo.map((item, index) => (
            <div key={index} className="contact-info-card">
              <div className="contact-icon">{item.icon}</div>
              <h3 className="contact-info-title">{item.title}</h3>
              {item.link ? (
                <a href={item.link} className="contact-info-text">
                  {item.info}
                </a>
              ) : (
                <p className="contact-info-text">{item.info}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <div className="form-wrapper">
            <h2 className="form-heading neon-text" style={{ color: 'var(--neon-blue)' }}>
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully!</h3>
                <p>We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
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
                    <label htmlFor="email">Email Address *</label>
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
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your project..."
                  ></textarea>
                </div>

                <button type="submit" className="neon-button submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="contact-faq">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-purple)' }}>
            Frequently Asked Questions
          </h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How long does it take to make a custom sign?</h3>
              <p className="faq-answer">
                Most custom signs are completed within 2-3 weeks from order confirmation, including production and shipping time.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Do you ship internationally?</h3>
              <p className="faq-answer">
                Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">What is your return policy?</h3>
              <p className="faq-answer">
                We offer a 30-day satisfaction guarantee. If you're not happy with your sign, contact us for a replacement or refund.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Can I see a proof before production?</h3>
              <p className="faq-answer">
                Absolutely! We'll send you a digital proof for approval before we start manufacturing your custom neon sign.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
