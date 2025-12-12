import React from 'react';
import PostCard from '../design-system/PostCard/PostCard';
import PostsTable from './PostsTable';
import EmptyState from '../EmptyState';
import './ScheduledFeed.css';

// Product images for drafts - kosmetické obrázky
const imageLipstick = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=540&h=350&fit=crop';
const imageSerum = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=540&h=350&fit=crop';
const imageEyeCream = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=540&h=350&fit=crop';
const imageGiftSet = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';
const imageFoundation = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';
const imageWinterLipstick = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=540&h=350&fit=crop';
const imageVitaminSerum = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=540&h=350&fit=crop';
const imageBodyCream = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=540&h=350&fit=crop';
const imageMetallicPalette = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';
const imageBeautyBox = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';

const DraftsFeed = ({ posts = [], onAction, viewMode = 'default', filteredProfileIds = [], dateRange = null, selectedPostIds = new Set(), onPostSelection, onSelectAllCallbackRef, onTotalCountChange }) => {
  // Mock data - 10 draft posts podle tabulky
  const allDrafts = posts.length > 0 ? posts : [
    // FakeCosmetic CZ - 4 drafty
    {
      id: 'draft-1',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 17, 2025 10:15',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Your autumn look starts with the lips 💄 Try our new shades inspired by warm fall tones.',
      media: {
        type: 'image',
        src: imageLipstick,
        alt: 'Autumn Lipstick'
      },
      status: 'draft'
    },
    {
      id: 'draft-2',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 18, 2025 14:40',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Dry skin in cold weather? Our hydrating face mist brings instant freshness and softness ✨.',
      media: {
        type: 'image',
        src: imageSerum,
        alt: 'Hydrating Face Mist'
      },
      status: 'draft'
    },
    {
      id: 'draft-3',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 20, 2025 09:30',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Eye creams that truly work — our new retinol line delivers visible results in just 7 days.',
      media: {
        type: 'image',
        src: imageEyeCream,
        alt: 'Eye Cream with Retinol'
      },
      status: 'draft'
    },
    {
      id: 'draft-4',
      profile: {
        name: 'FakeCosmetic CZ',
        url: '/fakecosmetic-cz',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 22, 2025 17:20',
      creator: {
        name: 'Klára Novotná',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Looking for the perfect gift for a beauty lover? Our mini sets are the ideal choice 🎁.',
      media: {
        type: 'image',
        src: imageGiftSet,
        alt: 'Beauty Gift Set'
      },
      status: 'draft'
    },
    // FakeCompany FR - 6 draftů
    {
      id: 'draft-5',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 17, 2025 11:00',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Commencez votre semaine avec un teint radieux ✨ Notre nouvelle base illuminatrice arrive bientôt !',
      media: {
        type: 'image',
        src: imageFoundation,
        alt: 'Illuminating Foundation'
      },
      status: 'draft'
    },
    {
      id: 'draft-6',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 18, 2025 18:15',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Rouges à lèvres d\'hiver ❄️ Des teintes profondes pour un look chic et sophistiqué.',
      media: {
        type: 'image',
        src: imageWinterLipstick,
        alt: 'Winter Lipstick'
      },
      status: 'draft'
    },
    {
      id: 'draft-7',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 19, 2025 13:20',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Prenez soin de votre peau avec notre sérum vitaminé — éclat instantané garanti 🍊.',
      media: {
        type: 'image',
        src: imageVitaminSerum,
        alt: 'Vitamin Serum'
      },
      status: 'draft'
    },
    {
      id: 'draft-8',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 21, 2025 10:45',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Un parfum doux, une hydratation intense 💛 Découvrez notre crème corps édition limitée.',
      media: {
        type: 'image',
        src: imageBodyCream,
        alt: 'Body Cream'
      },
      status: 'draft'
    },
    {
      id: 'draft-9',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'FB',
        avatar: null
      },
      date: 'Nov 22, 2025 19:00',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Pour un regard qui capte la lumière ✨ Notre nouvelle palette métallisée sera votre coup de cœur.',
      media: {
        type: 'image',
        src: imageMetallicPalette,
        alt: 'Metallic Palette'
      },
      status: 'draft'
    },
    {
      id: 'draft-10',
      profile: {
        name: 'FakeCompany FR',
        url: '/fakecompany-fr',
        platform: 'IG',
        avatar: null
      },
      date: 'Nov 23, 2025 16:20',
      creator: {
        name: 'Élodie Marceau',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      },
      text: 'Préparez vos cadeaux de fin d\'année 🎁 Nos coffrets beauté arrivent la semaine prochaine.',
      media: {
        type: 'image',
        src: imageBeautyBox,
        alt: 'Beauty Gift Box'
      },
      status: 'draft'
    }
  ];

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

