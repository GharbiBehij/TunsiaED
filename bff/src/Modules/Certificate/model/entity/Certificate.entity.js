// src/modules/Certificate/model/entity/Certificate.entity.js

/**
 * CertificateEntity - Firestore storage format
 * This is how certificate data is stored in Firestore
 * 
 * @typedef {Object} CertificateEntity
 * @property {string} enrollmentId - Associated enrollment ID
 * @property {string} studentId - Student user ID
 * @property {string} courseId - Course ID
 * @property {Date} issuedAt - Firestore Timestamp when certificate was issued
 * @property {number|null} grade - Final grade
 * @property {Object} metadata - Additional certificate metadata
 * @property {Date} createdAt - Firestore Timestamp
 * @property {Date} updatedAt - Firestore Timestamp
 */

export const CertificateEntity = {};
