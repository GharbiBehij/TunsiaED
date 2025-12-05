const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class SubscriptionService {
  /**
   * Fetches all available subscription plans
   * @returns {Promise<Array>} List of subscription plans
   */
  static async getSubscriptionPlans() {
    const res = await fetch(`${API_URL}/api/v1/payment/subscriptions/plans`);
    if (!res.ok) throw new Error('Failed to fetch subscription plans');
    return res.json();
  }

  /**
   * Fetches a specific subscription plan by ID
   * @param {string} planId - The ID of the plan
   * @returns {Promise<Object>} Subscription plan data
   */
  static async getSubscriptionPlanById(planId) {
    const res = await fetch(`${API_URL}/api/v1/payment/subscriptions/plans/${planId}`);
    if (!res.ok) throw new Error('Failed to fetch subscription plan');
    return res.json();
  }

  /**
   * Initiates subscription purchase
   * @param {string} planId - The subscription plan ID
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Payment data with paymentId
   */
  static async initiateSubscription(planId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/purchase/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        planId,
        paymentType: 'subscription',
        paymentMethod: 'paymee',
      }),
    });
    if (!res.ok) throw new Error('Failed to initiate subscription');
    return res.json();
  }
}

export default SubscriptionService;
