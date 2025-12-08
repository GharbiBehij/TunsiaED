// Firebase Notification Emitter
// Listens to event bus and sends Firebase Cloud Messaging (FCM) push notifications
// These are in-app/mobile notifications, NOT emails
// Emails are handled separately by EmailService via SMTP adapter

import eventBus from '../eventBus.js';
import { FirebaseMessagingAdapter } from '../../adapters/firebaseAdapter.js';
import { SYSTEM_INSTRUCTOR_UID } from '../../systemCourses/systemCourses.data.js';

/**
 * Safe notification sender - skips system instructor
 * @param {string} userId - User ID to send notification to
 * @param {Object} payload - Notification payload
 */
async function sendNotificationSafe(userId, payload) {
  // Skip notifications for system instructor (no FCM token)
  if (userId === SYSTEM_INSTRUCTOR_UID) {
    return;
  }
  
  try {
    await FirebaseMessagingAdapter.sendToDevice(userId, payload);
  } catch (error) {
    console.error(`Failed to send notification to ${userId}:`, error.message);
  }
}

/**
 * Initialize Firebase notification listeners
 * Subscribes to business events and sends push notifications
 */
export function initializeFirebaseNotifications() {
  // Payment completed - send push notification (email sent separately via SMTP in controller)
  eventBus.on('payment.completed', async (data) => {
    const { userId, courseTitle, amount, transactionId } = data;
    
    await sendNotificationSafe(userId, {
      title: '🎉 Payment Successful',
      body: `Your payment of ${amount} TND for "${courseTitle}" has been confirmed.`,
      data: {
        type: 'payment_success',
        transactionId,
        courseTitle,
      },
    });
    console.log(`🔔 Push notification sent to user ${userId}`);
  });

  // Payment failed - send push notification (email sent separately via SMTP in controller)
  eventBus.on('payment.failed', async (data) => {
    const { userId, courseTitle, reason } = data;
    
    try {
      await FirebaseMessagingAdapter.sendToDevice(userId, {
        title: '❌ Payment Failed',
        body: `Payment for "${courseTitle}" was unsuccessful. ${reason || 'Please try again.'}`,
        data: {
          type: 'payment_failed',
          courseTitle,
        },
      });
      console.log(`🔔 Push notification sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send payment failure notification:', error);
    }
  });

  // Enrollment created - send push notifications to student and instructor
  eventBus.on('enrollment.created', async (data) => {
    const { studentId, instructorId, courseTitle, courseThumbnail } = data;
    
    // Notify student via push notification
    await sendNotificationSafe(studentId, {
      title: '🎓 Enrollment Confirmed',
      body: `You're now enrolled in "${courseTitle}". Start learning today!`,
      data: {
        type: 'enrollment_created',
        courseTitle,
      },
      imageUrl: courseThumbnail,
    });

    // Notify instructor via push notification (safely skips system instructor)
    await sendNotificationSafe(instructorId, {
      title: '👥 New Student Enrolled',
      body: `A new student enrolled in your course "${courseTitle}"`,
      data: {
        type: 'student_enrolled',
        courseTitle,
      },
    });
    
    console.log(`🔔 Push notifications sent for enrollment: ${courseTitle}`);
  });

  // Certificate granted - notify student
  eventBus.on('certificate.granted', async (data) => {
    const { userId, courseTitle, certificateUrl, certificateId } = data;
    
    try {
      await FirebaseMessagingAdapter.sendToDevice(userId, {
        title: ' Certificate Earned!',
        body: `Congratulations! You've earned a certificate for completing "${courseTitle}"`,
        data: {
          type: 'certificate_granted',
          certificateId,
          certificateUrl,
          courseTitle,
        },
      });
      console.log(`Certificate notification sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send certificate notification:', error);
    }
  });

  // Progress milestone - notify student
  eventBus.on('progress.milestone', async (data) => {
    const { userId, courseTitle, progress, milestone } = data;
    
    // Only send notifications at 25%, 50%, 75% milestones
    if (![25, 50, 75].includes(milestone)) {
      return;
    }
    
    try {
      await FirebaseMessagingAdapter.sendToDevice(userId, {
        title: ` ${milestone}% Complete!`,
        body: `You're making great progress in "${courseTitle}". Keep it up!`,
        data: {
          type: 'progress_milestone',
          progress: progress.toString(),
          milestone: milestone.toString(),
          courseTitle,
        },
      });
      console.log(`Progress milestone notification sent to user ${userId} (${milestone}%)`);
    } catch (error) {
      console.error('Failed to send progress notification:', error);
    }
  });

  // Course completed - notify student and instructor
  eventBus.on('course.completed', async (data) => {
    const { studentId, instructorId, courseTitle } = data;
    
    try {
      // Notify student
      await FirebaseMessagingAdapter.sendToDevice(studentId, {
        title: '🎉 Course Completed!',
        body: `Congratulations on completing "${courseTitle}"! Your certificate is being generated.`,
        data: {
          type: 'course_completed',
          courseTitle,
        },
      });

      // Notify instructor
      if (instructorId) {
        await FirebaseMessagingAdapter.sendToDevice(instructorId, {
          title: '✅ Student Completed Course',
          body: `A student has completed your course "${courseTitle}"`,
          data: {
            type: 'student_completed',
            courseTitle,
          },
        });
      }
      
      console.log(`Course completion notifications sent for ${courseTitle}`);
    } catch (error) {
      console.error('Failed to send course completion notifications:', error);
    }
  });

  // New course published - notify subscribers (optional topic-based)
  eventBus.on('course.published', async (data) => {
    const { courseTitle, instructorName, category } = data;
    
    try {
      // Send to topic (students subscribed to category)
      await FirebaseMessagingAdapter.sendToTopic(`courses_${category}`, {
        title: '📚 New Course Available',
        body: `${instructorName} just published "${courseTitle}" in ${category}`,
        data: {
          type: 'course_published',
          courseTitle,
          category,
        },
      });
      console.log(`New course notification sent to topic: courses_${category}`);
    } catch (error) {
      console.error('Failed to send course publication notification:', error);
    }
  });

  // Subscription expiring - notify user
  eventBus.on('subscription.expiring', async (data) => {
    const { userId, daysLeft, planName } = data;
    
    try {
      await FirebaseMessagingAdapter.sendToDevice(userId, {
        title: '⚠️ Subscription Expiring Soon',
        body: `Your ${planName} subscription expires in ${daysLeft} days. Renew now to continue learning!`,
        data: {
          type: 'subscription_expiring',
          daysLeft: daysLeft.toString(),
          planName,
        },
      });
      console.log(`Subscription expiry notification sent to user ${userId}`);
    } catch (error) {
      console.error('Failed to send subscription notification:', error);
    }
  });

  // Instructor revenue milestone - notify instructor
  eventBus.on('revenue.milestone', async (data) => {
    const { instructorId, totalRevenue, milestone } = data;
    
    try {
      await FirebaseMessagingAdapter.sendToDevice(instructorId, {
        title: '💰 Revenue Milestone Reached!',
        body: `Congratulations! Your total revenue has reached ${milestone} TND`,
        data: {
          type: 'revenue_milestone',
          totalRevenue: totalRevenue.toString(),
          milestone: milestone.toString(),
        },
      });
      console.log(`Revenue milestone notification sent to instructor ${instructorId}`);
    } catch (error) {
      console.error('Failed to send revenue notification:', error);
    }
  });

  console.log('✅ Firebase notification emitter initialized with 10 event listeners');
}

export default initializeFirebaseNotifications;
