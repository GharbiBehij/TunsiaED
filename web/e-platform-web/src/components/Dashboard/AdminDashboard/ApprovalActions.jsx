import React, { useState } from 'react';
import { useApproveInstructor, useDeclineInstructor,useRejectCourse,useApproveCourse } from '../../../hooks';

export default function ApprovalActions({
  itemType = 'instructor',   // 'instructor' | 'course'
  itemId,
  itemName,
  currentStatus = 'pending',
  onSuccess,
  onError,
  className = '',
}) {
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const approveInstructor = useApproveInstructor();
  const declineInstructor = useDeclineInstructor();
  const approveCourse = useApproveCourse();
  const rejectCourse= useRejectCourse();

  const isInstructor = itemType === 'instructor';
  const approveMutation = isInstructor ? approveInstructor : approveCourse;
  const declineMutation = isInstructor ? declineInstructor : rejectCourse; // only instructors can be declined

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(itemId);
      onSuccess?.('approved', itemId);
    } catch (error) {
      onError?.(error.message || 'Failed to approve');
    }
  };

const handleDecline = async () => {
  if (!declineReason.trim()) {
    onError?.('Please provide a reason for declining');
    return;
  }

  try {
    const payload = isInstructor
      ? { userId: itemId, reason: declineReason }
      : { courseId: itemId, reason: declineReason };

    await declineMutation.mutateAsync(payload);
    setShowDeclineDialog(false);
    setDeclineReason('');
    onSuccess?.('declined', itemId);
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || 'Failed to decline';
    onError?.(message);
  }
};
  const isLoading = approveMutation.isPending || declineMutation.isPending;

  // Only show actions for pending items
  if (currentStatus !== 'pending') {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Approve button */}
      <button
        type="button"
        onClick={handleApprove}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {approveMutation.isPending ? (
          <span className="material-symbols-outlined animate-spin text-sm">
            progress_activity
          </span>
        ) : (
          <span className="material-symbols-outlined text-sm">check_circle</span>
        )}
        Approve
      </button>

      {/* Decline button (instructor only) */}
      {isInstructor && (
        <button
          type="button"
          onClick={() => setShowDeclineDialog(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">cancel</span>
          Decline
        </button>
      )}

      {/* Decline reason modal */}
      {showDeclineDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#182431] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Decline {isInstructor ? 'Instructor Application' : 'Course'}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reason for declining {itemName ? `(${itemName})` : ''}:
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please provide a detailed reason..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDeclineDialog(false);
                  setDeclineReason('');
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={declineMutation.isPending || !declineReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {declineMutation.isPending && (
                  <span className="material-symbols-outlined animate-spin text-sm">
                    progress_activity
                  </span>
                )}
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
