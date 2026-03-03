import React, { useState, useRef, useEffect } from 'react';
import ScheduledFeed from './feeds/ScheduledFeed';
import DraftsFeed from './feeds/DraftsFeed';
import CampaignsFeed from './feeds/CampaignsFeed';
import Calendar from './Calendar';
import FilterPanel from './FilterPanel';
import BulkActionBar from './BulkActionBar';
import EmptyState from './EmptyState';
import CaretDownIcon from '../assets/Caret down.svg';
import './ContentArea.css';

const ContentArea = ({ activeTab, onCreatePost, campaigns, onCampaignsChange, userPosts = [], deletedPostIds = new Set(), onDeletePost, navigateToDate, onNavigateComplete, mockScheduledPosts, mockDraftPosts, mockNotes }) => {
  const [viewMode, setViewMode] = useState('default');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [filteredProfileIds, setFilteredProfileIds] = useState([]);
  const [dateRange, setDateRange] = useState(null); // { startDate, endDate }
  const [selectedPostIds, setSelectedPostIds] = useState(new Set());
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [calendarPosts, setCalendarPosts] = useState(mockScheduledPosts || []);
  const [deleteConfirmPostId, setDeleteConfirmPostId] = useState(null);
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
    if (actionType === 'menu-action' && data.action === 'Delete') {
      setDeleteConfirmPostId(data.postId);
      return;
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmPostId && onDeletePost) {
      onDeletePost(deleteConfirmPostId);
    }
    setDeleteConfirmPostId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmPostId(null);
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
            return (
              <Calendar
                posts={calendarPosts}
                onCreatePost={onCreatePost}
                campaigns={campaigns}
                onCampaignsChange={onCampaignsChange}
                userPosts={userPosts}
                deletedPostIds={deletedPostIds}
                navigateToDate={navigateToDate}
                onNavigateComplete={onNavigateComplete}
                notes={mockNotes || []}
              />
            );
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
                userPosts={userPosts}
                deletedPostIds={deletedPostIds}
                posts={mockScheduledPosts || []}
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
            userPosts={userPosts}
            deletedPostIds={deletedPostIds}
            posts={mockDraftPosts || []}
          />
        );
      case 'Campaigns':
        return (
          <CampaignsFeed
            campaigns={campaigns}
            onCampaignsChange={onCampaignsChange}
            userPosts={userPosts}
            deletedPostIds={deletedPostIds}
            mockPosts={mockScheduledPosts}
          />
        );
      default:
        return <ScheduledFeed onAction={handleAction} />;
    }
  };

  return (
    <div className="content-area">
      {activeTab !== 'Calendar' && activeTab !== 'Campaigns' && (
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
            <button className="content-area__create-button" onClick={onCreatePost}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Create post</span>
            </button>
          </div>
        </div>
      )}
      <div className="content-area__body-wrapper">
        <div className={`content-area__body ${viewMode === 'compact' ? 'content-area__body--compact' : ''} ${activeTab === 'Calendar' ? 'content-area__body--calendar' : ''} ${activeTab === 'Campaigns' ? 'content-area__body--campaigns' : ''}`}>
          {renderFeed()}
        </div>
        {activeTab !== 'Calendar' && activeTab !== 'Campaigns' && <FilterPanel onFilterChange={handleFilterChange} />}
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

      {/* Delete confirmation modal */}
      {deleteConfirmPostId && (
        <div className="delete-confirm-overlay" onClick={handleCancelDelete}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="delete-confirm-modal__title">Delete post?</h3>
            <p className="delete-confirm-modal__description">This action cannot be undone.</p>
            <div className="delete-confirm-modal__actions">
              <button className="delete-confirm-modal__btn delete-confirm-modal__btn--cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-confirm-modal__btn delete-confirm-modal__btn--delete" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentArea;
