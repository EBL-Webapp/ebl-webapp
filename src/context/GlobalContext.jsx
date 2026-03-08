import React, { createContext, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/authService';
import { useStaticCharges, useAppliances } from '../hooks/usePayments';

/**
 * Global Context
 * Provides globally shared data across the application.
 * Only fetches data relevant to the current user's role.
 */

const GlobalContext = createContext(null);

/**
 * Detect user role from the current URL path.
 * Returns 'admin', 'student', or null for other pages.
 */
function getRoleFromPath() {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/student')) return 'student';
    return null;
}

/**
 * Global Context Provider
 * Fetches and provides shared data based on user role
 */
export function GlobalContextProvider({ children }) {
    const queryClient = useQueryClient();
    const role = getRoleFromPath();
    const isAdmin = role === 'admin';
    const isStudent = role === 'student';

    // Fetch admin info only on admin pages
    const {
        data: adminInfo,
        isLoading: isLoadingAdmin,
        error: errorAdmin,
    } = useQuery({
        queryKey: ['adminInfo'],
        queryFn: async () => {
            const session = queryClient.getQueryData(['session'])
                ?? await authService.getCurrentSession();
            if (!session || !session.session) return null;
            const adminID = await authService.getAdminIDFromUserID(session.session.user.id);
            return { session, adminID };
        },
        enabled: isAdmin,
    });

    // Fetch student number only on student pages
    const {
        data: studentNumber,
        isLoading: isLoadingStudent,
        error: errorStudent,
    } = useQuery({
        queryKey: ['studentNumber'],
        queryFn: async () => {
            const session = queryClient.getQueryData(['session'])
                ?? await authService.getCurrentSession();
            if (!session || !session.session) return null;
            return authService.getStudentNumberFromUserID(session.session.user.id);
        },
        enabled: isStudent,
    });

    // Fetch static charges only on admin pages
    const {
        data: staticCharges,
        isLoading: isLoadingCharges,
        error: errorCharges,
    } = useStaticCharges(isAdmin);

    // Fetch appliances only on admin pages
    const {
        data: appliances,
        isLoading: isLoadingAppliances,
        error: errorAppliances,
    } = useAppliances(isAdmin);

    // Only include loading states for enabled queries
    const isLoading = (isAdmin && (isLoadingAdmin || isLoadingCharges || isLoadingAppliances))
        || (isStudent && isLoadingStudent);
    const hasError = !!(errorAdmin || errorStudent || errorCharges || errorAppliances);

    const contextValue = useMemo(() => ({
        // Admin data
        session: adminInfo?.session || null,
        adminID: adminInfo?.adminID || null,

        // Student data
        studentNumber: studentNumber || null,

        // Shared data (only populated for admin)
        staticCharges: staticCharges || { rent: 0, surcharge: 0 },
        appliances: appliances || [],

        // Loading states
        isLoading,
        isLoadingAdmin: isAdmin ? isLoadingAdmin : false,
        isLoadingStudent: isStudent ? isLoadingStudent : false,
        isLoadingCharges: isAdmin ? isLoadingCharges : false,
        isLoadingAppliances: isAdmin ? isLoadingAppliances : false,

        // Error states
        hasError,
        errorAdmin: errorAdmin || null,
        errorStudent: errorStudent || null,
        errorCharges: errorCharges || null,
        errorAppliances: errorAppliances || null,
    }), [adminInfo, studentNumber, staticCharges, appliances, isLoading, hasError,
         isLoadingAdmin, isLoadingStudent, isLoadingCharges, isLoadingAppliances,
         errorAdmin, errorStudent, errorCharges, errorAppliances, isAdmin, isStudent]);

    return (
        <GlobalContext.Provider value={contextValue}>
            {children}
        </GlobalContext.Provider>
    );
}

/**
 * Hook to use the global context
 * @returns {Object} Global context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGlobalContext() {
    const context = useContext(GlobalContext);

    if (!context) {
        console.error(
            'useGlobalContext: context is null. GlobalContext ref:',
            GlobalContext,
            'This may indicate module duplication.'
        );
        // Return safe defaults so the app doesn't crash
        return {
            session: null,
            adminID: null,
            studentNumber: null,
            staticCharges: { rent: 0, surcharge: 0 },
            appliances: [],
            isLoading: true,
            isLoadingAdmin: true,
            isLoadingStudent: true,
            isLoadingCharges: true,
            isLoadingAppliances: true,
            hasError: false,
            errorAdmin: null,
            errorStudent: null,
            errorCharges: null,
            errorAppliances: null,
        };
    }

    return context;
}
