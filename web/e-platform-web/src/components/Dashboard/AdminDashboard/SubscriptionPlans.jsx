// src/components/Subscription/SubscriptionPlans.jsx

export default function SubscriptionPlans({ data: plans = [], isLoading }) {


  if (isLoading) return <div className="text-center py-10">Loading plans...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {plans.map(plan => (
        <div key={plan.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border-2 border-primary">
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
          <p className="text-4xl font-extrabold mt-4">${plan.price}<span className="text-base font-medium text-gray-500">/month</span></p>
          <ul className="space-y-3 mt-6 text-sm">
            {plan.features.map(feature => (
              <li key={feature} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => console.log('Edit plan:', plan.id)}
            className="w-full mt-6 rounded-lg text-primary border border-primary h-10 text-sm font-medium hover:bg-primary/5"
            title="Edit functionality coming soon"
          >
            Edit Plan
          </button>
        </div>
      ))}
    </div>
  );
}