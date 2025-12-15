// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApplyPromo, useRemovePromo } from '../hooks';
import { useCartCheckout } from '../hooks/Cart/useCart';
import Header from '../components/home/Header/Header';

const TAX_RATE = 0.08;

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items: cartItems,
    removeFromCart,
    removeFromCartMutation,
    isLoading: cartLoading,
    subtotal: cartSubtotal,
  } = useCartContext();
  const applyPromo = useApplyPromo();
  const removePromo = useRemovePromo();
  const { checkout, isLoading: isCheckoutLoading } = useCartCheckout();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  useEffect(() => {
    const shouldClear = sessionStorage.getItem('cartCleared');
    if (shouldClear === 'true') {
      sessionStorage.removeItem('cartCleared');
    }
  }, []);

  const subtotal = cartSubtotal || 0;
  const discountedSubtotal = subtotal - promoDiscount;
  const tax = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + tax;

  const formatCurrency = (amount) => `${Number(amount).toFixed(2)} TND`;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true);
    setPromoError('');

    try {
      await applyPromo.mutateAsync({ code: promoCode.trim() });
      setPromoApplied(true);
      setPromoError('');
    } catch (error) {
      setPromoError(error?.message || 'Invalid promo code');
      setPromoApplied(false);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = async () => {
    try {
      await removePromo.mutateAsync();
      setPromoCode('');
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoError('');
    } catch (error) {
      setPromoError(error?.message || 'Failed to remove promo code');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    if (cartItems.length === 0) return;

    try {
      const checkoutUrl = await checkout();
      sessionStorage.setItem('clearCartOnSuccess', 'true');
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to process checkout:', error);
      alert(error.message || 'Failed to process checkout. Please try again.');
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <span
                className="material-symbols-outlined text-gray-400 dark:text-gray-600"
                style={{ fontSize: '120px' }}
              >
                shopping_cart
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Loading your cart...
            </h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <span
                className="material-symbols-outlined text-gray-400 dark:text-gray-600"
                style={{ fontSize: '120px' }}
              >
                shopping_cart
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start learning today! Browse our courses and add them to your cart.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.itemId}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex gap-6"
                >
                  <div
                    className="w-32 h-20 flex-shrink-0 bg-cover bg-center rounded-lg"
                    style={{
                      backgroundImage: item.thumbnailUrl
                        ? `url("${item.thumbnailUrl}")`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {item.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      By {item.instructorName}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(item.price)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.itemId)}
                        disabled={removeFromCartMutation.isPending}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 disabled:opacity-50"
                        aria-label="Remove from cart"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                    />
                    {promoApplied ? (
                      <button
                        onClick={handleRemovePromo}
                        disabled={removePromo.isPending}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                      >
                        {removePromo.isPending ? 'Removing...' : 'Remove'}
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyPromo}
                        disabled={isValidatingPromo || !promoCode.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                      >
                        {isValidatingPromo ? 'Checking...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-sm mt-2">{promoError}</p>
                  )}
                  {promoApplied && (
                    <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Promo code applied!
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span>-{formatCurrency(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text:white mb-6">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckoutLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">lock</span>
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Secure payment powered by Paymee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
