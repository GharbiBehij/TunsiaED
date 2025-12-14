export default function UserEngagement({ data, isLoading }) {
  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (!data) return <div className="text-center py-10">No data available</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">User Engagement</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Daily Active Users</p>
          <p className="text-2xl font-bold">{data?.dailyActive || 0}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Monthly Active Users</p>
          <p className="text-2xl font-bold">{data?.monthlyActive || 0}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Avg. Session Duration</p>
          <p className="text-2xl font-bold">{data?.avgSession || '0m'}</p>
        </div>
      </div>
    </div>
  );
}