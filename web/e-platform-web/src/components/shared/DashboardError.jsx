export function DashboardError({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center py-24 w-full">
      <p className="text-lg text-red-600 mb-4">Error: {error?.message || "Unknown error"}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded bg-primary text-white font-bold"
      >
        Retry
      </button>
    </div>
  );
}
