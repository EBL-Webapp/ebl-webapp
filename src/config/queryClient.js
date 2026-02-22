import { QueryClient } from '@tanstack/react-query';

/**
 * Configured QueryClient instance for the application
 *
 * Configuration:
 * - gcTime: 10 minutes — How long inactive data stays in cache before GC
 * - staleTime: 5 minutes — How long fresh data won't trigger a background refetch
 * - refetchOnWindowFocus: true — Refetch when user returns to the tab
 * - refetchOnReconnect: true — Refetch when network reconnects
 *
 * NOTE: refetchInterval is NOT set globally. Apply it only on queries
 * that need real-time updates (e.g., pending permits, pending approvals).
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache garbage collection time — data removed after 10 minutes of inactivity
            gcTime: 10 * 60 * 1000, // 10 minutes

            // Stale time — data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Refetch when window regains focus
            refetchOnWindowFocus: true,

            // Refetch when network reconnects
            refetchOnReconnect: true,

            // Retry failed requests once
            retry: 1,

            // Exponential backoff, capped at 30s
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});
