import { useState, useEffect, useCallback } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MiddleSidebar from './components/MiddleSidebar';
import ContentArea from './components/ContentArea';
import CreatePost from './components/CreatePost';
import Snackbar from './components/Snackbar';
import { mockCampaigns as initialCampaigns } from './data/mockData';
import {
  mercedesCampaigns as initialMercedesCampaigns,
  mercedesScheduledPosts,
  mercesDraftPosts,
  mercedesNotes,
  MERCEDES_PROFILES,
  MERCEDES_PROFILE_MAP,
  MERCEDES_LABEL_DATA,
  MERCEDES_LABEL_GROUPS,
  MERCEDES_BRAND_GROUPS,
  MERCEDES_MOCK_IMAGES,
} from './data/mockDataMercedes';
import { ClientConfigContext } from './contexts/ClientConfigContext';
import './App.css';

const VERSION_STORAGE_KEY = 'compact-view-prototype-version';

function App() {
  const [activeVersion, setActiveVersion] = useState(() => {
    return sessionStorage.getItem(VERSION_STORAGE_KEY) || 'v1';
  });
  const [activeTab, setActiveTab] = useState('Calendar');
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'createPost'

  const handleVersionChange = useCallback((versionId) => {
    setActiveVersion(versionId);
    sessionStorage.setItem(VERSION_STORAGE_KEY, versionId);
  }, []);

  // Shared campaign state — single source of truth for Calendar + CreatePost
  // Initialise with the correct dataset for the current version
  const [campaigns, setCampaigns] = useState(() =>
    sessionStorage.getItem(VERSION_STORAGE_KEY) === 'mercedes'
      ? initialMercedesCampaigns
      : initialCampaigns
  );

  // When switching versions, reset campaigns to the appropriate dataset
  useEffect(() => {
    if (activeVersion === 'mercedes') {
      setCampaigns(initialMercedesCampaigns);
    } else {
      setCampaigns(initialCampaigns);
    }
  }, [activeVersion]);

  // Shared user-created posts — single source of truth for Calendar + Feeds
  const [userPosts, setUserPosts] = useState([]);

  // Track deleted post IDs (works for both mock and user-created posts)
  const [deletedPostIds, setDeletedPostIds] = useState(new Set());

  // Navigate calendar to a specific date after post creation
  const [navigateToDate, setNavigateToDate] = useState(null);

  // App-level snackbar for post creation feedback
  const [snackbar, setSnackbar] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentView('main');
  };

  const handleCreatePost = () => {
    setCurrentView('createPost');
  };

  const handleBackFromCreatePost = () => {
    setCurrentView('main');
  };

  // Handle post creation from CreatePost form
  const handlePostCreate = useCallback((postData) => {
    // postData: { posts: [...], action: 'publish'|'schedule'|'draft', dateTime: Date }
    setUserPosts(prev => [...prev, ...postData.posts]);

    // Switch back to calendar view
    setCurrentView('main');
    setActiveTab('Calendar');

    // Navigate calendar to the post's date
    setNavigateToDate(new Date(postData.dateTime));

    // Show snackbar
    let message;
    if (postData.action === 'draft') {
      message = 'Post saved as draft.';
    } else if (postData.action === 'publish') {
      message = 'Post published successfully.';
    } else {
      message = 'Post scheduled successfully.';
    }
    setSnackbar({ type: 'success', message });
  }, []);

  // Handle post deletion
  const handleDeletePost = useCallback((postId) => {
    // Remove from user-created posts if it exists there
    setUserPosts(prev => prev.filter(p => p.id !== postId));
    // Add to deleted IDs set (handles mock posts too)
    setDeletedPostIds(prev => new Set([...prev, postId]));
    // Show snackbar
    setSnackbar({ type: 'success', message: 'Post deleted.' });
  }, []);

  const handleSnackbarDismiss = useCallback(() => {
    setSnackbar(null);
  }, []);

  const handleNavigateComplete = useCallback(() => {
    setNavigateToDate(null);
  }, []);

  // Detect unsaved changes for beforeunload warning
  const hasUnsavedChanges = userPosts.length > 0 || deletedPostIds.size > 0 || campaigns !== initialCampaigns;

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Make Resources text red in footer
  useEffect(() => {
    const styleResourcesText = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const h3Elements = footer.querySelectorAll('h3');
        h3Elements.forEach((h3) => {
          if (h3.textContent.trim() === 'Resources') {
            h3.style.color = 'red';
          }
        });
      }
    };

    // Run immediately
    styleResourcesText();

    // Also run after a short delay to catch dynamically rendered content
    const timeoutId = setTimeout(styleResourcesText, 100);

    // Use MutationObserver to watch for DOM changes
    const observer = new MutationObserver(styleResourcesText);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Placeholder design area for versions other than v1 (Campaign Creation)
  const renderPlaceholderDesignArea = (versionLabel) => (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f8f9fa] text-gray-500 font-sans">
      <div className="text-center max-w-md px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-2">
          Design area
        </p>
        <p className="text-lg font-semibold text-gray-700 mb-2">{versionLabel}</p>
        <p className="text-sm text-gray-500">
          Tady můžeš pracovat na designu této verze bez vlivu na ostatní záložky.
        </p>
      </div>
    </div>
  );

  const versionLabels = {
    v1_new_month_week: 'v1_new month and week view',
    v1_share: 'v1_share',
    v1_collection: 'v1_collection',
  };

  const isCampaignCreationVersion = activeVersion === 'v1';
  const isMercedesVersion = activeVersion === 'mercedes';
  const isFullAppVersion = isCampaignCreationVersion || isMercedesVersion;

  // Client-specific config — also provided via context for deep components (ContentLabelsDropdown)
  const clientConfig = isMercedesVersion
    ? {
        mockScheduledPosts: mercedesScheduledPosts,
        mockDraftPosts: mercesDraftPosts,
        mockNotes: mercedesNotes,
        availableProfiles: MERCEDES_PROFILES,
        profileMap: MERCEDES_PROFILE_MAP,
        labelData: MERCEDES_LABEL_DATA,
        labelGroups: MERCEDES_LABEL_GROUPS,
        brandGroups: MERCEDES_BRAND_GROUPS,
        mockImages: MERCEDES_MOCK_IMAGES,
        defaultUtmSettings: {
          linkTrackingEnabled: true,
          utmSourceMode: 'social-channel-id',
          utmSourceValue: '',
          utmSourceEnabled: true,
          utmMediumMode: 'asset-id',
          utmMediumValue: '',
          utmMediumEnabled: true,
          utmCampaignMode: 'custom',
          utmCampaignValue: '{campaign-id}_UTM_kls{unique-id}',
          utmCampaignEnabled: true,
          utmContentMode: 'none',
          utmContentValue: '',
          utmContentEnabled: false,
        },
      }
    : null;

  return (
    <ClientConfigContext.Provider value={clientConfig}>
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <LeftSidebar
        activeVersion={activeVersion}
        onVersionChange={handleVersionChange}
      />
      {!isFullAppVersion ? (
        renderPlaceholderDesignArea(versionLabels[activeVersion] || activeVersion)
      ) : currentView === 'createPost' ? (
        <CreatePost
          onBack={handleBackFromCreatePost}
          campaigns={campaigns}
          onPostCreate={handlePostCreate}
          availableProfiles={clientConfig?.availableProfiles}
          profileMap={clientConfig?.profileMap}
        />
      ) : (
        <>
          <MiddleSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <ContentArea
            activeTab={activeTab}
            onCreatePost={handleCreatePost}
            campaigns={campaigns}
            onCampaignsChange={setCampaigns}
            userPosts={userPosts}
            deletedPostIds={deletedPostIds}
            onDeletePost={handleDeletePost}
            navigateToDate={navigateToDate}
            onNavigateComplete={handleNavigateComplete}
            mockScheduledPosts={clientConfig?.mockScheduledPosts}
            mockDraftPosts={clientConfig?.mockDraftPosts}
            mockNotes={clientConfig?.mockNotes}
          />
        </>
      )}
      {snackbar && (
        <Snackbar
          type={snackbar.type}
          message={snackbar.message}
          onDismiss={handleSnackbarDismiss}
        />
      )}
    </div>
    </ClientConfigContext.Provider>
  );
}

export default App;
