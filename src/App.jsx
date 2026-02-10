import { useState, useEffect, useCallback } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MiddleSidebar from './components/MiddleSidebar';
import ContentArea from './components/ContentArea';
import CreatePost from './components/CreatePost';
import Snackbar from './components/Snackbar';
import { mockCampaigns as initialCampaigns } from './data/mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Calendar');
  const [currentView, setCurrentView] = useState('main'); // 'main' or 'createPost'

  // Shared campaign state — single source of truth for Calendar + CreatePost
  const [campaigns, setCampaigns] = useState(initialCampaigns);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <LeftSidebar />
      {currentView === 'createPost' ? (
        <CreatePost onBack={handleBackFromCreatePost} campaigns={campaigns} onPostCreate={handlePostCreate} />
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
  );
}

export default App;
