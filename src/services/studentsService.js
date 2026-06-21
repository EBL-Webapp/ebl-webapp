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
        .select('studentNumber, studentName, surplus_deficit_payment, isArchived, isAssessed', {
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
 * Reject a student's application
 * Sets isRejected=true so the FSM routes them to /Rejected
 * @param {string} studentNumber - Student number to reject
 * @returns {Promise<void>}
 */
export async function rejectStudent(studentNumber) {
    const { error } = await supabase
        .from('Students')
        .update({ isRejected: true })
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }
}

/**
 * Upsert (insert-or-update) the Students row for a re-applying student.
 * Used by StudentSignIn.jsx so that a rejected student can resubmit
 * without hitting a duplicate-key error.
 *
 * @param {Object} studentData - { userID, studentNumber, studentName, email }
 * @returns {Promise<void>}
 */
export async function upsertStudentRow({ userID, studentNumber, studentName, email }) {
    const { error } = await supabase
        .from('Students')
        .upsert(
            {
                userID,
                studentNumber,
                studentName,
                email,
                isAssessed: false,
                isArchived: false,
                isRejected: false,
                surplus_deficit_payment: 0,
            },
            { onConflict: 'studentNumber' } // update the existing row if the PK already exists
        );

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

/**
 * Fetch guardian information for a student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>}
 */
export async function fetchGuardianInfo(studentNumber) {
    const { data, error } = await supabase
        .from('guardianInformation')
        .select('*')
        .eq('studentNumber', studentNumber);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Fetch the active acknowledgement form submission for a student
 * @param {string} studentNumber - Student number
 * @returns {Promise<Array>}
 */
export async function fetchAcknowledgementForm(studentNumber) {
    const { data, error } = await supabase
        .from('Acknowledgemet_of_Accountability_Form')
        .select('*')
        .eq('studentNumber', studentNumber)
        .eq('isArchived', false);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Submit a new acknowledgement form
 * @param {string} studentNumber - Student number
 * @param {Object} formData - Form data fields
 * @returns {Promise<void>}
 */
export async function submitAcknowledgementForm(studentNumber, formData) {
    const { error } = await supabase
        .from('Acknowledgemet_of_Accountability_Form')
        .insert([{
            studentNumber,
            roomNumber: formData.roomNumber,
            roomKey_propertyNumber: formData.roomKey,
            studyTable_propertyNumber: formData.studyTable,
            jalousies_propertyNumber: formData.jalousies,
            window_propertyNumber: formData.windowScreens,
            bedfoam_propertyNumber: formData.bedfoam,
            closet_propertyNumber: formData.closet,
            ClosetDoorHandle_propertyNumber: formData.closetDoorHandle,
            chair_propertyNumber: formData.chair,
            semester: formData.semester,
        }]);

    if (error) {
        throw error;
    }
}
