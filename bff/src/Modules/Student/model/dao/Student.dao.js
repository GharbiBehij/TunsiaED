// Student DAO for student-specific data aggregation
import { db } from '../../../../config/firebase.js';

export class StudentDao {
  // Get student's enrollments with course details
  async getStudentEnrollments(studentId) {
    const enrollmentsSnapshot = await db.collection('Enrollments')
      .where('userId', '==', studentId)
      .get();
    
    const enrollments = [];
    for (const doc of enrollmentsSnapshot.docs) {
      const enrollment = doc.data();
      const courseDoc = await db.collection('Courses').doc(enrollment.courseId).get();
      const course = courseDoc.exists ? courseDoc.data() : null;
      
      enrollments.push({
        enrollmentId: doc.id,
        courseId: enrollment.courseId,
        courseTitle: course?.title || 'Unknown Course',
        enrolledAt: enrollment.enrolledAt?.toDate() || new Date(enrollment.enrolledAt),
        progress: enrollment.progress || 0,
        completed: enrollment.completed || false,
        course: course ? {
          courseId: courseDoc.id,
          title: course.title,
          thumbnail: course.thumbnail,
          instructorName: course.instructorName
        } : null
      });
    }
    
    return enrollments;
  }

  // Get student's overall progress
  async getStudentProgress(studentId) {
    const enrollmentsSnapshot = await db.collection('Enrollments')
      .where('userId', '==', studentId)
      .get();
    
    if (enrollmentsSnapshot.empty) {
      return {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        averageProgress: 0
      };
    }
    
    let totalProgress = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    
    enrollmentsSnapshot.docs.forEach(doc => {
      const enrollment = doc.data();
      const progress = enrollment.progress || 0;
      totalProgress += progress;
      
      if (enrollment.completed === true) {
        completedCount++;
      } else if (progress > 0) {
        inProgressCount++;
      }
    });
    
    const totalCourses = enrollmentsSnapshot.size;
    const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;
    
    return {
      totalCourses,
      completedCourses: completedCount,
      inProgressCourses: inProgressCount,
      averageProgress
    };
  }

  // Get student's certificates
  async getStudentCertificates(studentId) {
    const certificatesSnapshot = await db.collection('Certificates')
      .where('userId', '==', studentId)
      .orderBy('issuedAt', 'desc')
      .get();
    
    const certificates = [];
    for (const doc of certificatesSnapshot.docs) {
      const certificate = doc.data();
      const courseDoc = await db.collection('Courses').doc(certificate.courseId).get();
      const course = courseDoc.exists ? courseDoc.data() : null;
      
      certificates.push({
        certificateId: doc.id,
        courseId: certificate.courseId,
        courseTitle: course?.title || 'Unknown Course',
        issuedAt: certificate.issuedAt?.toDate() || new Date(certificate.issuedAt),
        grade: certificate.grade || null
      });
    }
    
    return certificates;
  }

  // Get student's learning statistics
  async getStudentStats(studentId) {
    const enrollmentsSnapshot = await db.collection('Enrollments')
      .where('userId', '==', studentId)
      .get();
    
    const certificatesSnapshot = await db.collection('Certificates')
      .where('userId', '==', studentId)
      .get();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = enrollmentsSnapshot.docs.filter(doc => {
      const enrollment = doc.data();
      const enrolledAt = enrollment.enrolledAt?.toDate() || new Date(enrollment.enrolledAt);
      return enrolledAt >= thirtyDaysAgo;
    });
    
    return {
      totalEnrollments: enrollmentsSnapshot.size,
      completedCourses: enrollmentsSnapshot.docs.filter(doc => doc.data().completed === true).length,
      certificatesEarned: certificatesSnapshot.size,
      recentEnrollments: recentEnrollments.length,
      totalLearningHours: 0 // Would need to calculate from lessons watched
    };
  }
}

export const studentDao = new StudentDao();

