import React from 'react';
import Sidebar from './Sidebar';

const CreatorDashboard = () => {
  return (
    <div className="flex h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Main content will go here */}
      </div>
    </div>
  );
};

export default CreatorDashboard;