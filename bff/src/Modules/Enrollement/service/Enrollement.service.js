// src/modules/Enrollment/service/Enrollment.service.js
// DIRECT service - handles single-module enrollment operations ONLY
// For cross-module operations (enroll, progress, etc.), see orchestrators/Enrollment.orchestrator.js

import { enrollmentRepository } from '../Repository/Enrollement.repository.js';
import { EnrollmentMapper } from '../mapper/Enrollment.mapper.js';

export class EnrollmentService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? EnrollmentMapper.toModel(raw.enrollmentId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => EnrollmentMapper.toModel(raw.enrollmentId, raw));
  }

  _toEntity(userId, model, paymentId, transactionId) {
    return EnrollmentMapper.toEntity(userId, model, paymentId, transactionId);
  }

  _toEntityUpdate(model) {
    return EnrollmentMapper.toEntityUpdate(model);
  }

  /**
   * Get user's enrollments
   * DIRECT: Single module operation
   */
  async getUserEnrollments(userId) {
    const rawList = await enrollmentRepository.findUserEnrollments(userId);
    return this._toModels(rawList);
  }

  /**
   * Get enrollment by ID
   * DIRECT: Single module operation
   */
  async getEnrollmentById(enrollmentId) {
    const raw = await enrollmentRepository.findByEnrollmentId(enrollmentId);
    return this._toModel(raw);
  }

  /**
   * Check if user is enrolled in a course
   * DIRECT: Single module operation
   */
  async checkUserEnrollment(userId, courseId) {
    return await enrollmentRepository.checkUserEnrollment(userId, courseId);
  }

  /**
   * Get all enrollments for a course (raw, no enrichment)
   * DIRECT: Single module operation
   */
  async getCourseEnrollments(courseId) {
    const rawList = await enrollmentRepository.getCourseEnrollments(courseId);
    return this._toModels(rawList);
  }

  /**
   * Create enrollment (internal - called by orchestrator)
   * DIRECT: Single module operation
   */
  async createEnrollment(userId, enrollmentData) {
    const raw = await enrollmentRepository.createEnrollment(userId, enrollmentData);
    return this._toModel(raw);
  }

  /**
   * Update enrollment progress
   * DIRECT: Single module operation
   */
  async updateEnrollmentProgress(enrollmentId, progressData) {
    return await enrollmentRepository.updateEnrollmentProgress(enrollmentId, progressData);
  }

  /**
   * Mark enrollment as completed
   * DIRECT: Single module operation
   */
  async markEnrollmentAsCompleted(enrollmentId) {
    return await enrollmentRepository.markEnrollmentAsCompleted(enrollmentId);
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get enrollment by ID (internal - bypasses permission for orchestrator)
   * @param {string} enrollmentId
   */
  async getEnrollmentByIdInternal(enrollmentId) {
    const raw = await enrollmentRepository.findByEnrollmentId(enrollmentId);
    return this._toModel(raw);
  }

  /**
   * Get user enrollments (internal - bypasses permission for orchestrator)
   * @param {string} userId
   */
  async getUserEnrollmentsInternal(userId) {
    const rawList = await enrollmentRepository.findUserEnrollments(userId);
    return this._toModels(rawList);
  }

  /**
   * Create enrollment (internal - bypasses permission for orchestrator)
   * @param {string} userId
   * @param {Object} enrollmentData
   */
  async createEnrollmentInternal(userId, enrollmentData) {
    const raw = await enrollmentRepository.createEnrollment(userId, enrollmentData);
    return this._toModel(raw);
  }

  /**
   * Update enrollment progress (internal - bypasses permission for orchestrator)
   * @param {string} enrollmentId
   * @param {Object} progressData
   */
  async updateEnrollmentProgressInternal(enrollmentId, progressData) {
    return await enrollmentRepository.updateEnrollmentProgress(enrollmentId, progressData);
  }

  /**
   * Mark enrollment as completed (internal - bypasses permission for orchestrator)
   * @param {string} enrollmentId
   */
  async markEnrollmentAsCompletedInternal(enrollmentId) {
    return await enrollmentRepository.markEnrollmentAsCompleted(enrollmentId);
  }
}

export const enrollmentService = new EnrollmentService();