import React, { useEffect, useState } from 'react';
import { getContactInfo, getFAQs } from '../api/contentService';
import { useLanguage } from '../i18n/LanguageContext';
import './Contact.css';

const fallbackContactInfo = [
  {
    icon: '📧',
    title: 'Email Us',
    info: 'info@flexneon.am',
    link: 'mailto:hello@flexneon.com',
  },
  {
    icon: '📞',
    title: 'Call Us',
    info: '+374 (91) 12-09-01',
    link: 'tel:+37491120901',
  },
  {
    icon: '📍',
    title: 'Visit Us',
    info: 'Nor Nork 5 distinct, Yerevan',
    link: 'https://maps.google.com',
  },
  {
    icon: '⏰',
    title: 'Working Hours',
    info: 'Mon-Fri: 10AM - 7PM',
    link: null,
  },
];

const fallbackFaqs = [
  {
    question: 'How long does it take to make a custom sign?',
    answer: 'Most custom signs are completed within 2-3 weeks from order confirmation, including production and shipping time.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.',
  },
  {
    question: 'What is your return policy?',
    answer: "We offer a 30-day satisfaction guarantee. If you're not happy with your sign, contact us for a replacement or refund.",
  },
  {
    question: 'Can I see a proof before production?',
    answer: "Absolutely! We'll send you a digital proof for approval before we start manufacturing your custom neon sign.",
  },
];

const sortAndFilterActive = (items) => items
  .filter((item) => item?.active !== false)
  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

const ensureWorkingHoursCard = (items, t) => {
  const hasWorkingHours = items.some((item) => {
    const title = (item.title || '').toLowerCase();
    return title.includes('working') || title.includes('hours');
  });

  if (hasWorkingHours) return items;

  return [
    ...items,
    {
      icon: '⏰',
      title: t('contact.info.hours'),
      info: t('contact.info.hoursText'),
      link: null,
    },
  ];
};

function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState(fallbackContactInfo);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [contactRes, faqsRes] = await Promise.all([getContactInfo(), getFAQs()]);

        const apiContact = Array.isArray(contactRes.data) ? sortAndFilterActive(contactRes.data) : [];
        const apiFaqs = Array.isArray(faqsRes.data) ? sortAndFilterActive(faqsRes.data) : [];

        if (apiContact.length) {
          const mapped = apiContact.map((item) => ({
            icon: item.icon || 'ℹ️',
            title: item.title || 'Info',
            info: item.info || '',
            link: item.link || null,
          }));
          setContactInfo(ensureWorkingHoursCard(mapped, t));
        }

        if (apiFaqs.length) {
          setFaqs(apiFaqs.map((item) => ({
            question: item.question || '',
            answer: item.answer || '',
          })));
        }
      } catch (error) {
        console.error('Failed to load contact content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [t]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
        message: '',
      });
    }, 3000);
  };

  if (loading) {
    return <div className="loading">{t('auth.loading')}</div>;
  }

  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">
            <span className="neon-text" style={{ color: 'var(--neon-pink)' }}>{t('contact.title')}</span>
          </h1>
          <p className="contact-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>

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

        <div className="contact-form-section">
          <div className="form-wrapper">
            <h2 className="form-heading neon-text" style={{ color: 'var(--neon-blue)' }}>
              {t('contact.form.heading')}
            </h2>

            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>{t('contact.form.success')}</h3>
                <p>{t('contact.form.successText')}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">{t('contact.form.name')} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">{t('contact.form.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">{t('contact.form.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">{t('contact.form.subject')} *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.form.message')} *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder={t('contact.form.messagePlaceholder')}
                  ></textarea>
                </div>

                <button type="submit" className="neon-button submit-btn">
                  {t('contact.form.submit')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="contact-faq">
          <h2 className="section-heading neon-text" style={{ color: 'var(--neon-purple)' }}>
            {t('contact.faq.title')}
          </h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
