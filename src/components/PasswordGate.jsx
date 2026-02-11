import { useState } from 'react';

const CORRECT_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD || 'compact-preview-2026';

function PasswordGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('authenticated') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="password-gate-overlay">
      <form onSubmit={handleSubmit} className="password-gate-card">
        <div className="password-gate-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="password-gate-title">This preview is password-protected</h2>
        <p className="password-gate-subtitle">Enter the password to continue</p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          className={`password-gate-input ${error ? 'password-gate-input-error' : ''}`}
          autoFocus
        />
        {error && <p className="password-gate-error">Incorrect password. Please try again.</p>}
        <button type="submit" className="password-gate-button">
          Continue
        </button>
      </form>
    </div>
  );
}

export default PasswordGate;
