import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title neon-text">FLEX NEON</h3>
            <p className="footer-description">
              Creating stunning custom neon signs that illuminate your space and bring your vision to life.
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
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/order" className="order-now-glow">Order Custom Sign</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><Link to="/order" className="order-now-glow">Custom Designs</Link></li>
              <li><Link to="/rent">Rent Neon Signs</Link></li>
              <li><Link to="/portfolio">Gallery</Link></li>
              <li><Link to="/contact">Get a Quote</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
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
            &copy; {currentYear} Flex Neon. All rights reserved. | Designed with 💜 for creativity
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
