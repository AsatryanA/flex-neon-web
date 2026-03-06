import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Footer.css';

function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title neon-text">FLEX NEON</h3>
            <p className="footer-description">
              {t('footer.description')}
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="social-icon">📷</i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="social-icon">📘</i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="social-icon">🐦</i>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                <i className="social-icon">📌</i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('footer.home')}</Link></li>
              <li><Link to="/portfolio">{t('footer.portfolio')}</Link></li>
              <li><Link to="/about">{t('footer.about')}</Link></li>
              <li><Link to="/order" className="order-now-glow">{t('footer.orderCustom')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.services')}</h4>
            <ul className="footer-links">
              <li><Link to="/order" className="order-now-glow">{t('footer.customDesigns')}</Link></li>
              <li><Link to="/rent">{t('footer.rentSigns')}</Link></li>
              <li><Link to="/portfolio">{t('footer.gallery')}</Link></li>
              <li><Link to="/contact">{t('footer.getQuote')}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.contactInfo')}</h4>
            <ul className="footer-contact">
              <li>📧 hello@flexneon.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Neon Street, Creative City, CA 90210</li>
              <li>⏰ Mon-Fri: 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            &copy; {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
