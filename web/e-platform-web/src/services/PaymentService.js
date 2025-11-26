const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class PaymentService {
  static async createPayment(paymentData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to create payment');
    return res.json();
  }

  static async getUserPayments(token) {
    const res = await fetch(`${API_URL}/api/v1/payment/my-payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user payments');
    return res.json();
  }

  static async getPaymentById(paymentId, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch payment');
    return res.json();
  }

  static async getCoursePayments(courseId) {
    const res = await fetch(`${API_URL}/api/v1/payment/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course payments');
    return res.json();
  }

  static async getPaymentsByStatus(status) {
    const res = await fetch(`${API_URL}/api/v1/payment/status/${status}`);
    if (!res.ok) throw new Error('Failed to fetch payments by status');
    return res.json();
  }

  static async updatePayment(paymentId, paymentData, token) {
    const res = await fetch(`${API_URL}/api/v1/payment/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error('Failed to update payment');
    return res.json();
  }
}

export default PaymentService;
