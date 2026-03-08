import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsService from '../services/paymentsService';

/**
 * Custom hooks for payments and charges using TanStack Query
 */

/**
 * Hook to fetch students with payment info (paginated)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} searchTerm - Search term
 * @returns {Object} Query object with students data
 */
export function useStudentsWithPayments(page, limit, searchTerm = '') {
    return useQuery({
        queryKey: ['students', 'payments', page, limit, searchTerm],
        queryFn: () => paymentsService.fetchStudentsWithPayments(page, limit, searchTerm),
        placeholderData: (previousData) => previousData, // keep previous data while fetching next page
    });
}

/**
 * Hook to fetch static charges (rent, surcharge).
 * Uses staleTime: Infinity since this data changes very rarely (admin action required).
 * @param {boolean} [enabled=true] - Whether the query should run
 * @returns {Object} Query object with charges object
 */
export function useStaticCharges(enabled = true) {
    return useQuery({
        queryKey: ['staticCharges'],
        queryFn: paymentsService.fetchStaticCharges,
        staleTime: Infinity,       // Never stale — only invalidated on mutation
        refetchInterval: false,    // No polling needed
        enabled,
    });
}

/**
 * Hook to fetch all appliances (list of available appliances).
 * Uses staleTime: Infinity since the list changes via admin mutations only.
 * @param {boolean} [enabled=true] - Whether the query should run
 * @returns {Object} Query object with appliances
 */
export function useAppliances(enabled = true) {
    return useQuery({
        queryKey: ['appliances'],
        queryFn: paymentsService.fetchAppliances,
        staleTime: Infinity,       // Never stale — only invalidated on mutation
        refetchInterval: false,    // No polling needed
        enabled,
    });
}

/**
 * Hook to fetch appliances owned by a specific student
 * @param {string} studentNumber - Student number
 * @returns {Object} Query object with student's appliances
 */
export function useStudentAppliances(studentNumber) {
    return useQuery({
        queryKey: ['appliances', 'student', studentNumber],
        queryFn: () => paymentsService.fetchStudentAppliances(studentNumber),
        enabled: !!studentNumber,
    });
}

/**
 * Hook to create a payment record
 * @returns {Object} Mutation object
 */
export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, adminID, paymentAmount, referenceID }) =>
            paymentsService.createPayment(studentNumber, adminID, paymentAmount, referenceID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students', 'payments'] });
        },
    });
}

/**
 * Hook to update a student's balance
 * @returns {Object} Mutation object
 */
export function useUpdateStudentBalance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, newBalance }) =>
            paymentsService.updateStudentBalance(studentNumber, newBalance),
        onSuccess: (_, variables) => {
            // Invalidate the specific student's payment data and the payments list
            queryClient.invalidateQueries({ queryKey: ['students', 'payments'] });
            queryClient.invalidateQueries({ queryKey: ['students', variables.studentNumber] });
        },
    });
}

/**
 * Hook to update a static charge
 * @returns {Object} Mutation object
 */
export function useUpdateStaticCharge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chargeName, chargeValue }) =>
            paymentsService.updateStaticCharge(chargeName, chargeValue),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staticCharges'] });
        },
    });
}

/**
 * Hook to create a new appliance type
 * @returns {Object} Mutation object
 */
export function useCreateAppliance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applianceName, cost }) =>
            paymentsService.createAppliance(applianceName, cost),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliances'] });
        },
    });
}

/**
 * Hook to delete an appliance type
 * @returns {Object} Mutation object
 */
export function useDeleteAppliance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (applianceID) => paymentsService.deleteAppliance(applianceID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliances'] });
        },
    });
}

/**
 * Hook to trigger monthly charges via Edge Function
 * @returns {Object} Mutation object
 */
export function useTriggerMonthlyCharges() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (adminID) => paymentsService.triggerMonthlyCharges(adminID),
        onSuccess: () => {
            // Balances will change for all students — invalidate the payments list
            queryClient.invalidateQueries({ queryKey: ['students', 'payments'] });
        },
    });
}
