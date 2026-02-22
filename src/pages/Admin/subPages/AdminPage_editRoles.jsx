import { useState } from 'react';
import Loading from '../../../components/Loading';
import PaginationControls from '../../../components/PaginationControls';
import StudentFullInfo from '../../../components/StudentFullInfo';
import TransientFullInfo from '../../../components/TransientFullInfo';
import { fetchColumnValue } from '../../../fetchColumnValue'; // Adjusted path if necessary
import { useGlobalContext } from '../../../context/GlobalContext';
import {
  useRoleRequests,
  useAdmins,
  useApproveRegistration,
  useDenyRegistration,
  useDeleteAdmin
} from '../../../hooks/useRoles';

function AdminPage_editRoles() {
  const { adminID } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectTransientID, setSelectedTransientId] = useState(null);

  // TanStack Query Hooks
  const { data: requestData, isLoading: isLoadingRequests } = useRoleRequests(currentPage, pageSize);
  const { data: adminsList = [], isLoading: isLoadingAdmins } = useAdmins();

  // Mutations
  const approveMutation = useApproveRegistration();
  const denyMutation = useDenyRegistration();
  const deleteAdminMutation = useDeleteAdmin();

  // Loading state
  const isLoading = isLoadingRequests || isLoadingAdmins ||
    approveMutation.isPending || denyMutation.isPending ||
    deleteAdminMutation.isPending;

  const rows = requestData?.data || [];
  const totalRows = requestData?.count || 0;

  // Filter out current admin from the list
  const filteredAdmins = adminsList.filter(admin => admin.adminID !== adminID);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAccept = async (id, type) => {
    try {
      await approveMutation.mutateAsync({ id, type });
      console.log(`${type} approved successfully`);
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      alert(`Error approving ${type}: ` + error.message);
    }
  };

  const handleDeny = async (id, type) => {
    if (!window.confirm(`Are you sure you want to deny this ${type} request? This will verify the deletion.`)) return;

    try {
      await denyMutation.mutateAsync({ id, type });
      console.log(`${type} denied (deleted) successfully`);
    } catch (error) {
      console.error(`Error denying ${type}:`, error);
      alert(`Error denying ${type}: ` + error.message);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await deleteAdminMutation.mutateAsync(id);
      console.log("Admin deleted successfully");
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin: " + error.message);
    }
  };

  const handleViewStudentInfo = async (studentId) => {
    // First convert the UUID to studentNumber
    // We might need to keep this logic here as specifically requested by original code structure
    // ideally this should be part of the API response if possible, but keeping it as is for minimal backend impact
    try {
      const actualStudentNumber = await fetchColumnValue(
        "Students",
        "userID",
        studentId,
        "studentNumber"
      );

      if (actualStudentNumber) {
        setSelectedStudentId(actualStudentNumber);
      } else {
        console.error("Could not find student number for ID:", studentId);
        alert("Could not find student number for this request.");
      }
    } catch (e) {
      console.error("Error fetching student number", e);
    }
  };

  const handleCloseStudentInfo = () => {
    setSelectedStudentId(null);
  };

  const handleCloseTransientInfo = () => {
    setSelectedTransientId(null);
  };

  return (
    <div className="pt-10 pb-60">
      {isLoading && <Loading />}

      {/* Roles Request Table */}
      <div>
        <div>
          <h1 className="text-black zain-regular ml-15">Roles Request</h1>
        </div>
        <div className="mt-10 overflow-x-auto shadow-lg rounded-lg w-[90%] mx-auto">
          <table className="w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Requested Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr className='font-medium text-gray-500'>
                  <td colSpan={3} className='text-center py-5'>
                    No Pending Requests
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.original_entity_id} className='text-gray-500'>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {row.requester_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {row.requester_type === "student" ? 'Student' : row.requester_type === 'admin' ? 'Admin' : 'Transient'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleAccept(row.original_entity_id, row.requester_type)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeny(row.original_entity_id, row.requester_type)}
                          className="bg-red-300 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                        >
                          Deny
                        </button>
                        {row.requester_type === 'student' ?
                          <button
                            onClick={() => handleViewStudentInfo(row.original_entity_id)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                            View
                          </button>
                          : row.requester_type === 'transient' ?
                            <button
                              onClick={() => setSelectedTransientId(row.original_entity_id)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                              View
                            </button>
                            :
                            <button disabled className="bg-gray-200 text-white px-3 py-1 rounded text-sm transition-colors cursor-not-allowed duration-200">
                              View
                            </button>
                        }
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          rowsPerPage={pageSize}
          totalRows={totalRows}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Student Info Modal */}
      {selectedStudentId && (
        <StudentFullInfo
          isOpen={!!selectedStudentId}
          onClose={handleCloseStudentInfo}
          studentNumber={selectedStudentId}
        />
      )}

      {/* Transient Info Modal */}
      {selectTransientID && (
        <TransientFullInfo
          isOpen={!!selectTransientID}
          onClose={handleCloseTransientInfo}
          transientId={selectTransientID}
        />
      )}

      {/* List of Admins */}
      <div className='mt-20'>
        <div>
          <h1 className="text-black zain-regular ml-15">List of Admins</h1>
        </div>

        <div className="mt-10 overflow-x-auto shadow-lg rounded-lg w-[90%] mx-auto">
          <table className="w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Admin Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Account Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr className='font-medium text-gray-500'>
                  <td colSpan={3} className='text-center py-5'>
                    No Other Admins Found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.adminID} className="text-gray-500">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {admin.adminName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {admin.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                          onClick={() => handleDeleteAdmin(admin.adminID)}
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
      </div>
    </div>
  );
}

export default AdminPage_editRoles;
