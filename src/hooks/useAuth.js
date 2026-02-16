import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService';

/**
 * Custom hooks for authentication using TanStack Query
 */

/**
 * Hook to get the current session
 * @returns {Object} Query object with session data
 */
export function useSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: authService.getCurrentSession,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to get admin info (session + adminID)
 * @returns {Object} Query object with admin data
 */
export function useAdminInfo() {
    return useQuery({
        queryKey: ['adminInfo'],
        queryFn: async () => {
            const session = await authService.getCurrentSession();
            if (!session || !session.session) {
                return null;
            }

            const adminID = await authService.getAdminIDFromUserID(session.session.user.id);
            return { session, adminID };
        },
    });
}

/**
 * Hook to get student number from session
 * @returns {Object} Query object with student number
 */
export function useStudentNumber() {
    return useQuery({
        queryKey: ['studentNumber'],
        queryFn: async () => {
            const session = await authService.getCurrentSession();
            if (!session || !session.session) {
                return null;
            }

            const studentNumber = await authService.getStudentNumberFromUserID(session.session.user.id);
            return studentNumber;
        },
    });
}

/**
 * Hook to sign in
 * @returns {Object} Mutation object for sign in
 */
export function useSignIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ email, password }) => authService.signIn(email, password),
        onSuccess: () => {
            // Invalidate session queries after successful sign in
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['adminInfo'] });
            queryClient.invalidateQueries({ queryKey: ['studentNumber'] });
        },
    });
}

/**
 * Hook to sign out
 * @returns {Object} Mutation object for sign out
 */
export function useSignOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.signOut,
        onSuccess: () => {
            // Clear all queries on sign out
            queryClient.clear();
        },
    });
}
