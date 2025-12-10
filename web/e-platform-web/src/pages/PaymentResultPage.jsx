import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentResultPage({ status }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('payment_id');

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        <span className={`material-symbols-outlined text-5xl mb-4 ${
          isSuccess ? 'text-green-500' : 'text-amber-500'
        }`}>
          {isSuccess ? 'check_circle' : 'cancel'}
        </span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isSuccess ? 'Payment Successful' : 'Payment Cancelled'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {isSuccess
            ? 'Your payment was processed. You can now access your content from your dashboard.'
            : 'Your payment was cancelled. You can try again or browse other content.'}
        </p>
        {paymentId && (
          <p className="text-xs text-slate-400 mb-4">
            Reference: {paymentId}
          </p>
        )}
        <button
          onClick={() => navigate('/dashboard/student')}
          className="px-6 h-10 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
