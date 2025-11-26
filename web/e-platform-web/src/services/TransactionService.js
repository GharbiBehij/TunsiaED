const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class TransactionService {
  static async createTransaction(transactionData, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });
    if (!res.ok) throw new Error('Failed to create transaction');
    return res.json();
  }

  static async getUserTransactions(token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/my-transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user transactions');
    return res.json();
  }

  static async getTransactionById(transactionId, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transaction');
    return res.json();
  }

  static async getTransactionsByPayment(paymentId, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/payment/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions by payment');
    return res.json();
  }

  static async getCourseTransactions(courseId) {
    const res = await fetch(`${API_URL}/api/v1/transaction/course/${courseId}`);
    if (!res.ok) throw new Error('Failed to fetch course transactions');
    return res.json();
  }

  static async getTransactionsByStatus(status) {
    const res = await fetch(`${API_URL}/api/v1/transaction/status/${status}`);
    if (!res.ok) throw new Error('Failed to fetch transactions by status');
    return res.json();
  }

  static async updateTransaction(transactionId, transactionData, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/${transactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transactionData),
    });
    if (!res.ok) throw new Error('Failed to update transaction');
    return res.json();
  }
}

export default TransactionService;
