import React, { useState, useCallback } from 'react';
import './SharingTooltip.css';

const SharingTooltip = ({ sharingType, sharedWith = [], campaignId, globalPermission = 'view' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback((e) => {
    e.stopPropagation();
    const url = `https://app.example.com/campaigns/${campaignId || 'draft'}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [campaignId]);

  const teams = sharedWith.filter(item => item.memberIds !== undefined);
  const users = sharedWith.filter(item => item.memberIds === undefined);

  const copyButton = (
    <button
      type="button"
      className={`sharing-tooltip__copy-btn ${copied ? 'sharing-tooltip__copy-btn--copied' : ''}`}
      onClick={handleCopyLink}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3.5 8.5 6.5 11.5 12.5 5.5" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.333 3.333 0 008.98 2.313l-1.147 1.14" />
          <path d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.333 3.333 0 004.713 4.714l1.14-1.14" />
        </svg>
      )}
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  );

  if (sharingType === 'private') {
    return (
      <div className="sharing-tooltip" onClick={(e) => e.stopPropagation()}>
        <div className="sharing-tooltip__header">
          <svg className="sharing-tooltip__header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <div className="sharing-tooltip__header-text">
            <span className="sharing-tooltip__label">Private</span>
            <span className="sharing-tooltip__subtext">Only you have access</span>
          </div>
        </div>
        <div className="sharing-tooltip__divider" />
        <div className="sharing-tooltip__info-box">
          <svg className="sharing-tooltip__info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
          </svg>
          <span className="sharing-tooltip__info-text">
            No one else in the account will be able to see, edit, share or delete this campaign.
          </span>
        </div>
        <div className="sharing-tooltip__divider" />
        {copyButton}
      </div>
    );
  }

  if (sharingType === 'global') {
    const isEdit = globalPermission === 'edit';
    return (
      <div className="sharing-tooltip" onClick={(e) => e.stopPropagation()}>
        <div className="sharing-tooltip__header">
          <svg className="sharing-tooltip__header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <div className="sharing-tooltip__header-text">
            <span className="sharing-tooltip__label">Global</span>
            <span className="sharing-tooltip__subtext">Everyone in the account has access</span>
          </div>
        </div>
        <div className="sharing-tooltip__divider" />
        <div className="sharing-tooltip__info-box">
          <svg className="sharing-tooltip__info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="5" r="0.75" fill="currentColor" />
          </svg>
          <div className="sharing-tooltip__info-content">
            <span className="sharing-tooltip__info-title">
              {isEdit ? 'Everyone can edit' : 'Everyone can view'}
            </span>
            <span className="sharing-tooltip__info-desc">
              {isEdit
                ? 'Everyone in the account can see, edit, share or delete it.'
                : 'Everyone in the account can see the it but not edit, share or delete it'}
            </span>
          </div>
        </div>
        <div className="sharing-tooltip__divider" />
        {copyButton}
      </div>
    );
  }

  // Limited state
  return (
    <div className="sharing-tooltip" onClick={(e) => e.stopPropagation()}>
      <div className="sharing-tooltip__header">
        <svg className="sharing-tooltip__header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <div className="sharing-tooltip__header-text">
          <span className="sharing-tooltip__label">Limited</span>
          <span className="sharing-tooltip__subtext">Only invited people or teams have access</span>
        </div>
      </div>

      <div className="sharing-tooltip__divider" />

      <div className="sharing-tooltip__list">
        {teams.length === 0 && users.length === 0 ? (
          <div className="sharing-tooltip__empty">No one added yet</div>
        ) : (
          <>
            {teams.map(team => (
              <div key={team.id} className="sharing-tooltip__row">
                <span
                  className="sharing-tooltip__team-avatar"
                  style={{ backgroundColor: team.color || '#3B82F6' }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </span>
                <div className="sharing-tooltip__row-info">
                  <span className="sharing-tooltip__row-name">{team.name}</span>
                  <span className="sharing-tooltip__row-meta">
                    {team.memberIds.length} Members
                  </span>
                </div>
              </div>
            ))}
            {users.map(user => (
              <div key={user.id} className="sharing-tooltip__row">
                <span className="sharing-tooltip__user-avatar">
                  {user.avatar || user.name.charAt(0).toUpperCase()}
                </span>
                <div className="sharing-tooltip__row-info">
                  <span className="sharing-tooltip__row-name">{user.name}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="sharing-tooltip__divider" />
      {copyButton}
    </div>
  );
};

export default SharingTooltip;
