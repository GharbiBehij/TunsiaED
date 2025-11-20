import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './StudentDashboard';

const AppLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <Header />
        <Dashboard />
      </div>
    </div>
  );
};

export default AppLayout;
