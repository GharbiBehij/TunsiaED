const API_URL = process.env.REACT_APP_BFF_API_URL || 'https://tunsiaed.onrender.com';

class TransactionService {
  /**
   * Creates a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Created transaction data
   */
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

  /**
   * Fetches transactions for the authenticated user
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of user's transactions
   */
  static async getUserTransactions(token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/my-transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user transactions');
    return res.json();
  }

  /**
   * Fetches a specific transaction by ID
   * @param {string} transactionId - The ID of the transaction
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Transaction data
   */
  static async getTransactionById(transactionId, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transaction');
    return res.json();
  }

  /**
   * Fetches transactions associated with a payment
   * @param {string} paymentId - The ID of the payment
   * @param {string} token - Authentication token
   * @returns {Promise<Array>} List of transactions for the payment
   */
  static async getTransactionsByPayment(paymentId, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/payment/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions by payment');
    return res.json();
  }

  /**
   * Fetches transactions for a specific course
   * @param {string} courseId - The ID of the course
   * @param {string} token - Authentication token (requires admin or instructor role)
   * @returns {Promise<Array>} List of transactions for the course
   */
  static async getCourseTransactions(courseId, token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch course transactions');
    return res.json();
  }

  /**
   * Fetches transactions by status
   * @param {string} status - Transaction status (e.g., 'pending', 'completed')
   * @returns {Promise<Array>} List of transactions with the specified status
   */
  static async getTransactionsByStatus(status,token) {
    const res = await fetch(`${API_URL}/api/v1/transaction/status/${status}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions by status');
    return res.json();
  }
  /**
   * Updates an existing transaction
   * @param {string} transactionId - The ID of the transaction to update
   * @param {Object} transactionData - Updated transaction data
   * @param {string} token - Authentication token
   * @returns {Promise<Object>} Updated transaction data
   */
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
