import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentsService from '../services/studentsService';

/**
 * Custom hooks for students using TanStack Query
 */

/**
 * Hook to fetch paginated students list
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} searchTerm - Search term
 * @returns {Object} Query object with students data
 */
export function useStudentsList(page, limit, searchTerm = '') {
    return useQuery({
        queryKey: ['students', 'list', page, limit, searchTerm],
        queryFn: () => studentsService.fetchStudentsPaginated(page, limit, searchTerm),
    });
}

/**
 * Hook to fetch a single student
 * @param {string} studentNumber - Student number
 * @returns {Object} Query object with student data
 */
export function useStudent(studentNumber) {
    return useQuery({
        queryKey: ['students', studentNumber],
        queryFn: () => studentsService.fetchStudentByNumber(studentNumber),
        enabled: !!studentNumber,
    });
}

/**
 * Hook to fetch student by user ID
 * @param {string} userID - User ID
 * @returns {Object} Query object with student data
 */
export function useStudentByUserID(userID) {
    return useQuery({
        queryKey: ['students', 'byUserID', userID],
        queryFn: () => studentsService.fetchStudentByUserID(userID),
        enabled: !!userID,
    });
}

/**
 * Hook to fetch archived students
 * @returns  {Object} Query object with archived students
 */
export function useArchivedStudents() {
    return useQuery({
        queryKey: ['students', 'archived'],
        queryFn: studentsService.fetchArchivedStudents,
    });
}

/**
 * Hook to fetch student application info
 * @param {string} studentNumber - Student number
 * @returns {Object} Query object with student info
 */
export function useStudentInfo(studentNumber) {
    return useQuery({
        queryKey: ['students', 'info', studentNumber],
        queryFn: () => studentsService.fetchStudentInfo(studentNumber),
        enabled: !!studentNumber,
    });
}

/**
 * Hook to archive a student
 * @returns {Object} Mutation object
 */
export function useArchiveStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentNumber) => studentsService.archiveStudent(studentNumber),
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['students', 'archived'] });
        },
    });
}

/**
 * Hook to unarchive a student
 * @returns {Object} Mutation object
 */
export function useUnarchiveStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentNumber) => studentsService.unarchiveStudent(studentNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['students', 'archived'] });
        },
    });
}

/**
 * Hook to delete a student
 * @returns {Object} Mutation object
 */
export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentNumber) => studentsService.deleteStudent(studentNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });
}
