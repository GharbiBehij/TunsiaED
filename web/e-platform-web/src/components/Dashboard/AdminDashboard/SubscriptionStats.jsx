// src/components/Subscription/SubscriptionStats.jsx
export default function SubscriptionStats({ data, isLoading }) {
  if (isLoading) return <div className="text-center py-10">Loading stats...</div>;
  if (!data) return <div className="text-center py-10">No data available</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-500">Active Subscribers</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{data?.activeSubs || 0}</p>
        <p className="text-sm text-green-500 mt-1">+{data?.growth || 0}% vs last month</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-500">Monthly Revenue</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">${(data?.revenue || 0).toLocaleString()}</p>
        <p className="text-sm text-green-500 mt-1">+{data?.revenueGrowth || 0}% vs last month</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-500">Churn Rate</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{data?.churn || 0}%</p>
        <p className="text-sm text-red-500 mt-1">{data?.churnChange || 0}% vs last month</p>
      </div>
    </div>
  );
}