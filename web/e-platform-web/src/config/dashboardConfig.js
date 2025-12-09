// ====================================================================
// DASHBOARD CONFIGURATION REGISTRY
// ====================================================================
// 
// DATA FLOW ARCHITECTURE:
// ----------------------
// 1. Dashboard Hook (useAdminDashboard, useInstructorDashboard, useStudentDashboard)
//    ↓ Fetches data from BFF API
// 2. DynamicDashboard Component
//    ↓ Receives { data, isLoading, isError } from hook
// 3. propsMap Function (defined per role in DASHBOARD_CONFIG)
//    ↓ Maps dashboard data to widget-specific props
// 4. Widget Registry (WIDGET_REGISTRY)
//    ↓ Provides widget components by ID
// 5. Widget Components
//    ↓ Render using props from propsMap
//
// EXAMPLE FLOW WITH REAL DATA:
// ----------------------------
// Step 1: Hook fetches data
// useAdminDashboard() → {
//   stats: { totalUsers: 1500, totalCourses: 200, revenue: 50000 },
//   revenueChart: [{ month: 'Jan', amount: 10000 }, ...],
//   recentActivity: [{ user: 'John', action: 'enrolled' }, ...]
// }
//
// Step 2: DynamicDashboard receives this data
// const { data, isLoading, isError } = useAdminDashboard();
//
// Step 3: propsMap transforms data for each widget
// const widgetProps = config.propsMap(data, isLoading, isError);
// Result: {
//   'admin-stats': { 
//     data: { totalUsers: 1500, totalCourses: 200, revenue: 50000 },
//     isLoading: false,
//     isError: false
//   },
//   'admin-revenue-chart': { 
//     data: [{ month: 'Jan', amount: 10000 }, ...],
//     isLoading: false,
//     isError: false
//   },
//   'admin-recent-activity': {
//     data: [{ user: 'John', action: 'enrolled' }, ...],
//     isLoading: false,
//     isError: false
//   }
// }
//
// Step 4: renderWidget gets component from registry
// const Widget = WIDGET_REGISTRY['admin-stats'].component; // StatsCards
//
// Step 5: Component renders with props
// <StatsCards 
//   data={{ totalUsers: 1500, totalCourses: 200, revenue: 50000 }}
//   isLoading={false}
//   isError={false}
// />
//
// KEY CONCEPTS:
// ------------
// - propsMap: Transforms hook data into component-specific props
// - Widget Registry: Maps widget IDs to React components
// - Sections: Define dashboard layout structure
// - Role-based Config: Each role has its own configuration
// 
// ====================================================================

// ====================================================================
// REGISTRY ARCHITECTURE SUMMARY
// ====================================================================
//
// This file contains THREE main registries that work together:
//
// 1. WIDGET_REGISTRY
//    - Maps widget IDs → React components + metadata
//    - Each widget has: component, role, label, description, requiredData
//    - Example: 'admin-stats' → { component: StatsCards, role: 'admin', ... }
//
// 2. ROLE_METADATA
//    - Maps roles → metadata (permission, path, priority, icon)
//    - Defines role hierarchy and UI presentation
//    - Example: 'admin' → { permission: 'isAdmin', priority: 1, ... }
//
// 3. DASHBOARD_CONFIG
//    - Maps roles → complete dashboard configuration
//    - Each config has:
//      * propsMap: Function that maps hook data to widget props
//      * sections: Layout structure defining widget placement
//      * metadata: Role information
//    - Example: 'admin' → { propsMap: (data) => {...}, sections: [...] }
//
// HOW THEY WORK TOGETHER:
// -----------------------
// DynamicDashboard(role='admin')
//   ↓
// 1. DASHBOARD_CONFIG['admin'] → Get config with propsMap & sections
// 2. useAdminDashboard() → Fetch data from API
// 3. config.propsMap(data, loading, error) → Transform data to widget props
// 4. sections.map() → Iterate through layout structure
// 5. WIDGET_REGISTRY[widgetId] → Get component for each widget
// 6. <Component {...widgetProps[widgetId]} /> → Render with props
//
// ====================================================================

// ====================================================================
// WIDGET IMPORTS
// ====================================================================

// Admin Dashboard Widgets
import StatsCards from '../components/Dashboard/AdminDashboard/StatsCards';
import RevenueChart from '../components/Dashboard/AdminDashboard/RevenueChart';
import RecentActivity from '../components/Dashboard/AdminDashboard/RecentActivity';
import CoursePerformance from '../components/Dashboard/AdminDashboard/CoursePerformance';
import UserEngagement from '../components/Dashboard/AdminDashboard/UserEngagement';
import ActivePromotions from '../components/Dashboard/AdminDashboard/ActivePromotions';
import SubscriptionPlans from '../components/Dashboard/AdminDashboard/SubscriptionPlans';
import SubscriptionStats from '../components/Dashboard/AdminDashboard/SubscriptionStats';

// Instructor Dashboard Widgets
import InstructorStatsCards from '../components/Dashboard/InstructorDashboard/StatsCards';
import RevenueTrends from '../components/Dashboard/InstructorDashboard/RevenueTrends';
import InstructorRecentActivity from '../components/Dashboard/InstructorDashboard/RecentActivity';
import InstructorCoursePerformance from '../components/Dashboard/InstructorDashboard/CoursePerformance';
import MyCourses from '../components/Dashboard/InstructorDashboard/MyCourses';

// Student Dashboard Widgets
import StatsSection from '../components/Dashboard/StudentDashboard/Courses/StatsSection';
import StudentCoursesSection from '../components/Dashboard/StudentDashboard/Courses/StudentCoursesSection';
import { ShoppingCartWidget, SecureCheckout } from '../components/Dashboard/StudentDashboard/Payment';

// ====================================================================
// WIDGET REGISTRY
// Maps widget IDs to React components with metadata
// ====================================================================

export const WIDGET_REGISTRY = {
  // Admin Dashboard Widgets
  'admin-stats': {
    component: StatsCards,
    role: 'admin',
    label: 'Platform Statistics',
    description: 'Overview of platform metrics',
    requiredData: ['stats']
  },
  'admin-revenue-chart': {
    component: RevenueChart,
    role: 'admin',
    label: 'Revenue Chart',
    description: 'Revenue trends and analytics',
    requiredData: ['revenueChart']
  },
  'admin-recent-activity': {
    component: RecentActivity,
    role: 'admin',
    label: 'Recent Activity',
    description: 'Latest platform activities',
    requiredData: ['recentActivity']
  },
  'admin-course-performance': {
    component: CoursePerformance,
    role: 'admin',
    label: 'Course Performance',
    description: 'Course analytics and metrics',
    requiredData: ['coursePerformance']
  },
  'admin-user-engagement': {
    component: UserEngagement,
    role: 'admin',
    label: 'User Engagement',
    description: 'User activity and engagement metrics',
    requiredData: ['userEngagement']
  },
  'admin-active-promotions': {
    component: ActivePromotions,
    role: 'admin',
    label: 'Active Promotions',
    description: 'Current promotional campaigns',
    requiredData: ['activePromotions']
  },
  'admin-subscription-plans': {
    component: SubscriptionPlans,
    role: 'admin',
    label: 'Subscription Plans',
    description: 'Available subscription plans',
    requiredData: ['subscriptionPlans']
  },
  'admin-subscription-stats': {
    component: SubscriptionStats,
    role: 'admin',
    label: 'Subscription Statistics',
    description: 'Subscription metrics and analytics',
    requiredData: ['subscriptionStats']
  },
  
  // Instructor Dashboard Widgets
  'instructor-stats': {
    component: InstructorStatsCards,
    role: 'instructor',
    label: 'Instructor Statistics',
    description: 'Teaching performance metrics',
    requiredData: ['stats']
  },
  'instructor-revenue-trends': {
    component: RevenueTrends,
    role: 'instructor',
    label: 'Revenue Trends',
    description: 'Earning trends over time',
    requiredData: ['revenueTrends']
  },
  'instructor-recent-activity': {
    component: InstructorRecentActivity,
    role: 'instructor',
    label: 'Recent Activity',
    description: 'Latest course activities',
    requiredData: ['recentActivity']
  },
  'instructor-course-performance': {
    component: InstructorCoursePerformance,
    role: 'instructor',
    label: 'Course Performance',
    description: 'Individual course metrics',
    requiredData: ['coursePerformance']
  },
  'instructor-my-courses': {
    component: MyCourses,
    role: 'instructor',
    label: 'My Courses',
    description: 'Course management overview',
    requiredData: ['courses']
  },
  
  // Student Dashboard Widgets
  'student-stats': {
    component: StatsSection,
    role: 'student',
    label: 'Learning Statistics',
    description: 'Progress and achievements',
    requiredData: ['stats']
  },
  'student-courses': {
    component: StudentCoursesSection,
    role: 'student',
    label: 'My Courses',
    description: 'Enrolled courses overview',
    requiredData: ['courses']
  },
  'student-cart': {
    component: ShoppingCartWidget,
    role: 'student',
    label: 'Shopping Cart',
    description: 'Course cart management',
    requiredData: ['cart']
  },
  'student-checkout': {
    component: SecureCheckout,
    role: 'student',
    label: 'Checkout',
    description: 'Secure payment processing',
    requiredData: ['checkout']
  },
};

// ====================================================================
// ROLE METADATA
// Defines metadata for each role including permissions and hooks
// ====================================================================

export const ROLE_METADATA = {
  admin: {
    label: 'Administrator',
    description: 'Full platform access and management',
    permission: 'isAdmin',
    dashboardPath: '/dashboard/admin',
    priority: 1, // Highest priority
    color: '#ef4444', // red-500
    icon: 'admin_panel_settings',
  },
  instructor: {
    label: 'Instructor',
    description: 'Course creation and student management',
    permission: 'isInstructor',
    dashboardPath: '/dashboard/instructor',
    priority: 2,
    color: '#3b82f6', // blue-500
    icon: 'school',
  },
  student: {
    label: 'Student',
    description: 'Course enrollment and learning',
    permission: 'isStudent',
    dashboardPath: '/dashboard/student',
    priority: 3,
    color: '#10b981', // green-500
    icon: 'person',
  },
};

// ====================================================================
// DASHBOARD CONFIGURATIONS
// Each role has: title, propsMap (data → widget props), sections (layout)
// ====================================================================

export const DASHBOARD_CONFIG = {
  // ----------------------------------------------------------------
  // ADMIN DASHBOARD
  // Data Source: useAdminDashboard (frontend aggregation)
  // Returns: { stats, revenueChart, recentActivity, coursePerformance, 
  //            userEngagement, activePromotions, subscriptionPlans, subscriptionStats }
  // ----------------------------------------------------------------
  admin: {
    role: 'admin',
    title: 'Platform Overview',
    metadata: ROLE_METADATA.admin,
    requiredPermission: 'isAdmin',
    dataHook: 'useAdminDashboard',
    
    /**
     * propsMap - Transforms dashboard data into widget-specific props
     * This function is called by DynamicDashboard to map data to each widget
     * 
     * @param {Object} dashboardData - Data from useAdminDashboard hook
     * @param {boolean} isLoading - Loading state from hook
     * @param {boolean} isError - Error state from hook
     * @returns {Object} Map of widgetId → props for that widget
     * 
     * DATA MAPPING:
     * dashboardData.stats → 'admin-stats' widget → StatsCards component
     * dashboardData.revenueChart → 'admin-revenue-chart' widget → RevenueChart component
     * etc.
     */
    propsMap: (dashboardData, isLoading, isError) => ({
      'admin-stats': { data: dashboardData?.stats, isLoading, isError },
      'admin-revenue-chart': { data: dashboardData?.revenueChart, isLoading, isError },
      'admin-recent-activity': { data: dashboardData?.recentActivity, isLoading, isError },
      'admin-course-performance': { data: dashboardData?.coursePerformance, isLoading, isError },
      'admin-user-engagement': { data: dashboardData?.userEngagement, isLoading, isError },
      'admin-active-promotions': { data: dashboardData?.activePromotions, isLoading, isError },
      'admin-subscription-plans': { data: dashboardData?.subscriptionPlans, isLoading, isError },
      'admin-subscription-stats': { data: dashboardData?.subscriptionStats, isLoading, isError },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'admin-stats', className: 'mb-8' },
      // Row 2: Revenue Chart (2/3) + Recent Activity (1/3)
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'chart', widget: 'admin-revenue-chart', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'admin-recent-activity' },
        ]
      },
      // Row 3: Course Performance + User Engagement
      {
        id: 'bottom-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-2 gap-6 mt-8',
        children: [
          { id: 'courses', widget: 'admin-course-performance' },
          { id: 'users', widget: 'admin-user-engagement' },
        ]
      },
      // Row 4: Promotions + Subscriptions
      {
        id: 'admin-extra-row', type: 'grid', grid: 'grid-cols-1 md:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'promotions', widget: 'admin-active-promotions' },
          { id: 'subscription-plans', widget: 'admin-subscription-plans' },
          { id: 'subscription-stats', widget: 'admin-subscription-stats' },
        ]
      },
    ],
  },

  // ----------------------------------------------------------------
  // INSTRUCTOR DASHBOARD
  // Data Source: useInstructorDashboard (backend orchestrator)
  // Returns: { stats, revenueTrends, recentActivity, coursePerformance }
  // ----------------------------------------------------------------
  instructor: {
    role: 'instructor',
    title: 'Instructor Dashboard',
    metadata: ROLE_METADATA.instructor,
    requiredPermission: 'isInstructor',
    dataHook: 'useInstructorDashboard',
    
    /**
     * propsMap - Maps instructor dashboard data to widget props
     * Called by DynamicDashboard to distribute data to widgets
     * 
     * @param {Object} dashboardData - Data from useInstructorDashboard hook
     * @returns {Object} Widget ID → props mapping
     */
    propsMap: (dashboardData, isLoading, isError) => ({
      'instructor-stats': { data: dashboardData?.stats, isLoading, isError },
      'instructor-revenue-trends': { data: dashboardData?.revenueTrends, isLoading, isError },
      'instructor-recent-activity': { data: dashboardData?.recentActivity, isLoading, isError },
      'instructor-course-performance': { data: dashboardData?.coursePerformance, isLoading, isError },
      'instructor-my-courses': { data: dashboardData?.courses, isLoading, isError },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'instructor-stats', className: 'mb-8' },
      // Row 2: My Courses (full width)
      { id: 'my-courses', widget: 'instructor-my-courses', className: 'mt-8 mb-8' },
      // Row 3: Revenue Trends (2/3) + Recent Activity (1/3)
      {
        id: 'main-row', type: 'grid', grid: 'grid-cols-1 lg:grid-cols-3 gap-6 mt-8',
        children: [
          { id: 'revenue', widget: 'instructor-revenue-trends', span: 'lg:col-span-2' },
          { id: 'activity', widget: 'instructor-recent-activity' },
        ]
      },
      // Row 4: Course Performance (full width)
      { id: 'bottom-row', widget: 'instructor-course-performance', className: 'mt-8' },
    ],
  },

  // ----------------------------------------------------------------
  // STUDENT DASHBOARD
  // Data Source: useStudentDashboard (backend orchestrator)
  // Returns: { stats, courses, cart, checkout }
  // ----------------------------------------------------------------
  student: {
    role: 'student',
    title: 'My Learning Dashboard',
    metadata: ROLE_METADATA.student,
    requiredPermission: 'isStudent',
    dataHook: 'useStudentDashboard',
    
    /**
     * propsMap - Maps student dashboard data to widget props
     * Supports both data and callback props for interactive widgets
     * 
     * @param {Object} dashboardData - Data from useStudentDashboard hook
     * @returns {Object} Widget ID → props mapping
     * 
     * SPECIAL HANDLING:
     * - student-courses: Additional display props (showTitle, title)
     * - student-cart: Includes callback handlers (onCheckout, onRemoveItem)
     * - student-checkout: Includes lifecycle callbacks (onSuccess, onCancel)
     */
    propsMap: (dashboardData, isLoading, isError) => ({
      'student-stats': { data: dashboardData?.stats, isLoading, isError },
      'student-courses': { 
        data: dashboardData?.courses, 
        isLoading, 
        isError,
        showTitle: true, 
        title: 'My Courses' 
      },
      'student-cart': { 
        data: dashboardData?.cart, 
        isLoading, 
        isError,
        onCheckout: dashboardData?.onCheckout,
        onRemoveItem: dashboardData?.onRemoveCartItem,
      },
      'student-checkout': { 
        data: dashboardData?.checkout, 
        isLoading, 
        isError,
        onSuccess: dashboardData?.onCheckoutSuccess,
        onCancel: dashboardData?.onCheckoutCancel,
      },
    }),
    sections: [
      // Row 1: Stats Cards (full width)
      { id: 'stats', widget: 'student-stats', className: 'mb-8' },
      // Row 2: Courses Section (full width)
      { id: 'courses', widget: 'student-courses', className: 'mt-8' },
    ],
  },
};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Get dashboard configuration for a specific role
 * @param {string} role - User role (admin, instructor, student)
 * @returns {Object} Dashboard configuration
 */
export const getDashboardConfig = (role) => DASHBOARD_CONFIG[role] || DASHBOARD_CONFIG.student;

/**
 * Check if a role has a dashboard configuration
 * @param {string} role - User role to check
 * @returns {boolean}
 */
export const hasDashboardConfig = (role) => !!DASHBOARD_CONFIG[role];

/**
 * Get all available dashboard roles
 * @returns {string[]} Array of role names
 */
export const getAvailableRoles = () => Object.keys(DASHBOARD_CONFIG);

/**
 * Validate if user has access to a specific dashboard role
 * @param {Object} user - User object with role booleans { isAdmin, isInstructor, isStudent }
 * @param {string} dashboardRole - Dashboard role to access
 * @returns {boolean}
 */
export const canAccessDashboard = (user, dashboardRole) => {
  if (!user || !dashboardRole) return false;
  
  const roleMap = {
    admin: user.isAdmin,
    instructor: user.isInstructor,
    student: user.isStudent
  };
  
  return roleMap[dashboardRole] === true;
};

/**
 * Get user's primary dashboard role based on boolean priority
 * Priority: admin > instructor > student
 * @param {Object} user - User object with role booleans
 * @returns {string|null} Primary dashboard role or null
 */
export const getPrimaryDashboardRole = (user) => {
  if (!user) return null;
  
  if (user.isAdmin) return 'admin';
  if (user.isInstructor) return 'instructor';
  if (user.isStudent) return 'student';
  
  return null;
};

// ====================================================================
// ADVANCED REGISTRY UTILITIES
// ====================================================================

/**
 * Get widget component from registry (backward compatible)
 * @param {string} widgetId - Widget identifier
 * @returns {React.Component|null} Widget component
 */
export const getWidgetComponent = (widgetId) => {
  const widget = WIDGET_REGISTRY[widgetId];
  if (!widget) return null;
  // Support both new format (object) and legacy format (direct component)
  return widget.component || widget;
};

/**
 * Get widget metadata
 * @param {string} widgetId - Widget identifier
 * @returns {Object|null} Widget metadata
 */
export const getWidgetMetadata = (widgetId) => {
  const widget = WIDGET_REGISTRY[widgetId];
  if (!widget || !widget.component) return null;
  return {
    label: widget.label,
    description: widget.description,
    role: widget.role,
    requiredData: widget.requiredData
  };
};

/**
 * Get all widgets for a specific role
 * @param {string} role - Role name
 * @returns {Object[]} Array of widget metadata
 */
export const getWidgetsByRole = (role) => {
  return Object.entries(WIDGET_REGISTRY)
    .filter(([_, widget]) => widget.role === role)
    .map(([id, widget]) => ({
      id,
      ...getWidgetMetadata(id)
    }));
};

/**
 * Validate dashboard configuration
 * @param {string} role - Role to validate
 * @returns {Object} Validation result with errors array
 */
export const validateDashboardConfig = (role) => {
  const errors = [];
  const config = DASHBOARD_CONFIG[role];
  
  if (!config) {
    errors.push(`No configuration found for role: ${role}`);
    return { valid: false, errors };
  }
  
  // Validate required fields
  if (!config.title) errors.push('Missing title');
  if (!config.propsMap) errors.push('Missing propsMap function');
  if (!config.sections || !Array.isArray(config.sections)) {
    errors.push('Missing or invalid sections array');
  }
  
  // Validate widgets exist in registry
  if (config.sections) {
    config.sections.forEach(section => {
      if (section.widget && !WIDGET_REGISTRY[section.widget]) {
        errors.push(`Widget not found in registry: ${section.widget}`);
      }
      if (section.children) {
        section.children.forEach(child => {
          if (child.widget && !WIDGET_REGISTRY[child.widget]) {
            errors.push(`Child widget not found in registry: ${child.widget}`);
          }
        });
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
};

/**
 * Get role metadata
 * @param {string} role - Role name
 * @returns {Object|null} Role metadata
 */
export const getRoleMetadata = (role) => ROLE_METADATA[role] || null;

/**
 * Get all roles sorted by priority
 * @returns {string[]} Array of role names sorted by priority
 */
export const getRolesByPriority = () => {
  return Object.entries(ROLE_METADATA)
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([role]) => role);
};

/**
 * Check if user has permission for a role
 * @param {Object} user - User object with role booleans
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRolePermission = (user, role) => {
  if (!user || !role) return false;
  const metadata = ROLE_METADATA[role];
  if (!metadata) return false;
  return user[metadata.permission] === true;
};

/**
 * Get dashboard summary for a role
 * @param {string} role - Role name
 * @returns {Object} Dashboard summary
 */
export const getDashboardSummary = (role) => {
  const config = DASHBOARD_CONFIG[role];
  const metadata = ROLE_METADATA[role];
  
  if (!config || !metadata) return null;
  
  const widgetCount = config.sections.reduce((count, section) => {
    if (section.widget) return count + 1;
    if (section.children) return count + section.children.length;
    return count;
  }, 0);
  
  return {
    role,
    title: config.title,
    label: metadata.label,
    description: metadata.description,
    widgetCount,
    dashboardPath: metadata.dashboardPath,
    dataHook: config.dataHook,
    permission: metadata.permission,
  };
};

/**
 * Get all dashboard summaries
 * @returns {Object[]} Array of dashboard summaries
 */
export const getAllDashboardSummaries = () => {
  return getAvailableRoles().map(role => getDashboardSummary(role));
};

// ====================================================================
// DATA FLOW UTILITIES
// ====================================================================

/**
 * Get data flow documentation for a role
 * Useful for debugging and understanding how data flows to widgets
 * 
 * @param {string} role - Role name
 * @returns {Object} Data flow documentation
 */
export const getDataFlowMap = (role) => {
  const config = DASHBOARD_CONFIG[role];
  if (!config) return null;
  
  const widgets = [];
  
  // Extract all widgets from sections
  config.sections.forEach(section => {
    if (section.widget) {
      widgets.push(section.widget);
    }
    if (section.children) {
      section.children.forEach(child => {
        if (child.widget) {
          widgets.push(child.widget);
        }
      });
    }
  });
  
  // Map widgets to their data sources
  const dataFlow = widgets.map(widgetId => {
    const widget = WIDGET_REGISTRY[widgetId];
    return {
      widgetId,
      component: widget?.component?.name || widgetId,
      role: widget?.role,
      label: widget?.label,
      requiredData: widget?.requiredData,
      // Data path in hook response
      dataPath: widget?.requiredData?.[0] ? `dashboardData.${widget.requiredData[0]}` : 'unknown'
    };
  });
  
  return {
    role,
    hook: config.dataHook,
    hookPath: `hooks/${role.charAt(0).toUpperCase() + role.slice(1)}/use${role.charAt(0).toUpperCase() + role.slice(1)}`,
    dataFlow,
    flowDescription: `
DATA FLOW FOR ${role.toUpperCase()}:
1. ${config.dataHook}() fetches data from BFF API
2. DynamicDashboard receives { data, isLoading, isError }
3. config.propsMap(data, isLoading, isError) transforms data
4. WIDGET_REGISTRY provides components for each widgetId
5. Widgets render with their specific props

EXAMPLE:
${config.dataHook}() → { ${dataFlow[0]?.requiredData?.[0]}: {...} }
  ↓
config.propsMap() → { '${dataFlow[0]?.widgetId}': { data: data.${dataFlow[0]?.requiredData?.[0]}, isLoading, isError } }
  ↓
WIDGET_REGISTRY['${dataFlow[0]?.widgetId}'] → ${dataFlow[0]?.component}
  ↓
<${dataFlow[0]?.component} data={...} isLoading={...} isError={...} />
    `.trim()
  };
};

/**
 * Trace widget data source
 * Shows exactly where a widget's data comes from
 * 
 * @param {string} widgetId - Widget identifier
 * @returns {Object|null} Data source trace
 */
export const traceWidgetDataSource = (widgetId) => {
  const widget = WIDGET_REGISTRY[widgetId];
  if (!widget) return null;
  
  const role = widget.role;
  const config = DASHBOARD_CONFIG[role];
  if (!config) return null;
  
  return {
    widgetId,
    component: widget.component?.name || widgetId,
    role,
    dataHook: config.dataHook,
    requiredData: widget.requiredData,
    propsMapKey: widgetId,
    trace: {
      step1_hook: `${config.dataHook}() calls BFF API`,
      step2_hookReturns: `Returns dashboardData with fields: ${widget.requiredData?.join(', ')}`,
      step3_dynamicDashboard: `DynamicDashboard calls config.propsMap(dashboardData, isLoading, isError)`,
      step4_propsMap: `propsMap extracts: dashboardData.${widget.requiredData?.[0]}`,
      step5_registry: `WIDGET_REGISTRY['${widgetId}'] provides ${widget.component?.name}`,
      step6_render: `<${widget.component?.name} data={dashboardData.${widget.requiredData?.[0]}} isLoading={...} isError={...} />`
    }
  };
};

/**
 * Get propsMap output example for debugging
 * Shows what propsMap would return with sample data
 * 
 * @param {string} role - Role name
 * @param {Object} sampleData - Sample dashboard data
 * @returns {Object} Transformed props for all widgets
 */
export const getPropsMapExample = (role, sampleData = {}) => {
  const config = DASHBOARD_CONFIG[role];
  if (!config || !config.propsMap) return null;
  
  return {
    role,
    input: {
      dashboardData: sampleData,
      isLoading: false,
      isError: false
    },
    output: config.propsMap(sampleData, false, false),
    description: 'This shows how propsMap transforms hook data into widget props'
  };
};

