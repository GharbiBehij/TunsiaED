import React, { useState, useEffect } from 'react';
import { 
  useInitiatePurchase, 
  useCompletePurchase, 
  useInitiateStripePayment,   // now mapped to Paymee under the hood
  useStripePaymentStatus,     // optional status polling
  useSimulatePayment 
} from '../../../../hooks';

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

// Generic external checkout redirect (used for Paymee)
const ExternalCheckout = ({ checkoutUrl }) => {
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: '500px' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Redirecting to payment gateway...</p>
      </div>
    </div>
  );
};

export default function SecureCheckout({ 
  data = {}, 
  isLoading = false,   
  isError = false, 
  testMode = false,
  onSuccess,
  onCancel
}) {
  const [paymentMethod, setPaymentMethod] = useState('paymee');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'paymee-redirect' | 'processing' | 'success' | 'error'
  const [gatewaySessionId, setGatewaySessionId] = useState(null);
  const [gatewayCheckoutUrl, setGatewayCheckoutUrl] = useState(null);
  const [isTestMode, setIsTestMode] = useState(testMode);
  const [simulateSuccess, setSimulateSuccess] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Hooks
  const initiatePurchase = useInitiatePurchase();
  const completePurchase = useCompletePurchase();
  const initiatePaymee = useInitiateStripePayment();    // same hook name, Paymee under the hood
  const simulatePayment = useSimulatePayment();

  // Reset on new payment
  useEffect(() => {
    setStep('form');
    setGatewaySessionId(null);
    setGatewayCheckoutUrl(null);
    setErrorMessage('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setPhone('');
  }, [data.paymentId, data.courseId]);

  // Optional status polling (can be left as-is)
  const { data: gatewayStatus } = useStripePaymentStatus(
    gatewaySessionId, 
    { 
      enabled: !!gatewaySessionId && step === 'processing',
      refetchInterval: step === 'processing' ? 2000 : false,
    }
  );

  useEffect(() => {
    if (gatewayStatus) {
      if (gatewayStatus.status === 'completed') {
        setStep('success');
        if (onSuccess) onSuccess(gatewayStatus);
      } else if (gatewayStatus.status === 'failed') {
        setStep('error');
        setErrorMessage('Payment failed. Please try again.');
      }
    }
  }, [gatewayStatus, onSuccess]);

  const { 
    paymentId,
    items = [], 
    courseId, 
    total = 0, 
    paymentType = 'course_purchase',
    subscriptionType,
    firstName,
    lastName,
    email,
  } = data;

  const formatCurrency = (amount) => `${Number(amount).toFixed(2)} TND`;

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiryDate(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d+]/g, '').slice(0, 12);
    setPhone(value);
  };

  const isFormValid = () => {
    if (!courseId && (!items || items.length === 0)) return false;
    if (total <= 0) return false;
    
    if (paymentMethod === 'card') {
      return (
        cardNumber.replace(/\s/g, '').length === 16 &&
        expiryDate.length === 5 &&
        cvv.length >= 3 &&
        cardholderName.trim().length >= 2
      );
    }
    if (paymentMethod === 'paymee') {
      return (courseId || (items && items.length > 0)) && total > 0;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isTestMode) {
      try {
        setStep('processing');
        setErrorMessage('');
        
        const result = await simulatePayment.mutateAsync({
          courseId: courseId || items[0]?.courseId,
          simulateSuccess,
        });

        if (result.success) {
          setStep('success');
          if (onSuccess) onSuccess(result);
        } else {
          setStep('error');
          setErrorMessage('Payment simulation failed as requested.');
        }
      } catch (error) {
        console.error('Payment simulation failed:', error);
        setStep('error');
        setErrorMessage(error.message || 'Payment simulation failed.');
      }
      return;
    }

    if (!isFormValid()) return;

    // Paymee flow (previously Stripe)
    if (paymentMethod === 'paymee') {
      try {
        setStep('processing');
        setErrorMessage('');
        
        const paymeeData = {
          paymentId,
          courseId: courseId || items[0]?.courseId,
          amount: total,
          note: items.length > 0 ? `Course: ${items[0]?.title}` : 'Course Purchase',
          firstName: firstName || 'Customer',
          lastName: lastName || 'User',
          email: email || '',
          phone,
        };

        const result = await initiatePaymee.mutateAsync(paymeeData);
        
        if (result.sessionId && result.checkoutUrl) {
          setGatewaySessionId(result.sessionId);
          setGatewayCheckoutUrl(result.checkoutUrl);
          setStep('paymee-redirect');
        } else {
          throw new Error('Invalid Paymee response');
        }
      } catch (error) {
        console.error('Paymee initiation failed:', error);
        setStep('error');
        setErrorMessage(error.message || 'Failed to initiate Paymee checkout. Please try again.');
      }
      return;
    }

    // Simulated card/PayPal flow (same as before)
    setStep('processing');
    setErrorMessage('');

    try {
      const purchaseData = {
        paymentId,
        courseId: courseId || items[0]?.courseId,
        paymentType,
        subscriptionType,
        paymentMethod,
      };

      const initiateResult = await initiatePurchase.mutateAsync(purchaseData);

      if (!initiateResult.paymentId) {
        throw new Error('Failed to initiate purchase. Please try again.');
      }

      const confirmationData = {
        paymentId: initiateResult.paymentId,
        gatewayTransactionId: `TXN_${Date.now()}`,
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
      setErrorMessage(error.message || 'Payment processing failed. Please try again.');
    }
  };

  const handleRetry = () => {
    setStep('form');
    setGatewaySessionId(null);
    setGatewayCheckoutUrl(null);
    setErrorMessage('');
    initiatePurchase.reset();
    completePurchase.reset();
    initiatePaymee.reset();
    simulatePayment.reset();
  };

  // Loading
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

  // Paymee redirect
  if (step === 'paymee-redirect' && gatewayCheckoutUrl) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">payments</span>
            Paymee Checkout
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
          </p>
          <ExternalCheckout checkoutUrl={gatewayCheckoutUrl} />
        </div>
      </div>
    );
  }

  // Processing
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

  // Success
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

  // Error
  if (step === 'error' || isError) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
            Payment Failed
          </h3>
          <p className="text-red-600 dark:text-red-500 mb-4">
            {errorMessage || 'There was an issue processing your payment. Please try again.'}
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

  // Form
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431]">
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

        {/* Test Mode */}
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

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PaymentMethodCard
              method="paymee"
              label="Paymee"
              icon="credit_card"
              description="Local gateway"
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
              description="Alternative"
              selected={paymentMethod === 'paypal'}
              onSelect={setPaymentMethod}
            />
          </div>
        </div>

        {/* Paymee phone input */}
        {paymentMethod === 'paymee' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+216 XX XXX XXX"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter your phone number (optional)
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <span className="material-symbols-outlined text-base align-middle mr-1">info</span>
                You will be redirected to Paymee Checkout to complete your payment securely.
              </p>
            </div>
          </div>
        )}

        {/* Card details */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
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

        {/* PayPal message */}
        {paymentMethod === 'paypal' && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              You will be redirected to PayPal to complete your payment.
            </p>
          </div>
        )}

        {/* Security note */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>Your payment information is encrypted and secure</span>
        </div>

        {/* Submit button */}
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
