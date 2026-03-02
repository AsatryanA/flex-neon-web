import React, { useEffect, useMemo, useState } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import {
  assignAdminRole,
  changeAdminPassword,
  createSetting,
  getAdminSettings,
  updateSetting,
} from '../../api/adminService';
import './SettingsAdmin.css';

function SettingsAdmin() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [languages, setLanguages] = useState('en, ru, hy');
  const [logoUrl, setLogoUrl] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [roleForm, setRoleForm] = useState({
    email: '',
    role: 'ADMIN',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const settingMap = useMemo(() => {
    const map = new Map();
    settings.forEach((item) => {
      const key = item.key || item.name;
      if (key) map.set(key, item);
    });
    return map;
  }, [settings]);

  useEffect(() => {
    const savedLanguages = settingMap.get('supported_languages')?.value || settingMap.get('languages')?.value;
    const savedLogo = settingMap.get('site_logo_url')?.value || settingMap.get('logo_url')?.value;

    if (savedLanguages) setLanguages(savedLanguages);
    if (savedLogo) setLogoUrl(savedLogo);
  }, [settingMap]);

  const fetchSettings = async () => {
    try {
      const response = await getAdminSettings();
      setSettings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const upsertSetting = async (key, value) => {
    const existing = settingMap.get(key);
    if (existing?.id) {
      return updateSetting(existing.id, { ...existing, key, value });
    }
    return createSetting({ key, value, active: true, displayOrder: 0 });
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await Promise.all([
        upsertSetting('supported_languages', languages),
        upsertSetting('site_logo_url', logoUrl),
      ]);
      setMessage('Settings saved successfully');
      fetchSettings();
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Failed to change password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await assignAdminRole({ email: roleForm.email, role: roleForm.role });
      setMessage('Role updated successfully');
      setRoleForm({ email: '', role: 'ADMIN' });
    } catch (err) {
      console.error('Failed to update role:', err);
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="settings-admin">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="settings-btn" onClick={handleSaveGeneral} disabled={saving}>
          {saving ? 'Saving...' : 'Save General Settings'}
        </button>
      </div>

      <div className="settings-grid">
        <section className="settings-card">
          <h2>Languages</h2>
          <p className="settings-help">Set available language codes separated by commas.</p>
          <div className="settings-form">
            <div className="form-group">
              <label>Supported Languages</label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="en, ru, hy"
              />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h2>Logo</h2>
          <p className="settings-help">Set logo URL or upload a new logo.</p>
          <div className="settings-form">
            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Upload Logo</label>
              <ImageUpload onImageUploaded={(url) => setLogoUrl(url)} folder="logo" />
            </div>
            {logoUrl && (
              <div className="logo-preview">
                <img src={logoUrl} alt="Logo preview" />
              </div>
            )}
          </div>
        </section>

        <section className="settings-card">
          <h2>Admin Password</h2>
          <p className="settings-help">Change your current admin password.</p>
          <form className="settings-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="settings-actions">
              <button type="submit" className="settings-btn">Update Password</button>
            </div>
          </form>
        </section>

        <section className="settings-card">
          <h2>Admin Roles</h2>
          <p className="settings-help">Assign admin/editor role to an existing user by email.</p>
          <form className="settings-form" onSubmit={handleAssignRole}>
            <div className="form-group">
              <label>User Email</label>
              <input
                type="email"
                value={roleForm.email}
                onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={roleForm.role}
                onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="EDITOR">EDITOR</option>
              </select>
            </div>
            <div className="settings-actions">
              <button type="submit" className="settings-btn">Assign Role</button>
            </div>
          </form>
        </section>
      </div>

      {message && <div className="settings-message">{message}</div>}
      {error && <div className="settings-error">{error}</div>}
    </div>
  );
}

export default SettingsAdmin;
