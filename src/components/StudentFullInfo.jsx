import React, { useState, useEffect } from 'react';
import supabase from '../supabase_client';

function StudentFullInfo({ isOpen, onClose, studentNumber }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && studentNumber) {
      fetchStudentData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, studentNumber]);

  const fetchStudentData = async () => {
    setLoading(true);
    setError(null);
    setIsEditing(false);
    
    try {
      const { data: studentInfo, error: studentError } = await supabase
        .from('Students')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      if (studentError) throw studentError;

      const { data: applicationData } = await supabase
        .from('Application_for_Dorm_Accomodation')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      const { data: instructionData } = await supabase
        .from('Information_and_Instruction_Sheet')
        .select('*')
        .eq('studentNumber', studentNumber)
        .single();

      const { data: guardians } = await supabase
        .from('Designated_Guardians')
        .select('*')
        .eq('studentNumber', studentNumber);

      const { data: guardianInfo } = await supabase
        .from('guardianInformation')
        .select('*')
        .eq('studentNumber', studentNumber);

      const { data: appliances } = await supabase
        .from('appliance_per_student')
        .select(`*, list_of_appliances(applianceName)`)
        .eq('studentNumber', studentNumber)
        .eq('isActive', true);

      const { data: accountabilityData } = await supabase
        .from('Acknowledgemet_of_Accountability_Form')
        .select('*')
        .eq('studentNumber', studentNumber)
        .eq('isArchived', false)
        .order('timestamp', { ascending: false })
        .limit(1);

      const father = guardianInfo?.find(g => g.guardianType?.toLowerCase().includes('father'));
      const mother = guardianInfo?.find(g => g.guardianType?.toLowerCase().includes('mother'));
      const guardian = guardianInfo?.find(g => g.guardianType?.toLowerCase().includes('guardian') ||
        (!g.guardianType?.toLowerCase().includes('father') && !g.guardianType?.toLowerCase().includes('mother')));

      setStudentData({
        // IDs for updating (not shown in form)
        _instructionDataStudentNumber: instructionData?.studentNumber || null,

        studentNumber: studentInfo?.studentNumber || '',
        studentName: studentInfo?.studentName || applicationData?.studentName || '',

        // Application fields
        semester: applicationData?.semester_of_admissionYear || '',
        admissionYear: applicationData?.admissionYear || '',
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
        isStayedInAnyDormitory: applicationData?.isStayedInAnyDormitory ?? false,
        lengthOfStay: applicationData?.lengthOfStay || '',
        whereStayed: applicationData?.whereStayed || '',

        // Parent/Guardian info
        father_id: father?.guardianID || null,
        fatherName: father?.Name || '',
        fatherOccupation: father?.Occupation || '',
        fatherAge: father?.Age?.toString() || '',
        fatherAddress: father?.businessAddress_or_employmentAddress || '',
        fatherContact: father?.contactNumber || '',

        mother_id: mother?.guardianID || null,
        motherName: mother?.Name || '',
        motherOccupation: mother?.Occupation || '',
        motherAge: mother?.Age?.toString() || '',
        motherAddress: mother?.businessAddress_or_employmentAddress || '',
        motherContact: mother?.contactNumber || '',

        guardian_id: guardian?.guardianID || null,
        guardianName: guardian?.Name || '',
        guardianAddress: guardian?.businessAddress_or_employmentAddress || '',
        guardianContact: guardian?.contactNumber || '',

        // Instruction sheet
        instruction_1: instructionData?.Allowed_ToGoHomeInWeekends || '',
        instruction_2: instructionData?.Allowed_ToGoHomeInWeekdays || '',
        instruction_3: instructionData?.isAllowed_WeekendsWithRelatives_or_guardians || false,
        instruction_4: instructionData?.isAllowed_spendOvernightWithFriends_or_dormmates || false,
        instruction_5: instructionData?.isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions || false,
        instruction_6: instructionData?.isAllowed_joinOrganizations || false,
        instruction_7: instructionData?.isAllowed_joinDemonstrations_or_rallies || false,
        instruction_8: instructionData?.whatIllnesses || '',
        additionalInstructions: instructionData?.otherAdditionalInstruction || '',

        // Designated guardians (read-only for now)
        designatedGuardians: guardians || [],
        appliances: appliances || [],
        accountabilityForm: accountabilityData?.length > 0 ? accountabilityData[0] : null,
      });
    } catch (err) {
      console.error('Error fetching student data:', err);
      setError('Failed to load student information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // 1. Update Students table
      const { error: e1 } = await supabase
        .from('Students')
        .update({ studentName: studentData.studentName })
        .eq('studentNumber', studentNumber);
      if (e1) throw new Error('Students: ' + e1.message);

      // 2. Update Application_for_Dorm_Accomodation
      const { error: e2 } = await supabase
        .from('Application_for_Dorm_Accomodation')
        .update({
          studentName: studentData.studentName,
          semester_of_admissionYear: studentData.semester,
          admissionYear: studentData.admissionYear,
          Sex: studentData.sex,
          Age: studentData.age ? parseInt(studentData.age, 10) : null,
          Course: studentData.course,
          yearLevel: studentData.yearLevel ? parseInt(studentData.yearLevel, 10) : null,
          dateOfBirth: studentData.dateOfBirth || null,
          placeOfBirth: studentData.placeOfBirth,
          religion: studentData.religion,
          civilStatus: studentData.civilStatus,
          nationality: studentData.nationality,
          emailAddress: studentData.emailAddress,
          homeAddress: studentData.homeAddress,
          contactNo: studentData.contactNo,
          isStayedInAnyDormitory: studentData.isStayedInAnyDormitory,
          lengthOfStay: studentData.lengthOfStay,
          whereStayed: studentData.whereStayed,
        })
        .eq('studentNumber', studentNumber);
      if (e2) throw new Error('Application: ' + e2.message);

      // 3. Update Information_and_Instruction_Sheet
      const { error: e3 } = await supabase
        .from('Information_and_Instruction_Sheet')
        .update({
          Allowed_ToGoHomeInWeekends: studentData.instruction_1,
          Allowed_ToGoHomeInWeekdays: studentData.instruction_2,
          isAllowed_WeekendsWithRelatives_or_guardians: studentData.instruction_3,
          isAllowed_spendOvernightWithFriends_or_dormmates: studentData.instruction_4,
          isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions: studentData.instruction_5,
          isAllowed_joinOrganizations: studentData.instruction_6,
          isAllowed_joinDemonstrations_or_rallies: studentData.instruction_7,
          whatIllnesses: studentData.instruction_8,
          otherAdditionalInstruction: studentData.additionalInstructions,
        })
        .eq('studentNumber', studentNumber);
      if (e3) throw new Error('Instruction Sheet: ' + e3.message);

      // 4. Update guardianInformation (father, mother, guardian in Davao)
      const guardianUpdates = [
        { id: studentData.father_id, type: 'father', data: { Name: studentData.fatherName, Occupation: studentData.fatherOccupation, Age: studentData.fatherAge ? parseInt(studentData.fatherAge, 10) : null, businessAddress_or_employmentAddress: studentData.fatherAddress, contactNumber: studentData.fatherContact } },
        { id: studentData.mother_id, type: 'mother', data: { Name: studentData.motherName, Occupation: studentData.motherOccupation, Age: studentData.motherAge ? parseInt(studentData.motherAge, 10) : null, businessAddress_or_employmentAddress: studentData.motherAddress, contactNumber: studentData.motherContact } },
        { id: studentData.guardian_id, type: 'guardian', data: { Name: studentData.guardianName, businessAddress_or_employmentAddress: studentData.guardianAddress, contactNumber: studentData.guardianContact } },
      ];

      for (const g of guardianUpdates) {
        if (g.id) {
          const { error: ge } = await supabase
            .from('guardianInformation')
            .update(g.data)
            .eq('guardianID', g.id);
          if (ge) throw new Error(`Guardian (${g.type}): ` + ge.message);
        }
      }

      setIsEditing(false);
      alert('Student information saved successfully!');
    } catch (err) {
      console.error('Error saving student data:', err);
      alert('Error saving: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper: renders a field as text (view) or input (edit)
  const Field = ({ label, field, type = 'text', className = '', colSpan = '' }) => (
    <div className={colSpan}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={studentData[field] || ''}
          onChange={e => handleChange(field, e.target.value)}
          className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      ) : (
        <div className="p-2 bg-white border rounded text-gray-800">{studentData[field] || 'Not provided'}</div>
      )}
    </div>
  );

  const CheckboxField = ({ label, field }) => (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <input
          type="checkbox"
          checked={!!studentData[field]}
          onChange={e => handleChange(field, e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
      ) : (
        <div className={`w-4 h-4 border rounded ${studentData[field] ? 'bg-green-500' : 'bg-white'}`} />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );

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
              <button onClick={fetchStudentData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry</button>
              <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
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
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-semibold">Student Full Information — {studentNumber}</h2>
            {isEditing && <p className="text-xs text-blue-600 mt-0.5 font-medium">✏️ Edit Mode — changes are not saved until you click "Save Changes"</p>}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                ✏️ Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); fetchStudentData(); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold ml-2">×</button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Page 1: Student Application */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold text-lg">Page 1: Dormitory Application</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Field label="Semester" field="semester" />
              <Field label="Full Name" field="studentName" />
              <div>
                <label className="block text-sm font-medium mb-1">Sex</label>
                {isEditing ? (
                  <select
                    value={studentData.sex}
                    onChange={e => handleChange('sex', e.target.value)}
                    className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <div className="p-2 bg-white border rounded">{studentData.sex || 'Not specified'}</div>
                )}
              </div>
              <Field label="Age" field="age" type="number" />
              <div>
                <label className="block text-sm font-medium mb-1">Student ID No.</label>
                <div className="p-2 bg-white border rounded text-gray-500">{studentData.studentNumber}</div>
              </div>
              <Field label="Course" field="course" />
              <Field label="Year Level" field="yearLevel" type="number" />
              <Field label="Date of Birth" field="dateOfBirth" type="date" />
              <Field label="Place of Birth" field="placeOfBirth" />
              <Field label="Religion" field="religion" />
              <Field label="Civil Status" field="civilStatus" />
              <Field label="Nationality" field="nationality" />
              <Field label="E-mail Address" field="emailAddress" type="email" />
              <Field label="Home Address" field="homeAddress" colSpan="sm:col-span-2" />
              <Field label="Contact No." field="contactNo" colSpan="sm:col-span-2" />
            </div>

            <hr className="my-4" />

            {/* Parent/Guardian info */}
            <div className="space-y-4">
              <h4 className="font-semibold">Parent/Guardian Authorization</h4>

              {/* Father */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-3 rounded-md">
                <p className="sm:col-span-2 font-medium text-sm text-gray-600">Father</p>
                <Field label="Name of Father" field="fatherName" />
                <Field label="Occupation" field="fatherOccupation" />
                <Field label="Age" field="fatherAge" type="number" />
                <Field label="Business Address" field="fatherAddress" colSpan="sm:col-span-2" />
                <Field label="Contact No." field="fatherContact" colSpan="sm:col-span-2" />
              </div>

              {/* Mother */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-3 rounded-md">
                <p className="sm:col-span-2 font-medium text-sm text-gray-600">Mother</p>
                <Field label="Name of Mother" field="motherName" />
                <Field label="Occupation" field="motherOccupation" />
                <Field label="Age" field="motherAge" type="number" />
                <Field label="Business Address" field="motherAddress" colSpan="sm:col-span-2" />
                <Field label="Contact No." field="motherContact" colSpan="sm:col-span-2" />
              </div>

              {/* Guardian in Davao */}
              <div className="space-y-3 border-gray-400 border-2 p-3 rounded-md">
                <h5 className="font-medium">Guardian in Davao City (if any)</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" field="guardianName" />
                  <Field label="Contact No." field="guardianContact" />
                  <Field label="Business Address" field="guardianAddress" colSpan="sm:col-span-2" />
                </div>
              </div>

              {/* Previous dormitory experience */}
              <div className="space-y-3">
                <h5 className="font-medium">Have you stayed in any dormitory before?</h5>
                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" checked={studentData.isStayedInAnyDormitory === true} onChange={() => handleChange('isStayedInAnyDormitory', true)} /> Yes
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" checked={studentData.isStayedInAnyDormitory === false} onChange={() => handleChange('isStayedInAnyDormitory', false)} /> No
                      </label>
                    </>
                  ) : (
                    <div className="p-2 bg-white border rounded">{studentData.isStayedInAnyDormitory ? 'Yes' : 'No'}</div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Length of Stay" field="lengthOfStay" />
                  <Field label="Where?" field="whereStayed" />
                </div>
              </div>
            </div>
          </fieldset>

          {/* Page 2: Instruction Sheet */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Information and Instruction Sheet (For Parents/Guardian)</legend>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">1. Go home on weekends? If so, how often</label>
                {isEditing ? (
                  <input type="text" value={studentData.instruction_1} onChange={e => handleChange('instruction_1', e.target.value)} className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                ) : (
                  <div className="p-2 bg-white border rounded">{studentData.instruction_1 || 'Not specified'}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">2. Go home on weekdays? When?</label>
                {isEditing ? (
                  <input type="text" value={studentData.instruction_2} onChange={e => handleChange('instruction_2', e.target.value)} className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                ) : (
                  <div className="p-2 bg-white border rounded">{studentData.instruction_2 || 'Not specified'}</div>
                )}
              </div>
              <div className="space-y-2">
                <CheckboxField label="3. Spend overnight/weekends with relatives and/or guardians" field="instruction_3" />
                <CheckboxField label="4. Spend overnight with friends or dormmates" field="instruction_4" />
                <CheckboxField label="5. Join school-related field trips/picnics/excursions" field="instruction_5" />
                <CheckboxField label="6. Join organizations/fraternities/sororities" field="instruction_6" />
                <CheckboxField label="7. Join demonstrations or rallies" field="instruction_7" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">8. Illnesses we must know</label>
                {isEditing ? (
                  <input type="text" value={studentData.instruction_8} onChange={e => handleChange('instruction_8', e.target.value)} className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                ) : (
                  <div className="p-2 bg-white border rounded">{studentData.instruction_8 || 'None'}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Instructions</label>
                {isEditing ? (
                  <textarea rows={3} value={studentData.additionalInstructions} onChange={e => handleChange('additionalInstructions', e.target.value)} className="p-2 bg-white border rounded w-full border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                ) : (
                  <div className="p-2 bg-white border rounded">{studentData.additionalInstructions || 'None'}</div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Page 3: Designated Guardians (read-only) */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
            <div className="space-y-4 mt-4">
              {studentData.designatedGuardians.length > 0 ? (
                studentData.designatedGuardians.map((g, index) => (
                  <div key={g.designatedGuardianID} className="border p-3 rounded">
                    <h4 className="font-medium mb-3">Guardian No. {index + 1}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium">Full Name</label><div className="p-2 bg-white border rounded">{g.fullName_of_Guardian || 'N/A'}</div></div>
                      <div><label className="block text-sm font-medium">Relationship</label><div className="p-2 bg-white border rounded">{g.relationshipToResident || 'N/A'}</div></div>
                      <div className="sm:col-span-2"><label className="block text-sm font-medium">Address</label><div className="p-2 bg-white border rounded">{g.completeAddress || 'N/A'}</div></div>
                      <div><label className="block text-sm font-medium">Contact</label><div className="p-2 bg-white border rounded">{g.contactNumber || 'N/A'}</div></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No designated guardians found</div>
              )}
            </div>
          </fieldset>

          {/* Page 4: Appliance Declaration (read-only) */}
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
                <div className="text-center py-4 text-gray-500">No appliances declared</div>
              )}
            </div>
          </fieldset>

          {/* Page 5: Accountability Form */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Acknowledgement of Accountability Form</legend>
            <div className="mt-4">
              {studentData.accountabilityForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Room Number</label><div className="p-2 bg-white border rounded">{studentData.accountabilityForm.roomNumber || 'Not assigned'}</div></div>
                    <div><label className="block text-sm font-medium">Semester</label><div className="p-2 bg-white border rounded">{studentData.accountabilityForm.semester || 'Not specified'}</div></div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-4">Property Numbers Assigned</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['roomKey_propertyNumber', 'studyTable_propertyNumber', 'jalousies_propertyNumber', 'window_propertyNumber', 'bedfoam_propertyNumber', 'closet_propertyNumber', 'ClosetDoorHandle_propertyNumber', 'chair_propertyNumber'].map(key => (
                        <div key={key}><label className="block text-sm font-medium capitalize">{key.replace('_propertyNumber', '').replace(/([A-Z])/g, ' $1').trim()}</label><div className="p-2 bg-white border rounded">{studentData.accountabilityForm[key] || 'Not assigned'}</div></div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4 text-sm text-gray-600">
                    <strong>Form Created:</strong> {new Date(studentData.accountabilityForm.timestamp).toLocaleString()}
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
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
          {isEditing && (
            <>
              <button
                type="button"
                onClick={() => { setIsEditing(false); fetchStudentData(); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </>
          )}
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