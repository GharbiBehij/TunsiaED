// Progress Controller
import { progressService } from '../service/Progress.service.js';
import { userRepository } from '../../User/repository/User.repository.js';
import { userService } from '../../User/service/User.service.js';

export class ProgressController {
  /**
   * Get or create progress for a module
   */
  async getOrCreateProgress(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const progress = await progressService.getOrCreateProgress(user, req.body);
      
      res.status(200).json(progress.toJSON());
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to get or create progress' });
    }
  }

  /**
   * Get progress by ID
   */
  async getProgressById(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { progressId } = req.params;
      
      const progress = await progressService.getProgressById(user, progressId);
      res.status(200).json(progress.toJSON());
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Progress not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to fetch progress' });
    }
  }

  /**
   * Get all progress for an enrollment
   */
  async getProgressByEnrollment(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { enrollmentId } = req.params;
      
      const progressList = await progressService.getProgressByEnrollment(user, enrollmentId);
      res.status(200).json({ progress: progressList.map(p => p.toJSON()) });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to fetch enrollment progress' });
    }
  }

  /**
   * Get all progress for the authenticated user
   */
  async getMyProgress(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const progressList = await progressService.getProgressByUser(user);
      
      res.status(200).json({ progress: progressList.map(p => p.toJSON()) });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to fetch progress' });
    }
  }

  /**
   * Get progress for a specific module
   */
  async getProgressByModule(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { moduleType, moduleId } = req.params;
      
      const progressList = await progressService.getProgressByModule(user, moduleType, moduleId);
      res.status(200).json({ progress: progressList.map(p => p.toJSON()) });
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to fetch module progress' });
    }
  }

  /**
   * Update progress
   */
  async updateProgress(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { progressId } = req.params;
      
      const updated = await progressService.updateProgress(user, progressId, req.body);
      res.status(200).json(updated.toJSON());
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Progress not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to update progress' });
    }
  }

  /**
   * Mark an item as completed
   */
  async markItemCompleted(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { progressId } = req.params;
      const { itemId } = req.body;
      
      if (!itemId) {
        return res.status(400).json({ error: 'itemId is required' });
      }

      const updated = await progressService.markItemCompleted(user, progressId, itemId);
      res.status(200).json(updated.toJSON());
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      if (error.message === 'Progress not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to mark item completed' });
    }
  }

  /**
   * Get user's course progress summary
   */
  async getUserCourseProgressSummary(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { courseId } = req.params;
      
      const progress = await progressService.getUserCourseProgressSummary(user, courseId);
      
      if (!progress) {
        return res.status(404).json({ error: 'Progress not found' });
      }

      res.status(200).json(progress.toJSON());
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to fetch course progress' });
    }
  }

  /**
   * Delete progress (admin only)
   */
  async deleteProgress(req, res) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await userService.getUserByUidInternal(userId);
      const { progressId } = req.params;
      
      const result = await progressService.deleteProgress(user, progressId);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message || 'Failed to delete progress' });
    }
  }
}

export const progressController = new ProgressController();
