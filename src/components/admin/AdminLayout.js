import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import AdminNav from './AdminNav';
import LanguageSwitcher from '../LanguageSwitcher';
import './AdminLayout.css';

function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1 className="admin-logo">{t('admin.layout.brand')}</h1>
        <div className="admin-user-info">
          <LanguageSwitcher />
          <span>{user?.name || user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            {t('auth.logout')}
          </button>
        </div>
      </div>

      <div className="admin-container">
        <AdminNav />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
