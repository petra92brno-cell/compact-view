import React from 'react';
import LabelIcon from '../assets/Label profile.svg';
import UserGroupIcon from '../assets/User group.svg';
import InternalNoteIcon from '../assets/Internal note.svg';
import './BulkActionBar.css';

const BulkActionBar = ({ selectedCount = 0, totalCount = 0, onSelectAll, onClose, onAddLabels, onAssign, onInternalNotes, onRemove }) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bulk-action-bar">
      <div className="bulk-action-bar__shell">
        {/* Left Section - Selection Info */}
        <div className="bulk-action-bar__select-controls">
          <div className="bulk-action-bar__counter">
            <span className="bulk-action-bar__count">{selectedCount}</span>
            <span className="bulk-action-bar__selected">selected</span>
          </div>
          <div className="bulk-action-bar__separator-dot"></div>
          <button className="bulk-action-bar__select-all-link" onClick={onSelectAll}>
            Select all ({totalCount})
          </button>
        </div>

        {/* Middle Section - Action Buttons */}
        <div className="bulk-action-bar__content-area">
          <div className="bulk-action-bar__button-group">
            <button className="bulk-action-bar__button" onClick={onAddLabels}>
              <img src={LabelIcon} alt="" className="bulk-action-bar__icon" />
              <span>Add labels</span>
            </button>
            <button className="bulk-action-bar__button" onClick={onAssign}>
              <img src={UserGroupIcon} alt="" className="bulk-action-bar__icon" />
              <span>Assign</span>
            </button>
            <button className="bulk-action-bar__button" onClick={onInternalNotes}>
              <img src={InternalNoteIcon} alt="" className="bulk-action-bar__icon" />
              <span>Internal Notes</span>
            </button>
            <div className="bulk-action-bar__divider"></div>
            <button className="bulk-action-bar__button" onClick={onRemove}>
              <svg className="bulk-action-bar__icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Remove</span>
            </button>
          </div>
        </div>

        {/* Right Section - Close Button */}
        <button className="bulk-action-bar__close-button" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BulkActionBar;

