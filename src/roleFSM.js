import supabase from './supabase_client';

/**
 * ─────────────────────────────────────────────
 * Role Finite State Machine (FSM)
 * ─────────────────────────────────────────────
 *
 * STATES:
 *   LOADING              – resolution in progress
 *   NO_SESSION           – user is not logged in at all
 *   NO_ROLE              – logged in but has no row in any role table
 *   STUDENT_PENDING      – submitted application, not yet assessed
 *   STUDENT_REJECTED     – application was explicitly rejected by admin
 *   STUDENT_ARCHIVED     – student was archived (left / dismissed)
 *   STUDENT_ACCEPTED     – assessed & active student
 *   ADMIN_PENDING        – requested admin role, not yet approved
 *   ADMIN_ACCEPTED       – accepted, active admin
 *
 * ROUTE MAP (consumed by redirect.js and LandingPage.jsx):
 *   NO_SESSION        → '/'
 *   NO_ROLE           → '/PickRole'
 *   STUDENT_PENDING   → '/NoUpdate'
 *   STUDENT_REJECTED  → '/Rejected'
 *   STUDENT_ARCHIVED  → '/NoUpdate'      (treated same as pending from user's POV)
 *   STUDENT_ACCEPTED  → '/student/*'
 *   ADMIN_PENDING     → '/NoUpdate'
 *   ADMIN_ACCEPTED    → '/admin'
 */

// ── Exported state constants ────────────────────────────────────────────────
export const FSM_STATE = Object.freeze({
  LOADING: 'LOADING',
  NO_SESSION: 'NO_SESSION',
  NO_ROLE: 'NO_ROLE',
  STUDENT_PENDING: 'STUDENT_PENDING',
  STUDENT_REJECTED: 'STUDENT_REJECTED',
  STUDENT_ARCHIVED: 'STUDENT_ARCHIVED',
  STUDENT_ACCEPTED: 'STUDENT_ACCEPTED',
  ADMIN_PENDING: 'ADMIN_PENDING',
  ADMIN_ACCEPTED: 'ADMIN_ACCEPTED',
});

// ── Route mapping ────────────────────────────────────────────────────────────
export const FSM_ROUTES = Object.freeze({
  [FSM_STATE.NO_SESSION]:       '/',
  [FSM_STATE.NO_ROLE]:          '/PickRole',
  [FSM_STATE.STUDENT_PENDING]:  '/NoUpdate',
  [FSM_STATE.STUDENT_REJECTED]: '/Rejected',
  [FSM_STATE.STUDENT_ARCHIVED]: '/NoUpdate',
  [FSM_STATE.STUDENT_ACCEPTED]: '/student',
  [FSM_STATE.ADMIN_PENDING]:    '/NoUpdate',
  [FSM_STATE.ADMIN_ACCEPTED]:   '/admin',
});

/**
 * Resolves the current user's FSM state by querying Supabase.
 *
 * @returns {Promise<{ state: string, userID: string|null, studentNumber: string|null, adminID: string|null }>}
 */
export async function resolveUserState() {
  // ── 1. Get session ──────────────────────────────────────────────────────
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return { state: FSM_STATE.NO_SESSION, userID: null, studentNumber: null, adminID: null };
  }

  const userID = session.user.id;

  // ── 2. Query all role tables in parallel ────────────────────────────────
  const [
    { data: studentRows, error: studentErr },
    { data: adminRows,   error: adminErr   },
  ] = await Promise.all([
    supabase
      .from('Students')
      .select('studentNumber, isAssessed, isArchived, isRejected')
      .eq('userID', userID)
      .limit(1),
    supabase
      .from('admin')
      .select('adminID, isAccepted')
      .eq('userID', userID)
      .limit(1),
  ]);

  if (studentErr) {
    console.error('[FSM] Error fetching student row:', studentErr.message);
  }
  if (adminErr) {
    console.error('[FSM] Error fetching admin row:', adminErr.message);
  }

  // ── 3. Evaluate student state (priority: student > admin) ───────────────
  if (studentRows && studentRows.length > 0) {
    const student = studentRows[0];

    // Rejected takes highest priority so they can't access anything
    if (student.isRejected === true) {
      return {
        state: FSM_STATE.STUDENT_REJECTED,
        userID,
        studentNumber: student.studentNumber,
        adminID: null,
      };
    }

    // Archived (dismissed/left)
    if (student.isArchived === true) {
      return {
        state: FSM_STATE.STUDENT_ARCHIVED,
        userID,
        studentNumber: student.studentNumber,
        adminID: null,
      };
    }

    // Accepted & active
    if (student.isAssessed === true) {
      return {
        state: FSM_STATE.STUDENT_ACCEPTED,
        userID,
        studentNumber: student.studentNumber,
        adminID: null,
      };
    }

    // Submitted but still waiting
    return {
      state: FSM_STATE.STUDENT_PENDING,
      userID,
      studentNumber: student.studentNumber,
      adminID: null,
    };
  }

  // ── 4. Evaluate admin state ─────────────────────────────────────────────
  if (adminRows && adminRows.length > 0) {
    const admin = adminRows[0];

    if (admin.isAccepted === true) {
      return {
        state: FSM_STATE.ADMIN_ACCEPTED,
        userID,
        studentNumber: null,
        adminID: admin.adminID,
      };
    }

    return {
      state: FSM_STATE.ADMIN_PENDING,
      userID,
      studentNumber: null,
      adminID: admin.adminID,
    };
  }

  // ── 5. User is authenticated but has no role yet ────────────────────────
  return { state: FSM_STATE.NO_ROLE, userID, studentNumber: null, adminID: null };
}
