// utils/fetchColumnValue.js
import supabase  from "./supabase_client"; // update path as needed

export async function fetchColumnValue(table, primaryKey, primaryKeyValue, column) {
  const { data, error } = await supabase
    .from(table)
    .select(column)
    .eq(primaryKey, primaryKeyValue)
    .limit(1);

  if (error) {
    console.error(`Error fetching ${column} from ${table}:`, error);
    return null;
  }

  return data && data.length > 0 ? data[0][column] : null;
}
