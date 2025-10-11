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

    // Validation: Check if all required checkboxes are checked
    if (!formData.studentConfirmation) {
        alert("Please confirm your student application by checking the student confirmation box.");
        return;
    }
    if (!formData.parentConfirmation) {
        alert("Please confirm parent/guardian authorization by checking the parent/guardian confirmation box.");
        return;
    }

    try {
        // Insert into Students table
        const { error: insertionError } = await supabase
            .from('Students')
            .insert([{
                'userID': currentSession.user.id,
                'studentNumber': formData.studentId,
                'studentName': formData.name,
                'email': formData.email,
            }]);

        if (insertionError) {
            console.error("Error inserting into Students table: ", insertionError.message);
            return;
        }

        // Insert into Application_for_Dorm_Accomodation table
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

        // Insert Signatures - Consolidated to remove redundancy
        const signatures = [
            // Student Confirmation
            {
                userID: currentSession.user.id,
                formName: "Student Application SignUp",
                isAgreed: "CONFIRMED",
                role: "student",
                expirationDate: formData.accommodationUntil
            },
            // Parent/Guardian Confirmation
            {
                userID: currentSession.user.id,
                formName: "Student Application SignUp",
                isAgreed: "CONFIRMED",
                role: "parent",
                expirationDate: formData.accommodationUntil
            }
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
      </fieldset>

      {/* Page 3: Designated Guardians */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
        <p className="text-sm mb-4 text-gray-600">
          Please provide information about your designated guardians in Davao City who can be contacted in case of emergency.
        </p>
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
      </fieldset>

      {/* Page 4: Appliance Declaration */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Appliance Declaration</legend>
        <p className="text-sm mb-4 text-gray-600">
          Please list all electrical appliances you will bring to the dormitory. This is for safety and inventory purposes.
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
          <p>I understand that the dormitory management has the right to inspect my room for health, safety, and security purposes. I agree to pay all fees on time and acknowledge my responsibility for any damages to dormitory property during my stay.</p>
          <p>I understand that the dormitory is not responsible for personal belongings lost or damaged due to theft, fire, or other causes beyond its control. I agree to vacate the dormitory premises at the end of the accommodation period or upon termination of my stay.</p>
        </div>
      </fieldset>

      {/* Page 6: Dormitory Agreement - Part 2 */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Dormitory Agreement - Part 2</legend>
        <p className="text-sm mb-4 text-gray-600">
          Additional terms and conditions for dormitory accommodation.
        </p>
        {/* Content of Dormitory Agreement Part 2 */}
        <div className="space-y-2 text-sm text-gray-700">
          <p>I agree to respect the rights and privacy of other dormitory residents and to maintain cleanliness and orderliness in common areas and in my assigned room.</p>
          <p>I understand that visitors must be registered and that overnight guests are not permitted without prior approval from dormitory management.</p>
          <p>I acknowledge that the use of prohibited items (including but not limited to illegal drugs, weapons, and unauthorized electrical appliances) is strictly forbidden and may result in immediate dismissal.</p>
          <p>I agree to participate in fire drills and emergency evacuations and to familiarize myself with safety procedures and emergency exits.</p>
          <p>I understand that repeated violations of dormitory rules may result in disciplinary action, including suspension or termination of my accommodation privileges.</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Accommodation Period Until</label>
          <input type="date" name="accommodationUntil" required onChange={handleChange} className="border rounded p-2 w-full" value={formData.accommodationUntil || ''} />
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
          <p>The information you provide will be stored securely and used solely for the administration of your dormitory accommodation and related services.</p>
        </div>
      </fieldset>

      {/* Consolidated Confirmation Section */}
      <fieldset className="border-2 border-blue-500 p-6 rounded bg-blue-50">
        <legend className="font-bold text-lg text-blue-900">Final Confirmation and Authorization</legend>
        
        <div className="space-y-6 mt-4">
          {/* Student Confirmation */}
          <div className="bg-white p-4 rounded border border-blue-300">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="studentConfirmation"
                required
                onChange={handleChange}
                className="mt-1 h-5 w-5 border-2 border-gray-300 rounded"
                checked={formData.studentConfirmation || false}
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900 block mb-2">* STUDENT CONFIRMATION (Required)</span>
                <span className="text-sm text-gray-700">
                  I, <strong>{formData.name || '[Your Name]'}</strong>, hereby certify and confirm that:
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>All information provided in this application form is true, accurate, and complete to the best of my knowledge.</li>
                    <li>I have read, understood, and agree to abide by all the rules, regulations, policies, and agreements stated in this dormitory application, including the Information and Instruction Sheet, Designated Guardians information, Appliance Declaration, Dormitory Agreements (Parts 1 and 2), and Privacy Notice.</li>
                    <li>I understand that providing false or misleading information may result in the cancellation of my application or immediate dismissal from the dormitory.</li>
                    <li>I acknowledge my responsibility to maintain the dormitory property, respect other residents, and comply with all dormitory policies throughout my stay.</li>
                    <li>I agree to vacate the dormitory premises at the end of the accommodation period specified ({formData.accommodationUntil || '[Date Not Set]'}) or upon termination of my stay.</li>
                  </ul>
                </span>
              </div>
            </label>
          </div>

          {/* Parent/Guardian Confirmation */}
          <div className="bg-white p-4 rounded border border-blue-300">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="parentConfirmation"
                required
                onChange={handleChange}
                className="mt-1 h-5 w-5 border-2 border-gray-300 rounded"
                checked={formData.parentConfirmation || false}
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900 block mb-2">* PARENT/GUARDIAN CONFIRMATION (Required)</span>
                <span className="text-sm text-gray-700">
                  I, as the parent/legal guardian of <strong>{formData.name || '[Student Name]'}</strong>, hereby certify and confirm that:
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>I have reviewed all information provided in this application and confirm its accuracy.</li>
                    <li>I authorize my child/ward to reside in the dormitory and participate in activities as outlined in the Information and Instruction Sheet.</li>
                    <li>I have read, understood, and agree to all terms, conditions, rules, regulations, and agreements stated in this application, including the Dormitory Agreements, Designated Guardians authorization, Appliance Declaration, and Privacy Notice.</li>
                    <li>I understand and accept financial responsibility for dormitory fees, damages caused by my child/ward, and any other charges incurred during their stay.</li>
                    <li>I authorize the designated guardians listed in this application to act on my behalf in case of emergencies when I cannot be reached.</li>
                    <li>I acknowledge that the dormitory management has the right to enforce rules and take disciplinary action, including dismissal, if my child/ward violates dormitory policies.</li>
                    <li>I consent to the collection, processing, and storage of personal data as outlined in the Privacy Notice for dormitory administration purposes.</li>
                  </ul>
                </span>
              </div>
            </label>
          </div>

          <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
            <p className="text-sm text-yellow-900">
              <strong>IMPORTANT:</strong> Both the student and parent/guardian confirmations above are required to submit this application. By checking these boxes, you are providing your electronic signature and agreement to all terms and conditions outlined in this comprehensive dormitory application form.
            </p>
          </div>
        </div>
      </fieldset>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded w-full text-lg shadow-lg transition-colors">
        Submit Application
      </button>

      <div className="text-center text-xs text-gray-500 mt-4">
        <p>By submitting this form, you acknowledge that all information provided is accurate and you agree to all terms and conditions.</p>
      </div>
    </form>
  </div>
  );
}

export default StudentSignIn;