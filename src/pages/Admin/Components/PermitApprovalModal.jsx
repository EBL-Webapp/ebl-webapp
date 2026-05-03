import React, { useState, useEffect } from 'react';
import supabase from '../../../supabase_client';

export default function PermitApprovalModal({ isOpen, onClose, onConfirm, permit }) {
  const [instructionData, setInstructionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && permit?.studentNumber) {
      fetchInstructionData();
    }
  }, [isOpen, permit]);

  const fetchInstructionData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('Information_and_Instruction_Sheet')
        .select('*')
        .eq('studentNumber', permit.studentNumber)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is no rows returned
        throw fetchError;
      }
      setInstructionData(data);
    } catch (err) {
      console.error('Error fetching instructions:', err);
      setError('Failed to load student instructions.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !permit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Review Student Permissions
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#114516]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 py-4 text-center">{error}</div>
        ) : !instructionData ? (
          <div className="text-gray-500 py-4 text-center">No instruction sheet found for this student.</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold text-lg mb-2 text-[#114516]">Medical Conditions</h3>
              <p className="text-gray-700">{instructionData.whatIllnesses || 'None specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded border">
               <h3 className="font-semibold text-lg mb-3 text-[#114516]">Parental Allowances / Permissions</h3>
               <ul className="space-y-2 text-sm text-gray-700">
                 <li className="flex gap-2">
                   <span className="font-medium text-gray-900 w-1/2">Go home on weekends:</span>
                   <span>{instructionData.Allowed_ToGoHomeInWeekends || 'N/A'}</span>
                 </li>
                 <li className="flex gap-2">
                   <span className="font-medium text-gray-900 w-1/2">Go home on weekdays:</span>
                   <span>{instructionData.Allowed_ToGoHomeInWeekdays || 'N/A'}</span>
                 </li>
                 <li className="flex gap-2 items-center">
                   <span className="font-medium text-gray-900 w-1/2">Overnight/Weekends with relatives/guardians:</span>
                   <span className={`px-2 py-1 rounded text-xs font-semibold ${instructionData.isAllowed_WeekendsWithRelatives_or_guardians ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {instructionData.isAllowed_WeekendsWithRelatives_or_guardians ? 'ALLOWED' : 'NOT ALLOWED'}
                   </span>
                 </li>
                 <li className="flex gap-2 items-center">
                   <span className="font-medium text-gray-900 w-1/2">Overnight with friends/dormmates:</span>
                   <span className={`px-2 py-1 rounded text-xs font-semibold ${instructionData.isAllowed_spendOvernightWithFriends_or_dormmates ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                     {instructionData.isAllowed_spendOvernightWithFriends_or_dormmates ? 'ALLOWED' : 'NOT ALLOWED'}
                   </span>
                 </li>
               </ul>
            </div>

            {instructionData.otherAdditionalInstruction && (
              <div className="bg-gray-50 p-4 rounded border">
                <h3 className="font-semibold text-lg mb-2 text-[#114516]">Additional Instructions</h3>
                <p className="text-gray-700">{instructionData.otherAdditionalInstruction}</p>
              </div>
            )}
            
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
               <h3 className="font-semibold text-sm mb-1 text-yellow-800">Permit Summary:</h3>
               <p className="text-sm text-gray-700">Student: <span className="font-medium">{permit.Students?.studentName || permit.studentNumber}</span></p>
               <p className="text-sm text-gray-700">Reason: <span className="font-medium">{permit.reason || 'No reason provided'}</span></p>
               <p className="text-sm text-gray-700">From <span className="font-medium">{new Date(permit.fromDate).toLocaleDateString()}</span> to <span className="font-medium">{new Date(permit.toDate).toLocaleDateString()}</span></p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm(permit.overnightExcuseID);
              onClose();
            }}
            className="px-6 py-2 bg-[#114516] text-white rounded hover:bg-green-800 font-medium transition-colors"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>
  );
}
