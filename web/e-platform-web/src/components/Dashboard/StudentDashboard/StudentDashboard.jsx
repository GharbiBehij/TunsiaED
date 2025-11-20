import React from 'react';
import WelcomeBanner from './WelcomeBanner';
import Stats from './Stats';
import CoursesCarousel from './CourseCarousel';
import Assignments from './Assignements';
import ActivityFeed from './ActivityFeed';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-10">
        <WelcomeBanner userName="Anis" />
        <Stats />
        <CoursesCarousel />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Assignments />
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
