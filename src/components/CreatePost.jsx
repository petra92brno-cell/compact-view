import React, { useState, useCallback } from 'react';
import CampaignSelector from './CampaignSelector';
import ProfileSelector from './ProfileSelector';
import PostDateTimePicker from './PostDateTimePicker';
import { formatDateForDisplay } from '../data/mockData';
import { useClientConfig } from '../contexts/ClientConfigContext';
import './CreatePost.css';

// --- UTM helpers ---

/**
 * Resolve a UTM parameter value from its mode + stored value.
 * Variable modes (e.g. 'social-channel-id') are kept as {placeholders}
 * so the mockup is honest about dynamic substitution.
 * Two structural variables can be resolved from campaign data directly.
 */
const resolveUtmValue = (mode, value, campaign) => {
  if (mode === 'custom') return value || '';
  if (mode === 'none' || !mode) return '';
  if (mode === 'campaign-id') return campaign?.id || '';
  if (mode === 'unique-id') return campaign?.uniqueId || '';
  return `{${mode}}`;
};

/**
 * Build a UTM query string from a campaign object.
 * Returns an empty string when tracking is disabled or no params are configured.
 */
const buildUtmParams = (campaign) => {
  if (!campaign?.linkTrackingEnabled) return '';

  const params = [];
  const add = (key, mode, value) => {
    if (!mode || mode === 'none') return;
    const val = resolveUtmValue(mode, value, campaign);
    if (val) params.push(`${key}=${encodeURIComponent(val)}`);
  };

  if (campaign.utmSourceEnabled)   add('utm_source',   campaign.utmSourceMode,   campaign.utmSourceValue);
  if (campaign.utmMediumEnabled)   add('utm_medium',   campaign.utmMediumMode,   campaign.utmMediumValue);
  if (campaign.utmCampaignEnabled) add('utm_campaign', campaign.utmCampaignMode, campaign.utmCampaignValue);
  if (campaign.utmContentEnabled)  add('utm_content',  campaign.utmContentMode,  campaign.utmContentValue);

  return params.join('&');
};

/**
 * Append UTM params to every URL found in `text`.
 * Already-tracked URLs (containing utm_) are left untouched.
 */
const injectUtmIntoText = (text, campaign) => {
  const utmString = buildUtmParams(campaign);
  if (!utmString) return { text, modified: false };

  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
  let modified = false;

  const result = text.replace(urlRegex, (url) => {
    if (url.includes('utm_')) return url;
    modified = true;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}${utmString}`;
  });

  return { text: result, modified };
};

/**
 * Round a Date to the nearest 30 minutes (ceiling).
 * Mirrors the logic in PostDateTimePicker so we can compare against the default.
 */
const roundToNearest30 = (date) => {
  const d = new Date(date);
  const mins = d.getMinutes();
  if (mins === 0 || mins === 30) return d;
  if (mins < 30) {
    d.setMinutes(30, 0, 0);
  } else {
    d.setHours(d.getHours() + 1, 0, 0, 0);
  }
  return d;
};

const DEFAULT_MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600',
];

const MAX_CHARS = 2200;
const MAX_IMAGES = 4;

// Default profile map (overridden per client via prop)
const DEFAULT_PROFILE_MAP = {
  'fakecosmetic-cz-fb': { name: 'FakeCosmetic CZ', url: '/fakecosmetic-cz', platform: 'FB', avatar: null },
  'fakecosmetic-cz-ig': { name: 'FakeCosmetic CZ', url: '/fakecosmetic-cz', platform: 'IG', avatar: null },
  'fakecompany-fr-fb': { name: 'FakeCompany FR', url: '/fakecompany-fr', platform: 'FB', avatar: null },
  'fakecompany-fr-ig': { name: 'FakeCompany FR', url: '/fakecompany-fr', platform: 'IG', avatar: null },
};

const CreatePost = ({ onBack, campaigns = [], onPostCreate, availableProfiles, profileMap }) => {
  const clientConfig = useClientConfig();
  const PROFILE_MAP = profileMap || DEFAULT_PROFILE_MAP;
  const MOCK_IMAGES = clientConfig?.mockImages || DEFAULT_MOCK_IMAGES;
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [utmApplied, setUtmApplied] = useState(false);

  const charsRemaining = MAX_CHARS - postContent.length;

  // --- Validation ---
  const hasProfileError = selectedProfiles.length === 0;
  const hasContentError = postContent.trim().length === 0;
  const hasInstagramSelected = selectedProfiles.some(id => id.endsWith('-ig'));
  const hasInstagramImageError = hasInstagramSelected && uploadedImages.length === 0;
  const isFormValid = !hasProfileError && !hasContentError && !hasInstagramImageError;

  // Reset specific errors when user fixes them
  // (showErrors stays true once triggered, but individual checks become false)

  /**
   * Determine if the post should show "Schedule" or "Publish".
   * - null (default / untouched) → "Publish"
   * - Matches the current rounded-to-30-min default → "Publish"
   * - Anything else (future) → "Schedule"
   */
  const getIsScheduled = useCallback(() => {
    if (!scheduledDateTime) return false;
    const defaultTime = roundToNearest30(new Date());
    // If selected date/time matches the current default within 60 seconds, treat as "now"
    return Math.abs(scheduledDateTime.getTime() - defaultTime.getTime()) > 60000;
  }, [scheduledDateTime]);

  const isScheduled = getIsScheduled();

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setUtmApplied(false);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setPostContent(value);
    }
  };

  const handlePaste = (e) => {
    if (!selectedCampaign?.linkTrackingEnabled) return;

    const pastedText = e.clipboardData.getData('text');
    if (!/https?:\/\//.test(pastedText)) return;

    const { text: enriched, modified } = injectUtmIntoText(pastedText, selectedCampaign);
    if (!modified) return;

    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = postContent.slice(0, start) + enriched + postContent.slice(end);
    if (newContent.length <= MAX_CHARS) {
      setPostContent(newContent);
      setUtmApplied(true);
    }
  };

  const handleUploadClick = () => {
    if (uploadedImages.length >= MAX_IMAGES) return;
    const imageUrl = MOCK_IMAGES[nextImageIndex % MOCK_IMAGES.length];
    setUploadedImages(prev => [...prev, { id: Date.now(), url: imageUrl }]);
    setNextImageIndex(prev => prev + 1);
  };

  const handleRemoveImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const formatCharCount = (count) => {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  /**
   * Build post objects from the form data.
   * Creates one post per selected profile (or a default profile if none selected).
   * Regular function (not useCallback) — always reads fresh state values.
   */
  const buildPosts = (status, dateTime) => {
    const defaultProfileId = availableProfiles ? availableProfiles[0]?.id : 'fakecosmetic-cz-fb';
    const profileIds = selectedProfiles.length > 0
      ? selectedProfiles
      : [defaultProfileId];

    return profileIds.map((profileId, index) => {
      const profile = PROFILE_MAP[profileId] || {
        name: 'Unknown',
        url: '/',
        platform: 'FB',
        avatar: null,
      };
      return {
        id: `user-${Date.now()}-${index}`,
        profile,
        date: formatDateForDisplay(dateTime),
        creator: { name: 'You', avatar: null },
        text: postContent,
        media:
          uploadedImages.length > 0
            ? { type: 'image', src: uploadedImages[0].url, alt: 'Post image' }
            : null,
        status, // 'scheduled' or 'draft'
        campaign: selectedCampaign,
        badges: [],
      };
    });
  };

  /** Attempt to submit – if form invalid, show errors instead */
  const handleDisabledClick = () => {
    if (!isFormValid) {
      setShowErrors(true);
    }
  };

  /** Publish (now) or Schedule (future) */
  const handlePublishOrSchedule = () => {
    if (!isFormValid) { handleDisabledClick(); return; }
    const dateTime = scheduledDateTime || roundToNearest30(new Date());
    const action = isScheduled ? 'schedule' : 'publish';
    const posts = buildPosts('scheduled', dateTime);
    onPostCreate?.({ posts, action, dateTime });
  };

  /** Save as draft */
  const handleSaveAsDraft = () => {
    if (!isFormValid) { handleDisabledClick(); return; }
    const dateTime = scheduledDateTime || roundToNearest30(new Date());
    const posts = buildPosts('draft', dateTime);
    onPostCreate?.({ posts, action: 'draft', dateTime });
  };

  return (
    <div className="create-post">
      {/* Main Content Area */}
      <div className="create-post__main">
        {/* Header */}
        <div className="create-post__header">
          <button className="create-post__back-btn" onClick={onBack} title="Back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="create-post__title">Create post</h1>
        </div>

        {/* Scrollable Content */}
        <div className="create-post__content">
          {/* Campaign Selector */}
          <div className="create-post__campaign-selector">
            <CampaignSelector
              campaigns={campaigns}
              selectedCampaign={selectedCampaign}
              onSelectCampaign={handleCampaignSelect}
            />
          </div>

          {/* Select Profiles */}
          <div className="create-post__select-profiles">
            <ProfileSelector
              selectedProfiles={selectedProfiles}
              onSelectionChange={setSelectedProfiles}
              hasError={showErrors && hasProfileError}
              availableProfiles={availableProfiles}
            />
            {showErrors && hasProfileError && (
              <span className="create-post__error-text">Select at least one profile</span>
            )}
          </div>

          {/* Date & Time Picker */}
          <div className="create-post__datetime-picker">
            <PostDateTimePicker
              value={scheduledDateTime}
              onChange={setScheduledDateTime}
            />
          </div>

          {/* Post Content Textarea */}
          <div className="create-post__textarea-wrapper">
            <textarea
              className={`create-post__textarea ${showErrors && hasContentError ? 'create-post__textarea--error' : ''}`}
              placeholder="Post Content..."
              rows={6}
              value={postContent}
              onChange={handleTextChange}
              onPaste={handlePaste}
              maxLength={MAX_CHARS}
            />
            {showErrors && hasContentError && (
              <span className="create-post__error-text">Enter post content</span>
            )}
            {utmApplied && selectedCampaign && (
              <div className="create-post__utm-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.53087C19.552 2.60383 18.2979 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11C13.5705 10.4259 13.0226 9.9508 12.3934 9.60704C11.7642 9.26328 11.0684 9.05886 10.3533 9.00765C9.63816 8.95643 8.92037 9.05961 8.24861 9.3102C7.57685 9.56079 6.96684 9.953 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                UTM tracking applied from <strong>{selectedCampaign.name}</strong>
              </div>
            )}
          </div>

          {/* Uploaded Images Grid */}
          {uploadedImages.length > 0 && (
            <div className="create-post__images-grid">
              {uploadedImages.map((img) => (
                <div key={img.id} className="create-post__image-item">
                  <img src={img.url} alt="Uploaded" className="create-post__image-thumb" />
                  <button
                    className="create-post__image-remove"
                    onClick={() => handleRemoveImage(img.id)}
                    title="Remove image"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Cards */}
          <div className="create-post__action-cards">
            <div className={`create-post__action-card ${showErrors && hasInstagramImageError ? 'create-post__action-card--error' : ''}`} onClick={handleUploadClick} role="button" tabIndex={0}>
              <div className="create-post__action-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="create-post__action-card-text">Upload photo, video or GIF</span>
              {uploadedImages.length >= MAX_IMAGES && (
                <span className="create-post__image-count-badge">Max reached</span>
              )}
            </div>

            <div className="create-post__action-card">
              <div className="create-post__action-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="create-post__action-card-text">Import from Collections</span>
            </div>

            <div className="create-post__action-card">
              <div className="create-post__action-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#505057" strokeWidth="1.5"/>
                  <path d="M2 12H22" stroke="#505057" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#505057" strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="create-post__action-card-text">Import from web/cloud</span>
            </div>

            <div className="create-post__action-card">
              <div className="create-post__action-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.479 3.53087C19.552 2.60383 18.2979 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11C13.5705 10.4259 13.0226 9.9508 12.3934 9.60704C11.7642 9.26328 11.0684 9.05886 10.3533 9.00765C9.63816 8.95643 8.92037 9.05961 8.24861 9.3102C7.57685 9.56079 6.96684 9.953 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.4479 21.3961 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="create-post__action-card-text">Import preview link</span>
            </div>

            <div className="create-post__action-card create-post__action-card--ai">
              <span className="create-post__new-badge create-post__new-badge--green">NEW</span>
              <div className="create-post__action-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L18 4L14.74 9.91L21 10L14.74 12.09L18 18L13.09 13.74L12 20L10.91 13.74L6 18L9.26 12.09L3 10L9.26 8.91L6 4L10.91 8.26L12 2Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="create-post__action-card-text">AI Composer</span>
            </div>
          </div>
          {showErrors && hasInstagramImageError && (
            <span className="create-post__error-text create-post__error-text--upload">Image is required for Instagram posts</span>
          )}

          {/* Post Options Row */}
          <div className="create-post__options-row">
            <div className="create-post__options-left">
              <button className="create-post__option-btn" title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="create-post__option-btn" title="Schedule">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="create-post__option-btn" title="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className={`create-post__char-counter ${charsRemaining < 100 ? 'create-post__char-counter--warning' : ''} ${charsRemaining < 0 ? 'create-post__char-counter--error' : ''}`}>
              <span>{formatCharCount(charsRemaining)}</span>
            </div>
          </div>

          {/* Link in Bio */}
          <div className="create-post__row">
            <span className="create-post__row-label">Link in Bio</span>
            <button className="create-post__row-action">+ Add button</button>
          </div>

          {/* Comments */}
          <div className="create-post__row">
            <span className="create-post__row-label">Comments</span>
            <button className="create-post__row-action">Add comment</button>
          </div>

          {/* Bottom Actions */}
          <div className="create-post__bottom-actions">
            <button className="create-post__clear-btn">Clear Publisher</button>
            <div className="create-post__bottom-right">
              <div className="create-post__btn-tooltip-wrapper">
                <button
                  className={`create-post__draft-btn ${!isFormValid ? 'create-post__draft-btn--disabled' : ''}`}
                  onClick={handleSaveAsDraft}
                >
                  <span>Save as draft</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {!isFormValid && (
                  <span className="create-post__btn-tooltip">Fill in all required fields to save</span>
                )}
              </div>
              <div className="create-post__btn-tooltip-wrapper">
                <button
                  className={`create-post__publish-btn ${!isFormValid ? 'create-post__publish-btn--disabled' : ''}`}
                  onClick={handlePublishOrSchedule}
                >
                  {isScheduled ? 'Schedule' : 'Publish'}
                </button>
                {!isFormValid && (
                  <span className="create-post__btn-tooltip">Fill in all required fields to publish</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Post Preview */}
      <div className="create-post__preview">
        {/* Tabs */}
        <div className="create-post__preview-tabs">
          <button className="create-post__preview-tab create-post__preview-tab--active">Post preview</button>
          <button className="create-post__preview-tab">Top sent posts</button>
          <button className="create-post__preview-tab">Instagram grid</button>
        </div>

        {/* Desktop/Mobile Toggle */}
        <div className="create-post__preview-toggle">
          <button className="create-post__toggle-btn create-post__toggle-btn--active">Desktop</button>
          <button className="create-post__toggle-btn">Mobile</button>
        </div>

        {/* Preview Card */}
        <div className="create-post__preview-card">
          {/* Post Header */}
          <div className="create-post__preview-post-header">
            <div className="create-post__preview-avatar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6" r="3" fill="#9D9DA0"/>
                <path d="M2 14C2 11.7909 4.68629 10 8 10C11.3137 10 14 11.7909 14 14" fill="#9D9DA0"/>
              </svg>
            </div>
            <div className="create-post__preview-author">
              <span className="create-post__preview-name">Toutique</span>
              <span className="create-post__preview-dot">·</span>
              <span className="create-post__preview-time">now</span>
            </div>
            <button className="create-post__preview-menu">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="8" r="1.25" fill="#505057"/>
                <circle cx="8" cy="8" r="1.25" fill="#505057"/>
                <circle cx="12" cy="8" r="1.25" fill="#505057"/>
              </svg>
            </button>
          </div>

          {/* Post Text Preview */}
          {postContent && (
            <div className="create-post__preview-text">
              <p>{postContent}</p>
            </div>
          )}

          {/* Preview Image(s) */}
          {uploadedImages.length > 0 ? (
            <div className={`create-post__preview-images ${uploadedImages.length > 1 ? 'create-post__preview-images--grid' : ''}`}>
              {uploadedImages.map((img) => (
                <img key={img.id} src={img.url} alt="Preview" className="create-post__preview-img" />
              ))}
            </div>
          ) : (
            <div className="create-post__preview-image">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="8" width="40" height="32" rx="2" stroke="#B0B0B8" strokeWidth="2"/>
                <circle cx="16" cy="20" r="4" stroke="#B0B0B8" strokeWidth="2"/>
                <path d="M4 32L16 24L28 32" stroke="#B0B0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 28L34 24L44 30" stroke="#B0B0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Post Actions */}
          <div className="create-post__preview-actions">
            <div className="create-post__preview-actions-left">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69365 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69365 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.6417 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="create-post__preview-actions-right">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#505057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Preview Note */}
          <p className="create-post__preview-note">
            Approximate preview: posts may look different on the social network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
