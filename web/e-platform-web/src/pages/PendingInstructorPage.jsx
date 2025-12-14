import { useInstructorStatus } from '../hooks';
import StatusBadge from '../components/shared/StatusBadge';

export default function InstructorPendingPage() {
  const { data, isLoading, isError } = useInstructorStatus();

  if (isLoading) return null; // or a small spinner
  if (isError) return null;   // or redirect to login

  const { status } = data || {};

  // Only show if not active
  if (status === 'active') return null;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <StatusBadge
        status={status === 'declined' ? 'declined' : 'pending'}
        description={
          status === 'declined'
            ? 'Your instructor application was declined. Please review the requirements or contact support.'
            : 'Your instructor application is under review. You’ll be notified once an admin approves it.'
        }
      />
    </div>
  );
}
