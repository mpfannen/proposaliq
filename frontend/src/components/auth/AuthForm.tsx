import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForm.css';

type AuthMode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (mode === 'register') {
      if (!name) {
        setError('Please enter your name');
        return false;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <h1 className="auth-form-brand">ProposalIQ</h1>

        {/* Toggle Tabs */}
        <div className="auth-toggle">
          <button
            type="button"
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => mode !== 'login' && toggleMode()}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => mode !== 'register' && toggleMode()}
          >
            Register
          </button>
        </div>

        <h2 className="auth-form-title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name field - only for register */}
          {mode === 'register' && (
            <div className="form-field">
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
          )}

          {/* Email field */}
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
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

          {/* Password field */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter your password'}
              disabled={isLoading}
              required
            />
          </div>

          {/* Confirm Password - only for register */}
          {mode === 'register' && (
            <div className="form-field">
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
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading
              ? mode === 'login'
                ? 'Logging in...'
                : 'Creating account...'
              : mode === 'login'
              ? 'Login'
              : 'Register'}
          </button>
        </form>

        {/* Additional info */}
        <p className="auth-form-footer">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" className="link-btn" onClick={toggleMode}>
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="link-btn" onClick={toggleMode}>
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
