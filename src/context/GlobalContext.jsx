import React, { createContext, useContext } from 'react';
import { useAdminInfo } from '../hooks/useAuth';
import { useStaticCharges, useAppliances } from '../hooks/usePayments';
import { useStudentNumber } from '../hooks/useAuth';

/**
 * Global Context
 * Provides globally shared data across the application.
 * Exposes both data and error states for all parallel queries.
 */

const GlobalContext = createContext(null);

/**
 * Global Context Provider
 * Fetches and provides shared data to the entire app
 */
export function GlobalContextProvider({ children }) {
    // Fetch admin info (session + adminID)
    const {
        data: adminInfo,
        isLoading: isLoadingAdmin,
        error: errorAdmin,
    } = useAdminInfo();

    // Fetch student number from session
    const {
        data: studentNumber,
        isLoading: isLoadingStudent,
        error: errorStudent,
    } = useStudentNumber();

    // Fetch static charges (rent, surcharge)
    const {
        data: staticCharges,
        isLoading: isLoadingCharges,
        error: errorCharges,
    } = useStaticCharges();

    // Fetch appliances list
    const {
        data: appliances,
        isLoading: isLoadingAppliances,
        error: errorAppliances,
    } = useAppliances();

    // Combined loading and error states
    const isLoading = isLoadingAdmin || isLoadingStudent || isLoadingCharges || isLoadingAppliances;
    const hasError = !!(errorAdmin || errorStudent || errorCharges || errorAppliances);

    const contextValue = {
        // Admin data
        session: adminInfo?.session || null,
        adminID: adminInfo?.adminID || null,

        // Student data
        studentNumber: studentNumber || null,

        // Shared data
        staticCharges: staticCharges || { rent: 0, surcharge: 0 },
        appliances: appliances || [],

        // Loading states
        isLoading,
        isLoadingAdmin,
        isLoadingStudent,
        isLoadingCharges,
        isLoadingAppliances,

        // Error states — consumers can check these to show error UI
        hasError,
        errorAdmin: errorAdmin || null,
        errorStudent: errorStudent || null,
        errorCharges: errorCharges || null,
        errorAppliances: errorAppliances || null,
    };

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
export function useGlobalContext() {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext must be used within GlobalContextProvider');
    }

    return context;
}
