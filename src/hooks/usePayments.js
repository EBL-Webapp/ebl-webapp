import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsService from '../services/paymentsService';

/**
 * Custom hooks for payments using TanStack Query
 */

/**
 * Hook to fetch students with payment information
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} searchTerm - Search term
 * @returns {Object} Query object with students payment data
 */
export function useStudentsWithPayments(page, limit, searchTerm = '') {
    return useQuery({
        queryKey: ['students', 'payments', page, limit, searchTerm],
        queryFn: () => paymentsService.fetchStudentsWithPayments(page, limit, searchTerm),
    });
}

/**
 * Hook to fetch static charges
 * @returns {Object} Query object with static charges
 */
export function useStaticCharges() {
    return useQuery({
        queryKey: ['staticCharges'],
        queryFn: paymentsService.fetchStaticCharges,
    });
}

/**
 * Hook to fetch appliances
 * @returns {Object} Query object with appliances
 */
export function useAppliances() {
    return useQuery({
        queryKey: ['appliances'],
        queryFn: paymentsService.fetchAppliances,
    });
}

/**
 * Hook to create a payment
 * @returns {Object} Mutation object
 */
export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, adminID, paymentAmount, referenceID }) =>
            paymentsService.createPayment(studentNumber, adminID, paymentAmount, referenceID),
        onSuccess: (_, variables) => {
            // Invalidate students payment queries
            queryClient.invalidateQueries({ queryKey: ['students', 'payments'] });
            queryClient.invalidateQueries({ queryKey: ['students', variables.studentNumber] });
        },
    });
}

/**
 * Hook to update student balance
 * @returns {Object} Mutation object
 */
export function useUpdateStudentBalance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, newBalance }) =>
            paymentsService.updateStudentBalance(studentNumber, newBalance),
        onSuccess: (_, variables) => {
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
 * Hook to create an appliance
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
 * Hook to delete an appliance
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
 * Hook to trigger monthly charges
 * @returns {Object} Mutation object
 */
export function useTriggerMonthlyCharges() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (adminID) => paymentsService.triggerMonthlyCharges(adminID),
        onSuccess: () => {
            // Invalidate all student payment data after monthly charges
            queryClient.invalidateQueries({ queryKey: ['students', 'payments'] });
            queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
        },
    });
}
