import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import supabase from '../supabase_client';

function StudentFullInfo({ isOpen, onClose, studentNumber }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applianceLabels = [
    'Laptop / Tablet / Desktop', 'Printer / Scanner', 'Electric Fan', 'Cellular Phone',
    'Study Lamp', 'iPod / PSP', 'Chargeable Flashlight', 'Powerbank', 'Pocket Wifi',
    'Camera', 'Nebulizer',
  ];

  useEffect(() => {
    if (isOpen && studentNumber) {
      fetchStudentData();
    }
  }, [isOpen, studentNumber]);

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch basic student info
      const { data: studentInfo, error: studentError } = await supabase
        .from('Students')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      if (studentError) throw studentError;

      // Fetch application data
      const { data: applicationData, error: applicationError } = await supabase
        .from('Application_for_Dorm_Accomodation')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      // Fetch instruction sheet data
      const { data: instructionData, error: instructionError } = await supabase
        .from('Information_and_Instruction_Sheet')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      // Fetch designated guardians
      const { data: guardians, error: guardiansError } = await supabase
        .from('Designated_Guardians')
        .select('*')
        .eq('studentNumber', studentNumber);

      // Fetch guardian information (parents)
      const { data: guardianInfo, error: guardianInfoError } = await supabase
        .from('guardianInformation')
        .select('*')
        .eq('studentNumber', studentNumber);

      // Debug log to see what guardian types we have
      console.log('Guardian Info:', guardianInfo);
      if (guardianInfo) {
        console.log('Guardian Types found:', guardianInfo.map(g => g.guardianType));
      }

      // Fetch appliances
      const { data: appliances, error: appliancesError } = await supabase
        .from('appliance_per_student')
        .select(`
          *,
          list_of_appliances(applianceName)
        `)
        .eq('studentNumber', studentNumber)
        .eq('isActive', true);

      // Fetch acknowledgement of accountability form
      const { data: accountabilityData, error: accountabilityError } = await supabase
        .from('Acknowledgemet_of_Accountability_Form')
        .select('*')
        .eq('studentNumber', studentNumber)
        .eq('isArchived', false)
        .order('timestamp', { ascending: false })
        .limit(1);

      // Process and combine all data
      const combinedData = {
        // Basic student info
        studentNumber: studentInfo?.studentNumber || '',
        studentName: studentInfo?.studentName || applicationData?.studentName || '',
        
        // Application data
        sex: applicationData?.Sex || '',
        age: applicationData?.Age?.toString() || '',
        course: applicationData?.Course || '',
        yearLevel: applicationData?.yearLevel?.toString() || '',
        dateOfBirth: applicationData?.dateOfBirth || '',
        placeOfBirth: applicationData?.placeOfBirth || '',
        religion: applicationData?.religion || '',
        civilStatus: applicationData?.civilStatus || '',
        nationality: applicationData?.nationality || '',
        emailAddress: applicationData?.emailAddress || '',
        homeAddress: applicationData?.homeAddress || '',
        contactNo: applicationData?.contactNo || '',
        isStayedInAnyDormitory: applicationData?.isStayedInAnyDormitory ? 'Yes' : 'No',
        lengthOfStay: applicationData?.lengthOfStay || 'N/A',
        whereStayed: applicationData?.whereStayed || 'N/A',
        semester: `${applicationData?.semester_of_admissionYear || ''} ${applicationData?.admissionYear || ''}`.trim(),
        
        // Guardian information - using case-insensitive matching
        father: guardianInfo?.find(g => g.guardianType && g.guardianType.toLowerCase().includes('father')),
        mother: guardianInfo?.find(g => g.guardianType && g.guardianType.toLowerCase().includes('mother')),
        guardian: guardianInfo?.find(g => g.guardianType && (
          g.guardianType.toLowerCase().includes('guardian') ||
          (!g.guardianType.toLowerCase().includes('father') && !g.guardianType.toLowerCase().includes('mother'))
        )),
        
        // Instruction sheet data
        instruction_1: instructionData?.Allowed_ToGoHomeInWeekends || 'Not specified',
        instruction_2: instructionData?.Allowed_ToGoHomeInWeekdays || 'Not specified',
        instruction_3: instructionData?.isAllowed_WeekendsWithRelatives_or_guardians || false,
        instruction_4: instructionData?.isAllowed_spendOvernightWithFriends_or_dormmates || false,
        instruction_5: instructionData?.isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions || false,
        instruction_6: instructionData?.isAllowed_joinOrganizations || false,
        instruction_7: instructionData?.isAllowed_joinDemonstrations_or_rallies || false,
        instruction_8: instructionData?.whatIllnesses || 'None',
        additionalInstructions: instructionData?.otherAdditionalInstruction || 'None',
        
        // Designated guardians
        designatedGuardians: guardians || [],
        
        // Appliances
        appliances: appliances || [],
        
        // Accountability form data
        accountabilityForm: accountabilityData && accountabilityData.length > 0 ? accountabilityData[0] : null
      };

      setStudentData(combinedData);
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Failed to load student information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading student information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button 
                onClick={fetchStudentData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Data Found</h3>
            <p className="text-gray-600 mb-4">No information found for student number: {studentNumber}</p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Student Full Information - {studentNumber}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className="bg-blue-100 p-4 rounded border border-blue-300">
            <p className="text-sm text-blue-900">
              <strong>Student Information:</strong> Data retrieved from database for {studentData.studentName || 'Unknown Student'}
            </p>
            {/* Debug information - remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-blue-700">Debug Info (Development Only)</summary>
                <div className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  <p><strong>Father found:</strong> {studentData.father ? 'Yes' : 'No'}</p>
                  <p><strong>Mother found:</strong> {studentData.mother ? 'Yes' : 'No'}</p>
                  <p><strong>Guardian found:</strong> {studentData.guardian ? 'Yes' : 'No'}</p>
                  {studentData.father && <p><strong>Father Name:</strong> {studentData.father.Name}</p>}
                  {studentData.mother && <p><strong>Mother Name:</strong> {studentData.mother.Name}</p>}
                  {studentData.guardian && <p><strong>Guardian Name:</strong> {studentData.guardian.Name}</p>}
                  <p><strong>Accountability Form:</strong> {studentData.accountabilityForm ? 'Found' : 'Not found'}</p>
                </div>
              </details>
            )}
          </div>

          {/* Page 1: Student Application & Parent/Guardian Authorization */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold text-lg">Page 1: Dormitory Application</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div><label className="block text-sm font-medium">Semester</label><div className="p-2 bg-white border rounded">{studentData.semester || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Full Name</label><div className="p-2 bg-white border rounded">{studentData.studentName || 'Not provided'}</div></div>
              <div><label className="block text-sm font-medium">Sex</label><div className="p-2 bg-white border rounded">{studentData.sex || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.age || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Student ID No.</label><div className="p-2 bg-white border rounded">{studentData.studentNumber}</div></div>
              <div><label className="block text-sm font-medium">Course</label><div className="p-2 bg-white border rounded">{studentData.course || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Year Level</label><div className="p-2 bg-white border rounded">{studentData.yearLevel || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Date of Birth</label><div className="p-2 bg-white border rounded">{studentData.dateOfBirth || 'Not provided'}</div></div>
              <div><label className="block text-sm font-medium">Place of Birth</label><div className="p-2 bg-white border rounded">{studentData.placeOfBirth || 'Not provided'}</div></div>
              <div><label className="block text-sm font-medium">Religion</label><div className="p-2 bg-white border rounded">{studentData.religion || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Civil Status</label><div className="p-2 bg-white border rounded">{studentData.civilStatus || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">Nationality</label><div className="p-2 bg-white border rounded">{studentData.nationality || 'Not specified'}</div></div>
              <div><label className="block text-sm font-medium">E-mail Address</label><div className="p-2 bg-white border rounded">{studentData.emailAddress || 'Not provided'}</div></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium">Home Address</label><div className="p-2 bg-white border rounded">{studentData.homeAddress || 'Not provided'}</div></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.contactNo || 'Not provided'}</div></div>
            </div>
            
            <hr className="my-4" />
            
            {/* Parent/Guardian Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Parent/Guardian Authorization</h4>
              
              {/* Father */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md">
                <div><label className="block text-sm font-medium">Name of Father</label><div className="p-2 bg-white border rounded">{studentData.father?.Name || 'Not provided'}</div></div>
                <div><label className="block text-sm font-medium">Occupation</label><div className="p-2 bg-white border rounded">{studentData.father?.Occupation || 'Not provided'}</div></div>
                <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.father?.Age || 'Not provided'}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.father?.businessAddress_or_employmentAddress || 'Not provided'}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.father?.contactNumber || 'Not provided'}</div></div>
              </div>
              
              {/* Mother */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md">
                <div><label className="block text-sm font-medium">Name of Mother</label><div className="p-2 bg-white border rounded">{studentData.mother?.Name || 'Not provided'}</div></div>
                <div><label className="block text-sm font-medium">Occupation</label><div className="p-2 bg-white border rounded">{studentData.mother?.Occupation || 'Not provided'}</div></div>
                <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.mother?.Age || 'Not provided'}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.mother?.businessAddress_or_employmentAddress || 'Not provided'}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.mother?.contactNumber || 'Not provided'}</div></div>
              </div>
              
              {/* Guardian in Davao */}
              {studentData.guardian && (
                <div className="space-y-4 border-gray-400 border-2 p-2 rounded-md">
                  <h5 className="font-medium">Guardian in Davao City</h5>
                  <div><label className="block text-sm font-medium">Name</label><div className="p-2 bg-white border rounded">{studentData.guardian.Name}</div></div>
                  <div><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.guardian.businessAddress_or_employmentAddress || 'Not provided'}</div></div>
                  <div><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.guardian.contactNumber || 'Not provided'}</div></div>
                </div>
              )}
              
              <div className="space-y-2">
                <h5 className="font-medium">Previous Dormitory Experience</h5>
                <div><label className="block text-sm font-medium">Stayed in dormitory before?</label><div className="p-2 bg-white border rounded">{studentData.isStayedInAnyDormitory}</div></div>
                <div><label className="block text-sm font-medium">Length of Stay</label><div className="p-2 bg-white border rounded">{studentData.lengthOfStay}</div></div>
                <div><label className="block text-sm font-medium">Where?</label><div className="p-2 bg-white border rounded">{studentData.whereStayed}</div></div>
              </div>
            </div>
          </fieldset>

          {/* Page 2: Information and Instruction Sheet */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Information and Instruction Sheet (For Parents/Guardian)</legend>
            
            <div className="space-y-4 mt-4">
              <div><label className="block text-sm font-medium">1. Go home on weekends? If so, how often</label><div className="p-2 bg-white border rounded">{studentData.instruction_1}</div></div>
              <div><label className="block text-sm font-medium">2. Go home on weekdays? When? If so, please specify</label><div className="p-2 bg-white border rounded">{studentData.instruction_2}</div></div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border rounded ${studentData.instruction_3 ? 'bg-green-500' : 'bg-white'}`}></div>
                  <span className="text-sm">3. Spend overnight/weekends with relatives and/or guardians</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border rounded ${studentData.instruction_4 ? 'bg-green-500' : 'bg-white'}`}></div>
                  <span className="text-sm">4. Spend overnight with friends or dormmates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border rounded ${studentData.instruction_5 ? 'bg-green-500' : 'bg-white'}`}></div>
                  <span className="text-sm">5. Join school-related field trips/picnics/excursions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border rounded ${studentData.instruction_6 ? 'bg-green-500' : 'bg-white'}`}></div>
                  <span className="text-sm">6. Join organizations/fraternities/sororities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 border rounded ${studentData.instruction_7 ? 'bg-green-500' : 'bg-white'}`}></div>
                  <span className="text-sm">7. Join demonstrations or rallies</span>
                </div>
              </div>
              
              <div><label className="block text-sm font-medium">8. Illnesses we must know</label><div className="p-2 bg-white border rounded">{studentData.instruction_8}</div></div>
              <div><label className="block text-sm font-medium">Additional Instructions</label><div className="p-2 bg-white border rounded">{studentData.additionalInstructions}</div></div>
            </div>
          </fieldset>

          {/* Page 3: Designated Guardians */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
            <div className="space-y-4 mt-4">
              {studentData.designatedGuardians.length > 0 ? (
                studentData.designatedGuardians.map((guardian, index) => (
                  <div key={guardian.designatedGuardianID} className="border p-3 rounded">
                    <h4 className="font-medium mb-3">Guardian No. {index + 1}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium">Full Name</label><div className="p-2 bg-white border rounded">{guardian.fullName_of_Guardian || 'N/A'}</div></div>
                      <div><label className="block text-sm font-medium">Relationship</label><div className="p-2 bg-white border rounded">{guardian.relationshipToResident || 'N/A'}</div></div>
                      <div className="sm:col-span-2"><label className="block text-sm font-medium">Address</label><div className="p-2 bg-white border rounded">{guardian.completeAddress || 'N/A'}</div></div>
                      <div><label className="block text-sm font-medium">Contact</label><div className="p-2 bg-white border rounded">{guardian.contactNumber || 'N/A'}</div></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No designated guardians found
                </div>
              )}
            </div>
          </fieldset>

          {/* Page 4: Appliance Declaration */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Appliance Declaration Form</legend>
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2 mb-2 font-medium text-sm">
                <span>Appliance</span><span>Quantity</span><span>Brand</span><span>Serial No.</span>
              </div>
              {studentData.appliances.length > 0 ? (
                studentData.appliances.map((appliance, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2 text-sm">
                    <div className="p-2 bg-white border rounded">{appliance.list_of_appliances?.applianceName || 'Unknown'}</div>
                    <div className="p-2 bg-white border rounded">{appliance.quantity || 'N/A'}</div>
                    <div className="p-2 bg-white border rounded">{appliance.brand || 'N/A'}</div>
                    <div className="p-2 bg-white border rounded">{appliance.serialNo || 'N/A'}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No appliances declared
                </div>
              )}
            </div>
          </fieldset>

          {/* Page 5: Acknowledgement of Accountability Form */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Acknowledgement of Accountability Form</legend>
            <div className="mt-4">
              {studentData.accountabilityForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Room Number</label>
                      <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.roomNumber || 'Not assigned'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Semester</label>
                      <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.semester || 'Not specified'}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Property Numbers Assigned</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium">Room Key</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.roomKey_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Study Table</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.studyTable_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Jalousies</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.jalousies_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Window</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.window_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Bed Foam</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.bedfoam_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Closet</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.closet_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Closet Door Handle</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.ClosetDoorHandle_propertyNumber || 'Not assigned'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Chair</label>
                        <div className="p-2 bg-white border rounded">{studentData.accountabilityForm.chair_propertyNumber || 'Not assigned'}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600">
                      <strong>Form Created:</strong> {new Date(studentData.accountabilityForm.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-lg font-medium">No Accountability Form Found</p>
                  <p className="text-sm">This student has not been assigned room properties yet.</p>
                </div>
              )}
            </div>
          </fieldset>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentFullInfo;