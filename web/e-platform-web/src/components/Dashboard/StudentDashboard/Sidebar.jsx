import React from 'react';

const sidebarItems = [
  { label: 'Dashboard', icon: 'dashboard', active: true, href: '#' },
  { label: 'My Courses', icon: 'video_library', href: '#' },
  { label: 'Calendar', icon: 'calendar_month', href: '#' },
  { label: 'Grades', icon: 'grading', href: '#' },
];

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full bg-white dark:bg-background-dark shadow-lg z-20 w-64">
      <div className="flex flex-col justify-between h-full p-4">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3 py-2 text-primary">
            <span className="material-symbols-outlined text-3xl">school</span>
            <h1 className="text-2xl font-bold">TunisiaED</h1>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            {sidebarItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg ${
                  item.active
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-primary/10 dark:hover:bg-white/10 text-text-light dark:text-text-dark'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p className="text-base font-semibold">{item.label}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/10 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
          >
            <span className="material-symbols-outlined">settings</span>
            <p className="text-base font-medium">Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
