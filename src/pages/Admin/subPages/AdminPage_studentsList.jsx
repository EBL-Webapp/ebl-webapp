import React, { useEffect, useState, useRef } from 'react';
import supabase from '../../../supabase_client';
import StudentFullInfo from '../../../components/StudentFullInfo';
import PaginationControls from '../../../components/PaginationControls'; // Now 1-indexed friendly

// Custom Confirmation Modal Component (re-included for completeness and to replace alert/confirm)
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#4E0303] text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage_studentsList() {
  const [displayStudents, setDisplayStudents] = useState([]); // Students for the current page/search
  const [searchByNameValue, setSearchByNameValue] = useState('');
  const [searchByStudentNumberValue, setSearchByStudentNumberValue] = useState('');
  const [isModalOpen_studentInfo, setModalOpen_studentInfo] = useState(false);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination states (now 1-indexed)
  const [totalFilteredRows, setTotalFilteredRows] = useState(0); // Total rows matching current filters/search
  const [currentPage, setCurrentPage] = useState(1); // Initialize to 1 (first page)
  const itemsPerPage = 10; // Number of items per page

  // States to hold the *actual* search terms applied to the Supabase query
  const [activeSearchName, setActiveSearchName] = useState('');
  const [activeSearchStudentNumber, setActiveSearchStudentNumber] = useState('');

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState(null);


  // Main data fetching function
  // This function now takes the current pagination and search parameters
  const fetchStudentsList = async (pageNumber, pageSize, nameSearch, studentNumSearch) => {
    setLoading(true);
    let query = supabase
      .from("Students")
      .select("*", { count: 'exact' }) // Always get exact count for pagination
      .eq("isArchived", false);

    // Apply search filters if active
    if (nameSearch) {
      query = query.ilike("studentName", `%${nameSearch}%`); // Case-insensitive partial match
    }
    if (studentNumSearch) {
      query = query.ilike("studentNumber", `%${studentNumSearch}%`); // Case-insensitive partial match
    }

    // Calculate the range for Supabase (0-indexed and inclusive)
    // For 1-indexed pageNumber, 'from' is (pageNumber - 1) * pageSize
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.order("studentName").range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching students list: ", error.message);
      setDisplayStudents([]);
      setTotalFilteredRows(0); // Reset total count on error
    } else {
      setDisplayStudents(data || []);
      setTotalFilteredRows(count || 0); // Set the total count from the Supabase response
      console.log("Fetched students list (page, search, count): ", pageNumber, nameSearch, studentNumSearch, count);
    }
    setLoading(false);
  };

  // Effect to re-fetch data whenever pagination or search parameters change
  useEffect(() => {
    // Call fetchStudentsList with the current state values
    fetchStudentsList(currentPage, itemsPerPage, activeSearchName, activeSearchStudentNumber);
  }, [currentPage, activeSearchName, activeSearchStudentNumber, itemsPerPage]); // Dependencies

  // Handler for name search form submission
  const searchByName = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page (1-indexed) on new search
    setActiveSearchName(searchByNameValue.trim());
    setActiveSearchStudentNumber(''); // Clear other search
    setSearchByStudentNumberValue(''); // Clear other search input
  };

  // Handler for student number search form submission
  const searchByStudentNumber = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page (1-indexed) on new search
    setActiveSearchStudentNumber(searchByStudentNumberValue.trim());
    setActiveSearchName(''); // Clear other search
    setSearchByNameValue(''); // Clear other search input
  };

  // Handler to initiate student archiving (opens confirmation modal)
  const handleArchiveStudent = (studentNumber) => {
    setStudentToArchive(studentNumber);
    setIsConfirmModalOpen(true);
  };

  // Handler for confirming student archive
  const confirmArchive = async () => {
    setIsConfirmModalOpen(false); // Close modal
    if (!studentToArchive) return;

    const { error } = await supabase
      .from("Students")
      .update({ isArchived: true })
      .eq("studentNumber", studentToArchive);

    if (error) {
      console.error("Error archiving student: ", error.message);
      // In a real application, you'd show a custom toast or error message here
      return;
    }

    console.log(`Student ${studentToArchive} archived successfully`);
    // Re-fetch data to update the list and counts after archiving
    // We pass currentPage, as the number of pages might change after archiving
    fetchStudentsList(currentPage, itemsPerPage, activeSearchName, activeSearchStudentNumber);
    setStudentToArchive(null); // Clear student to archive
  };

  // Handler for canceling student archive
  const cancelArchive = () => {
    setIsConfirmModalOpen(false);
    setStudentToArchive(null);
  };

  // Handler for viewing student full info
  const handleViewStudent = (studentNumber) => {
    setSelectedStudentNumber(studentNumber);
    setModalOpen_studentInfo(true);
  };

  // Handler to clear all search filters
  const clearSearch = () => {
    setSearchByNameValue('');
    setSearchByStudentNumberValue('');
    setActiveSearchName('');
    setActiveSearchStudentNumber('');
    setCurrentPage(1); // Reset to the first page (1-indexed)
  };

  // Handler for page change from PaginationControls
  // It receives the new page number (1-indexed)
  const pageChange = (newPageNumber) => {
    setCurrentPage(newPageNumber);
  };

  return (
    <div className='bg-white min-h-screen p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-black mb-6 zain-regular'>
          Students Management
        </h1>

        {/* Search Section */}
        <div className='flex justify-center gap-3 zain-regular text-black max-md:my-5 max-md:mx-10 max-sm:flex-col mb-6'>
          <div>
            <form onSubmit={searchByName} className='max-md:flex max-md:flex-col'>
              <input
                type='text'
                placeholder='Search by Name:'
                value={searchByNameValue}
                onChange={e => setSearchByNameValue(e.target.value)}
                className='py-2 px-4 rounded-2xl border-2'
              />
              <button type="submit" className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>
                Search
              </button>
            </form>
          </div>
          <div>
            <form onSubmit={searchByStudentNumber} className='max-md:flex max-md:flex-col'>
              <input
                type='text'
                placeholder='Student Number:'
                value={searchByStudentNumberValue}
                onChange={e => setSearchByStudentNumberValue(e.target.value)}
                className='py-2 px-4 rounded-2xl border-2'
              />
              <button type="submit" className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:hover:text-black'>
                Search
              </button>
            </form>
          </div>
          <div className='flex justify-around'>
            <button
              onClick={clearSearch}
              className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'
            >
              Clear Search
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className='mb-4 text-sm text-gray-600'>
          Showing {displayStudents.length} of {totalFilteredRows} students
        </div>

        {/* Loading State */}
        {loading ? (
          <div className='text-center py-8'>
            <div className='text-gray-500'>Loading students...</div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className='overflow-x-auto shadow-lg rounded-lg'>
              <table className='w-full bg-white border border-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                      Student Number
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                      Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                      Assessment Status
                    </th>
                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {displayStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className='px-6 py-8 text-center text-gray-500'>
                        {(activeSearchName || activeSearchStudentNumber) ? 'No students found matching your search.' : 'No students found.'}
                      </td>
                    </tr>
                  ) : (
                    displayStudents.map((student, index) => (
                      <tr key={student.studentNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {student.studentNumber}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {student.studentName || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.isAssessed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.isAssessed ? 'Assessed' : 'Pending'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-center'>
                          <div className='flex justify-center space-x-2'>
                            <button
                              onClick={() => handleViewStudent(student.studentNumber)}
                              className='bg-[#4E0303] hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleArchiveStudent(student.studentNumber)}
                              className='bg-[#4E0303] hover:bg-[#4E0303] text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                            >
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <PaginationControls
              rowsPerPage={itemsPerPage}
              totalRows={totalFilteredRows} // Pass the total count of filtered/searched rows
              currentPage={currentPage} // Pass the current 1-indexed page
              onPageChange={pageChange} // Callback receives 1-indexed page
            />
          </>
        )}

        {/* Student Info Modal */}
        <StudentFullInfo
          isOpen={isModalOpen_studentInfo}
          onClose={() => setModalOpen_studentInfo(false)}
          studentNumber={selectedStudentNumber}
        />

        {/* Custom Confirmation Modal for Archiving */}
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          message="Are you sure you want to archive this student?"
          onConfirm={confirmArchive}
          onCancel={cancelArchive}
        />
      </div>
    </div>
  );
}
