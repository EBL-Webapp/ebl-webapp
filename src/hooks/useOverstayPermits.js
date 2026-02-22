import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as overstayPermitsService from '../services/overstayPermitsService';

/**
 * Custom hooks for overstay/overnight permits using TanStack Query
 */

/**
 * Hook to fetch permits pending approval
 * @returns {Object} Query object with pending approval permits
 */
export function usePendingApprovalPermits() {
    return useQuery({
        queryKey: ['permits', 'pendingApproval'],
        queryFn: overstayPermitsService.fetchPendingApprovalPermits,
    });
}

/**
 * Hook to fetch permits pending validation
 * @returns {Object} Query object with pending validation permits
 */
export function usePendingValidationPermits() {
    return useQuery({
        queryKey: ['permits', 'pendingValidation'],
        queryFn: overstayPermitsService.fetchPendingValidationPermits,
    });
}

/**
 * Hook to fetch student's overnight slips
 * @param {string} studentNumber - Student number
 * @returns {Object} Query object with student's slips
 */
export function useStudentOvernightSlips(studentNumber) {
    return useQuery({
        queryKey: ['permits', 'student', studentNumber],
        queryFn: () => overstayPermitsService.fetchStudentOvernightSlips(studentNumber),
        enabled: !!studentNumber,
    });
}

/**
 * Hook to approve a permit
 * @returns {Object} Mutation object
 */
export function useApprovePermit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, adminID }) =>
            overstayPermitsService.approvePermit(requestId, adminID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingApproval'] });
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingValidation'] });
        },
    });
}

/**
 * Hook to deny a permit
 * @returns {Object} Mutation object
 */
export function useDenyPermit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, adminID }) =>
            overstayPermitsService.denyPermit(requestId, adminID),
        onSuccess: () => {
            // Invalidate both queues — a denied permit should leave both lists
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingApproval'] });
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingValidation'] });
        },
    });
}

/**
 * Hook to validate a permit
 * @returns {Object} Mutation object
 */
export function useValidatePermit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, adminID }) =>
            overstayPermitsService.validatePermit(requestId, adminID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingValidation'] });
        },
    });
}

/**
 * Hook to create an overnight slip
 * @returns {Object} Mutation object
 */
export function useCreateOvernightSlip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, fromDate, toDate, reason }) =>
            overstayPermitsService.createOvernightSlip(studentNumber, fromDate, toDate, reason),
        onSuccess: (_, variables) => {
            // Invalidate student's overnight slips
            queryClient.invalidateQueries({ queryKey: ['permits', 'student', variables.studentNumber] });
            queryClient.invalidateQueries({ queryKey: ['permits', 'pendingApproval'] });
        },
    });
}
