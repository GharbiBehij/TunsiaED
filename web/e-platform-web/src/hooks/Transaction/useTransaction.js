// src/hooks/Transaction/useTransaction.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TransactionService from '../../services/TransactionService';
import { useAuth } from '../../context/AuthContext';
import { TRANSACTION_KEYS } from '../../core/query/queryKeys';

/**
 * Create a new transaction
 * @returns {UseMutationResult} Mutation for creating transaction
 */
export function useCreateTransaction() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData) => TransactionService.createTransaction(transactionData, token),
    onSuccess: (data) => {
      // Invalidate user's transactions and related queries
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byStatus(data.status) });
      if (data.paymentId) {
        queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byPayment(data.paymentId) });
      }
      if (data.courseId) {
        queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byCourse(data.courseId) });
      }
    },
  });
}

/**
 * Get user's transactions
 * @returns {UseQueryResult} User's transaction data
 */
export function useGetUserTransactions() {
  const { token } = useAuth();

  return useQuery({
    queryKey: TRANSACTION_KEYS.user(),
    queryFn: () => TransactionService.getUserTransactions(token),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get transaction by ID
 * @param {string} transactionId - The transaction ID
 * @returns {UseQueryResult} Transaction data
 */
export function useGetTransactionById(transactionId) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TRANSACTION_KEYS.detail(transactionId),
    queryFn: () => TransactionService.getTransactionById(transactionId, token),
    enabled: !!token && !!transactionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get transactions by payment ID
 * @param {string} paymentId - The payment ID
 * @returns {UseQueryResult} Transactions for the payment
 */
export function useGetTransactionsByPayment(paymentId) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TRANSACTION_KEYS.byPayment(paymentId),
    queryFn: () => TransactionService.getTransactionsByPayment(paymentId, token),
    enabled: !!token && !!paymentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get transactions by course ID
 * @param {string} courseId - The course ID
 * @returns {UseQueryResult} Transactions for the course
 */
export function useGetCourseTransactions(courseId) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TRANSACTION_KEYS.byCourse(courseId),
    queryFn: () => TransactionService.getCourseTransactions(courseId, token),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get transactions by status
 * @param {string} status - Transaction status
 * @returns {UseQueryResult} Transactions with the specified status
 */
export function useGetTransactionsByStatus(status) {
  const { token } = useAuth();

  return useQuery({
    queryKey: TRANSACTION_KEYS.byStatus(status),
    queryFn: () => TransactionService.getTransactionsByStatus(status, token),
    enabled: !!token && !!status,
    staleTime: 1 * 60 * 1000, // 1 minute - status queries may change frequently
  });
}

/**
 * Update transaction
 * @param {string} transactionId - The transaction ID to update
 * @returns {UseMutationResult} Mutation for updating transaction
 */
export function useUpdateTransaction(transactionId) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionData) => TransactionService.updateTransaction(transactionId, transactionData, token),
    onSuccess: (data) => {
      // Invalidate affected transaction queries
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.detail(transactionId) });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.user() });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byStatus(data.status) });
      if (data.paymentId) {
        queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byPayment(data.paymentId) });
      }
      if (data.courseId) {
        queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.byCourse(data.courseId) });
      }
    },
  });
}