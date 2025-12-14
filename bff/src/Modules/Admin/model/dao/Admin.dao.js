// Admin DAO for aggregating data from multiple collections
import { db } from '../../../../config/firebase.js';

export class AdminDao {
  // Get total revenue from completed transactions in Firestore
  async getTotalRevenue() {
    const snapshot = await db.collection('Transactions')
      .where('status', '==', 'completed')
      .get();
    
    let total = 0;
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      total += data.amount || 0;
    });
    
    return total;
  }

  // Get count of new users in last 30 days from Firestore
  async getNewUsersCount() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const snapshot = await db.collection('User')
      .where('createdAt', '>=', thirtyDaysAgo)
      .get();
    
    return snapshot.size;
  }

  // Get count of active/published courses from Firestore
  async getActiveCoursesCount() {
    const snapshot = await db.collection('Courses')
      .where('isPublished', '==', true)
      .get();
    
    return snapshot.size;
  }

  // Get count of active subscriptions from Firestore
  async getActiveSubscriptionsCount() {
    const snapshot = await db.collection('Payments')
      .where('paymentType', '==', 'subscription')
      .where('status', '==', 'completed')
      .get();
    
    return snapshot.size;
  }

  // Get monthly revenue data (last 6 months) from Firestore
  async getMonthlyRevenue() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const snapshot = await db.collection('Transactions')
      .where('status', '==', 'completed')
      .where('createdAt', '>=', sixMonthsAgo)
      .get();
    
    const monthlyData = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += data.amount || 0;
    });
    
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    })).sort((a, b) => a.month.localeCompare(b.month));
  }

  // Get recent activity (enrollments and certificates) from Firestore
  async getRecentActivity(limit = 10) {
    const activities = [];
    
    try {
      // Get recent enrollments
      const enrollmentsSnapshot = await db.collection('Enrollments')
        .orderBy('enrolledAt', 'desc')
        .limit(limit)
        .get();
      
      for (const doc of enrollmentsSnapshot.docs) {
        const enrollment = doc.data();
        const userDoc = await db.collection('User').doc(enrollment.userId).get();
        const user = userDoc.exists ? userDoc.data() : null;
        const courseDoc = await db.collection('Courses').doc(enrollment.courseId).get();
        const course = courseDoc.exists ? courseDoc.data() : null;
        
        const enrolledAt = enrollment.enrolledAt?.toDate ? enrollment.enrolledAt.toDate() : new Date(enrollment.enrolledAt);
        
        activities.push({
          type: 'enrollment',
          name: user?.name || 'Unknown User',
          action: `enrolled in ${course?.title || 'Unknown Course'}`,
          time: this._formatRelativeTime(enrolledAt),
          timestamp: enrolledAt
        });
      }
    } catch (err) {
      console.error('Error fetching enrollments for activity:', err);
    }
    
    try {
      // Get recent certificates
      const certificatesSnapshot = await db.collection('Certificates')
        .orderBy('issuedAt', 'desc')
        .limit(limit)
        .get();
      
      for (const doc of certificatesSnapshot.docs) {
        const certificate = doc.data();
        const userDoc = await db.collection('User').doc(certificate.userId).get();
        const user = userDoc.exists ? userDoc.data() : null;
        const courseDoc = await db.collection('Courses').doc(certificate.courseId).get();
        const course = courseDoc.exists ? courseDoc.data() : null;
        
        const issuedAt = certificate.issuedAt?.toDate ? certificate.issuedAt.toDate() : new Date(certificate.issuedAt);
        
        activities.push({
          type: 'certificate',
          name: user?.name || 'Unknown User',
          action: `completed ${course?.title || 'Unknown Course'}`,
          time: this._formatRelativeTime(issuedAt),
          timestamp: issuedAt
        });
      }
    } catch (err) {
      console.error('Error fetching certificates for activity:', err);
    }
    
    // Sort by timestamp and return top limit
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(({ timestamp, ...rest }) => rest);
  }

  // Get course performance data with enrollment stats from Firestore
  async getCoursePerformance() {
    const coursesSnapshot = await db.collection('Courses').get();
    const enrollmentsSnapshot = await db.collection('Enrollments').get();
    
    const enrollmentsByCourse = {};
    enrollmentsSnapshot.docs.forEach(doc => {
      const enrollment = doc.data();
      const courseId = enrollment.courseId;
      if (!enrollmentsByCourse[courseId]) {
        enrollmentsByCourse[courseId] = [];
      }
      enrollmentsByCourse[courseId].push(enrollment);
    });
    
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
        progress
      };
    }).sort((a, b) => b.students - a.students);
  }

  // Get user engagement metrics (active users) from Firestore
  async getUserEngagement() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Daily active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEnrollments = await db.collection('Enrollments')
      .where('enrolledAt', '>=', sevenDaysAgo)
      .get();
    
    const uniqueUsers = new Set();
    recentEnrollments.docs.forEach(doc => {
      uniqueUsers.add(doc.data().userId);
    });
    
    // Monthly active users
    const monthlyEnrollments = await db.collection('Enrollments')
      .where('enrolledAt', '>=', thirtyDaysAgo)
      .get();
    
    const monthlyUniqueUsers = new Set();
    monthlyEnrollments.docs.forEach(doc => {
      monthlyUniqueUsers.add(doc.data().userId);
    });
    
    return {
      dailyActive: uniqueUsers.size,
      monthlyActive: monthlyUniqueUsers.size,
      avgSession: '45 min' // Placeholder - would need session tracking
    };
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

  // Get active promotions from Firestore
  async getActivePromotions() {
    const now = new Date();
    const snapshot = await db.collection('Promotions')
      .where('isActive', '==', true)
      .where('endDate', '>=', now)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Create new promotion in Firestore
  async createPromotion(promotionData) {
    const promotionRef = await db.collection('Promotions').add({
      ...promotionData,
      isActive: promotionData.isActive !== undefined ? promotionData.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const doc = await promotionRef.get();
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  // Get subscription plans from Firestore
  async getSubscriptionPlans() {
    const snapshot = await db.collection('SubscriptionPlans').get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Get subscription statistics from Firestore
  async getSubscriptionStats() {
    const paymentsSnapshot = await db.collection('Payments')
      .where('paymentType', '==', 'subscription')
      .get();
    
    let activeSubscriptions = 0;
    let totalRevenue = 0;
    const planCounts = {};
    
    paymentsSnapshot.docs.forEach(doc => {
      const payment = doc.data();
      if (payment.status === 'completed') {
        activeSubscriptions++;
        totalRevenue += payment.amount || 0;
        
        const planId = payment.planId || 'unknown';
        planCounts[planId] = (planCounts[planId] || 0) + 1;
      }
    });
    
    return {
      totalSubscriptions: activeSubscriptions,
      totalRevenue,
      planDistribution: planCounts
    };
  }

  // Update subscription plan in Firestore
  async updateSubscriptionPlan(planId, updateData) {
    await db.collection('SubscriptionPlans').doc(planId).update({
      ...updateData,
      updatedAt: new Date()
    });
    
    const doc = await db.collection('SubscriptionPlans').doc(planId).get();
    if (!doc.exists) {
      throw new Error('Subscription plan not found');
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  }
}

export const adminDao = new AdminDao();

