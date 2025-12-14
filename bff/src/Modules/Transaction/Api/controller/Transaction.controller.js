// bff/src/Modules/Transaction/Api/controller/Transaction.controller.js
import { transactionService } from '../../service/Transaction.service.js';
import { userRepository } from '../../../User/repository/User.repository.js';

export class TransactionController {
  async createTransaction(req ,res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const data = req.body;
      const result = await transactionService.createTransaction(user, data);
      res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Unauthorized: Payment does not belong to user') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
  async deleteTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      await transactionService.deleteTransaction(transactionId);
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionById(req, res) {
    try {
      const { transactionId } = req.params;
      const transaction = await transactionService.getTransactionById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.status(200).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userRepository.findByUid(userId);
      const data= req.body;
      
      const result = await transactionService.updateTransaction(transactionId, user, data);
      
      if (!result) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionsByPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const transactions = await transactionService.getTransactionsByPayment(paymentId);
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserTransactions(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const transactions = await transactionService.getUserTransactions(userId);
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCourseTransactions(req, res) {
    try {
      const { courseId } = req.params;
      const transactions = await transactionService.getCourseTransactions(courseId);
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const transactions = await transactionService.getTransactionsByStatus(status);
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const transactionController = new TransactionController();

