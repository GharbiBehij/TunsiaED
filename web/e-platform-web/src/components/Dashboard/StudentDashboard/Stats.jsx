import React from 'react';

const statsData = [
  { icon: 'school', label: 'Courses Completed', value: '4', bgColor: 'bg-primary/20', textColor: 'text-primary' },
  { icon: 'military_tech', label: 'Average Grade', value: '88%', bgColor: 'bg-secondary/20', textColor: 'text-secondary' },
  { icon: 'local_fire_department', label: 'Active Streak', value: '12 Days', bgColor: 'bg-green-500/20', textColor: 'text-green-500' },
];

const Stats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat) => (
        <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-5">
          <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-full`}>
            <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
          </div>
          <div>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">{stat.label}</p>
            <p className="text-text-light dark:text-text-dark text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
