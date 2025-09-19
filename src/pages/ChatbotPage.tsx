import React from 'react';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';

const ChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-[30%] border-r border-gray-200">
        <LeftPanel />
      </div>
      <div className="w-[70%]">
        <RightPanel />
      </div>
    </div>
  );
};

export default ChatbotPage;