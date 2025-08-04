import React, { useState, useEffect } from "react";
import supabase from "../../../supabase_client";
import { fetchColumnValue } from "../../../fetchColumnValue";
import { getSession } from "../../../getSession";

const Offenses = () => {
  const [offensesList, setOffensesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffenses();
  }, []);

  const loadOffenses = async () => {
    try {
      console.log("Loading offenses...");
      const session_temp = await getSession();
      
      if (!session_temp || !session_temp.session || !session_temp.session.user) {
        console.log("No valid session found");
        setLoading(false);
        return;
      }
      
      const user_id = session_temp.session.user.id;
      
      const studentNum = await fetchColumnValue("Students", "userID", user_id, "studentNumber");
      
      console.log("Student number:", studentNum);
      
      if (!studentNum) {
        console.log("No student number found");
        setLoading(false);
        return;
      }
      
      // Let's grab all of the offenses
      const { data: offenses_return, error: error_offenses_return } = await supabase
        .from("Offenses_Occured")
        .select("*, List_of_Offenses (offenseName)")
        .eq("studentNumber", studentNum);
      
      if (error_offenses_return) {
        console.log("There was an error in fetching the offenses:", error_offenses_return.message);
        setLoading(false);
        return;
      }
      
      console.log("Offenses fetched:", offenses_return);
      setOffensesList(offenses_return || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading offenses:", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Recorded Offenses</h2>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-xs sm:text-sm border-b border-gray-300">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Reported By</th>
              <th className="px-4 py-2 text-left">Type of Offense</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500 text-xs sm:text-sm">
                  Loading offenses...
                </td>
              </tr>
            ) : offensesList.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500 text-xs sm:text-sm">
                  No offenses reported.
                </td>
              </tr>
            ) : (
              offensesList.map((offense, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{offense.timestamp}</td>
                  <td className="px-4 py-2">{offense.adminName || "Unknown"}</td>
                  <td className="px-4 py-2">{offense.List_of_Offenses?.offenseName || "Unknown"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Offenses;