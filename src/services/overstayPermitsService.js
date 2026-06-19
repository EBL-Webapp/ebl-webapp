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
        .order('sentOn', { ascending: false });

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
        .order('sentOn', { ascending: false });

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
            approvedby_adminID: adminID,
            approvedOn: new Date().toISOString(),
        })
        .eq('overnightExcuseID', requestId);

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
            approvedby_adminID: adminID,
            approvedOn: new Date().toISOString(),
        })
        .eq('overnightExcuseID', requestId);

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
            validatedby_adminID: adminID,
            validatedOn: new Date().toISOString(),
        })
        .eq('overnightExcuseID', requestId);

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
        .order('sentOn', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Invalidate a permit and record a Locator Slip offense (offenseID=2)
 * @param {number} requestId - Overnight excuse ID
 * @param {string} studentNumber - Student number
 * @param {string} adminID - Admin ID invalidating
 * @returns {Promise<void>}
 */
export async function invalidatePermit(requestId, studentNumber, adminID) {
    // 1. Update Overnight_Excuse row
    const { error: excuseError } = await supabase
        .from('Overnight_Excuse')
        .update({
            isValidated: false,
            validatedby_adminID: adminID,
            validatedOn: new Date().toISOString(),
        })
        .eq('overnightExcuseID', requestId);

    if (excuseError) {
        throw excuseError;
    }

    // 2. Fetch admin name from admin table using adminID
    let adminName = 'Unknown Admin';
    if (adminID) {
        try {
            const { data: adminData } = await supabase
                .from('admin')
                .select('adminName')
                .eq('adminID', adminID)
                .single();
            
            if (adminData?.adminName) {
                adminName = adminData.adminName;
            }
        } catch (err) {
            console.warn('Could not fetch admin name for adminID:', adminID, err);
        }
    }

    // 3. Insert into Offenses_Occured (offenseID = 2)
    const { error: offenseError } = await supabase
        .from('Offenses_Occured')
        .insert([{
            studentNumber,
            offenseID: 2,
            adminName,
        }]);

    if (offenseError) {
        console.error('Error inserting offense for invalidated permit:', offenseError);
        throw offenseError;
    }
}

