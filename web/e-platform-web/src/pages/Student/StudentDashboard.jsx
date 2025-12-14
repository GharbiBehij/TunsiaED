import { useDashboardGuard } from '../../hooks';
import DynamicDashboard from '../../components/shared/DynamicDashboard';

export default function StudentDashboard() {
  useDashboardGuard('student');
  return <DynamicDashboard role="student" />;
}

