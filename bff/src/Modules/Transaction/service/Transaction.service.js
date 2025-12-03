// src/modules/Transaction/service/Transaction.service.js
// Single-module operations only. Cross-module operations are in TransactionPayment.orchestrator.js
import { transactionRepository } from '../repository/Transaction.repository.js';
import { TransactionPermission } from './TransactionPermission.js';
import { TransactionMapper } from '../mapper/Transaction.mapper.js';

export class TransactionService {
  // Helper: Map raw data to model (Transaction uses snake_case in Firestore)
  _toModel(raw) {
    return raw ? TransactionMapper.toModel(raw, raw.transactionId) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => TransactionMapper.toModel(raw, raw.transactionId));
  }

  _toEntity(model) {
    return TransactionMapper.toEntity(model);
  }

  async getTransactionById(transactionId) {
    const raw = await transactionRepository.findByTransactionId(transactionId);
    return this._toModel(raw);
  }

  async getTransactionsByPayment(paymentId) {
    const rawList = await transactionRepository.findTransactionsByPayment(paymentId);
    return this._toModels(rawList);
  }

  async getUserTransactions(userId) {
    const rawList = await transactionRepository.findTransactionsByUser(userId);
    return this._toModels(rawList);
  }

  async getCourseTransactions(courseId) {
    const rawList = await transactionRepository.findTransactionsByCourse(courseId);
    return this._toModels(rawList);
  }

  async getTransactionsByStatus(status) {
    const rawList = await transactionRepository.findTransactionsByStatus(status);
    return this._toModels(rawList);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get transaction by ID (internal - bypasses permission for orchestrator)
   * @param {string} transactionId
   */
  async getTransactionByIdInternal(transactionId) {
    const raw = await transactionRepository.findByTransactionId(transactionId);
    return this._toModel(raw);
  }

  /**
   * Create transaction (internal - bypasses permission for orchestrator)
   * @param {Object} data
   */
  async createTransactionInternal(data) {
    TransactionMapper.validateCreate(data);
    const raw = await transactionRepository.createTransaction(data);
    return this._toModel(raw);
  }

  /**
   * Update transaction (internal - bypasses permission for orchestrator)
   * @param {string} transactionId
   * @param {Object} data
   */
  async updateTransactionInternal(transactionId, data) {
    const raw = await transactionRepository.updateTransaction(transactionId, data);
    return this._toModel(raw);
  }

  // Note: createTransaction and updateTransaction with payment sync 
  // are now in TransactionPayment.orchestrator.js
}

export const transactionService = new TransactionService();