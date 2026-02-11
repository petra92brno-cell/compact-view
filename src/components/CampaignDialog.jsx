import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './CampaignDialog.css';
import CampaignColorPicker from './CampaignColorPicker';
import DatePicker from './DatePicker';
import ContentLabelsDropdown from './ContentLabelsDropdown';
import UTMParameterRow from './UTMParameterRow';

const MAX_NAME_LENGTH = 100;
const DEFAULT_COLOR = '#4338CA';

// UTM variable options for the URL preset builder
const UTM_VARIABLES = [
  { id: 'asset-id', label: 'Asset ID' },
  { id: 'campaign-id', label: 'Campaign ID' },
  { id: 'country-id', label: 'Country ID' },
  { id: 'unique-id', label: 'Unique ID' },
  { id: 'post-id', label: 'Post ID' },
  { id: 'social-channel-id', label: 'Social channel ID' },
];

// Generate deterministic random-looking string from seed (for link preview)
const generateVarPreview = (seed) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  let result = '';
  for (let i = 0; i < 22; i++) {
    hash = ((hash << 5) - hash) + i * 7;
    hash |= 0;
    result += chars[Math.abs(hash) % chars.length];
  }
  return result;
};

// Get display label for a UTM mode
const getModeLabel = (mode) => {
  if (mode === 'none') return 'None';
  if (mode === 'custom') return 'Custom value';
  const variable = UTM_VARIABLES.find(v => v.id === mode);
  return variable ? variable.label : mode;
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

  // UTM Preset Builder state (mode + custom value + enabled per param)
  const [utmSourceMode, setUtmSourceMode] = useState('social-channel-id');
  const [utmSourceValue, setUtmSourceValue] = useState('');
  const [utmSourceEnabled, setUtmSourceEnabled] = useState(true);
  const [utmSourceTouched, setUtmSourceTouched] = useState(false);
  const [utmMediumMode, setUtmMediumMode] = useState('custom');
  const [utmMediumValue, setUtmMediumValue] = useState('social');
  const [utmMediumEnabled, setUtmMediumEnabled] = useState(true);
  const [utmMediumTouched, setUtmMediumTouched] = useState(false);
  const [utmCampaignMode, setUtmCampaignMode] = useState('campaign-id');
  const [utmCampaignValue, setUtmCampaignValue] = useState('');
  const [utmCampaignEnabled, setUtmCampaignEnabled] = useState(true);
  const [utmCampaignTouched, setUtmCampaignTouched] = useState(false);
  const [utmContentMode, setUtmContentMode] = useState('none');
  const [utmContentValue, setUtmContentValue] = useState('');
  const [utmContentEnabled, setUtmContentEnabled] = useState(true);
  const [utmContentTouched, setUtmContentTouched] = useState(false);

  // UTM validation warning modal state
  const [showUtmWarningModal, setShowUtmWarningModal] = useState(false);
  const [incompleteUtmParams, setIncompleteUtmParams] = useState([]);
  const [pendingSaveAction, setPendingSaveAction] = useState(null);


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
        }
      : null
  );


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

  // UTM custom value validation — inline errors (red border + message on blur)
  const utmSourceError = utmSourceMode === 'custom' && utmSourceEnabled && utmSourceValue.trim() === '' && utmSourceTouched;
  const utmMediumError = utmMediumMode === 'custom' && utmMediumEnabled && utmMediumValue.trim() === '' && utmMediumTouched;
  const utmCampaignError = utmCampaignMode === 'custom' && utmCampaignEnabled && utmCampaignValue.trim() === '' && utmCampaignTouched;
  const utmContentError = utmContentMode === 'custom' && utmContentEnabled && utmContentValue.trim() === '' && utmContentTouched;

  // UTM mode change handlers — reset touched state on mode change
  const handleUtmSourceModeChange = (newMode) => { setUtmSourceMode(newMode); setUtmSourceTouched(false); };
  const handleUtmMediumModeChange = (newMode) => { setUtmMediumMode(newMode); setUtmMediumTouched(false); };
  const handleUtmCampaignModeChange = (newMode) => { setUtmCampaignMode(newMode); setUtmCampaignTouched(false); };
  const handleUtmContentModeChange = (newMode) => { setUtmContentMode(newMode); setUtmContentTouched(false); };

  // UTM value change handlers — clear error on typing / variable insert
  const handleUtmSourceValueChange = (newValue) => { setUtmSourceValue(newValue); if (utmSourceTouched) setUtmSourceTouched(false); };
  const handleUtmMediumValueChange = (newValue) => { setUtmMediumValue(newValue); if (utmMediumTouched) setUtmMediumTouched(false); };
  const handleUtmCampaignValueChange = (newValue) => { setUtmCampaignValue(newValue); if (utmCampaignTouched) setUtmCampaignTouched(false); };
  const handleUtmContentValueChange = (newValue) => { setUtmContentValue(newValue); if (utmContentTouched) setUtmContentTouched(false); };

  // UTM blur handlers — show error when input is blurred while empty
  const handleUtmSourceBlur = () => { if (utmSourceMode === 'custom' && utmSourceValue.trim() === '') setUtmSourceTouched(true); };
  const handleUtmMediumBlur = () => { if (utmMediumMode === 'custom' && utmMediumValue.trim() === '') setUtmMediumTouched(true); };
  const handleUtmCampaignBlur = () => { if (utmCampaignMode === 'custom' && utmCampaignValue.trim() === '') setUtmCampaignTouched(true); };
  const handleUtmContentBlur = () => { if (utmContentMode === 'custom' && utmContentValue.trim() === '') setUtmContentTouched(true); };

  // Get list of UTM parameters that are incomplete (custom value selected + empty)
  const getIncompleteUtmParams = useCallback(() => {
    if (!linkTrackingEnabled) return [];
    const params = [];
    if (utmSourceEnabled && (utmSourceMode === 'none' || (utmSourceMode === 'custom' && utmSourceValue.trim() === ''))) {
      params.push('Source (utm_source)');
    }
    if (utmMediumEnabled && (utmMediumMode === 'none' || (utmMediumMode === 'custom' && utmMediumValue.trim() === ''))) {
      params.push('Medium (utm_medium)');
    }
    if (utmCampaignEnabled && (utmCampaignMode === 'none' || (utmCampaignMode === 'custom' && utmCampaignValue.trim() === ''))) {
      params.push('Campaign name (utm_campaign)');
    }
    if (utmContentEnabled && (utmContentMode === 'none' || (utmContentMode === 'custom' && utmContentValue.trim() === ''))) {
      params.push('Content (utm_content)');
    }
    return params;
  }, [linkTrackingEnabled, utmSourceMode, utmSourceEnabled, utmSourceValue, utmMediumMode, utmMediumEnabled, utmMediumValue, utmCampaignMode, utmCampaignEnabled, utmCampaignValue, utmContentMode, utmContentEnabled, utmContentValue]);

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
        linkTrackingEnabled !== orig.linkTrackingEnabled
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
      utmSourceMode !== 'social-channel-id' ||
      utmSourceValue !== '' ||
      utmMediumMode !== 'custom' ||
      utmMediumValue !== 'social' ||
      utmCampaignMode !== 'campaign-id' ||
      utmContentMode !== 'none' ||
      utmContentValue !== ''
    );
  }, [isEditMode, name, color, startDate, endDate, selectedLabels, briefContent, uniqueId, isBriefEmpty, linkTrackingEnabled, utmSourceMode, utmSourceValue, utmMediumMode, utmMediumValue, utmCampaignMode, utmContentMode, utmContentValue]);

  // Check if UTM Builder is ON but ALL parameter toggles are OFF
  const allUtmParamsOff = linkTrackingEnabled && !utmSourceEnabled && !utmMediumEnabled && !utmCampaignEnabled && !utmContentEnabled;

  // Check if any enabled UTM params are incomplete (none mode or custom with empty value)
  const hasIncompleteUtmParams = useMemo(() => {
    if (!linkTrackingEnabled) return false;
    const isIncomplete = (enabled, mode, value) => enabled && (mode === 'none' || (mode === 'custom' && value.trim() === ''));
    return isIncomplete(utmSourceEnabled, utmSourceMode, utmSourceValue) ||
           isIncomplete(utmMediumEnabled, utmMediumMode, utmMediumValue) ||
           isIncomplete(utmCampaignEnabled, utmCampaignMode, utmCampaignValue) ||
           isIncomplete(utmContentEnabled, utmContentMode, utmContentValue);
  }, [linkTrackingEnabled, utmSourceEnabled, utmSourceMode, utmSourceValue, utmMediumEnabled, utmMediumMode, utmMediumValue, utmCampaignEnabled, utmCampaignMode, utmCampaignValue, utmContentEnabled, utmContentMode, utmContentValue]);

  // Build UTM link preview data from param states (respecting enabled toggles)
  const utmPreviewData = useMemo(() => {
    const baseUrl = 'https://www.emplifi.io/';
    const params = [
      { key: 'utm_source', mode: utmSourceMode, value: utmSourceValue, enabled: utmSourceEnabled },
      { key: 'utm_medium', mode: utmMediumMode, value: utmMediumValue, enabled: utmMediumEnabled },
      { key: 'utm_campaign', mode: utmCampaignMode, value: utmCampaignValue, enabled: utmCampaignEnabled },
      { key: 'utm_content', mode: utmContentMode, value: utmContentValue, enabled: utmContentEnabled },
    ];

    const resolvedParts = [];
    const variableUrlParts = [];

    params.forEach(({ key, mode, value, enabled }) => {
      if (!enabled) return;
      if (mode === 'none') {
        // Parameter is enabled but has no selection — include with empty value
        resolvedParts.push(`${key}=`);
        variableUrlParts.push(`${key}=`);
        return;
      }
      let rawValue, resolvedValue;
      if (mode === 'custom') {
        rawValue = value;
        resolvedValue = value.replace(/\{([^}]+)\}/g, (_, varId) => generateVarPreview(varId));
      } else {
        rawValue = `{${mode}}`;
        resolvedValue = generateVarPreview(mode);
      }
      resolvedParts.push(`${key}=${encodeURIComponent(resolvedValue)}`);
      variableUrlParts.push(`${key}=${rawValue}`);
    });

    const resolvedUrl = resolvedParts.length > 0 ? `${baseUrl}?${resolvedParts.join('&')}` : baseUrl;
    const variableUrl = variableUrlParts.length > 0 ? `${baseUrl}?${variableUrlParts.join('&')}` : baseUrl;
    return { resolvedUrl, variableUrl };
  }, [utmSourceMode, utmSourceValue, utmSourceEnabled, utmMediumMode, utmMediumValue, utmMediumEnabled, utmCampaignMode, utmCampaignValue, utmCampaignEnabled, utmContentMode, utmContentValue, utmContentEnabled]);

  // Render a URL string with {variable} placeholders highlighted in blue
  const renderVariableUrl = (urlString) => {
    const parts = urlString.split(/(\{[^}]+\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return <span key={i} className="utm-link-preview-vars__variable">{part}</span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

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

  // Build campaign data payload
  const buildCampaignPayload = () => ({
    ...(isEditMode ? { id: campaignData?.id } : {}),
    name: name.trim(),
    color,
    startDate,
    endDate,
    uniqueId: uniqueId.trim(),
    labels: selectedLabels,
    briefContent,
    linkTrackingEnabled,
    utmSourceMode, utmSourceValue,
    utmMediumMode, utmMediumValue,
    utmCampaignMode, utmCampaignValue,
    utmContentMode, utmContentValue,
  });

  // Perform save (edit mode)
  const performSave = () => {
    if (onSaveCampaign) {
      onSaveCampaign(buildCampaignPayload());
    }
  };

  // Perform create
  const performCreate = () => {
    if (onCreateCampaign) {
      onCreateCampaign(buildCampaignPayload());
    }
  };

  // Handle save/create click — check for incomplete UTM params first
  const handleSaveOrCreateClick = (action) => {
    if (!isFormValid) return;
    const incomplete = getIncompleteUtmParams();
    if (incomplete.length > 0) {
      // Mark all incomplete params as touched so inline errors show when user goes back
      if (utmSourceMode === 'custom' && utmSourceEnabled && utmSourceValue.trim() === '') setUtmSourceTouched(true);
      if (utmMediumMode === 'custom' && utmMediumEnabled && utmMediumValue.trim() === '') setUtmMediumTouched(true);
      if (utmCampaignMode === 'custom' && utmCampaignEnabled && utmCampaignValue.trim() === '') setUtmCampaignTouched(true);
      if (utmContentMode === 'custom' && utmContentEnabled && utmContentValue.trim() === '') setUtmContentTouched(true);
      setIncompleteUtmParams(incomplete);
      setPendingSaveAction(action);
      setShowUtmWarningModal(true);
      return;
    }
    if (action === 'save') performSave();
    else performCreate();
  };

  // Handle "Save anyway" in warning modal
  const handleUtmWarningSaveAnyway = () => {
    setShowUtmWarningModal(false);
    if (pendingSaveAction === 'save') performSave();
    else performCreate();
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
                onClick={() => handleSaveOrCreateClick('save')}
              >
                Save and close
              </button>
            ) : (
              <>
                <button
                  className={`campaign-dialog__create-btn ${!isFormValid ? 'campaign-dialog__create-btn--disabled' : ''}`}
                  disabled={!isFormValid}
                  onClick={() => handleSaveOrCreateClick('create')}
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
                  aria-pressed={linkTrackingEnabled}
                  aria-label="Toggle link tracking"
                >
                  <span className="link-tracking-card__toggle-label">
                    {linkTrackingEnabled ? 'ON' : ''}
                  </span>
                  <span className="link-tracking-card__toggle-knob" />
                  {!linkTrackingEnabled && (
                    <span className="link-tracking-card__toggle-off-label">OFF</span>
                  )}
                </button>
              </div>

              {/* UTM Builder body – collapsible content */}
              <div className={`link-tracking-card__body ${linkTrackingEnabled ? 'link-tracking-card__body--open' : ''}`}>
                <div className="link-tracking-card__body-inner">
                  {/* Info box with live URL preview (variables highlighted) */}
                  <div className="utm-info-box">
                    <svg className="utm-info-box__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
                    </svg>
                    <div className="utm-info-box__url">
                      {renderVariableUrl(utmPreviewData.variableUrl)}
                    </div>
                  </div>

                  {/* UTM Parameters */}
                  <div className="utm-params-section">
                    <UTMParameterRow
                      label="Source (utm_source)"
                      mode={utmSourceMode}
                      value={utmSourceValue}
                      enabled={utmSourceEnabled}
                      onModeChange={handleUtmSourceModeChange}
                      onValueChange={handleUtmSourceValueChange}
                      onToggleEnabled={() => setUtmSourceEnabled(prev => !prev)}
                      hasError={utmSourceError}
                      onInputBlur={handleUtmSourceBlur}
                    />
                    <UTMParameterRow
                      label="Medium (utm_medium)"
                      mode={utmMediumMode}
                      value={utmMediumValue}
                      enabled={utmMediumEnabled}
                      onModeChange={handleUtmMediumModeChange}
                      onValueChange={handleUtmMediumValueChange}
                      onToggleEnabled={() => setUtmMediumEnabled(prev => !prev)}
                      hasError={utmMediumError}
                      onInputBlur={handleUtmMediumBlur}
                    />
                    <UTMParameterRow
                      label="Campaign name (utm_campaign)"
                      mode={utmCampaignMode}
                      value={utmCampaignValue}
                      enabled={utmCampaignEnabled}
                      onModeChange={handleUtmCampaignModeChange}
                      onValueChange={handleUtmCampaignValueChange}
                      onToggleEnabled={() => setUtmCampaignEnabled(prev => !prev)}
                      hasError={utmCampaignError}
                      onInputBlur={handleUtmCampaignBlur}
                    />
                    <UTMParameterRow
                      label="Content (utm_content)"
                      mode={utmContentMode}
                      value={utmContentValue}
                      enabled={utmContentEnabled}
                      onModeChange={handleUtmContentModeChange}
                      onValueChange={handleUtmContentValueChange}
                      onToggleEnabled={() => setUtmContentEnabled(prev => !prev)}
                      hasError={utmContentError}
                      onInputBlur={handleUtmContentBlur}
                    />
                  </div>

                  {/* Link preview (bottom) */}
                  <div className={`utm-link-preview ${(allUtmParamsOff || hasIncompleteUtmParams) ? 'utm-link-preview--warning' : ''}`}>
                    <div className="utm-link-preview__header">
                      {(allUtmParamsOff || hasIncompleteUtmParams) ? (
                        <svg className="utm-link-preview__warning-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8.866 1.5a1 1 0 00-1.732 0L.536 13A1 1 0 001.402 14.5h13.196A1 1 0 0015.464 13L8.866 1.5z" fill="#F59E0B"/>
                          <path d="M8 6v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="8" cy="11" r="0.75" fill="white"/>
                        </svg>
                      ) : (
                        <span className="utm-link-preview__dot" />
                      )}
                      <span className="utm-link-preview__title">
                        Link preview with variables
                      </span>
                    </div>
                    {(allUtmParamsOff || hasIncompleteUtmParams) && (
                      <p className="utm-link-preview__warning-text">
                        Link preview will be shown here once you input the required parameter.
                      </p>
                    )}
                    {!allUtmParamsOff && (
                      <div className="utm-link-preview__url-box">
                        {utmPreviewData.resolvedUrl}
                      </div>
                    )}
                  </div>

                  {/* Warning: UTM enabled but all parameters OFF */}
                  {allUtmParamsOff && (
                    <div className="utm-all-off-warning">
                      <svg className="utm-all-off-warning__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8.866 1.5a1 1 0 00-1.732 0L.536 13A1 1 0 001.402 14.5h13.196A1 1 0 0015.464 13L8.866 1.5z" fill="#F59E0B"/>
                        <path d="M8 6v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="8" cy="11" r="0.75" fill="white"/>
                      </svg>
                      <span className="utm-all-off-warning__text">
                        UTM Builder is enabled but all parameters are turned off. Enable at least one parameter or turn off UTM Builder.
                      </span>
                    </div>
                  )}
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

      {/* UTM incomplete parameters warning modal */}
      {showUtmWarningModal && (
        <div className="campaign-dialog__confirm-overlay" onClick={() => setShowUtmWarningModal(false)}>
          <div className="campaign-dialog__confirm-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="campaign-dialog__confirm-close-btn"
              onClick={() => setShowUtmWarningModal(false)}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2 className="campaign-dialog__confirm-title">Some UTM parameters are incomplete</h2>
            <p className="campaign-dialog__confirm-description">
              The following parameters are enabled but have no value and won't be included in the tracking URL:
            </p>
            <ul className="campaign-dialog__confirm-list">
              {incompleteUtmParams.map((param, i) => (
                <li key={i}>{param}</li>
              ))}
            </ul>
            <div className="campaign-dialog__confirm-actions">
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--secondary"
                onClick={() => setShowUtmWarningModal(false)}
              >
                Go back and fix
              </button>
              <button
                className="campaign-dialog__confirm-btn campaign-dialog__confirm-btn--primary"
                onClick={handleUtmWarningSaveAnyway}
              >
                Save anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDialog;
