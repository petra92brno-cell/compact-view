import React, { useState, useEffect, useRef } from 'react';
import CaretDownIcon from '../../../assets/Caret down.svg';
import InternalNoteIcon from '../../../assets/Internal note.svg';
import LabelIcon from '../../../assets/Label content new.svg';
import MenuMeatballsIcon from '../../../assets/Menu meatballs.svg';
import StatusNoneIcon from '../../../assets/Status none.svg';
import UserGroupIcon from '../../../assets/User group.svg';
import EditIcon from '../../../assets/Edit.svg';
import CalendarIcon from '../../../assets/Calendar Datepicker.svg';
import './PostCard.css';

const PostCard = ({ post, onAction, viewMode = 'default', isSelected = false, onSelectionChange }) => {
  const [statusOpen, setStatusOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentStatusValue, setCurrentStatusValue] = useState(post.status || 'no-status');
  const statusRef = useRef(null);
  const menuRef = useRef(null);

  // Sync status with post prop changes
  useEffect(() => {
    if (post.status) {
      setCurrentStatusValue(post.status);
    }
  }, [post.status]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusOptions = [
    { value: 'done', label: 'Done', color: 'var(--color-status-done)' },
    { value: 'in-progress', label: 'In progress', color: 'var(--color-status-in-progress)' },
    { value: 'no-action', label: 'No action', color: 'var(--color-status-no-action)' },
    { value: 'no-status', label: 'No status', color: 'var(--color-status-none)' }
  ];

  const menuOptions = [
    'Edit',
    'Duplicate',
    'Open on Facebook',
    'Copy post ID',
    'Profile info',
    'Share link to the post',
    'Activity log',
    'Delete'
  ];

  const currentStatus = statusOptions.find(opt => opt.value === currentStatusValue) || statusOptions[3];

  const handleStatusChange = (status) => {
    setCurrentStatusValue(status);
    onAction?.('status-change', { postId: post.id, status });
    setStatusOpen(false);
  };

  const handleMenuAction = (action) => {
    onAction?.('menu-action', { postId: post.id, action });
    setMenuOpen(false);
  };

  // Resolve campaign: support both full campaign object and campaignId
  const campaign = post.campaign || null;

  return (
    <div className={`post-card post-card--${viewMode}`}>
      {/* Campaign Banner */}
      {campaign && (
        <div
          className="post-card__campaign-banner"
          style={{ backgroundColor: campaign.color }}
        >
          <span className="post-card__campaign-banner-text">
            {campaign.name || campaign.title}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="post-card__header">
        <div className="post-card__header-left">
          <input 
            type="checkbox" 
            className="post-card__checkbox" 
            aria-label="Select post"
            checked={isSelected}
            onChange={(e) => onSelectionChange?.(e.target.checked)}
          />
          <div className="post-card__profile">
          <div className="post-card__avatar">
            {post.profile.avatar ? (
              <img src={post.profile.avatar} alt={post.profile.name} />
            ) : (
              <div className="post-card__avatar-placeholder">
                {post.profile.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="post-card__profile-info">
            <div className="post-card__profile-name">{post.profile.name}</div>
            {post.profile.secondaryText && (
              <div className="post-card__profile-secondary" title={post.profile.secondaryText}>
                {post.profile.secondaryText.length > 50 
                  ? `${post.profile.secondaryText.substring(0, 50)}...` 
                  : post.profile.secondaryText}
              </div>
            )}
            <div className="post-card__profile-url">
              <span className={`post-card__platform-badge post-card__platform-badge--${post.profile.platform.toLowerCase()}`}>
                {post.profile.platform}
              </span>
              <span className="post-card__url">{post.profile.url}</span>
            </div>
          </div>
        </div>
        </div>
        <div className="post-card__header-right">
          <div className="post-card__date">{post.date}</div>
          {post.creator && (
            <div className="post-card__creator">
              <img 
                src={post.creator.avatar} 
                alt={post.creator.name}
                className="post-card__creator-avatar"
              />
            </div>
          )}
        </div>
        {post.status === 'draft' && (
          <div className="post-card__draft-badge">
            DRAFT
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="post-card__divider"></div>

      {/* Content */}
      {post.text && (
        <div className="post-card__text-container">
          <div className="post-card__text">{post.text}</div>
        </div>
      )}

      {/* Media */}
      {post.media && (
        <div className="post-card__media">
          {post.media.type === 'image' ? (
            <>
              <img 
                src={post.media.src} 
                alt={post.media.alt || 'Post media'}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.post-card__media-placeholder');
                  if (placeholder) {
                    placeholder.style.display = 'flex';
                  }
                }}
              />
              <div className="post-card__media-placeholder" style={{ display: 'none' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Preview for this file type is not available</span>
              </div>
            </>
          ) : post.media.type === 'empty' ? (
            <div className="post-card__media-empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Preview for this file type is not available</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Comments Section */}
      {post.comments && post.comments.count > 0 && (
        <div className="post-card__comments">
          <div className="post-card__comments-content">
            <button className="post-card__comments-button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2C5.13 2 2 4.58 2 7.75c0 1.5.6 2.9 1.65 3.95L2 16l4.3-1.65C7.1 14.9 8 15.25 9 15.25c3.87 0 7-2.58 7-5.75S12.87 2 9 2z" stroke="#2F3744" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Show first comments</span>
              <div className="post-card__comments-badge">
                {post.comments.count}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="post-card__footer">
        <div className="post-card__footer-left">
          <div className="post-card__status-dropdown" ref={statusRef}>
            <button
              className="post-card__status-button"
              onClick={(e) => {
                e.stopPropagation();
                setStatusOpen(!statusOpen);
              }}
              aria-expanded={statusOpen}
              aria-haspopup="true"
            >
              {currentStatus.value === 'no-status' ? (
                <img 
                  src={StatusNoneIcon} 
                  alt="" 
                  className="post-card__status-dot--icon"
                />
              ) : (
                <div
                  className="post-card__status-dot"
                  style={{ backgroundColor: currentStatus.color }}
                />
              )}
              <span>{currentStatus.label}</span>
              <img 
                src={CaretDownIcon} 
                alt="" 
                className={`post-card__status-arrow ${statusOpen ? 'post-card__status-arrow--open' : ''}`}
              />
            </button>
            {statusOpen && (
              <div className="post-card__status-menu">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className="post-card__status-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(option.value);
                    }}
                  >
                    {option.value === 'no-status' ? (
                      <img 
                        src={StatusNoneIcon} 
                        alt="" 
                        className="post-card__status-dot--icon"
                      />
                    ) : (
                      <div
                        className="post-card__status-dot"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="post-card__footer-right">
          <button 
            className="post-card__icon-button" 
            title="Internal notes"
            onClick={() => handleMenuAction('Internal notes')}
          >
            <img src={InternalNoteIcon} alt="Internal notes" />
          </button>
          <button 
            className="post-card__icon-button" 
            title="Assign"
            onClick={() => handleMenuAction('Assign')}
          >
            <img src={UserGroupIcon} alt="Assign" />
          </button>
          <button 
            className="post-card__icon-button" 
            title="Add label"
            onClick={() => handleMenuAction('Add label')}
          >
            <img src={LabelIcon} alt="Add label" />
          </button>
          {post.status === 'draft' && (
            <>
              <button 
                className="post-card__icon-button" 
                title="Edit"
                onClick={() => handleMenuAction('Edit')}
              >
                <img src={EditIcon} alt="Edit" />
              </button>
              <button 
                className="post-card__schedule-button"
                onClick={() => handleMenuAction('Schedule')}
                title="Schedule"
              >
                <img src={CalendarIcon} alt="Schedule" className="post-card__schedule-icon" />
                <span>Schedule</span>
              </button>
            </>
          )}
          <div className="post-card__menu-dropdown" ref={menuRef}>
            <button
              className="post-card__icon-button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              title="More options"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <img src={MenuMeatballsIcon} alt="More options" />
            </button>
            {menuOpen && (
              <div className="post-card__menu">
                {menuOptions.map((option) => (
                  <button
                    key={option}
                    className="post-card__menu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction(option);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
