// Progress DAO for Firestore operations
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

export class ProgressDao {
  get collection() {
    return db.collection('Progress');
  }

  _docToRaw(doc) {
    return doc.exists ? { progressId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ progressId: doc.id, ...doc.data() }));
  }

  /**
   * Create a new progress record
   */
  async createProgress(progressData) {
    const progressDoc = {
      enrollmentId: progressData.enrollmentId,
      moduleType: progressData.moduleType,
      moduleId: progressData.moduleId,
      userId: progressData.userId,
      progress: progressData.progress || 0,
      completedItems: progressData.completedItems || [],
      totalItems: progressData.totalItems || 0,
      completed: progressData.completed || false,
      startedAt: progressData.startedAt || new Date(),
      completedAt: progressData.completedAt || null,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(progressDoc);
    return { progressId: docRef.id, ...progressDoc };
  }

  /**
   * Get progress by ID
   */
  async getProgressById(progressId) {
    const doc = await this.collection.doc(progressId).get();
    return this._docToRaw(doc);
  }

  /**
   * Get progress by enrollment and module
   */
  async getProgressByEnrollmentAndModule(enrollmentId, moduleType, moduleId) {
    const snapshot = await this.collection
      .where('enrollmentId', '==', enrollmentId)
      .where('moduleType', '==', moduleType)
      .where('moduleId', '==', moduleId)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    return this._docToRaw(snapshot.docs[0]);
  }

  /**
   * Get all progress records for an enrollment
   */
  async getProgressByEnrollment(enrollmentId) {
    const snapshot = await this.collection
      .where('enrollmentId', '==', enrollmentId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  /**
   * Get all progress records for a user
   */
  async getProgressByUser(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  /**
   * Get progress for a specific module across all users
   */
  async getProgressByModule(moduleType, moduleId) {
    const snapshot = await this.collection
      .where('moduleType', '==', moduleType)
      .where('moduleId', '==', moduleId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  /**
   * Update progress
   */
  async updateProgress(progressId, updateData) {
    const data = {
      ...updateData,
      lastAccessedAt: new Date(),
      updatedAt: new Date(),
    };

    // Auto-mark as completed if progress reaches 100
    if (updateData.progress >= 100 && !updateData.completed) {
      data.completed = true;
      data.completedAt = new Date();
    }

    await this.collection.doc(progressId).update(data);
    return this.getProgressById(progressId);
  }

  /**
   * Mark progress item as completed
   */
  async markItemCompleted(progressId, itemId) {
    const progress = await this.getProgressById(progressId);
    if (!progress) throw new Error('Progress not found');

    const completedItems = progress.completedItems || [];
    if (!completedItems.includes(itemId)) {
      completedItems.push(itemId);
    }

    const totalItems = progress.totalItems || 1;
    const newProgress = Math.floor((completedItems.length / totalItems) * 100);

    return this.updateProgress(progressId, {
      completedItems,
      progress: newProgress,
      completed: newProgress >= 100,
      completedAt: newProgress >= 100 ? new Date() : progress.completedAt,
    });
  }

  /**
   * Get progress summary for a user in a specific course
   */
  async getUserCourseProgressSummary(userId, courseId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('moduleId', '==', courseId)
      .where('moduleType', '==', 'course')
      .get();
    
    if (snapshot.empty) return null;
    return this._docToRaw(snapshot.docs[0]);
  }

  /**
   * Get progress statistics for instructor's courses
   */
  async getInstructorCoursesProgress(courseIds) {
    if (!courseIds || courseIds.length === 0) return [];

    const allProgress = [];
    
    // Firestore 'in' query limit is 10, batch if needed
    for (let i = 0; i < courseIds.length; i += 10) {
      const batch = courseIds.slice(i, i + 10);
      const snapshot = await this.collection
        .where('moduleType', '==', 'course')
        .where('moduleId', 'in', batch)
        .get();
      
      allProgress.push(...this._snapshotToRaw(snapshot));
    }
    
    return allProgress;
  }

  /**
   * Delete progress record
   */
  async deleteProgress(progressId) {
    await this.collection.doc(progressId).delete();
    return { success: true, progressId };
  }

  /**
   * Delete all progress for an enrollment
   */
  async deleteProgressByEnrollment(enrollmentId) {
    const snapshot = await this.collection
      .where('enrollmentId', '==', enrollmentId)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return { success: true, deletedCount: snapshot.size };
  }
}

export const progressDao = new ProgressDao();
