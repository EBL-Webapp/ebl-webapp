import supabase from '../supabase_client';

/**
 * Students Service
 * Handles all student-related API calls
 */

/**
 * Fetch paginated list of students
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @param {string} searchTerm - Optional search term for name/student number
 * @returns {Promise<{data: Array, count: number}>}
 */
export async function fetchStudentsPaginated(page, limit, searchTerm = '') {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    let query = supabase
        .from('Students')
        .select('studentNumber, studentName, surplus_deficit_payment, isArchived', {
            count: 'exact',
        })
        .eq('isArchived', false);

    if (searchTerm) {
        query = query.or(
            `studentName.ilike.%${searchTerm}%,studentNumber.ilike.%${searchTerm}%`
        );
    }

    const { data, error, count } = await query.range(startIndex, endIndex);

    if (error) {
        throw error;
    }

    return { data, count };
}

/**
 * Fetch a single student by student number
 * @param {string} studentNumber - Student number
 * @returns {Promise<Object>}
 */
export async function fetchStudentByNumber(studentNumber) {
    const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch student by user ID
 * @param {string} userID - Auth user ID
 * @returns {Promise<Object>}
 */
export async function fetchStudentByUserID(userID) {
    const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('userID', userID)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Archive a student
 * @param {string} studentNumber - Student number to archive
 * @returns {Promise<void>}
 */
export async function archiveStudent(studentNumber) {
    const { error } = await supabase
        .from('Students')
        .update({ isArchived: true })
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }
}

/**
 * Unarchive a student
 * @param {string} studentNumber - Student number to unarchive
 * @returns {Promise<void>}
 */
export async function unarchiveStudent(studentNumber) {
    const { error } = await supabase
        .from('Students')
        .update({ isArchived: false })
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }
}

/**
 * Delete a student permanently
 * @param {string} studentNumber - Student number to delete
 * @returns {Promise<void>}
 */
export async function deleteStudent(studentNumber) {
    const { error } = await supabase
        .from('Students')
        .delete()
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }
}

/**
 * Fetch all archived students
 * @returns {Promise<Array>}
 */
export async function fetchArchivedStudents() {
    const { data, error } = await supabase
        .from('Students')
        .select('*')
        .eq('isArchived', true);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch student application info
 * @param {string} studentNumber - Student number
 * @returns {Promise<Object>}
 */
export async function fetchStudentInfo(studentNumber) {
    const { data, error } = await supabase
        .from('Application_for_Dorm_Accomodation')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

    if (error) {
        throw error;
    }

    return data;
}
