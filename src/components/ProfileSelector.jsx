import React, { useState, useRef, useEffect } from 'react';
import FacebookIcon from '../assets/facebook.svg';
import InstagramIcon from '../assets/instagram.svg';
import './ProfileSelector.css';

// Default profile data used across the app
const DEFAULT_PROFILES = [
  { id: 'fakecosmetic-cz-fb', name: 'FakeCosmetic CZ', platform: 'FB', initials: 'FC' },
  { id: 'fakecosmetic-cz-ig', name: 'FakeCosmetic CZ', platform: 'IG', initials: 'FC' },
  { id: 'fakecompany-fr-fb', name: 'FakeCompany FR', platform: 'FB', initials: 'FF' },
  { id: 'fakecompany-fr-ig', name: 'FakeCompany FR', platform: 'IG', initials: 'FF' },
];

const getPlatformIcon = (platform) => {
  if (platform === 'FB') return FacebookIcon;
  if (platform === 'IG') return InstagramIcon;
  return null;
};

const ProfileSelector = ({ selectedProfiles, onSelectionChange, hasError, availableProfiles }) => {
  const ALL_PROFILES = availableProfiles || DEFAULT_PROFILES;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Temp selection used inside the dropdown (committed on Save)
  const [tempSelection, setTempSelection] = useState(new Set());
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Sync tempSelection when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTempSelection(new Set(selectedProfiles));
      setSearchQuery('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        containerRef.current && !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filter profiles by search
  const filteredProfiles = ALL_PROFILES.filter((p) => {
    const text = `${p.name} ${p.platform}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const allFilteredSelected =
    filteredProfiles.length > 0 &&
    filteredProfiles.every((p) => tempSelection.has(p.id));

  const handleToggleProfile = (id) => {
    setTempSelection((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setTempSelection((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredProfiles.forEach((p) => next.delete(p.id));
      } else {
        filteredProfiles.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  const handleSave = () => {
    onSelectionChange(Array.from(tempSelection));
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleRemoveProfile = (id, e) => {
    e.stopPropagation();
    const next = selectedProfiles.filter((pid) => pid !== id);
    onSelectionChange(next);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  const handleContainerClick = (e) => {
    // Don't open dropdown if clicking a remove button or clear button
    if (e.target.closest('.profile-selector__chip-remove')) return;
    if (e.target.closest('.profile-selector__clear-btn')) return;
    setIsOpen(true);
  };

  const selectedProfileObjects = ALL_PROFILES.filter((p) =>
    selectedProfiles.includes(p.id)
  );

  const hasSelection = selectedProfileObjects.length > 0;

  return (
    <div className="profile-selector" ref={containerRef}>
      {/* Input-like container */}
      <div
        className={`profile-selector__container ${hasSelection ? 'profile-selector__container--has-chips' : ''} ${isOpen ? 'profile-selector__container--focused' : ''} ${hasError ? 'profile-selector__container--error' : ''}`}
        onClick={handleContainerClick}
      >
        <div className="profile-selector__container-content">
          {!hasSelection ? (
            <span className="profile-selector__placeholder">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Select Profiles
            </span>
          ) : (
            <div className="profile-selector__chips">
              {selectedProfileObjects.map((profile) => {
                const platformIcon = getPlatformIcon(profile.platform);
                return (
                  <div key={profile.id} className="profile-selector__chip">
                    <div className="profile-selector__chip-avatar">
                      {profile.initials}
                    </div>
                    {platformIcon && (
                      <img
                        src={platformIcon}
                        alt={profile.platform}
                        className="profile-selector__chip-platform-icon"
                      />
                    )}
                    <span className="profile-selector__chip-name">
                      {profile.name} ({profile.platform})
                    </span>
                    <button
                      className="profile-selector__chip-remove"
                      onClick={(e) => handleRemoveProfile(profile.id, e)}
                      title="Remove profile"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M2.5 2.5L7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="profile-selector__container-right">
          {hasSelection && (
            <button
              className="profile-selector__clear-btn"
              onClick={handleClearAll}
              type="button"
              aria-label="Clear all profiles"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <svg
            className={`profile-selector__arrow ${isOpen ? 'profile-selector__arrow--open' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="profile-selector__dropdown" ref={dropdownRef}>
          {/* Search */}
          <div className="profile-selector__search">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM13 13l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Select All */}
          <div className="profile-selector__select-all" onClick={handleSelectAll}>
            <div className="profile-selector__checkbox">
              <input type="checkbox" checked={allFilteredSelected} onChange={handleSelectAll} />
              <div className={`profile-selector__checkbox-box ${allFilteredSelected ? 'profile-selector__checkbox-box--checked' : ''}`}>
                {allFilteredSelected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="profile-selector__select-all-label">
              SELECT ALL PROFILES ({tempSelection.size}/{ALL_PROFILES.length})
            </span>
          </div>

          {/* Profile list */}
          <div className="profile-selector__list">
            {filteredProfiles.map((profile) => {
              const isChecked = tempSelection.has(profile.id);
              const platformIcon = getPlatformIcon(profile.platform);
              return (
                <div
                  key={profile.id}
                  className={`profile-selector__item ${isChecked ? 'profile-selector__item--selected' : ''}`}
                  onClick={() => handleToggleProfile(profile.id)}
                >
                  <div className="profile-selector__checkbox">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleProfile(profile.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={`profile-selector__checkbox-box ${isChecked ? 'profile-selector__checkbox-box--checked' : ''}`}>
                      {isChecked && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="profile-selector__item-avatar">
                    {profile.initials}
                  </div>
                  {platformIcon && (
                    <img
                      src={platformIcon}
                      alt={profile.platform}
                      className="profile-selector__item-platform-icon"
                    />
                  )}
                  <span className="profile-selector__item-name">
                    {profile.name} ({profile.platform})
                  </span>
                </div>
              );
            })}
            {filteredProfiles.length === 0 && (
              <div className="profile-selector__empty">No profiles found</div>
            )}
          </div>

          {/* Footer */}
          <div className="profile-selector__footer">
            <button className="profile-selector__cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="profile-selector__save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
