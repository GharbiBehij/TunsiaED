// src/Layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import { useRoleRedirect } from '../hooks/Roles/useRoleRedirect';
import DashboardHeader from '../components/Headers/DashboardHeader';

export default function MainLayout({ children }) {
  useRoleRedirect(); // ← Perfect

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">  {/* ← RESPONSIVE */}
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}