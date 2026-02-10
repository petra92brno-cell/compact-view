import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PostDateTimePicker.css';

/**
 * Round a Date to the nearest 30 minutes (ceiling).
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

/**
 * Generate time options in 30-minute intervals for a given date.
 * If the date is today, only future times are included.
 */
const generateTimeOptions = (selectedDate) => {
  const options = [];
  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (isToday) {
        const optTime = new Date(selectedDate);
        optTime.setHours(h, m, 0, 0);
        if (optTime <= now) continue;
      }
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const PostDateTimePicker = ({ value, onChange }) => {
  // Default: today + current time rounded to nearest 30 min
  const getDefault = useCallback(() => roundToNearest30(new Date()), []);

  const [selectedDate, setSelectedDate] = useState(() => value || getDefault());
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    () => new Date((value || getDefault()).getFullYear(), (value || getDefault()).getMonth(), 1)
  );

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeListRef = useRef(null);

  // Sync when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Scroll time list to selected time when opened
  useEffect(() => {
    if (isOpen && timeListRef.current) {
      const activeItem = timeListRef.current.querySelector('.pdtp-time-option--active');
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [isOpen]);

  /* ---- Calendar helpers ---- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d) => {
    const day = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const isDateInPast = (d) => {
    const normalized = new Date(d);
    normalized.setHours(0, 0, 0, 0);
    return normalized < today;
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const navigateMonth = (dir) => {
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  /* ---- Handlers ---- */
  const handleDateSelect = (day) => {
    const newDate = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      day,
      selectedDate.getHours(),
      selectedDate.getMinutes()
    );

    // If new date is today and selected time is in the past, snap to next valid time
    const now = new Date();
    if (isSameDay(newDate, now) && newDate <= now) {
      const rounded = roundToNearest30(now);
      newDate.setHours(rounded.getHours(), rounded.getMinutes(), 0, 0);
    }

    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const handleTimeSelect = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(h, m, 0, 0);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  /* ---- Build calendar grid ---- */
  const buildDays = () => {
    const daysInMonth = getDaysInMonth(viewMonth);
    const firstDay = getFirstDayOfMonth(viewMonth);
    const days = [];

    // Previous month padding
    const prevMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 0);
    const prevDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevDays - i, current: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
      days.push({
        day: d,
        current: true,
        past: isDateInPast(date),
        today: isSameDay(date, today),
        selected: isSameDay(date, selectedDate),
      });
    }

    // Next month padding
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let d = 1; days.length < totalCells; d++) {
      days.push({ day: d, current: false });
    }

    return days;
  };

  /* ---- Format display value ---- */
  const formatDisplay = (d) => {
    const month = SHORT_MONTHS[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${year} ${hh}:${mm}`;
  };

  const currentTimeStr = `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`;
  const timeOptions = generateTimeOptions(selectedDate);

  const days = buildDays();

  return (
    <div className="pdtp" ref={containerRef}>
      {/* Input trigger */}
      <button
        type="button"
        className={`pdtp-input ${isOpen ? 'pdtp-input--active' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="pdtp-input__value">{formatDisplay(selectedDate)}</span>
        <svg className="pdtp-input__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.667 1.333V2.667M5.333 1.333V2.667M2 5.333h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="pdtp-dropdown" ref={dropdownRef}>
          <div className="pdtp-dropdown__body">
            {/* Calendar */}
            <div className="pdtp-calendar">
              <div className="pdtp-calendar__header">
                <button
                  className="pdtp-calendar__nav"
                  onClick={() => navigateMonth(-1)}
                  aria-label="Previous month"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M11 4L7 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="pdtp-calendar__month-year">
                  {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </span>
                <button
                  className="pdtp-calendar__nav"
                  onClick={() => navigateMonth(1)}
                  aria-label="Next month"
                  type="button"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M7 4L11 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="pdtp-calendar__weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((wd) => (
                  <div key={wd} className="pdtp-calendar__weekday">{wd}</div>
                ))}
              </div>

              <div className="pdtp-calendar__days">
                {days.map((item, idx) => {
                  const cls = [
                    'pdtp-calendar__day',
                    !item.current && 'pdtp-calendar__day--other',
                    item.past && 'pdtp-calendar__day--past',
                    item.today && !item.selected && 'pdtp-calendar__day--today',
                    item.selected && 'pdtp-calendar__day--selected',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      key={idx}
                      className={cls}
                      disabled={!item.current || item.past}
                      onClick={() => item.current && !item.past && handleDateSelect(item.day)}
                      type="button"
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time picker */}
            <div className="pdtp-time">
              <div className="pdtp-time__label">Time</div>
              <div className="pdtp-time__list" ref={timeListRef}>
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`pdtp-time-option ${t === currentTimeStr ? 'pdtp-time-option--active' : ''}`}
                    onClick={() => handleTimeSelect(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDateTimePicker;
