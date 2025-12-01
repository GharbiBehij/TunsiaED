export default function RevenueChart({ data, isLoading }) {

  if (isLoading) return <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
      <div className="h-80">
        {/* Replace with Recharts or Chart.js later */}
        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}