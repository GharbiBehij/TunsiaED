// src/modules/Course/model/dao/Course.dao.js
import { db } from '../../../../config/firebase.js';

export class CourseDao {
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

    const docRef = await db.collection('courses').add(courseDoc);
    
    return {
      courseId: docRef.id,
      ...courseDoc,
    };
  }

  async getCourseById(courseId) {
    const doc = await db.collection('courses').doc(courseId).get();
    return doc.exists ? doc.data() : null;
  }

  async updateCourse(courseId, data) {
    const updateData = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail || null;
    if (data.duration !== undefined) updateData.duration = data.duration;

    await db.collection('courses').doc(courseId).update(updateData);
    
    const updatedDoc = await db.collection('courses').doc(courseId).get();
    return updatedDoc.exists ? updatedDoc.data() : null;
  }

  async deleteCourse(courseId) {
    await db.collection('courses').doc(courseId).delete();
  }

  async getCoursesByInstructor(instructorId) {
    const snapshot = await db
      .collection('courses')
      .where('instructorId', '==', instructorId)
      .get();
    
    return snapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data(),
    }));
  }

  async getAllCourses() {
    const snapshot = await db.collection('courses').get();
    
    return snapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data(),
    }));
  }

  async getCoursesByCategory(category) {
    const snapshot = await db
      .collection('courses')
      .where('category', '==', category)
      .get();
    
    return snapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data(),
    }));
  }
}

export const courseDao = new CourseDao();

