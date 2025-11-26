// Firestore DAO for lessons.
import { db } from '../../../../config/firebase.js';

export class LessonDao {
  async createLesson(courseId, chapterId, data) {
    const docData = {
      courseId,
      chapterId,
      title: data.title,
      order: data.order ?? 0,
      durationMinutes: data.durationMinutes ?? null,
      isPublished: data.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await db.collection('Lessons').add(docData);
    return {
      lessonId: ref.id,
      ...docData,
    };
  }

  async getLessonById(lessonId) {
    const snap = await db.collection('Lessons').doc(lessonId).get();
    return snap.exists ? snap.data() : null;
  }

  async updateLesson(lessonId, data) {
    const update = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) update.title = data.title;
    if (data.order !== undefined) update.order = data.order;
    if (data.durationMinutes !== undefined)
      update.durationMinutes = data.durationMinutes;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await db.collection('Lessons').doc(lessonId).update(update);
    const snap = await db.collection('Lessons').doc(lessonId).get();
    return snap.exists ? snap.data() : null;
  }

  async deleteLesson(lessonId) {
    await db.collection('Lessons').doc(lessonId).delete();
  }

  async getLessonsByChapter(chapterId) {
    const snapshot = await db
      .collection('Lessons')
      .where('chapterId', '==', chapterId)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map(doc => ({
      lessonId: doc.id,
      ...doc.data(),
    }));
  }

  async getLessonsByCourse(courseId) {
    const snapshot = await db
      .collection('Lessons')
      .where('courseId', '==', courseId)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map(doc => ({
      lessonId: doc.id,
      ...doc.data(),
    }));
  }

  async getAllLessons() {
    const snapshot = await db.collection('Lessons').get();
    return snapshot.docs.map(doc => ({
      lessonId: doc.id,
      ...doc.data(),
    }));
  }
}

export const lessonDao = new LessonDao();


