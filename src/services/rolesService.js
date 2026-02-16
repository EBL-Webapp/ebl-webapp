import supabase from '../supabase_client';

/**
 * Roles Service
 * Handles admin and role management API calls
 */

/**
 * Fetch all admins (paginated)
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Promise<{data: Array, count: number}>}
 */
export async function fetchAdmins(page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    const { data, error, count } = await supabase
        .from('admin')
        .select('*', { count: 'exact' })
        .range(startIndex, endIndex);

    if (error) {
        throw error;
    }

    return { data, count };
}

/**
 * Delete an admin
 * @param {string} adminID - Admin ID to delete
 * @returns {Promise<void>}
 */
export async function deleteAdmin(adminID) {
    const { error } = await supabase
        .from('admin')
        .delete()
        .eq('adminID', adminID);

    if (error) {
        throw error;
    }
}

/**
 * Fetch pending registrations (students and transients)
 * @returns {Promise<{students: Array, transients: Array}>}
 */
export async function fetchPendingRegistrations() {
    // Fetch pending students
    const { data: students, error: studentsError } = await supabase
        .from('Students')
        .select('*')
        .is('isApproved', null);

    if (studentsError) {
        throw studentsError;
    }

    // Fetch pending transients
    const { data: transients, error: transientsError } = await supabase
        .from('Transient')
        .select('*')
        .is('isApproved', null);

    if (transientsError) {
        throw transientsError;
    }

    return { students, transients };
}

/**
 * Approve a student or transient registration
 * @param {string} id - Student number or transient ID
 * @param {string} type - 'student' or 'transient'
 * @returns {Promise<void>}
 */
export async function approveRegistration(id, type) {
    const table = type === 'student' ? 'Students' : 'Transient';
    const idColumn = type === 'student' ? 'studentNumber' : 'transientID';

    const { error } = await supabase
        .from(table)
        .update({ isApproved: true })
        .eq(idColumn, id);

    if (error) {
        throw error;
    }
}

/**
 * Deny a student or transient registration
 * @param {string} id - Student number or transient ID
 * @param {string} type - 'student' or 'transient'
 * @returns {Promise<void>}
 */
export async function denyRegistration(id, type) {
    const table = type === 'student' ? 'Students' : 'Transient';
    const idColumn = type === 'student' ? 'studentNumber' : 'transientID';

    const { error } = await supabase
        .from(table)
        .delete()
        .eq(idColumn, id);

    if (error) {
        throw error;
    }
}
