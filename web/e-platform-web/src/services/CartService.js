const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});
export class CartService {
  static async getCart(token) {
    const res = await fetch(`${API_URL}/api/v1/cart`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
  }

  static async addItem(token, payload) {
    const res = await fetch(`${API_URL}/api/v1/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
  }
  static async checkout(token) {
  const res = await fetch(`${API_URL}/api/v1/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to checkout cart');
  return res.json(); // { paymentId, amount }
}
  static async removeItem(token, itemId) {
    const res = await fetch(`${API_URL}/api/v1/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to remove item');
    return res.json();
  }

  static async applyPromo(token, code) {
    const res = await fetch(`${API_URL}/api/v1/cart/promo`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error('Invalid promo code');
    return res.json();
  }

  static async removePromo(token) {
    const res = await fetch(`${API_URL}/api/v1/cart/promo`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to remove promo');
    return res.json();
  }
}
