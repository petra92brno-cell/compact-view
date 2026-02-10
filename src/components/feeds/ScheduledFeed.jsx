import React from 'react';
import PostCard from '../design-system/PostCard/PostCard';
import PostsTable from './PostsTable';
import EmptyState from '../EmptyState';
import './ScheduledFeed.css';
import { scheduledPosts as sharedScheduledPosts } from '../../data/mockData';

const ScheduledFeed = ({ posts = [], userPosts = [], onAction, viewMode = 'default', filteredProfileIds = [], dateRange = null, selectedPostIds = new Set(), onPostSelection, onSelectAllCallbackRef, onTotalCountChange, onPostsChange, deletedPostIds = new Set() }) => {
  // Use shared mock data with dynamic dates (single source of truth)
  // Merge with user-created scheduled posts, then filter out deleted
  const userScheduledPosts = userPosts.filter(p => p.status === 'scheduled');
  const allPosts = [...(posts.length > 0 ? posts : sharedScheduledPosts), ...userScheduledPosts].filter(p => !deletedPostIds.has(p.id));

  // Helper function to parse date from post
  const parsePostDate = (dateString) => {
    // Format: "Nov 17, 2025 08:00"
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
  // Profile IDs match the format from ProfileGroupSelector: 'fakecosmetic-cz-fb', 'fakecosmetic-cz-ig', etc.
  const getProfileId = (post) => {
    const platform = post.profile.platform.toLowerCase();
    const name = post.profile.name.toLowerCase().replace(/\s+/g, '-');
    // Map FB to fb and IG to ig to match ProfileGroupSelector IDs
    const platformSuffix = platform === 'fb' ? 'fb' : 'ig';
    return `${name}-${platformSuffix}`;
  };

  const getBrandId = (post) => {
    const name = post.profile.name.toLowerCase().replace(/\s+/g, '-');
    return name;
  };

  // Filter by profile IDs
  let filteredPosts = filteredProfileIds.length > 0
    ? allPosts.filter(post => {
        const profileId = getProfileId(post);
        return filteredProfileIds.includes(profileId);
      })
    : allPosts;

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

  // Notify parent of total count and posts for calendar
  React.useEffect(() => {
    onTotalCountChange?.(filteredPosts.length);
    onPostsChange?.(allPosts);
  }, [filteredPosts.length, allPosts, onTotalCountChange, onPostsChange]);

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
          title="No scheduled posts" 
          description="You don't have any scheduled posts at the moment." 
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

export default ScheduledFeed;

