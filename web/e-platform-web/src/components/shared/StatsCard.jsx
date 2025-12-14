// Reusable StatsCard component for all dashboards
import React from 'react';

/**
 * StatsCard - Reusable stat card component
 * @param {string} label - Stat label
 * @param {string|number} value - Stat value
 * @param {string} icon - Material icon name
 * @param {string} color - Color theme (blue, purple, amber, green)
 * @param {string} trend - Optional trend text
 * @param {string} trendDirection - Optional trend direction (up, down)
 * @param {boolean} isCurrency - Whether to format value as currency
 * @param {string} variant - Display variant (default, colored)
 */
export default function StatsCard({
  label,
  value,
  icon,
  color = 'blue',
  trend,
  trendDirection,
  isCurrency = false,
  variant = 'default',
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-900',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-100',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-900',
      icon: 'text-purple-500',
      iconBg: 'bg-purple-100',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-900',
      icon: 'text-amber-500',
      iconBg: 'bg-amber-100',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-900',
      icon: 'text-green-500',
      iconBg: 'bg-green-100',
    },
  };

  const styles = colorMap[color] || colorMap.blue;

  // Format value
  const formattedValue = isCurrency
    ? `$${typeof value === 'number' ? value.toLocaleString() : value}`
    : typeof value === 'number'
    ? value.toLocaleString()
    : value;

  if (variant === 'colored') {
    return (
      <div className={`flex flex-col gap-2 rounded-xl p-6 border ${styles.bg} ${styles.border}`}>
        <div className="flex items-center justify-between">
          <p className={`${styles.text} text-base font-medium leading-normal`}>{label}</p>
          <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
        </div>
        <p className={`${styles.text} tracking-light text-4xl font-bold leading-tight`}>
          {formattedValue}
        </p>
        {trend && (
          <p
            className={`${
              color === 'amber' ? 'text-amber-700' : 'text-green-600'
            } text-sm font-medium flex items-center gap-1`}
          >
            {trendDirection === 'up' && (
              <span className="material-symbols-outlined text-base">arrow_upward</span>
            )}
            <span>{trend}</span>
          </p>
        )}
      </div>
    );
  }

  // Default variant (simple)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-500">{label}</h3>
      <p className="text-3xl font-bold mt-4">{formattedValue}</p>
      {trend && (
        <p className="text-sm text-green-500 mt-1">{trend}</p>
      )}
    </div>
  );
}

