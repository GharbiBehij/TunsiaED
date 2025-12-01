// src/modules/Course/service/Course.service.js
import { courseRepository } from '../repository/Course.repository.js';
import { CoursePermission } from './CoursePermission.js';


export class CourseService {

  async createCourse(instructorId, instructorName, user, data) {
    if (!instructorId || !instructorName)
      throw new Error("Instructor information is required");

    if (!CoursePermission.create(user))
      throw new Error("Unauthorized");

    return await courseRepository.createCourse(
      instructorId,
      instructorName,
      data
    );
  }

  async getMyCourse(courseId) {
    return await courseRepository.findByCourseId(courseId);
  }

  async updateMyCourse(courseId, user, data) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) throw new Error("Course not found");

    if (!CoursePermission.update(user, course))
      throw new Error("Unauthorized");

    return await courseRepository.updateCourse(courseId, data);
  }

  async deleteMycourse(courseId, user) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) throw new Error("Course not found");

    if (!CoursePermission.delete(user, course))
      throw new Error("Unauthorized");

    return await courseRepository.deleteCourse(courseId);
  }

  async getCoursesByInstructor(instructorId) {
    const courses = await courseRepository.findCoursesByInstructor(instructorId);
    return courses;
  }

  async getAllCourses() {
    const courses = await courseRepository.findAllCourses();
    return courses;
  }

  async getCoursesByCategory(category) {
    const courses = await courseRepository.findCoursesByCategory(category);
    return courses
  }
}

export const courseService = new CourseService();

