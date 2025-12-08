// src/pages/Payment/PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaymentById, useCompletePurchase } from '../../hooks/Payment/usePayment';
import SecureCheckout from '../../components/Dashboard/StudentDashboard/Payment/SecureCheckout';
import { useAuth } from '../../context/AuthContext';

/**
 * PaymentPage - Dedicated page for payment checkout
 * Receives paymentId from URL params and displays payment form
 * Integrates with SecureCheckout component for payment processing
 */
export default function PaymentPage() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutData, setCheckoutData] = useState(null);

  // Fetch payment details
  const { data: payment, isLoading, isError, error } = usePaymentById(paymentId);

  // Transform payment data to checkout format
  useEffect(() => {
    if (payment) {
      // Verify payment belongs to current user
      if (payment.userId !== user?.userId) {
        navigate('/');
        return;
      }

      // Check if already completed
      if (payment.status === 'completed') {
        navigate('/dashboard/student');
        return;
      }

      // Transform to checkout data format
      const data = {
        paymentId: payment.id,
        courseId: payment.courseId,
        paymentType: payment.paymentType || 'course_purchase',
        subscriptionType: payment.subscriptionType,
        subtotal: payment.amount || 0,
        tax: 0, // Tax already included in amount
        total: payment.amount || 0,
        items: payment.courseId ? [
          {
            id: payment.courseId,
            title: payment.courseTitle || 'Course Purchase',
            price: payment.amount || 0,
          }
        ] : [],
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ')[1] || '',
        email: user?.email || '',
      };

      setCheckoutData(data);
    }
  }, [payment, user, navigate]);

  // Handle successful payment
  const handleSuccess = (result) => {
    // Navigate to success page or dashboard
    navigate('/dashboard/student', { 
      state: { 
        paymentSuccess: true,
        courseId: payment?.courseId,
        message: 'Payment completed successfully! You can now access your course.'
      }
    });
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">error</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error?.message || 'The payment you are looking for does not exist or has expired.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Payment form
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Complete Your Payment</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Secure checkout powered by Stripe
          </p>
        </div>

        {/* Checkout Component */}
        {checkoutData && (
          <SecureCheckout
            data={checkoutData}
            isLoading={false}
            isError={false}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
