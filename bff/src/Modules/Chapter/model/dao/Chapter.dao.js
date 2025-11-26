// Firestore DAO for chapters.
import { db } from '../../../../config/firebase.js';

export class ChapterDao {
  async createChapter(courseId, data) {
    const docData = {
      courseId,
      title: data.title,
      order: data.order ?? 0,
      isPublished: data.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await db.collection('Chapters').add(docData);

    return {
      chapterId: ref.id,
      ...docData,
    };
  }

  async getChapterById(chapterId) {
    const snap = await db.collection('Chapters').doc(chapterId).get();
    return snap.exists ? snap.data() : null;
  }

  async updateChapter(chapterId, data) {
    const update = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) update.title = data.title;
    if (data.order !== undefined) update.order = data.order;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await db.collection('Chapters').doc(chapterId).update(update);
    const snap = await db.collection('Chapters').doc(chapterId).get();
    return snap.exists ? snap.data() : null;
  }

  async deleteChapter(chapterId) {
    await db.collection('Chapters').doc(chapterId).delete();
  }

  async getChaptersByCourse(courseId) {
    const snapshot = await db
      .collection('Chapters')
      .where('courseId', '==', courseId)
      .orderBy('order', 'asc')
      .get();

    return snapshot.docs.map(doc => ({
      chapterId: doc.id,
      ...doc.data(),
    }));
  }

  async getAllChapters() {
    const snapshot = await db.collection('Chapters').get();
    return snapshot.docs.map(doc => ({
      chapterId: doc.id,
      ...doc.data(),
    }));
  }
}

export const chapterDao = new ChapterDao();


