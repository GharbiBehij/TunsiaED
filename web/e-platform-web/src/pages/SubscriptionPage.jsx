// src/pages/SubscriptionPage.jsx - Dynamic subscription plans page
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscriptionPlans, useInitiateSubscription } from '../hooks/useSubscription';
import { useAuth } from '../context/AuthContext';
import Header from '../components/home/Header/Header';
import Footer from '../components/home/Footer/Footer';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isStudent, hasActiveSubscription } = useAuth();
  const { data: plans = [], isLoading, error } = useSubscriptionPlans();
  const initiateSubscription = useInitiateSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);

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
      // Redirect to payment page
      navigate(`/payment/${result.paymentId}`);
    } catch (error) {
      console.error('Failed to initiate subscription:', error);
      alert('Failed to start subscription. Please try again.');
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
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
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Choose Your Learning Plan</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Unlock unlimited access to our entire course library and accelerate your learning journey
          </p>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isPopular = plan.isPopular || plan.featured;
              const isFree = !plan.price || plan.price === 0;
              const isProcessing = initiateSubscription.isPending && selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl p-8 border-2 transition-transform hover:scale-105 ${
                    isPopular 
                      ? 'border-primary shadow-2xl' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white text-xs font-bold px-4 py-1 rounded-full">
                      {plan.badge || 'MOST POPULAR'}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {plan.discount && plan.originalPrice && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {plan.discount}% OFF
                    </div>
                  )}

                  {/* Plan Name */}
                  <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name || 'Plan'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description || 'For learners'}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    {isFree ? (
                      <div className="text-4xl font-bold text-green-600">Free</div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </span>
                          <span className="text-xl text-gray-600 dark:text-gray-400">
                            TND/{plan.billingCycle || 'month'}
                          </span>
                        </div>
                        {plan.originalPrice && plan.originalPrice > plan.price && (
                          <div className="text-gray-500 line-through text-lg mt-1">
                            {plan.originalPrice} TND
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features && plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="material-symbols-outlined text-green-500 text-base mt-0.5">
                          check_circle
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing || isFree}
                    className={`w-full py-4 rounded-lg font-bold transition ${
                      isPopular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    } ${isFree ? 'opacity-50 cursor-not-allowed' : ''} disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Processing...
                      </span>
                    ) : isFree ? (
                      'Current Plan'
                    ) : (
                      plan.ctaText || 'Subscribe Now'
                    )}
                  </button>

                  {/* Trial Info */}
                  {plan.trialDays && plan.trialDays > 0 && (
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                      {plan.trialDays}-day free trial included
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include access to our community forum and certificate of completion
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Cancel anytime. No hidden fees. Secure payment powered by Paymee.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
