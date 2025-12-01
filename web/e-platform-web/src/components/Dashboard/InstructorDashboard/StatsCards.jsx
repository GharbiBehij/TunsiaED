import React from 'react';
import StatsCard from '../../shared/StatsCard';

export default function StatsCards({ data: stats, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load stats.</div>;
  }

  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    return <div className="p-4 text-gray-500">No stats available</div>;
  }

  // Transform API data to match StatsCard props dynamically
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color || 'blue'}
          trend={stat.trend}
          trendDirection={stat.trendDirection}
          isCurrency={stat.label?.toLowerCase().includes('revenue')}
          variant="colored"
        />
      ))}
    </section>
  );
}