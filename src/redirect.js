import { useNavigate, useLocation } from 'react-router-dom';
import supabase from './supabase_client';

export function useRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  async function redirect(page, id = null) {
    // ─── 1. Resolve userID ────────────────────────────────
    if (id === null) {
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();
      if (sessionErr || !sessionData.session?.user?.id) {
        // no valid session → stranger
        await handleUnauthorized();
        return;
      }
      id = sessionData.session.user.id;
    }

    // ─── 2. Figure out actualRole ─────────────────────────
    const [ { data: studentRows }, { data: adminRows }, { data: transientRows } ] =
      await Promise.all([
        supabase.from("Students").select("userID").eq("userID", id),
        supabase.from("admin").select("userID").eq("userID", id),
        supabase.from("Transient").select("userID").eq("userID", id),
      ]);

    let actualRole = null;
    if (studentRows?.length > 0)      actualRole = "student";
    else if (adminRows?.length > 0)   actualRole = "admin";
    else if (transientRows?.length > 0) actualRole = "transient";

    // ─── 3. No matching role? kick them out ────────────────
    if (!actualRole) {
      await handleUnauthorized();
      return;
    }

    // ─── 4. Role → canonical root ──────────────────────────
    const roots = {
      student: "/student/*",
      admin:   "/admin",
      transient: "/transient",
    };
    const rootPath = roots[actualRole];

    // a) If they’re in the wrong section entirely
    if (actualRole !== page) {
      navigate(rootPath);
      return;
    }

    // b) If they *are* the right role, but somehow landed outside of that prefix
    //    e.g. admin hitting "/adminX" or "/foo"
    if (!location.pathname.startsWith(rootPath.replace("/*", ""))) {
      navigate(rootPath);
      return;
    }

    // else: admin on /admin*, student on /student/*, etc. → do nothing
  }

  // ─── helper for total strangers ─────────────────────────
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
