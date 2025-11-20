import React from 'react';

const activities = [
  { icon: 'campaign', iconBg: 'bg-blue-100 dark:bg-blue-900/50', text: 'New announcement in Web Development', time: '2 hours ago' },
  { icon: 'task_alt', iconBg: 'bg-green-100 dark:bg-green-900/50', text: "'Quiz 2' has been graded", time: '1 day ago' },
  { icon: 'add_circle', iconBg: 'bg-purple-100 dark:bg-purple-900/50', text: 'New content added to History of Carthage', time: '3 days ago' },
];

const ActivityFeed = () => {
  return (
    <div>
      <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        Recent Activity
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className={`${activity.iconBg} rounded-full p-2`}>
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">{activity.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">{activity.text}</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityFeed;
