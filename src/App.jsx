import { useState, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MiddleSidebar from './components/MiddleSidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Scheduled');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
      <MiddleSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <ContentArea activeTab={activeTab} />
      </div>
  );
}

export default App;
