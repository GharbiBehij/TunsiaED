import React from 'react';
import ActivityFeed from '../../shared/ActivityFeed';

export default function RecentActivity({ data: activities, isLoading }) {

  return (
    <ActivityFeed
      activities={activities}
      isLoading={isLoading}
      variant="timeline"
      viewAllLink="/dashboard/activity"
    />
  );
}