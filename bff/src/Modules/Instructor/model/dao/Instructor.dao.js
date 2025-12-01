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
    
    return {
      totalCourses: courses.length,
      totalStudents: students.length,
      totalRevenue: revenue.total || 0,
    };
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
    
    const activities = [];
    
    // Get recent enrollments
    if (courseIds.length > 0 && courseIds.length <= 10) {
      const enrollments = await db.collection('Enrollments')
        .where('courseId', 'in', courseIds)
        .orderBy('enrolledAt', 'desc')
        .limit(limit)
        .get();
      
      enrollments.docs.forEach(doc => {
        const enrollment = doc.data();
        activities.push({
          id: doc.id,
          type: 'enrollment',
          message: `New student enrolled`,
          timestamp: enrollment.enrolledAt?.toDate() || new Date(),
        });
      });
    }
    
    return activities.slice(0, limit).sort((a, b) => b.timestamp - a.timestamp);
  }
}

export const instructorDao = new InstructorDao();

