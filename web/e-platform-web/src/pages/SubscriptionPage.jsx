// src/pages/SubscriptionPage.jsx - Dynamic subscription plans page with Pricing UI
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscriptionPlans, useInitiateSubscription } from '../hooks'; // Updated to use centralized hooks
import { useAuth } from '../context/AuthContext';
import Header from '../components/home/Header/Header';
import Footer from '../components/home/Footer/Footer';

// Plan Card Component
const PlanCard = ({ plan, isPopular, isProcessing, onSubscribe, isStudent, isAuthenticated }) => {
  const isFree = !plan.price || plan.price === 0;
  const baseClasses = "flex flex-1 flex-col gap-6 rounded-xl border border-solid bg-white dark:bg-gray-800 p-6 transform transition-transform duration-300";
  const hoverClasses = isPopular ? "relative transform scale-[1.02] shadow-xl" : "hover:scale-[1.02]";
  const borderClasses = isPopular ? "border-2 border-solid border-primary" : "border-gray-200 dark:border-gray-700";

  return (
    <div className={`${baseClasses} ${borderClasses} ${hoverClasses}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold leading-tight text-[#111418] dark:text-white">{plan.name || 'Plan'}</h1>
          {isPopular && (
            <p className="text-white text-xs font-medium leading-normal tracking-[0.015em] rounded-full bg-accent-orange px-3 py-1 text-center">
              {plan.badge || 'Most Popular'}
            </p>
          )}
        </div>
        {plan.discount && plan.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {plan.discount}% OFF
          </div>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {plan.description || 'For learners'}
        </p>
        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-4xl font-black leading-tight tracking-[-0.033em] text-green-600">Free</span>
          ) : (
            <>
              <span className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
                {plan.price} TND
              </span>
              <span className="text-base font-bold leading-tight text-gray-500 dark:text-gray-400">
                /{plan.billingCycle || 'month'}
              </span>
            </>
          )}
        </div>
        {plan.originalPrice && plan.originalPrice > plan.price && (
          <div className="text-gray-500 line-through text-sm">
            {plan.originalPrice} TND
          </div>
        )}
      </div>
      <button
        onClick={() => onSubscribe(plan.id)}
        disabled={isProcessing || isFree || !isStudent}
        className={`flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition ${
          isPopular
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-100 dark:bg-gray-700 text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
            Processing...
          </span>
        ) : isFree ? (
          'Current Plan'
        ) : !isAuthenticated ? (
          'Sign Up to Subscribe'
        ) : !isStudent ? (
          'Students Only'
        ) : (
          plan.ctaText || 'Subscribe Now'
        )}
      </button>
      {plan.trialDays && plan.trialDays > 0 && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {plan.trialDays}-day free trial included
        </p>
      )}
      <div className="flex flex-col gap-3">
        {plan.features && plan.features.map((feature, index) => (
          <div
            key={index}
            className="text-sm font-normal leading-normal flex gap-3 items-center text-[#111418] dark:text-gray-300"
          >
            <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => (
  <details className="group rounded-lg bg-white dark:bg-gray-800 p-6 [&_summary::-webkit-details-marker]:hidden border border-gray-200 dark:border-gray-700">
    <summary className="flex cursor-pointer items-center justify-between gap-1.5">
      <h3 className="text-lg font-bold text-[#111418] dark:text-white">{question}</h3>
      <span className="relative size-5 shrink-0">
        <span className="material-symbols-outlined absolute inset-0 opacity-100 group-open:opacity-0 transition-opacity">add</span>
        <span className="material-symbols-outlined absolute inset-0 opacity-0 group-open:opacity-100 transition-opacity">remove</span>
      </span>
    </summary>
    <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{answer}</p>
  </details>
);

// FAQ Data
const faqData = [
  { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.' },
  { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express. All payments are processed securely.' },
  { question: 'What happens after my subscription ends?', answer: 'If your subscription ends, you will lose access to the premium course content. Any certificates you have earned will remain valid and accessible from your profile.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 7-day money-back guarantee. If you\'re not satisfied with your subscription, contact us within 7 days for a full refund.' },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isStudent, hasActiveSubscription } = useAuth();
  const { data: plans = [], isLoading, error } = useSubscriptionPlans();
  const initiateSubscription = useInitiateSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('Monthly');

  // Get redirect message if user was sent here from protected route
  const redirectMessage = location.state?.message;

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate(`/signup?redirect=/subscription`);
      return;
    }

    if (!isStudent) {
      alert('Only students can subscribe');
      return;
    }

    setSelectedPlan(planId);

    try {
      const result = await initiateSubscription.mutateAsync(planId);

      // result should contain paymentId from orchestrator
      if (!result.paymentId) {
        throw new Error('No paymentId returned from subscription initiation');
      }

      // Redirect to common payment flow (PaymentPage → SecureCheckout → Stripe)
      navigate(`/payment/${result.paymentId}`);
    } catch (error) {
      console.error('Failed to initiate subscription:', error);
      alert(error.message || 'Failed to start subscription. Please try again.');
      setSelectedPlan(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse mb-4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || plans.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Subscription Plans Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We're working on bringing you the best subscription options. Check back soon!
            </p>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Browse Courses
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-gray-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          
          <Header />
          
          {/* Alert message if redirected from protected content */}
          {redirectMessage && !hasActiveSubscription && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">info</span>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">{redirectMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Already subscribed message */}
          {hasActiveSubscription && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">verified</span>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    You already have an active subscription! You have access to all premium courses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10 md:py-16">
            <div className="layout-content-container flex flex-col max-w-6xl flex-1 gap-8">
              
              {/* Title and Subtitle */}
              <div className="flex flex-wrap justify-between gap-6 p-4 text-center">
                <div className="flex w-full flex-col gap-3">
                  <p className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] text-[#111418] dark:text-white">
                    Choose the Plan That's Right for You
                  </p>
                  <p className="text-base md:text-lg font-normal leading-normal text-gray-600 dark:text-gray-400">
                    Get unlimited access to our entire course library and start learning today.
                  </p>
                </div>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex px-4 py-3 justify-center">
                <div className="flex h-10 w-full max-w-xs items-center justify-center rounded-lg bg-gray-200 dark:bg-background-dark p-1">
                  {['Monthly', 'Annually'].map((cycle) => (
                    <label
                      key={cycle}
                      className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-colors duration-200
                        ${billingCycle === cycle 
                          ? 'bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)] text-[#111418] dark:bg-gray-700 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                        }`}
                      onClick={() => setBillingCycle(cycle)}
                    >
                      <span className="truncate">
                        {cycle}
                        {cycle === 'Annually' && <span className="text-accent-orange font-bold"> (Save 20%)</span>}
                      </span>
                      <input 
                        className="invisible w-0" 
                        name="billing-cycle" 
                        type="radio" 
                        value={cycle} 
                        checked={billingCycle === cycle}
                        readOnly
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-3">
                {plans.map((plan) => {
                  const isPopular = plan.isPopular || plan.featured;
                  const isProcessing = initiateSubscription.isPending && selectedPlan === plan.id;

                  return (
                    <PlanCard 
                      key={plan.id}
                      plan={plan}
                      isPopular={isPopular}
                      isProcessing={isProcessing}
                      onSubscribe={handleSubscribe}
                      isStudent={isStudent}
                      isAuthenticated={isAuthenticated}
                    />
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-8 text-center px-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  All plans include access to our community forum and certificate of completion
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Cancel anytime. No hidden fees. Secure payment powered by Stripe.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="mt-16">
                <h2 className="text-center text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-[#111418] dark:text-white">
                  Frequently Asked Questions
                </h2>
                <div className="mx-auto max-w-3xl space-y-4">
                  {faqData.map((item, index) => (
                    <FAQItem key={index} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>

            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
