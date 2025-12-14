// src/context/CartContext.jsx
import React, { createContext, useContext } from 'react';
import {
  useGetCart,
  useAddToCart,
  useRemoveFromCart,
} from '../hooks';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const cartQuery = useGetCart();
  const addMutation = useAddToCart();
  const removeMutation = useRemoveFromCart();

  const cart = cartQuery.data;

  return (
    <CartContext.Provider
      value={{
        // Data
        cart,
        items: cart?.items ?? [],
        subtotal: cart?.subtotal ?? 0,
        itemCount: cart?.itemCount ?? 0,
        isLoading: cartQuery.isLoading,

        // Actions (NO logic here)
        addToCart: (course) => {
          // Transform course object to match cart API expectations
          const cartItem = {
            courseId: course.id || course.courseId,
            courseTitle: course.title || course.courseTitle,
            instructorName: course.instructorName,
            price: course.price,
            thumbnailUrl: course.thumbnailUrl,
          };
          addMutation.mutate(cartItem);
        },
        removeFromCart: removeMutation.mutate,
        addToCartMutation: addMutation,
        removeFromCartMutation: removeMutation,

        // Helpers
        isInCart: (courseId) =>
          cart?.items?.some(item => item.courseId === courseId),
        getCartTotal: () => cart?.subtotal ?? 0,
        getCartItemCount: () => cart?.itemCount ?? 0,
        incrementQuantity: (itemId) => {
          // This would need to be implemented if quantity management is needed
          console.warn('incrementQuantity not implemented');
        },
        decrementQuantity: (itemId) => {
          // This would need to be implemented if quantity management is needed
          console.warn('decrementQuantity not implemented');
        },
        clearCart: () => {
          // This would need to be implemented if clear cart is needed
          console.warn('clearCart not implemented');
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
}
