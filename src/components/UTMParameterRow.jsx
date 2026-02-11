import React, { useState, useRef, useEffect, useCallback } from 'react';

const UTM_VARIABLES = [
  { id: 'asset-id', label: 'Asset ID' },
  { id: 'campaign-id', label: 'Campaign ID' },
  { id: 'country-id', label: 'Country ID' },
  { id: 'unique-id', label: 'Unique ID' },
  { id: 'post-id', label: 'Post ID' },
  { id: 'social-channel-id', label: 'Social channel ID' },
];

const UTMParameterRow = ({ label, mode, value, enabled, onModeChange, onValueChange, onToggleEnabled, hasError, onInputBlur }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInsertVarOpen, setIsInsertVarOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const insertVarRef = useRef(null);

  // Auto-focus the input when mode changes to 'custom'
  useEffect(() => {
    if (mode === 'custom' && enabled && inputRef.current) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mode, enabled]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!isDropdownOpen && !isInsertVarOpen) return;
    const handleClick = (e) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (isInsertVarOpen && insertVarRef.current && !insertVarRef.current.contains(e.target)) {
        setIsInsertVarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen, isInsertVarOpen]);

  const getModeDisplayLabel = (m) => {
    if (m === 'none') return 'Select ...';
    if (m === 'custom') return 'Custom value';
    const v = UTM_VARIABLES.find(x => x.id === m);
    return v ? v.label : m;
  };

  const handleInsertVariable = useCallback((varId) => {
    const tag = `{${varId}}`;
    if (inputRef.current) {
      const input = inputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = value;
      const newValue = currentValue.slice(0, start) + tag + currentValue.slice(end);
      onValueChange(newValue);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    } else {
      onValueChange(value + tag);
    }
    setIsInsertVarOpen(false);
  }, [value, onValueChange]);

  const showInput = mode === 'custom';

  return (
    <div className={`utm-param-row ${!enabled ? 'utm-param-row--disabled' : ''}`}>
      <div className="utm-param-row__top">
        <span className="utm-param-row__label">{label}</span>
        <div className="utm-param-row__top-right">
          {showInput && enabled && (
            <div className="utm-param-row__actions" ref={insertVarRef}>
              <button
                type="button"
                className="utm-param-row__insert-var-btn"
                onClick={() => setIsInsertVarOpen(prev => !prev)}
              >
                Insert variable
              </button>
              {isInsertVarOpen && (
                <div className="utm-param-row__insert-var-panel">
                  {UTM_VARIABLES.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      className="utm-param-row__insert-var-option"
                      onClick={() => handleInsertVariable(v.id)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            className={`utm-param-row__toggle ${enabled ? 'utm-param-row__toggle--on' : ''}`}
            onClick={onToggleEnabled}
            aria-pressed={enabled}
            aria-label={`Toggle ${label}`}
          >
            <span className="utm-param-row__toggle-label">
              {enabled ? 'ON' : ''}
            </span>
            <span className="utm-param-row__toggle-knob" />
            {!enabled && (
              <span className="utm-param-row__toggle-off-label">OFF</span>
            )}
          </button>
        </div>
      </div>
      <div className="utm-param-row__bottom">
        <div className="utm-param-row__mode-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className={`utm-param-row__mode-trigger ${isDropdownOpen ? 'utm-param-row__mode-trigger--open' : ''}`}
            onClick={() => enabled && setIsDropdownOpen(prev => !prev)}
            disabled={!enabled}
          >
            <span>{getModeDisplayLabel(mode)}</span>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="utm-param-row__mode-panel">
              {/* Select ... (empty) */}
              <button
                type="button"
                className={`utm-param-row__mode-option ${mode === 'none' ? 'utm-param-row__mode-option--selected' : ''}`}
                onClick={() => { onModeChange('none'); setIsDropdownOpen(false); }}
              >
                {mode === 'none' && (
                  <svg className="utm-param-row__check-icon" viewBox="0 0 14 14" fill="none">
                    <path d="M11.5 3.5L5.5 10.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                Select ...
              </button>
              {/* Custom value */}
              <button
                type="button"
                className={`utm-param-row__mode-option ${mode === 'custom' ? 'utm-param-row__mode-option--selected' : ''}`}
                onClick={() => { onModeChange('custom'); setIsDropdownOpen(false); }}
              >
                {mode === 'custom' && (
                  <svg className="utm-param-row__check-icon" viewBox="0 0 14 14" fill="none">
                    <path d="M11.5 3.5L5.5 10.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                Custom value
              </button>
              {/* VARIABLES section header */}
              <div className="utm-param-row__mode-divider">
                <span className="utm-param-row__mode-divider-label">Variables</span>
              </div>
              {/* Variable options */}
              {UTM_VARIABLES.map(v => (
                <button
                  key={v.id}
                  type="button"
                  className={`utm-param-row__mode-option ${mode === v.id ? 'utm-param-row__mode-option--selected' : ''}`}
                  onClick={() => { onModeChange(v.id); setIsDropdownOpen(false); }}
                >
                  {mode === v.id && (
                    <svg className="utm-param-row__check-icon" viewBox="0 0 14 14" fill="none">
                      <path d="M11.5 3.5L5.5 10.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>
        {showInput && (
          <div className={`utm-param-row__input-wrapper ${hasError ? 'utm-param-row__input-wrapper--error' : ''}`}>
            <input
              ref={inputRef}
              type="text"
              className="utm-param-row__input"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              onBlur={onInputBlur}
              placeholder="Enter value..."
              disabled={!enabled}
            />
            {hasError && (
              <span className="utm-param-row__input-error-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.866 1.5a1 1 0 00-1.732 0L.536 13A1 1 0 001.402 14.5h13.196A1 1 0 0015.464 13L8.866 1.5z" fill="#DC2626"/>
                  <path d="M8 6v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="11" r="0.75" fill="white"/>
                </svg>
              </span>
            )}
          </div>
        )}
      </div>
      {hasError && (
        <p className="utm-param-row__error-message">Enter a custom value or insert a variable</p>
      )}
    </div>
  );
};

export default UTMParameterRow;
