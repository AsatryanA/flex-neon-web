import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
      >
        <span className="language-flag">{currentLanguage?.flag}</span>
        <span className="language-code">{currentLanguage?.code.toUpperCase()}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {language === lang.code && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="language-overlay" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
