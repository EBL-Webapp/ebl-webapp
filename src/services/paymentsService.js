import supabase from '../supabase_client';

/**
 * Payments Service
 * Handles all payment-related API calls
 */

/**
 * Fetch students with payment information (paginated)
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Number of items per page
 * @param {string} searchTerm - Optional search term
 * @returns {Promise<{data: Array, count: number}>}
 */
export async function fetchStudentsWithPayments(page, limit, searchTerm = '') {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    let query = supabase
        .from('Students')
        .select('studentNumber, studentName, surplus_deficit_payment, isArchived, isAssessed', {
            count: 'exact',
        })
        .eq('isArchived', false)
        .eq('isAssessed', true);

    if (searchTerm) {
        // Change the % wildcards to * wildcards for PostgREST compliance
        query = query.or(
            `studentName.ilike.*${searchTerm}*,studentNumber.ilike.*${searchTerm}*`
        );
    }

    const { data, error, count } = await query.range(startIndex, endIndex);

    if (error) {
        throw error;
    }

    // Safely fallback to an empty array if data is null to avoid crash loops
    const sorted = (data || []).sort(
        (a, b) => (a.surplus_deficit_payment || 0) - (b.surplus_deficit_payment || 0)
    );

    return { data: sorted, count: count || 0 };
}

/**
 * Create a payment record
 * @param {string} studentNumber - Student number
 * @param {string} adminID - Admin ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} referenceID - Payment reference ID
 * @returns {Promise<void>}
 */
export async function createPayment(studentNumber, adminID, paymentAmount, referenceID) {
    const { error } = await supabase
        .from('studentPayment')
        .insert({
            studentNumber,
            adminID,
            paymentAmount,
            referenceID,
        });

    if (error) {
        throw error;
    }
}

/**
 * Update student balance
 * @param {string} studentNumber - Student number
 * @param {number} newBalance - New balance amount
 * @returns {Promise<void>}
 */
export async function updateStudentBalance(studentNumber, newBalance) {
    const { error } = await supabase
        .from('Students')
        .update({
            surplus_deficit_payment: newBalance,
        })
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }
}

/**
 * Fetch static charges (rent, surcharge)
 * @returns {Promise<Object>} Object with chargeName as keys
 */
export async function fetchStaticCharges() {
    const { data, error } = await supabase
        .from('staticCharge')
        .select('*');

    if (error) {
        throw error;
    }

    // Convert array to object: { rent: value, surcharge: value }
    const chargesObject = Object.fromEntries(
        data.map((item) => [item.chargeName, item.charge])
    );

    return chargesObject;
}

/**
 * Update a static charge
 * @param {string} chargeName - Name of the charge (rent, surcharge)
 * @param {number} chargeValue - New charge value
 * @returns {Promise<void>}
 */
export async function updateStaticCharge(chargeName, chargeValue) {
    const { error } = await supabase
        .from('staticCharge')
        .update({ charge: chargeValue })
        .eq('chargeName', chargeName);

    if (error) {
        throw error;
    }
}

/**
 * Fetch all appliances
 * @returns {Promise<Array>}
 */
export async function fetchAppliances() {
    const { data, error } = await supabase
        .from('list_of_appliances')
        .select('*');

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch appliances for a specific student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>}
 */
export async function fetchStudentAppliances(studentNumber) {
    const { data, error } = await supabase
        .from("appliance_per_student")
        .select("*, list_of_appliances (applianceName, cost)")
        .eq("studentNumber", studentNumber)
        .neq("quantity", 0);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Create a new appliance
 * @param {string} applianceName - Appliance name
 * @param {number} cost - Appliance cost
 * @returns {Promise<Object>} Created appliance with ID
 */
export async function createAppliance(applianceName, cost) {
    const { data, error } = await supabase
        .from('list_of_appliances')
        .insert([{ applianceName, cost }])
        .select('applianceID');

    if (error) {
        throw error;
    }

    return { applianceID: data[0].applianceID, applianceName, cost };
}

/**
 * Delete an appliance
 * @param {number} applianceID - Appliance ID to delete
 * @returns {Promise<void>}
 */
export async function deleteAppliance(applianceID) {
    const { error } = await supabase
        .from('list_of_appliances')
        .delete()
        .eq('applianceID', applianceID);

    if (error) {
        throw error;
    }
}

/**
 * Trigger monthly charges via Edge Function
 * @param {string} adminID - Admin ID triggering the charges
 * @returns {Promise<Object>} Response from Edge Function
 */
export async function triggerMonthlyCharges(adminID) {
    const { data, error } = await supabase.functions.invoke('monthly-charges', {
        body: { adminID },
    });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch payment history for a specific student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>} Array of payment records sorted by timestamp (newest first)
 */
export async function fetchStudentPaymentHistory(studentNumber) {
    const { data, error } = await supabase
        .from('studentPayment')
        .select('paymentID, timestamp, paymentAmount, referenceID')
        .eq('studentNumber', studentNumber)
        .order('timestamp', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch charge history for a specific student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>} Array of charge records sorted by timestamp (newest first)
 */
export async function fetchStudentChargeHistory(studentNumber) {
    const { data, error } = await supabase
        .from('studentCharge')
        .select('chargeID, timestamp, amount, dueDate')
        .eq('studentNumber', studentNumber)
        .order('timestamp', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}
