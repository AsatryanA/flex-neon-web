import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { login, googleAuth } from '../api/authService';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page they were trying to visit, or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      loginUser(response);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || t('auth.loginError');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setIsLoading(true);
    try {
      const response = await googleAuth(credentialResponse.credential);
      loginUser(response);
      navigate(from, { replace: true });
    } catch (err) {
      setError(t('auth.googleError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title neon-text">{t('auth.login')}</h1>
            <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? t('auth.loading') : t('auth.loginBtn')}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('auth.or')}</span>
          </div>

          <div className="google-btn-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError(t('auth.googleError'))}
              theme="filled_black"
              size="large"
              width="100%"
              text="signin_with"
            />
          </div>

          <p className="auth-switch">
            {t('auth.noAccount')}{' '}
            <Link to="/register">{t('auth.registerLink')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
