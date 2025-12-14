// src/hooks/Quiz/useQuiz.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QuizService from '../../services/QuizService';
import { useAuth } from '../../context/AuthContext';
import { QUIZ_KEYS } from '../../core/query/queryKeys';
import { getAffectedQueryKeys } from '../../core/query/mutationEffectMap';

/**
 * Fetch all quizzes (public)
 */
export const useAllQuizzes = () => {
  return useQuery({
    queryKey: QUIZ_KEYS.all(),
    queryFn: () => QuizService.getAllQuizzes(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

/**
 * Fetch a single quiz by ID (public)
 */
export const useQuizById = (quizId) => {
  return useQuery({
    queryKey: QUIZ_KEYS.detail(quizId),
    queryFn: () => QuizService.getQuizById(quizId),
    enabled: !!quizId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch quizzes for a specific course (public)
 */
export const useQuizzesByCourse = (courseId) => {
  return useQuery({
    queryKey: QUIZ_KEYS.byCourse(courseId),
    queryFn: () => QuizService.getQuizzesByCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch quizzes for a specific lesson (public)
 */
export const useQuizzesByLesson = (lessonId) => {
  return useQuery({
    queryKey: QUIZ_KEYS.byLesson(lessonId),
    queryFn: () => QuizService.getQuizzesByLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new quiz (instructor/admin only)
 */
export const useCreateQuiz = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizData) => QuizService.createQuiz(quizData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('createQuiz');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Update an existing quiz (instructor/admin only)
 */
export const useUpdateQuiz = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, quizData }) => QuizService.updateQuiz(quizId, quizData, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('updateQuiz');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};

/**
 * Delete a quiz (instructor/admin only)
 */
export const useDeleteQuiz = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId) => QuizService.deleteQuiz(quizId, token),
    onSuccess: () => {
      const affectedKeys = getAffectedQueryKeys('deleteQuiz');
      affectedKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
};