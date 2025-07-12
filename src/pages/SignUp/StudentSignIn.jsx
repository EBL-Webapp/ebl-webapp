import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase_client';

function StudentSignIn() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({});

  // Load saved form data and session on component mount
  useEffect(() => {
    // Attempt to load form data from localStorage
    const savedFormData = localStorage.getItem("dormApplicationFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        console.log("Restored form data from localStorage");
      } catch (e) {
        console.error("Error parsing saved form data from localStorage", e);
      }
    }
    
    // Get session from Supabase
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.log("Error getting session: ", error.message);
        return;
      }
      setSession(session);
      console.log("Session retrieved:", session);
    }
    
    getSession();
  }, []); // Empty dependency array ensures this runs only once on mount

  const applianceMap = [
    1,  // Laptop / Tablet / Desktop            → Personal Computer/Laptop (ID 1)
    7,  // Printer / Scanner                    → Printer/Scanner (ID 7)
    4,  // Electric Fan                         → Electric Fan (ID 4)
    6,  // Cellular Phone                       → Cellphone With Charger (ID 6)
    5,  // Study Lamp                           → Study Lamp (ID 5)
    3,  // iPod / PSP                           → MP3/MP4/IPOD/PSP (ID 3)
    8,  // Chargeable Flashlight                → Chargeable Flashlight (ID 8)
    9,  // Powerbank                            → Powerbank (ID 9)
    10, // Pocket Wifi                          → Pocket Wifi (ID 10)
    11, // Camera                               → Camera (ID 11)
    12, // Nebulizer                            → Nebulizer (ID 12)
  ];

  // Handles changes to form inputs and saves data to localStorage
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newData);
    
    // Save to localStorage every time a field changes
    localStorage.setItem("dormApplicationFormData", JSON.stringify(newData));
    
    // Keep debug copy for troubleshooting if needed
    localStorage.setItem("debugFormData", JSON.stringify(newData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Fetch the current session directly within handleSubmit to ensure it's up-to-date
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    
    // Log the current session after it's been fetched
    console.log("Current session:", currentSession);

    if (sessionError || !currentSession || !currentSession.user) {
        console.error("No active session or user found:", sessionError?.message);
        navigate("/");
        return;
    }

    try {
        // Insert into Students table
        // Changed: Added 'email' field here
        const { error: insertionError } = await supabase
            .from('Students')
            .insert([{
                'userID': currentSession.user.id,
                'studentNumber': formData.studentId,
                'studentName': formData.name,
                'email': formData.email, // Email address is now saved in the Students table
            }]);

        if (insertionError) {
            console.error("Error inserting into Students table: ", insertionError.message);
            return;
        }

        // Insert into Application_for_Dorm_Accomodation table
        // Changed: Removed 'emailAddress' from here
        const { error: error_Application_for_Dorm_Accomodation } = await supabase
            .from("Application_for_Dorm_Accomodation")
            .insert([{
                "admissionYear": formData.semester,
                "semester_of_admissionYear": formData.semester,
                "studentNumber": formData.studentId,
                "studentName": formData.name,
                "Sex": formData.sex,
                "Age": formData.age ? parseInt(formData.age, 10) : null,
                "Course": formData.course,
                "yearLevel": formData.yearLevel ? parseInt(formData.yearLevel, 10) : null,
                "dateOfBirth": formData.dob,
                "placeOfBirth": formData.pob,
                "religion": formData.religion,
                "civilStatus": formData.civilStatus,
                "nationality": formData.nationality,
                // "emailAddress": formData.email, // This line has been removed
                "homeAddress": formData.homeAddress,
                "contactNo": formData.contact,
                "isStayedInAnyDormitory": formData.stayedBefore === "yes",
                "whereStayed": formData.previousLocation,
                "lengthOfStay": formData.lengthOfStay,
            }]);

        if (error_Application_for_Dorm_Accomodation) {
            console.error("Error inserting into Application_for_Dorm_Accomodation: ", error_Application_for_Dorm_Accomodation.message);
            return;
        }

        // Insert Father only if name is not empty
        if (formData.fatherName?.trim()) {
            const { error: error_insertingFather } = await supabase
                .from("guardianInformation")
                .insert([{
                    studentNumber: formData.studentId,
                    guardianType: "father",
                    Name: formData.fatherName,
                    Occupation: formData.fatherOccupation,
                    Age: formData.fatherAge ? parseInt(formData.fatherAge, 10) : null,
                    businessAddress_or_employmentAddress: formData.fatherBusinessAddress,
                    contactNumber: formData.fatherContact
                }]);

            if (error_insertingFather) {
                console.error("Error inserting father: ", error_insertingFather.message);
                return;
            }
        }

        // Insert Mother only if name is not empty
        if (formData.motherName?.trim()) {
            const { error: error_insertingMother } = await supabase
                .from("guardianInformation")
                .insert([{
                    studentNumber: formData.studentId,
                    guardianType: "mother",
                    Name: formData.motherName,
                    Occupation: formData.motherOccupation,
                    Age: formData.motherAge ? parseInt(formData.motherAge, 10) : null,
                    businessAddress_or_employmentAddress: formData.motherBusinessAddress,
                    contactNumber: formData.motherContact
                }]);

            if (error_insertingMother) {
                console.error("Error inserting mother:", error_insertingMother.message);
                return;
            }
        }

        // Insert Davao Guardian only if name is not empty
        if (formData.guardianName?.trim()) {
            const { error: error_insertingGuardianDavao } = await supabase
                .from("guardianInformation")
                .insert([{
                    studentNumber: formData.studentId,
                    guardianType: "guardian",
                    Name: formData.guardianName,
                    contactNumber: formData.guardianContact,
                    businessAddress_or_employmentAddress: formData.guardianBusinessAddress
                }]);

            if (error_insertingGuardianDavao) {
                console.error("Error inserting guardian:", error_insertingGuardianDavao.message);
                return;
            }
        }

        // Insert Information and Instruction Sheet
        const { error: error_insertingInformationAndInstructionSheet } = await supabase
            .from("Information_and_Instruction_Sheet")
            .insert([{
                "isAllowed_WeekendsWithRelatives_or_guardians": formData.instruction_3 || false,
                "isAllowed_spendOvernightWithFriends_or_dormmates": formData.instruction_4 || false,
                "isAllowed_joinOrganizations": formData.instruction_6 || false,
                "isAllowed_joinDemonstrations_or_rallies": formData.instruction_7 || false,
                "whatIllnesses": formData.instruction_8,
                "otherAdditionalInstruction": formData.additionalInstructions,
                "Allowed_ToGoHomeInWeekends": formData.instruction_1,
                "Allowed_ToGoHomeInWeekdays": formData.instruction_2,
                "isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions": formData.instruction_5 || false,
                "studentNumber": formData.studentId,
            }]);

        if (error_insertingInformationAndInstructionSheet) {
            console.error("Error inserting Information and Instruction Sheet", error_insertingInformationAndInstructionSheet.message);
            return;
        }

        // Insert Designated Guardians
        if (formData.guardian1_fullName?.trim()) {
            const { error: error_insertingGuardian1 } = await supabase
                .from("Designated_Guardians")
                .insert([{
                    studentNumber: formData.studentId,
                    fullName_of_Guardian: formData.guardian1_fullName,
                    relationshipToResident: formData.guardian1_relationship,
                    completeAddress: formData.guardian1_address,
                    contactNumber: formData.guardian1_contact
                }]);

            if (error_insertingGuardian1) {
                console.error("Error inserting guardian1: ", error_insertingGuardian1.message);
                return;
            }
        }

        if (formData.guardian2_fullName?.trim()) {
            const { error: error_insertingGuardian2 } = await supabase
                .from("Designated_Guardians")
                .insert([{
                    studentNumber: formData.studentId,
                    fullName_of_Guardian: formData.guardian2_fullName,
                    relationshipToResident: formData.guardian2_relationship,
                    completeAddress: formData.guardian2_address,
                    contactNumber: formData.guardian2_contact
                }]);

            if (error_insertingGuardian2) {
                console.error("Error inserting guardian2: ", error_insertingGuardian2.message);
                return;
            }
        }

        // Insert Appliances
        const studentNumber = formData.studentId;
        const rowsToInsert = [];
        
        for (let i = 0; i < applianceMap.length; i++) {
            const qty = formData[`applianceQty_${i}`];
            const brand = formData[`applianceBrand_${i}`];
            const serial = formData[`applianceSerial_${i}`];

            if (!qty || qty === "0") continue;

            rowsToInsert.push({
                applianceID: applianceMap[i],
                studentNumber,
                quantity: parseInt(qty, 10),
                brand: brand || null,
                serialNo: serial || null,
                isActive: true,
            });
        }

        if (rowsToInsert.length > 0) {
            const { error } = await supabase
                .from('appliance_per_student')
                .insert(rowsToInsert);

            if (error) {
                console.error('Insert appliances failed:', error);
                return;
            } else {
                console.log('Inserted appliance rows successfully');
            }
        } else {
            console.log('No appliances to declare.');
        }

        // Insert Signatures with corrected field mappings
        const signatures = [
            { // Privacy Notice
                userID: currentSession.user.id,
                formName: "Privacy Form",
                isAgreed: formData.privacyNameSign,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Application Form
                userID: currentSession.user.id,
                formName: "Application Form",
                isAgreed: formData.studentSignature_applicationForm,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Information and Instruction Sheet
                userID: currentSession.user.id,
                formName: "Information and Instruction Sheet",
                isAgreed: formData.infoParentName,
                role: "parent",
                expirationDate: formData.accommodationUntil
            },
            { // Designated Guardians - Student
                userID: currentSession.user.id,
                formName: "Designated Guardians",
                isAgreed: formData.designatedGuardians_studentSignature,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Designated Guardians - Parent
                userID: currentSession.user.id,
                formName: "Designated Guardians",
                isAgreed: formData.designatedGuardians_parentSignature,
                role: "parent",
                expirationDate: formData.accommodationUntil
            },
            { // Appliance Declaration - Parent
                userID: currentSession.user.id,
                formName: "Appliance Declaration",
                isAgreed: formData.applianceDeclaration_parentSignature,
                role: "parent",
                expirationDate: formData.accommodationUntil
            },
            { // Appliance Declaration - Student
                userID: currentSession.user.id,
                formName: "Appliance Declaration",
                isAgreed: formData.applianceDeclaration_studentSignature,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Dormitory Agreement 1 - Student
                userID: currentSession.user.id,
                formName: "Dormitory Agreement 1",
                isAgreed: formData.agreementResidentSign,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Dormitory Agreement 1 - Parent
                userID: currentSession.user.id,
                formName: "Dormitory Agreement 1",
                isAgreed: formData.agreementParentSign,
                role: "parent",
                expirationDate: formData.accommodationUntil
            },
            { // Dormitory Agreement 2 - Student
                userID: currentSession.user.id,
                formName: "Dormitory Agreement 2",
                isAgreed: formData.signatureResident_dormAgreement,
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            { // Dormitory Agreement 2 - Parent
                userID: currentSession.user.id,
                formName: "Dormitory Agreement 2",
                isAgreed: formData.signatureParent_dormAgreement,
                role: "parent",
                expirationDate: formData.accommodationUntil
            },
        ];

        const { error: error_insertingSignatures } = await supabase.from("signatureTable").insert(signatures);

        if (error_insertingSignatures) {
            console.error("Error inserting signatures: ", error_insertingSignatures.message);
            return;
        }

        // Clear saved form data after successful submission
        localStorage.removeItem("dormApplicationFormData");
        localStorage.removeItem("debugFormData");
        console.log("Form submitted successfully, cleared saved data");

        navigate('/NoUpdate');

    } catch (error) {
        console.error("Unexpected error during form submission:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-4xl zain-regular mx-auto bg-white text-black">

          {/* Prompt for users */}
          <div className="bg-blue-100 p-4 rounded border border-blue-300">
            <p className="text-sm text-blue-900">
              <strong>NOTE:</strong> This application form is required for students requesting dormitory accommodation. Please complete all sections legibly and honestly. Fields marked with * are mandatory.
            </p>
          </div>

      {/* Page 1: Student Application & Parent/Guardian Authorization */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold text-lg">Page 1: Dormitory Application</legend>
        <p className="text-sm mb-4 text-gray-600">
          Provide your personal and parental information below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Student Info */}
          <div><label className="block text-sm">* Semester</label><input name="semester" type='text' required onChange={handleChange} placeholder='1, 2, or summer' className="border rounded p-2 w-full" value={formData.semester || ''} /></div>
          <div><label className="block text-sm">* Full Name</label><input name="name" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="Surname, First Name, Middle Name" value={formData.name || ''} /></div>
          <div><label className="block text-sm">* Sex</label><select name="sex" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.sex || ''}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="block text-sm">* Age</label><input type="number" name="age" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.age || ''} /></div>
          <div><label className="block text-sm">* Student's ID No.</label><input name="studentId" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.studentId || ''} /></div>
          <div><label className="block text-sm">* Course</label><input name="course" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.course || ''} /></div>
          <div><label className="block text-sm">* Year Level</label><input type="number" name="yearLevel" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.yearLevel || ''} /></div>
          <div><label className="block text-sm">* Date of Birth</label><input type="date" name="dob" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.dob || ''} /></div>
          <div><label className="block text-sm">* Place of Birth</label><input name="pob" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.pob || ''} /></div>
          <div><label className="block text-sm">* Religion</label><input name="religion" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.religion || ''} /></div>
          <div><label className="block text-sm">* Civil Status</label><input name="civilStatus" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="Single/Married/Others" value={formData.civilStatus || ''} /></div>
          <div><label className="block text-sm">* Nationality</label><input name="nationality" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.nationality || ''} /></div>
          <div><label className="block text-sm">* E-mail Address</label><input type="email" name="email" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="you@example.com" value={formData.email || ''} /></div>
          <div className="sm:col-span-2"><label className="block text-sm">* Home Address</label><input name="homeAddress" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.homeAddress || ''} /></div>
          <div className="sm:col-span-2"><label className="block text-sm">* Contact No.</label><input name="contact" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="09XXXXXXXXX" value={formData.contact || ''} /></div>
        </div>
        <hr className="my-4" />
        {/* Parent/Guardian */}
        <div className="space-y-4">
          <h4 className="font-semibold">Parent/Guardian Authorization</h4>
          {/* Father */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <div><label className="block text-sm">Name of Father</label><input name="fatherName" onChange={handleChange} className="border rounded p-2 w-full" value={formData.fatherName || ''} /></div>
            <div><label className="block text-sm">Occupation</label><input name="fatherOccupation" onChange={handleChange} className="border rounded p-2 w-full" value={formData.fatherOccupation || ''} /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="fatherAge" onChange={handleChange} className="border rounded p-2 w-full" value={formData.fatherAge || ''} /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="fatherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" value={formData.fatherBusinessAddress || ''} /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="fatherContact" onChange={handleChange} className="border rounded p-2 w-full" value={formData.fatherContact || ''} /></div>
          </div>
          {/* Mother */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <div><label className="block text-sm">Name of Mother</label><input name="motherName" onChange={handleChange} className="border rounded p-2 w-full" value={formData.motherName || ''} /></div>
            <div><label className="block text-sm">Occupation</label><input name="motherOccupation" onChange={handleChange} className="border rounded p-2 w-full" value={formData.motherOccupation || ''} /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="motherAge" onChange={handleChange} className="border rounded p-2 w-full" value={formData.motherAge || ''} /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="motherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" value={formData.motherBusinessAddress || ''} /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="motherContact" onChange={handleChange} className="border rounded p-2 w-full" value={formData.motherContact || ''} /></div>
          </div>
          {/* Guardian in Davao & Previous Stay */}
          <div className="space-y-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <h5 className="font-medium">Guardian in Davao City (if any)</h5>
            <div><input name="guardianName" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Name" value={formData.guardianName || ''} /></div>
            <div><input name="guardianHomeAddress" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Home Address" value={formData.guardianHomeAddress || ''} /></div>
            <div><input name="guardianContact" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Contact No." value={formData.guardianContact || ''} /></div>
            <div><input name="guardianBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Business Address" value={formData.guardianBusinessAddress || ''} /></div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium">Have you stayed in any dormitory or boarding house before?</h5>
            <div className="flex items-center gap-4">
              <label className="flex items-center"><input type="radio" name="stayedBefore" value="yes" onChange={handleChange} className="mr-1" checked={formData.stayedBefore === "yes"} /> Yes</label>
              <label className="flex items-center"><input type="radio" name="stayedBefore" value="no" onChange={handleChange} className="mr-1" checked={formData.stayedBefore === "no"} /> No</label>
            </div>
            <div><input name="lengthOfStay" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Length of Stay" value={formData.lengthOfStay || ''} /></div>
            <div><input name="previousLocation" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Where?" value={formData.previousLocation || ''} /></div>
          </div>
          <div className="mt-4">
            <label className="block text-sm"><strong>Sign by typing your name.</strong> You agree that you certify to the best of you knowledge as to the accuracy of the information supplied herein.</label>
            <input required name="studentSignature_applicationForm" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Type your full name here" value={formData.studentSignature_applicationForm || ''} />
          </div>
        </div>
      </fieldset>

      {/* Prompt for users */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm">
          Please complete all sections of this Student Housing Form. Fields marked with * are required.
        </p>
      </div>

      {/* Page 2: Information and Instruction Sheet (For Parents/Guardian) */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Information and Instruction Sheet (For Parents/Guardian)</legend>

        {/* 1. Go home on weekends? If so, how often */}
        <div className="space-y-1">
          <span className="block text-sm">1. Go home on weekends? If so, how often</span>
          <input
            type="text"
            name="instruction_1"
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Your response"
            value={formData.instruction_1 || ''}
          />
        </div>

        {/* 2. Go home on weekdays? When? If so, please specify */}
        <div className="space-y-1 mt-2">
          <span className="block text-sm">2. Go home on weekdays? When? If so, please specify</span>
          <input
            type="text"
            name="instruction_2"
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Your response"
            value={formData.instruction_2 || ''}
          />
        </div>

        {/* 3. Spend overnight/weekends with relatives and/or guardians */}
        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            name="instruction_3"
            onChange={handleChange}
            className="border rounded"
            checked={formData.instruction_3 || false}
          />
          <span className="text-sm">3. Spend overnight/weekends with relatives and/or guardians</span>
        </label>

        {/* 4. Spend overnight with friends or dormmates */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="instruction_4"
            onChange={handleChange}
            className="border rounded"
            checked={formData.instruction_4 || false}
          />
          <span className="text-sm">4. Spend overnight with friends or dormmates</span>
        </label>

        {/* 5. Join school-related field trips/picnics/excursions */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="instruction_5"
            onChange={handleChange}
            className="border rounded"
            checked={formData.instruction_5 || false}
          />
          <span className="text-sm">5. Join school-related field trips/picnics/excursions</span>
        </label>

        {/* 6. Join organizations/fraternities/sororities */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="instruction_6"
            onChange={handleChange}
            className="border rounded"
            checked={formData.instruction_6 || false}
          />
          <span className="text-sm">6. Join organizations/fraternities/sororities</span>
        </label>

        {/* 7. Join demonstrations or rallies */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="instruction_7"
            onChange={handleChange}
            className="border rounded"
            checked={formData.instruction_7 || false}
          />
          <span className="text-sm">7. Join demonstrations or rallies</span>
        </label>

        {/* 8. Illnesses */}
        <div className="space-y-1 mt-4">
          <span className="block text-sm">8. Does he/she have illness(es) we must know? If so, please elaborate</span>
          <input
            type="text"
            name="instruction_8"
            onChange={handleChange}
            className="border rounded p-2 w-full"
            placeholder="Your response"
            value={formData.instruction_8 || ''}
          />
        </div>

        {/* Additional Instructions */}
        <div className="mt-4">
          <label className="block text-sm">Additional Instructions or Information:</label>
          <textarea
            name="additionalInstructions"
            onChange={handleChange}
            className="border rounded p-2 w-full"
            rows={3}
            value={formData.additionalInstructions || ''}
          />
        </div>

        {/* Parent Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm">Parent's Printed Name, typing your name you assure that the typed information is true.</label>
            <input
              type="text"
              name="infoParentName"
              onChange={handleChange}
              className="border rounded p-2 w-full"
              value={formData.infoParentName || ''}
            />
          </div>
        </div>
      </fieldset>

      {/* Page 3: Designated Guardians */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
        {[1, 2].map((n) => (
          <div key={n} className="mb-4">
            <h4 className="font-medium">Guardian {n}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm">Full Name</label><input name={`guardian${n}_fullName`} onChange={handleChange} className="border rounded p-2 w-full" value={formData[`guardian${n}_fullName`] || ''} /></div>
              <div><label className="block text-sm">Relationship to Resident</label><input name={`guardian${n}_relationship`} onChange={handleChange} className="border rounded p-2 w-full" value={formData[`guardian${n}_relationship`] || ''} /></div>
              <div className="sm:col-span-2"><label className="block text-sm">Complete Address</label><input name={`guardian${n}_address`} onChange={handleChange} className="border rounded p-2 w-full" value={formData[`guardian${n}_address`] || ''} /></div>
              <div className="sm:col-span-2"><label className="block text-sm">Contact Number</label><input name={`guardian${n}_contact`} onChange={handleChange} className="border rounded p-2 w-full" value={formData[`guardian${n}_contact`] || ''} /></div>
            </div>
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Student’s Name and Signature</label>
            <input name="designatedGuardians_studentSignature" onChange={handleChange} className="border rounded p-2 w-full" value={formData.designatedGuardians_studentSignature || ''} />
          </div>
          <div>
            <label className="block text-sm">Parent’s/Guardian’s Name and Signature</label>
            <input name="designatedGuardians_parentSignature" onChange={handleChange} className="border rounded p-2 w-full" value={formData.designatedGuardians_parentSignature || ''} />
          </div>
        </div>
      </fieldset>

      {/* Page 4: Appliance Declaration */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Appliance Declaration</legend>
        <p className="text-sm mb-4 text-gray-600">
          Please list all appliances you will bring to the dormitory.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bold mb-2">
          <span>Quantity</span>
          <span>Description</span>
          <span>Brand/Serial No.</span>
        </div>
        {applianceMap.map((applianceId, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2 items-center">
            <input
              name={`applianceQty_${i}`}
              type="number"
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Qty"
              value={formData[`applianceQty_${i}`] || ''}
            />
            <input
              name={`applianceDesc_${i}`}
              readOnly
              className="border rounded p-2 w-full bg-gray-50"
              value={
                applianceId === 1 ? "Personal Computer/Laptop" :
                applianceId === 7 ? "Printer/Scanner" :
                applianceId === 4 ? "Electric Fan" :
                applianceId === 6 ? "Cellphone With Charger" :
                applianceId === 5 ? "Study Lamp" :
                applianceId === 3 ? "MP3/MP4/IPOD/PSP" :
                applianceId === 8 ? "Chargeable Flashlight" :
                applianceId === 9 ? "Powerbank" :
                applianceId === 10 ? "Pocket Wifi" :
                applianceId === 11 ? "Camera" :
                applianceId === 12 ? "Nebulizer" :
                ""
              }
            />
            <input
              name={`applianceBrand_${i}`}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Brand/Serial No."
              value={formData[`applianceBrand_${i}`] || ''}
            />
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Student’s Name and Signature</label>
            <input name="applianceDeclaration_studentSignature" onChange={handleChange} className="border rounded p-2 w-full" value={formData.applianceDeclaration_studentSignature || ''} />
          </div>
          <div>
            <label className="block text-sm">Parent’s/Guardian’s Name and Signature</label>
            <input name="applianceDeclaration_parentSignature" onChange={handleChange} className="border rounded p-2 w-full" value={formData.applianceDeclaration_parentSignature || ''} />
          </div>
        </div>
      </fieldset>

      {/* Page 5: Dormitory Agreement - Part 1 */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Dormitory Agreement - Part 1</legend>
        <p className="text-sm mb-4 text-gray-600">
          Please read and agree to the dormitory policies.
        </p>
        {/* Content of Dormitory Agreement Part 1 */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>I hereby certify that I have read and understood the rules and regulations of the Dormitory and that I shall abide by them. I further understand that failure to comply with these rules and regulations may result in the termination of my stay in the Dormitory.</p>
          <p>I also certify that all information supplied in this application is true and correct to the best of my knowledge. Any false information given will be sufficient cause for the cancellation of my application or immediate dismissal from the Dormitory.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Resident’s Name and Signature</label>
            <input name="agreementResidentSign" onChange={handleChange} className="border rounded p-2 w-full" value={formData.agreementResidentSign || ''} />
          </div>
          <div>
            <label className="block text-sm">Parent’s/Guardian’s Name and Signature</label>
            <input name="agreementParentSign" onChange={handleChange} className="border rounded p-2 w-full" value={formData.agreementParentSign || ''} />
          </div>
        </div>
      </fieldset>

      {/* Page 6: Dormitory Agreement - Part 2 */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Dormitory Agreement - Part 2</legend>
        <p className="text-sm mb-4 text-gray-600">
          Further agreements regarding your stay.
        </p>
        {/* Content of Dormitory Agreement Part 2 */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>I understand and agree that the Dormitory Management reserves the right to inspect my room at any time for health, safety, and security purposes.</p>
          <p>I agree to pay all dormitory fees and charges on time. Failure to do so may result in penalties or termination of my accommodation.</p>
          <p>I acknowledge that I am responsible for any damages caused to the dormitory property during my stay and agree to pay for such damages.</p>
          <p>I understand that the dormitory is not responsible for personal belongings lost or damaged due to theft, fire, or other causes beyond its control.</p>
          <p>I agree to vacate the dormitory premises at the end of the accommodation period or upon termination of my stay, whichever comes first.</p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Resident’s Name and Signature</label>
            <input name="signatureResident_dormAgreement" onChange={handleChange} className="border rounded p-2 w-full" value={formData.signatureResident_dormAgreement || ''} />
          </div>
          <div>
            <label className="block text-sm">Parent’s/Guardian’s Name and Signature</label>
            <input name="signatureParent_dormAgreement" onChange={handleChange} className="border rounded p-2 w-full" value={formData.signatureParent_dormAgreement || ''} />
          </div>
          <div>
            <label className="block text-sm">Accommodation Period Until</label>
            <input type="date" name="accommodationUntil" onChange={handleChange} className="border rounded p-2 w-full" value={formData.accommodationUntil || ''} />
          </div>
        </div>
      </fieldset>

      {/* Privacy Notice */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Privacy Notice</legend>
        <p className="text-sm mb-4 text-gray-600">
          Your privacy is important to us. Please read our privacy notice.
        </p>
        <div className="space-y-2 text-sm text-gray-700">
          <p>By submitting this form, you agree to the collection and processing of your personal data by the dormitory management for the purpose of dormitory accommodation, record-keeping, and compliance with relevant regulations. Your data will be kept confidential and will not be shared with third parties without your consent, except as required by law.</p>
          <p>You have the right to access, correct, and object to the processing of your personal data. For more information, please contact the dormitory administration.</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm">By typing your name, you acknowledge that you have read and understood the Privacy Notice and consent to the processing of your personal data.</label>
          <input required name="privacyNameSign" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Type your full name here" value={formData.privacyNameSign || ''} />
        </div>
      </fieldset>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
        Submit Application
      </button>
    </form>
  </div>
  );
}

export default StudentSignIn;
