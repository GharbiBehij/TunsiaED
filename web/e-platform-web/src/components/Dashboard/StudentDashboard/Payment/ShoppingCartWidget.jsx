import React, { useState } from 'react';

const CartItem = ({ item, onRemove }) => {
  const formatCurrency = (v) => `$${Number(v).toFixed(2)}`;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
      <div
        className="w-24 h-14 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${item.thumbnailUrl || '/placeholder-course.jpg'})` }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{item.title}</p>
        <p className="text-xs text-slate-500">By {item.instructor}</p>
      </div>

      <p className="text-sm font-semibold">
        {formatCurrency(item.price)}
      </p>

      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700"
        aria-label="Remove item"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};

export default function ShoppingCartWidget({
  cart,
  isLoading,
  isError,
  onRemoveItem,
  onApplyPromo,
  onRemovePromo,
  onCheckout
}) {
  const [promoCode, setPromoCode] = useState('');

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-white dark:bg-[#182431]">
        <p className="animate-pulse text-slate-400">Loading cart…</p>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="p-6 rounded-lg bg-red-50 text-red-600">
        Failed to load cart
      </div>
    );
  }

  const {
    items,
    subtotal,
    tax,
    discount,
    total,
    promoCode: appliedPromo
  } = cart;

  const formatCurrency = (v) => `$${Number(v).toFixed(2)}`;

  return (
    <div className="rounded-lg border bg-white dark:bg-[#182431]">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined">shopping_cart</span>
          Shopping Cart ({items.length})
        </h2>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Your cart is empty
          </div>
        ) : (
          items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/40">
          {/* Promo */}
          <div className="mb-4">
            <label className="text-xs font-medium block mb-1">
              Promo Code
            </label>

            {appliedPromo ? (
              <div className="flex justify-between items-center text-green-600">
                <span>Applied: {appliedPromo}</span>
                <button onClick={onRemovePromo} className="text-red-500 text-sm">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  className="flex-1 h-9 px-3 rounded border"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
                <button
                  className="px-4 rounded bg-primary text-white"
                  onClick={() => onApplyPromo(promoCode)}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <Row label="Subtotal" value={subtotal} />
            {discount > 0 && (
              <Row label="Discount" value={-discount} highlight />
            )}
            <Row label="Tax" value={tax} />
            <Row label="Total" value={total} bold />
          </div>

          <button
            className="w-full mt-4 h-10 rounded bg-primary text-white font-bold"
            onClick={onCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, highlight }) {
  const cls = highlight
    ? 'text-green-600'
    : 'text-slate-900';

  return (
    <div className={`flex justify-between ${bold ? 'font-bold' : ''} ${cls}`}>
      <span>{label}</span>
      <span>${Number(value).toFixed(2)}</span>
    </div>
  );
}
