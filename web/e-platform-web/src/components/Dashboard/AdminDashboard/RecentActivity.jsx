import ActivityFeed from '../../shared/ActivityFeed';

export default function RecentActivity({ data = [], isLoading }) {

  return <ActivityFeed activities={data} isLoading={isLoading} variant="list" />;
}