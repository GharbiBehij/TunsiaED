// src/modules/Quiz/model/dao/Quiz.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Quizzes';

export class QuizDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { quizId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ quizId: doc.id, ...doc.data() }));
  }

  async createQuiz(courseId, lessonId, data) {
    const docData = {
      courseId,
      lessonId: lessonId ?? null,
      title: data.title,
      totalQuestions: data.totalQuestions ?? 0,
      passingScore: data.passingScore ?? 0,
      isPublished: data.isPublished ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const ref = await this.collection.add(docData);
    return { quizId: ref.id, ...docData };
  }

  async getQuizById(quizId) {
    const doc = await this.collection.doc(quizId).get();
    return this._docToRaw(doc);
  }

  async updateQuiz(quizId, data) {
    const update = { updatedAt: new Date() };
    if (data.title !== undefined) update.title = data.title;
    if (data.totalQuestions !== undefined) update.totalQuestions = data.totalQuestions;
    if (data.passingScore !== undefined) update.passingScore = data.passingScore;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await this.collection.doc(quizId).update(update);
    return this.getQuizById(quizId);
  }

  async deleteQuiz(quizId) {
    await this.collection.doc(quizId).delete();
  }

  async getQuizzesByCourse(courseId) {
    const snapshot = await this.collection
      .where('courseId', '==', courseId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getQuizzesByLesson(lessonId) {
    const snapshot = await this.collection
      .where('lessonId', '==', lessonId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllQuizzes() {
    const snapshot = await this.collection.get();
    return this._snapshotToRaw(snapshot);
  }
}

export const quizDao = new QuizDao();
