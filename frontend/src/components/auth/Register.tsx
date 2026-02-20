import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

// Debug: log at module load so you can see the value in the browser console
console.log('[reCAPTCHA] REACT_APP_RECAPTCHA_SITE_KEY at module load:', RECAPTCHA_SITE_KEY || '(not set)');

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Dynamically load reCAPTCHA v3 script if site key is configured
  useEffect(() => {
    console.log('[reCAPTCHA] useEffect running, site key:', RECAPTCHA_SITE_KEY || '(not set)');

    if (!RECAPTCHA_SITE_KEY) {
      console.warn('[reCAPTCHA] No site key — script will NOT load. Set REACT_APP_RECAPTCHA_SITE_KEY in Vercel and redeploy.');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => console.log('[reCAPTCHA] Script loaded successfully, window.grecaptcha:', !!(window as any).grecaptcha);
    script.onerror = (e) => console.error('[reCAPTCHA] Script FAILED to load:', e);
    document.head.appendChild(script);
    console.log('[reCAPTCHA] Script tag appended to <head>');

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) badge.remove();
    };
  }, []);

  const getRecaptchaToken = (): Promise<string | undefined> => {
    console.log('[reCAPTCHA] getRecaptchaToken called, grecaptcha:', !!(window as any).grecaptcha);
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('[reCAPTCHA] No site key — skipping token generation');
      return Promise.resolve(undefined);
    }
    if (!(window as any).grecaptcha) {
      console.warn('[reCAPTCHA] window.grecaptcha not defined — script may not have loaded yet');
      return Promise.resolve(undefined);
    }
    return new Promise((resolve) => {
      (window as any).grecaptcha.ready(() => {
        console.log('[reCAPTCHA] grecaptcha.ready fired, executing...');
        (window as any).grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: 'register' })
          .then((token: string) => {
            console.log('[reCAPTCHA] Token generated successfully (first 20 chars):', token.slice(0, 20));
            resolve(token);
          })
          .catch((err: any) => {
            console.error('[reCAPTCHA] execute failed:', err);
            resolve(undefined);
          });
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const recaptchaToken = await getRecaptchaToken();
      await register({ name, email, password, recaptchaToken });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>ProposalIQ</h1>
        <h2>Create Your Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 8 characters)"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
