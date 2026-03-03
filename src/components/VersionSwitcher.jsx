import React, { useState, useRef, useEffect } from 'react';
import './VersionSwitcher.css';

const VERSIONS = [
  { id: 'v1', label: 'v1 – Campaign Creation' },
  { id: 'v1_new_month_week', label: 'v1_new month and week view' },
  { id: 'v1_share', label: 'v1_share' },
  { id: 'v1_collection', label: 'v1_collection' },
  { id: 'mercedes', label: 'Mercedes-Benz – Client Demo' },
];

const VersionSwitcher = ({ children, activeVersion: activeVersionProp, onVersionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalVersion, setInternalVersion] = useState('v1');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const activeVersion = activeVersionProp ?? internalVersion;
  const handleVersionChange = onVersionChange ?? ((id) => setInternalVersion(id));

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showResetConfirm) {
          setShowResetConfirm(false);
        } else {
          setIsOpen(false);
        }
      }
    };

    if (isOpen || showResetConfirm) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showResetConfirm]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleVersionSelect = (versionId) => {
    handleVersionChange(versionId);
    setIsOpen(false);
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  const handleResetClick = () => {
    setIsOpen(false);
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    window.location.reload();
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  return (
    <div className="version-switcher" ref={dropdownRef}>
      {/* Trigger: wraps the avatar button */}
      <div onClick={handleToggle}>
        {children}
      </div>

      {isOpen && (
        <>
          {/* Invisible overlay to catch outside clicks */}
          <div
            className="version-switcher__overlay"
            onClick={handleOverlayClick}
          />

          {/* Dropdown */}
          <div className="version-switcher__dropdown">
            {/* Header */}
            <div className="version-switcher__header">
              Prototype versions
            </div>

            {/* Version list */}
            <ul className="version-switcher__list">
              {VERSIONS.map((version) => {
                const isActive = version.id === activeVersion;
                return (
                  <li key={version.id}>
                    <button
                      className={`version-switcher__item${isActive ? ' version-switcher__item--active' : ''}`}
                      onClick={() => handleVersionSelect(version.id)}
                    >
                      <span className={`version-switcher__check${isActive ? '' : ' version-switcher__check--empty'}`}>
                        {isActive && (
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M13.3 4.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L6.6 9.6l5.3-5.3a1 1 0 0 1 1.4 0z"
                              fill="#22c55e"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="version-switcher__label">{version.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <div className="version-switcher__divider" />

            {/* Footer */}
            <div className="version-switcher__footer">
              <button className="version-switcher__footer-link" onClick={() => setIsOpen(false)}>
                <svg className="version-switcher__footer-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="0.75" fill="currentColor" />
                </svg>
                About this prototype
              </button>
              <button className="version-switcher__footer-link" onClick={handleResetClick}>
                <svg className="version-switcher__footer-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 2.5v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.8 9.5a5.5 5.5 0 1 0 1.1-4L2.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Reset to default state
              </button>
            </div>
          </div>
        </>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="version-switcher__confirm-overlay" onClick={handleResetCancel}>
          <div className="version-switcher__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="version-switcher__confirm-title">Reset prototype?</h3>
            <p className="version-switcher__confirm-description">
              This will remove all changes and return to the default state with mock data.
            </p>
            <div className="version-switcher__confirm-actions">
              <button className="version-switcher__confirm-cancel" onClick={handleResetCancel}>
                Cancel
              </button>
              <button className="version-switcher__confirm-reset" onClick={handleResetConfirm}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;
