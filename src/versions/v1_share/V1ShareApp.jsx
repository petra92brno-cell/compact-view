/**
 * v1_share — Full app experience on /v1-share route.
 * Duplicates the working prototype (v1 Campaign Creation) so both versions
 * can be previewed side by side. Uses same components, state, and mock data.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../../components/LeftSidebar';
import MiddleSidebar from '../../components/MiddleSidebar';
import ContentArea from '../../components/ContentArea';
import CreatePost from '../../components/CreatePost';
import Snackbar from '../../components/Snackbar';
import {
  mockCampaigns as initialCampaigns,
  scheduledPosts as mockScheduledPosts,
  draftPosts as mockDraftPosts,
  mockNotes,
} from '../../data/mockData';
import { ClientConfigContext } from '../../contexts/ClientConfigContext';
import { hashVersion } from '../../utils/versionHash';
import '../../App.css';

const VERSION_STORAGE_KEY = 'compact-view-prototype-version';

function V1ShareApp() {
  const navigate = useNavigate();
  const [activeVersion, setActiveVersion] = useState('v1_share');
  const [activeTab, setActiveTab] = useState('Calendar');
  const [currentView, setCurrentView] = useState('main');

  const handleVersionChange = useCallback((versionId) => {
    if (versionId !== 'v1_share') {
      sessionStorage.setItem(VERSION_STORAGE_KEY, versionId);
      navigate(`/?version=${hashVersion(versionId)}`);
      return;
    }
    setActiveVersion(versionId);
    sessionStorage.setItem(VERSION_STORAGE_KEY, versionId);
  }, [navigate]);

  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [userPosts, setUserPosts] = useState([]);
  const [deletedPostIds, setDeletedPostIds] = useState(new Set());
  const [navigateToDate, setNavigateToDate] = useState(null);
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

  const handlePostCreate = useCallback((postData) => {
    setUserPosts(prev => [...prev, ...postData.posts]);
    setCurrentView('main');
    setActiveTab('Calendar');
    setNavigateToDate(new Date(postData.dateTime));
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

  const handleDeletePost = useCallback((postId) => {
    setUserPosts(prev => prev.filter(p => p.id !== postId));
    setDeletedPostIds(prev => new Set([...prev, postId]));
    setSnackbar({ type: 'success', message: 'Post deleted.' });
  }, []);

  const handleSnackbarDismiss = useCallback(() => {
    setSnackbar(null);
  }, []);

  const handleNavigateComplete = useCallback(() => {
    setNavigateToDate(null);
  }, []);

  const hasUnsavedChanges = userPosts.length > 0 || deletedPostIds.size > 0;

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

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
    styleResourcesText();
    const timeoutId = setTimeout(styleResourcesText, 100);
    const observer = new MutationObserver(styleResourcesText);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <ClientConfigContext.Provider value={null}>
      <div className="flex h-screen w-screen overflow-hidden bg-white">
        <LeftSidebar
          activeVersion={activeVersion}
          onVersionChange={handleVersionChange}
        />
        {currentView === 'createPost' ? (
          <CreatePost
            onBack={handleBackFromCreatePost}
            campaigns={campaigns}
            onPostCreate={handlePostCreate}
            availableProfiles={null}
            profileMap={null}
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
              mockScheduledPosts={mockScheduledPosts}
              mockDraftPosts={mockDraftPosts}
              mockNotes={mockNotes}
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

export default V1ShareApp;
