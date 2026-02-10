import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './ContentLabelsDropdown.css';

const LABEL_DATA = [
  // Skincare (green)
  { id: 'moisturizers', name: 'Moisturizers', group: 'Skincare', color: '#22C55E' },
  { id: 'serums', name: 'Serums & Essences', group: 'Skincare', color: '#22C55E' },
  { id: 'cleansers', name: 'Cleansers', group: 'Skincare', color: '#22C55E' },
  { id: 'sunscreen', name: 'Sunscreen SPF', group: 'Skincare', color: '#22C55E' },
  { id: 'facemasks', name: 'Face Masks', group: 'Skincare', color: '#22C55E' },
  // Makeup (pink/red)
  { id: 'lip', name: 'Lip Collection', group: 'Makeup', color: '#F43F5E' },
  { id: 'eye', name: 'Eye Makeup', group: 'Makeup', color: '#F43F5E' },
  { id: 'foundation', name: 'Foundation & Base', group: 'Makeup', color: '#F43F5E' },
  { id: 'blush', name: 'Blush & Bronzer', group: 'Makeup', color: '#F43F5E' },
  { id: 'nail', name: 'Nail Polish', group: 'Makeup', color: '#F43F5E' },
  // Fragrance (purple)
  { id: 'womens-perfume', name: "Women's Perfume", group: 'Fragrance', color: '#A855F7' },
  { id: 'mens-cologne', name: "Men's Cologne", group: 'Fragrance', color: '#A855F7' },
  { id: 'gift-sets', name: 'Gift Sets', group: 'Fragrance', color: '#A855F7' },
  { id: 'limited-edition', name: 'Limited Edition', group: 'Fragrance', color: '#A855F7' },
  { id: 'travel-size', name: 'Travel Size', group: 'Fragrance', color: '#A855F7' },
  // Campaigns (blue)
  { id: 'holiday', name: 'Holiday Collection', group: 'Campaigns', color: '#3B82F6' },
  { id: 'new-arrivals', name: 'New Arrivals', group: 'Campaigns', color: '#3B82F6' },
  { id: 'sale', name: 'Sale & Offers', group: 'Campaigns', color: '#3B82F6' },
  { id: 'influencer', name: 'Influencer Collab', group: 'Campaigns', color: '#3B82F6' },
  { id: 'brand', name: 'Brand Partnership', group: 'Campaigns', color: '#3B82F6' },
];

const GROUPS = ['Skincare', 'Makeup', 'Fragrance', 'Campaigns'];

const DROPDOWN_PADDING = 20; // breathing room from viewport edges

const ContentLabelsDropdown = ({ isOpen, onClose, onApply, anchorRef, selectedLabels = [] }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelected, setLocalSelected] = useState(selectedLabels.map(l => l.id));
  const [positionStyle, setPositionStyle] = useState({});
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync local selection when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedLabels.map(l => l.id));
      setSearchQuery('');
      setActiveTab('all');
    }
  }, [isOpen, selectedLabels]);

  // Calculate smart position: open up or down depending on available space
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    const calculate = () => {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownWidth = 280;

      const spaceAbove = anchorRect.top;
      const spaceBelow = viewportHeight - anchorRect.bottom;

      const gap = 6; // gap between button and dropdown
      const openAbove = spaceAbove > spaceBelow;

      const maxHeight = (openAbove ? spaceAbove : spaceBelow) - gap - DROPDOWN_PADDING;

      const style = {
        position: 'fixed',
        width: dropdownWidth,
        maxHeight: Math.max(maxHeight, 200), // minimum usable height
        right: Math.max(DROPDOWN_PADDING, window.innerWidth - anchorRect.right),
      };

      if (openAbove) {
        style.bottom = viewportHeight - anchorRect.top + gap;
      } else {
        style.top = anchorRect.bottom + gap;
      }

      setPositionStyle(style);
    };

    calculate();

    window.addEventListener('resize', calculate);
    window.addEventListener('scroll', calculate, true);
    return () => {
      window.removeEventListener('resize', calculate);
      window.removeEventListener('scroll', calculate, true);
    };
  }, [isOpen, anchorRef]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const toggleLabel = (labelId) => {
    setLocalSelected(prev =>
      prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
    );
  };

  const handleApply = () => {
    const selected = LABEL_DATA.filter(l => localSelected.includes(l.id));
    onApply(selected);
    onClose();
  };

  // Filter labels by search query
  const filteredLabels = LABEL_DATA.filter(label =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    label.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group labels for "Label groups" tab
  const groupedLabels = GROUPS.reduce((acc, group) => {
    const items = filteredLabels.filter(l => l.group === group);
    if (items.length > 0) acc[group] = items;
    return acc;
  }, {});

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="cl-dropdown" ref={dropdownRef} style={positionStyle}>
      {/* Header: tabs, info, search — sticky top */}
      <div className="cl-dropdown__header">
      {/* Tabs */}
      <div className="cl-dropdown__tabs">
        <button
          className={`cl-dropdown__tab ${activeTab === 'all' ? 'cl-dropdown__tab--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`cl-dropdown__tab ${activeTab === 'groups' ? 'cl-dropdown__tab--active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Label groups
        </button>
      </div>

      {/* Info counts */}
      <div className="cl-dropdown__info">
        <span className="cl-dropdown__info-item">
          Content labels
          <span className="cl-dropdown__info-count">20</span>
        </span>
        <span className="cl-dropdown__info-item">
          Label groups
          <span className="cl-dropdown__info-count">4</span>
        </span>
      </div>

      {/* Search */}
      <div className="cl-dropdown__search">
        <svg className="cl-dropdown__search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6.25" cy="6.25" r="4.75" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          className="cl-dropdown__search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </div>{/* end cl-dropdown__header */}

      {/* Label list — scrollable middle area */}
      <div className="cl-dropdown__list">
        {activeTab === 'all' ? (
          <>
            <div className="cl-dropdown__section-header">SELECT CONTENT LABELS</div>
            {filteredLabels.map(label => (
              <label key={label.id} className="cl-dropdown__item" onClick={() => toggleLabel(label.id)}>
                <span className={`cl-dropdown__checkbox ${localSelected.includes(label.id) ? 'cl-dropdown__checkbox--checked' : ''}`}>
                  {localSelected.includes(label.id) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="cl-dropdown__label-name">{label.name}</span>
              </label>
            ))}
            {filteredLabels.length === 0 && (
              <div className="cl-dropdown__empty">No labels found</div>
            )}
          </>
        ) : (
          <>
            {Object.entries(groupedLabels).map(([group, labels]) => (
              <div key={group} className="cl-dropdown__group">
                <div className="cl-dropdown__group-header">
                  <span className="cl-dropdown__group-name">{group}</span>
                  <span className="cl-dropdown__group-count">{labels.length}</span>
                </div>
                {labels.map(label => (
                  <label key={label.id} className="cl-dropdown__item cl-dropdown__item--grouped" onClick={() => toggleLabel(label.id)}>
                    <span className={`cl-dropdown__checkbox ${localSelected.includes(label.id) ? 'cl-dropdown__checkbox--checked' : ''}`}>
                      {localSelected.includes(label.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="cl-dropdown__label-name">{label.name}</span>
                  </label>
                ))}
              </div>
            ))}
            {Object.keys(groupedLabels).length === 0 && (
              <div className="cl-dropdown__empty">No labels found</div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="cl-dropdown__footer">
        <button className="cl-dropdown__create-new" type="button">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Create new...
        </button>
        <button className="cl-dropdown__apply-btn" type="button" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>,
    document.body
  );
};

export { LABEL_DATA };
export default ContentLabelsDropdown;
