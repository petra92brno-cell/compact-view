import React, { useEffect, useState } from 'react';
import './Snackbar.css';

const Snackbar = ({ type = 'success', message, onDismiss, onGoBack, autoHideMs = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (type === 'success' && autoHideMs > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideMs);
      return () => clearTimeout(timer);
    }
  }, [type, autoHideMs]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 250); // match CSS exit animation duration
  };

  if (!isVisible) return null;

  return (
    <div className={`snackbar snackbar--${type} ${isExiting ? 'snackbar--exiting' : ''}`}>
      <div className="snackbar__content">
        {type === 'success' && (
          <svg className="snackbar__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6.5 10.5L9 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {type === 'error' && (
          <svg className="snackbar__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="14" r="1" fill="currentColor"/>
          </svg>
        )}
        <span className="snackbar__message">{message}</span>
      </div>
      <div className="snackbar__actions">
        {type === 'error' && onGoBack && (
          <button className="snackbar__go-back-btn" onClick={onGoBack}>
            Go back
          </button>
        )}
        <button className="snackbar__close-btn" onClick={handleDismiss} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
