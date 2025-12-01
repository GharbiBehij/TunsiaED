// RevenueTrends.jsx
import React from "react";

export default function RevenueTrends({ data: revenue, isLoading }) {
  if (isLoading) return <p>Loading revenue...</p>;
  if (!revenue) return <p>No revenue data available</p>;

  return (
    <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base font-medium">Revenue Trends</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 Days</p>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">${revenue?.total || 0}</p>
          <div className="flex items-center gap-1 text-green-600">
            <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_upward</span>
            <p className="text-sm font-medium">{revenue?.change || 0}%</p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[240px]">
        {/* You can replace this SVG with a chart library like Chart.js or Recharts */}
        <svg className="w-full h-full" viewBox="0 0 475 150" fill="none">
          <path d={revenue?.path || ''} stroke="#137fec" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
