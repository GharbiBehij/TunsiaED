// Controllers for Chapter HTTP endpoints.
import { chapterService } from '../service/Chapter.service.js';
import { userRepository } from '../../User/repository/User.repository.js';

export const createChapter = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isInstructor = user?.isInstructor === true;

    const chapter = await chapterService.createChapter(
      courseId,
      user,
      req.body
    );

    res.status(201).json(chapter);
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const chapter = await chapterService.getChapterById(chapterId);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const chapters = await chapterService.getChaptersByCourse(courseId);
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllChapters = async (req, res) => {
  try {
    const chapters = await chapterService.getAllChapters();
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);
    const isInstructor = user?.isInstructor === true;

    const updated = await chapterService.updateChapter(
      chapterId,
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
    if (err.message === 'Chapter not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.uid;
    const user = await userRepository.findByUid(userId);//needs to exist to know who is logged in
    const isAdmin = user?.isAdmin === true;

    await chapterService.deleteChapter(chapterId, user);

    res.json({ message: 'Chapter deleted successfully' });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return res.status(403).json({ error: err.message });
    }
    if (err.message === 'Chapter not found' || err.message === 'Course not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const chapterController = {
  createChapter,
  getChapterById,
  getChaptersByCourse,
  getAllChapters,
  updateChapter,
  deleteChapter,
};


