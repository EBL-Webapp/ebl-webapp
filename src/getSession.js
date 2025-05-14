// utils/fetchColumnValue.js
import supabase  from "./supabase_client"; // update path as needed

export async function getSession() {
  const { data, error } = await supabase
    .auth
    .getSession();

  if (error) {
    console.error("Error in getting the session", error);
    return null;
  }

  return data
}
