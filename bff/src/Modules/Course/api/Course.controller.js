// bff/src/Modules/Course/api/Course.controller.js
import { courseService } from '../service/Course.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

export class CourseController {
  async createCourse(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Fetch user from repository to get name
      const user = await userRepository.findById(userId);
      const userName = user?.name || 'Unknown Instructor';

      const result = await courseService.createCourse(userId, userName, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to create course' });
    }
  }

  async getCourseById(req, res) {
    try {
      const { courseId } = req.params;
      const course = await courseService.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.status(200).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch course' });
    }
  }

  async updateCourse(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId } = req.params;
      const result = await courseService.updateCourse(courseId, userId, req.body);
      
      if (!result) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to update course' });
    }
  }

  async deleteCourse(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { courseId } = req.params;
      await courseService.deleteCourse(courseId, userId);
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to delete course' });
    }
  }

  async getCoursesByInstructor(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const courses = await courseService.getCoursesByInstructor(userId);
      res.status(200).json({ courses });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch courses' });
    }
  }

  async getAllCourses(req, res) {
    try {
      const courses = await courseService.getAllCourses();
      res.status(200).json({ courses });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch courses' });
    }
  }

  async getCoursesByCategory(req, res) {
    try {
      const { category } = req.params;
      const courses = await courseService.getCoursesByCategory(category);
      res.status(200).json({ courses });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Failed to fetch courses' });
    }
  }
}

export const courseController = new CourseController();

