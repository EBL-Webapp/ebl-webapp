import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as rolesService from '../services/rolesService';

/**
 * Custom hooks for roles/admin management using TanStack Query
 */

/**
 * Hook to fetch role requests (paginated)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Query object with role requests
 */
export function useRoleRequests(page, limit) {
    return useQuery({
        queryKey: ['roleRequests', page, limit],
        queryFn: () => rolesService.fetchRoleRequests(page, limit),
        keepPreviousData: true,
    });
}

/**
 * Hook to fetch all admins
 * @returns {Object} Query object with admins
 */
export function useAdmins() {
    return useQuery({
        queryKey: ['admins'],
        queryFn: rolesService.fetchAdmins,
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
 * Hook to approve a registration/role request
 * @returns {Object} Mutation object
 */
export function useApproveRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type }) => rolesService.approveRegistration(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roleRequests'] });
            queryClient.invalidateQueries({ queryKey: ['admins'] }); // In case an admin was approved
        },
    });
}

/**
 * Hook to deny (delete) a registration/role request
 * @returns {Object} Mutation object
 */
export function useDenyRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type }) => rolesService.denyRegistration(id, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roleRequests'] });
        },
    });
}
