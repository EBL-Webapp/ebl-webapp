import { useEffect, useState } from "react";
import supabase from "../../../supabase_client";

function AdminPage_overstayPermits() {

  const [pendingApproval, setPendingApproval] = useState([]);
  const [pendingValidation, setPendingValidation] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('approval'); // 'approval' or 'validation'
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const fetchPendingApproval = async () => {
    const { data, error } = await supabase
      .from("Overnight_Excuse")
      .select(`
        *,
        Students!Overnight_Excuse_studentNumber_fkey (
          studentName,
          Information_and_Instruction_Sheet!Information_and_Instruction_Sheet_studentNumber_fkey (
            isAllowed_WeekendsWithRelatives_or_guardians,
            isAllowed_spendOvernightWithFriends_or_dormmates,
            isAllowed_joinDemonstrations_or_rallies,
            whatIllnesses,
            otherAdditionalInstruction,
            Allowed_ToGoHomeInWeekends,
            Allowed_ToGoHomeInWeekdays,
            isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions
          )
        )
      `)
      .is("isApproved", null);
    
    if (error) {
      console.log("Error fetching pending approvals:", error.message);
      return;
    }
    
    setPendingApproval(data || []);
    if (data && data.length > 0 && !selectedRequest) {
      setSelectedRequest(data[0]);
    }
  };

  const fetchPendingValidation = async () => {
    const { data, error } = await supabase
      .from("Overnight_Excuse")
      .select(`
        *,
        Students!Overnight_Excuse_studentNumber_fkey (
          studentName,
          Information_and_Instruction_Sheet!Information_and_Instruction_Sheet_studentNumber_fkey (
            isAllowed_WeekendsWithRelatives_or_guardians,
            isAllowed_spendOvernightWithFriends_or_dormmates,
            isAllowed_joinDemonstrations_or_rallies,
            whatIllnesses,
            otherAdditionalInstruction,
            Allowed_ToGoHomeInWeekends,
            Allowed_ToGoHomeInWeekdays,
            isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions
          )
        )
      `)
      .eq("isApproved", true)
      .is("isValidated", null);
    
    if (error) {
      console.log("Error fetching pending validations:", error.message);
      return;
    }
    
    setPendingValidation(data || []);
  };

  // Get current admin info
  const getCurrentAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: adminData, error } = await supabase
        .from('admin')
        .select('adminID')
        .eq('userID', user.id)
        .single();
      
      if (!error && adminData) {
        setCurrentAdminId(adminData.adminID);
      }
    }
  };

  const handleApprove = async (requestId, isApproval = true) => {
    if (!currentAdminId) {
      console.log("Admin ID not found");
      return;
    }

    let updateData = {};
    
    if (isApproval) {
      // For approval: set approval fields, leave validation fields null
      updateData = {
        isApproved: true,
        approvedby_adminID: currentAdminId,
        approvedOn: new Date().toISOString(),
        isValidated: null,
        validatedby_adminID: null,
        validatedOn: null
      };
    } else {
      // For validation: only set validation fields
      updateData = {
        isValidated: true,
        validatedby_adminID: currentAdminId,
        validatedOn: new Date().toISOString()
      };
    }
    
    const { error } = await supabase
      .from("Overnight_Excuse")
      .update(updateData)
      .eq('overnightExcuseID', requestId);

    if (error) {
      console.log(`Error ${isApproval ? 'approving' : 'validating'} request:`, error.message);
      return;
    }

    // Refresh both lists
    await fetchPendingApproval();
    await fetchPendingValidation();
    
    // Update selected request if it was the one we just processed
    if (selectedRequest && selectedRequest.overnightExcuseID === requestId) {
      const updatedList = isApproval ? pendingApproval : pendingValidation;
      const nextRequest = updatedList.find(req => req.overnightExcuseID !== requestId);
      setSelectedRequest(nextRequest || null);
    }
  };

  const handleDeny = async (requestId, isApproval = true) => {
    if (!currentAdminId) {
      console.log("Admin ID not found");
      return;
    }

    let updateData = {};
    
    if (isApproval) {
      // For approval denial: set approval fields to false, leave validation fields null
      updateData = {
        isApproved: false,
        approvedby_adminID: currentAdminId,
        approvedOn: new Date().toISOString(),
        isValidated: null,
        validatedby_adminID: null,
        validatedOn: null
      };
    } else {
      // For validation denial: only set validation fields
      updateData = {
        isValidated: false,
        validatedby_adminID: currentAdminId,
        validatedOn: new Date().toISOString()
      };
    }
    
    const { error } = await supabase
      .from("Overnight_Excuse")
      .update(updateData)
      .eq('overnightExcuseID', requestId);

    if (error) {
      console.log(`Error denying request:`, error.message);
      return;
    }

    // Refresh both lists
    await fetchPendingApproval();
    await fetchPendingValidation();
    
    // Update selected request if it was the one we just processed
    if (selectedRequest && selectedRequest.overnightExcuseID === requestId) {
      const updatedList = isApproval ? pendingApproval : pendingValidation;
      const nextRequest = updatedList.find(req => req.overnightExcuseID !== requestId);
      setSelectedRequest(nextRequest || null);
    }
  };

  const handleCardClick = (request) => {
    setSelectedRequest(request);
  };

  const formatBooleanPermission = (value) => {
    if (value === null) return "Not specified";
    return value ? "Allowed" : "Not allowed";
  };

  useEffect(() => {
    getCurrentAdmin();
    fetchPendingApproval();
    fetchPendingValidation();
  }, []);

  const currentList = activeTab === 'approval' ? pendingApproval : pendingValidation;
  const isApprovalTab = activeTab === 'approval';
  
  // Filter out the selected request from the cards list
  const filteredList = currentList.filter(request => 
    !selectedRequest || selectedRequest.overnightExcuseID !== request.overnightExcuseID
  );

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'approval' 
                ? 'bg-[#4E0303] text-white' 
                : 'bg-transparent text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Approval ({pendingApproval.length})
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'validation' 
                ? 'bg-[#4E0303] text-white' 
                : 'bg-transparent text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Validation ({pendingValidation.length})
          </button>
        </div>
      </div>

      <div className='lg:grid lg:grid-cols-3 lg:gap-2'>

        <div className='justify-center flex mb-10 lg:col-span-2'>
          <div className='w-[95%] h-fit bg-white mt-6 rounded-4xl border-2 border-black text-black'>
            {selectedRequest ? (
              <>
                {/* This part is the quickinfo part, this will provide the info about student, name and reason */}
                <div className='zain-regular text-[12px] p-5'>
                  {/* This part is the upper part */}
                  <div className='grid grid-cols-3 lg:text-[20px] '>
                    <p className='col-span-2'>
                      Name: {selectedRequest.Students?.studentName || 'N/A'}
                    </p>
                    <p className='col-span-1'>Student #: {selectedRequest.studentNumber}</p>
                  </div>
                  <p className='mt-5 lg:text-[20px] '>Duration:</p>
                  <div className='flex lg:text-[20px] gap-8'>
                    <p className=''>From: {new Date(selectedRequest.fromDate).toLocaleString()}</p>
                    <p className=''>To: {new Date(selectedRequest.toDate).toLocaleString()}</p>
                  </div>

                  <div className='mt-4 lg:text-[20px] ' >
                    <p>Reason for Overnight Slip: {selectedRequest.reason}</p>
                  </div>
                </div>

                {/* This part is where we can compare the medical and permission info */}
                <div className=' border-t-3 border-b-3 mb-5 grid grid-cols-2 zain-regular lg:text-[14px] '>
                  {/* Left Part - Medical & Instructions */}
                  <div className='border-r-3 border-black p-3'>
                    <p className="font-semibold mb-2">Medical & Instructions:</p>
                    <div className="space-y-1 text-xs">
                      <p><strong>Illnesses:</strong> {selectedRequest.Students?.Information_and_Instruction_Sheet?.whatIllnesses || 'None reported'}</p>
                      <p><strong>Additional Instructions:</strong> {selectedRequest.Students?.Information_and_Instruction_Sheet?.otherAdditionalInstruction || 'None'}</p>
                    </div>
                  </div>
                  {/* Right Part - Permissions */}
                  <div className='p-3'>
                    <p className="font-semibold mb-2">Permissions:</p>
                    <div className="space-y-1 text-xs">
                      <p><strong>Weekend w/ Relatives:</strong> {formatBooleanPermission(selectedRequest.Students?.Information_and_Instruction_Sheet?.isAllowed_WeekendsWithRelatives_or_guardians)}</p>
                      <p><strong>Overnight w/ Friends:</strong> {formatBooleanPermission(selectedRequest.Students?.Information_and_Instruction_Sheet?.isAllowed_spendOvernightWithFriends_or_dormmates)}</p>
                      <p><strong>School Field Trips:</strong> {formatBooleanPermission(selectedRequest.Students?.Information_and_Instruction_Sheet?.isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions)}</p>
                      <p><strong>Demonstrations/Rallies:</strong> {formatBooleanPermission(selectedRequest.Students?.Information_and_Instruction_Sheet?.isAllowed_joinDemonstrations_or_rallies)}</p>
                      <p><strong>Home (Weekends):</strong> {selectedRequest.Students?.Information_and_Instruction_Sheet?.Allowed_ToGoHomeInWeekends || 'Not specified'}</p>
                      <p><strong>Home (Weekdays):</strong> {selectedRequest.Students?.Information_and_Instruction_Sheet?.Allowed_ToGoHomeInWeekdays || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                {/* This is for the buttons */}
                <div className='flex justify-end mr-5'>
                  <button 
                    onClick={() => handleApprove(selectedRequest.overnightExcuseID, isApprovalTab)}
                    className='bg-green-600 text-white rounded-2xl px-5 py-2 ml-5 mb-5 hover:bg-green-700'
                  >
                    {isApprovalTab ? 'Approve' : 'Validate'}
                  </button>
                  <button 
                    onClick={() => handleDeny(selectedRequest.overnightExcuseID, isApprovalTab)}
                    className='bg-red-600 text-white rounded-2xl px-5 py-2 ml-5 mb-5 hover:bg-red-700'
                  >
                    Deny
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">
                  No {isApprovalTab ? 'pending approvals' : 'pending validations'} at this time
                </p>
              </div>
            )}
          </div>
        </div>

        {/* The next div is for cards */}
        <div className='m-4 justify-center grid grid-cols-2 gap-2 lg:col-span-1 h-[500px] overflow-y-auto'>
          {filteredList.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center h-32">
              <p className="text-gray-500">
                {currentList.length === 0 
                  ? `No ${isApprovalTab ? 'pending approvals' : 'pending validations'}`
                  : 'Selected request is currently displayed above'
                }
              </p>
            </div>
          ) : (
            filteredList.map((request) => (
              <div 
                key={request.overnightExcuseID}
                className="border-2 border-black p-2 rounded-2xl zain-regular text-black h-fit hover:bg-gray-50"
              >
                <div className='zain-regular'>
                  <p>Name: {request.Students?.studentName || 'N/A'}</p>
                  <p>Student #: {request.studentNumber}</p>
                  <p>Duration:</p>
                  <div className='ml-4 text-xs'>
                    <p>From: {new Date(request.fromDate).toLocaleDateString()}</p>
                    <p>To: {new Date(request.toDate).toLocaleDateString()}</p>
                  </div>
                  <hr className="my-2"/>
                  <p className="text-xs text-gray-600 truncate">Reason: {request.reason}</p>
                </div>
                <div className='flex justify-between items-center mt-2'>
                  <button 
                    onClick={() => handleCardClick(request)}
                    className='p-2 bg-blue-600 mt-1 rounded-2xl text-white zain-regular hover:bg-blue-700 text-xs' 
                  >
                    Select
                  </button>
                  <div className='flex gap-2'>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request.overnightExcuseID, isApprovalTab);
                      }}
                      className='p-2 bg-green-600 mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-green-700 text-xs' 
                    >
                      {isApprovalTab ? 'Approve' : 'Validate'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeny(request.overnightExcuseID, isApprovalTab);
                      }}
                      className='p-2 bg-red-600 mt-1 rounded-2xl text-white zain-regular w-15 hover:bg-red-700 text-xs' 
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}

export default AdminPage_overstayPermits