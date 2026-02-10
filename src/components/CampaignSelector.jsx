import React, { useState, useRef, useEffect } from 'react';
import './CampaignSelector.css';

const CampaignSelector = ({ campaigns = [], selectedCampaign, onSelectCampaign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [isOpen]);

  const filteredCampaigns = campaigns.filter((c) =>
    (c.name || c.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (campaign) => {
    onSelectCampaign(campaign);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelectCampaign(null);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setSearchQuery('');
    }
  };

  const displayName = selectedCampaign
    ? selectedCampaign.name || selectedCampaign.title
    : null;

  return (
    <div className="campaign-selector" ref={dropdownRef}>
      <button
        className={`campaign-selector__trigger ${selectedCampaign ? 'campaign-selector__trigger--selected' : ''}`}
        onClick={handleToggle}
        type="button"
      >
        <div className="campaign-selector__trigger-content">
          {selectedCampaign && (
            <span
              className="campaign-selector__color-dot"
              style={{ backgroundColor: selectedCampaign.color }}
            />
          )}
          <span
            className={`campaign-selector__label ${!selectedCampaign ? 'campaign-selector__label--placeholder' : ''}`}
          >
            Campaign: {displayName || 'No campaign'}
          </span>
        </div>
        <div className="campaign-selector__trigger-right">
          {selectedCampaign && (
            <button
              className="campaign-selector__clear-btn"
              onClick={handleClear}
              type="button"
              aria-label="Clear campaign"
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
            className={`campaign-selector__arrow ${isOpen ? 'campaign-selector__arrow--open' : ''}`}
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
      </button>

      {isOpen && (
        <div className="campaign-selector__dropdown">
          <div className="campaign-selector__search-wrapper">
            <svg
              className="campaign-selector__search-icon"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="6.25" cy="6.25" r="4.25" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M9.5 9.5L12.5 12.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={searchInputRef}
              className="campaign-selector__search-input"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="campaign-selector__list">
            {filteredCampaigns.length === 0 ? (
              <div className="campaign-selector__empty">No campaigns found</div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  className={`campaign-selector__item ${
                    selectedCampaign?.id === campaign.id
                      ? 'campaign-selector__item--selected'
                      : ''
                  }`}
                  onClick={() => handleSelect(campaign)}
                  type="button"
                >
                  <span
                    className="campaign-selector__item-color"
                    style={{ backgroundColor: campaign.color }}
                  />
                  <div className="campaign-selector__item-info">
                    <span className="campaign-selector__item-name">
                      {campaign.name || campaign.title}
                    </span>
                    {campaign.uniqueId && (
                      <span className="campaign-selector__item-id">{campaign.uniqueId}</span>
                    )}
                  </div>
                  {selectedCampaign?.id === campaign.id && (
                    <svg
                      className="campaign-selector__item-check"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M11.5 3.5L5.5 10.5L2.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSelector;
