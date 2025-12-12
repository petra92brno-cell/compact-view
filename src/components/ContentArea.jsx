import React, { useState, useRef, useEffect } from 'react';
import ScheduledFeed from './feeds/ScheduledFeed';
import DraftsFeed from './feeds/DraftsFeed';
import Calendar from './Calendar';
import FilterPanel from './FilterPanel';
import BulkActionBar from './BulkActionBar';
import EmptyState from './EmptyState';
import CaretDownIcon from '../assets/Caret down.svg';
import './ContentArea.css';

const ContentArea = ({ activeTab }) => {
  const [viewMode, setViewMode] = useState('default');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [filteredProfileIds, setFilteredProfileIds] = useState([]);
  const [dateRange, setDateRange] = useState(null); // { startDate, endDate }
  const [selectedPostIds, setSelectedPostIds] = useState(new Set());
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [calendarPosts, setCalendarPosts] = useState([]);
  const selectAllCallbackRef = useRef(null);
  const viewDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
        setViewDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAction = (actionType, data) => {
    console.log('Action:', actionType, data);
    // Zde bude logika pro zpracování akcí
  };

  const handleViewChange = (view) => {
    setViewMode(view);
    setViewDropdownOpen(false);
  };

  const handleFilterChange = (filters) => {
    setFilteredProfileIds(filters.profiles || []);
    if (filters.startDate || filters.endDate) {
      setDateRange({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
    } else if (filters.startDate === null && filters.endDate === null) {
      // Clear date filter
      setDateRange(null);
    }
  };

  const handlePostSelection = (postId, isSelected) => {
    setSelectedPostIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };


  const handleDeselectAll = () => {
    setSelectedPostIds(new Set());
  };

      const renderFeed = () => {
        switch (activeTab) {
          case 'Calendar':
            return <Calendar posts={calendarPosts} />;
          case 'Scheduled':
            return (
              <ScheduledFeed 
                onAction={handleAction} 
                viewMode={viewMode} 
                filteredProfileIds={filteredProfileIds}
                dateRange={dateRange}
                selectedPostIds={selectedPostIds}
                onPostSelection={handlePostSelection}
                onSelectAllCallbackRef={selectAllCallbackRef}
                onTotalCountChange={setTotalPostsCount}
                onPostsChange={setCalendarPosts}
              />
            );
      case 'Waiting for approval':
        return <EmptyState title="No posts waiting for approval" description="All your posts have been approved or are ready to be published." />;
      case 'Rejected':
        return <EmptyState title="No rejected posts" description="All your posts have been approved or are ready to be published." />;
      case 'Publishing problems':
        return <EmptyState title="No publishing problems" description="All your posts are publishing successfully." />;
      case 'Assigned to me':
        return <EmptyState title="No posts assigned to you" description="You don't have any posts assigned to you at the moment." />;
      case 'Sent':
        return <EmptyState title="No sent posts" description="You haven't sent any posts yet." />;
      case 'Dark posts':
        return <EmptyState title="No dark posts" description="You don't have any dark posts at the moment." />;
      case 'Drafts':
        return (
          <DraftsFeed 
            onAction={handleAction} 
            viewMode={viewMode} 
            filteredProfileIds={filteredProfileIds}
            dateRange={dateRange}
            selectedPostIds={selectedPostIds}
            onPostSelection={handlePostSelection}
            onSelectAllCallbackRef={selectAllCallbackRef}
            onTotalCountChange={setTotalPostsCount}
          />
        );
      default:
        return <ScheduledFeed onAction={handleAction} />;
    }
  };

  return (
    <div className="content-area">
      {activeTab !== 'Calendar' && (
        <div className="content-area__header">
          <div className="content-area__header-left">
            <h2 className="content-area__title">
              {activeTab || 'Scheduled'}
            </h2>
          </div>
          <div className="content-area__header-right">
            <div className="content-area__view-dropdown" ref={viewDropdownRef}>
              <button
                className="content-area__view-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewDropdownOpen(!viewDropdownOpen);
                }}
                aria-expanded={viewDropdownOpen}
              >
                <span>{viewMode === 'default' ? 'Default view' : 'Compact view'}</span>
                <img 
                  src={CaretDownIcon} 
                  alt="" 
                  className={`content-area__view-arrow ${viewDropdownOpen ? 'content-area__view-arrow--open' : ''}`}
                />
              </button>
              {viewDropdownOpen && (
                <div className="content-area__view-menu">
                  <button
                    className={`content-area__view-option ${viewMode === 'default' ? 'content-area__view-option--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewChange('default');
                    }}
                  >
                    Default view
                  </button>
                  <button
                    className={`content-area__view-option ${viewMode === 'compact' ? 'content-area__view-option--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewChange('compact');
                    }}
                  >
                    Compact view
                  </button>
                </div>
              )}
            </div>
            <button className="content-area__create-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Create post</span>
            </button>
          </div>
        </div>
      )}
      <div className="content-area__body-wrapper">
        <div className={`content-area__body ${viewMode === 'compact' ? 'content-area__body--compact' : ''} ${activeTab === 'Calendar' ? 'content-area__body--calendar' : ''}`}>
          {renderFeed()}
        </div>
        {activeTab !== 'Calendar' && <FilterPanel onFilterChange={handleFilterChange} />}
      </div>
      <BulkActionBar
        selectedCount={selectedPostIds.size}
        totalCount={totalPostsCount}
        onSelectAll={() => {
          if (selectAllCallbackRef.current) {
            selectAllCallbackRef.current();
          }
        }}
        onClose={handleDeselectAll}
        onAddLabels={() => console.log('Add labels', Array.from(selectedPostIds))}
        onAssign={() => console.log('Assign', Array.from(selectedPostIds))}
        onInternalNotes={() => console.log('Internal notes', Array.from(selectedPostIds))}
        onRemove={() => {
          console.log('Remove', Array.from(selectedPostIds));
          handleDeselectAll();
        }}
      />
    </div>
  );
};

export default ContentArea;
