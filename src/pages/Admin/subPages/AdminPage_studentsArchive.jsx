import { useEffect, useState } from "react";
import { Download, Upload, FileDown, Trash2, RotateCcw, AlertCircle, FileText } from "lucide-react";
import supabase from "../../../supabase_client";

export default function StudentsArchive() {
  const [studentList, setStudentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Temporary storage for imported data (in browser memory only)
  const [importedStudentsData, setImportedStudentsData] = useState(null);
  const [importedStudents, setImportedStudents] = useState([]);
  const [importSearchTerm, setImportSearchTerm] = useState("");

  // All tables that need to be included in export/import
  const relatedTables = [
    'Acknowledgemet_of_Accountability_Form',
    'Application_for_Dorm_Accomodation', 
    'Designated_Guardians',
    'Information_and_Instruction_Sheet',
    'Offenses_Occured',
    'Overnight_Excuse',
    'appliance_per_student',
    'studentCharge',
    'studentPayment',
    'guardianInformation',
    'signatureTable'
  ];
  
  // Filter current archived students
  const filteredStudents = studentList.filter(student => {
    const fullName = student.safe_users?.full_name?.toLowerCase() || "";
    const studentNumber = student.studentNumber?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || studentNumber.includes(searchLower);
  });

  // Filter imported students
  const filteredImportedStudents = importedStudents.filter(student => {
    const fullName = student.studentName?.toLowerCase() || "";
    const studentNumber = student.studentNumber?.toLowerCase() || "";
    const searchLower = importSearchTerm.toLowerCase();
    
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

  // Export all archived students and their related data
  const handleExportAllArchived = async () => {
    setIsExporting(true);
    try {
      // Get all archived students
      const { data: students, error: studentsError } = await supabase
        .from("Students")
        .select("*")
        .eq("isArchived", true);

      if (studentsError) {
        alert(`Error fetching students: ${studentsError.message}`);
        return;
      }

      if (!students || students.length === 0) {
        alert("No archived students found to export");
        return;
      }

      const studentNumbers = students.map(s => s.studentNumber);
      const exportData = {
        students: students,
        relatedData: {},
        exportDate: new Date().toISOString(),
        totalStudents: students.length,
        version: "1.0"
      };

      // Fetch related data for each table
      for (const table of relatedTables) {
        try {
          const { data: tableData, error: tableError } = await supabase
            .from(table)
            .select("*")
            .in("studentNumber", studentNumbers);

          if (tableError) {
            console.warn(`Warning: Could not fetch data from ${table}:`, tableError.message);
            exportData.relatedData[table] = [];
          } else {
            exportData.relatedData[table] = tableData || [];
          }
        } catch (err) {
          console.warn(`Warning: Error fetching ${table}:`, err);
          exportData.relatedData[table] = [];
        }
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `archived_students_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Successfully exported ${students.length} archived students and their related data!`);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export student data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file drop/upload to temporary storage
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please upload a valid JSON file');
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate file structure
      if (!data.students || !data.relatedData || !data.version) {
        alert('Invalid file format. Please upload a valid student backup file.');
        return;
      }

      // Store in browser memory (not in Supabase)
      setImportedStudentsData(data);
      setImportedStudents(data.students);
      
      alert(`Successfully loaded ${data.students.length} students into temporary storage.\n\nThese students are temporarily stored in your browser and will NOT be added to the database until you specifically click "Unarchive" for each student.`);
    } catch (err) {
      console.error("Import error:", err);
      alert('Failed to read file. Please ensure it is a valid JSON backup file.');
    } finally {
      setIsImporting(false);
    }
  };

  // Unarchive a student from imported data (restore to Supabase)
  const handleUnarchiveImported = async (studentNumber) => {
    if (!importedStudentsData) return;

    const confirmRestore = window.confirm(
      `Are you sure you want to unarchive and restore this student to the active database?\n\nThis will permanently add the student and all their related records back to the system.`
    );
    
    if (!confirmRestore) return;

    try {
      // Find the student in imported data
      const student = importedStudentsData.students.find(s => s.studentNumber === studentNumber);
      if (!student) {
        alert('Student not found in imported data');
        return;
      }

      // Set student as not archived before inserting
      const studentToInsert = { ...student, isArchived: false };
      delete studentToInsert.safe_users; // Remove joined data

      // Insert student record
      const { error: studentError } = await supabase
        .from('Students')
        .insert([studentToInsert]);

      if (studentError) {
        alert(`Failed to restore student: ${studentError.message}`);
        return;
      }

      // Insert related data for each table
      for (const table of relatedTables) {
        const tableData = importedStudentsData.relatedData[table] || [];
        const studentTableData = tableData.filter(record => record.studentNumber === studentNumber);
        
        if (studentTableData.length > 0) {
          const { error: tableError } = await supabase
            .from(table)
            .insert(studentTableData);

          if (tableError) {
            console.warn(`Warning: Could not restore data to ${table}:`, tableError.message);
          }
        }
      }

      // Remove from imported students list
      setImportedStudents(prev => prev.filter(s => s.studentNumber !== studentNumber));
      
      // Refresh the main student list to show the unarchived student is no longer in archive
      await getStudents();

      alert('Student successfully unarchived and restored to the active database!');
    } catch (err) {
      console.error('Restore error:', err);
      alert('Failed to restore student. Please try again.');
    }
  };

  // Remove student from temporary imported list
  const handleRemoveImported = (studentNumber) => {
    const confirmRemove = window.confirm(
      'Remove this student from the temporary list?\n\nThis will only remove them from your browser storage, not from the database.'
    );
    
    if (confirmRemove) {
      setImportedStudents(prev => prev.filter(s => s.studentNumber !== studentNumber));
    }
  };

  // Clear all imported data
  const handleClearImported = () => {
    const confirmClear = window.confirm(
      'Clear all temporarily imported students?\n\nThis will remove all imported data from your browser storage.'
    );
    
    if (confirmClear) {
      setImportedStudentsData(null);
      setImportedStudents([]);
      setImportSearchTerm("");
    }
  };

  const handleDelete = async (studentNumber) => {
    const reallyDelete = window.confirm(
      "Are you sure you want to delete this student and ALL related records?\nThis cannot be undone."
    );
    if (!reallyDelete) return;

    const dependentTables = [
      'Acknowledgemet_of_Accountability_Form',
      'Application_for_Dorm_Accomodation',
      'Designated_Guardians',
      'Information_and_Instruction_Sheet',
      'Offenses_Occured',
      'Overnight_Excuse',
      'appliance_per_student',
      'studentCharge',
      'studentPayment',
      'guardianInformation'
    ];

    try {
      for (const table of dependentTables) {
        const { error: depError } = await supabase
          .from(table)
          .delete()
          .eq('studentNumber', studentNumber);

        if (depError) {
          console.error(`Error deleting from ${table}:`, depError.message);
          alert(`Failed to delete related records in ${table}: ${depError.message}`);
          return;
        }
      }

      const { error: studentError } = await supabase
        .from('Students')
        .delete()
        .eq('studentNumber', studentNumber);

      if (studentError) {
        console.error('Error deleting student:', studentError.message);
        alert(`Failed to delete student: ${studentError.message}`);
        return;
      }

      setStudentList(prev =>
        prev.filter(s => s.studentNumber !== studentNumber)
      );

    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred while deleting student');
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
      
      setStudentList(prevList => 
        prevList.filter(student => student.studentNumber !== studentNumber)
      );
    } catch (err) {
      console.error("Error in update operation:", err);
      alert("Failed to unarchive student");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="p-4 md:p-8 zain-regular">
      {/* Export/Import Controls */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Backup & Restore</h3>
            <p className="text-sm text-gray-600">Export archived students or import previously exported data</p>
          </div>
          <button
            onClick={handleExportAllArchived}
            disabled={isExporting || studentList.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            {isExporting ? "Exporting..." : "Export All Archived"}
          </button>
        </div>
      </div>

      {/* File Upload Bin */}
      <div className="mb-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          } ${isImporting ? 'opacity-50' : ''}`}
        >
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Import Student Backup</h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your student backup file here, or click to browse
          </p>
          <p className="text-xs text-orange-600 mb-4">
            ⚠️ Imported students will be stored temporarily in your browser until you specifically unarchive them
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isImporting}
          />
          <label
            htmlFor="file-upload"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            {isImporting ? "Processing..." : "Browse Files"}
          </label>
        </div>
      </div>

      {/* Imported Students Section */}
      {importedStudents.length > 0 && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 ">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
                <FileText size={20} />
                Temporarily Imported Students ({importedStudents.length})
              </h3>
              <p className="text-sm text-yellow-700">
                These students are stored in your browser memory and will not be added to the database until unarchived
              </p>
            </div>
            <button
              onClick={handleClearImported}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Search for imported students */}
          <div className="mb-4">
            <input
              value={importSearchTerm}
              onChange={(e) => setImportSearchTerm(e.target.value)}
              type="text"
              placeholder="Search imported students..."
              className="border border-yellow-300 rounded-lg px-4 py-2 w-full max-w-md text-black bg-white"
            />
          </div>

          {/* Imported students table */}
          <div className="overflow-x-auto border border-yellow-300 rounded-lg">
            <table className="min-w-full bg-white rounded-lg overflow-hidden text-sm text-black">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="text-left px-4 py-3 text-yellow-800">Student Name</th>
                  <th className="text-left px-4 py-3 text-yellow-800">Student Number</th>
                  <th className="text-left px-4 py-3 text-yellow-800">Status</th>
                  <th className="text-center px-4 py-3 text-yellow-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredImportedStudents.map((student) => (
                  <tr key={student.studentNumber} className="border-t border-yellow-200">
                    <td className="px-4 py-3">{student.studentName || "No name"}</td>
                    <td className="px-4 py-3">{student.studentNumber || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Temporary
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button 
                          onClick={() => handleUnarchiveImported(student.studentNumber)} 
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Unarchive to Database
                        </button>
                        <button 
                          onClick={() => handleRemoveImported(student.studentNumber)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Current Archived Students Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Currently Archived Students</h3>
        
        {/* Search Section */}
        <div className="grid grid-cols-1 gap-y-4 gap-x-12 mb-6">
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            Error loading students: {error}
          </div>
        )}
        
        {/* Students Table */}
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
    </div>
  );
}