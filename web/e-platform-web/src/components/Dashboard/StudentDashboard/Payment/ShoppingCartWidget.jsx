// ShoppingCartWidget - Dashboard widget for shopping cart
// Connects to payment hooks for course purchase flow
// Receives cart items from dashboard data or context

import React, { useState, useMemo } from 'react';
import PromoCodeService from '../../../../services/PromoCodeService';

const TAX_RATE = 0.08; // 8% tax rate

/**
 * CartItem - Renders a single cart item row
 * @param {Object} item - Cart item { id, courseId, title, instructor, price, thumbnailUrl }
 * @param {Function} onRemove - Callback to remove item from cart
 */
const CartItem = ({ item, onRemove }) => {
  const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      {/* Thumbnail */}
      <div
        className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg w-24 h-14 flex-shrink-0"
        style={{ backgroundImage: `url("${item.thumbnailUrl || '/placeholder-course.jpg'}")` }}
      />
      
      {/* Course Info */}
      <div className="flex-1 min-w-0">
        <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{item.title}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs">By {item.instructor}</p>
      </div>
      
      {/* Price */}
      <div className="text-right">
        <p className="text-slate-900 dark:text-white text-sm font-semibold">
          {formatCurrency(item.price)}
        </p>
      </div>
      
      {/* Remove Button */}
      <button
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title} from cart`}
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    </div>
  );
};

/**
 * ShoppingCartWidget - Dashboard widget for shopping cart
 * @param {Array} data - Cart items array [{ id, courseId, title, instructor, price, thumbnailUrl }]
 * @param {boolean} isLoading - Loading state from dashboard
 * @param {boolean} isError - Error state from dashboard
 * @param {Function} onCheckout - Callback when proceeding to checkout
 * @param {Function} onRemoveItem - Callback to remove item from cart
 */
export default function ShoppingCartWidget({ 
  data = [], 
  isLoading = false, 
  isError = false,
  onCheckout,
  onRemoveItem
}) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Calculate totals
  const { subtotal, tax, total, finalTotal } = useMemo(() => {
    const items = data || [];
    const calculatedSubtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const discountedSubtotal = calculatedSubtotal - promoDiscount;
    const calculatedTax = discountedSubtotal * TAX_RATE;
    const calculatedTotal = calculatedSubtotal + calculatedTax;
    const calculatedFinalTotal = discountedSubtotal + calculatedTax;
    return {
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      total: calculatedTotal,
      finalTotal: calculatedFinalTotal,
    };
  }, [data, promoDiscount]);

  const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    setPromoError('');
    
    try {
      // Get first course ID for course-specific promos
      const courseId = data && data.length > 0 ? data[0].courseId : null;
      
      const result = await PromoCodeService.validatePromoCode(
        promoCode.trim(),
        subtotal,
        courseId
      );
      
      if (result.valid) {
        setPromoApplied(true);
        setPromoDiscount(result.discount || 0);
        setPromoError('');
      } else {
        setPromoError(result.error || 'Invalid promo code');
        setPromoApplied(false);
        setPromoDiscount(0);
      }
    } catch (error) {
      setPromoError(error.message || 'Failed to validate promo code');
      setPromoApplied(false);
      setPromoDiscount(0);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoError('');
  };

  const handleCheckout = () => {
    if (onCheckout && data?.length > 0) {
      onCheckout({
        items: data,
        subtotal,
        discount: promoDiscount,
        tax,
        total: finalTotal,
        promoCode: promoApplied ? promoCode : null,
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431] p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 h-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <p className="text-red-600 dark:text-red-400 text-center">
          <span className="material-symbols-outlined text-2xl mb-2">error</span>
          <br />
          Failed to load cart. Please try again.
        </p>
      </div>
    );
  }

  const cartItems = data || [];

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182431]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">shopping_cart</span>
          Shopping Cart ({cartItems.length})
        </h2>
      </div>

      {/* Cart Items */}
      <div className="max-h-80 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onRemove={handleRemoveItem}
            />
          ))
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {/* Promo Code */}
          <div className="mb-4">
            <label className="text-slate-700 dark:text-slate-300 text-xs font-medium mb-1 block">
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 form-input rounded-lg text-sm h-9 px-3 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
              />
              {promoApplied ? (
                <button
                  className="px-4 h-9 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                  onClick={handleRemovePromo}
                >
                  Remove
                </button>
              ) : (
                <button
                  className="px-4 h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || isValidatingPromo}
                >
                  {isValidatingPromo ? 'Checking...' : 'Apply'}
                </button>
              )}
            </div>
            {promoError && (
              <p className="text-red-500 text-xs mt-1">{promoError}</p>
            )}
            {promoApplied && promoDiscount > 0 && (
              <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Promo code applied! You save {formatCurrency(promoDiscount)}
              </p>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Tax ({TAX_RATE * 100}%)</span>
              <span className="text-slate-900 dark:text-white font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-900 dark:text-white font-bold">Total</span>
              <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            className="w-full mt-4 h-10 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
