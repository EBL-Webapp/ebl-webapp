import { useNavigate, useLocation } from 'react-router-dom';
import supabase from './supabase_client';

export function useRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  async function redirect(page, id = null) {
    // ─── 1. Get session (if id not passed) ─────────────
    let sessionData;
    if (id === null) {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user?.id) {
        if (page !== "visitor") {
          await handleUnauthorized();
        }
        return;
      }
      sessionData = data;
      id = data.session.user.id;
    }

    // ─── 2. Detect if Google OAuth (email provider) ───
    const userProvider = sessionData?.session?.user?.app_metadata?.provider;
    const isGoogleUser = userProvider === "google";

    // ─── 3. Query all roles ─────────────────────────────
    const [ { data: studentRows }, { data: adminRows }, { data: transientRows } ] =
      await Promise.all([
        supabase.from("Students").select("userID, isAssessed").eq("userID", id),
        supabase.from("admin").select("userID").eq("userID", id),
        supabase.from("Transient").select("userID").eq("userID", id),
      ]);

    let actualRole = null;
    if (studentRows?.length > 0) {
      if (!studentRows[0].isAssessed) {
        navigate('/NoUpdate');
        return;
      }
      actualRole = "student";
    }
    else if (adminRows?.length > 0) actualRole = "admin";
    else if (transientRows?.length > 0) actualRole = "transient";
    else if (!isGoogleUser) actualRole = "visitor"; // fallback

    // ─── 4. Kick Google users with no role ──────────────
    if (!actualRole && isGoogleUser) {
      await handleUnauthorized();
      return;
    }

    // ─── 5. Allowed routes per role ─────────────────────
    const roots = {
      student: "/student",
      admin: "/admin",
      transient: "/transient",
      visitor: "/visitor",
    };

    const rootPath = roots[actualRole];

    if (actualRole !== page) {
      navigate(rootPath);
      return;
    }

    if (!location.pathname.startsWith(rootPath)) {
      navigate(rootPath);
      return;
    }
  }

  async function handleUnauthorized() {
    alert("Unauthorized person…");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
    navigate('/');
  }

  return redirect;
}
