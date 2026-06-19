import React, { useState } from 'react';
import StudentFullInfo from '../../../components/StudentFullInfo';
import PaginationControls from '../../../components/PaginationControls';
import { useStudentsList, useArchiveStudent, useRejectStudent } from '../../../hooks/useStudents';

 
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 text-black">
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
  // Search states
  const [searchByNameValue, setSearchByNameValue] = useState('');
  const [searchByStudentNumberValue, setSearchByStudentNumberValue] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Modal states
  const [isModalOpen_studentInfo, setModalOpen_studentInfo] = useState(false);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState(null);

  // Reject states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [studentToReject, setStudentToReject] = useState(null);

  // Pagination states (1-indexed)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch students using TanStack Query
  const { data: studentsData, isLoading } = useStudentsList(
    currentPage,
    itemsPerPage,
    activeSearchTerm
  );

  console.log("studentsData is: ", studentsData)

  // Archive mutation
  const archiveStudentMutation = useArchiveStudent();

  // Reject mutation
  const rejectStudentMutation = useRejectStudent();

  // Handler for name search form submission
  const searchByName = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearchTerm(searchByNameValue.trim());
    setSearchByStudentNumberValue('');
  };

  // Handler for student number search form submission
  const searchByStudentNumber = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearchTerm(searchByStudentNumberValue.trim());
    setSearchByNameValue('');
  };

  // Handler to initiate student archiving (opens confirmation modal)
  const handleArchiveStudent = (studentNumber) => {
    setStudentToArchive(studentNumber);
    setIsConfirmModalOpen(true);
  };

  // Handler for confirming student archive
  const confirmArchive = async () => {
    setIsConfirmModalOpen(false);
    if (!studentToArchive) return;

    try {
      await archiveStudentMutation.mutateAsync(studentToArchive);
      console.log(`Student ${studentToArchive} archived successfully`);
    } catch (error) {
      console.error("Error archiving student:", error);
      alert("Error archiving student: " + error.message);
    } finally {
      setStudentToArchive(null);
    }
  };

  // Handler for canceling student archive
  const cancelArchive = () => {
    setIsConfirmModalOpen(false);
    setStudentToArchive(null);
  };

  // Handler to initiate student rejection
  const handleRejectStudent = (studentNumber) => {
    setStudentToReject(studentNumber);
    setIsRejectModalOpen(true);
  };

  // Handler for confirming student rejection
  const confirmReject = async () => {
    setIsRejectModalOpen(false);
    if (!studentToReject) return;
    try {
      await rejectStudentMutation.mutateAsync(studentToReject);
    } catch (error) {
      console.error('Error rejecting student:', error);
      alert('Error rejecting student: ' + error.message);
    } finally {
      setStudentToReject(null);
    }
  };

  // Handler for canceling student rejection
  const cancelReject = () => {
    setIsRejectModalOpen(false);
    setStudentToReject(null);
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
    setActiveSearchTerm('');
    setCurrentPage(1);
  };

  // Handler for page change from PaginationControls
  const pageChange = (newPageNumber) => {
    setCurrentPage(newPageNumber);
  };

  const displayStudents = studentsData?.data || [];
  const totalFilteredRows = studentsData?.count || 0;
  const combinedLoading = isLoading || archiveStudentMutation.isPending || rejectStudentMutation.isPending;

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
        {combinedLoading ? (
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
                        {activeSearchTerm ? 'No students found matching your search.' : 'No students found.'}
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
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.isAssessed
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
                              className='bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                            >
                              Archive
                            </button>
                            {/* Only allow rejection for pending students */}
                            {!student.isAssessed && (
                              <button
                                onClick={() => handleRejectStudent(student.studentNumber)}
                                className='bg-[#4E0303] hover:bg-red-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                              >
                                Reject
                              </button>
                            )}
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
              totalRows={totalFilteredRows}
              currentPage={currentPage}
              onPageChange={pageChange}
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

        {/* Custom Confirmation Modal for Rejection */}
        <ConfirmationModal
          isOpen={isRejectModalOpen}
          message="Reject this student's application? They will be notified and can reapply."
          onConfirm={confirmReject}
          onCancel={cancelReject}
        />
      </div>
    </div>
  );
}
