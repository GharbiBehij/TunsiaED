// src/modules/Course/repository/Course.repository.js
import { courseDao } from '../model/dao/Course.dao.js';

export class CourseRepository {
  // Create course via DAO
  async createCourse(instructorId, instructorName, data) {
    return await courseDao.createCourse(instructorId, instructorName, data);
  }

  // Find a course by ID via DAO
  async findByCourseId(courseId) {
    try {
      const doc = await courseDao.getCourseById(courseId);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Update course via DAO
  async updateCourse(courseId, data) {
    try {
      const doc = await courseDao.updateCourse(courseId, data);
      return doc || null;
    } catch {
      return null;
    }
  }

  // Delete course via DAO
  async deleteCourse(courseId) {
    try {
      await courseDao.deleteCourse(courseId);
      return true;
    } catch {
      return false;
    }
  }

  // Find all courses by instructor via DAO
  async findCoursesByInstructor(instructorId) {
    try {
      const docs = await courseDao.getCoursesByInstructor(instructorId);
      return docs;
    } catch {
      return [];
    }
  }

  // Find all courses via DAO
  async findAllCourses() {
    try {
      const docs = await courseDao.getAllCourses();
      return docs;
    } catch {
      return [];
    }
  }

  // Find courses by category via DAO
  async findCoursesByCategory(category) {
    try {
      const docs = await courseDao.getCoursesByCategory(category);
      return docs;
    } catch {
      return [];
    }
  }

  // Find system courses via DAO
  async findSystemCourses() {
    try {
      const docs = await courseDao.getSystemCourses();
      return docs;
    } catch {
      return [];
    }
  }

  // Get all unique categories via DAO
  async findAllCategories() {
    try {
      const categories = await courseDao.getAllCategories();
      return categories;
    } catch {
      return [];
    }
  }
}

export const courseRepository = new CourseRepository();

