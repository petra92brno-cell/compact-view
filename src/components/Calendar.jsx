import React, { useState, useMemo } from 'react';
import './Calendar.css';

// Helper function to parse date from post
const parsePostDate = (dateString) => {
  // Format: "Feb 3, 2025 10:20"
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const parts = dateString.split(' ');
  if (parts.length >= 4) {
    const month = months[parts[0]];
    const day = parseInt(parts[1].replace(',', ''));
    const year = parseInt(parts[2]);
    const timeParts = parts[3].split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    
    const date = new Date(year, month, day, hours, minutes);
    return date;
  }
  
  // Fallback to standard Date parsing
  return new Date(dateString);
};

// Helper function to get posts for a specific day and hour
const getPostsForTimeSlot = (posts, date, hour) => {
  return posts.filter(post => {
    const postDate = parsePostDate(post.date);
    const postDay = postDate.getDate();
    const postMonth = postDate.getMonth();
    const postYear = postDate.getFullYear();
    const postHour = postDate.getHours();
    
    return postDay === date.getDate() && 
           postMonth === date.getMonth() && 
           postYear === date.getFullYear() &&
           postHour === hour;
  });
};

// Helper function to format date range
const formatDateRange = (startDate, endDate) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = startDate.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

// Helper function to check if date is today
const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Helper function to get day name
const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

// Helper function to format time (for post cards - format: "8:00")
const formatTime = (dateString) => {
  const date = parsePostDate(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

// Helper function to format hour for display
const formatHour = (hour) => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
};

// Get status badge component
const StatusBadge = ({ status }) => {
  // Map status values
  const statusLower = status?.toLowerCase() || '';
  
  if (statusLower === 'sent' || statusLower === 'done') {
    return (
      <div className="calendar-post__status-badge calendar-post__status-badge--sent">
        Sent
      </div>
    );
  }
  if (statusLower === 'scheduled' || statusLower === 'in-progress') {
    return (
      <div className="calendar-post__status-badge calendar-post__status-badge--scheduled">
        Scheduled
      </div>
    );
  }
  if (statusLower === 'draft' || statusLower === 'no-status' || statusLower === 'no-action') {
    return (
      <div className="calendar-post__status-badge calendar-post__status-badge--draft">
        Draft
      </div>
    );
  }
  // Default to scheduled
  return (
    <div className="calendar-post__status-badge calendar-post__status-badge--scheduled">
      Scheduled
    </div>
  );
};

// Platform badge component
const PlatformBadge = ({ platform }) => {
  const platformLower = platform?.toLowerCase();
  if (platformLower === 'fb' || platformLower === 'facebook') {
    return (
      <div className="calendar-post__platform-badge calendar-post__platform-badge--facebook">
        FB
      </div>
    );
  }
  if (platformLower === 'ig' || platformLower === 'instagram') {
    return (
      <div className="calendar-post__platform-badge calendar-post__platform-badge--instagram">
        IG
      </div>
    );
  }
  return null;
};

const Calendar = ({ posts = [] }) => {
  // Set initial date to November 17, 2025 (Monday)
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date(2025, 10, 17); // November 17, 2025 (month is 0-indexed)
    return date;
  });
  const [viewMode, setViewMode] = useState('week'); // 'month', 'week', 'day'

  // Get start of week (Monday)
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get week dates
  const weekDates = useMemo(() => {
    const start = getWeekStart(currentDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  // Generate hours (1 AM to 12 PM)
  const hours = useMemo(() => {
    const h = [];
    for (let i = 1; i <= 24; i++) {
      h.push(i % 24);
    }
    return h;
  }, []);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar">
      {/* Calendar Header */}
      <div className="calendar__header">
        <div className="calendar__header-left">
          <button className="calendar__today-button" onClick={goToToday}>
            Today
          </button>
          <div className="calendar__navigation">
            <button className="calendar__nav-button" onClick={goToPreviousWeek}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L7 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="calendar__date-range">
              {formatDateRange(weekDates[0], weekDates[6])}
            </span>
            <button className="calendar__nav-button" onClick={goToNextWeek}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M7 4L11 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="calendar__header-right">
          <div className="calendar__view-toggle">
            <button 
              className={`calendar__view-button ${viewMode === 'month' ? 'calendar__view-button--active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button 
              className={`calendar__view-button ${viewMode === 'week' ? 'calendar__view-button--active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`calendar__view-button ${viewMode === 'day' ? 'calendar__view-button--active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar__grid-wrapper">
        {/* Day Headers Row */}
        <div className="calendar__row calendar__row--header">
          <div className="calendar__time-column"></div>
          {weekDates.map((date, index) => {
            const isCurrentDay = isToday(date);
            return (
              <div 
                key={index} 
                className={`calendar__day-header-cell ${isCurrentDay ? 'calendar__day-header-cell--today' : ''}`}
              >
                <div className="calendar__day-name">{getDayName(date)}</div>
                <div className={`calendar__day-number ${isCurrentDay ? 'calendar__day-number--today' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes Rows (2 rows) */}
        {[1, 2].map((rowNum) => (
          <div key={`notes-${rowNum}`} className="calendar__row calendar__row--notes">
            <div className="calendar__time-column">
              <div className="calendar__time-label">Notes</div>
            </div>
            {weekDates.map((date, index) => (
              <div key={index} className="calendar__cell"></div>
            ))}
          </div>
        ))}

        {/* Hour Rows */}
        {hours.map((hour) => (
          <div key={hour} className="calendar__row calendar__row--hour">
            <div className="calendar__time-column">
              <div className="calendar__time-label">{formatHour(hour)}</div>
            </div>
            {weekDates.map((date, dateIndex) => {
              const dayPosts = getPostsForTimeSlot(posts, date, hour);
              const isCurrentDay = isToday(date);
              
              return (
                <div 
                  key={dateIndex} 
                  className={`calendar__cell ${isCurrentDay ? 'calendar__cell--today' : ''}`}
                >
                  {dayPosts.map((post) => (
                    <div key={post.id} className="calendar-post">
                      <div className="calendar-post__header">
                        <div className="calendar-post__profile">
                          {post.profile.avatar ? (
                            <img 
                              src={post.profile.avatar} 
                              alt={post.profile.name}
                              className="calendar-post__avatar"
                            />
                          ) : (
                            <div className="calendar-post__avatar-placeholder">
                              {post.profile.name.charAt(0)}
                            </div>
                          )}
                          <div className="calendar-post__profile-info">
                            <div className="calendar-post__profile-name">{post.profile.name}</div>
                            <div className="calendar-post__profile-platform">
                              <PlatformBadge platform={post.profile.platform} />
                              <span className="calendar-post__profile-url">{post.profile.url}</span>
                            </div>
                          </div>
                        </div>
                        <div className="calendar-post__time">{formatTime(post.date)}</div>
                      </div>
                      <div className="calendar-post__status-row">
                        <div className="calendar-post__status-line calendar-post__status-line--left"></div>
                        <StatusBadge status={post.status || 'scheduled'} />
                        <div className="calendar-post__status-line calendar-post__status-line--right"></div>
                      </div>
                      {post.text && (
                        <div className="calendar-post__text">{post.text}</div>
                      )}
                      {post.media && post.media.type === 'image' && (
                        <div className="calendar-post__media">
                          <img 
                            src={post.media.src} 
                            alt={post.media.alt || 'Post media'}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
