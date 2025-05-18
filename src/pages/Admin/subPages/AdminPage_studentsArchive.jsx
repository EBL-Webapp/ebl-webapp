import { useEffect, useState } from "react";
import supabase from "../../../supabase_client";

export default function StudentsArchive() {
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter students after we have the data
  const filteredStudents = studentList.filter(student => {
    const fullName = student.safe_users?.full_name?.toLowerCase() || "";
    const studentNumber = student.studentNumber?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || studentNumber.includes(searchLower);
  });

  const getStudents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("Students")
        .select("*, safe_users (email, full_name)")
        .eq("isArchived", true);
      
      if (error) {
        console.log("Error getting the students: ", error.message);
        setError(error.message);
        return;
      }

      console.log("Here is your data: ", data);
      setStudentList(data || []);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (studentNumber) => {
    try {
      const { error } = await supabase
        .from("Students")
        .delete()
        .eq("studentNumber", studentNumber);

      if (error) {
        console.log("Error in deleting: ", error.message);
        alert(`Failed to delete: ${error.message}`);
        return;
      }
      
      // Update local state instead of reloading the page
      setStudentList(prevList => 
        prevList.filter(student => student.studentNumber !== studentNumber)
      );
    } catch (err) {
      console.error("Error in delete operation:", err);
      alert("Failed to delete student");
    }
  };

  const handleUpdate = async (studentNumber) => {
    try {
      const { error } = await supabase
        .from("Students")
        .update({
          isArchived: false
        })
        .eq("studentNumber", studentNumber);

      if (error) {
        console.log("There was an error in updating: ", error.message);
        alert(`Failed to unarchive: ${error.message}`);
        return;
      }
      
      // Update local state instead of reloading the page
      setStudentList(prevList => 
        prevList.filter(student => student.studentNumber !== studentNumber)
      );
    } catch (err) {
      console.error("Error in update operation:", err);
      alert("Failed to unarchive student");
    }
  };

  useEffect(() => {
    // Get the students
    getStudents();
  }, []);

  return (
    <div className="p-4 md:p-8 zain-regular">
      {/* Search Section */}
      <div className="grid grid-cols-1 gap-y-4 gap-x-12 mb-6">
        {/* Search by Name or Student Number */}
        <div className="flex flex-row gap-2 flex-1">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search by Name or Student Number"
            className="border border-gray-300 rounded-2xl px-4 py-2 w-full text-black"
          />
        </div>
      </div>

      {/* Table Section */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          Error loading students: {error}
        </div>
      )}
      
      <div className="overflow-x-auto border border-gray-300 rounded-2xl">
        <table className="min-w-full border border-gray-300 rounded-2xl overflow-hidden text-base sm:text-lg">
          <thead className="bg-[#114516] text-white">
            <tr>
              <th className="text-left px-4 py-3">Student Name</th>
              <th className="text-left px-4 py-3">Student Number</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-3">Loading students...</td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.studentNumber} className="border-t border-gray-200 text-sm sm:text-base">
                  <td className="px-4 py-3">{student.safe_users?.full_name || "No name"}</td>
                  <td className="px-4 py-3">{student.studentNumber || "N/A"}</td>
                  <td className="px-4 py-3">{student.safe_users?.email || "No email"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <button 
                        onClick={() => handleUpdate(student.studentNumber)} 
                        className="bg-[#114516]/90 text-white w-24 px-3 py-1 rounded-2xl hover:bg-green-800"
                      >
                        Unarchive
                      </button>
                      <button 
                        onClick={() => handleDelete(student.studentNumber)} 
                        className="bg-[#4E0303]/90 text-white w-24 px-3 py-1 rounded-2xl hover:bg-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-3">
                  {searchTerm ? "No matching students found" : "No archived students"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}