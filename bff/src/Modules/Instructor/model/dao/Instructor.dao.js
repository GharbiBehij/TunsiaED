// Instructor DAO for instructor-specific data aggregation
import { db } from '../../../../config/firebase.js';

export class InstructorDao {
  // Get instructor's courses
  async getInstructorCourses(instructorId) {
    const snapshot = await db.collection('Courses')
      .where('instructorId', '==', instructorId)
      .get();
    
    return snapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data()
    }));
  }

  // Get students enrolled in instructor's courses
  async getInstructorStudents(instructorId) {
    const coursesSnapshot = await db.collection('Courses')
      .where('instructorId', '==', instructorId)
      .get();
    
    const courseIds = coursesSnapshot.docs.map(doc => doc.id);
    
    if (courseIds.length === 0) return [];
    
    // Firestore 'in' query limit is 10, so we need to batch if more than 10 courses
    const studentIds = new Set();
    
    if (courseIds.length <= 10) {
      const enrollmentsSnapshot = await db.collection('Enrollments')
        .where('courseId', 'in', courseIds)
        .get();
      
      enrollmentsSnapshot.docs.forEach(doc => {
        studentIds.add(doc.data().userId);
      });
    } else {
      // Batch queries for more than 10 courses
      for (let i = 0; i < courseIds.length; i += 10) {
        const batch = courseIds.slice(i, i + 10);
        const enrollmentsSnapshot = await db.collection('Enrollments')
          .where('courseId', 'in', batch)
          .get();
        
        enrollmentsSnapshot.docs.forEach(doc => {
          studentIds.add(doc.data().userId);
        });
      }
    }
    
    const students = [];
    for (const studentId of studentIds) {
      const userDoc = await db.collection('User').doc(studentId).get();
      if (userDoc.exists) {
        students.push({
          userId: studentId,
          ...userDoc.data()
        });
      }
    }
    
    return students;
  }

  // Get revenue from instructor's courses
  async getInstructorRevenue(instructorId) {
    const coursesSnapshot = await db.collection('Courses')
      .where('instructorId', '==', instructorId)
      .get();
    
    const courseIds = coursesSnapshot.docs.map(doc => doc.id);
    
    if (courseIds.length === 0) return { total: 0, monthly: [] };
    
    let total = 0;
    const monthlyData = {};
    
    // Firestore 'in' query limit is 10, so we need to batch if more than 10 courses
    if (courseIds.length <= 10) {
      const transactionsSnapshot = await db.collection('Transactions')
        .where('status', '==', 'completed')
        .where('courseId', 'in', courseIds)
        .get();
      
      transactionsSnapshot.docs.forEach(doc => {
        const transaction = doc.data();
        total += transaction.amount || 0;
        
        const date = transaction.createdAt?.toDate ? transaction.createdAt.toDate() : new Date(transaction.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += transaction.amount || 0;
      });
    } else {
      // Batch queries for more than 10 courses
      for (let i = 0; i < courseIds.length; i += 10) {
        const batch = courseIds.slice(i, i + 10);
        const transactionsSnapshot = await db.collection('Transactions')
          .where('status', '==', 'completed')
          .where('courseId', 'in', batch)
          .get();
        
        transactionsSnapshot.docs.forEach(doc => {
          const transaction = doc.data();
          total += transaction.amount || 0;
          
          const date = transaction.createdAt?.toDate ? transaction.createdAt.toDate() : new Date(transaction.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0;
          }
          monthlyData[monthKey] += transaction.amount || 0;
        });
      }
    }
    
    const monthly = Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    return { total, monthly };
  }

  // Get course performance for instructor's courses
  async getInstructorCoursePerformance(instructorId) {
    const coursesSnapshot = await db.collection('Courses')
      .where('instructorId', '==', instructorId)
      .get();
    
    const courseIds = coursesSnapshot.docs.map(doc => doc.id);
    
    if (courseIds.length === 0) return [];
    
    const enrollmentsByCourse = {};
    
    // Firestore 'in' query limit is 10, so we need to batch if more than 10 courses
    if (courseIds.length <= 10) {
      const enrollmentsSnapshot = await db.collection('Enrollments')
        .where('courseId', 'in', courseIds)
        .get();
      
      enrollmentsSnapshot.docs.forEach(doc => {
        const enrollment = doc.data();
        const courseId = enrollment.courseId;
        if (!enrollmentsByCourse[courseId]) {
          enrollmentsByCourse[courseId] = [];
        }
        enrollmentsByCourse[courseId].push(enrollment);
      });
    } else {
      // Batch queries for more than 10 courses
      for (let i = 0; i < courseIds.length; i += 10) {
        const batch = courseIds.slice(i, i + 10);
        const enrollmentsSnapshot = await db.collection('Enrollments')
          .where('courseId', 'in', batch)
          .get();
        
        enrollmentsSnapshot.docs.forEach(doc => {
          const enrollment = doc.data();
          const courseId = enrollment.courseId;
          if (!enrollmentsByCourse[courseId]) {
            enrollmentsByCourse[courseId] = [];
          }
          enrollmentsByCourse[courseId].push(enrollment);
        });
      }
    }
    
    return coursesSnapshot.docs.map(doc => {
      const course = doc.data();
      const enrollments = enrollmentsByCourse[doc.id] || [];
      const completedCount = enrollments.filter(e => e.completed === true).length;
      const progress = enrollments.length > 0 
        ? Math.round((completedCount / enrollments.length) * 100)
        : 0;
      
      return {
        id: doc.id,
        title: course.title,
        students: enrollments.length,
        progress,
        revenue: 0 // Would need to calculate from transactions
      };
    });
  }

  async getInstructorStats(instructorId) {
    const courses = await this.getInstructorCourses(instructorId);
    const students = await this.getInstructorStudents(instructorId);
    const revenue = await this.getInstructorRevenue(instructorId);
    
    // Return array format expected by StatsCard component
    return [
      {
        label: 'Total Courses',
        value: courses.length,
        icon: 'school',
        color: 'blue',
        trend: null,
        trendDirection: null
      },
      {
        label: 'Total Students',
        value: students.length,
        icon: 'group',
        color: 'green',
        trend: null,
        trendDirection: null
      },
      {
        label: 'Total Revenue',
        value: revenue.total || 0,
        icon: 'payments',
        color: 'amber',
        trend: null,
        trendDirection: null,
        isCurrency: true
      }
    ];
  }

  async getInstructorRevenueTrends(instructorId) {
    const revenue = await this.getInstructorRevenue(instructorId);
    const last30Days = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const dayRevenue = revenue.monthly?.find(m => m.month === monthKey)?.revenue || 0;
      
      last30Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue / 30, // Approximate daily from monthly
      });
    }
    
    return {
      total: revenue.total || 0,
      change: 0, // Would calculate from previous period
      path: last30Days.map((_, i) => `${i * 10},${Math.random() * 100}`).join(' '),
      monthly: revenue.monthly || [],
    };
  }

  async getInstructorActivity(instructorId, limit = 10) {
    const courses = await this.getInstructorCourses(instructorId);
    const courseIds = courses.map(c => c.courseId || c.id);
    const coursesMap = new Map(courses.map(c => [c.courseId || c.id, c]));
    
    const activities = [];
    
    // Get recent enrollments
    if (courseIds.length > 0 && courseIds.length <= 10) {
      const enrollments = await db.collection('Enrollments')
        .where('courseId', 'in', courseIds)
        .orderBy('enrolledAt', 'desc')
        .limit(limit)
        .get();
      
      for (const doc of enrollments.docs) {
        const enrollment = doc.data();
        const course = coursesMap.get(enrollment.courseId);
        
        // Fetch student name
        let studentName = 'Unknown Student';
        try {
          const userDoc = await db.collection('User').doc(enrollment.userId).get();
          if (userDoc.exists) {
            studentName = userDoc.data().displayName || userDoc.data().name || 'Unknown Student';
          }
        } catch (err) {
          console.error('Error fetching student:', err);
        }
        
        const timestamp = enrollment.enrolledAt?.toDate ? enrollment.enrolledAt.toDate() : new Date(enrollment.enrolledAt);
        
        activities.push({
          id: doc.id,
          type: 'enrollment',
          icon: 'person_add',
          color: 'green',
          user: studentName,
          action: 'enrolled in',
          target: course?.title || 'Unknown Course',
          time: this._formatRelativeTime(timestamp),
          timestamp: timestamp,
        });
      }
    }
    
    return activities.slice(0, limit).sort((a, b) => b.timestamp - a.timestamp);
  }

  // Helper method to format relative time
  _formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  /**
   * Get student progress in a specific course (for instructor)
   * @param {string} instructorId - The instructor ID
   * @param {string} courseId - The course ID
   */
  async getStudentProgressForCourse(instructorId, courseId) {
    // Verify the course belongs to this instructor
    const courseDoc = await db.collection('Courses').doc(courseId).get();
    if (!courseDoc.exists || courseDoc.data().instructorId !== instructorId) {
      throw new Error('Unauthorized: Course does not belong to this instructor');
    }

    // Get all enrollments for this course with progress
    const enrollmentsSnapshot = await db.collection('Enrollments')
      .where('courseId', '==', courseId)
      .where('status', '==', 'active')
      .get();

    const enrollmentsWithStudents = await Promise.all(
      enrollmentsSnapshot.docs.map(async (doc) => {
        const enrollment = doc.data();
        
        // Fetch student data
        let studentData = null;
        try {
          const studentDoc = await db.collection('User').doc(enrollment.userId).get();
          if (studentDoc.exists) {
            studentData = studentDoc.data();
          }
        } catch (error) {
          console.error('Error fetching student data:', error);
        }

        return {
          enrollmentId: doc.id,
          userId: enrollment.userId,
          studentName: studentData?.displayName || 'Unknown Student',
          studentEmail: studentData?.email || '',
          progress: enrollment.progress || 0,
          completedLessons: enrollment.completedLessons || [],
          completed: enrollment.completed || false,
          enrolledAt: enrollment.enrollmentDate || enrollment.enrolledAt,
          updatedAt: enrollment.updatedAt,
        };
      })
    );

    return enrollmentsWithStudents;
  }
}

export const instructorDao = new InstructorDao();

