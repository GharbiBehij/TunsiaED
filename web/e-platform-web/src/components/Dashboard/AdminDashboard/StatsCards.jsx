import StatsCard from '../../shared/StatsCard';

// Admin stats configuration - makes it easy to add/remove/modify stats
const ADMIN_STATS_CONFIG = [
  {
    key: 'revenue',
    label: 'Total Revenue',
    icon: 'attach_money',
    isCurrency: true,
    trend: '+12.5% vs last month',
    trendDirection: 'up',
  },
  {
    key: 'newUsers',
    label: 'New Users',
    icon: 'person_add',
    isCurrency: false,
  },
  {
    key: 'activeCourses',
    label: 'Active Courses',
    icon: 'school',
    isCurrency: false,
  },
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    icon: 'card_membership',
    isCurrency: false,
  },
];

export default function StatsCards({ data, isLoading }) {
  // Handle undefined/null data gracefully
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ADMIN_STATS_CONFIG.map((stat) => (
          <div key={stat.key} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ADMIN_STATS_CONFIG.map((stat) => (
          <div key={stat.key} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {ADMIN_STATS_CONFIG.map((statConfig) => {
        const value = data[statConfig.key] || 0;
        return (
          <StatsCard
            key={statConfig.key}
            label={statConfig.label}
            value={value}
            icon={statConfig.icon}
            isCurrency={statConfig.isCurrency}
            trend={statConfig.trend}
            trendDirection={statConfig.trendDirection}
            variant="default"
          />
        );
      })}
    </div>
  );
}