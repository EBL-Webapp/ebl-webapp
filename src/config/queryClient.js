import { QueryClient } from '@tanstack/react-query';

/**
 * Configured QueryClient instance for the application
 * 
 * Configuration:
 * - gcTime: 10 minutes (600,000ms) - How long inactive data stays in cache
 * - staleTime: 5 minutes (300,000ms) - How long data is considered fresh
 * - refetchInterval: 5 minutes (300,000ms) - Auto-refetch interval for active queries
 * - refetchOnWindowFocus: true - Refetch when user returns to the tab
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache garbage collection time - data removed from cache after 10 minutes of inactivity
            gcTime: 10 * 60 * 1000, // 10 minutes

            // Stale time - data considered fresh for 5 minutes (won't refetch during this time)
            staleTime: 5 * 60 * 1000, // 5 minutes

            // Automatic refetch interval - refetch every 5 minutes while query is active
            refetchInterval: 5 * 60 * 1000, // 5 minutes

            // Refetch when window regains focus
            refetchOnWindowFocus: true,

            // Refetch when network reconnects
            refetchOnReconnect: true,

            // Retry failed requests
            retry: 1,

            // Retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // Retry mutations once on failure
            retry: 1,
        },
    },
});
