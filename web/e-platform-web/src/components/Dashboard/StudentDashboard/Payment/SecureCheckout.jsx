// SecureCheckout - Payment form widget for course/subscription purchases
// Uses useInitiatePurchase and useCompletePurchase hooks for payment flow
// Payment types: 'course_purchase' | 'subscription'
// Payment methods: 'card' | 'paypal' | 'paymee' (Tunisian gateway)
// Test mode: Uses simulation endpoint for testing when Paymee sandbox is down

import React, { useState, useEffect, useRef } from 'react';
import { 
  useInitiatePurchase, 
  useCompletePurchase, 
  useInitiatePaymeePayment,
  usePaymeePaymentStatus,
  useSimulatePayment 
} from '../../../../hooks/Payment/usePayment';

/**
 * PaymentMethodCard - Selectable payment method option
 * @param {string} method - Payment method ID
 * @param {string} label - Display label
 * @param {string} icon - Material symbol icon name
 * @param {string} description - Optional description text
 * @param {boolean} selected - Whether this method is selected
 * @param {Function} onSelect - Callback when selected
 */
const PaymentMethodCard = ({ method, label, icon, description, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(method)}
    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition text-left ${
      selected 
        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
    }`}
  >
    <span className={`material-symbols-outlined text-2xl ${selected ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
      {icon}
    </span>
    <div>
      <span className={`font-medium block ${selected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
        {label}
      </span>
      {description && (
        <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>
      )}
    </div>
  </button>
);

/**
 * PaymeeIframe - Embedded Paymee gateway iframe
 * Listens for paymee.complete event
 */
const PaymeeIframe = ({ gatewayUrl, onComplete, onError }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Listen for Paymee completion event
    const handleMessage = (event) => {
      if (event.data?.event_id === 'paymee.complete') {
        console.log('Paymee payment complete event received');
        onComplete();
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  return (
    <div className="relative w-full" style={{ minHeight: '500px' }}>
      <iframe
        ref={iframeRef}
        src={gatewayUrl}
        className="w-full h-full absolute inset-0 rounded-lg border border-slate-200 dark:border-slate-700"
        style={{ minHeight: '500px' }}
        title="Paymee Payment Gateway"
        allow="payment"
      />
    </div>
  );
};

/**
 * SecureCheckout - Payment form widget
 * @param {Object} data - Checkout data { items, courseId, subtotal, tax, total, paymentType }
 * @param {boolean} isLoading - Loading state from dashboard
 * @param {boolean} isError - Error state from dashboard
 * @param {boolean} testMode - Enable test mode for simulation (default: false)
 * @param {Function} onSuccess - Callback on successful payment
 * @param {Function} onCancel - Callback when user cancels checkout
 */
export default function SecureCheckout({ 
  data = {}, 
  isLoading = false, 
  isError = false,
  testMode = false, // Enable test mode when Paymee sandbox is unavailable
  onSuccess,
  onCancel
}) {
  const [paymentMethod, setPaymentMethod] = useState('paymee'); // Default to Paymee for Tunisia
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'paymee-iframe' | 'processing' | 'success' | 'error'
  const [paymeeToken, setPaymeeToken] = useState(null);
  const [paymeeGatewayUrl, setPaymeeGatewayUrl] = useState(null);
  const [isTestMode, setIsTestMode] = useState(testMode);
  const [simulateSuccess, setSimulateSuccess] = useState(true);

  // Payment hooks
  const initiatePurchase = useInitiatePurchase();
  const completePurchase = useCompletePurchase();
  const initiatePaymee = useInitiatePaymeePayment();
  const simulatePayment = useSimulatePayment();
  
  // Poll Paymee status after iframe completion
  const { data: paymeeStatus, refetch: refetchPaymeeStatus } = usePaymeePaymentStatus(
    paymeeToken, 
    { 
      enabled: !!paymeeToken && step === 'processing',
      refetchInterval: step === 'processing' ? 2000 : false, // Poll every 2 seconds
    }
  );

  // Check Paymee status when polling
  useEffect(() => {
    if (paymeeStatus) {
      if (paymeeStatus.status === 'completed') {
        setStep('success');
        if (onSuccess) onSuccess(paymeeStatus);
      } else if (paymeeStatus.status === 'failed') {
        setStep('error');
      }
    }
  }, [paymeeStatus, onSuccess]);

  // Extract checkout data
  const { 
    items = [], 
    courseId, 
    subtotal = 0, 
    tax = 0, 
    total = 0, 
    paymentType = 'course_purchase',
    subscriptionType, // 'monthly' | 'yearly' (only for subscription)
    // User info for Paymee
    firstName,
    lastName,
    email,
  } = data;

  const formatCurrency = (amount) => `${Number(amount).toFixed(2)} TND`;

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format expiry date
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiryDate(value);
    }
  };

  // Handle CVV input
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  // Handle phone input for Paymee
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d+]/g, '').slice(0, 12);
    setPhone(value);
  };

  // Validate form
  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return (
        cardNumber.replace(/\s/g, '').length === 16 &&
        expiryDate.length === 5 &&
        cvv.length >= 3 &&
        cardholderName.trim().length >= 2
      );
    }
    if (paymentMethod === 'paymee') {
      // Phone is required for Paymee
      return phone.length >= 8;
    }
    // For PayPal, just need to be selected
    return true;
  };

  // Handle Paymee iframe completion
  const handlePaymeeComplete = () => {
    setStep('processing');
    // Start polling for payment status
    refetchPaymeeStatus();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Test mode - use simulation endpoint
    if (isTestMode) {
      try {
        setStep('processing');
        
        const result = await simulatePayment.mutateAsync({
          courseId: courseId || items[0]?.courseId,
          simulateSuccess: simulateSuccess,
        });

        if (result.success) {
          setStep('success');
          if (onSuccess) onSuccess(result);
        } else {
          setStep('error');
        }
      } catch (error) {
        console.error('Payment simulation failed:', error);
        setStep('error');
      }
      return;
    }

    if (!isFormValid()) return;

    // Paymee payment flow
    if (paymentMethod === 'paymee') {
      try {
        setStep('processing');
        
        const paymeeData = {
          courseId: courseId || items[0]?.courseId,
          amount: total,
          note: items.length > 0 ? `Course: ${items[0]?.title}` : 'Course Purchase',
          firstName: firstName || 'Customer',
          lastName: lastName || 'User',
          email: email || '',
          phone: phone,
        };

        const result = await initiatePaymee.mutateAsync(paymeeData);
        
        setPaymeeToken(result.paymeeToken);
        setPaymeeGatewayUrl(result.gatewayUrl);
        setStep('paymee-iframe');
      } catch (error) {
        console.error('Paymee initiation failed:', error);
        setStep('error');
      }
      return;
    }

    // Standard payment flow (card/PayPal)
    setStep('processing');

    try {
      // Step 1: Initiate purchase
      const purchaseData = {
        courseId: courseId || items[0]?.courseId,
        paymentType,
        subscriptionType,
        paymentMethod,
      };

      const initiateResult = await initiatePurchase.mutateAsync(purchaseData);

      // Step 2: Complete purchase (simulating payment gateway confirmation)
      const confirmationData = {
        paymentId: initiateResult.paymentId,
        gatewayTransactionId: `TXN_${Date.now()}`, // In real app, this comes from payment gateway
        paymentGateway: paymentMethod,
      };

      const completeResult = await completePurchase.mutateAsync(confirmationData);

      setStep('success');
      
      if (onSuccess) {
        onSuccess(completeResult);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('form');
    setPaymeeToken(null);
    setPaymeeGatewayUrl(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Paymee iframe State
  if (step === 'paymee-iframe' && paymeeGatewayUrl) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">payments</span>
            Paymee Payment
          </h2>
          <button
            onClick={handleRetry}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Complete your payment securely with Paymee. 
            <span className="block text-xs mt-1 text-slate-500">
              Test account: Phone: 11111111 | Password: 11111111
            </span>
          </p>
          <PaymeeIframe 
            gatewayUrl={paymeeGatewayUrl} 
            onComplete={handlePaymeeComplete}
            onError={() => setStep('error')}
          />
        </div>
      </div>
    );
  }

  // Processing State
  if (step === 'processing') {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431] p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Processing Payment
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  // Success State
  if (step === 'success') {
    return (
      <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-green-500 mb-4">check_circle</span>
          <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-2">
            Payment Successful!
          </h3>
          <p className="text-green-600 dark:text-green-500 mb-4">
            Your purchase has been completed successfully.
          </p>
          <button
            onClick={() => onSuccess && onSuccess()}
            className="px-6 h-10 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition"
          >
            Continue to Course
          </button>
        </div>
      </div>
    );
  }

  // Error State
  if (step === 'error' || isError) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
            Payment Failed
          </h3>
          <p className="text-red-600 dark:text-red-500 mb-4">
            There was an issue processing your payment. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 h-10 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition"
            >
              Try Again
            </button>
            <button
              onClick={onCancel}
              className="px-6 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">lock</span>
          Secure Checkout
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Order Summary */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Order Summary
          </h3>
          {items.length > 0 ? (
            <div className="space-y-2 mb-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400 truncate">{item.title}</span>
                  <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {paymentType === 'subscription' ? `${subscriptionType} Subscription` : 'Course Purchase'}
            </p>
          )}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <span className="font-bold text-slate-900 dark:text-white">Total</span>
            <span className="font-bold text-primary">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Test Mode Toggle - Development Only */}
        {(testMode || process.env.NODE_ENV === 'development') && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">science</span>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Test Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTestMode}
                  onChange={(e) => setIsTestMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-yellow-500"></div>
              </label>
            </div>
            {isTestMode && (
              <div className="space-y-2">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Test mode bypasses Paymee and simulates payment. Email notification will be sent.
                </p>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="simulateResult"
                      checked={simulateSuccess}
                      onChange={() => setSimulateSuccess(true)}
                      className="text-green-500"
                    />
                    <span className="text-green-700 dark:text-green-400">Simulate Success</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="simulateResult"
                      checked={!simulateSuccess}
                      onChange={() => setSimulateSuccess(false)}
                      className="text-red-500"
                    />
                    <span className="text-red-700 dark:text-red-400">Simulate Failure</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PaymentMethodCard
              method="paymee"
              label="Paymee"
              icon="account_balance"
              description="Tunisia"
              selected={paymentMethod === 'paymee'}
              onSelect={setPaymentMethod}
            />
            <PaymentMethodCard
              method="card"
              label="Credit Card"
              icon="credit_card"
              description="Visa, Mastercard"
              selected={paymentMethod === 'card'}
              onSelect={setPaymentMethod}
            />
            <PaymentMethodCard
              method="paypal"
              label="PayPal"
              icon="account_balance_wallet"
              description="International"
              selected={paymentMethod === 'paypal'}
              onSelect={setPaymentMethod}
            />
          </div>
        </div>

        {/* Paymee Phone Input */}
        {paymentMethod === 'paymee' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+216 XX XXX XXX"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter your Tunisian phone number for Paymee
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <span className="material-symbols-outlined text-base align-middle mr-1">info</span>
                You will complete payment in a secure Paymee window.
              </p>
            </div>
          </div>
        )}

        {/* Card Details (only for card payment) */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* PayPal Message */}
        {paymentMethod === 'paypal' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              You will be redirected to PayPal to complete your payment.
            </p>
          </div>
        )}

        {/* Security Note */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={(!isTestMode && !isFormValid()) || initiatePurchase.isPending || completePurchase.isPending || initiatePaymee.isPending || simulatePayment.isPending}
          className="w-full mt-6 h-12 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">{isTestMode ? 'science' : 'lock'}</span>
          {isTestMode 
            ? `Test Payment - ${formatCurrency(total)}`
            : paymentMethod === 'paymee' 
              ? `Pay with Paymee - ${formatCurrency(total)}` 
              : `Pay ${formatCurrency(total)}`
          }
        </button>
      </form>
    </div>
  );
}
