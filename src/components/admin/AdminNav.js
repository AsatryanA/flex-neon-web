import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import './AdminNav.css';

function AdminNav() {
  const { t } = useLanguage();
  const navItems = [
    { path: '/admin', label: t('nav.home'), icon: '🏠', exact: true },
    { path: '/admin/portfolio', label: t('nav.portfolio'), icon: '🖼️' },
    { path: '/admin/about', label: t('nav.about'), icon: 'ℹ️' },
    { path: '/admin/rent', label: t('nav.rent'), icon: '🎉' },
    { path: '/admin/contact', label: t('nav.contact'), icon: '📞' },
    { path: '/admin/settings', label: t('nav.settings'), icon: '⚙️' },
  ];

  return (
    <nav className="admin-nav">
      <ul className="admin-nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminNav;
