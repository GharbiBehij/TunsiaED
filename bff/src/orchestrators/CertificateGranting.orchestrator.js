// Certificate Granting Orchestrator
// Orchestrates certificate issuance based on progress completion
import { CertificatePermission } from '../Modules/Certificate/service/CertificatePermission.js';
import { certificateService } from '../Modules/Certificate/service/Certificate.service.js';
import { progressService } from '../Modules/Progress/service/Progress.service.js';
import { enrollmentService } from '../Modules/Enrollement/service/Enrollement.service.js';
import { courseService } from '../Modules/Course/service/Course.service.js';
import { cacheClient, REDIS_KEY_REGISTRY } from '../core/cache/cacheClient.js';

export class CertificateGrantingOrchestrator {
  /**
   * Grant certificate to student upon course completion
   * @param {Object} user - Authenticated user (can be system, admin, or student self-completion)
   * @param {Object} certData - { userId, courseId, enrollmentId }
   * @returns {Object} Certificate DTO
   */
  async grantCertificate(user, certData) {
    // 1. Validate course exists (Course service - internal)
    const course = await courseService.getCourseByIdInternal(certData.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // 2. Validate enrollment and ownership (Enrollment service)
    const enrollment = await enrollmentService.getEnrollmentById(certData.enrollmentId);
    if (!enrollment || enrollment.userId !== certData.userId) {
      throw new Error('Invalid enrollment');
    }

    // 3. Check if course is completed via progress module
    const progressSummary = await progressService.getUserCourseProgressSummary(
      { uid: certData.userId },
      certData.courseId
    );

    if (!progressSummary || !progressSummary.completed) {
      throw new Error('Course not yet completed');
    }

    // 4. Check if certificate already exists
    const existingCertificates = await certificateService.getUserCertificates(certData.userId);
    const alreadyIssued = existingCertificates.some(cert => cert.courseId === certData.courseId);
    if (alreadyIssued) {
      throw new Error('Certificate already issued for this course');
    }

    // 5. Calculate grade based on progress (if provided)
    const grade = certData.grade || this._calculateGrade(progressSummary);

    // 6. Issue certificate using certificate module
    const certificate = await certificateService.issueCertificate(
      certData.userId,
      certData.courseId,
      {
        grade,
        metadata: {
          completedAt: progressSummary.completedAt,
          totalItems: progressSummary.totalItems,
          enrollmentId: certData.enrollmentId,
        },
      }
    );

    // 7. Invalidate Redis cache for affected dashboards
    console.log('🗑️ [Orchestrator] Invalidating cache keys for certificate granting...');
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_DASHBOARD);
    await cacheClient.delPattern(REDIS_KEY_REGISTRY.PATTERNS.STUDENT_LEARNING_OVERVIEW);

    // 8. Return clean DTO
    return {
      certificateId: certificate.certificateId,
      userId: certificate.userId,
      courseId: certificate.courseId,
      courseTitle: course.title,
      grade: certificate.grade,
      issuedAt: certificate.issuedAt,
    };
  }

  /**
   * Check if user is eligible for certificate
   * @param {Object} user - Authenticated user
   * @param {string} courseId - Course ID
   * @returns {Object} Eligibility DTO
   */
  async checkCertificateEligibility(user, courseId) {
    console.log('🔍 [CertificateOrch] checkEligibility called:', {
      userId: user.uid,
      courseId
    });

    // 1. Get enrollment (Enrollment service)
    console.log('📋 [CertificateOrch] Fetching enrollment...');
    const enrollments = await enrollmentService.getUserEnrollments(user.uid);
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment) {
      return {
        eligible: false,
        reason: 'Not enrolled in course',
      };
    }

    // 2. Check progress completion (Progress service)
    const progressSummary = await progressService.getUserCourseProgressSummary(user, courseId);
    if (!progressSummary || !progressSummary.completed) {
      return {
        eligible: false,
        reason: 'Course not completed',
        progress: progressSummary?.progress || 0,
      };
    }

    // 3. Check if certificate already issued (Certificate service)
    const existingCertificates = await certificateService.getUserCertificates(user.uid);
    const alreadyIssued = existingCertificates.some(cert => cert.courseId === courseId);
    if (alreadyIssued) {
      return {
        eligible: false,
        reason: 'Certificate already issued',
        certificate: existingCertificates.find(cert => cert.courseId === courseId),
      };
    }

    // 4. User is eligible
    return {
      eligible: true,
      enrollmentId: enrollment.enrollmentId,
      completedAt: progressSummary.completedAt,
      suggestedGrade: this._calculateGrade(progressSummary),
    };
  }

  /**
   * Auto-grant certificates for completed courses (batch job)
   * @param {Object} user - Admin user
   * @param {string} userId - Target user ID (optional, if null checks all users)
   * @returns {Object} Batch result DTO
   */
  async autoGrantCertificates(user, userId = null) {
    // 1. Check admin permission
    if (!CertificatePermission.create(user)) {
      throw new Error('Unauthorized: Admin only');
    }

    const granted = [];
    const errors = [];

    // 2. Get enrollments to process (Enrollment service)
    let enrollmentsToProcess = [];
    if (userId) {
      enrollmentsToProcess = await enrollmentService.getUserEnrollments(userId);
    } else {
      // This would require a method to get all enrollments - not implementing full logic
      throw new Error('Batch processing for all users not implemented');
    }

    // 3. Process each enrollment
    for (const enrollment of enrollmentsToProcess) {
      try {
        // Check eligibility
        const eligibility = await this.checkCertificateEligibility(
          { uid: enrollment.userId },
          enrollment.courseId
        );

        if (eligibility.eligible) {
          // Grant certificate
          const certificate = await this.grantCertificate(user, {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            enrollmentId: enrollment.enrollmentId,
          });
          granted.push(certificate);
        }
      } catch (error) {
        errors.push({
          enrollmentId: enrollment.enrollmentId,
          courseId: enrollment.courseId,
          error: error.message,
        });
      }
    }

    // 4. Return clean DTO
    return {
      granted: granted.length,
      errors: errors.length,
      certificates: granted,
      failedEnrollments: errors,
    };
  }

  /**
   * Private helper: Calculate grade based on progress
   * @param {Object} progressSummary - Progress summary
   * @returns {string} Grade (A, B, C, D, F)
   */
  _calculateGrade(progressSummary) {
    const progress = progressSummary.progress || 0;
    if (progress >= 90) return 'A';
    if (progress >= 80) return 'B';
    if (progress >= 70) return 'C';
    if (progress >= 60) return 'D';
    return 'F';
  }
}

export const certificateGrantingOrchestrator = new CertificateGrantingOrchestrator();
