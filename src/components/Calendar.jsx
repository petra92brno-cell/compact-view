import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './Calendar.css';
import CampaignIcon from '../assets/Publisher.svg';
import NoteIcon from '../assets/Internal note.svg';
import CampaignDialog from './CampaignDialog';
import MonthView from './MonthView';
import Snackbar from './Snackbar';

// Create Campaign Button Component
const CreateCampaignButton = ({ date, onOpenDialog }) => {
  const handleClick = () => {
    if (onOpenDialog) {
      onOpenDialog(date);
    }
  };

  return (
    <button
      className="calendar__create-campaign-btn"
      onClick={handleClick}
    >
      Create campaigns
    </button>
  );
};

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

// Helper function to check if date is within range
const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return d >= start && d <= end;
};

// Helper function to get campaigns for a specific day
const getCampaignsForDay = (campaigns, date) => {
  return campaigns.filter(campaign => {
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return isDateInRange(date, startDate, endDate);
  });
};

// Helper function to get notes for a specific day
const getNotesForDay = (notes, date) => {
  return notes.filter(note => {
    const noteDate = new Date(note.date);
    return noteDate.toDateString() === date.toDateString();
  });
};

// Campaign Bar Component - silnější, s ikonou
const CampaignBar = ({ campaign, weekDates }) => {
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  
  const startCol = weekDates.findIndex(d => d.toDateString() === startDate.toDateString());
  const endCol = weekDates.findIndex(d => d.toDateString() === endDate.toDateString());
  
  if (startCol === -1 && endCol === -1) return null;
  
  const actualStartCol = startCol === -1 ? 0 : startCol;
  const actualEndCol = endCol === -1 ? weekDates.length - 1 : endCol;
  const span = actualEndCol - actualStartCol + 1;
  
  return (
    <div 
      className="calendar-campaign"
      style={{
        gridColumn: `${actualStartCol + 2} / span ${span}`,
        backgroundColor: campaign.color || '#4A90E2',
      }}
    >
      <div className="calendar-campaign__content">
        <div className="calendar-campaign__icon-wrapper">
          <img src={CampaignIcon} alt="Campaign" className="calendar-campaign__icon" />
        </div>
        <div className="calendar-campaign__text">
          <div className="calendar-campaign__title">{campaign.title}</div>
          {campaign.description && (
            <div className="calendar-campaign__description">{campaign.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Note Card Component - tenčí, kompaktnější, s ikonou
const NoteCard = ({ note }) => {
  return (
    <div 
      className="calendar-note"
      style={{
        borderColor: note.color || '#F6D84E',
        borderLeftColor: note.color || '#F6D84E',
      }}
    >
      <div className="calendar-note__text">{note.text}</div>
    </div>
  );
};

// Campaign Bar in Cell - spanuje přes více dnů podle Figma designu
const CampaignBarInCell = ({ campaign, weekDates, startCol, span, extendsBeyondWeek = false }) => {
  if (startCol === -1 || span < 1) return null;
  
  // Vypočítáme šířku na základě počtu sloupců
  // Každá buňka má padding 6px na každé straně
  // Border mezi buňkami je 1px
  const cellWidthPercent = 100 / 7; // 7 dní v týdnu
  
  // Šířka = procento šířky * počet sloupců - padding z obou stran + border mezi sloupci
  const widthPercent = span * cellWidthPercent;
  const paddingAdjustment = 12; // 6px padding na každé straně první buňky
  const borderWidth = (span - 1) * 1; // border mezi sloupci
  
  // Pokud kampaně přesahuje týden, použijeme zelenou barvu a ostrý konec
  const backgroundColor = extendsBeyondWeek ? '#4CAF50' : (campaign.color || '#2196f3');
  const className = extendsBeyondWeek 
    ? 'calendar-campaign-bar calendar-campaign-bar--extends-beyond' 
    : 'calendar-campaign-bar';
  
  return (
    <div 
      className={className}
      style={{ 
        backgroundColor: backgroundColor,
        width: `calc(${widthPercent}% - ${paddingAdjustment}px + ${borderWidth}px)`,
        height: '27px',
      }}
    >
      <div className="calendar-campaign-bar__content">
        <div className="calendar-campaign-bar__title">{campaign.title}</div>
      </div>
      {extendsBeyondWeek && (
        <div className="calendar-campaign-bar__arrow"></div>
      )}
    </div>
  );
};

// Campaign Bar Absolute - zobrazen jako all-day event přes celou šířku
const CampaignBarAbsolute = ({ campaign, startCol, span, extendsBeyondWeek = false, startsBefore = false, rowIndex = 0, onClick }) => {
  if (startCol === -1 || span < 1) return null;
  
  const cellWidthPercent = 100 / 7; // 7 dní v týdnu
  const leftPercent = startCol * cellWidthPercent;
  const widthPercent = span * cellWidthPercent;
  
  // Always use the campaign's own color
  const backgroundColor = campaign.color || '#2196f3';
  
  // Build className based on overflow state
  let className = 'calendar-campaign-bar-absolute';
  if (extendsBeyondWeek) className += ' calendar-campaign-bar-absolute--extends-beyond';
  if (startsBefore) className += ' calendar-campaign-bar-absolute--starts-before';
  
  // Offset pro více kampaní ve stejném období (stacking)
  const topOffset = rowIndex * 32; // 27px height + 5px margin
  
  return (
    <div 
      className={className}
      style={{ 
        backgroundColor: backgroundColor,
        left: `calc(${leftPercent}% + ${startsBefore ? '0px' : '3px'})`,
        width: `calc(${widthPercent}% - ${startsBefore && extendsBeyondWeek ? '0px' : startsBefore || extendsBeyondWeek ? '3px' : '6px'})`,
        top: `${topOffset}px`,
        height: '27px',
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(campaign);
      }}
    >
      <div className="calendar-campaign-bar-absolute__content">
        <div className="calendar-campaign-bar-absolute__title">{campaign.title}</div>
      </div>
      {extendsBeyondWeek && (
        <div className="calendar-campaign-bar-absolute__arrow" style={{ borderLeftColor: backgroundColor }}></div>
      )}
    </div>
  );
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

const Calendar = ({ posts = [], campaigns = [], notes = [], userPosts = [], deletedPostIds = new Set(), onCreatePost, onCampaignsChange, navigateToDate, onNavigateComplete }) => {
  // Default to today so the calendar always shows the current week
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('week'); // 'month', 'week', 'day'
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Use campaigns from props (shared state from App.jsx) with setter from parent
  const setDynamicCampaigns = onCampaignsChange || (() => {});

  // Snackbar state
  const [snackbar, setSnackbar] = useState(null); // { type: 'success' | 'error', message, campaignData? }

  // Store last campaign data for error "Go back" flow
  const [lastCampaignData, setLastCampaignData] = useState(null);

  // Dialog pre-fill data (for error "Go back" flow)
  const [dialogInitialData, setDialogInitialData] = useState(null);

  // Edit mode state
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [editingCampaign, setEditingCampaign] = useState(null);

  const handleOpenDialog = (date) => {
    setSelectedDate(date);
    setDialogInitialData(null);
    setDialogMode('create');
    setEditingCampaign(null);
    setIsDialogOpen(true);
  };

  // Open edit dialog for an existing campaign
  const handleOpenEditDialog = useCallback((campaign) => {
    setDialogMode('edit');
    setEditingCampaign({
      id: campaign.id,
      name: campaign.name || campaign.title,
      color: campaign.color,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      uniqueId: campaign.uniqueId || '',
      labels: campaign.labels || [],
      briefContent: campaign.briefContent || '',
    });
    setDialogInitialData(null);
    setSelectedDate(null);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDate(null);
    setDialogInitialData(null);
    setDialogMode('create');
    setEditingCampaign(null);
  };

  // Navigate to the week containing a given date
  const navigateToWeek = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(d);
    weekStart.setDate(diff);
    setCurrentDate(weekStart);
  }, []);

  // Handle campaign creation from dialog
  const handleCreateCampaign = useCallback((campaignData) => {
    const newCampaign = {
      id: Date.now(),
      title: campaignData.name,
      name: campaignData.name,
      description: '',
      startDate: new Date(campaignData.startDate),
      endDate: new Date(campaignData.endDate),
      color: campaignData.color,
      uniqueId: campaignData.uniqueId || '',
      labels: campaignData.labels || [],
      briefContent: campaignData.briefContent || '',
    };

    // Store data for potential error "Go back" flow
    setLastCampaignData(campaignData);

    // Add campaign to state
    setDynamicCampaigns(prev => [...prev, newCampaign]);

    // Close dialog
    setIsDialogOpen(false);
    setSelectedDate(null);
    setDialogInitialData(null);

    // Navigate to the week of the start date
    navigateToWeek(campaignData.startDate);

    // Show success snackbar
    setSnackbar({ type: 'success', message: 'Campaign was created successfully.' });
  }, [navigateToWeek]);

  // Handle campaign save (edit mode)
  const handleSaveCampaign = useCallback((campaignData) => {
    setDynamicCampaigns(prev =>
      prev.map(c =>
        c.id === campaignData.id
          ? {
              ...c,
              title: campaignData.name,
              name: campaignData.name,
              color: campaignData.color,
              startDate: new Date(campaignData.startDate),
              endDate: new Date(campaignData.endDate),
              uniqueId: campaignData.uniqueId,
              labels: campaignData.labels,
              briefContent: campaignData.briefContent,
            }
          : c
      )
    );

    // Close dialog
    setIsDialogOpen(false);
    setSelectedDate(null);
    setDialogInitialData(null);
    setDialogMode('create');
    setEditingCampaign(null);

    // Navigate to the week of the start date
    navigateToWeek(campaignData.startDate);

    // Show success snackbar
    setSnackbar({ type: 'success', message: 'Campaign was saved successfully.' });
  }, [navigateToWeek]);

  // Handle campaign delete (edit mode)
  const handleDeleteCampaign = useCallback((campaignId) => {
    setDynamicCampaigns(prev => prev.filter(c => c.id !== campaignId));

    // Close dialog
    setIsDialogOpen(false);
    setSelectedDate(null);
    setDialogInitialData(null);
    setDialogMode('create');
    setEditingCampaign(null);

    // Show snackbar
    setSnackbar({ type: 'success', message: 'Campaign was deleted.' });
  }, []);

  // Handle snackbar dismiss
  const handleSnackbarDismiss = useCallback(() => {
    setSnackbar(null);
  }, []);

  // Handle error snackbar "Go back" — reopen dialog with pre-filled data
  const handleErrorGoBack = useCallback(() => {
    setSnackbar(null);
    if (lastCampaignData) {
      setDialogInitialData(lastCampaignData);
      setSelectedDate(lastCampaignData.startDate);
      setIsDialogOpen(true);
    }
  }, [lastCampaignData]);

  // Demo function to trigger error snackbar (can be called from console: window.__showCampaignError())
  useEffect(() => {
    window.__showCampaignError = () => {
      setSnackbar({ type: 'error', message: 'Error occurred. Campaign not created.' });
    };
    return () => { delete window.__showCampaignError; };
  }, []);

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

  // Merge scheduled posts with user-created posts
  const displayPosts = useMemo(() => {
    return [...posts, ...userPosts].filter(p => !deletedPostIds.has(p.id));
  }, [posts, userPosts, deletedPostIds]);
  // Campaigns ALWAYS come from props (shared state in App.jsx) — no local fallback
  const displayCampaigns = campaigns;

  // Helper: resolve campaign color for a post from the shared campaigns array.
  // Supports both post.campaign (full object from CreatePost) and post.campaignId (from mock data).
  // Always reads the latest color from the campaigns array so edits to campaign colors are reflected.
  const getCampaignColorForPost = (post) => {
    const id = post.campaignId ?? (post.campaign && post.campaign.id);
    if (id == null) return null;
    const found = campaigns.find(c => c.id === id);
    return found ? found.color : (post.campaign ? post.campaign.color : null);
  };
  const displayNotes = notes;

  // Navigate to a specific date when navigateToDate prop changes (e.g. after post creation)
  useEffect(() => {
    if (navigateToDate) {
      navigateToWeek(navigateToDate);
      onNavigateComplete?.();
    }
  }, [navigateToDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigate to previous period (month or week depending on viewMode)
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period (month or week depending on viewMode)
  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format header date label based on view mode
  const getHeaderDateLabel = () => {
    if (viewMode === 'month') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    return formatDateRange(weekDates[0], weekDates[6]);
  };

  // Handle clicking a day in MonthView → navigate to that day's week
  const handleMonthDayClick = useCallback((day) => {
    navigateToWeek(day);
    setViewMode('week');
  }, [navigateToWeek]);

  return (
    <div className="calendar">
      {/* Calendar Header - hidden when dialog is open */}
      {!isDialogOpen && (
        <div className="calendar__header">
        <div className="calendar__header-left">
          <button className="calendar__today-button" onClick={goToToday}>
            Today
          </button>
          <div className="calendar__navigation">
            <button className="calendar__nav-button" onClick={goToPrevious}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L7 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="calendar__date-range">
              {getHeaderDateLabel()}
            </span>
            <button className="calendar__nav-button" onClick={goToNext}>
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
          <button
            className="calendar__create-post-button"
            onClick={() => onCreatePost && onCreatePost()}
          >
            + Create post
          </button>
        </div>
        </div>
      )}

      {/* Campaign Dialog or Calendar Grid */}
      {isDialogOpen ? (
        <CampaignDialog 
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          selectedDate={selectedDate}
          onCreateCampaign={handleCreateCampaign}
          onSaveCampaign={handleSaveCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          initialData={dialogInitialData}
          mode={dialogMode}
          campaignData={editingCampaign}
        />
      ) : viewMode === 'month' ? (
        <MonthView
          currentDate={currentDate}
          posts={displayPosts}
          campaigns={displayCampaigns}
          onDayClick={handleMonthDayClick}
          onOpenEditDialog={handleOpenEditDialog}
        />
      ) : (
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

        {/* Campaigns Container - all campaigns visible at once like Google Calendar */}
        {(() => {
          // Helper: check if two dates are the same calendar day
          const isSameDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

          const weekStart = new Date(weekDates[0]);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekDates[weekDates.length - 1]);
          weekEnd.setHours(23, 59, 59, 999);

          // Group campaigns by overlapping periods and assign row indices
          const campaignRows = [];
          const processedCampaigns = displayCampaigns.map((campaign, index) => {
            const cStart = new Date(campaign.startDate);
            cStart.setHours(0, 0, 0, 0);
            const cEnd = new Date(campaign.endDate);
            cEnd.setHours(23, 59, 59, 999);
            
            // Check if campaign overlaps with week
            if (cEnd < weekStart || cStart > weekEnd) {
              return null;
            }
            
            // Check if campaign extends beyond the week
            const extendsBeyondWeek = cEnd > weekEnd;
            const startsBefore = cStart < weekStart;
            
            // Clamp to week boundaries for column calculation (same as MonthView)
            const visStart = cStart < weekStart ? weekStart : cStart;
            const visEnd = cEnd > weekEnd ? weekEnd : cEnd;
            
            // Find columns using clamped dates with isSameDay
            const startCol = weekDates.findIndex(d => isSameDay(d, visStart));
            const endCol = weekDates.findIndex(d => isSameDay(d, visEnd));
            
            // Calculate actual columns with fallback
            const actualStartCol = startCol === -1 ? 0 : startCol;
            const actualEndCol = endCol === -1 ? weekDates.length - 1 : endCol;
            const span = actualEndCol - actualStartCol + 1;
            
            // Find appropriate row (check for overlaps)
            let rowIndex = 0;
            for (let row = 0; row < campaignRows.length; row++) {
              const hasOverlap = campaignRows[row].some(c => {
                return !(actualEndCol < c.startCol || actualStartCol > c.endCol);
              });
              if (!hasOverlap) {
                rowIndex = row;
                break;
              }
              rowIndex = row + 1;
            }
            
            // Add to campaign rows
            if (!campaignRows[rowIndex]) {
              campaignRows[rowIndex] = [];
            }
            campaignRows[rowIndex].push({ startCol: actualStartCol, endCol: actualEndCol });
            
            return {
              campaign,
              startCol: actualStartCol,
              span,
              extendsBeyondWeek,
              startsBefore,
              rowIndex
            };
          }).filter(Boolean);
          
          const maxRows = campaignRows.length;
          const contentHeight = Math.max(27, maxRows * 32);
          const containerHeight = contentHeight + 30; // Add 30px for padding-bottom
          
          // Calculate which days have campaigns (for showing/hiding create button)
          const daysWithCampaigns = new Set();
          processedCampaigns.forEach(item => {
            for (let col = item.startCol; col < item.startCol + item.span; col++) {
              daysWithCampaigns.add(col);
            }
          });
          
          return (
            <div className="calendar__campaigns-container">
              <div className="calendar__row calendar__row--campaigns" style={{ minHeight: `${containerHeight}px` }}>
                <div className="calendar__time-column">
                  <div className="calendar__time-label calendar__time-label--campaigns">CAMPAING</div>
                </div>
                <div className="calendar__campaigns-grid">
                  {weekDates.map((date, index) => {
                    const isCurrentDay = isToday(date);
                    return (
                    <div 
                      key={index} 
                      className={`calendar__campaign-cell ${isCurrentDay ? 'calendar__campaign-cell--today' : ''}`}
                    >
                      <CreateCampaignButton date={date} onOpenDialog={handleOpenDialog} />
                    </div>
                    );
                  })}
                  {/* Render all campaigns as absolutely positioned bars */}
                  {processedCampaigns.map((item, index) => (
                    <CampaignBarAbsolute 
                      key={index}
                      campaign={item.campaign} 
                      startCol={item.startCol}
                      span={item.span}
                      extendsBeyondWeek={item.extendsBeyondWeek}
                      startsBefore={item.startsBefore}
                      rowIndex={item.rowIndex}
                      onClick={handleOpenEditDialog}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Notes Container - same structure as Campaigns */}
        {(() => {
          // Group notes by day column
          const notesByCol = {};
          weekDates.forEach((date, colIndex) => {
            notesByCol[colIndex] = getNotesForDay(displayNotes, date);
          });
          
          // Find the max number of stacked notes in any column
          const maxNotesInDay = Math.max(1, ...Object.values(notesByCol).map(n => n.length));
          const noteHeight = 24; // height of one note card
          const noteGap = 4; // gap between stacked notes
          const containerHeight = Math.max(28, maxNotesInDay * noteHeight + (maxNotesInDay - 1) * noteGap);
          
          return (
            <div className="calendar__notes-container">
              <div className="calendar__row calendar__row--notes-grid" style={{ height: `${containerHeight}px` }}>
                <div className="calendar__time-column">
                  <div className="calendar__time-label calendar__time-label--notes">NOTES</div>
                </div>
                <div className="calendar__notes-grid">
                  {weekDates.map((date, colIndex) => {
                    const isCurrentDay = isToday(date);
                    return (
                    <div key={colIndex} className={`calendar__note-cell ${isCurrentDay ? 'calendar__note-cell--today' : ''}`}>
                      {/* Notes stacked within each day column */}
                      {notesByCol[colIndex].map((note, noteIndex) => (
                        <div
                          key={note.id}
                          className="calendar-note-absolute"
                          style={{
                            top: `${noteIndex * (noteHeight + noteGap)}px`,
                            borderColor: note.color || '#F6D84E',
                            borderLeftColor: note.color || '#F6D84E',
                          }}
                        >
                          <div className="calendar-note-absolute__text">{note.text}</div>
                        </div>
                      ))}
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Hour Rows */}
        {hours.map((hour) => (
          <div key={hour} className="calendar__row calendar__row--hour">
            <div className="calendar__time-column">
              <div className="calendar__time-label">{formatHour(hour)}</div>
            </div>
            {weekDates.map((date, dateIndex) => {
              const dayPosts = getPostsForTimeSlot(displayPosts, date, hour);
              const isCurrentDay = isToday(date);
              const isLast = dateIndex === weekDates.length - 1;
              
              return (
                <div 
                  key={dateIndex} 
                  className={`calendar__cell ${isCurrentDay ? 'calendar__cell--today' : ''} ${isLast ? 'calendar__cell--last' : ''}`}
                >
                  {dayPosts.map((post) => {
                    const campaignColor = getCampaignColorForPost(post);
                    return (
                    <div
                      key={post.id}
                      className={`calendar-post${campaignColor ? ' calendar-post--has-campaign' : ''}`}
                      style={campaignColor ? { borderColor: campaignColor } : undefined}
                    >
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
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      )}

      {/* Snackbar for campaign creation feedback */}
      {snackbar && (
        <Snackbar
          type={snackbar.type}
          message={snackbar.message}
          onDismiss={handleSnackbarDismiss}
          onGoBack={snackbar.type === 'error' ? handleErrorGoBack : undefined}
        />
      )}
    </div>
  );
};

export default Calendar;
