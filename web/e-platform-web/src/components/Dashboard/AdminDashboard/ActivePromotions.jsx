// src/components/Subscription/ActivePromotions.jsx
export default function ActivePromotions({ data: promotions = [], isLoading }) {

  if (isLoading) return <div className="text-center py-10">Loading promotions...</div>;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Promotions</h3>
        <button type="button" className="text-sm font-medium text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {promotions.map((promo) => (
          <div key={promo.id}>
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium">{promo.campaign}</p>
              <p className="text-sm text-gray-500">{promo.code}</p>
            </div>
            <p className="text-sm text-gray-500">Uses: {promo.uses}</p>
            <p className="text-sm text-green-500">Active</p>
          </div>
        ))}
      </div>
    </div>
  );
}