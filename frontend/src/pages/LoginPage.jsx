import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      await login(formData.email.trim(), formData.password);
      // Redirect to Product Management after successful login
      navigate('/products');
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message ||
        'Unable to log in. Please check your credentials or try again later.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-ambient-glow glow-1"></div>
      <div className="auth-ambient-glow glow-2"></div>

      <div className="auth-card card-surface">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <svg
              className="auth-logo-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="auth-super-title">ENTERPRISE ACCESS</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Authenticate to manage your product catalog</p>
        </div>

        {successMsg && (
          <div className="alert alert-success" role="alert">
            <div className="alert-content">
              <span className="alert-icon">✓</span>
              <span>{successMsg}</span>
            </div>
            <button
              type="button"
              className="alert-close"
              onClick={() => setSuccessMsg('')}
            >
              &times;
            </button>
          </div>
        )}

        {serverError && (
          <div className="alert alert-danger" role="alert">
            <div className="alert-content">
              <span className="alert-icon">✕</span>
              <span>{serverError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="login-email"
                name="email"
                className={`form-input has-icon ${formErrors.email ? 'input-error' : ''}`}
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
            </div>
            {formErrors.email && (
              <span className="field-error">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="login-password"
                name="password"
                className={`form-input has-icon ${formErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            {formErrors.password && (
              <span className="field-error">{formErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-glow auth-submit-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner-sm"></span> Authorizing...
              </>
            ) : (
              'Sign In to Dashboard →'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Need access?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
