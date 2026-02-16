import supabase from '../supabase_client';

/**
 * Offenses Service
 * Handles all offense-related API calls
 */

/**
 * Fetch all offense types
 * @returns {Promise<Array>}
 */
export async function fetchOffenseTypes() {
    const { data, error } = await supabase
        .from('list_of_offenses')
        .select('*')
        .order('offenseName', { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Create a new offense type
 * @param {string} offenseName - Name of the offense
 * @param {number} offenseCharge - Charge amount for the offense
 * @returns {Promise<Object>} Created offense
 */
export async function createOffenseType(offenseName, offenseCharge) {
    const { data, error } = await supabase
        .from('list_of_offenses')
        .insert([{ offenseName, offenseCharge }])
        .select();

    if (error) {
        throw error;
    }

    return data[0];
}

/**
 * Fetch offenses for a specific student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>}
 */
export async function fetchStudentOffenses(studentNumber) {
    const { data, error } = await supabase
        .from('student_offenses')
        .select('*, list_of_offenses(offenseName, offenseCharge)')
        .eq('studentNumber', studentNumber)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Create a new offense record for a student
 * @param {string} studentNumber - Student number
 * @param {number} offenseID - Offense type ID
 * @param {string} adminID - Admin ID recording the offense
 * @returns {Promise<void>}
 */
export async function createOffense(studentNumber, offenseID, adminID) {
    const { error } = await supabase
        .from('student_offenses')
        .insert([{
            studentNumber,
            offenseID,
            recordedBy: adminID,
        }]);

    if (error) {
        throw error;
    }
}

/**
 * Update an offense record
 * @param {number} offenseRecordID - Offense record ID
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export async function updateOffense(offenseRecordID, data) {
    const { error } = await supabase
        .from('student_offenses')
        .update(data)
        .eq('id', offenseRecordID);

    if (error) {
        throw error;
    }
}

/**
 * Delete an offense record
 * @param {number} offenseRecordID - Offense record ID
 * @returns {Promise<void>}
 */
export async function deleteOffense(offenseRecordID) {
    const { error } = await supabase
        .from('student_offenses')
        .delete()
        .eq('id', offenseRecordID);

    if (error) {
        throw error;
    }
}

/**
 * Search students for offense management (paginated)
 * @param {string} searchTerm - Search term for name/student number
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Promise<{data: Array, count: number}>}
 */
export async function searchStudentsForOffenses(searchTerm, page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    let query = supabase
        .from('Students')
        .select('studentNumber, studentName, isArchived', { count: 'exact' })
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
