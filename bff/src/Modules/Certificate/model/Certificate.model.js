// src/modules/Certificate/model/Certificate.model.js

/**
 * CertificateModel - Business/API format
 * This is what the frontend sends and receives
 * 
 * @typedef {Object} CertificateModel
 * @property {string} certificateId - Certificate ID (Firestore document ID)
 * @property {string} enrollmentId - Associated enrollment ID
 * @property {string} studentId - Student user ID
 * @property {string} courseId - Course ID
 * @property {string} issuedAt - ISO date string when certificate was issued
 * @property {number|null} grade - Final grade (optional)
 * @property {Object} metadata - Additional certificate metadata
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * CertificateCreateModel - Data for creating a new certificate
 * 
 * @typedef {Object} CertificateCreateModel
 * @property {string} enrollmentId - Associated enrollment ID (required)
 * @property {string} studentId - Student user ID (required)
 * @property {Date} [issuedAt] - Issue date (defaults to now)
 * @property {number} [grade] - Final grade
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * CertificateUpdateModel - Data for updating a certificate
 * 
 * @typedef {Object} CertificateUpdateModel
 * @property {number} [grade] - Final grade
 * @property {Object} [metadata] - Additional metadata
 */

export const CertificateModel = {};
