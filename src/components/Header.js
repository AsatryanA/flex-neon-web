import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text neon-text">FLEX</span>
          <span className="logo-subtitle">NEON</span>
        </Link>

        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('nav.home')}</Link>
          <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'active' : ''}>{t('nav.portfolio')}</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>{t('nav.about')}</Link>
          <Link to="/rent" className={location.pathname === '/rent' ? 'active' : ''}>{t('nav.rent')}</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>{t('nav.contact')}</Link>
          <Link to="/order" className="nav-order-btn order-now-glow">{t('nav.orderNow')}</Link>
          <div className="nav-language-switcher">
            <LanguageSwitcher />
          </div>
          {/* Mobile auth links */}
          <div className="nav-auth-mobile">
            {isAuthenticated ? (
              <button className="nav-logout-btn" onClick={handleLogout}>
                {t('auth.logout')}
              </button>
            ) : (
              <Link to="/login" className="nav-login-btn-mobile">{t('auth.login')}</Link>
            )}
          </div>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-avatar"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User menu"
              >
                {getInitials(user?.name)}
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <span className="user-dropdown-name">{user?.name}</span>
                    <span className="user-dropdown-email">{user?.email}</span>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  {user?.role === 'ADMIN' && (
                    <>
                      <Link to="/admin" className="user-dropdown-item">
                        Admin Panel
                      </Link>
                      <div className="user-dropdown-divider"></div>
                    </>
                  )}
                  <button className="user-dropdown-item" onClick={handleLogout}>
                    {t('auth.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="header-login-btn">
              {t('auth.login')}
            </Link>
          )}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
