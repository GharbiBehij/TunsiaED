// src/modules/Course/service/Course.service.js
import { courseRepository } from '../repository/Course.repository.js';
import { CoursePermission } from './CoursePermission.js';
import { CourseMapper } from '../mapper/Course.mapper.js';

export class CourseService {
  // Helper: Map raw data to model
  _toModel(raw) {
    return raw ? CourseMapper.toModel(raw.courseId, raw) : null;
  }

  _toModels(rawList) {
    return rawList.map(raw => CourseMapper.toModel(raw.courseId, raw));
  }

  _toEntity(instructorId, instructorName, model) {
    return CourseMapper.toEntity(instructorId, instructorName, model);
  }

  _toEntityUpdate(model) {
    return CourseMapper.toEntityUpdate(model);
  }

  // Create a new course (admin/instructor only)
  async createCourse(instructorId, instructorName, user, data) {
    if (!instructorId || !instructorName)
      throw new Error("Instructor information is required");

    if (!CoursePermission.create(user))
      throw new Error("Unauthorized");

    CourseMapper.validateCreate(data);

    const raw = await courseRepository.createCourse(
      instructorId,
      instructorName,
      data
    );
    return this._toModel(raw);
  }

  // Get a single course by ID (public)
  async getCourseById(courseId) {
    const raw = await courseRepository.findByCourseId(courseId);
    return this._toModel(raw);
  }

  // Update course details (admin/course owner only)
  async updateCourse(courseId, user, data) {
    const raw = await courseRepository.findByCourseId(courseId);
    if (!raw) throw new Error("Course not found");

    const course = this._toModel(raw);
    if (!CoursePermission.update(user, course))
      throw new Error("Unauthorized");

    const updated = await courseRepository.updateCourse(courseId, data);
    return this._toModel(updated);
  }

  // Delete a course (admin/course owner only)
  async deleteCourse(courseId, user) {
    const raw = await courseRepository.findByCourseId(courseId);
    if (!raw) throw new Error("Course not found");

    const course = this._toModel(raw);
    if (!CoursePermission.delete(user, course))
      throw new Error("Unauthorized");

    return await courseRepository.deleteCourse(courseId);
  }

  // Get all courses by a specific instructor (public)
  async getCoursesByInstructor(instructorId) {
    const rawList = await courseRepository.findCoursesByInstructor(instructorId);
    return this._toModels(rawList);
  }

  // Get all courses (public)
  async getAllCourses() {
    const rawList = await courseRepository.findAllCourses();
    return this._toModels(rawList);
  }

  // Get courses filtered by category (public)
  async getCoursesByCategory(category) {
    const rawList = await courseRepository.findCoursesByCategory(category);
    return this._toModels(rawList);
  }

  // Get system courses (public)
  async getSystemCourses() {
    const rawList = await courseRepository.findSystemCourses();
    return this._toModels(rawList);
  }

  // Get all unique categories (public)
  async getAllCategories() {
    return await courseRepository.findAllCategories();
  }

  // ====================================================================
  // INTERNAL METHODS (for orchestrator use - no permission checks)
  // ====================================================================

  /**
   * Get course by ID (internal - bypasses permission for orchestrator)
   * @param {string} courseId
   */
  async getCourseByIdInternal(courseId) {
    const raw = await courseRepository.findByCourseId(courseId);
    return this._toModel(raw);
  }

  /**
   * Get courses by instructor (internal - bypasses permission for orchestrator)
   * @param {string} instructorId
   */
  async getCoursesByInstructorInternal(instructorId) {
    const rawList = await courseRepository.findCoursesByInstructor(instructorId);
    return this._toModels(rawList);
  }

  /**
   * Get all courses (internal - bypasses permission for orchestrator)
   */
  async getAllCoursesInternal() {
    const rawList = await courseRepository.findAllCourses();
    return this._toModels(rawList);
  }
}

export const courseService = new CourseService();

