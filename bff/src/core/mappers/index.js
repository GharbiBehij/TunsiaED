// Core Mappers Index
// Re-exports all mappers from their original module locations
// This provides a centralized import point while maintaining backward compatibility

// User Domain
export { UserMapper } from '../../Modules/User/mapper/User.mapper.js';

// Course Domain  
export { CourseMapper } from '../../Modules/Course/mapper/Course.mapper.js';
export { ChapterMapper } from '../../Modules/Chapter/mapper/Chapter.mapper.js';
export { LessonMapper } from '../../Modules/Lesson/mapper/Lesson.mapper.js';
export { QuizMapper } from '../../Modules/Quiz/mapper/Quiz.mapper.js';

// Enrollment & Progress Domain
export { EnrollmentMapper } from '../../Modules/Enrollement/mapper/Enrollment.mapper.js';
export { ProgressMapper } from '../../Modules/Progress/mapper/Progress.mapper.js';

// Payment Domain
export { PaymentMapper } from '../../Modules/payment/mapper/Payment.mapper.js';
export { TransactionMapper } from '../../Modules/Transaction/mapper/Transaction.mapper.js';

// Certificate Domain
export { CertificateMapper } from '../../Modules/Certificate/mapper/Certificate.mapper.js';

/**
 * Mapper Registry for dynamic access
 * Useful for generic mapper operations
 */
export const MAPPER_REGISTRY = {
  user: 'UserMapper',
  course: 'CourseMapper',
  chapter: 'ChapterMapper',
  lesson: 'LessonMapper',
  quiz: 'QuizMapper',
  enrollment: 'EnrollmentMapper',
  progress: 'ProgressMapper',
  payment: 'PaymentMapper',
  transaction: 'TransactionMapper',
  certificate: 'CertificateMapper',
};

export default {
  UserMapper: () => import('../../Modules/User/mapper/User.mapper.js'),
  CourseMapper: () => import('../../Modules/Course/mapper/Course.mapper.js'),
  ChapterMapper: () => import('../../Modules/Chapter/mapper/Chapter.mapper.js'),
  LessonMapper: () => import('../../Modules/Lesson/mapper/Lesson.mapper.js'),
  QuizMapper: () => import('../../Modules/Quiz/mapper/Quiz.mapper.js'),
  EnrollmentMapper: () => import('../../Modules/Enrollement/mapper/Enrollment.mapper.js'),
  ProgressMapper: () => import('../../Modules/Progress/mapper/Progress.mapper.js'),
  PaymentMapper: () => import('../../Modules/payment/mapper/Payment.mapper.js'),
  TransactionMapper: () => import('../../Modules/Transaction/mapper/Transaction.mapper.js'),
  CertificateMapper: () => import('../../Modules/Certificate/mapper/Certificate.mapper.js'),
};
