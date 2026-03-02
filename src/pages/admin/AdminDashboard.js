import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminPortfolio,
  getAdminFeatures,
  getAdminTeam,
  getAdminFAQs,
} from '../../api/adminService';
import './AdminDashboard.css';

function AdminDashboard() {
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
    { title: 'Portfolio Items', count: stats.portfolio, icon: '🖼️', link: '/admin/portfolio', color: '#FF1493' },
    { title: 'Features', count: stats.features, icon: '✨', link: '/admin/features', color: '#00CED1' },
    { title: 'Team Members', count: stats.team, icon: '👥', link: '/admin/team', color: '#9D4EDD' },
    { title: 'FAQs', count: stats.faqs, icon: '❓', link: '/admin/faq', color: '#FF6B35' },
  ];

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to FlexNeon Admin Panel</p>

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
        <h2>Quick Actions</h2>
        <div className="quick-links-grid">
          <Link to="/admin/portfolio" className="quick-link">
            Add Portfolio Item
          </Link>
          <Link to="/admin/features" className="quick-link">
            Manage Features
          </Link>
          <Link to="/admin/settings" className="quick-link">
            Site Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
