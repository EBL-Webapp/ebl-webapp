import React, { useState } from 'react';
import { useGlobalContext } from '../../../context/GlobalContext';
import {
  usePendingApprovalPermits,
  usePendingValidationPermits,
  useApprovePermit,
  useDenyPermit,
  useValidatePermit
} from '../../../hooks/useOverstayPermits';

export default function AdminPage_overstayPermits() {
  const { adminID } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('approval'); // 'approval' or 'validation'

  // Fetch permits using TanStack Query
  const { data: pendingApprovalPermits = [], isLoading: isLoadingApproval } = usePendingApprovalPermits();
  const { data: pendingValidationPermits = [], isLoading: isLoadingValidation } = usePendingValidationPermits();

  // Mutations
  const approvePermitMutation = useApprovePermit();
  const denyPermitMutation = useDenyPermit();
  const validatePermitMutation = useValidatePermit();

  const isLoading = isLoadingApproval || isLoadingValidation ||
    approvePermitMutation.isPending ||
    denyPermitMutation.isPending ||
    validatePermitMutation.isPending;

  const handleApprove = async (requestId) => {
    try {
      await approvePermitMutation.mutateAsync({ requestId, adminID });
      console.log(`Permit ${requestId} approved successfully`);
    } catch (error) {
      console.error('Error approving permit:', error);
      alert('Error approving permit: ' + error.message);
    }
  };

  const handleDeny = async (requestId) => {
    try {
      await denyPermitMutation.mutateAsync({ requestId, adminID });
      console.log(`Permit ${requestId} denied successfully`);
    } catch (error) {
      console.error('Error denying permit:', error);
      alert('Error denying permit: ' + error.message);
    }
  };

  const handleValidate = async (requestId) => {
    try {
      await validatePermitMutation.mutateAsync({ requestId, adminID });
      console.log(`Permit ${requestId} validated successfully`);
    } catch (error) {
      console.error('Error validating permit:', error);
      alert('Error validating permit: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='bg-white min-h-screen p-6'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-black mb-6 zain-regular'>
          Overstay Permits Management
        </h1>

        {/* Tabs */}
        <div className='flex gap-4 mb-6 border-b border-gray-200'>
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'approval'
                ? 'text-[#114516] border-b-2 border-[#114516]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Pending Approval ({pendingApprovalPermits.length})
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'validation'
                ? 'text-[#114516] border-b-2 border-[#114516]'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Pending Validation ({pendingValidationPermits.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className='text-center py-8'>
            <div className='text-gray-500'>Loading permits...</div>
          </div>
        ) : (
          <>
            {/* Pending Approval Tab */}
            {activeTab === 'approval' && (
              <div className='overflow-x-auto shadow-lg rounded-lg'>
                <table className='w-full bg-white border border-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Student
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        From Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        To Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Reason
                      </th>
                      <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {pendingApprovalPermits.length === 0 ? (
                      <tr>
                        <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                          No permits pending approval.
                        </td>
                      </tr>
                    ) : (
                      pendingApprovalPermits.map((permit, index) => (
                        <tr key={permit.overnightExcuseID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {permit.Students?.studentName || permit.studentNumber}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {formatDate(permit.fromDate)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {formatDate(permit.toDate)}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-900'>
                            {permit.reason || 'No reason provided'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center'>
                            <div className='flex justify-center space-x-2'>
                              <button
                                onClick={() => handleApprove(permit.overnightExcuseID)}
                                className='bg-[#114516] hover:bg-green-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleDeny(permit.overnightExcuseID)}
                                className='bg-[#4E0303] hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                              >
                                Deny
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pending Validation Tab */}
            {activeTab === 'validation' && (
              <div className='overflow-x-auto shadow-lg rounded-lg'>
                <table className='w-full bg-white border border-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Student
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        From Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        To Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Reason
                      </th>
                      <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {pendingValidationPermits.length === 0 ? (
                      <tr>
                        <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>
                          No permits pending validation.
                        </td>
                      </tr>
                    ) : (
                      pendingValidationPermits.map((permit, index) => (
                        <tr key={permit.overnightExcuseID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {permit.Students?.studentName || permit.studentNumber}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {formatDate(permit.fromDate)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {formatDate(permit.toDate)}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-900'>
                            {permit.reason || 'No reason provided'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-center'>
                            <div className='flex justify-center space-x-2'>
                              <button
                                onClick={() => handleValidate(permit.overnightExcuseID)}
                                className='bg-[#114516] hover:bg-green-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200'
                              >
                                Validate
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}