// Dynamic Dashboard Component - Renders dashboards based on configuration
import React from 'react';
import { 
  getDashboardConfig, 
  getWidgetComponent,
  hasDashboardConfig,
  validateDashboardConfig 
} from '../../config/dashboardConfig';
import { useAdminDashboard, useInstructorDashboard, useStudentDashboard } from '../../hooks';
import { DashboardSpinner } from './DashboardSpinner';
import { DashboardError } from './DashboardError';

const DASHBOARD_HOOKS = {
  admin: useAdminDashboard,
  instructor: useInstructorDashboard,
  student: useStudentDashboard
};

/**
 * DynamicDashboard - Renders dashboard based on role configuration
 * @param {string} role - Dashboard role (admin, instructor, student)
 */
export default function DynamicDashboard({ role }) {
  // Validate role has configuration
  if (!hasDashboardConfig(role)) {
    console.warn(`[DynamicDashboard] Invalid role: ${role}, falling back to student`);
  }
  
  // Validate dashboard configuration in development
  if (process.env.NODE_ENV === 'development') {
    const validation = validateDashboardConfig(role);
    if (!validation.valid) {
      console.error(`[DynamicDashboard] Configuration errors for ${role}:`, validation.errors);
    }
  }
  
  const config = getDashboardConfig(role);
  const useDashboard = DASHBOARD_HOOKS[role] || useStudentDashboard;
  const { data, isLoading, isError, error, refetch } = useDashboard();

  // Map widget IDs to props using config.propsMap
  // Pass isLoading and isError so widgets can render their own loading/error states
  const widgetProps = React.useMemo(
    () => (config.propsMap ? config.propsMap(data, isLoading, isError) : {}),
    [config, data, isLoading, isError]
  );

  // Helper to get widget component using enhanced registry
  const renderWidget = (widgetId) => {
    const Widget = getWidgetComponent(widgetId);
    if (!Widget) {
      console.error(`[DynamicDashboard] Widget not found: ${widgetId}`);
      return <div className="p-4 border-2 border-dashed border-red-500 rounded-lg text-red-600">
        Widget not found: {widgetId}
      </div>;
    }
    return <Widget {...(widgetProps[widgetId] || {})} />;
  };

  // Section renderer
  const renderSection = (section) => {
    if (section.type === 'grid' && section.children) {
      return (
        <div key={section.id} className={section.grid + ' ' + (section.className || '')}>
          {section.children.map(child => (
            <div key={child.id} className={child.span || ''}>
              {child.widget && renderWidget(child.widget)}
            </div>
          ))}
        </div>
      );
    }
    if (section.widget) {
      return (
        <div key={section.id} className={section.className || ''}>
          {renderWidget(section.widget)}
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <DashboardSpinner />;
  if (isError) return <DashboardError error={error} onRetry={refetch} />;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black mb-8">{config.title}</h1>
      {config.sections.map(section => renderSection(section))}
    </div>
  );
}

