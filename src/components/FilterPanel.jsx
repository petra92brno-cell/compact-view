import React, { useState, useRef, useEffect } from 'react';
import CaretDownIcon from '../assets/Caret down.svg';
import FacebookIcon from '../assets/facebook.svg';
import InstagramIcon from '../assets/instagram.svg';
import XIcon from '../assets/x.svg';
import LinkedInIcon from '../assets/LinkedIn.svg';
import TikTokIcon from '../assets/TikTok.svg';
import YouTubeIcon from '../assets/youtube.svg';
import ThreadsIcon from '../assets/Threads.svg';
import PinterestIcon from '../assets/Pinterest.svg';
import ProfileGroupSelector from './ProfileGroupSelector';
import DatePicker from './DatePicker';
import './FilterPanel.css';

const FilterPanel = ({ onFilterChange }) => {
  const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
  const [profileGroupOpen, setProfileGroupOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(true);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [contentTypeOpen, setContentTypeOpen] = useState(false);
  const [mediaTypeOpen, setMediaTypeOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [mentionedUserOpen, setMentionedUserOpen] = useState(false);
  const [createdByOpen, setCreatedByOpen] = useState(false);

  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('done');
  const [profileGroupSelectorOpen, setProfileGroupSelectorOpen] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const savedFiltersRef = useRef(null);
  const profileGroupRef = useRef(null);
  const dateRef = useRef(null);
  const labelsRef = useRef(null);
  const contentTypeRef = useRef(null);
  const mediaTypeRef = useRef(null);
  const assignmentRef = useRef(null);
  const mentionedUserRef = useRef(null);
  const createdByRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const refs = [
        savedFiltersRef, profileGroupRef, dateRef, labelsRef,
        contentTypeRef, mediaTypeRef, assignmentRef, mentionedUserRef, createdByRef
      ];
      
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target)) {
          // Close corresponding dropdown
          if (ref === savedFiltersRef) setSavedFiltersOpen(false);
          if (ref === profileGroupRef) setProfileGroupOpen(false);
          if (ref === dateRef) setDateOpen(false);
          if (ref === labelsRef) setLabelsOpen(false);
          if (ref === contentTypeRef) setContentTypeOpen(false);
          if (ref === mediaTypeRef) setMediaTypeOpen(false);
          if (ref === assignmentRef) setAssignmentOpen(false);
          if (ref === mentionedUserRef) setMentionedUserOpen(false);
          if (ref === createdByRef) setCreatedByOpen(false);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const platforms = [
    { id: 'all', label: 'All', icon: null },
    { id: 'facebook', label: 'Facebook', icon: FacebookIcon },
    { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { id: 'x', label: 'X', icon: XIcon },
    { id: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
    { id: 'pinterest', label: 'Pinterest', icon: PinterestIcon },
    { id: 'youtube', label: 'YouTube', icon: YouTubeIcon },
    { id: 'tiktok', label: 'TikTok', icon: TikTokIcon },
    { id: 'threads', label: 'Threads', icon: ThreadsIcon }
  ];

  const statuses = [
    { id: 'done', icon: '✓', color: '#10B981' },
    { id: 'in-progress', icon: '⏱', color: '#F59E0B' },
    { id: 'no-action', icon: '✗', color: '#EF4444' }
  ];

  return (
    <div className="filter-panel">
      {/* Saved Filters */}
      <div className="filter-panel__section">
        <div className="filter-panel__dropdown" ref={savedFiltersRef}>
          <button
            className="filter-panel__dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setSavedFiltersOpen(!savedFiltersOpen);
            }}
          >
            <span>Saved Filters</span>
            <img 
              src={CaretDownIcon} 
              alt="" 
              className={`filter-panel__arrow ${savedFiltersOpen ? 'filter-panel__arrow--open' : ''}`}
            />
          </button>
          {savedFiltersOpen && (
            <div className="filter-panel__dropdown-menu">
              <button className="filter-panel__dropdown-item">No saved filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Profile, Group */}
      <div className="filter-panel__section">
        <div className="filter-panel__dropdown" ref={profileGroupRef}>
          <button
            className="filter-panel__dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setProfileGroupSelectorOpen(true);
            }}
          >
            <span>Profile, Group</span>
            <img 
              src={CaretDownIcon} 
              alt="" 
              className={`filter-panel__arrow ${profileGroupSelectorOpen ? 'filter-panel__arrow--open' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Profile Group Selector */}
      <ProfileGroupSelector
        isOpen={profileGroupSelectorOpen}
        anchorRef={profileGroupRef}
        onClose={() => setProfileGroupSelectorOpen(false)}
        onApply={(profiles) => {
          setSelectedProfiles(profiles);
          setProfileGroupSelectorOpen(false);
          // Apply filter when Save is clicked
          if (typeof onFilterChange === 'function') {
            onFilterChange({ profiles: profiles });
          }
        }}
      />

      {/* Date */}
      <div className="filter-panel__section">
        <div className="filter-panel__dropdown" ref={dateRef}>
          <button
            className="filter-panel__dropdown-button"
            onClick={(e) => {
              e.stopPropagation();
              setDatePickerOpen(true);
            }}
          >
            <span>
              {selectedStartDate && selectedEndDate
                ? `${selectedStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${selectedEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'Date'}
            </span>
            <img 
              src={CaretDownIcon} 
              alt="" 
              className={`filter-panel__arrow ${datePickerOpen ? 'filter-panel__arrow--open' : ''}`}
            />
          </button>
          {selectedStartDate && selectedEndDate && (
            <button
              className="filter-panel__clear-date"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                if (typeof onFilterChange === 'function') {
                  onFilterChange({ startDate: null, endDate: null });
                }
              }}
              title="Clear date filter"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Date Picker */}
      <DatePicker
        isOpen={datePickerOpen}
        anchorRef={dateRef}
        onClose={() => setDatePickerOpen(false)}
        onApply={(startDate, endDate) => {
          setSelectedStartDate(startDate);
          setSelectedEndDate(endDate);
          setDatePickerOpen(false);
          if (typeof onFilterChange === 'function') {
            // Normalize dates to start of day for comparison
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            onFilterChange({ startDate: start, endDate: end });
          }
        }}
        startDate={selectedStartDate}
        endDate={selectedEndDate}
      />

      {/* Search */}
      <div className="filter-panel__section">
        <input
          type="text"
          className="filter-panel__search"
          placeholder="Search..."
        />
      </div>

      {/* Platforms */}
      <div className="filter-panel__section">
        <div className="filter-panel__platforms">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              className={`filter-panel__platform ${selectedPlatform === platform.id ? 'filter-panel__platform--active' : ''}`}
              onClick={() => setSelectedPlatform(platform.id)}
              title={platform.label}
            >
              {platform.icon ? (
                <img src={platform.icon} alt={platform.label} className="filter-panel__platform-icon" />
              ) : (
                <span>{platform.label}</span>
              )}
              {selectedPlatform === platform.id && (
                <div className="filter-panel__platform-checkmark">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7" cy="7" r="7" fill="#003BEB"/>
                    <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Status Icons */}
      <div className="filter-panel__section">
        <div className="filter-panel__statuses">
          {statuses.map((status) => (
            <button
              key={status.id}
              className={`filter-panel__status ${selectedStatus === status.id ? 'filter-panel__status--active' : ''}`}
              onClick={() => setSelectedStatus(status.id)}
              title={status.id}
              style={{ 
                backgroundColor: selectedStatus === status.id ? status.color : 'transparent',
                color: selectedStatus === status.id ? 'white' : status.color
              }}
            >
              {status.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="filter-panel__section">
        <button
          className="filter-panel__advanced-toggle"
          onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
        >
          <span>ADVANCED FILTERS</span>
          <img 
            src={CaretDownIcon} 
            alt="" 
            className={`filter-panel__arrow ${advancedFiltersOpen ? 'filter-panel__arrow--open' : ''}`}
          />
        </button>

        {advancedFiltersOpen && (
          <div className="filter-panel__advanced-content">
            {/* Labels */}
            <div className="filter-panel__dropdown" ref={labelsRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLabelsOpen(!labelsOpen);
                }}
              >
                <span>Labels</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${labelsOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {labelsOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All labels</button>
                </div>
              )}
            </div>

            {/* Content Type */}
            <div className="filter-panel__dropdown" ref={contentTypeRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setContentTypeOpen(!contentTypeOpen);
                }}
              >
                <span>Content Type</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${contentTypeOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {contentTypeOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All types</button>
                </div>
              )}
            </div>

            {/* Media Type */}
            <div className="filter-panel__dropdown" ref={mediaTypeRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaTypeOpen(!mediaTypeOpen);
                }}
              >
                <span>Media Type</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${mediaTypeOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {mediaTypeOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All media</button>
                </div>
              )}
            </div>

            {/* Assignment */}
            <div className="filter-panel__dropdown" ref={assignmentRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAssignmentOpen(!assignmentOpen);
                }}
              >
                <span>Assignment</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${assignmentOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {assignmentOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All assignments</button>
                </div>
              )}
            </div>

            {/* Mentioned user in internal chat */}
            <div className="filter-panel__dropdown" ref={mentionedUserRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMentionedUserOpen(!mentionedUserOpen);
                }}
              >
                <span>Mentioned user in internal chat</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${mentionedUserOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {mentionedUserOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All users</button>
                </div>
              )}
            </div>

            {/* Created by */}
            <div className="filter-panel__dropdown" ref={createdByRef}>
              <button
                className="filter-panel__dropdown-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatedByOpen(!createdByOpen);
                }}
              >
                <span>Created by</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`filter-panel__arrow ${createdByOpen ? 'filter-panel__arrow--open' : ''}`}
                />
              </button>
              {createdByOpen && (
                <div className="filter-panel__dropdown-menu">
                  <button className="filter-panel__dropdown-item">All creators</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;

