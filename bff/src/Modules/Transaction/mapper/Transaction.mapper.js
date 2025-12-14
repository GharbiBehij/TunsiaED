// Transaction.mapper.js
// Transforms data between Model (API/Frontend) and Entity (Firestore)
// Handles camelCase <-> snake_case, Date <-> Timestamp conversions

import { createTransactionModel } from '../model/Transaction.model.js';
import { createTransactionEntity } from '../model/entity/Transaction.entity.js';

/**
 * Convert Firestore Timestamp to JavaScript Date
 * @param {FirebaseFirestore.Timestamp|Date|null} timestamp 
 * @returns {Date|null}
 */
function toDate(timestamp) {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate(); // Firestore Timestamp
  if (timestamp instanceof Date) return timestamp;
  return new Date(timestamp);
}

/**
 * TransactionMapper - Converts between Model and Entity formats
 */
export class TransactionMapper {
  /**
   * Convert Entity (Firestore) -> Model (API/Frontend)
   * @param {Object} entity - Firestore document data
   * @param {string} id - Document ID
   * @returns {TransactionModel}
   */
  static toModel(entity, id) {
    if (!entity) return null;
    
    return createTransactionModel({
      transactionId: id,
      paymentId: entity.payment_id,
      userId: entity.user_id,
      courseId: entity.course_id,
      courseTitle: entity.course_title,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      paymentMethod: entity.payment_method,
      paymentGateway: entity.payment_gateway,
      gatewayTransactionId: entity.gateway_transaction_id,
      gatewayResponse: entity.gateway_response ? JSON.stringify(entity.gateway_response) : null,
      createdAt: toDate(entity.created_at),
      updatedAt: toDate(entity.updated_at),
      completedAt: toDate(entity.completed_at),
    });
  }
  static validateCreate(model) {
  if (!model.paymentId) throw new Error('paymentId is required');
  if (!model.userId) throw new Error('userId is required');
  if (model.amount == null) throw new Error('amount is required');
  if (!model.currency) throw new Error('currency is required');
}

  /**
   * Convert Model (API/Frontend) -> Entity (Firestore)
   * @param {TransactionModel} model 
   * @returns {TransactionEntity}
   */
  static toEntity(model) {
    if (!model) return null;

    const entity = {};

    // Only include defined fields (for partial updates)
    if (model.paymentId !== undefined) entity.payment_id = model.paymentId;
    if (model.userId !== undefined) entity.user_id = model.userId;
    if (model.courseId !== undefined) entity.course_id = model.courseId;
    if (model.courseTitle !== undefined) entity.course_title = model.courseTitle;
    if (model.amount !== undefined) entity.amount = model.amount;
    if (model.currency !== undefined) entity.currency = model.currency;
    if (model.status !== undefined) entity.status = model.status;
    if (model.paymentMethod !== undefined) entity.payment_method = model.paymentMethod;
    if (model.paymentGateway !== undefined) entity.payment_gateway = model.paymentGateway;
    if (model.gatewayTransactionId !== undefined) entity.gateway_transaction_id = model.gatewayTransactionId;
    if (model.gatewayResponse !== undefined) {
      entity.gateway_response = typeof model.gatewayResponse === 'string' 
        ? JSON.parse(model.gatewayResponse) 
        : model.gatewayResponse;
    }
    if (model.completedAt !== undefined) entity.completed_at = model.completedAt;

    return entity;
  }

  /**
   * Convert array of entities to models
   * @param {Array<{id: string, data: Object}>} docs - Firestore documents
   * @returns {Array<TransactionModel>}
   */
  static toModelList(docs) {
    return docs.map(doc => this.toModel(doc.data, doc.id));
  }

  /**
   * Alias for toModelList to match other mappers' naming convention
   * @param {Array<{id: string, ...entity}>} entities - Array of Firestore entities with IDs
   * @returns {Array<TransactionModel>}
   */
  static toModels(entities) {
    if (!Array.isArray(entities)) return [];
    return entities.map(entity => this.toModel(entity, entity.transactionId || entity.id)).filter(Boolean);
  }
}

export default TransactionMapper;
