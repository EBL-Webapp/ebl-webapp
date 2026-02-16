import React, { createContext, useContext } from 'react';
import { useAdminInfo } from '../hooks/useAuth';
import { useStaticCharges, useAppliances } from '../hooks/usePayments';
import { useStudentNumber } from '../hooks/useAuth';

/**
 * Global Context
 * Provides globally shared data across the application
 */

const GlobalContext = createContext(null);

/**
 * Global Context Provider
 * Fetches and provides shared data to the entire app
 */
export function GlobalContextProvider({ children }) {
    // Fetch admin info (session + adminID)
    const { data: adminInfo, isLoading: isLoadingAdmin } = useAdminInfo();

    // Fetch student number from session
    const { data: studentNumber, isLoading: isLoadingStudent } = useStudentNumber();

    // Fetch static charges (rent, surcharge)
    const { data: staticCharges, isLoading: isLoadingCharges } = useStaticCharges();

    // Fetch appliances list
    const { data: appliances, isLoading: isLoadingAppliances } = useAppliances();

    // Combined loading state
    const isLoading = isLoadingAdmin || isLoadingStudent || isLoadingCharges || isLoadingAppliances;

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
