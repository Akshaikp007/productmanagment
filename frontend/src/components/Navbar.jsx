import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo-glow">
            <svg
              className="navbar-brand-svg"
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
          <div className="navbar-titles">
            <h1 className="navbar-title">Product Management System</h1>
            <span className="navbar-env-badge">
              <span className="pulse-dot"></span> LIVE REST API
            </span>
          </div>
        </div>

        <div className="navbar-user-section">
          {user && (
            <div className="user-badge" title={user.email}>
              <span className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                {user.email && <span className="user-email text-muted">({user.email})</span>}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm logout-action-btn"
            id="logout-btn"
            title="Sign out of your account"
          >
            <svg
              className="btn-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
