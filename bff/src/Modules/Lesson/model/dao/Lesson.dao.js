// src/modules/Lesson/model/dao/Lesson.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Lessons';

export class LessonDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { lessonId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ lessonId: doc.id, ...doc.data() }));
  }

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

    const ref = await this.collection.add(docData);
    return { lessonId: ref.id, ...docData };
  }

  async getLessonById(lessonId) {
    const doc = await this.collection.doc(lessonId).get();
    return this._docToRaw(doc);
  }

  async updateLesson(lessonId, data) {
    const update = { updatedAt: new Date() };
    if (data.title !== undefined) update.title = data.title;
    if (data.order !== undefined) update.order = data.order;
    if (data.durationMinutes !== undefined) update.durationMinutes = data.durationMinutes;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await this.collection.doc(lessonId).update(update);
    return this.getLessonById(lessonId);
  }

  async deleteLesson(lessonId) {
    await this.collection.doc(lessonId).delete();
  }

  async getLessonsByChapter(chapterId) {
    const snapshot = await this.collection
      .where('chapterId', '==', chapterId)
      .orderBy('order', 'asc')
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getLessonsByCourse(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .orderBy('order', 'asc')
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllLessons() {
    const snapshot = await this.collection.get();
    return this._snapshotToRaw(snapshot);
  }
}

export const lessonDao = new LessonDao();
