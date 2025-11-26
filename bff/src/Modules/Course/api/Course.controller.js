// src/modules/Course/controller/Course.controller.js
import { courseService } from "../service/Course.service.js";
import { OnboardSchema, UpdateCourseSchema } from "../Validators/Course.schema.js";
import { userRepository } from "../../User/repository/User.repository.js";

// CREATE COURSE (Instructor/Admin)
export const onboardCourse = async (req, res) => {
  const parsed = OnboardSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: parsed.error.format()
    });
  }

  try {
    const instructorId = req.user.uid;
  
    // Get user from database to check role and get name
    const user = await userRepository.findByUid(instructorId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.isInstructor && !user.isAdmin) {
      return res.status(403).json({ error: "Only instructors can create courses" });
    }

    const course = await courseService.createCourse(
      instructorId,
      user.name,
      user,
      parsed.data
    );

    return res.status(201).json({ message: "Course created", course });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET A SINGLE COURSE
export const getMyCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseService.getMyCourse(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET INSTRUCTOR'S COURSES
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.uid;
    const courses = await courseService.getCoursesByInstructor(instructorId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE A COURSE
export const updateMyCourse = async (req, res) => {
  const parsed = UpdateCourseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid data",
      details: parsed.error.format()
    });
  }

  try {
    const courseId = req.params.courseId;
    const userId = req.user.uid;
    
    const user = await userRepository.findByUid(userId);

    const updated = await courseService.updateMyCourse(
      courseId,
      user,
      parsed.data
    );

    if (!updated) {
      return res.status(404).json({ error: "Update failed" });
    }

    res.json(updated);
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE A COURSE
export const deleteMycourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.uid;
    
    const user = await userRepository.findByUid(userId);

    await courseService.deleteMycourse(courseId, user);
    
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === "Course not found") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Public filter by category
export const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await courseService.getCoursesByCategory(category);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const courseController = {
  createCourse: onboardCourse,
  getCourseById: getMyCourse,
  getAllCourses,
  getCoursesByCategory,
  getCoursesByInstructor: getInstructorCourses,
  updateCourse: updateMyCourse,
  deleteCourse: deleteMycourse
};