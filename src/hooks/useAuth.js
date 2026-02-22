import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService';

/**
 * Custom hooks for authentication using TanStack Query
 */

/**
 * Hook to get the current session.
 * This is the single source of truth for the session —
 * useAdminInfo and useStudentNumber read from this via the cache.
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
 * Hook to get admin info (session + adminID).
 * Depends on useSession — avoids a duplicate getSession() call.
 * @returns {Object} Query object with admin data
 */
export function useAdminInfo() {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['adminInfo'],
        queryFn: async () => {
            // Re-use the already-cached session — won't trigger a new network request
            const session = queryClient.getQueryData(['session'])
                ?? await authService.getCurrentSession();

            if (!session || !session.session) {
                return null;
            }

            const adminID = await authService.getAdminIDFromUserID(session.session.user.id);
            return { session, adminID };
        },
    });
}

/**
 * Hook to get student number from session.
 * Depends on useSession — avoids a duplicate getSession() call.
 * @returns {Object} Query object with student number
 */
export function useStudentNumber() {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['studentNumber'],
        queryFn: async () => {
            // Re-use the already-cached session — won't trigger a new network request
            const session = queryClient.getQueryData(['session'])
                ?? await authService.getCurrentSession();

            if (!session || !session.session) {
                return null;
            }

            const studentNumber = await authService.getStudentNumberFromUserID(
                session.session.user.id
            );
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
            // Invalidate all auth-related queries so they re-fetch with the new session
            queryClient.invalidateQueries({ queryKey: ['session'] });
            queryClient.invalidateQueries({ queryKey: ['adminInfo'] });
            queryClient.invalidateQueries({ queryKey: ['studentNumber'] });
        },
    });
}

/**
 * Hook to sign out.
 * Removes only auth-related query data instead of clearing the entire cache.
 * @returns {Object} Mutation object for sign out
 */
export function useSignOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.signOut,
        onSuccess: () => {
            // Full cache clear on sign out to prevent any data leakage
            queryClient.clear();
        },
    });
}
