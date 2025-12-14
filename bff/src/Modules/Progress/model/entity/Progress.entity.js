// Progress Entity
export class Progress {
  constructor(
    progressId,
    enrollmentId,
    moduleType, // 'course', 'quiz', 'lesson', 'chapter'
    moduleId,
    userId,
    progress, // 0-100
    completedItems,
    totalItems,
    completed,
    startedAt,
    completedAt,
    lastAccessedAt,
    rawData = {}
  ) {
    this.progressId = progressId;
    this.enrollmentId = enrollmentId;
    this.moduleType = moduleType;
    this.moduleId = moduleId;
    this.userId = userId;
    this.progress = progress;
    this.completedItems = completedItems;
    this.totalItems = totalItems;
    this.completed = completed;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.lastAccessedAt = lastAccessedAt;
    this.rawData = rawData;
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress() {
    if (this.totalItems === 0) return 0;
    return Math.floor((this.completedItems / this.totalItems) * 100);
  }

  /**
   * Check if progress is complete
   */
  isComplete() {
    return this.progress >= 100;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      progressId: this.progressId,
      enrollmentId: this.enrollmentId,
      moduleType: this.moduleType,
      moduleId: this.moduleId,
      userId: this.userId,
      progress: this.progress,
      completedItems: this.completedItems,
      totalItems: this.totalItems,
      completed: this.completed,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      lastAccessedAt: this.lastAccessedAt,
      ...this.rawData,
    };
  }
}
