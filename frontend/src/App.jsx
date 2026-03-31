import React, { useState, useEffect } from 'react';
import ChatBox from './components/ChatBox';
import Sidebar from './components/Sidebar';
import './styles/chat.css';

function App() {
  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem('activeChatSession') || `sess_${Date.now()}`;
  });
  const [sessionVersion, setSessionVersion] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 900);

  useEffect(() => {
    localStorage.setItem('activeChatSession', activeSessionId);
  }, [activeSessionId]);

  const handleNewChat = () => {
    setActiveSessionId(`sess_${Date.now()}`);
  };

  const handleMessageSent = () => {
    setSessionVersion(prev => prev + 1);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div className="app-layout">
      <div className="app-container-unified">
        <Sidebar 
          activeSessionId={activeSessionId} 
          onSelectSession={setActiveSessionId} 
          sessionVersion={sessionVersion}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <ChatBox 
          sessionId={activeSessionId} 
          onNewChat={handleNewChat}
          onMessageSent={handleMessageSent}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default App;
