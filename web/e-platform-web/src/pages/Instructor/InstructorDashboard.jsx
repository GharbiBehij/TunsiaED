import { useDashboardGuard } from '../../hooks/useDashboardGuard';
import DynamicDashboard from '../../components/shared/DynamicDashboard';

export default function InstructorDashboard() {
  useDashboardGuard('instructor');
  return <DynamicDashboard role="instructor" />;
}

