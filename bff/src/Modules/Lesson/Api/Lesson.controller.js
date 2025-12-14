// Controllers for Lesson HTTP endpoints.
import { lessonService } from '../service/Lesson.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

export const createLesson = async (req, res) => {
  try {
    const { courseId, chapterId } = req.body;
    if (!courseId || !chapterId) {
      return res.status(400).json({ error: 'courseId and chapterId are required' });
    }

    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    const lesson = await lessonService.createLesson(
      courseId,
      chapterId,
      user,
      req.body
    );

    res.status(201).json(lesson);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Course not found' || err.message === 'Chapter not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await lessonService.getLessonById(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLessonsByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const lessons = await lessonService.getLessonsByChapter(chapterId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await lessonService.getLessonsByCourse(courseId);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    const updated = await lessonService.updateLesson(
      lessonId,
      user,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ error: 'Update failed' });
    }

    res.json(updated);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Lesson not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isAdmin = user?.isAdmin === true;

    await lessonService.deleteLesson(lessonId, user);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Lesson not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const lessonController = {
  createLesson,
  getLessonById,
  getLessonsByChapter,
  getLessonsByCourse,
  getAllLessons,
  updateLesson,
  deleteLesson,
};


