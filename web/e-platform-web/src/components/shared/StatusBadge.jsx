import React from 'react';

const STATUS_STYLES = {
  pending: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-200',
    iconName: 'schedule',
  },
  declined: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200',
    iconName: 'cancel',
  },
};

export default function StatusBadge({
  status = 'pending',           // 'pending' | 'declined'
  description,                  // optional string
  showCloseButton = false,
  onClose,
}) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${config.container}`}>
      <span className={`material-symbols-outlined text-2xl ${config.icon}`}>
        {config.iconName}
      </span>

      <div className="flex-1">
        <div className={`font-medium capitalize ${config.text}`}>
          {status}
        </div>
        {description && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </div>
        )}
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  );
}
