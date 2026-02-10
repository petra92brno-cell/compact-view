import React, { useMemo } from 'react';
import './MonthView.css';

// Helper: parse post date string "Feb 3, 2025 10:20" → Date
const parsePostDate = (dateString) => {
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
    return new Date(year, month, day, parseInt(timeParts[0]), parseInt(timeParts[1]));
  }
  return new Date(dateString);
};

// Format time "09:20"
const formatTime = (dateString) => {
  const d = parsePostDate(dateString);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

// Platform icon component – small colored badge
const PlatformIcon = ({ platform }) => {
  const p = platform?.toLowerCase();
  if (p === 'fb' || p === 'facebook') {
    return <span className="month-view__platform-icon month-view__platform-icon--fb">f</span>;
  }
  if (p === 'ig' || p === 'instagram') {
    return <span className="month-view__platform-icon month-view__platform-icon--ig">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    </span>;
  }
  return null;
};

// Check if two dates are the same calendar day
const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const MonthView = ({
  currentDate,
  posts = [],
  campaigns = [],
  onDayClick,
  onOpenEditDialog,
}) => {
  const today = new Date();

  // Current month & year from currentDate
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build the grid of days (6 weeks × 7 days to cover all cases)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    // getDay() returns 0 for Sun; we want Monday = 0
    let startDow = firstDayOfMonth.getDay() - 1;
    if (startDow < 0) startDow = 6; // Sunday → 6

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Start from (firstDay - startDow)
    const startDate = new Date(year, month, 1 - startDow);

    // We need 5 or 6 rows
    const totalCells = startDow + daysInMonth > 35 ? 42 : 35;

    const days = [];
    for (let i = 0; i < totalCells; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      days.push(d);
    }
    return days;
  }, [year, month]);

  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      w.push(calendarDays.slice(i, i + 7));
    }
    return w;
  }, [calendarDays]);

  // Build a map: dateKey → posts[], sorted by time
  const postsByDay = useMemo(() => {
    const map = {};
    posts.forEach(post => {
      const d = parsePostDate(post.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(post);
    });
    // Sort each day's posts by time
    Object.values(map).forEach(arr => arr.sort((a, b) => {
      const da = parsePostDate(a.date);
      const db = parsePostDate(b.date);
      return da - db;
    }));
    return map;
  }, [posts]);

  // Process campaigns: for each week-row, compute which campaigns span which columns.
  // This produces multi-day bars rendered at the top of each week-row.
  const campaignRowsByWeek = useMemo(() => {
    return weeks.map(weekDays => {
      const weekStart = new Date(weekDays[0]);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekDays[6]);
      weekEnd.setHours(23, 59, 59, 999);

      // Filter campaigns that overlap this week row
      const relevant = campaigns
        .map(campaign => {
          const cStart = new Date(campaign.startDate);
          cStart.setHours(0, 0, 0, 0);
          const cEnd = new Date(campaign.endDate);
          cEnd.setHours(23, 59, 59, 999);

          if (cEnd < weekStart || cStart > weekEnd) return null;

          // Clamp to week boundaries
          const visStart = cStart < weekStart ? weekStart : cStart;
          const visEnd = cEnd > weekEnd ? weekEnd : cEnd;

          // Calculate column indices (0-6)
          const startCol = weekDays.findIndex(d => isSameDay(d, visStart));
          const endCol = weekDays.findIndex(d => isSameDay(d, visEnd));

          const actualStart = startCol === -1 ? 0 : startCol;
          const actualEnd = endCol === -1 ? 6 : endCol;

          return {
            campaign,
            startCol: actualStart,
            endCol: actualEnd,
            span: actualEnd - actualStart + 1,
          };
        })
        .filter(Boolean);

      // Assign rows (stacking) so overlapping campaigns don't collide
      const rows = []; // rows[i] = [{ startCol, endCol }]
      const placed = relevant.map(item => {
        let rowIdx = 0;
        for (let r = 0; r < rows.length; r++) {
          const hasOverlap = rows[r].some(
            c => !(item.endCol < c.startCol || item.startCol > c.endCol)
          );
          if (!hasOverlap) {
            rowIdx = r;
            break;
          }
          rowIdx = r + 1;
        }
        if (!rows[rowIdx]) rows[rowIdx] = [];
        rows[rowIdx].push({ startCol: item.startCol, endCol: item.endCol });
        return { ...item, rowIndex: rowIdx };
      });

      return { items: placed, rowCount: rows.length };
    });
  }, [weeks, campaigns]);

  // Max visible items per cell (campaigns + posts combined)
  const MAX_VISIBLE_ITEMS = 4;

  const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="month-view">
      {/* Day-of-week header row */}
      <div className="month-view__header-row">
        {DAY_NAMES.map(name => (
          <div key={name} className="month-view__header-cell">
            {name}
          </div>
        ))}
      </div>

      {/* Week rows */}
      <div className="month-view__body">
        {weeks.map((weekDays, weekIdx) => {
          const campaignData = campaignRowsByWeek[weekIdx];
          const campaignRowCount = campaignData.rowCount;

          return (
            <div key={weekIdx} className="month-view__week-row">
              {/* Campaign bars layer – absolutely positioned across week */}
              {campaignData.items.map((item, cIdx) => {
                const leftPct = (item.startCol / 7) * 100;
                const widthPct = (item.span / 7) * 100;
                // top offset: day-number row (~28px) + stacking
                const topOffset = 28 + item.rowIndex * 24;

                return (
                  <div
                    key={`c-${cIdx}`}
                    className="month-view__campaign-bar"
                    style={{
                      left: `calc(${leftPct}% + 2px)`,
                      width: `calc(${widthPct}% - 4px)`,
                      top: `${topOffset}px`,
                      backgroundColor: item.campaign.color || '#4A90E2',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenEditDialog) onOpenEditDialog(item.campaign);
                    }}
                    title={item.campaign.title || item.campaign.name}
                  >
                    <span className="month-view__campaign-title">
                      {item.campaign.title || item.campaign.name}
                    </span>
                  </div>
                );
              })}

              {/* Day cells */}
              {weekDays.map((day, dayIdx) => {
                const isCurrentMonth = day.getMonth() === month;
                const isTodayCell = isSameDay(day, today);
                const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                const dayPosts = postsByDay[dayKey] || [];

                // How many campaign bars cover this column?
                const campaignsInCol = campaignData.items.filter(
                  c => dayIdx >= c.startCol && dayIdx <= c.endCol
                ).length;

                // Items to show: reserve slots for campaigns, rest for posts
                const slotsUsedByCampaigns = campaignsInCol;
                const availablePostSlots = Math.max(0, MAX_VISIBLE_ITEMS - slotsUsedByCampaigns);
                const visiblePosts = dayPosts.slice(0, availablePostSlots);
                const overflowCount =
                  dayPosts.length - availablePostSlots > 0
                    ? dayPosts.length - availablePostSlots
                    : 0;

                return (
                  <div
                    key={dayIdx}
                    className={`month-view__day-cell ${!isCurrentMonth ? 'month-view__day-cell--outside' : ''} ${isTodayCell ? 'month-view__day-cell--today' : ''}`}
                    onClick={() => onDayClick && onDayClick(day)}
                  >
                    {/* Day number */}
                    <div className="month-view__day-number-row">
                      <span
                        className={`month-view__day-number ${isTodayCell ? 'month-view__day-number--today' : ''}`}
                      >
                        {day.getDate()}
                      </span>
                    </div>

                    {/* Spacer for campaign bars */}
                    {campaignRowCount > 0 && (
                      <div
                        className="month-view__campaign-spacer"
                        style={{ height: `${campaignRowCount * 24}px` }}
                      />
                    )}

                    {/* Posts */}
                    <div className="month-view__posts-list">
                      {visiblePosts.map(post => (
                        <div key={post.id} className="month-view__post-item">
                          <span className="month-view__post-time">
                            {formatTime(post.date)}
                          </span>
                          <PlatformIcon platform={post.profile?.platform} />
                          <span className="month-view__post-text">
                            {post.text || 'Untitled post'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Overflow */}
                    {overflowCount > 0 && (
                      <button
                        className="month-view__more-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDayClick) onDayClick(day);
                        }}
                      >
                        {overflowCount} more
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
