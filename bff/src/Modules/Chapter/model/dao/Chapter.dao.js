// src/modules/Chapter/model/dao/Chapter.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Chapters';

export class ChapterDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { chapterId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ chapterId: doc.id, ...doc.data() }));
  }

  async createChapter(courseId, data) {
    const docData = {
      courseId,
      title: data.title,
      order: data.order ?? 0,
      isPublished: data.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await this.collection.add(docData);
    return { chapterId: ref.id, ...docData };
  }

  async getChapterById(chapterId) {
    const doc = await this.collection.doc(chapterId).get();
    return this._docToRaw(doc);
  }

  async updateChapter(chapterId, data) {
    const update = { updatedAt: new Date() };
    if (data.title !== undefined) update.title = data.title;
    if (data.order !== undefined) update.order = data.order;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await this.collection.doc(chapterId).update(update);
    return this.getChapterById(chapterId);
  }

  async deleteChapter(chapterId) {
    await this.collection.doc(chapterId).delete();
  }

  async getChaptersByCourse(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .orderBy('order', 'asc')
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllChapters() {
    const snapshot = await this.collection.get();
    return this._snapshotToRaw(snapshot);
  }
}

export const chapterDao = new ChapterDao();
