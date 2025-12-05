// src/modules/Course/model/dao/Course.dao.js
// DAO returns raw Firestore data - mapping happens in Service layer
import { db } from '../../../../config/firebase.js';

const COLLECTION = 'Courses';

export class CourseDao {
  get collection() {
    return db.collection(COLLECTION);
  }

  _docToRaw(doc) {
    return doc.exists ? { courseId: doc.id, ...doc.data() } : null;
  }

  _snapshotToRaw(snapshot) {
    return snapshot.docs.map(doc => ({ courseId: doc.id, ...doc.data() }));
  }

  async createCourse(instructorId, instructorName, data) {
    const courseDoc = {
      title: data.title,
      description: data.description,
      instructorId,
      instructorName,
      category: data.category,
      level: data.level,
      price: data.price,
      thumbnail: data.thumbnail || null,
      duration: data.duration,
      enrolledCount: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(courseDoc);
    return { courseId: docRef.id, ...courseDoc };
  }

  async getCourseById(courseId) {
    const doc = await this.collection.doc(courseId).get();
    return this._docToRaw(doc);
  }

  async updateCourse(courseId, data) {
    const updateData = { updatedAt: new Date() };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail || null;
    if (data.duration !== undefined) updateData.duration = data.duration;

    await this.collection.doc(courseId).update(updateData);
    return this.getCourseById(courseId);
  }

  async deleteCourse(courseId) {
    await this.collection.doc(courseId).delete();
  }

  async getCoursesByInstructor(instructorId) {
    const snapshot = await this.collection
      .where('instructorId', '==', instructorId)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllCourses() {
    const snapshot = await this.collection.get();
    return this._snapshotToRaw(snapshot);
  }

  async getCoursesByCategory(category) {
    const snapshot = await this.collection
      .where('category', '==', category)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getSystemCourses() {
    const snapshot = await this.collection
      .where('isSystemCourse', '==', true)
      .get();
    return this._snapshotToRaw(snapshot);
  }

  async getAllCategories() {
    const snapshot = await this.collection.get();
    const courses = this._snapshotToRaw(snapshot);
    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
    return categories;
  }
}

export const courseDao = new CourseDao();