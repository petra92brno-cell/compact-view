import React, { useState, useEffect, useRef } from 'react';
import './DatePicker.css';

const DatePicker = ({ isOpen, anchorRef, onClose, onApply, startDate: initialStartDate, endDate: initialEndDate, disablePastDates = false }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const defaultStartDate = initialStartDate || today;
  const defaultEndDate = initialEndDate || today;
  
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [startMonth, setStartMonth] = useState(() => new Date(defaultStartDate.getFullYear(), defaultStartDate.getMonth(), 1));
  const [endMonth, setEndMonth] = useState(() => {
    // End month calendar shows the next month by default
    const d = new Date(defaultEndDate.getFullYear(), defaultEndDate.getMonth() + 1, 1);
    return d;
  });
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef(null);

  // Sync with props when they change
  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
      setStartMonth(new Date(initialStartDate.getFullYear(), initialStartDate.getMonth(), 1));
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
      const nextMonth = new Date(initialEndDate.getFullYear(), initialEndDate.getMonth() + 1, 1);
      setEndMonth(nextMonth);
    }
  }, [initialStartDate, initialEndDate]);

  // Calculate position relative to anchor
  useEffect(() => {
    if (isOpen && anchorRef?.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pickerWidth = 620; // Approximate width of date picker
      const pickerHeight = 420; // Approximate height of date picker

      let left = anchorRect.left;
      let top = anchorRect.bottom + 8;

      // Adjust if picker would overflow right
      if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 16;
      }

      // Adjust if picker would overflow bottom
      if (top + pickerHeight > viewportHeight) {
        top = anchorRect.top - pickerHeight - 8;
      }

      // Ensure picker doesn't go off left edge
      if (left < 16) {
        left = 16;
      }

      setPosition({ top, left });
    }
  }, [isOpen, anchorRef]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Monday = 0
  };

  const formatMonthYear = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const navigateMonth = (calendar, direction) => {
    if (calendar === 'start') {
      setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() + direction, 1));
    } else {
      setEndMonth(new Date(endMonth.getFullYear(), endMonth.getMonth() + direction, 1));
    }
  };

  // Check if a date is in the past (before today)
  const isDateInPast = (date) => {
    if (!disablePastDates) return false;
    const todayNormalized = new Date();
    todayNormalized.setHours(0, 0, 0, 0);
    const dateNormalized = new Date(date);
    dateNormalized.setHours(0, 0, 0, 0);
    return dateNormalized < todayNormalized;
  };

  // Check if a specific day in a month is today
  const isDayToday = (month, day) => {
    const todayNormalized = new Date();
    todayNormalized.setHours(0, 0, 0, 0);
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === todayNormalized.getTime();
  };

  const selectDate = (calendar, day) => {
    const month = calendar === 'start' ? startMonth : endMonth;
    const newDate = new Date(month.getFullYear(), month.getMonth(), day);

    // Prevent selecting past dates
    if (isDateInPast(newDate)) return;

    if (calendar === 'start') {
      setStartDate(newDate);
      // If end date is before start date, update end date
      if (newDate > endDate) {
        setEndDate(newDate);
      }
    } else {
      // If start date is after end date, update start date
      if (newDate < startDate) {
        setStartDate(newDate);
      }
      setEndDate(newDate);
    }
  };

  const isDateSelected = (calendar, day) => {
    const date = calendar === 'start' ? startDate : endDate;
    const month = calendar === 'start' ? startMonth : endMonth;
    return (
      day === date.getDate() &&
      month.getMonth() === date.getMonth() &&
      month.getFullYear() === date.getFullYear()
    );
  };

  const isStartDateSelected = (month, day) => {
    return (
      day === startDate.getDate() &&
      month.getMonth() === startDate.getMonth() &&
      month.getFullYear() === startDate.getFullYear()
    );
  };

  const isEndDateSelected = (month, day) => {
    return (
      day === endDate.getDate() &&
      month.getMonth() === endDate.getMonth() &&
      month.getFullYear() === endDate.getFullYear()
    );
  };

  const isDateInRange = (calendar, day) => {
    const month = calendar === 'start' ? startMonth : endMonth;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    return date > start && date < end;
  };

  const renderCalendar = (calendar) => {
    const month = calendar === 'start' ? startMonth : endMonth;
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDayOfMonth(month);
    const days = [];

    // Previous month days
    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateForDay = new Date(month.getFullYear(), month.getMonth(), day);
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        isPast: isDateInPast(dateForDay),
        isToday: isDayToday(month, day),
      });
    }

    // Next month days
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingDays = totalCells - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }

    return (
      <div className="date-picker__calendar">
        <div className="date-picker__calendar-header">
          <button
            className="date-picker__nav-button"
            onClick={() => navigateMonth(calendar, -1)}
            aria-label="Previous month"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L7 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="date-picker__month-year">{formatMonthYear(month)}</div>
          <button
            className="date-picker__nav-button"
            onClick={() => navigateMonth(calendar, 1)}
            aria-label="Next month"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 4L11 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="date-picker__weekdays">
          <div className="date-picker__weekday">Mon</div>
          <div className="date-picker__weekday">Tue</div>
          <div className="date-picker__weekday">Wed</div>
          <div className="date-picker__weekday">Thu</div>
          <div className="date-picker__weekday">Fri</div>
          <div className="date-picker__weekday">Sat</div>
          <div className="date-picker__weekday">Sun</div>
        </div>
        <div className="date-picker__days">
          {days.map((item, index) => {
            const isSelected = item.isCurrentMonth && (isStartDateSelected(month, item.day) || isEndDateSelected(month, item.day));
            const inRange = item.isCurrentMonth && isDateInRange(calendar, item.day);
            const isPastDay = item.isCurrentMonth && item.isPast;
            const isTodayDay = item.isCurrentMonth && item.isToday;
            
            return (
              <button
                key={index}
                className={`date-picker__day ${
                  !item.isCurrentMonth ? 'date-picker__day--other-month' : ''
                } ${isSelected ? 'date-picker__day--selected' : ''} ${
                  inRange && !isSelected ? 'date-picker__day--in-range' : ''
                } ${isPastDay ? 'date-picker__day--past' : ''} ${
                  isTodayDay && !isSelected ? 'date-picker__day--today' : ''
                }`}
                onClick={() => item.isCurrentMonth && !isPastDay && selectDate(calendar, item.day)}
                disabled={!item.isCurrentMonth || isPastDay}
              >
                {item.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="date-picker-overlay" />
      <div
        ref={pickerRef}
        className="date-picker"
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 1000
        }}
      >
        <div className="date-picker__container">
          <div className="date-picker__section">
            <div className="date-picker__title">Start date</div>
            {renderCalendar('start')}
          </div>
          <div className="date-picker__section">
            <div className="date-picker__title">End date</div>
            {renderCalendar('end')}
          </div>
        </div>
        <div className="date-picker__footer">
          <button className="date-picker__button date-picker__button--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="date-picker__button date-picker__button--save"
            onClick={() => {
              onApply?.(startDate, endDate);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default DatePicker;
