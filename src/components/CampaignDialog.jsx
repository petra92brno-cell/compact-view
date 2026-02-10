import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './CampaignDialog.css';
import CampaignColorPicker from './CampaignColorPicker';
import DatePicker from './DatePicker';
import ContentLabelsDropdown from './ContentLabelsDropdown';

const MAX_NAME_LENGTH = 100;
const DEFAULT_COLOR = '#4338CA';

// Helper: highlight matching portion of text in dropdown items
const HighlightMatch = ({ text, query }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="utm-content-builder__highlight">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
};

// Predefined utm_term suggestions – lightweight, mostly for inspiration
const UTM_TERM_SUGGESTIONS = [
  {
    category: 'Audience targeting',
    items: ['retargeting-audience', 'lookalike-audience', 'custom-audience'],
  },
  {
    category: 'Interest targeting',
    items: ['interest-tech-enthusiasts', 'interest-fitness', 'interest-travel'],
  },
];

// Predefined utm_content suggestions grouped by category
const UTM_CONTENT_SUGGESTIONS = [
  {
    category: 'Link placement',
    items: ['image-link', 'text-link', 'button-cta'],
  },
  {
    category: 'Ad creative',
    items: ['video-ad', 'carousel-ad', 'story-ad'],
  },
  {
    category: 'A/B testing',
    items: ['headline-a', 'headline-b'],
  },
];

// Social profiles for utm_source multi-select dropdown
const SOCIAL_PROFILES = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'x', name: 'X' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'pinterest', name: 'Pinterest' },
  { id: 'threads', name: 'Threads' },
];

// Social platform brand icons
const SocialIcon = ({ id }) => {
  switch (id) {
    case 'facebook':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#1877F2"/>
          <path d="M13.89 12.81l.44-2.89h-2.78V8.06c0-.79.39-1.56 1.63-1.56h1.26V4.03s-1.14-.2-2.23-.2c-2.28 0-3.77 1.38-3.77 3.88v2.21H6v2.89h2.44V20h3v-7.19h2.45z" fill="#fff"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="2" y1="18" x2="18" y2="2">
              <stop offset="0%" stopColor="#feda75"/>
              <stop offset="25%" stopColor="#fa7e1e"/>
              <stop offset="50%" stopColor="#d62976"/>
              <stop offset="75%" stopColor="#962fbf"/>
              <stop offset="100%" stopColor="#4f5bd5"/>
            </linearGradient>
          </defs>
          <rect width="20" height="20" rx="5" fill="url(#ig-grad)"/>
          <rect x="4" y="4" width="12" height="12" rx="3" stroke="#fff" strokeWidth="1.3" fill="none"/>
          <circle cx="10" cy="10" r="2.8" stroke="#fff" strokeWidth="1.3" fill="none"/>
          <circle cx="14.2" cy="5.8" r="1" fill="#fff"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="5" fill="#FF0000"/>
          <path d="M8.5 7v6l5-3-5-3z" fill="#fff"/>
        </svg>
      );
    case 'x':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="5" fill="#000"/>
          <path d="M11.28 9.03L15.17 4.5h-.92l-3.38 3.93L7.97 4.5H4.5l4.08 5.94L4.5 15.5h.92l3.57-4.14L11.84 15.5H15.5l-4.22-6.47zm-1.26 1.47l-.41-.59-3.28-4.7h1.42l2.66 3.81.41.59 3.45 4.93h-1.42l-2.83-4.04z" fill="#fff"/>
        </svg>
      );
    case 'tiktok':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="5" fill="#000"/>
          <path d="M14.07 5.49A3.33 3.33 0 0113.1 3h-1.93v10.1a1.86 1.86 0 01-1.86 1.86 1.86 1.86 0 01-1.86-1.86 1.86 1.86 0 011.86-1.86c.2 0 .38.03.56.08V9.33a3.83 3.83 0 00-.56-.04 3.83 3.83 0 00-3.83 3.83A3.83 3.83 0 009.31 17a3.83 3.83 0 003.83-3.83V8.4A4.93 4.93 0 0016 9.5V7.52a3.81 3.81 0 01-1.93-2.03z" fill="#fff"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect width="20" height="20" rx="3" fill="#0A66C2"/>
          <path d="M6.34 8.25H4.16v7.48h2.18V8.25zM5.25 7.3a1.26 1.26 0 100-2.53 1.26 1.26 0 000 2.53zM10.58 8.25H8.49v7.48h2.18v-3.7c0-.98.18-1.93 1.4-1.93 1.2 0 1.22 1.12 1.22 2v3.63h2.18V11.7c0-2.02-.44-3.57-2.79-3.57-1.13 0-1.89.62-2.2 1.21h-.03V8.25z" fill="#fff"/>
        </svg>
      );
    case 'pinterest':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#E60023"/>
          <path d="M10.16 4.5c-3.2 0-4.82 2.3-4.82 4.21 0 1.16.44 2.19 1.38 2.58.15.06.3.01.34-.17l.14-.54c.05-.17.03-.23-.1-.38-.27-.32-.45-.73-.45-1.31 0-1.69 1.26-3.2 3.29-3.2 1.79 0 2.78 1.1 2.78 2.56 0 1.93-.85 3.55-2.12 3.55-.7 0-1.22-.58-1.05-1.29.2-.84.58-1.75.58-2.36 0-.55-.29-1-.9-1-.71 0-1.29.74-1.29 1.73 0 .63.21 1.06.21 1.06l-.85 3.59c-.25 1.06-.04 2.36-.02 2.49.01.08.11.1.16.04.06-.09.88-1.09 1.16-2.09.08-.28.45-1.78.45-1.78.22.42.87.79 1.56.79 2.05 0 3.44-1.87 3.44-4.37 0-1.89-1.6-3.66-4.04-3.66z" fill="#fff"/>
        </svg>
      );
    case 'threads':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="10" fill="#000"/>
          <path d="M13.16 9.3c-.06-.03-.12-.05-.18-.08-.1-1.7-1.02-2.67-2.55-2.68h-.02c-.91 0-1.67.39-2.14 1.1l.94.65c.33-.5.84-.64 1.2-.64.46 0 .82.17 1.04.5.16.24.27.57.31.98a5.3 5.3 0 00-1.38-.07c-1.38.08-2.27.84-2.22 1.9.03.53.3 1 .77 1.3.4.26.91.38 1.46.35.72-.04 1.28-.3 1.67-.77.29-.35.48-.81.57-1.38.34.21.59.48.73.82.24.56.25 1.49-.65 2.39-.79.79-1.74 1.13-3.01 1.14-1.41-.01-2.48-.46-3.18-1.34-.65-.82-1-1.97-1.01-3.42.01-1.45.36-2.6 1.01-3.42.7-.88 1.77-1.33 3.18-1.34 1.43.01 2.52.47 3.23 1.35.34.43.6.96.78 1.58l1.07-.28c-.21-.78-.54-1.44-.99-1.99-.93-1.14-2.27-1.72-3.99-1.74h-.1c-1.71.02-3.04.6-3.95 1.74-.82 1.02-1.24 2.4-1.26 4.1v.02c.02 1.7.44 3.08 1.26 4.1.91 1.14 2.24 1.72 3.95 1.74h.1c1.53-.01 2.7-.45 3.67-1.42 1.28-1.28 1.24-2.85.85-3.77-.28-.66-.8-1.19-1.49-1.52zm-2.6 2.57c-.61.04-1.24-.24-1.27-.82-.02-.44.31-.92 1.26-.98.11-.01.22-.01.32-.01.36 0 .69.04.99.11-.11 1.4-.72 1.66-1.3 1.7z" fill="#fff"/>
        </svg>
      );
    default:
      return null;
  }
};

const CampaignDialog = ({
  isOpen,
  onClose,
  selectedDate,
  onCreateCampaign,
  onSaveCampaign,
  onDeleteCampaign,
  initialData,
  mode = 'create', // 'create' or 'edit'
  campaignData = null, // existing campaign data for edit mode
}) => {
  const isEditMode = mode === 'edit';
  const today = selectedDate || new Date();

  // Determine initial values based on mode
  const getInitialValue = (editField, initialField, defaultValue) => {
    if (isEditMode && campaignData) return campaignData[editField] ?? defaultValue;
    if (initialData) return initialData[initialField] ?? defaultValue;
    return defaultValue;
  };

  // Form state — pre-fill from campaignData (edit) or initialData (create/error "Go back" flow)
  const [name, setName] = useState(getInitialValue('name', 'name', ''));
  const [color, setColor] = useState(getInitialValue('color', 'color', DEFAULT_COLOR));
  const [startDate, setStartDate] = useState(() => {
    if (isEditMode && campaignData?.startDate) return new Date(campaignData.startDate);
    if (initialData?.startDate) return new Date(initialData.startDate);
    return today;
  });
  const [endDate, setEndDate] = useState(() => {
    if (isEditMode && campaignData?.endDate) return new Date(campaignData.endDate);
    if (initialData?.endDate) return new Date(initialData.endDate);
    return today;
  });
  const [activeTab, setActiveTab] = useState('Setup');

  // Unique ID state
  const [uniqueId, setUniqueId] = useState(getInitialValue('uniqueId', 'uniqueId', ''));
  const [uniqueIdError, setUniqueIdError] = useState('');
  // In edit mode, unique ID is always locked (campaign already created)
  const [isPublished, setIsPublished] = useState(isEditMode);

  // Campaign content label (auto-generated from Unique ID)
  const [campaignLabelActive, setCampaignLabelActive] = useState(
    !!(isEditMode ? campaignData?.uniqueId : initialData?.uniqueId)
  );

  // Validation state
  const [nameError, setNameError] = useState('');
  const [nameTouched, setNameTouched] = useState(
    !!(isEditMode ? campaignData?.name : initialData?.name)
  );

  // Link tracking (UTM) toggle state
  const [linkTrackingEnabled, setLinkTrackingEnabled] = useState(
    getInitialValue('linkTrackingEnabled', 'linkTrackingEnabled', false)
  );

  // UTM Builder state (visual only for now)
  const [utmWebsiteUrl, setUtmWebsiteUrl] = useState(
    getInitialValue('utmWebsiteUrl', 'utmWebsiteUrl', '')
  );
  const [utmSource, setUtmSource] = useState(() => {
    const val = getInitialValue('utmSource', 'utmSource', []);
    return Array.isArray(val) ? val : val ? [val] : [];
  });
  const [isUtmSourceDropdownOpen, setIsUtmSourceDropdownOpen] = useState(false);
  const [localUtmSourceSelection, setLocalUtmSourceSelection] = useState([]);
  const utmSourceDropdownRef = useRef(null);
  const [utmMedium, setUtmMedium] = useState(
    getInitialValue('utmMedium', 'utmMedium', 'social (for organic posts)')
  );
  const [utmCampaign, setUtmCampaign] = useState('');

  // Optional UTM parameters
  const [utmContent, setUtmContent] = useState(() => {
    const val = getInitialValue('utmContent', 'utmContent', []);
    return Array.isArray(val) ? val : val ? [val] : [];
  });
  const [utmContentInput, setUtmContentInput] = useState('');
  const [isUtmContentDropdownOpen, setIsUtmContentDropdownOpen] = useState(false);
  const utmContentFieldRef = useRef(null);
  const utmContentInputRef = useRef(null);

  const [utmTerm, setUtmTerm] = useState(() => {
    const val = getInitialValue('utmTerm', 'utmTerm', []);
    return Array.isArray(val) ? val : val ? [val] : [];
  });
  const [utmTermInput, setUtmTermInput] = useState('');
  const [isUtmTermDropdownOpen, setIsUtmTermDropdownOpen] = useState(false);
  const utmTermFieldRef = useRef(null);
  const utmTermInputRef = useRef(null);

  // Content labels state
  const [selectedLabels, setSelectedLabels] = useState(
    isEditMode && campaignData?.labels ? [...campaignData.labels] : []
  );
  // mandatoryLabelId removed – only the campaign label (from Unique ID) is special
  const [isLabelsDropdownOpen, setIsLabelsDropdownOpen] = useState(false);
  const labelsCardRef = useRef(null);
  const addLabelBtnRef = useRef(null);

  // Brief tab state
  const [briefContent, setBriefContent] = useState(
    isEditMode && campaignData?.briefContent ? campaignData.briefContent : ''
  );
  const briefEditorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({ bold: false, italic: false, underline: false });

  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const dateFieldsRef = useRef(null);
  const nameInputRef = useRef(null);

  // Unsaved changes confirmation state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const initialDateRef = useRef(today.getTime());

  // Delete confirmation state (edit mode only)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Store original values for edit mode change detection
  const originalDataRef = useRef(
    isEditMode && campaignData
      ? {
          name: campaignData.name || '',
          color: campaignData.color || DEFAULT_COLOR,
          startDate: new Date(campaignData.startDate).getTime(),
          endDate: new Date(campaignData.endDate).getTime(),
          uniqueId: campaignData.uniqueId || '',
          labels: JSON.stringify(campaignData.labels || []),
          briefContent: campaignData.briefContent || '',
          linkTrackingEnabled: campaignData.linkTrackingEnabled || false,
          utmContent: JSON.stringify(Array.isArray(campaignData.utmContent) ? campaignData.utmContent : []),
          utmTerm: JSON.stringify(Array.isArray(campaignData.utmTerm) ? campaignData.utmTerm : []),
        }
      : null
  );

  // Keep utmCampaign synced with campaign name
  useEffect(() => {
    setUtmCampaign(name);
  }, [name]);

  // Close utm_content dropdown on outside click
  useEffect(() => {
    if (!isUtmContentDropdownOpen) return;
    const handleOutsideClick = (e) => {
      if (utmContentFieldRef.current && !utmContentFieldRef.current.contains(e.target)) {
        setIsUtmContentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isUtmContentDropdownOpen]);

  // Keyboard navigation state for utm_content dropdown
  const [utmContentHighlight, setUtmContentHighlight] = useState(-1);

  // utm_content chip helpers
  const handleAddUtmContent = useCallback((value) => {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !utmContent.includes(trimmed)) {
      setUtmContent(prev => [...prev, trimmed]);
    }
    setUtmContentInput('');
    setUtmContentHighlight(-1);
  }, [utmContent]);

  const handleRemoveUtmContent = useCallback((value) => {
    setUtmContent(prev => prev.filter(v => v !== value));
  }, []);

  // Filter suggestions: hide already-selected items, filter by typed text
  const filteredUtmSuggestions = useMemo(() => {
    const query = utmContentInput.toLowerCase();
    return UTM_CONTENT_SUGGESTIONS.map(group => ({
      ...group,
      items: group.items.filter(
        item => !utmContent.includes(item) && item.includes(query)
      ),
    })).filter(group => group.items.length > 0);
  }, [utmContent, utmContentInput]);

  // Flat list of all visible content suggestion items (for keyboard nav)
  const flatUtmContentItems = useMemo(() => {
    const items = [];
    filteredUtmSuggestions.forEach(group => {
      group.items.forEach(item => items.push(item));
    });
    // Add custom item if user typed something new
    const customVal = utmContentInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (customVal && !utmContent.includes(customVal) && !items.includes(customVal)) {
      items.push(`__custom__${customVal}`);
    }
    return items;
  }, [filteredUtmSuggestions, utmContentInput, utmContent]);

  // Reset highlight when input changes
  useEffect(() => {
    setUtmContentHighlight(-1);
  }, [utmContentInput]);

  const handleUtmContentKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setUtmContentHighlight(prev => {
        const max = flatUtmContentItems.length - 1;
        return prev < max ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setUtmContentHighlight(prev => {
        const max = flatUtmContentItems.length - 1;
        return prev > 0 ? prev - 1 : max;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (utmContentHighlight >= 0 && utmContentHighlight < flatUtmContentItems.length) {
        const selected = flatUtmContentItems[utmContentHighlight];
        if (selected.startsWith('__custom__')) {
          handleAddUtmContent(selected.replace('__custom__', ''));
        } else {
          handleAddUtmContent(selected);
        }
      } else if (utmContentInput.trim()) {
        handleAddUtmContent(utmContentInput);
      }
    } else if (e.key === 'Escape') {
      setIsUtmContentDropdownOpen(false);
      setUtmContentHighlight(-1);
    } else if (e.key === 'Backspace' && utmContentInput === '' && utmContent.length > 0) {
      setUtmContent(prev => prev.slice(0, -1));
    }
  }, [utmContentInput, utmContent, utmContentHighlight, flatUtmContentItems, handleAddUtmContent]);

  // Close utm_term dropdown on outside click
  useEffect(() => {
    if (!isUtmTermDropdownOpen) return;
    const handleOutsideClick = (e) => {
      if (utmTermFieldRef.current && !utmTermFieldRef.current.contains(e.target)) {
        setIsUtmTermDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isUtmTermDropdownOpen]);

  // Keyboard navigation state for utm_term dropdown
  const [utmTermHighlight, setUtmTermHighlight] = useState(-1);

  // utm_term chip helpers
  const handleAddUtmTerm = useCallback((value) => {
    const trimmed = value.trim().toLowerCase().replace(/\s+/g, '-');
    if (trimmed && !utmTerm.includes(trimmed)) {
      setUtmTerm(prev => [...prev, trimmed]);
    }
    setUtmTermInput('');
    setUtmTermHighlight(-1);
  }, [utmTerm]);

  const handleRemoveUtmTerm = useCallback((value) => {
    setUtmTerm(prev => prev.filter(v => v !== value));
  }, []);

  const filteredUtmTermSuggestions = useMemo(() => {
    const query = utmTermInput.toLowerCase();
    return UTM_TERM_SUGGESTIONS.map(group => ({
      ...group,
      items: group.items.filter(
        item => !utmTerm.includes(item) && item.includes(query)
      ),
    })).filter(group => group.items.length > 0);
  }, [utmTerm, utmTermInput]);

  // Flat list of all visible term suggestion items (for keyboard nav)
  const flatUtmTermItems = useMemo(() => {
    const items = [];
    filteredUtmTermSuggestions.forEach(group => {
      group.items.forEach(item => items.push(item));
    });
    const customVal = utmTermInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (customVal && !utmTerm.includes(customVal) && !items.includes(customVal)) {
      items.push(`__custom__${customVal}`);
    }
    return items;
  }, [filteredUtmTermSuggestions, utmTermInput, utmTerm]);

  // Reset highlight when input changes
  useEffect(() => {
    setUtmTermHighlight(-1);
  }, [utmTermInput]);

  const handleUtmTermKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setUtmTermHighlight(prev => {
        const max = flatUtmTermItems.length - 1;
        return prev < max ? prev + 1 : 0;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setUtmTermHighlight(prev => {
        const max = flatUtmTermItems.length - 1;
        return prev > 0 ? prev - 1 : max;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (utmTermHighlight >= 0 && utmTermHighlight < flatUtmTermItems.length) {
        const selected = flatUtmTermItems[utmTermHighlight];
        if (selected.startsWith('__custom__')) {
          handleAddUtmTerm(selected.replace('__custom__', ''));
        } else {
          handleAddUtmTerm(selected);
        }
      } else if (utmTermInput.trim()) {
        handleAddUtmTerm(utmTermInput);
      }
    } else if (e.key === 'Escape') {
      setIsUtmTermDropdownOpen(false);
      setUtmTermHighlight(-1);
    } else if (e.key === 'Backspace' && utmTermInput === '' && utmTerm.length > 0) {
      setUtmTerm(prev => prev.slice(0, -1));
    }
  }, [utmTermInput, utmTerm, utmTermHighlight, flatUtmTermItems, handleAddUtmTerm]);

  // Sync local selection when utm_source dropdown opens
  useEffect(() => {
    if (isUtmSourceDropdownOpen) {
      setLocalUtmSourceSelection([...utmSource]);
    }
  }, [isUtmSourceDropdownOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close utm_source dropdown on outside click
  useEffect(() => {
    if (!isUtmSourceDropdownOpen) return;
    const handleOutsideClick = (e) => {
      if (utmSourceDropdownRef.current && !utmSourceDropdownRef.current.contains(e.target)) {
        setIsUtmSourceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isUtmSourceDropdownOpen]);

  // Social profiles dropdown helpers
  const handleToggleProfile = useCallback((profileId) => {
    setLocalUtmSourceSelection(prev =>
      prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setLocalUtmSourceSelection(prev =>
      prev.length === SOCIAL_PROFILES.length ? [] : SOCIAL_PROFILES.map(p => p.id)
    );
  }, []);

  const handleApplyProfiles = useCallback(() => {
    setUtmSource([...localUtmSourceSelection]);
    setIsUtmSourceDropdownOpen(false);
  }, [localUtmSourceSelection]);

  // Auto-focus the name input when dialog opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Validate name
  const validateName = useCallback((value, touched) => {
    if (touched && value.trim() === '') {
      return 'Enter the name. The name is required.';
    }
    if (value.length > MAX_NAME_LENGTH) {
      return `Too many characters. Maximum ${MAX_NAME_LENGTH} characters allowed.`;
    }
    return '';
  }, []);

  // Validate unique ID (simulate duplicate check)
  const validateUniqueId = useCallback((value) => {
    if (value === 'DUPLICATE') {
      return 'The used Unique ID has already been used for another campaign. Use a different one.';
    }
    return '';
  }, []);

  // Handle unique ID change
  const handleUniqueIdChange = (e) => {
    const value = e.target.value;
    setUniqueId(value);
    setUniqueIdError(validateUniqueId(value));
    // If campaign label is active and value is cleared, deactivate it
    if (value.trim() === '' && campaignLabelActive) {
      setCampaignLabelActive(false);
    }
  };

  // Handle unique ID blur — auto-create campaign content label
  const handleUniqueIdBlur = () => {
    if (uniqueId.trim() !== '') {
      setCampaignLabelActive(true);
    } else {
      setCampaignLabelActive(false);
    }
  };

  // Check if form is valid — both Name AND Unique ID must have valid values
  const isFormValid =
    name.trim() !== '' &&
    name.length <= MAX_NAME_LENGTH &&
    uniqueId.trim() !== '' &&
    !uniqueIdError;

  // Handle name change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameTouched(true);
    setNameError(validateName(value, true));
  };

  // Handle name blur
  const handleNameBlur = () => {
    setNameTouched(true);
    setNameError(validateName(name, true));
  };

  // Format date for display: "Sep 12, 2025"
  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Format date range for header subtitle
  const formatDateRange = (start, end) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const startDayName = days[start.getDay()];
    const startMonth = months[start.getMonth()];
    const startDay = start.getDate();

    const endDayName = days[end.getDay()];
    const endMonth = months[end.getMonth()];
    const endDay = end.getDate();
    const endYear = end.getFullYear();

    return `${startDayName}, ${startMonth} ${startDay} - ${endDayName}, ${endMonth} ${endDay}. ${endYear}`;
  };

  // Handle date picker apply
  const handleDateApply = (newStart, newEnd) => {
    setStartDate(newStart);
    setEndDate(newEnd);
  };

  // Handle content labels apply
  const handleLabelsApply = (labels) => {
    setSelectedLabels(labels);
  };

  // Remove a label chip
  const handleRemoveLabel = (labelId) => {
    const updated = selectedLabels.filter(l => l.id !== labelId);
    setSelectedLabels(updated);
  };

  // Build campaign content label from Unique ID (shown first in chips)
  const campaignLabel = (campaignLabelActive && uniqueId.trim()) ? {
    id: '__campaign_uid__',
    name: uniqueId.trim(),
    color: '#4338CA',
    isCampaignLabel: true
  } : null;

  // Combined list: campaign label first, then manually added labels
  const allDisplayLabels = [
    ...(campaignLabel ? [campaignLabel] : []),
    ...selectedLabels
  ];

  // Brief editor helpers
  const briefPlaceholder = `Use this space to describe what this campaign is about.\n\nFor example:\n\n\u2022 What is the main goal?\n\u2022 What message should posts communicate?\n\u2022 Are there any important guidelines or context for the team?`;

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  }, []);

  const handleBriefFormat = useCallback((command) => {
    document.execCommand(command, false, null);
    // Re-focus editor after toolbar click
    if (briefEditorRef.current) {
      briefEditorRef.current.focus();
    }
    updateActiveFormats();
  }, [updateActiveFormats]);

  const handleBriefInput = useCallback(() => {
    if (briefEditorRef.current) {
      setBriefContent(briefEditorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [updateActiveFormats]);

  // Restore brief content when switching back to Brief tab
  useEffect(() => {
    if (activeTab === 'Brief' && briefEditorRef.current && briefContent) {
      briefEditorRef.current.innerHTML = briefContent;
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const isBriefEmpty = !briefContent || briefContent === '<br>' || briefContent.replace(/<[^>]*>/g, '').trim() === '';

  // Check if user has made any changes
  const hasUnsavedChanges = useMemo(() => {
    if (isEditMode && originalDataRef.current) {
      // In edit mode, compare against original campaign data
      const orig = originalDataRef.current;
      return (
        name !== orig.name ||
        color !== orig.color ||
        startDate.getTime() !== orig.startDate ||
        endDate.getTime() !== orig.endDate ||
        JSON.stringify(selectedLabels) !== orig.labels ||
        briefContent !== orig.briefContent ||
        linkTrackingEnabled !== orig.linkTrackingEnabled ||
        JSON.stringify(utmContent) !== orig.utmContent ||
        JSON.stringify(utmTerm) !== orig.utmTerm
      );
    }
    // In create mode, check if anything was filled in
    return (
      name !== '' ||
      color !== DEFAULT_COLOR ||
      startDate.getTime() !== initialDateRef.current ||
      endDate.getTime() !== initialDateRef.current ||
      uniqueId !== '' ||
      selectedLabels.length > 0 ||
      !isBriefEmpty ||
      linkTrackingEnabled !== false ||
      utmContent.length > 0 ||
      utmTerm.length > 0
    );
  }, [isEditMode, name, color, startDate, endDate, selectedLabels, briefContent, uniqueId, isBriefEmpty, linkTrackingEnabled, utmContent, utmTerm]);

  // Build UTM link preview from filled fields
  const utmPreviewUrl = useMemo(() => {
    const url = utmWebsiteUrl.trim();
    if (!url || utmSource.length === 0 || !utmMedium || !utmCampaign.trim()) return null;

    const params = new URLSearchParams();
    params.set('utm_source', utmSource.join('+'));
    params.set('utm_medium', utmMedium);
    params.set('utm_campaign', utmCampaign.trim());
    if (utmContent.length > 0) {
      params.set('utm_content', utmContent.join('+'));
    }
    if (utmTerm.length > 0) {
      params.set('utm_term', utmTerm.join('+'));
    }

    // Determine separator: if URL already has '?', use '&'
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }, [utmWebsiteUrl, utmSource, utmMedium, utmCampaign, utmContent, utmTerm]);

  // Handle close button click — check for unsaved changes first
  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowLeaveConfirm(true);
    } else {
      onClose();
    }
  };

  // Handle confirm leave without saving
  const handleConfirmLeave = () => {
    setShowLeaveConfirm(false);
    onClose();
  };

  // Computed values
  const headerTitle = name.trim() ? name : '(Untitled campaign)';
  const headerSubtitle = formatDateRange(startDate, endDate);
  const remainingChars = MAX_NAME_LENGTH - name.length;

  if (!isOpen) return null;

  return (
    <div className="campaign-dialog">
      {/* Header */}
      <div className="campaign-dialog__header">
        {/* Left side */}
        <div className="campaign-dialog__header-left">
          <button
            className="campaign-dialog__close-btn"
            onClick={handleCloseAttempt}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="campaign-dialog__title-group">
            <h1 className="campaign-dialog__title">{headerTitle}</h1>
            <p className="campaign-dialog__subtitle">{headerSubtitle}</p>
          </div>
        </div>

        {/* Center - Tabs */}
        <div className="campaign-dialog__header-center">
          <div className="campaign-dialog__tabs">
            <button
              className={`campaign-dialog__tab ${activeTab === 'Setup' ? 'campaign-dialog__tab--active' : ''}`}
              onClick={() => setActiveTab('Setup')}
            >
              Setup
            </button>
            <button
              className={`campaign-dialog__tab ${activeTab === 'Brief' ? 'campaign-dialog__tab--active' : ''}`}
              onClick={() => setActiveTab('Brief')}
            >
              Brief
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="campaign-dialog__header-right">
          {isEditMode && (
            <button
              className="campaign-dialog__delete-btn"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete campaign
            </button>
          )}
          <div className="campaign-dialog__create-btn-wrapper">
            {isEditMode ? (
              <button
                className={`campaign-dialog__create-btn ${!isFormValid ? 'campaign-dialog__create-btn--disabled' : ''}`}
                disabled={!isFormValid}
                onClick={() => {
                  if (isFormValid && onSaveCampaign) {
                    onSaveCampaign({
                      id: campaignData?.id,
                      name: name.trim(),
                      color,
                      startDate,
                      endDate,
                      uniqueId: uniqueId.trim(),
                      labels: selectedLabels,
                      briefContent,
                      linkTrackingEnabled,
                      utmContent,
                      utmTerm,
                    });
                  }
                }}
              >
                Save and close
              </button>
            ) : (
              <>
                <button
                  className={`campaign-dialog__create-btn ${!isFormValid ? 'campaign-dialog__create-btn--disabled' : ''}`}
                  disabled={!isFormValid}
                  onClick={() => {
                    if (isFormValid && onCreateCampaign) {
                      onCreateCampaign({
                        name: name.trim(),
                        color,
                        startDate,
                        endDate,
                        uniqueId: uniqueId.trim(),
                        labels: selectedLabels,
                        briefContent,
                        linkTrackingEnabled,
                        utmContent,
                        utmTerm,
                      });
                    }
                  }}
                >
                  Create campaign
                </button>
                {!isFormValid && (
                  <span className="campaign-dialog__create-btn-tooltip">
                    Need to input the unique id and the campaign name in order to create a campaign.
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="campaign-dialog__content">
        {activeTab === 'Setup' && (
          <div className="campaign-dialog__content-inner">
            {/* CAMPAIGN Card */}
            <div className="campaign-card">
              {/* Card header */}
              <div className="campaign-card__header">
                <svg className="campaign-card__header-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.667 1.333V2.667M5.333 1.333V2.667M2 5.333h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="campaign-card__header-label">CAMPAIGN</span>
              </div>

              {/* Name + Color row */}
              <div className="campaign-card__name-row">
                <div className="campaign-card__name-field">
                  <div className="campaign-card__name-label-row">
                    <label className="campaign-card__label" htmlFor="campaign-name">
                      Name
                    </label>
                    <span className={`campaign-card__char-counter ${remainingChars < 0 ? 'campaign-card__char-counter--error' : ''}`}>
                      {Math.max(0, remainingChars)}
                    </span>
                  </div>
                  <div className={`campaign-card__input-wrapper ${nameError ? 'campaign-card__input-wrapper--error' : ''}`}>
                    <input
                      ref={nameInputRef}
                      id="campaign-name"
                      type="text"
                      className="campaign-card__input"
                      value={name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      placeholder=""
                      autoComplete="off"
                    />
                    {nameError && (
                      <span className="campaign-card__input-error-icon" aria-hidden="true">⚠️</span>
                    )}
                  </div>
                  {nameError && (
                    <p className="campaign-card__error-message">{nameError}</p>
                  )}
                </div>
                <CampaignColorPicker selectedColor={color} onColorChange={setColor} />
              </div>

              {/* Date fields */}
              <div className="campaign-card__date-row" ref={dateFieldsRef}>
                <div className="campaign-card__date-field">
                  <label className="campaign-card__label">Start date</label>
                  <button
                    className="campaign-card__date-input"
                    onClick={() => setIsDatePickerOpen(true)}
                    type="button"
                  >
                    <span>{formatDate(startDate)}</span>
                    <svg className="campaign-card__date-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.667 1.333V2.667M5.333 1.333V2.667M2 5.333h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="campaign-card__date-field">
                  <label className="campaign-card__label">End date</label>
                  <button
                    className="campaign-card__date-input"
                    onClick={() => setIsDatePickerOpen(true)}
                    type="button"
                  >
                    <span>{formatDate(endDate)}</span>
                    <svg className="campaign-card__date-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.667 1.333V2.667M5.333 1.333V2.667M2 5.333h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* UNIQUE ID Card */}
            <div className={`unique-id-card ${isPublished ? 'unique-id-card--locked' : ''}`}>
              {/* Card header */}
              <div className="unique-id-card__header">
                <div className="unique-id-card__header-left">
                  <svg className="unique-id-card__header-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4.5 6.5V9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M6.5 6.5H8.5C9.05 6.5 9.5 6.95 9.5 7.5V7.5C9.5 8.05 9.05 8.5 8.5 8.5H6.5V6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 8.5H9L9.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="unique-id-card__header-label">UNIQUE ID</span>
                  {isPublished ? (
                    <span className="unique-id-card__lock-icon" title="Locked">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M5 6V4.5C5 3.12 6.12 2 7.5 2V2C8.88 2 10 3.12 10 4.5V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  ) : (
                    <span className="unique-id-card__help-icon" title="Help">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="unique-id-card__description">
                {isPublished
                  ? 'This unique ID cannot be changed because the campaign is created.'
                  : 'This unique ID cannot be changed once the campaign is created.'}
              </p>

              {/* Input field */}
              <div className="unique-id-card__field">
                <div className={`unique-id-card__input-wrapper ${uniqueIdError ? 'unique-id-card__input-wrapper--error' : ''}`}>
                  <input
                    type="text"
                    className="unique-id-card__input"
                    value={uniqueId}
                    onChange={handleUniqueIdChange}
                    onBlur={handleUniqueIdBlur}
                    placeholder=""
                    autoComplete="off"
                    readOnly={isPublished}
                    disabled={isPublished}
                  />
                  {uniqueIdError && !isPublished && (
                    <span className="unique-id-card__input-error-icon" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" fill="#DC2626"/>
                        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                  )}
                </div>
                {uniqueIdError && !isPublished && (
                  <p className="unique-id-card__error-message">{uniqueIdError}</p>
                )}
              </div>
            </div>

            {/* CONTENT LABELS Card */}
            <div className="content-labels-card" ref={labelsCardRef}>
              {/* Card header row */}
              <div className="content-labels-card__header">
                <div className="content-labels-card__header-left">
                  <svg className="content-labels-card__header-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.727 8.273l-5.454-5.454A.91.91 0 007.636 2.5H3.41a.91.91 0 00-.91.91v4.226a.91.91 0 00.267.637l5.454 5.454a.91.91 0 001.285 0l4.221-4.221a.91.91 0 000-1.233z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="5.25" cy="5.25" r="0.75" fill="currentColor"/>
                  </svg>
                  <span className="content-labels-card__header-label">CONTENT LABELS</span>
                  <span className="content-labels-card__help-icon" title="Help">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                    </svg>
                  </span>
                </div>
                <div className="content-labels-card__header-right" style={{ position: 'relative' }}>
                  <button
                    ref={addLabelBtnRef}
                    className="content-labels-card__add-btn"
                    type="button"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLabelsDropdownOpen(prev => !prev);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3.5 1L1 6.5H5L4 11L9.5 4.5H5.5L7.5 1H3.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add content label
                  </button>
                  <ContentLabelsDropdown
                    isOpen={isLabelsDropdownOpen}
                    onClose={() => setIsLabelsDropdownOpen(false)}
                    onApply={handleLabelsApply}
                    anchorRef={addLabelBtnRef}
                    selectedLabels={selectedLabels}
                  />
                </div>
              </div>

              {/* Chips area – all labels shown, wrapping to multiple rows */}
              {allDisplayLabels.length > 0 && (
                <div className="content-labels-card__chips">
                  {allDisplayLabels.map((label) => {
                    const isCampaignLabel = !!label.isCampaignLabel;
                    return (
                      <span
                        key={label.id}
                        className={`content-labels-card__chip ${
                          isCampaignLabel ? 'content-labels-card__chip--campaign' : ''
                        }`}
                        data-tooltip={isCampaignLabel ? 'Mandatory label for campaign and cannot be removed' : label.name}
                      >
                        <span className="content-labels-card__chip-name">{label.name}</span>
                        {!isCampaignLabel && (
                          <button
                            className="content-labels-card__chip-remove"
                            type="button"
                            onClick={() => handleRemoveLabel(label.id)}
                            aria-label={`Remove ${label.name}`}
                          >
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M6 2L2 6M2 2l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LINK TRACKING (UTM) Card */}
            <div className="link-tracking-card">
              <div className="link-tracking-card__header">
                <div className="link-tracking-card__header-left">
                  <svg className="link-tracking-card__header-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.333 3.333 0 008.98 2.313l-1.147 1.14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.333 3.333 0 004.713 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="link-tracking-card__header-label">LINK TRACKING (UTM)</span>
                </div>
                <button
                  type="button"
                  className={`link-tracking-card__toggle ${linkTrackingEnabled ? 'link-tracking-card__toggle--on' : ''}`}
                  onClick={() => setLinkTrackingEnabled(prev => !prev)}
                  role="switch"
                  aria-checked={linkTrackingEnabled}
                  aria-label="Toggle link tracking"
                >
                  <span className="link-tracking-card__toggle-label">
                    {linkTrackingEnabled ? 'ON' : 'OFF'}
                  </span>
                  <span className="link-tracking-card__toggle-knob" />
                </button>
              </div>

              {/* UTM Builder content – expanded when toggle is ON */}
              <div className={`link-tracking-card__body ${linkTrackingEnabled ? 'link-tracking-card__body--open' : ''}`}>
                <div className="link-tracking-card__body-inner">
                  {/* Link preview info box – dynamic */}
                  {utmPreviewUrl ? (
                    <div className="link-tracking-card__preview-box">
                      <div className="link-tracking-card__preview-header">
                        <svg className="link-tracking-card__preview-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.333 3.333 0 008.98 2.313l-1.147 1.14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.333 3.333 0 004.713 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="link-tracking-card__preview-title">Link preview</span>
                        <button
                          type="button"
                          className="link-tracking-card__preview-copy"
                          onClick={() => {
                            navigator.clipboard.writeText(utmPreviewUrl);
                          }}
                          title="Copy to clipboard"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <rect x="4.5" y="4.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M9.5 4.5V3a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 3v5A1.5 1.5 0 003 9.5h1.5" stroke="currentColor" strokeWidth="1.2"/>
                          </svg>
                          Copy
                        </button>
                      </div>
                      <div className="link-tracking-card__preview-url">
                        {utmPreviewUrl}
                      </div>
                    </div>
                  ) : (
                    <div className="link-tracking-card__info-box">
                      <svg className="link-tracking-card__info-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M8 7.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
                      </svg>
                      <div className="link-tracking-card__info-text">
                        <span className="link-tracking-card__info-bold">Link preview with variables</span>
                        <span className="link-tracking-card__info-desc">
                          Fill in the website URL, source, medium, and campaign name to see the link preview.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* UTM BUILDER section header */}
                  <h3 className="link-tracking-card__section-title">UTM BUILDER</h3>

                  {/* Website URL field */}
                  <div className="link-tracking-card__field">
                    <div className="link-tracking-card__label-row">
                      <label className="link-tracking-card__label" htmlFor="utm-website-url">
                        website URL
                      </label>
                      <span className="link-tracking-card__help-tooltip">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                        </svg>
                        <span className="link-tracking-card__help-tooltip-content">
                          The full URL of the page you want to link to. All UTM parameters will be appended to this URL.
                        </span>
                      </span>
                    </div>
                    <input
                      id="utm-website-url"
                      type="text"
                      className="link-tracking-card__input"
                      value={utmWebsiteUrl}
                      onChange={(e) => setUtmWebsiteUrl(e.target.value)}
                      placeholder="Enter Page URL"
                      autoComplete="off"
                    />
                  </div>

                  {/* REQUIRED PARAMETERS section header */}
                  <h4 className="link-tracking-card__section-subtitle">REQUIRED PARAMETERS</h4>

                  {/* Social profiles (utm_source) */}
                  <div className="link-tracking-card__field" ref={utmSourceDropdownRef}>
                    <label className="link-tracking-card__label">
                      Social profiles (utm_source)
                    </label>
                    <button
                      type="button"
                      className={`social-profiles-trigger ${isUtmSourceDropdownOpen ? 'social-profiles-trigger--open' : ''} ${utmSource.length > 0 ? 'social-profiles-trigger--has-selection' : ''}`}
                      onClick={() => setIsUtmSourceDropdownOpen(prev => !prev)}
                    >
                      {utmSource.length === 0 ? (
                        <span className="social-profiles-trigger__text social-profiles-trigger__text--placeholder">
                          Social channel ID
                        </span>
                      ) : (
                        <span className="social-profiles-trigger__chips">
                          {utmSource.map(id => {
                            const profile = SOCIAL_PROFILES.find(p => p.id === id);
                            if (!profile) return null;
                            return (
                              <span key={id} className="social-profiles-trigger__chip">
                                <SocialIcon id={id} />
                                <span className="social-profiles-trigger__chip-name">{profile.name}</span>
                              </span>
                            );
                          })}
                        </span>
                      )}
                      <svg className="social-profiles-trigger__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {isUtmSourceDropdownOpen && (
                      <div className="social-profiles-panel">
                        <div className="social-profiles-panel__list">
                          {/* SELECT ALL */}
                          <div
                            className="social-profiles-panel__item social-profiles-panel__item--select-all"
                            onClick={handleToggleSelectAll}
                          >
                            <span className={`social-profiles-panel__checkbox ${localUtmSourceSelection.length === SOCIAL_PROFILES.length ? 'social-profiles-panel__checkbox--checked' : ''} ${localUtmSourceSelection.length > 0 && localUtmSourceSelection.length < SOCIAL_PROFILES.length ? 'social-profiles-panel__checkbox--indeterminate' : ''}`}>
                              {localUtmSourceSelection.length === SOCIAL_PROFILES.length && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {localUtmSourceSelection.length > 0 && localUtmSourceSelection.length < SOCIAL_PROFILES.length && (
                                <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                                  <path d="M1 1h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              )}
                            </span>
                            <span className="social-profiles-panel__name social-profiles-panel__name--select-all">SELECT ALL</span>
                          </div>

                          {SOCIAL_PROFILES.map(profile => (
                            <div
                              key={profile.id}
                              className="social-profiles-panel__item"
                              onClick={() => handleToggleProfile(profile.id)}
                            >
                              <span className={`social-profiles-panel__checkbox ${localUtmSourceSelection.includes(profile.id) ? 'social-profiles-panel__checkbox--checked' : ''}`}>
                                {localUtmSourceSelection.includes(profile.id) && (
                                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </span>
                              <SocialIcon id={profile.id} />
                              <span className="social-profiles-panel__name">{profile.name}</span>
                            </div>
                          ))}
                        </div>

                        <div className="social-profiles-panel__footer">
                          <button
                            type="button"
                            className={`social-profiles-panel__apply-btn ${localUtmSourceSelection.length === 0 ? 'social-profiles-panel__apply-btn--disabled' : ''}`}
                            onClick={handleApplyProfiles}
                            disabled={localUtmSourceSelection.length === 0}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Medium (utm_medium) */}
                  <div className="link-tracking-card__field">
                    <div className="link-tracking-card__label-row">
                      <label className="link-tracking-card__label" htmlFor="utm-medium">
                        Medium (utm_medium)
                      </label>
                      <span className="link-tracking-card__help-tooltip">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                        </svg>
                        <span className="link-tracking-card__help-tooltip-content">
                          <strong>Required.</strong> Identifies the marketing medium used to deliver your link. For organic social media posts use <code>social</code> or <code>organic-social</code>. For paid social media campaigns use <code>paid-social</code> or <code>cpc</code>.
                        </span>
                      </span>
                    </div>
                    <div className="link-tracking-card__select-wrapper">
                      <select
                        id="utm-medium"
                        className="link-tracking-card__select"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                      >
                        <option value="social (for organic posts)">social (for organic posts)</option>
                        <option value="paid_social">paid_social</option>
                        <option value="email">email</option>
                        <option value="referral">referral</option>
                      </select>
                      <svg className="link-tracking-card__select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* Campaign name (utm_campaign) – readonly/disabled */}
                  <div className="link-tracking-card__field">
                    <div className="link-tracking-card__label-row">
                      <label className="link-tracking-card__label" htmlFor="utm-campaign">
                        Campaign name (utm_campaign)
                      </label>
                      <span className="link-tracking-card__help-tooltip">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                        </svg>
                        <span className="link-tracking-card__help-tooltip-content">
                          <strong>Required.</strong> Identifies a specific product promotion or strategic campaign. This value is auto-filled from the campaign name. Examples: <code>summer-sale-2025</code>, <code>new-product-launch</code>, <code>brand-awareness-initiative</code>.
                        </span>
                      </span>
                    </div>
                    <input
                      id="utm-campaign"
                      type="text"
                      className="link-tracking-card__input link-tracking-card__input--disabled"
                      value={utmCampaign}
                      placeholder="Campaign name"
                      readOnly
                      tabIndex={-1}
                    />
                  </div>

                  {/* OPTIONAL PARAMETERS section header */}
                  <h4 className="link-tracking-card__section-subtitle">OPTIONAL PARAMETERS</h4>

                  {/* Content (utm_content) – chip builder */}
                  <div className="link-tracking-card__field" ref={utmContentFieldRef}>
                    <div className="link-tracking-card__label-row">
                      <label className="link-tracking-card__label">
                        Content (utm_content)
                      </label>
                      <span className="link-tracking-card__help-tooltip">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                        </svg>
                        <span className="link-tracking-card__help-tooltip-content">
                          <strong>Optional.</strong> Differentiates between similar content or links within the same campaign. Useful for A/B testing or distinguishing different elements within a single post or ad. Examples: <code>image-link</code>, <code>video-ad</code>, <code>headline-a</code>.
                        </span>
                      </span>
                    </div>
                    <div
                      className={`utm-content-builder ${isUtmContentDropdownOpen ? 'utm-content-builder--focused' : ''}`}
                      onClick={() => {
                        utmContentInputRef.current?.focus();
                        setIsUtmContentDropdownOpen(true);
                      }}
                    >
                      <div className="utm-content-builder__chips-area">
                        {utmContent.map((item) => (
                          <span key={item} className="utm-content-builder__chip">
                            <span className="utm-content-builder__chip-text">{item}</span>
                            <button
                              type="button"
                              className="utm-content-builder__chip-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveUtmContent(item);
                              }}
                              aria-label={`Remove ${item}`}
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M6 2L2 6M2 2l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                        <input
                          ref={utmContentInputRef}
                          type="text"
                          className="utm-content-builder__input"
                          value={utmContentInput}
                          onChange={(e) => {
                            setUtmContentInput(e.target.value);
                            setIsUtmContentDropdownOpen(true);
                          }}
                          onFocus={() => setIsUtmContentDropdownOpen(true)}
                          onKeyDown={handleUtmContentKeyDown}
                          placeholder={utmContent.length === 0 ? 'Type or select content values...' : ''}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Suggestions dropdown */}
                    {isUtmContentDropdownOpen && (
                      <div className="utm-content-builder__dropdown">
                        {/* Selected items shown at top */}
                        {utmContent.length > 0 && (
                          <div className="utm-content-builder__dropdown-selected">
                            <span className="utm-content-builder__dropdown-category">Selected</span>
                            {utmContent.map((item) => (
                              <button
                                key={item}
                                type="button"
                                className="utm-content-builder__dropdown-item utm-content-builder__dropdown-item--checked"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  handleRemoveUtmContent(item);
                                  utmContentInputRef.current?.focus();
                                }}
                              >
                                <svg className="utm-content-builder__check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="utm-content-builder__item-text">{item}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {filteredUtmSuggestions.length > 0 ? (
                          filteredUtmSuggestions.map((group) => (
                            <div key={group.category} className="utm-content-builder__dropdown-group">
                              <span className="utm-content-builder__dropdown-category">{group.category}</span>
                              {group.items.map((item) => {
                                const flatIdx = flatUtmContentItems.indexOf(item);
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    className={`utm-content-builder__dropdown-item ${flatIdx === utmContentHighlight ? 'utm-content-builder__dropdown-item--highlighted' : ''}`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onMouseEnter={() => setUtmContentHighlight(flatIdx)}
                                    onClick={() => {
                                      handleAddUtmContent(item);
                                      utmContentInputRef.current?.focus();
                                    }}
                                  >
                                    <span className="utm-content-builder__item-text">
                                      <HighlightMatch text={item} query={utmContentInput} />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          ))
                        ) : (
                          !utmContentInput.trim() && utmContent.length === 0 && (
                            <div className="utm-content-builder__dropdown-empty">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M8 7.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
                              </svg>
                              <span>Start typing to search or add values</span>
                            </div>
                          )
                        )}

                        {utmContentInput.trim() && filteredUtmSuggestions.length === 0 && !utmContent.includes(utmContentInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                          <div className="utm-content-builder__dropdown-no-results">
                            No matching suggestions found
                          </div>
                        )}

                        {utmContentInput.trim() && !utmContent.includes(utmContentInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                          <>
                            <div className="utm-content-builder__dropdown-divider" />
                            <button
                              type="button"
                              className={`utm-content-builder__dropdown-item utm-content-builder__dropdown-item--custom ${flatUtmContentItems.indexOf(`__custom__${utmContentInput.trim().toLowerCase().replace(/\s+/g, '-')}`) === utmContentHighlight ? 'utm-content-builder__dropdown-item--highlighted' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onMouseEnter={() => setUtmContentHighlight(flatUtmContentItems.indexOf(`__custom__${utmContentInput.trim().toLowerCase().replace(/\s+/g, '-')}`))}
                              onClick={() => {
                                handleAddUtmContent(utmContentInput);
                                utmContentInputRef.current?.focus();
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              Add "<strong>{utmContentInput.trim().toLowerCase().replace(/\s+/g, '-')}</strong>"
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <span className="link-tracking-card__field-hint">
                      Differentiates between similar content or links within the same campaign. Select from suggestions or add your own.
                    </span>
                  </div>

                  {/* Term (utm_term) – chip builder */}
                  <div className="link-tracking-card__field" ref={utmTermFieldRef}>
                    <div className="link-tracking-card__label-row">
                      <label className="link-tracking-card__label">
                        Term (utm_term)
                      </label>
                      <span className="link-tracking-card__help-tooltip">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.03 6.73 7.4 6.93C7.17 7.01 7 7.21 7 7.45V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          <circle cx="7" cy="9.75" r="0.75" fill="currentColor"/>
                        </svg>
                        <span className="link-tracking-card__help-tooltip-content">
                          <strong>Optional.</strong> Primarily used for paid search campaigns to track keywords. On social media you can use it to differentiate audience segments or targeting parameters. Examples: <code>retargeting-audience</code>, <code>lookalike-audience</code>, <code>interest-tech-enthusiasts</code>.
                        </span>
                      </span>
                    </div>
                    <div
                      className={`utm-content-builder ${isUtmTermDropdownOpen ? 'utm-content-builder--focused' : ''}`}
                      onClick={() => {
                        utmTermInputRef.current?.focus();
                        setIsUtmTermDropdownOpen(true);
                      }}
                    >
                      <div className="utm-content-builder__chips-area">
                        {utmTerm.map((item) => (
                          <span key={item} className="utm-content-builder__chip">
                            <span className="utm-content-builder__chip-text">{item}</span>
                            <button
                              type="button"
                              className="utm-content-builder__chip-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveUtmTerm(item);
                              }}
                              aria-label={`Remove ${item}`}
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M6 2L2 6M2 2l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </span>
                        ))}
                        <input
                          ref={utmTermInputRef}
                          type="text"
                          className="utm-content-builder__input"
                          value={utmTermInput}
                          onChange={(e) => {
                            setUtmTermInput(e.target.value);
                            setIsUtmTermDropdownOpen(true);
                          }}
                          onFocus={() => setIsUtmTermDropdownOpen(true)}
                          onKeyDown={handleUtmTermKeyDown}
                          placeholder={utmTerm.length === 0 ? 'Type keywords or select from suggestions...' : ''}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Suggestions dropdown */}
                    {isUtmTermDropdownOpen && (
                      <div className="utm-content-builder__dropdown">
                        {/* Selected items shown at top */}
                        {utmTerm.length > 0 && (
                          <div className="utm-content-builder__dropdown-selected">
                            <span className="utm-content-builder__dropdown-category">Selected</span>
                            {utmTerm.map((item) => (
                              <button
                                key={item}
                                type="button"
                                className="utm-content-builder__dropdown-item utm-content-builder__dropdown-item--checked"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  handleRemoveUtmTerm(item);
                                  utmTermInputRef.current?.focus();
                                }}
                              >
                                <svg className="utm-content-builder__check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="utm-content-builder__item-text">{item}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {filteredUtmTermSuggestions.length > 0 ? (
                          filteredUtmTermSuggestions.map((group) => (
                            <div key={group.category} className="utm-content-builder__dropdown-group">
                              <span className="utm-content-builder__dropdown-category">{group.category}</span>
                              {group.items.map((item) => {
                                const flatIdx = flatUtmTermItems.indexOf(item);
                                return (
                                  <button
                                    key={item}
                                    type="button"
                                    className={`utm-content-builder__dropdown-item ${flatIdx === utmTermHighlight ? 'utm-content-builder__dropdown-item--highlighted' : ''}`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onMouseEnter={() => setUtmTermHighlight(flatIdx)}
                                    onClick={() => {
                                      handleAddUtmTerm(item);
                                      utmTermInputRef.current?.focus();
                                    }}
                                  >
                                    <span className="utm-content-builder__item-text">
                                      <HighlightMatch text={item} query={utmTermInput} />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          ))
                        ) : (
                          !utmTermInput.trim() && utmTerm.length === 0 && (
                            <div className="utm-content-builder__dropdown-empty">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                                <path d="M8 7.5V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
                              </svg>
                              <span>Start typing to search or add keywords</span>
                            </div>
                          )
                        )}

                        {utmTermInput.trim() && filteredUtmTermSuggestions.length === 0 && !utmTerm.includes(utmTermInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                          <div className="utm-content-builder__dropdown-no-results">
                            No matching suggestions found
                          </div>
                        )}

                        {utmTermInput.trim() && !utmTerm.includes(utmTermInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                          <>
                            <div className="utm-content-builder__dropdown-divider" />
                            <button
                              type="button"
                              className={`utm-content-builder__dropdown-item utm-content-builder__dropdown-item--custom ${flatUtmTermItems.indexOf(`__custom__${utmTermInput.trim().toLowerCase().replace(/\s+/g, '-')}`) === utmTermHighlight ? 'utm-content-builder__dropdown-item--highlighted' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onMouseEnter={() => setUtmTermHighlight(flatUtmTermItems.indexOf(`__custom__${utmTermInput.trim().toLowerCase().replace(/\s+/g, '-')}`))}
                              onClick={() => {
                                handleAddUtmTerm(utmTermInput);
                                utmTermInputRef.current?.focus();
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                              Add "<strong>{utmTermInput.trim().toLowerCase().replace(/\s+/g, '-')}</strong>"
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    <span className="link-tracking-card__field-hint">
                      Identifies paid search keywords or audience segments. Add your own or pick from suggestions.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Brief' && (
          <div className="campaign-dialog__content-inner">
            <div className="brief-editor-card">
              {/* Toolbar */}
              <div className="brief-editor__toolbar">
                <div className="brief-editor__toolbar-group">
                  <button
                    type="button"
                    className={`brief-editor__toolbar-btn ${activeFormats.bold ? 'brief-editor__toolbar-btn--active' : ''}`}
                    onClick={() => handleBriefFormat('bold')}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    className={`brief-editor__toolbar-btn ${activeFormats.italic ? 'brief-editor__toolbar-btn--active' : ''}`}
                    onClick={() => handleBriefFormat('italic')}
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    className={`brief-editor__toolbar-btn ${activeFormats.underline ? 'brief-editor__toolbar-btn--active' : ''}`}
                    onClick={() => handleBriefFormat('underline')}
                    title="Underline"
                  >
                    <span style={{ textDecoration: 'underline' }}>U</span>
                  </button>
                </div>
                <div className="brief-editor__toolbar-divider" />
                <div className="brief-editor__toolbar-group">
                  <button
                    type="button"
                    className="brief-editor__toolbar-btn"
                    onClick={() => handleBriefFormat('insertUnorderedList')}
                    title="Bullet list"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="3" cy="4" r="1.25" fill="currentColor"/>
                      <circle cx="3" cy="8" r="1.25" fill="currentColor"/>
                      <circle cx="3" cy="12" r="1.25" fill="currentColor"/>
                      <path d="M6.5 4H14M6.5 8H14M6.5 12H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="brief-editor__toolbar-btn"
                    onClick={() => handleBriefFormat('insertOrderedList')}
                    title="Numbered list"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <text x="1.5" y="5.5" fontSize="5.5" fontWeight="600" fill="currentColor" fontFamily="Inter, sans-serif">1.</text>
                      <text x="1.5" y="9.5" fontSize="5.5" fontWeight="600" fill="currentColor" fontFamily="Inter, sans-serif">2.</text>
                      <text x="1.5" y="13.5" fontSize="5.5" fontWeight="600" fill="currentColor" fontFamily="Inter, sans-serif">3.</text>
                      <path d="M6.5 4H14M6.5 8H14M6.5 12H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div className="brief-editor__toolbar-divider" />
                <div className="brief-editor__toolbar-group">
                  <button
                    type="button"
                    className="brief-editor__toolbar-btn"
                    onClick={() => {
                      const url = prompt('Enter URL:');
                      if (url) {
                        document.execCommand('createLink', false, url);
                        if (briefEditorRef.current) briefEditorRef.current.focus();
                      }
                    }}
                    title="Insert link"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6.667 8.667a3.333 3.333 0 005.026.36l2-2A3.333 3.333 0 008.98 2.313l-1.147 1.14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.333 7.333a3.333 3.333 0 00-5.026-.36l-2 2a3.333 3.333 0 004.713 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="brief-editor__toolbar-btn"
                    onClick={() => {
                      const url = prompt('Enter image URL:');
                      if (url) {
                        document.execCommand('insertImage', false, url);
                        if (briefEditorRef.current) briefEditorRef.current.focus();
                      }
                    }}
                    title="Insert image"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="5.5" cy="5.5" r="1.25" stroke="currentColor" strokeWidth="1"/>
                      <path d="M2 11l3.5-3.5L8 10l2.5-2.5L14 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Editor area */}
              <div className="brief-editor__body-wrapper">
                {isBriefEmpty && (
                  <div className="brief-editor__placeholder">
                    {briefPlaceholder}
                  </div>
                )}
                <div
                  ref={briefEditorRef}
                  className="brief-editor__body"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleBriefInput}
                  onKeyUp={updateActiveFormats}
                  onMouseUp={updateActiveFormats}
                  onFocus={updateActiveFormats}
                />
              </div>
            </div>
          </div>
        )}

        {/* Date Picker */}
        <DatePicker
          isOpen={isDatePickerOpen}
          anchorRef={dateFieldsRef}
          onClose={() => setIsDatePickerOpen(false)}
          onApply={handleDateApply}
          startDate={startDate}
          endDate={endDate}
          disablePastDates={true}
        />
      </div>

      {/* Unsaved changes confirmation modal */}
      {showLeaveConfirm && (
        <div className="campaign-dialog__confirm-overlay" onClick={() => setShowLeaveConfirm(false)}>
          <div className="campaign-dialog__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="campaign-dialog__confirm-title">Do you want to leave without saving?</h2>
            <p className="campaign-dialog__confirm-description">
              If you leave, you will lose the changes you've made.
            </p>
            <div className="campaign-dialog__confirm-actions">
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--secondary"
                onClick={() => setShowLeaveConfirm(false)}
              >
                Go back
              </button>
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--danger"
                onClick={handleConfirmLeave}
              >
                Leave without saving
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete campaign confirmation modal (edit mode) */}
      {showDeleteConfirm && (
        <div className="campaign-dialog__confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="campaign-dialog__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="campaign-dialog__confirm-title">Do you want to delete this campaign?</h2>
            <p className="campaign-dialog__confirm-description">
              This action cannot be undone.
            </p>
            <div className="campaign-dialog__confirm-actions">
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--danger"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  if (onDeleteCampaign && campaignData?.id) {
                    onDeleteCampaign(campaignData.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDialog;
