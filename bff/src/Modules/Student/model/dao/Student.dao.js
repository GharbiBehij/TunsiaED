// studentDao.js
import { db } from '../../../../config/firebase.js';

class StudentDao {

  // ===============================
  // 1. GET USER ENROLLMENTS + COURSES (alias for findEnrollmentsByUserId)
  // ===============================
  async getStudentEnrollments(userId) {
    return await this.findEnrollmentsByUserId(userId);
  }
  async findEnrollmentsByUserId(userId) {
    const snapshot = await db
      .collection("Enrollments")
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map(doc => ({
      enrollmentId: doc.id,
      ...doc.data()
    }));
  }

  // ===============================
  // 2. GET COURSE BY ID
  // ===============================
  async findCourseById(courseId) {
    const doc = await db.collection("Courses").doc(courseId).get();
    return doc.exists ? doc.data() : null;
  }

  // ===============================
  // 3. UPDATE PROGRESS
  // ===============================
  async updateEnrollmentProgress(enrollmentId, progressObject) {
    // progressObject must be an object: { progress: number }
    return await db
      .collection("Enrollments")
      .doc(enrollmentId)
      .update(progressObject);
  }

  // ===============================
  // 4. MARK A LESSON AS COMPLETED
  // ===============================
  async addCompletedLesson(enrollmentId, lessonId) {
    const ref = db.collection("Enrollments").doc(enrollmentId);

    return await ref.update({
      completedLessons: db.FieldValue.arrayUnion(lessonId)
    });
  }

  // ===============================
  // 5. FIND ENROLLMENT BY ID
  // ===============================
  async findEnrollmentById(enrollmentId) {
    const doc = await db.collection("Enrollments").doc(enrollmentId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  // ===============================
  // 6. MARK ENROLLMENT AS COMPLETED (progress = 100)
  // ===============================
  async markEnrollmentAsCompleted(enrollmentId) {
    return await db.collection("Enrollments").doc(enrollmentId).update({
      progress: 100,
      completed: true,
      completedAt: new Date()
    });
  }

  // ===============================
  // 7. GET STUDENT STATS (count + total progress)
  // ===============================
  async getStudentStats(userId) {
    const enrollmentsSnapshot = await db
      .collection("Enrollments")
      .where("userId", "==", userId)
      .get();

    let totalProgress = 0;
    let completedCount = 0;
    const count = enrollmentsSnapshot.size;

    enrollmentsSnapshot.docs.forEach(doc => {
      const e = doc.data();
      if (e.progress) totalProgress += e.progress;
      if (e.completed === true) completedCount++;
    });

    // Get certificates count
    const certificatesSnapshot = await db
      .collection('Certificates')
      .where("userId", "==", userId)
      .get();

    // Calculate streak (placeholder - you can enhance this with actual last access dates)
    const streak = completedCount > 0 ? Math.min(completedCount * 2, 30) : 0;

    return {
      totalCourses: count,
      averageProgress: count > 0 ? totalProgress / count : 0,
      streak: streak,
      completed: completedCount,
      certificates: certificatesSnapshot.size
    };
  }
  async getStudentCertificates(studentId) {
    //we need to fetch the Certificate collection for the student 
    const certificates = await db
      .collection('Certificates')
      .where("userId", "==", studentId)
      .orderBy('issuedAt', 'desc')
      .get();

    return certificates.docs.map(doc => ({
      certificateId: doc.id,
      ...doc.data()
    }));
  }
  async createCertificate(data) {
    const docRef = await db.collection("Certificates").add(data);
    return { id: docRef.id, ...data };
  }
}

export const studentDao = new StudentDao();
