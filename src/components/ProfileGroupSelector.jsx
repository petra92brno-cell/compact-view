import React, { useState, useRef, useEffect } from 'react';
import CaretDownIcon from '../assets/Caret down.svg';
import './ProfileGroupSelector.css';

// Extract unique brands and profiles from posts
const extractBrandsAndProfiles = () => {
  // This would normally come from props or context
  // For now, using the data structure from ScheduledFeed
  const brands = [
    {
      id: 'fakecosmetic-cz',
      name: 'FakeCosmetic CZ',
      profiles: [
        { id: 'fakecosmetic-cz-fb', name: 'FakeCosmetic CZ', platform: 'FB', url: '/fakecosmetic-cz' },
        { id: 'fakecosmetic-cz-ig', name: 'FakeCosmetic CZ', platform: 'IG', url: '/fakecosmetic-cz' }
      ]
    },
    {
      id: 'fakecompany-fr',
      name: 'FakeCompany FR',
      profiles: [
        { id: 'fakecompany-fr-fb', name: 'FakeCompany FR', platform: 'FB', url: '/fakecompany-fr' },
        { id: 'fakecompany-fr-ig', name: 'FakeCompany FR', platform: 'IG', url: '/fakecompany-fr' }
      ]
    }
  ];
  return brands;
};

const ProfileGroupSelector = ({ isOpen, onClose, onApply, anchorRef }) => {
  const [selectedProfiles, setSelectedProfiles] = useState(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const selectorRef = useRef(null);

  const brands = extractBrandsAndProfiles();

  // Calculate position based on anchor element
  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const selectorWidth = 320; // Width of the selector
      const selectorHeight = 600; // Max height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position below the anchor, aligned to left edge of anchor
      let left = anchorRect.left;
      let top = anchorRect.bottom + 4; // 4px gap below button
      
      // If selector would go off screen to the right, position to the left of anchor
      if (left + selectorWidth > viewportWidth) {
        left = anchorRect.right - selectorWidth;
      }
      
      // If selector would go off screen to the left, align to left edge of viewport
      if (left < 8) {
        left = 8;
      }
      
      // If selector would go off screen at bottom, position above the anchor
      if (top + selectorHeight > viewportHeight) {
        top = anchorRect.top - selectorHeight - 4;
      }
      
      // Ensure it doesn't go off screen at top
      if (top < 8) {
        top = 8;
      }
      
      // Ensure it doesn't go off screen at left
      if (left < 8) {
        left = 8;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        // Don't close if clicking on the anchor element
        if (anchorRef?.current && anchorRef.current.contains(event.target)) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose, anchorRef]);

  // Get all profiles as flat list
  const getAllProfiles = () => {
    const allProfiles = [];
    brands.forEach(brand => {
      brand.profiles.forEach(profile => {
        allProfiles.push({
          ...profile,
          brandName: brand.name,
          brandId: brand.id
        });
      });
    });
    return allProfiles;
  };

  // Filter items by search
  const filteredItems = getAllProfiles().filter(item => {
    const searchText = `${item.name} ${item.platform} ${item.brandName}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });

  // Handle select all
  const handleSelectAll = () => {
    const allProfileIds = filteredItems.map(item => item.id);
    const allSelected = allProfileIds.length > 0 && allProfileIds.every(id => selectedProfiles.has(id));
    
    if (allSelected) {
      // Deselect all profiles
      const newSelected = new Set(selectedProfiles);
      allProfileIds.forEach(id => newSelected.delete(id));
      setSelectedProfiles(newSelected);
      setSelectAllChecked(false);
    } else {
      // Select all profiles
      const newSelected = new Set(selectedProfiles);
      allProfileIds.forEach(id => newSelected.add(id));
      setSelectedProfiles(newSelected);
      setSelectAllChecked(true);
    }
  };

  // Handle profile selection
  const handleProfileToggle = (id) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProfiles(newSelected);
    
    // Update select all state
    const currentProfileIds = filteredItems.map(item => item.id);
    const allSelected = currentProfileIds.length > 0 && currentProfileIds.every(id => newSelected.has(id));
    setSelectAllChecked(allSelected);
  };



  // Handle apply
  const handleApply = () => {
    onApply(Array.from(selectedProfiles));
    onClose();
  };

  // Get avatar initials
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Calculate select all state
  useEffect(() => {
    const currentProfileIds = filteredItems.map(item => item.id);
    const allSelected = currentProfileIds.length > 0 && currentProfileIds.every(id => selectedProfiles.has(id));
    setSelectAllChecked(allSelected);
  }, [selectedProfiles, filteredItems]);

  if (!isOpen) return null;

  const totalProfiles = brands.reduce((acc, b) => acc + b.profiles.length, 0);

  return (
    <div className="profile-group-selector-overlay">
      <div 
        className="profile-group-selector" 
        ref={selectorRef}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Header */}
        <div className="profile-group-selector__header">
          {/* Search */}
          <div className="profile-group-selector__search">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM13 13l-3-3" stroke="#24242b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="profile-group-selector__content">
          {/* Select All */}
          <div className="profile-group-selector__item profile-group-selector__item--select-all">
            <div className="profile-group-selector__checkbox">
              <input
                type="checkbox"
                checked={selectAllChecked}
                onChange={handleSelectAll}
                className="profile-group-selector__checkbox-input"
              />
              <div className={`profile-group-selector__checkbox-box ${selectAllChecked ? 'profile-group-selector__checkbox-box--checked' : ''}`}>
                {selectAllChecked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
            <span className="profile-group-selector__select-all-text">
              SELECT ALL PROFILES ({selectedProfiles.size}/{totalProfiles})
            </span>
          </div>

          {/* List */}
          <div className="profile-group-selector__list">
            {filteredItems.map((item) => {
              const isSelected = selectedProfiles.has(item.id);
              const displayName = `${item.name} (${item.platform})`;
              const initials = getAvatarInitials(item.name);

              return (
                <div
                  key={item.id}
                  className={`profile-group-selector__item ${isSelected ? 'profile-group-selector__item--selected' : ''}`}
                  onClick={() => handleProfileToggle(item.id)}
                >
                  {/* Checkbox */}
                  <div className="profile-group-selector__checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleProfileToggle(item.id)}
                      className="profile-group-selector__checkbox-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className={`profile-group-selector__checkbox-box ${isSelected ? 'profile-group-selector__checkbox-box--checked' : ''}`}>
                      {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="profile-group-selector__avatar">
                    {initials}
                  </div>
                  <div className="profile-group-selector__info">
                    <div className="profile-group-selector__name">{displayName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="profile-group-selector__footer">
          <button className="profile-group-selector__cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="profile-group-selector__save" onClick={handleApply}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileGroupSelector;

