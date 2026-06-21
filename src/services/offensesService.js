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
        .from('List_of_Offenses')
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
 * @param {string} offenseSeverity - Severity of the offense (Minor/Major)
 * @returns {Promise<Object>} Created offense
 */
export async function createOffenseType(offenseName, offenseSeverity) {
    const { data, error } = await supabase
        .from('List_of_Offenses')
        .insert([{ offenseName, offenseSeverity }])
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
        .from('Offenses_Occured')
        .select('offenceInstance, studentNumber, offenseID, timestamp, adminName, List_of_Offenses(offenseName, offenseSeverity)')
        .eq('studentNumber', studentNumber)
        .order('timestamp', { ascending: false });

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
 * @returns {Promise<Object>} Created offense record
 */
export async function createOffense(studentNumber, offenseID, adminID) {
    if (!studentNumber || !offenseID) {
        throw new Error('Missing required fields: studentNumber and offenseID are required');
    }

    // Fetch admin name from admin table using userID (from auth system)
    let adminName = 'Unknown Admin';
    if (adminID) {
        try {
            const { data: adminData } = await supabase
                .from('admin')
                .select('adminName')
                .eq('userID', adminID)
                .single();
            
            if (adminData?.adminName) {
                adminName = adminData.adminName;
            }
        } catch (err) {
            console.warn('Could not fetch admin name for userID:', adminID, err);
            // Continue with 'Unknown Admin'
        }
    }

    const { data, error } = await supabase
        .from('Offenses_Occured')
        .insert([{
            studentNumber,
            offenseID,
            adminName,
        }])
        .select();

    if (error) {
        console.error('Supabase error inserting offense:', error);
        throw new Error(error.message || 'Failed to create offense record');
    }

    return data;
}

/**
 * Update an offense record
 * @param {string} offenseRecordID - Offense record ID (offenceInstance UUID)
 * @param {Object} data - Data to update
 * @returns {Promise<void>}
 */
export async function updateOffense(offenseRecordID, data) {
    const { error } = await supabase
        .from('Offenses_Occured')
        .update(data)
        .eq('offenceInstance', offenseRecordID);

    if (error) {
        throw error;
    }
}

/**
 * Delete an offense record
 * @param {string} offenseRecordID - Offense record ID (offenceInstance UUID)
 * @returns {Promise<void>}
 */
export async function deleteOffense(offenseRecordID) {
    const { error } = await supabase
        .from('Offenses_Occured')
        .delete()
        .eq('offenceInstance', offenseRecordID);

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
        .eq('isArchived', false)
        .eq('isAssessed', true);

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
