import React, { useState, useEffect } from 'react';
import supabase from '../supabase_client'; // Adjust path if necessary
import Loading from './Loading'; // Assuming you have a Loading component

function TransientFullInfo({ isOpen, onClose, transientId }) {
  const [transientData, setTransientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && transientId) {
      fetchTransientData();
    } else {
      // Reset data when modal is closed
      setTransientData(null);
      setError(null);
    }
  }, [isOpen, transientId]);

  const fetchTransientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch basic transient info
      const { data: transientInfo, error: transientError } = await supabase
        .from('Transient')
        .select('*')
        .eq('transientID', transientId)
        .single();

      if (transientError) throw transientError;

      // Fetch transient request data
      const { data: transientRequestData, error: requestError } = await supabase
        .from('Transient_Request')
        .select('*')
        .eq('transientID', transientId)
        .order('timestamp', { ascending: false }) // Get the latest request if multiple exist
        .limit(1)
        .single(); // Use single assuming one primary request per transient for this view

      if (requestError && requestError.code !== 'PGRST116') { // PGRST116 means no rows found, which is okay if no request exists
        throw requestError;
      }

      // Combine data
      setTransientData({
        ...transientInfo,
        request: transientRequestData, // Will be null if no request found
      });

    } catch (err) {
      console.error("Error fetching transient data:", err.message);
      setError("Failed to load transient data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4 z-50 text-black">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-gray-800">Transient Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold">
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-grow">
          {loading && <Loading />}
          {error && (
            <div className="text-center py-8 text-red-500">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-lg font-medium">Error!</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && !transientData && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🤷‍♂️</div>
              <p className="text-lg font-medium">No Transient Data Found</p>
              <p className="text-sm">Could not load details for this transient.</p>
            </div>
          )}
          {!loading && !error && transientData && (
            <div className="space-y-6">
              {/* Transient Basic Info */}
              <fieldset className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <legend className="text-lg font-semibold text-gray-700 px-2">Personal Information</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium">Occupant Name</label>
                    <div className="p-2 bg-white border rounded">{transientData.nameOfOccupant || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <div className="p-2 bg-white border rounded">{transientData.email || 'N/A'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Complete Address</label>
                    <div className="p-2 bg-white border rounded">{transientData.completeAddress || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact Number</label>
                    <div className="p-2 bg-white border rounded">{transientData.contactNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Agency Connected</label>
                    <div className="p-2 bg-white border rounded">{transientData.agencyConnected || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Emergency Contact</label>
                    <div className="p-2 bg-white border rounded">{transientData.emergencyContact || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">User ID</label>
                    <div className="p-2 bg-white border rounded break-all">{transientData.userID}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Transient ID</label>
                    <div className="p-2 bg-white border rounded break-all">{transientData.transientID}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Accepted</label>
                    <div className="p-2 bg-white border rounded">{transientData.isAccepted ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Timestamp</label>
                    <div className="p-2 bg-white border rounded">{new Date(transientData.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </fieldset>

              {/* Transient Request Info */}
              {transientData.request ? (
                <fieldset className="border p-4 rounded-lg shadow-sm bg-blue-50">
                  <legend className="text-lg font-semibold text-blue-700 px-2">Request Details</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium">Request Date From</label>
                      <div className="p-2 bg-white border rounded">{new Date(transientData.request.requestDateFrom).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Request Date To</label>
                      <div className="p-2 bg-white border rounded">{new Date(transientData.request.requestDateTo).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Number of Males</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.no_Males || 0}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Number of Females</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.no_Females || 0}</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Purpose of Stay</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.purposeOfStay || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Bedding & Towel</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isBedding_and_Towel ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Signed</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isSigned ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Cash Payment</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isCash ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Waived</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isWaived ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">EBL</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isEBL ? 'Yes' : (transientData.request.isEBL === false ? 'No' : 'N/A')}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">ILC</label>
                      <div className="p-2 bg-white border rounded">{transientData.request.isILC ? 'Yes' : (transientData.request.isILC === false ? 'No' : 'N/A')}</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium">Request Timestamp</label>
                      <div className="p-2 bg-white border rounded">{new Date(transientData.request.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </fieldset>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-lg font-medium">No Transient Request Found</p>
                  <p className="text-sm">This transient has not submitted a request yet, or the request could not be retrieved.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransientFullInfo;
