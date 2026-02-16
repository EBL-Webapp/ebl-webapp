import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as rolesService from '../services/rolesService';

/**
 * Custom hooks for roles/admin management using TanStack Query
 */

/**
 * Hook to fetch admins
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Query object with admins
 */
export function useAdmins(page, limit) {
    return useQuery({
        queryKey: ['admins', page, limit],
        queryFn: () => rolesService.fetchAdmins(page, limit),
    });
}

/**
 * Hook to fetch pending registrations
 * @returns {Object} Query object with pending registrations
 */
export function usePendingRegistrations() {
    return useQuery({
        queryKey: ['registrations', 'pending'],
        queryFn: rolesService.fetchPendingRegistrations,
    });
}

/**
 * Hook to delete an admin
 * @returns {Object} Mutation object
 */
export function useDeleteAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (adminID) => rolesService.deleteAdmin(adminID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        },
    });
}

/**
 * Hook to approve a registration
 * @returns {Object} Mutation object
 */
export function useApproveRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type }) => rolesService.approveRegistration(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', 'pending'] });
        },
    });
}

/**
 * Hook to deny a registration
 * @returns {Object} Mutation object
 */
export function useDenyRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type }) => rolesService.denyRegistration(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['registrations', 'pending'] });
        },
    });
}
