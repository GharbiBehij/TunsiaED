// Reusable ActivityFeed component for all dashboards
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ActivityFeed - Reusable activity feed component
 * @param {Array} activities - Array of activity objects
 * @param {boolean} isLoading - Loading state
 * @param {string} variant - Display variant (list, timeline)
 * @param {string} viewAllLink - Optional link to view all activities
 */
export default function ActivityFeed({
  activities = [],
  isLoading = false,
  variant = 'list',
  viewAllLink,
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
        <div className="text-center py-10">Loading activity...</div>
      </div>
    );
  }

  if (variant === 'timeline') {
    const getColorClasses = (color) => {
      switch (color) {
        case 'green':
          return { bg: 'bg-green-100', text: 'text-green-600' };
        case 'blue':
          return { bg: 'bg-blue-100', text: 'text-blue-600' };
        case 'amber':
          return { bg: 'bg-amber-100', text: 'text-amber-600' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-600' };
      }
    };

    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#111418] text-xl font-bold leading-tight">Recent Activity</h2>
          {viewAllLink && (
            <Link
              className="text-sm font-medium text-[#1380ec] hover:underline"
              to={viewAllLink}
            >
              View All
            </Link>
          )}
        </div>

        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((item, index) => {
              const { bg, text } = getColorClasses(item.color);
              const isLast = index === activities.length - 1;

              return (
                <li key={item.id || index}>
                  <div className="relative pb-8">
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      ></span>
                    )}

                    <div className="relative flex space-x-3 items-start">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center ring-8 ring-white`}
                        >
                          <span className={`material-symbols-outlined text-lg ${text}`}>
                            {item.icon}
                          </span>
                        </span>
                      </div>

                      <div className="min-w-0 flex-1 pt-1.5">
                        <div className="text-sm text-gray-800">
                          {item.type === 'message' ? (
                            <>
                              You received a new message from{' '}
                              <button
                                type="button"
                                className="font-medium text-[#111418] hover:underline"
                              >
                                {item.user}
                              </button>
                              .
                            </>
                          ) : item.type === 'rating' ? (
                            <>
                              <button
                                type="button"
                                className="font-medium text-[#111418] hover:underline"
                              >
                                {item.user}
                              </button>{' '}
                              left a 5-star rating on{' '}
                              <button
                                type="button"
                                className="font-medium text-[#111418] hover:underline"
                              >
                                {item.target}
                              </button>
                              .
                            </>
                          ) : (
                            <>
                              New student{' '}
                              <button
                                type="button"
                                className="font-medium text-[#111418] hover:underline"
                              >
                                {item.user}
                              </button>{' '}
                              {item.action}{' '}
                              <button
                                type="button"
                                className="font-medium text-[#111418] hover:underline"
                              >
                                {item.target}
                              </button>
                              .
                            </>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  // List variant (default)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((act, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm">
                <strong>{act.name}</strong> {act.action}
              </p>
              <p className="text-xs text-gray-500">{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

