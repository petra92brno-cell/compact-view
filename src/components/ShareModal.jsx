import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { mockUsers, mockTeams } from '../data/mockUsers';
import './ShareModal.css';

const SHARE_OPTIONS = [
  { value: 'private', label: 'Private (Only you have access)' },
  { value: 'global', label: 'Global (Everyone in the account)' },
  { value: 'limited', label: 'Limited (Only invited people or teams have access)' },
];

const SUGGESTED_USER_IDS = ['u1', 'u2', 'u3', 'u11', 'u26'];
const SUGGESTED_TEAM_IDS = ['team-gryffindor', 'team-slytherin', 'team-ravenclaw'];

const QUICK_HINT_IDS = ['u2', 'u3', 'team-gryffindor'];

const CURRENT_USER_ID = 'u1';
const CREATOR_ID = 'u2';

const RECENTLY_USED_IDS = [
  'u3', 'u11', 'team-gryffindor', 'u2', 'u1', 'team-slytherin',
  'u26', 'u19', 'team-ravenclaw', 'u34',
];

const IconTeam = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconPrivate = ({ className = '', isSelected = false }) => (
  <span className={`share-modal__option-icon ${isSelected ? 'share-modal__option-icon--selected' : ''} ${className}`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  </span>
);

const IconLimited = ({ className = '', isSelected = false }) => (
  <span className={`share-modal__option-icon ${isSelected ? 'share-modal__option-icon--selected' : ''} ${className}`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  </span>
);

const IconGlobal = ({ className = '', isSelected = false }) => (
  <span className={`share-modal__option-icon ${isSelected ? 'share-modal__option-icon--selected' : ''} ${className}`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  </span>
);

const getIconForOption = (value, isSelected) => {
  switch (value) {
    case 'private':
      return <IconPrivate isSelected={isSelected} />;
    case 'limited':
      return <IconLimited isSelected={isSelected} />;
    case 'global':
      return <IconGlobal isSelected={isSelected} />;
    default:
      return null;
  }
};

const suggestedUsers = mockUsers.filter((u) => SUGGESTED_USER_IDS.includes(u.id));
const suggestedTeams = mockTeams.filter((t) => SUGGESTED_TEAM_IDS.includes(t.id));

const allItemsById = new Map([
  ...mockTeams.map((t) => [t.id, { ...t, _type: 'team' }]),
  ...mockUsers.map((u) => [u.id, { ...u, _type: 'user' }]),
]);

const quickHintItems = QUICK_HINT_IDS.map((id) => allItemsById.get(id)).filter(Boolean);
const recentlyUsedItems = RECENTLY_USED_IDS.map((id) => allItemsById.get(id)).filter(Boolean);

const GLOBAL_PERMISSIONS = [
  { value: 'view', label: 'Everyone can view', description: 'Everyone in the account can see the note but not edit, share or delete it' },
  { value: 'edit', label: 'Everyone can edit', description: 'Everyone in the account can see, edit, share or delete the note' },
];

const DETAIL_PERMISSIONS = [
  { value: 'view', label: 'Can view' },
  { value: 'edit', label: 'Can edit' },
];

const getTeamForUser = (user) => mockTeams.find((t) => t.id === user.teamId);

const getInitials = (name) => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const ShareModal = ({ isOpen, onClose, onSave, campaignName = '', initialOption = 'private', initialGlobalPermission = 'view', initialInvitedUsers = [], initialAccessList = [] }) => {
  const [selectedOption, setSelectedOption] = useState(initialOption);
  const [globalPermission, setGlobalPermission] = useState(initialGlobalPermission);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState(initialInvitedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showDetailView, setShowDetailView] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const inputWrapRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const detailInputRef = useRef(null);
  const detailInputWrapRef = useRef(null);
  const detailSearchDropdownRef = useRef(null);
  const detailAccessRef = useRef(null);
  const detailAccessMenuRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [searchDropdownPos, setSearchDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [detailItems, setDetailItems] = useState([]);
  const [detailSearchQuery, setDetailSearchQuery] = useState('');
  const [detailSearchFocused, setDetailSearchFocused] = useState(false);
  const [detailHighlightIndex, setDetailHighlightIndex] = useState(0);
  const [detailPermission, setDetailPermission] = useState('view');
  const [detailAccessOpen, setDetailAccessOpen] = useState(false);
  const [notifyPeople, setNotifyPeople] = useState(false);
  const [detailSearchDropdownPos, setDetailSearchDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [sendMessage, setSendMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [accessList, setAccessList] = useState(() => {
    if (initialAccessList && initialAccessList.length > 0) {
      return initialAccessList;
    }
    const initialEntries = [
      { id: CURRENT_USER_ID, permission: 'view' },
      { id: CREATOR_ID, permission: 'view' },
    ];
    return initialEntries.map(({ id, permission }) => ({
      ...allItemsById.get(id),
      permission,
    }));
  });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [openAccessDropdownId, setOpenAccessDropdownId] = useState(null);
  const accessDropdownRef = useRef(null);

  useEffect(() => {
    if (!isDropdownOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inTrigger && !inMenu) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleAddItem = (item) => {
    if (invitedUsers.length === 0 && detailItems.length === 0) {
      setDetailItems([item]);
      setDetailSearchQuery('');
      setDetailPermission('view');
      setNotifyPeople(false);
      setShowDetailView(true);
      return;
    }
    
    setInvitedUsers((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleDetailAddItem = (item) => {
    setDetailItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setDetailSearchQuery('');
  };

  const handleDetailRemoveItem = (id) => {
    setDetailItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleRemoveItem = (id) => {
    setInvitedUsers((prev) => prev.filter((i) => i.id !== id));
  };

  const isAlreadyInvited = (id) => invitedUsers.some((i) => i.id === id) || detailItems.some((i) => i.id === id) || accessList.some((i) => i.id === id);
  const matchesQuery = (name) =>
    searchQuery === '' || name.toLowerCase().includes(searchQuery.toLowerCase());

  const buildDropdownItems = () => {
    const q = searchQuery.trim();

    if (q === '') {
      const recent = recentlyUsedItems.filter((it) => !isAlreadyInvited(it.id));
      if (recent.length === 0) return [];
      const items = [{ type: 'header', label: 'RECENTLY USED' }];
      recent.forEach((it) =>
        items.push({ type: it._type, data: it, isDisabled: false })
      );
      return items;
    }

    // Check if query matches a user ID or team ID exactly and auto-add (only if not already added)
    const userById = mockUsers.find((u) => u.id === q || u.id === `u${q}` || u.email === q);
    const teamById = mockTeams.find((t) => t.id === q || t.id === `team-${q}`);
    
    if (userById && !isAlreadyInvited(userById.id)) {
      handleAddItem(userById);
      setSearchQuery('');
      return [];
    }
    
    if (teamById && !isAlreadyInvited(teamById.id)) {
      handleAddItem(teamById);
      setSearchQuery('');
      return [];
    }

    const teams = mockTeams.filter((t) => matchesQuery(t.name));
    const users = mockUsers.filter((u) => matchesQuery(u.name));

    const items = [];
    if (teams.length > 0) {
      items.push({ type: 'header', label: 'TEAM' });
      teams.forEach((t) => items.push({ type: 'team', data: t, isDisabled: isAlreadyInvited(t.id) }));
    }
    if (users.length > 0) {
      items.push({ type: 'header', label: 'USERS' });
      users.forEach((u) => items.push({ type: 'user', data: u, isDisabled: isAlreadyInvited(u.id) }));
    }
    return items;
  };

  const dropdownItems = isSearchFocused ? buildDropdownItems() : [];
  const selectableItems = dropdownItems.filter((i) => i.type !== 'header' && !i.isDisabled);

  const buildDetailDropdownItems = () => {
    const q = detailSearchQuery.trim();
    if (q === '') {
      const recent = recentlyUsedItems.filter((it) => !isAlreadyInvited(it.id));
      if (recent.length === 0) return [];
      const items = [{ type: 'header', label: 'RECENTLY USED' }];
      recent.forEach((it) => items.push({ type: it._type, data: it, isDisabled: false }));
      return items;
    }

    // Check if query matches a user ID or team ID exactly and auto-add (only if not already added)
    const userById = mockUsers.find((u) => u.id === q || u.id === `u${q}` || u.email === q);
    const teamById = mockTeams.find((t) => t.id === q || t.id === `team-${q}`);
    
    if (userById && !isAlreadyInvited(userById.id)) {
      handleDetailAddItem(userById);
      setDetailSearchQuery('');
      return [];
    }
    
    if (teamById && !isAlreadyInvited(teamById.id)) {
      handleDetailAddItem(teamById);
      setDetailSearchQuery('');
      return [];
    }

    const matchesQ = (name) => name.toLowerCase().includes(q.toLowerCase());
    const teams = mockTeams.filter((t) => matchesQ(t.name));
    const users = mockUsers.filter((u) => matchesQ(u.name));
    const items = [];
    if (teams.length > 0) {
      items.push({ type: 'header', label: 'TEAM' });
      teams.forEach((t) => items.push({ type: 'team', data: t, isDisabled: isAlreadyInvited(t.id) }));
    }
    if (users.length > 0) {
      items.push({ type: 'header', label: 'USERS' });
      users.forEach((u) => items.push({ type: 'user', data: u, isDisabled: isAlreadyInvited(u.id) }));
    }
    return items;
  };

  useEffect(() => {
    setHighlightIndex(0);
  }, [searchQuery, invitedUsers.length]);

  useEffect(() => {
    if (!isSearchFocused) return;
    const handleClickOutsideSearch = (e) => {
      const inInput = searchInputRef.current?.contains(e.target);
      const inDropdown = searchDropdownRef.current?.contains(e.target);
      if (!inInput && !inDropdown) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideSearch);
    return () => document.removeEventListener('mousedown', handleClickOutsideSearch);
  }, [isSearchFocused]);

  const navigableIndices = selectableItems.map((item, idx) => idx);

  const handleSearchKeyDown = (e) => {
    if (!isSearchFocused || navigableIndices.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const curPos = navigableIndices.indexOf(prev);
        const nextPos = curPos === -1 ? 0 : (curPos + 1) % navigableIndices.length;
        return navigableIndices[nextPos];
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const curPos = navigableIndices.indexOf(prev);
        const nextPos = curPos === -1
          ? navigableIndices.length - 1
          : (curPos - 1 + navigableIndices.length) % navigableIndices.length;
        return navigableIndices[nextPos];
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = selectableItems[highlightIndex];
      if (item) {
        handleAddItem(item.data);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    if (!isSearchFocused || !searchDropdownRef.current) return;
    const highlighted = searchDropdownRef.current.querySelector('.share-modal__popover-row--highlighted');
    if (highlighted) highlighted.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex, isSearchFocused]);

  useEffect(() => {
    if (!isSearchFocused || !inputWrapRef.current) return;

    const updatePos = () => {
      if (!inputWrapRef.current) return;
      const rect = inputWrapRef.current.getBoundingClientRect();
      setSearchDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width });
    };

    updatePos();

    window.addEventListener('resize', updatePos);
    const scrollEl = scrollContainerRef.current;
    if (scrollEl) scrollEl.addEventListener('scroll', updatePos);

    return () => {
      window.removeEventListener('resize', updatePos);
      if (scrollEl) scrollEl.removeEventListener('scroll', updatePos);
    };
  }, [isSearchFocused, invitedUsers.length]);

  useEffect(() => {
    if (showDetailView && detailInputRef.current) {
      setTimeout(() => detailInputRef.current.focus(), 50);
    }
  }, [showDetailView]);

  useEffect(() => {
    if (!showDetailView) return;
    setDetailHighlightIndex(0);
  }, [detailSearchQuery, detailItems.length]);

  useEffect(() => {
    if (!showDetailView || !detailSearchFocused || !detailInputWrapRef.current) return;
    const updatePos = () => {
      if (!detailInputWrapRef.current) return;
      const rect = detailInputWrapRef.current.getBoundingClientRect();
      setDetailSearchDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width });
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, [showDetailView, detailSearchFocused, detailItems.length]);

  useEffect(() => {
    if (!detailSearchFocused) return;
    const handleClickOutside = (e) => {
      const inInput = detailInputWrapRef.current?.contains(e.target);
      const inDropdown = detailSearchDropdownRef.current?.contains(e.target);
      if (!inInput && !inDropdown) setDetailSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [detailSearchFocused]);

  useEffect(() => {
    if (!detailAccessOpen) return;
    const handleClickOutside = (e) => {
      if (!detailAccessRef.current?.contains(e.target) && !detailAccessMenuRef.current?.contains(e.target)) {
        setDetailAccessOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [detailAccessOpen]);

  useEffect(() => {
    if (!detailSearchFocused || !detailSearchDropdownRef.current) return;
    const highlighted = detailSearchDropdownRef.current.querySelector('.share-modal__popover-row--highlighted');
    if (highlighted) highlighted.scrollIntoView({ block: 'nearest' });
  }, [detailHighlightIndex, detailSearchFocused]);

  useEffect(() => {
    if (!openAccessDropdownId) return;
    const handleClickOutside = (e) => {
      if (accessDropdownRef.current && !accessDropdownRef.current.contains(e.target)) {
        setOpenAccessDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openAccessDropdownId]);

  // Track changes to enable/disable Save button
  useEffect(() => {
    const optionChanged = selectedOption !== initialOption;
    const permissionChanged = globalPermission !== initialGlobalPermission;
    const usersChanged = JSON.stringify(invitedUsers) !== JSON.stringify(initialInvitedUsers);
    const accessChanged = JSON.stringify(accessList) !== JSON.stringify(initialAccessList);
    
    setHasChanges(optionChanged || permissionChanged || usersChanged || accessChanged);
  }, [selectedOption, globalPermission, invitedUsers, accessList, initialOption, initialGlobalPermission, initialInvitedUsers, initialAccessList]);

  const displayName = campaignName.trim() || 'campaign';

  const handleBackFromDetail = () => {
    setDetailItems([]);
    setDetailSearchQuery('');
    setDetailSearchFocused(false);
    setDetailAccessOpen(false);
    setSendMessage(false);
    setMessageText('');
    setShowDetailView(false);
  };

  const handleConfirmDetail = () => {
    if (detailItems.length > 0) {
      const newAccessItems = detailItems
        .filter((di) => !accessList.some((a) => a.id === di.id))
        .map((di) => ({
          ...di,
          _type: di.memberIds !== undefined ? 'team' : 'user',
          permission: detailPermission,
        }));
      
      const updatedAccessList = [...accessList, ...newAccessItems];
      setAccessList(updatedAccessList);

      if (sendMessage && messageText.trim()) {
        const peopleNames = detailItems.map((item) => item.name).join(', ');
        console.log(`Sending message: ${messageText.trim()} to: ${peopleNames}`);
      }
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
    }
    
    // Clear temporary states
    setInvitedUsers([]);
    setSearchQuery('');
    setDetailItems([]);
    setDetailSearchQuery('');
    setDetailSearchFocused(false);
    setDetailAccessOpen(false);
    setSendMessage(false);
    setMessageText('');
    setShowDetailView(false);
  };

  const handleAccessPermissionChange = (itemId, newPermission) => {
    setAccessList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, permission: newPermission } : item
      )
    );
    setOpenAccessDropdownId(null);
  };

  const handleRemoveFromAccessList = (itemId) => {
    setAccessList((prev) => prev.filter((item) => item.id !== itemId));
    setOpenAccessDropdownId(null);
  };

  if (!isOpen) return null;

  const selectedLabel = SHARE_OPTIONS.find((o) => o.value === selectedOption)?.label ?? '';

  if (showDetailView) {
    const dDropdownItems = detailSearchFocused ? buildDetailDropdownItems() : [];
    const dSelectableItems = dDropdownItems.filter((i) => i.type !== 'header' && !i.isDisabled);

    return (
      <div className="share-modal-overlay" onClick={onClose}>
        <div className="share-modal" onClick={(e) => e.stopPropagation()}>
          <div className="share-modal__header">
            <button
              type="button"
              className="share-modal__back-btn"
              onClick={handleBackFromDetail}
              aria-label="Back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 className="share-modal__title">Share {displayName}</h2>
            <button
              type="button"
              className="share-modal__close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="share-modal__detail-body">
            <div className="share-modal__detail-input-row">
              <div
                ref={detailInputWrapRef}
                className={`share-modal__input-wrap share-modal__input-wrap--detail${detailSearchFocused ? ' share-modal__input-wrap--focused' : ''}`}
              >
                <div className="share-modal__input-inner">
                  {detailItems.map((item) => {
                    const isTeam = item.memberIds !== undefined;
                    return (
                      <span key={item.id} className="share-modal__chip">
                        {isTeam ? (
                          <span
                            className="share-modal__chip-color-avatar"
                            style={{ background: item.color || '#6b7280' }}
                          >
                            {item.name.charAt(0)}
                          </span>
                        ) : (
                          <span className="share-modal__chip-initials-avatar">
                            {getInitials(item.name)}
                          </span>
                        )}
                        <span className="share-modal__chip-name">{item.name}</span>
                        <button
                          type="button"
                          className="share-modal__chip-remove"
                          onClick={() => handleDetailRemoveItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10 4L4 10M4 4l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                  <input
                    ref={detailInputRef}
                    type="text"
                    className="share-modal__search-input"
                    placeholder="Add people or teams"
                    value={detailSearchQuery}
                    onChange={(e) => setDetailSearchQuery(e.target.value)}
                    onFocus={() => setDetailSearchFocused(true)}
                    onKeyDown={(e) => {
                      if (dSelectableItems.length === 0) {
                        if (e.key === 'Escape') setDetailSearchFocused(false);
                        return;
                      }
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setDetailHighlightIndex((prev) => (prev + 1) % dSelectableItems.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setDetailHighlightIndex((prev) => (prev - 1 + dSelectableItems.length) % dSelectableItems.length);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        const sel = dSelectableItems[detailHighlightIndex];
                        if (sel) handleDetailAddItem(sel.data);
                      } else if (e.key === 'Escape') {
                        setDetailSearchFocused(false);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="share-modal__detail-access" ref={detailAccessRef}>
                <button
                  type="button"
                  className="share-modal__detail-access-trigger"
                  onClick={() => setDetailAccessOpen((p) => !p)}
                >
                  {DETAIL_PERMISSIONS.find((p) => p.value === detailPermission)?.label}
                  <svg className="share-modal__dropdown-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {detailAccessOpen && (
                  <ul className="share-modal__detail-access-menu" ref={detailAccessMenuRef}>
                    {DETAIL_PERMISSIONS.map((perm) => (
                      <li key={perm.value}>
                        <button
                          type="button"
                          className={`share-modal__detail-access-option${perm.value === detailPermission ? ' share-modal__detail-access-option--selected' : ''}`}
                          onClick={() => {
                            setDetailPermission(perm.value);
                            setDetailAccessOpen(false);
                          }}
                        >
                          {perm.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {detailSearchFocused && createPortal(
              <div
                className="share-modal__popover share-modal__popover--portal"
                ref={detailSearchDropdownRef}
                style={{
                  position: 'fixed',
                  top: detailSearchDropdownPos.top,
                  left: detailSearchDropdownPos.left,
                  width: detailSearchDropdownPos.width,
                  zIndex: 9999,
                }}
              >
                {dDropdownItems.length === 0 ? (
                  <div className="share-modal__popover-empty">No results found</div>
                ) : (
                  dDropdownItems.map((item, idx) => {
                    if (item.type === 'header') {
                      return (
                        <div key={item.label} className="share-modal__popover-header">
                          {item.label}
                        </div>
                      );
                    }

                    const selectableIdx = dSelectableItems.indexOf(item);
                    const isHighlighted = !item.isDisabled && selectableIdx === detailHighlightIndex;
                    const rowClass = [
                      'share-modal__popover-row',
                      isHighlighted ? 'share-modal__popover-row--highlighted' : '',
                      item.isDisabled ? 'share-modal__popover-row--disabled' : '',
                    ].filter(Boolean).join(' ');

                    if (item.type === 'team') {
                      const team = item.data;
                      return (
                        <div
                          key={team.id}
                          className={rowClass}
                          onMouseEnter={() => !item.isDisabled && setDetailHighlightIndex(selectableIdx)}
                          onClick={() => !item.isDisabled && handleDetailAddItem(team)}
                        >
                          <span
                            className="share-modal__popover-team-avatar"
                            style={{ background: team.color || '#6b7280' }}
                          >
                            {team.name.charAt(0)}
                          </span>
                          <span className="share-modal__popover-info">
                            <span className="share-modal__popover-name">{team.name}</span>
                            <span className="share-modal__popover-meta">{team.memberIds.length} Members</span>
                          </span>
                          {item.isDisabled && (
                            <span className="share-modal__popover-already-added">Already added</span>
                          )}
                        </div>
                      );
                    }

                    const user = item.data;
                    const userTeam = getTeamForUser(user);
                    const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                    return (
                      <div
                        key={user.id}
                        className={rowClass}
                        onMouseEnter={() => !item.isDisabled && setDetailHighlightIndex(selectableIdx)}
                        onClick={() => !item.isDisabled && handleDetailAddItem(user)}
                      >
                        <span className="share-modal__popover-info">
                          <span className="share-modal__popover-name">{user.name}</span>
                          <span className="share-modal__popover-meta">
                            {roleName}{userTeam ? ` \u2022 ${userTeam.name}` : ''}
                          </span>
                        </span>
                        {item.isDisabled && (
                          <span className="share-modal__popover-already-added">Already added</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>,
              document.body
            )}

            {/* Send message section */}
            <div className="share-modal__send-message-section">
              <div className="share-modal__send-message-checkbox">
                <label className="share-modal__checkbox-label">
                  <input
                    type="checkbox"
                    className="share-modal__checkbox"
                    checked={sendMessage}
                    onChange={(e) => setSendMessage(e.target.checked)}
                  />
                  <span className="share-modal__checkbox-text">Send message</span>
                </label>
              </div>
              
              <div className={`share-modal__message-textarea-container ${sendMessage ? 'share-modal__message-textarea-container--expanded' : ''}`}>
                {sendMessage && (
                  <textarea
                    className="share-modal__message-textarea"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="share-modal__footer share-modal__footer--detail">
            <button type="button" className="share-modal__btn share-modal__btn--secondary" onClick={handleBackFromDetail}>
              Cancel
            </button>
            <button
              type="button"
              className="share-modal__btn share-modal__btn--primary"
              onClick={handleConfirmDetail}
              disabled={detailItems.length === 0}
            >
              Add and Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal__header">
          <h2 className="share-modal__title">Share {displayName}</h2>
          <button
            type="button"
            className="share-modal__close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="share-modal__content">
          <div className="share-modal__dropdown-wrap">
            <label className="share-modal__dropdown-label">Who can see this</label>
            <div className="share-modal__dropdown">
              <button
                ref={triggerRef}
                type="button"
                className="share-modal__dropdown-trigger"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
              >
                <span className="share-modal__dropdown-icon">
                  {getIconForOption(selectedOption, false)}
                </span>
                <span className="share-modal__dropdown-text">{selectedLabel}</span>
                <svg className="share-modal__dropdown-caret" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isDropdownOpen &&
                createPortal(
                  <ul
                    ref={menuRef}
                    className="share-modal__dropdown-menu share-modal__dropdown-menu--portal"
                    role="listbox"
                    style={{
                      position: 'fixed',
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width,
                      minWidth: 200,
                    }}
                  >
                    {SHARE_OPTIONS.map((opt) => (
                      <li key={opt.value} role="option">
                        <button
                          type="button"
                          className={`share-modal__dropdown-option ${selectedOption === opt.value ? 'share-modal__dropdown-option--selected' : ''}`}
                          onClick={() => {
                            setSelectedOption(opt.value);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="share-modal__dropdown-option-icon">
                            {getIconForOption(opt.value, selectedOption === opt.value)}
                          </span>
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>,
                  document.body
                )}
            </div>
          </div>

          {/* Scrollable area */}
          <div className="share-modal__content-scroll" ref={scrollContainerRef}>
            <div className="share-modal__dynamic">
              {selectedOption === 'private' && (
                <div className="share-modal__banner">
                  <svg className="share-modal__banner-icon" width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
                  </svg>
                  <p className="share-modal__banner-text">
                    Only you will be able to see, edit, share or delete this campaign.
                  </p>
                </div>
              )}

              {selectedOption === 'global' && (
                <div className="share-modal__global-content">
                  <p className="share-modal__permissions-heading">Permissions</p>
                  <div className="share-modal__permissions">
                    {GLOBAL_PERMISSIONS.map((perm) => (
                      <button
                        key={perm.value}
                        type="button"
                        role="radio"
                        aria-checked={globalPermission === perm.value}
                        className={`share-modal__radio-card ${globalPermission === perm.value ? 'share-modal__radio-card--selected' : ''}`}
                        onClick={() => setGlobalPermission(perm.value)}
                      >
                        <span className="share-modal__radio-indicator">
                          {globalPermission === perm.value && <span className="share-modal__radio-dot" />}
                        </span>
                        <div className="share-modal__radio-content">
                          <span className="share-modal__radio-label">{perm.label}</span>
                          <span className="share-modal__radio-description">{perm.description}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedOption === 'limited' && (
                <div className="share-modal__limited-content" ref={searchInputRef}>
                  {showSuccessToast && (
                    <div className="share-modal__success-toast">
                      People added successfully
                    </div>
                  )}
                  <div className="share-modal__search-and-tags-wrapper">
                    <div ref={inputWrapRef} className={`share-modal__input-wrap${isSearchFocused ? ' share-modal__input-wrap--focused' : ''}`}>
                      <div className="share-modal__input-inner">
                        {invitedUsers.map((item) => {
                          const isTeam = item.memberIds !== undefined;
                          return (
                            <span key={item.id} className="share-modal__chip">
                              {isTeam ? (
                                <span
                                  className="share-modal__chip-color-avatar"
                                  style={{ background: item.color || '#6b7280' }}
                                >
                                  {item.name.charAt(0)}
                                </span>
                              ) : (
                                <span className="share-modal__chip-initials-avatar">
                                  {getInitials(item.name)}
                                </span>
                              )}
                              <span className="share-modal__chip-name">{item.name}</span>
                              <button
                                type="button"
                                className="share-modal__chip-remove"
                                onClick={() => handleRemoveItem(item.id)}
                                aria-label={`Remove ${item.name}`}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M10 4L4 10M4 4l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </span>
                          );
                        })}
                        <div className="share-modal__search-input-row">
                          <svg className="share-modal__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            className="share-modal__search-input"
                            placeholder="Add comma separated to invite people or teams"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onKeyDown={handleSearchKeyDown}
                          />
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const visibleHints = quickHintItems.filter((it) => !isAlreadyInvited(it.id));
                      return visibleHints.length > 0 && (
                        <div className="share-modal__quick-hints">
                          {visibleHints.map((it) => (
                            <button
                              key={it.id}
                              type="button"
                              className="share-modal__quick-hint"
                              onClick={() => handleAddItem(it)}
                            >
                              {it._type === 'team' && (
                                <IconTeam />
                              )}
                              <span className="share-modal__quick-hint-name">{it.name}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {isSearchFocused && createPortal(
                    <div
                      className="share-modal__popover share-modal__popover--portal"
                      ref={searchDropdownRef}
                      style={{
                        position: 'fixed',
                        top: searchDropdownPos.top,
                        left: searchDropdownPos.left,
                        width: searchDropdownPos.width,
                        zIndex: 9999,
                      }}
                    >
                      {dropdownItems.length === 0 ? (
                        <div className="share-modal__popover-empty">No results found</div>
                      ) : (
                        dropdownItems.map((item, idx) => {
                          if (item.type === 'header') {
                            return (
                              <div key={item.label} className="share-modal__popover-header">
                                {item.label}
                              </div>
                            );
                          }

                          const selectableIdx = selectableItems.indexOf(item);
                          const isHighlighted = !item.isDisabled && selectableIdx === highlightIndex;

                          const rowClass = [
                            'share-modal__popover-row',
                            isHighlighted ? 'share-modal__popover-row--highlighted' : '',
                            item.isDisabled ? 'share-modal__popover-row--disabled' : '',
                          ].filter(Boolean).join(' ');

                          if (item.type === 'team') {
                            const team = item.data;
                            return (
                              <div
                                key={team.id}
                                className={rowClass}
                                onMouseEnter={() => !item.isDisabled && setHighlightIndex(selectableIdx)}
                                onClick={() => {
                                  if (item.isDisabled) return;
                                  handleAddItem(team);
                                  setSearchQuery('');
                                }}
                              >
                                <span
                                  className="share-modal__popover-team-avatar"
                                  style={{ background: team.color || '#6b7280' }}
                                >
                                  {team.name.charAt(0)}
                                </span>
                                <span className="share-modal__popover-info">
                                  <span className="share-modal__popover-name">{team.name}</span>
                                  <span className="share-modal__popover-meta">{team.memberIds.length} Members</span>
                                </span>
                                {item.isDisabled && (
                                  <span className="share-modal__popover-already-added">Already added</span>
                                )}
                              </div>
                            );
                          }

                          const user = item.data;
                          const userTeam = getTeamForUser(user);
                          const roleName = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                          return (
                            <div
                              key={user.id}
                              className={rowClass}
                              onMouseEnter={() => !item.isDisabled && setHighlightIndex(selectableIdx)}
                              onClick={() => {
                                if (item.isDisabled) return;
                                handleAddItem(user);
                                setSearchQuery('');
                              }}
                            >
                              <span className="share-modal__popover-info">
                                <span className="share-modal__popover-name">{user.name}</span>
                                <span className="share-modal__popover-meta">
                                  {roleName}{userTeam ? ` \u2022 ${userTeam.name}` : ''}
                                </span>
                              </span>
                              {item.isDisabled && (
                                <span className="share-modal__popover-already-added">Already added</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>,
                    document.body
                  )}

                  {(accessList.length > 0 || invitedUsers.length > 0) && (
                    <div className="share-modal__access-section">
                      <div className="share-modal__access-header">USERS AND TEAM WITH ACCESS</div>
                      <div className="share-modal__access-list">
                        {(() => {
                          // Combine accessList and invitedUsers for display
                          const invitedWithPermissions = invitedUsers.map((user) => ({
                            ...user,
                            _type: user.memberIds !== undefined ? 'team' : 'user',
                            permission: 'view',
                          }));
                          
                          // Merge lists, avoiding duplicates
                          const seenIds = new Set();
                          const combinedList = [];
                          
                          // Add all accessList items first
                          accessList.forEach(item => {
                            if (!seenIds.has(item.id)) {
                              combinedList.push(item);
                              seenIds.add(item.id);
                            }
                          });
                          
                          // Add invitedUsers that aren't already in accessList
                          invitedWithPermissions.forEach(item => {
                            if (!seenIds.has(item.id)) {
                              combinedList.push(item);
                              seenIds.add(item.id);
                            }
                          });
                          
                          // Separate creator from other items
                          const creatorItem = combinedList.find((item) => item.id === CREATOR_ID);
                          const currentUserItem = combinedList.find((item) => item.id === CURRENT_USER_ID);
                          const otherItems = combinedList.filter((item) => 
                            item.id !== CREATOR_ID && item.id !== CURRENT_USER_ID
                          );
                          
                          // Build display order: Creator first (if exists), then YOU, then others
                          const orderedItems = [];
                          if (creatorItem) orderedItems.push(creatorItem);
                          if (currentUserItem) orderedItems.push(currentUserItem);
                          orderedItems.push(...otherItems);
                          
                          const visibleItems = orderedItems;

                          return (
                            <>
                              {visibleItems.map((item) => {
                                const isTeam = item._type === 'team' || item.memberIds !== undefined;
                                const isCurrentUser = item.id === CURRENT_USER_ID;
                                const isCreator = item.id === CREATOR_ID;
                                const memberCount = isTeam ? item.memberIds?.length : null;

                                return (
                                  <div key={item.id} className="share-modal__access-row">
                                    {isTeam ? (
                                      <span
                                        className="share-modal__access-avatar"
                                        style={{ background: item.color || '#6b7280' }}
                                      >
                                        {item.name.charAt(0)}
                                      </span>
                                    ) : (
                                      <span className="share-modal__access-avatar share-modal__access-avatar--user">
                                        {getInitials(item.name)}
                                      </span>
                                    )}
                                    <div className="share-modal__access-info">
                                      <span className="share-modal__access-name">
                                        {item.name}
                                        {isCurrentUser && <span className="share-modal__access-you-badge">YOU</span>}
                                        {isCreator && <span className="share-modal__access-creator-label">(Creator)</span>}
                                      </span>
                                      {isTeam && memberCount != null && (
                                        <span className="share-modal__access-meta">{memberCount} members</span>
                                      )}
                                    </div>
                                    {!isCreator && (
                                      <div
                                        className="share-modal__access-dropdown"
                                        ref={openAccessDropdownId === item.id ? accessDropdownRef : null}
                                      >
                                        <button
                                          type="button"
                                          className="share-modal__access-dropdown-trigger"
                                          onClick={() => setOpenAccessDropdownId((prev) => (prev === item.id ? null : item.id))}
                                        >
                                          {item.permission === 'edit' ? 'Can edit' : 'Can view'}
                                          <svg className="share-modal__dropdown-caret" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6" />
                                          </svg>
                                        </button>
                                        {openAccessDropdownId === item.id && (
                                          <ul className="share-modal__access-dropdown-menu">
                                            {DETAIL_PERMISSIONS.map((perm) => (
                                              <li key={perm.value}>
                                                <button
                                                  type="button"
                                                  className={`share-modal__access-dropdown-option${perm.value === item.permission ? ' share-modal__access-dropdown-option--selected' : ''}`}
                                                  onClick={() => handleAccessPermissionChange(item.id, perm.value)}
                                                >
                                                  {perm.label}
                                                </button>
                                              </li>
                                            ))}
                                            <li className="share-modal__access-dropdown-separator"></li>
                                            <li>
                                              <button
                                                type="button"
                                                className="share-modal__access-dropdown-option share-modal__access-dropdown-option--remove"
                                                onClick={() => handleRemoveFromAccessList(item.id)}
                                              >
                                                Remove
                                              </button>
                                            </li>
                                          </ul>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}

                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="share-modal__footer">
          <button type="button" className="share-modal__btn share-modal__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="share-modal__btn share-modal__btn--primary" 
            onClick={() => { 
              if (onSave) {
                // Merge invitedUsers into accessList before saving
                const newAccessItems = invitedUsers
                  .filter((user) => !accessList.some((a) => a.id === user.id))
                  .map((user) => ({
                    ...user,
                    _type: user.memberIds !== undefined ? 'team' : 'user',
                    permission: 'view',
                  }));
                
                const finalAccessList = [...accessList, ...newAccessItems];
                onSave(selectedOption, [], globalPermission, finalAccessList);
              }
              onClose(); 
            }}
            disabled={!hasChanges}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
