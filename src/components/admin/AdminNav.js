import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNav.css';

function AdminNav() {
  const navItems = [
    { path: '/admin', label: 'Home', icon: '🏠', exact: true },
    { path: '/admin/portfolio', label: 'Portfolio', icon: '🖼️' },
    { path: '/admin/about', label: 'About', icon: 'ℹ️' },
    { path: '/admin/rent', label: 'Rent', icon: '🎉' },
    { path: '/admin/contact', label: 'Contact', icon: '📞' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
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
