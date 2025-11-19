// src/modules/Course/service/Course.service.js
import { courseRepository } from '../repository/Course.repository.js';
import { CourseMapper } from '../mapper/Course.mapper.js';

export class CourseService {
  async createCourse(instructorId, instructorName, data) {
    // Validate that instructor exists (could add user validation here)
    if (!instructorId || !instructorName) {
      throw new Error('Instructor information is required');
    }

    const course = await courseRepository.createCourse(
      instructorId,
      instructorName,
      data
    );

    return CourseMapper.toResponse(course, 'Course created successfully');
  }

  async getCourseById(courseId) {
    const course = await courseRepository.findByCourseId(courseId);
    if (!course) return null;

    return CourseMapper.toResponse(course, 'Course retrieved successfully');
  }

  async updateCourse(courseId, instructorId, data) {
    // Check if course exists and belongs to instructor
    const existingCourse = await courseRepository.findByCourseId(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    if (existingCourse.instructorId !== instructorId) {
      throw new Error('Unauthorized: You can only update your own courses');
    }

    const updatedCourse = await courseRepository.updateCourse(courseId, data);
    if (!updatedCourse) return null;

    return CourseMapper.toResponse(updatedCourse, 'Course updated successfully');
  }

  async deleteCourse(courseId, instructorId) {
    // Check if course exists and belongs to instructor
    const existingCourse = await courseRepository.findByCourseId(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    if (existingCourse.instructorId !== instructorId) {
      throw new Error('Unauthorized: You can only delete your own courses');
    }

    const deleted = await courseRepository.deleteCourse(courseId);
    if (!deleted) {
      throw new Error('Failed to delete course');
    }
  }

  async getCoursesByInstructor(instructorId) {
    const courses = await courseRepository.findCoursesByInstructor(instructorId);
    return courses.map((course) =>
      CourseMapper.toResponse(course, 'Courses retrieved successfully')
    );
  }

  async getAllCourses() {
    const courses = await courseRepository.findAllCourses();
    return courses.map((course) =>
      CourseMapper.toResponse(course, 'Courses retrieved successfully')
    );
  }

  async getCoursesByCategory(category) {
    const courses = await courseRepository.findCoursesByCategory(category);
    return courses.map((course) =>
      CourseMapper.toResponse(course, 'Courses retrieved successfully')
    );
  }
}

export const courseService = new CourseService();

