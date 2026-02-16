import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as offensesService from '../services/offensesService';

/**
 * Custom hooks for offenses using TanStack Query
 */

/**
 * Hook to fetch all offense types
 * @returns {Object} Query object with offense types
 */
export function useOffenseTypes() {
    return useQuery({
        queryKey: ['offenses', 'types'],
        queryFn: offensesService.fetchOffenseTypes,
    });
}

/**
 * Hook to fetch student's offenses
 * @param {string} studentNumber - Student number
 * @returns {Object} Query object with student offenses
 */
export function useStudentOffenses(studentNumber) {
    return useQuery({
        queryKey: ['offenses', 'student', studentNumber],
        queryFn: () => offensesService.fetchStudentOffenses(studentNumber),
        enabled: !!studentNumber,
    });
}

/**
 * Hook to search students for offenses
 * @param {string} searchTerm - Search term
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Query object with students
 */
export function useStudentsForOffenses(searchTerm, page, limit) {
    return useQuery({
        queryKey: ['students', 'forOffenses', searchTerm, page, limit],
        queryFn: () => offensesService.searchStudentsForOffenses(searchTerm, page, limit),
    });
}

/**
 * Hook to create an offense type
 * @returns {Object} Mutation object
 */
export function useCreateOffenseType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ offenseName, offenseCharge }) =>
            offensesService.createOffenseType(offenseName, offenseCharge),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offenses', 'types'] });
        },
    });
}

/**
 * Hook to create an offense record
 * @returns {Object} Mutation object
 */
export function useCreateOffense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentNumber, offenseID, adminID }) =>
            offensesService.createOffense(studentNumber, offenseID, adminID),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['offenses', 'student', variables.studentNumber] });
        },
    });
}

/**
 * Hook to update an offense record
 * @returns {Object} Mutation object
 */
export function useUpdateOffense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ offenseRecordID, data }) =>
            offensesService.updateOffense(offenseRecordID, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offenses', 'student'] });
        },
    });
}

/**
 * Hook to delete an offense record
 * @returns {Object} Mutation object
 */
export function useDeleteOffense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (offenseRecordID) => offensesService.deleteOffense(offenseRecordID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['offenses', 'student'] });
        },
    });
}
