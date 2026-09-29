import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (minimum 6 characters)
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.confirmPassword
      );
      // On successful registration: redirect to login with success message
      navigate('/login', {
        state: { successMessage: 'Registration successful! Please log in with your credentials.' },
      });
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to register. Please check your information and try again.';
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
          <span className="auth-super-title">NEW OPERATOR</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Initialize your workspace profile</p>
        </div>

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
            <label htmlFor="register-name" className="form-label">
              Full Name
            </label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="register-name"
                name="name"
                className={`form-input has-icon ${formErrors.name ? 'input-error' : ''}`}
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
            </div>
            {formErrors.name && (
              <span className="field-error">{formErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-email" className="form-label">
              Email Address
            </label>
            <div className="input-with-icon">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="register-email"
                name="email"
                className={`form-input has-icon ${formErrors.email ? 'input-error' : ''}`}
                placeholder="alex@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {formErrors.email && (
              <span className="field-error">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-password" className="form-label">
              Password (min. 6 characters)
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="register-password"
                name="password"
                className={`form-input has-icon ${formErrors.password ? 'input-error' : ''}`}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {formErrors.password && (
              <span className="field-error">{formErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="register-confirm-password" className="form-label">
              Confirm Password
            </label>
            <div className="input-with-icon">
              <span className="input-icon">🛡️</span>
              <input
                type="password"
                id="register-confirm-password"
                name="confirmPassword"
                className={`form-input has-icon ${formErrors.confirmPassword ? 'input-error' : ''}`}
                placeholder="••••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            {formErrors.confirmPassword && (
              <span className="field-error">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-glow auth-submit-btn"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner-sm"></span> Creating Profile...
              </>
            ) : (
              'Complete Registration →'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Existing operator?{' '}
            <Link to="/login" className="auth-link">
              Sign in to account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
