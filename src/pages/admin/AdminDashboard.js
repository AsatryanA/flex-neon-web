import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  getAdminPortfolio,
  getAdminFeatures,
  getAdminTeam,
  getAdminFAQs,
} from '../../api/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    portfolio: 0,
    features: 0,
    team: 0,
    faqs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [portfolioRes, featuresRes, teamRes, faqsRes] = await Promise.all([
        getAdminPortfolio(),
        getAdminFeatures(),
        getAdminTeam(),
        getAdminFAQs(),
      ]);

      setStats({
        portfolio: portfolioRes.data.length,
        features: featuresRes.data.length,
        team: teamRes.data.length,
        faqs: faqsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: t('admin.dashboard.portfolioItems'), count: stats.portfolio, icon: '🖼️', link: '/admin/portfolio', color: '#FF1493' },
    { title: t('admin.dashboard.features'), count: stats.features, icon: '✨', link: '/admin/features', color: '#00CED1' },
    { title: t('admin.dashboard.teamMembers'), count: stats.team, icon: '👥', link: '/admin/team', color: '#9D4EDD' },
    { title: t('admin.dashboard.faqs'), count: stats.faqs, icon: '❓', link: '/admin/faq', color: '#FF6B35' },
  ];

  if (loading) {
    return <div className="loading">{t('auth.loading')}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>{t('admin.dashboard.title')}</h1>
      <p className="dashboard-subtitle">{t('admin.dashboard.subtitle')}</p>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="dashboard-card"
            style={{ borderTop: `4px solid ${card.color}` }}
          >
            <div className="card-icon">{card.icon}</div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <div className="card-count">{card.count}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="quick-links">
        <h2>{t('admin.dashboard.quickActions')}</h2>
        <div className="quick-links-grid">
          <Link to="/admin/portfolio" className="quick-link">
            {t('admin.dashboard.addPortfolioItem')}
          </Link>
          <Link to="/admin/features" className="quick-link">
            {t('admin.dashboard.manageFeatures')}
          </Link>
          <Link to="/admin/settings" className="quick-link">
            {t('admin.dashboard.siteSettings')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
