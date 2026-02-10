import React from 'react';
import PostCard from '../design-system/PostCard/PostCard';
import PostsTable from './PostsTable';
import EmptyState from '../EmptyState';
import './ScheduledFeed.css';
import { draftPosts as sharedDraftPosts } from '../../data/mockData';

const DraftsFeed = ({ posts = [], userPosts = [], onAction, viewMode = 'default', filteredProfileIds = [], dateRange = null, selectedPostIds = new Set(), onPostSelection, onSelectAllCallbackRef, onTotalCountChange, deletedPostIds = new Set() }) => {
  // Use shared mock data with dynamic dates (single source of truth)
  // Merge with user-created draft posts, then filter out deleted
  const userDraftPosts = userPosts.filter(p => p.status === 'draft');
  const allDrafts = [...(posts.length > 0 ? posts : sharedDraftPosts), ...userDraftPosts].filter(p => !deletedPostIds.has(p.id));

  // Helper function to parse date from post
  const parsePostDate = (dateString) => {
    // Format: "Nov 17, 2025 10:15"
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
      
      return new Date(year, month, day, hours, minutes);
    }
    
    // Fallback to standard Date parsing
    return new Date(dateString);
  };

  // Filter posts by selected profile IDs
  const getProfileId = (post) => {
    const platform = post.profile.platform.toLowerCase();
    const name = post.profile.name.toLowerCase().replace(/\s+/g, '-');
    const platformSuffix = platform === 'fb' ? 'fb' : 'ig';
    return `${name}-${platformSuffix}`;
  };

  // Filter by profile IDs
  let filteredPosts = filteredProfileIds.length > 0
    ? allDrafts.filter(post => {
        const profileId = getProfileId(post);
        return filteredProfileIds.includes(profileId);
      })
    : allDrafts;

  // Filter by date range
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    filteredPosts = filteredPosts.filter(post => {
      const postDate = parsePostDate(post.date);
      // Compare only date part (ignore time)
      const postDateOnly = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
      const startDateOnly = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), dateRange.startDate.getDate());
      const endDateOnly = new Date(dateRange.endDate.getFullYear(), dateRange.endDate.getMonth(), dateRange.endDate.getDate());
      
      return postDateOnly >= startDateOnly && postDateOnly <= endDateOnly;
    });
  }

  // Notify parent of total count
  React.useEffect(() => {
    onTotalCountChange?.(filteredPosts.length);
  }, [filteredPosts.length, onTotalCountChange]);

  // Expose selectAll callback to parent via ref
  React.useEffect(() => {
    if (onSelectAllCallbackRef) {
      const allIds = filteredPosts.map(post => post.id);
      onSelectAllCallbackRef.current = () => {
        allIds.forEach(id => onPostSelection?.(id, true));
      };
    }
  }, [filteredPosts, onPostSelection, onSelectAllCallbackRef]);

  // Show empty state if no posts
  if (filteredPosts.length === 0) {
    return (
      <div className={`scheduled-feed scheduled-feed--${viewMode}`}>
        <EmptyState 
          title="No drafts" 
          description="You don't have any draft posts saved." 
        />
      </div>
    );
  }

  // Render table for compact view, cards for default view
  if (viewMode === 'compact') {
    return (
      <div className={`scheduled-feed scheduled-feed--${viewMode}`}>
        <PostsTable 
          posts={filteredPosts} 
          onAction={onAction}
          selectedPostIds={selectedPostIds}
          onPostSelection={onPostSelection}
          onSelectAll={() => {
            if (onSelectAllCallbackRef?.current) {
              onSelectAllCallbackRef.current();
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`scheduled-feed scheduled-feed--${viewMode}`}>
      <div className="scheduled-feed__container">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onAction={onAction}
            viewMode={viewMode}
            isSelected={selectedPostIds.has(post.id)}
            onSelectionChange={(isSelected) => onPostSelection?.(post.id, isSelected)}
          />
        ))}
      </div>
    </div>
  );
};

export default DraftsFeed;

