import supabase from '../supabase_client';

/**
 * Overstay Permits Service
 * Handles all overnight/overstay permit-related API calls
 */

/**
 * Fetch permits pending approval
 * @returns {Promise<Array>}
 */
export async function fetchPendingApprovalPermits() {
    const { data, error } = await supabase
        .from('Overnight_Excuse')
        .select('*, Students(studentName)')
        .is('isApproved', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch permits pending validation
 * @returns {Promise<Array>}
 */
export async function fetchPendingValidationPermits() {
    const { data, error } = await supabase
        .from('Overnight_Excuse')
        .select('*, Students(studentName)')
        .eq('isApproved', true)
        .is('isValidated', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Approve a permit
 * @param {number} requestId - Overnight excuse ID
 * @param {string} adminID - Admin ID approving
 * @returns {Promise<void>}
 */
export async function approvePermit(requestId, adminID) {
    const { error } = await supabase
        .from('Overnight_Excuse')
        .update({
            isApproved: true,
            approvedBy: adminID,
            approvedAt: new Date().toISOString(),
        })
        .eq('id', requestId);

    if (error) {
        throw error;
    }
}

/**
 * Deny a permit
 * @param {number} requestId - Overnight excuse ID
 * @param {string} adminID - Admin ID denying
 * @returns {Promise<void>}
 */
export async function denyPermit(requestId, adminID) {
    const { error } = await supabase
        .from('Overnight_Excuse')
        .update({
            isApproved: false,
            approvedBy: adminID,
            approvedAt: new Date().toISOString(),
        })
        .eq('id', requestId);

    if (error) {
        throw error;
    }
}

/**
 * Validate a permit
 * @param {number} requestId - Overnight excuse ID
 * @param {string} adminID - Admin ID validating
 * @returns {Promise<void>}
 */
export async function validatePermit(requestId, adminID) {
    const { error } = await supabase
        .from('Overnight_Excuse')
        .update({
            isValidated: true,
            validatedBy: adminID,
            validatedAt: new Date().toISOString(),
        })
        .eq('id', requestId);

    if (error) {
        throw error;
    }
}

/**
 * Create a new overnight slip (student submission)
 * @param {string} studentNumber - Student number
 * @param {string} fromDate - Start date (ISO string)
 * @param {string} toDate - End date (ISO string)
 * @param {string} reason - Reason for overnight
 * @returns {Promise<void>}
 */
export async function createOvernightSlip(studentNumber, fromDate, toDate, reason) {
    const { error } = await supabase
        .from('Overnight_Excuse')
        .insert({
            studentNumber,
            fromDate,
            toDate,
            reason,
        });

    if (error) {
        throw error;
    }
}

/**
 * Fetch student's overnight slips
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>}
 */
export async function fetchStudentOvernightSlips(studentNumber) {
    const { data, error } = await supabase
        .from('Overnight_Excuse')
        .select('*')
        .eq('studentNumber', studentNumber)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}
