import React from 'react';
import PostCard from '../design-system/PostCard/PostCard';
import PostsTable from './PostsTable';
import EmptyState from '../EmptyState';
import './ScheduledFeed.css';

// Image 3: Eyeshadow Palette - kosmetický obrázek
const imagePalette = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';

// Product images - fallback URLs for other images
// Image 1: Lipstick
const imageLipstick = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=540&h=350&fit=crop';

// Image 2: Facial Serum  
const imageSerum = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=540&h=350&fit=crop';

// Image 4: Nourishing Face Cream
const imageCream = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';

const ScheduledFeed = ({ posts = [], onAction, viewMode = 'default', filteredProfileIds = [], dateRange = null, selectedPostIds = new Set(), onPostSelection, onSelectAllCallbackRef, onTotalCountChange, onPostsChange }) => {
  // Mock data - příští týden 17-23.11.2025 (pondělí-pátek)
  // 17.11 = Monday, 18.11 = Tuesday, 19.11 = Wednesday, 20.11 = Thursday, 21.11 = Friday
  const allPosts = posts.length > 0 ? posts : [
    // Monday 17.11 - 2 posty
    {
      id: '1',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 17, 2025 08:00',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Let your natural beauty shine ✨ Our new lipstick shades bring confidence to every smile.',
      badges: [
        { type: 'draft', label: 'Draft' },
        { type: 'default', label: 'Multipost', count: '12' },
        { type: 'default', label: 'Story' },
        { type: 'default', label: 'LIB' }
      ],
      comments: { count: 2 },
      media: {
        type: 'image',
        src: imageLipstick,
        alt: 'Lipstick'
      },
      status: 'scheduled'
    },
    {
      id: '2',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 17, 2025 14:30',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'New lipstick tones for a new season 💋 Which one will be yours?',
      badges: [
        { type: 'draft', label: 'Draft' },
        { type: 'default', label: 'Multipost' },
        { type: 'default', label: 'Story' },
        { type: 'default', label: 'LIB' }
      ],
      media: {
        type: 'image',
        src: imageLipstick,
        alt: 'Lipstick'
      },
      status: 'scheduled'
    },
    // Tuesday 18.11 - 1 post
    {
      id: '3',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 18, 2025 09:15',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Give your skin the hydration it deserves. Our serum keeps your glow all day long.',
      media: {
        type: 'image',
        src: imageSerum,
        alt: 'Facial Serum'
      },
      status: 'scheduled'
    },
    // Wednesday 19.11 - 2 posty
    {
      id: '4',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 19, 2025 10:00',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Hydrate, glow, repeat ✨ Winter skin has a new best friend.',
      media: {
        type: 'image',
        src: imageSerum,
        alt: 'Facial Serum'
      },
      status: 'scheduled'
    },
    {
      id: '5',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 19, 2025 16:00',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Découvrez notre nouvelle palette d\'ombres ✨ Parfaite pour un look doux ou glamour.',
      media: {
        type: 'image',
        src: imagePalette,
        alt: 'Eyeshadow Palette'
      },
      status: 'scheduled'
    },
    // Thursday 20.11 - 2 posty
    {
      id: '6',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 20, 2025 08:30',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Une palette, mille possibilités 🎨 Quel look allez-vous créer aujourd\'hui ?',
      media: {
        type: 'image',
        src: imagePalette,
        alt: 'Eyeshadow Palette'
      },
      status: 'scheduled'
    },
    {
      id: '7',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 20, 2025 13:45',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Offrez à votre peau l\'hydratation ultime 💛 Notre crème nourrissante est un must-have.',
      media: {
        type: 'image',
        src: imageCream,
        alt: 'Nourishing Face Cream'
      },
      status: 'scheduled'
    },
    // Friday 21.11 - 1 post
    {
      id: '8',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 21, 2025 11:00',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Texture soyeuse, éclat garanti ✨ Votre peau va adorer.',
      media: {
        type: 'image',
        src: imageCream,
        alt: 'Nourishing Face Cream'
      },
      status: 'scheduled'
    }
  ];

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

