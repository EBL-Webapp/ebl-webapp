import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useArchivedStudents, useUnarchiveStudent, useDeleteStudent } from '../../../hooks/useStudents';

// Custom Confirmation Modal Component
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

export default function AdminPage_studentsArchive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch archived students using TanStack Query
  const { data: archivedStudents = [], isLoading } = useArchivedStudents();

  // Mutations
  const unarchiveStudentMutation = useUnarchiveStudent();
  const deleteStudentMutation = useDeleteStudent();

  // Filter students based on search term
  const filteredStudents = archivedStudents.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(searchLower) ||
      student.studentNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Handlers
  const handleUnarchive = (student) => {
    setSelectedStudent(student);
    setConfirmAction('unarchive');
    setIsConfirmModalOpen(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setConfirmAction('delete');
    setIsConfirmModalOpen(true);
  };

  const confirmActionHandler = async () => {
    setIsConfirmModalOpen(false);

    if (!selectedStudent) return;

    try {
      if (confirmAction === 'unarchive') {
        await unarchiveStudentMutation.mutateAsync(selectedStudent.studentNumber);
        console.log(`Student ${selectedStudent.studentNumber} unarchived successfully`);
      } else if (confirmAction === 'delete') {
        await deleteStudentMutation.mutateAsync(selectedStudent.studentNumber);
        console.log(`Student ${selectedStudent.studentNumber} deleted successfully`);
      }
    } catch (error) {
      console.error(`Error ${confirmAction}ing student:`, error);
      alert(`Error ${confirmAction}ing student: ${error.message}`);
    } finally {
      setSelectedStudent(null);
      setConfirmAction(null);
    }
  };

  const cancelAction = () => {
    setIsConfirmModalOpen(false);
    setSelectedStudent(null);
    setConfirmAction(null);
  };

  // Export to Excel
  const exportToExcel = () => {
    if (archivedStudents.length === 0) {
      alert('No archived students to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(archivedStudents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Archived Students');
    XLSX.writeFile(workbook, 'archived_students.xlsx');
  };

  // Import from Excel
  const importFromExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Imported data:', jsonData);
      alert(`Imported ${jsonData.length} students. Implementation pending for bulk insert.`);
    };
    reader.readAsArrayBuffer(file);
  };

  const combinedLoading = isLoading ||
    unarchiveStudentMutation.isPending ||
    deleteStudentMutation.isPending;

  return (
    <div className='bg-white min-h-screen p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-black mb-6 zain-regular'>
          Archived Students
        </h1>

        {/* Action Buttons */}
        <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
          <div className='flex gap-2'>
            <button
              onClick={exportToExcel}
              className='bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800'
            >
              Export to Excel
            </button>
            <label className='bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800 cursor-pointer'>
              Import from Excel
              <input
                type='file'
                accept='.xlsx, .xls'
                onChange={importFromExcel}
                className='hidden'
              />
            </label>
          </div>

          {/* Search */}
          <input
            type='text'
            placeholder='Search by Name or Student Number'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='border border-gray-300 rounded-2xl px-4 py-2 w-full md:w-auto text-black'
          />
        </div>

        {/* Results Count */}
        <div className='mb-4 text-sm text-gray-600'>
          Showing {filteredStudents.length} of {archivedStudents.length} archived students
        </div>

        {/* Loading State */}
        {combinedLoading ? (
          <div className='text-center py-8'>
            <div className='text-gray-500'>Loading archived students...</div>
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
                      Payment Status
                    </th>
                    <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan='4' className='px-6 py-8 text-center text-gray-500'>
                        {searchTerm ? 'No archived students found matching your search.' : 'No archived students found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={student.studentNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {student.studentNumber}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {student.studentName || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(student.surplus_deficit_payment || 0) >= 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {(student.surplus_deficit_payment || 0) >= 0 ? 'Paid' : `Unpaid (${student.surplus_deficit_payment})`}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-center'>
                          <div className='flex justify-center space-x-2'>
                            <button
                              onClick={() => handleUnarchive(student)}
                              className='bg-[#114516] hover:bg-green-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                            >
                              Unarchive
                            </button>
                            <button
                              onClick={() => handleDelete(student)}
                              className='bg-[#4E0303] hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          message={
            confirmAction === 'unarchive'
              ? 'Are you sure you want to unarchive this student?'
              : 'Are you sure you want to permanently delete this student?'
          }
          onConfirm={confirmActionHandler}
          onCancel={cancelAction}
        />
      </div>
    </div>
  );
}
