import React from 'react';
import './PostsTable.css';

const PostsTable = ({ posts, onAction, selectedPostIds = new Set(), onPostSelection, onSelectAll }) => {
  const getAvatarInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getProfileId = (post) => {
    const platform = post.profile.platform.toLowerCase();
    const name = post.profile.name.toLowerCase().replace(/\s+/g, '-');
    const platformSuffix = platform === 'fb' ? 'fb' : 'ig';
    return `${name}-${platformSuffix}`;
  };

  return (
    <div className="posts-table">
      <table className="posts-table__table">
        <thead>
          <tr>
            <th className="posts-table__header-checkbox">
              <input 
                type="checkbox" 
                className="posts-table__checkbox" 
                aria-label="Select all"
                checked={posts.length > 0 && posts.every(post => selectedPostIds.has(post.id))}
                onChange={(e) => {
                  if (e.target.checked) {
                    posts.forEach(post => onPostSelection?.(post.id, true));
                  } else {
                    posts.forEach(post => onPostSelection?.(post.id, false));
                  }
                }}
              />
            </th>
            <th className="posts-table__header-date">Date</th>
            <th className="posts-table__header-profile">Profile</th>
            <th className="posts-table__header-media">Media</th>
            <th className="posts-table__header-text">Text</th>
            <th className="posts-table__header-creator">Creator</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr 
              key={post.id} 
              className={`posts-table__row ${selectedPostIds.has(post.id) ? 'posts-table__row--selected' : ''}`}
            >
              <td className="posts-table__cell-checkbox">
                <input 
                  type="checkbox" 
                  className="posts-table__checkbox" 
                  aria-label="Select post"
                  checked={selectedPostIds.has(post.id)}
                  onChange={(e) => onPostSelection?.(post.id, e.target.checked)}
                />
              </td>
              <td className="posts-table__cell-date">
                {post.date}
              </td>
              <td className="posts-table__cell-profile">
                <div className="posts-table__profile">
                  <div className="posts-table__profile-info">
                    <div className="posts-table__profile-name">{post.profile.name}</div>
                    <div className="posts-table__profile-url">
                      <span className={`posts-table__platform-badge posts-table__platform-badge--${post.profile.platform.toLowerCase()}`}>
                        {post.profile.platform}
                      </span>
                      <span className="posts-table__url">{post.profile.url}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="posts-table__cell-media">
                {post.media && post.media.type === 'image' ? (
                  <div className="posts-table__media-image">
                    <img src={post.media.src} alt={post.media.alt || 'Post media'} />
                  </div>
                ) : (
                  <div className="posts-table__media-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                )}
              </td>
              <td className="posts-table__cell-text">
                <div className="posts-table__text">
                  {post.text}
                </div>
              </td>
              <td className="posts-table__cell-creator">
                {post.creator && (
                  <div className="posts-table__creator">
                    <span className="posts-table__creator-name">{post.creator.name}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsTable;

