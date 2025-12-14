import { useDashboardGuard } from '../../hooks';
import DynamicDashboard from '../../components/shared/DynamicDashboard';

export default function AdminDashboard() {
  useDashboardGuard('admin');
  return <DynamicDashboard role="admin" />;
}