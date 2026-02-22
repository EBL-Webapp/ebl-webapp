import supabase from '../supabase_client';
import { fetchColumnValue } from '../fetchColumnValue';

/**
 * Authentication Service
 * Handles all authentication and session-related API calls
 */

/**
 * Get the current user session
 * @returns {Promise<Object>} Session data
 * @throws {Error} If session retrieval fails
 */
export async function getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Get admin ID from user ID
 * @param {string} userID - The auth user ID
 * @returns {Promise<string|null>} Admin ID or null
 */
export async function getAdminIDFromUserID(userID) {
    return await fetchColumnValue('admin', 'userID', userID, 'adminID');
}

/**
 * Get student number from user ID
 * @param {string} userID - The auth user ID
 * @returns {Promise<string|null>} Student number or null
 */
export async function getStudentNumberFromUserID(userID) {
    return await fetchColumnValue('Students', 'userID', userID, 'studentNumber');
}

/**
 * Sign in a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Sign in response
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}
