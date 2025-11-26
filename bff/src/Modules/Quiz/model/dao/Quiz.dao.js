// Firestore DAO for quizzes.
import { db } from '../../../../config/firebase.js';

export class QuizDao {
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

    const ref = await db.collection('Quizzes').add(docData);
    return {
      quizId: ref.id,
      ...docData,
    };
  }

  async getQuizById(quizId) {
    const snap = await db.collection('Quizzes').doc(quizId).get();
    return snap.exists ? snap.data() : null;
  }

  async updateQuiz(quizId, data) {
    const update = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) update.title = data.title;
    if (data.totalQuestions !== undefined)
      update.totalQuestions = data.totalQuestions;
    if (data.passingScore !== undefined) update.passingScore = data.passingScore;
    if (data.isPublished !== undefined) update.isPublished = data.isPublished;

    await db.collection('Quizzes').doc(quizId).update(update);
    const snap = await db.collection('Quizzes').doc(quizId).get();
    return snap.exists ? snap.data() : null;
  }

  async deleteQuiz(quizId) {
    await db.collection('Quizzes').doc(quizId).delete();
  }

  async getQuizzesByCourse(courseId) {
    const snapshot = await db
      .collection('Quizzes')
      .where('courseId', '==', courseId)
      .get();

    return snapshot.docs.map(doc => ({
      quizId: doc.id,
      ...doc.data(),
    }));
  }

  async getQuizzesByLesson(lessonId) {
    const snapshot = await db
      .collection('Quizzes')
      .where('lessonId', '==', lessonId)
      .get();

    return snapshot.docs.map(doc => ({
      quizId: doc.id,
      ...doc.data(),
    }));
  }

  async getAllQuizzes() {
    const snapshot = await db.collection('Quizzes').get();
    return snapshot.docs.map(doc => ({
      quizId: doc.id,
      ...doc.data(),
    }));
  }
}

export const quizDao = new QuizDao();


