import React, { useState, useRef, useEffect } from 'react';
import './CampaignColorPicker.css';

const COLOR_PALETTE = [
  // Row 1 - Dark
  ['#4338CA', '#0F766E', '#15803D', '#4D7C0F', '#A16207', '#C2410C', '#B91C1C', '#BE185D'],
  // Row 2 - Medium
  ['#6366F1', '#14B8A6', '#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#EC4899'],
  // Row 3 - Bright
  ['#818CF8', '#5EEAD4', '#86EFAC', '#BEF264', '#FDE047', '#FDBA74', '#FCA5A5', '#F9A8D4'],
];

const CampaignColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);
  const swatchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        swatchRef.current &&
        !swatchRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (color) => {
    onColorChange(color);
    setIsOpen(false);
  };

  return (
    <div className="color-picker">
      <label className="color-picker__label">Color</label>
      <button
        ref={swatchRef}
        className="color-picker__swatch"
        style={{ backgroundColor: selectedColor }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select color"
        type="button"
      />
      {isOpen && (
        <div ref={pickerRef} className="color-picker__popover">
          <div className="color-picker__grid">
            {COLOR_PALETTE.map((row, rowIndex) => (
              <div key={rowIndex} className="color-picker__row">
                {row.map((color) => (
                  <button
                    key={color}
                    className={`color-picker__option ${
                      selectedColor === color ? 'color-picker__option--selected' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    aria-label={`Select color ${color}`}
                    type="button"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignColorPicker;
