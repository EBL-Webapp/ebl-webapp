import React from 'react';

function StudentFullInfo({ isOpen, onClose, studentNumber }) {
  if (!isOpen) return null;

  // Mock data - in real implementation, this would come from props or API call
  const studentData = {
    semester: "1st Semester 2025",
    name: "Dela Cruz, Juan Carlos",
    sex: "Male",
    age: "20",
    studentId: studentNumber,
    course: "Computer Science",
    yearLevel: "3",
    dob: "2004-05-15",
    pob: "Davao City",
    religion: "Catholic",
    civilStatus: "Single",
    nationality: "Filipino",
    email: "juan.delacruz@up.edu.ph",
    homeAddress: "123 Main Street, Davao City",
    contact: "09123456789",
    // Parent information
    fatherName: "Carlos Dela Cruz",
    fatherOccupation: "Engineer",
    fatherAge: "50",
    fatherBusinessAddress: "ABC Engineering Corp, Davao City",
    fatherContact: "09987654321",
    motherName: "Maria Dela Cruz",
    motherOccupation: "Teacher",
    motherAge: "48",
    motherBusinessAddress: "XYZ Elementary School, Davao City",
    motherContact: "09876543210",
    // Guardian information
    guardianName: "Roberto Santos",
    guardianHomeAddress: "456 Oak Street, Davao City",
    guardianContact: "09555666777",
    guardianBusinessAddress: "Santos Hardware Store",
    stayedBefore: "No",
    previousLocation: "N/A",
    lengthOfStay: "N/A",
    // Signatures (all signed)
    studentSignature_applicationForm: "SIGNED",
    instruction_1: "Every weekend",
    instruction_2: "Only for emergencies",
    instruction_3: true,
    instruction_4: false,
    instruction_5: true,
    instruction_6: true,
    instruction_7: false,
    instruction_8: "None",
    additionalInstructions: "Please notify parents for any medical emergencies.",
    infoParentName: "SIGNED",
    // Guardian information
    guardian1_fullName: "Roberto Santos",
    guardian1_relationship: "Uncle",
    guardian1_address: "456 Oak Street, Davao City",
    guardian1_contact: "09555666777",
    guardian2_fullName: "Elena Martinez",
    guardian2_relationship: "Aunt",
    guardian2_address: "789 Pine Street, Davao City",
    guardian2_contact: "09444555666",
    designatedGuardians_parentSignature: "SIGNED",
    designatedGuardians_studentSignature: "SIGNED",
    // Appliances
    applianceQty_0: "1", // Laptop
    applianceBrand_0: "Dell",
    applianceSerial_0: "DL123456",
    applianceQty_3: "1", // Cellular Phone
    applianceBrand_3: "Samsung",
    applianceSerial_3: "SM789012",
    applianceDeclaration_parentSignature: "SIGNED",
    applianceDeclaration_studentSignature: "SIGNED",
    // Agreement information
    residentName: "Juan Carlos Dela Cruz",
    residentAddress: "123 Main Street, Davao City",
    agreementResidentNameInline: "Juan Carlos Dela Cruz",
    agreementResidentAddressInline: "123 Main Street, Davao City",
    agreementResidentSign: "SIGNED",
    agreementParentSign: "SIGNED",
    privacyNameSign: "SIGNED",
    accommodationFrom: "2025-06-01",
    accommodationUntil: "2025-12-15",
    signatureResident_dormAgreement: "SIGNED",
    signatureParent_dormAgreement: "SIGNED"
  };

  const applianceLabels = [
    'Laptop / Tablet / Desktop', 'Printer / Scanner', 'Electric Fan', 'Cellular Phone',
    'Study Lamp', 'iPod / PSP', 'Chargeable Flashlight', 'Powerbank', 'Pocket Wifi',
    'Camera', 'Nebulizer',
  ];

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
          <div className="bg-green-100 p-4 rounded border border-green-300">
            <p className="text-sm text-green-900">
              <strong>STATUS:</strong> All forms have been completed and signed. Application is ready for processing.
            </p>
          </div>

          {/* Page 1: Student Application & Parent/Guardian Authorization */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold text-lg">Page 1: Dormitory Application</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div><label className="block text-sm font-medium">Semester</label><div className="p-2 bg-white border rounded">{studentData.semester}</div></div>
              <div><label className="block text-sm font-medium">Full Name</label><div className="p-2 bg-white border rounded">{studentData.name}</div></div>
              <div><label className="block text-sm font-medium">Sex</label><div className="p-2 bg-white border rounded">{studentData.sex}</div></div>
              <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.age}</div></div>
              <div><label className="block text-sm font-medium">Student ID No.</label><div className="p-2 bg-white border rounded">{studentData.studentId}</div></div>
              <div><label className="block text-sm font-medium">Course</label><div className="p-2 bg-white border rounded">{studentData.course}</div></div>
              <div><label className="block text-sm font-medium">Year Level</label><div className="p-2 bg-white border rounded">{studentData.yearLevel}</div></div>
              <div><label className="block text-sm font-medium">Date of Birth</label><div className="p-2 bg-white border rounded">{studentData.dob}</div></div>
              <div><label className="block text-sm font-medium">Place of Birth</label><div className="p-2 bg-white border rounded">{studentData.pob}</div></div>
              <div><label className="block text-sm font-medium">Religion</label><div className="p-2 bg-white border rounded">{studentData.religion}</div></div>
              <div><label className="block text-sm font-medium">Civil Status</label><div className="p-2 bg-white border rounded">{studentData.civilStatus}</div></div>
              <div><label className="block text-sm font-medium">Nationality</label><div className="p-2 bg-white border rounded">{studentData.nationality}</div></div>
              <div><label className="block text-sm font-medium">E-mail Address</label><div className="p-2 bg-white border rounded">{studentData.email}</div></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium">Home Address</label><div className="p-2 bg-white border rounded">{studentData.homeAddress}</div></div>
              <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.contact}</div></div>
            </div>
            
            <hr className="my-4" />
            
            {/* Parent/Guardian Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Parent/Guardian Authorization</h4>
              
              {/* Father */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md">
                <div><label className="block text-sm font-medium">Name of Father</label><div className="p-2 bg-white border rounded">{studentData.fatherName}</div></div>
                <div><label className="block text-sm font-medium">Occupation</label><div className="p-2 bg-white border rounded">{studentData.fatherOccupation}</div></div>
                <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.fatherAge}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.fatherBusinessAddress}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.fatherContact}</div></div>
              </div>
              
              {/* Mother */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md">
                <div><label className="block text-sm font-medium">Name of Mother</label><div className="p-2 bg-white border rounded">{studentData.motherName}</div></div>
                <div><label className="block text-sm font-medium">Occupation</label><div className="p-2 bg-white border rounded">{studentData.motherOccupation}</div></div>
                <div><label className="block text-sm font-medium">Age</label><div className="p-2 bg-white border rounded">{studentData.motherAge}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.motherBusinessAddress}</div></div>
                <div className="sm:col-span-2"><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.motherContact}</div></div>
              </div>
              
              {/* Guardian in Davao */}
              <div className="space-y-4 border-gray-400 border-2 p-2 rounded-md">
                <h5 className="font-medium">Guardian in Davao City</h5>
                <div><label className="block text-sm font-medium">Name</label><div className="p-2 bg-white border rounded">{studentData.guardianName}</div></div>
                <div><label className="block text-sm font-medium">Home Address</label><div className="p-2 bg-white border rounded">{studentData.guardianHomeAddress}</div></div>
                <div><label className="block text-sm font-medium">Contact No.</label><div className="p-2 bg-white border rounded">{studentData.guardianContact}</div></div>
                <div><label className="block text-sm font-medium">Business Address</label><div className="p-2 bg-white border rounded">{studentData.guardianBusinessAddress}</div></div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium">Previous Dormitory Experience</h5>
                <div><label className="block text-sm font-medium">Stayed in dormitory before?</label><div className="p-2 bg-white border rounded">{studentData.stayedBefore}</div></div>
                <div><label className="block text-sm font-medium">Length of Stay</label><div className="p-2 bg-white border rounded">{studentData.lengthOfStay}</div></div>
                <div><label className="block text-sm font-medium">Where?</label><div className="p-2 bg-white border rounded">{studentData.previousLocation}</div></div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium">Student Signature (Application Form)</label>
                <div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.studentSignature_applicationForm}</div>
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
              
              <div className="mt-4">
                <label className="block text-sm font-medium">Parent's Signature</label>
                <div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.infoParentName}</div>
              </div>
            </div>
          </fieldset>

          {/* Page 3: Designated Guardians */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
            <div className="space-y-4 mt-4">
              {[1, 2].map((n) => (
                <div key={n} className="border p-3 rounded">
                  <h4 className="font-medium mb-3">Guardian No. {n}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Full Name</label><div className="p-2 bg-white border rounded">{studentData[`guardian${n}_fullName`] || 'N/A'}</div></div>
                    <div><label className="block text-sm font-medium">Relationship</label><div className="p-2 bg-white border rounded">{studentData[`guardian${n}_relationship`] || 'N/A'}</div></div>
                    <div className="sm:col-span-2"><label className="block text-sm font-medium">Address</label><div className="p-2 bg-white border rounded">{studentData[`guardian${n}_address`] || 'N/A'}</div></div>
                    <div><label className="block text-sm font-medium">Contact</label><div className="p-2 bg-white border rounded">{studentData[`guardian${n}_contact`] || 'N/A'}</div></div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div><label className="block text-sm font-medium">Parent's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.designatedGuardians_parentSignature}</div></div>
                <div><label className="block text-sm font-medium">Student's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.designatedGuardians_studentSignature}</div></div>
              </div>
            </div>
          </fieldset>

          {/* Page 4: Appliance Declaration */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Appliance Declaration Form</legend>
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2 mb-2 font-medium text-sm">
                <span>Appliance</span><span>Quantity</span><span>Brand</span><span>Serial No.</span>
              </div>
              {applianceLabels.map((label, i) => {
                const qty = studentData[`applianceQty_${i}`];
                const brand = studentData[`applianceBrand_${i}`];
                const serial = studentData[`applianceSerial_${i}`];
                
                if (!qty) return null;
                
                return (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2 text-sm">
                    <div className="p-2 bg-white border rounded">{label}</div>
                    <div className="p-2 bg-white border rounded">{qty}</div>
                    <div className="p-2 bg-white border rounded">{brand || 'N/A'}</div>
                    <div className="p-2 bg-white border rounded">{serial || 'N/A'}</div>
                  </div>
                );
              })}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div><label className="block text-sm font-medium">Parent's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.applianceDeclaration_parentSignature}</div></div>
                <div><label className="block text-sm font-medium">Student's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.applianceDeclaration_studentSignature}</div></div>
              </div>
            </div>
          </fieldset>

          {/* Page 5-6: Dormitory Agreement */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Dormitory Agreement</legend>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Name of Resident</label><div className="p-2 bg-white border rounded">{studentData.residentName}</div></div>
                <div><label className="block text-sm font-medium">Address</label><div className="p-2 bg-white border rounded">{studentData.residentAddress}</div></div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded border">
                <p className="text-sm">
                  Agreement acknowledged and signed by: <strong>{studentData.agreementResidentNameInline}</strong> of <strong>{studentData.agreementResidentAddressInline}</strong>
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Student's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.agreementResidentSign}</div></div>
                <div><label className="block text-sm font-medium">Parent's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.agreementParentSign}</div></div>
              </div>
            </div>
          </fieldset>

          {/* Page 7: Privacy Notice */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Privacy Notice Acknowledgement</legend>
            <div className="mt-4">
              <p className="text-sm mb-4 p-3 bg-blue-50 rounded">
                Student acknowledges reading and understanding the University of the Philippines' Privacy Notice for Students and consents to the processing of personal and sensitive personal information.
              </p>
              <div><label className="block text-sm font-medium">Student's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.privacyNameSign}</div></div>
            </div>
          </fieldset>

          {/* Page 8: Accommodation Agreement */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="font-semibold">Accommodation Agreement</legend>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Accommodation From</label><div className="p-2 bg-white border rounded">{studentData.accommodationFrom}</div></div>
                <div><label className="block text-sm font-medium">Accommodation Until</label><div className="p-2 bg-white border rounded">{studentData.accommodationUntil}</div></div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded border">
                <p className="text-sm">
                  Student pledges to abide by all dormitory rules, regulations, and University policies during the accommodation period.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Student's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.signatureResident_dormAgreement}</div></div>
                <div><label className="block text-sm font-medium">Parent's Signature</label><div className="p-2 bg-green-100 border rounded text-green-800 font-semibold">{studentData.signatureParent_dormAgreement}</div></div>
              </div>
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