import supabase from '../supabase_client';
import { fetchColumnValue } from '../fetchColumnValue';

/**
 * Roles Service
 * Handles admin and role management API calls
 */

/**
 * Fetch role requests (active requests where request_status_boolean is false)
 * Uses 'all_requests_summary' view
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Promise<{data: Array, count: number}>}
 */
export async function fetchRoleRequests(page, limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    const { data, error, count } = await supabase
        .from("all_requests_summary")
        .select("*", { count: "exact" })
        .eq("request_status_boolean", false)
        .range(startIndex, endIndex);

    if (error) {
        throw error;
    }

    return { data, count };
}

/**
 * Fetch all admins
 * @returns {Promise<Array>}
 */
export async function fetchAdmins() {
    const { data, error } = await supabase
        .from('admin')
        .select('adminName, email, adminID, userID, isAccepted')
        .eq('isAccepted', true);

    if (error) {
        throw error;
    }

    return data;
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
 * Approve a registration request
 * @param {string} id - The original_entity_id (userID for student/admin, transientID for transient)
 * @param {string} type - 'student', 'transient', or 'admin'
 * @returns {Promise<void>}
 */
export async function approveRegistration(id, type) {
    if (type === 'transient') {
        const { error } = await supabase
            .from('Transient')
            .update({ isAccepted: true })
            .eq("userID", id);
        if (error) {
            console.error("Supabase UPDATE error (Transient):", error);
            throw error;
        }

    } else if (type === 'student') {
        // Need to fetch studentNumber first because the ID passed is likely userID (based on original code)
        // Original code: const studentNumber = await fetchColumnValue("Students", "userID", id, "studentNumber");
        const studentNumber = await fetchColumnValue("Students", "userID", id, "studentNumber");

        if (!studentNumber) {
            throw new Error("Student number not found for the given userID");
        }

        const { error } = await supabase
            .from('Students')
            .update({ isAssessed: true }) // Original code uses isAssessed
            .eq("studentNumber", studentNumber);
        if (error) {
            console.error("Supabase UPDATE error (Students):", error);
            throw error;
        }

    } else if (type === 'admin') {
        const { error } = await supabase
            .from("admin")
            .update({ isAccepted: true })
            .eq("userID", id);
        if (error) {
            console.error("Supabase UPDATE error (admin):", error);
            throw error;
        }

    } else {
        throw new Error(`Unknown type: ${type}`);
    }
}

/**
 * Deny (Delete) a registration request
 * @param {string} id - The original_entity_id
 * @param {string} type - 'student', 'transient', or 'admin' 
 * @returns {Promise<void>}
 */
export async function denyRegistration(id, type) {
    if (type === 'transient') {
        const { error } = await supabase
            .from('Transient')
            .delete()
            .eq("userID", id);
        if (error) {
            console.error("Supabase DELETE error (Transient):", error);
            throw error;
        }

    } else if (type === 'student') {
        const studentNumber = await fetchColumnValue("Students", "userID", id, "studentNumber");

        if (!studentNumber) {
            throw new Error("Student number not found for the given userID");
        }

        const { error } = await supabase
            .from('Students')
            .delete()
            .eq("studentNumber", studentNumber);
        if (error) {
            console.error("Supabase DELETE error (Students):", error);
            throw error;
        }

    } else if (type === 'admin') {
        const { error } = await supabase
            .from('admin')
            .delete()
            .eq("userID", id);
        if (error) {
            console.error("Supabase DELETE error (admin):", error);
            throw error;
        }

    } else {
        throw new Error(`Unknown type: ${type}`);
    }
}
