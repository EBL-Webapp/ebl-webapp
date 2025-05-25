import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase_client';

function studentSignIn() {

const navigate = useNavigate();
const [session, setSession] = useState(null);
const [formData, setFormData] = useState({});

  // Load saved form data and session
  useEffect(() => {
    // Load form data from localStorage
    const savedFormData = localStorage.getItem("dormApplicationFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        console.log("Restored form data from localStorage");
      } catch (e) {
        console.error("Error parsing saved form data", e);
      }
    }
    
    // Get session from Supabase
    const getSession = async () => {
      const {data: {session}, error} = await supabase.auth.getSession();
      if(error){
        console.log("Error getting session: ", error.message);
        return;
      }
      setSession(session);
      console.log("Session retrieved:", session);
    }
    
    getSession();
  }, []);

  const applianceMap = [
    1,  // Laptop / Tablet / Desktop           → Personal Computer/Laptop (ID 1)
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
    console.log("Current session:", session);
    
    // Fix 2: Make sure we have a session before proceeding
    if (!session || !session.user) {
      console.error("No active session or user found");
      // You might want to redirect to login here
      navigate("/")
      return;
    }

    const {error: insertionError} = await supabase
    .from('Students')
    .insert([{
      'userID': session.user.id,
      'studentNumber': formData.studentId,
      'studentName' : formData.name,
    }]);

    if(insertionError){
      console.log("error in inserting: ", insertionError.message);
      return;
    }

    // We now insert the data from formData to "Application_for_Dorm_Application"
    const { error: error_Application_for_Dorm_Accomodation } = await supabase
      .from("Application_for_Dorm_Accomodation")
      .insert([{
        "admissionYear": formData.semester,
        "studentNumber": formData.studentId,
        "studentName": formData.name,
        "Sex": formData.sex,
        "Age": formData.age,
        "Course": formData.course,
        "yearLevel": formData.yearLevel,
        "dateOfBirth": formData.dob,
        "placeOfBirth": formData.pob,
        "religion": formData.religion,
        "civilStatus": formData.civilStatus,
        "nationality": formData.nationality,
        "emailAddress": formData.email,
        "homeAddress": formData.homeAddress,
        "contactNo": formData.contact,
        "isStayedInAnyDormitory": formData.stayedBefore,
        "whereStayed": formData.previousLocation,
        "lengthOfStay": formData.lengthOfStay,
      }]);

    if(error_Application_for_Dorm_Accomodation){
      console.log("Error in inserting new row: ", error_Application_for_Dorm_Accomodation.message);
      return;
    }

    // Now we insert the data for the guardians
    // We insert for the father first
    const {error: error_insertingFather} = await supabase
      .from("guardianInformation")
      .insert([{
        "studentNumber": formData.studentId,
        "guardianType": "father",
        "Name": formData.fatherName,
        "Occupation": formData.fatherOccupation,
        "Age": formData.fatherAge,
        "businessAddress_or_employmentAddress": formData.fatherBusinessAddress,
        "contactNumber": formData.fatherContact
      }]);

    if(error_insertingFather){
      console.log("There was an error in insert father: ", error_insertingFather.message);
      return;
    }

    // Now we insert for the mother
    const {error: error_insertingMother} = await supabase
      .from("guardianInformation")
      .insert([{
        "studentNumber": formData.studentId,
        "guardianType": "mother",
        "Name": formData.motherName,
        "Occupation": formData.motherOccupation,
        "Age": formData.motherAge,
        "businessAddress_or_employmentAddress": formData.motherBusinessAddress,
        "contactNumber": formData.motherContact
      }]);
      
    if(error_insertingMother){
      console.log("Error in inserting mother:", error_insertingMother.message);
      return;
    }

    // Now we insert the guardian in Davao
    const {error: error_insertingGuardianDavao} = await supabase
      .from("guardianInformation")
      .insert([{
        "studentNumber": formData.studentId,
        "guardianType": "guardian",
        "Name": formData.guardianName,
        "homeAddress": formData.guardianHomeAddress,
        "contactNumber": formData.guardianContact,
        "businessAddress_or_employmentAddress": formData.guardianBusinessAddress
      }]);

    if(error_insertingGuardianDavao){
      console.log("There's an error in inserting guardian:", error_insertingGuardianDavao.message);
      return;
    }

    const {error: error_insertingInformationAndInstructionSheet} = await supabase
      .from("Information_and_Instruction_Sheet")
      .insert([{
        "isAllowed_WeekendsWithRelatives_or_guardians": formData.instruction_3,
        "isAllowed_spendOvernightWithFriends_or_dormmates": formData.instruction_4,
        "isAllowed_joinOrganizations": formData.instruction_6,
        "isAllowed_joinDemonstrations_or_rallies": formData.instruction_7,
        "whatIllnesses": formData.instruction_8,
        "otherAdditionalInstruction": formData.additionalInstructions,
        "Allowed_ToGoHomeInWeekends": formData.instruction_1,
        "Allowed_ToGoHomeInWeekdays": formData.instruction_2,
        "isAllowed_joinSchoolRelatedFieldTripsOrPicnicsOrExcursions": formData.instruction_5,
        "studentNumber": formData.studentId,
      }]);

    if(error_insertingInformationAndInstructionSheet){
      console.log("There's an error in inserting the information and instruction sheet", error_insertingInformationAndInstructionSheet.message);
      return;
    }

    // In here we insert the different Designated Guardians
    // fullName, relationship, address, contact, signature
    // guardian{n}_{field}

    // In here we insert the first guardian
    const {error: error_insertingGuardian1} = await supabase
      .from("Designated_Guardians")
      .insert([{
        "studentNumber": formData.studentId,
        "fullName_of_Guardian": formData.guardian1_fullName,
        "relationshipToResident": formData.guardian1_relationship,
        "completeAddress": formData.guardian1_address,
        "contactNumber": formData.guardian1_contact
      }]);

    if(error_insertingGuardian1){
      console.log("Error inserting guardian1: ", error_insertingGuardian1.message);
      return;
    }

    // We are now inserting guardian2
    const {error: error_insertingGuardian2} = await supabase
      .from("Designated_Guardians")
      .insert([{
        "studentNumber": formData.studentId,
        "fullName_of_Guardian": formData.guardian2_fullName,
        "relationshipToResident": formData.guardian2_relationship,
        "completeAddress": formData.guardian2_address,
        "contactNumber": formData.guardian2_contact
      }]);

    if(error_insertingGuardian2){
      console.log("Error inserting guardian2: ", error_insertingGuardian2.message);
      return;
    }

    // Now in here we insert the appliances
    const studentNumber = formData.studentId;

    const rowsToInsert = [];
    for (let i = 0; i < applianceMap.length; i++) {
      const qty = formData[`applianceQty_${i}`];
      const brand = formData[`applianceBrand_${i}`];
      const serial = formData[`applianceSerial_${i}`];

      if (!qty) continue; // skip blank rows

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
      const {data, error} = await supabase
        .from('appliance_per_student')
        .insert(rowsToInsert);

      if (error) {
        console.error('Insert failed:', error);
        // show user error…
        return;
      } else {
        console.log('Inserted rows:', data);
        // success flow…
      }
    } else {
      console.log('No appliances to declare.');
    }

    // Now we make insert the signatures
    // Fix 3: Use the correct session object
    const signatures = [
      { //We first insert the signature in Privacy Notice
        userID: session.user.id,
        formName: "Privacy Form",
        isAgreed: formData.privacyNameSign,
        role: "student",
        expirationDate: formData.accomodationUntil
      },
      { //Now we insert the signature in Application Form
        userID: session.user.id,
        formName: "Application Form",
        isAgreed: formData.studentSignature_applicationForm,
        role: "student",
        expirationDate: formData.accomodationUntil
      },
      { //Now we insert the signature in Information and Instruction Sheet
        userID: session.user.id,
        formName: "Information and Instruction Sheet",
        isAgreed: formData.infoParentName,
        role: "parent",
        expirationDate: formData.accomodationUntil
      },
      { //Now we insert the signature in Guardians in Davao student
        userID: session.user.id,
        formName: "Guardians in Davao",
        isAgreed: formData.infoParentName,
        role: "student"
      },
      { //Now we insert the signature in Guardians in Davao parent
        userID: session.user.id,
        formName: "Guardians in Davao",
        isAgreed: formData.infoParentName,
        role: "parent"
      },
      { //Now we insert the signature in Guardians in Appliance Declaration parent
        userID: session.user.id,
        formName: "Appliance Declaration",
        isAgreed: formData.applianceDeclaration_parentSignature,
        role: "parent"
      },
      { //Now we insert the signature in Guardians in Appliance Declaration student
        userID: session.user.id,
        formName: "Appliance Declaration",
        isAgreed: formData.applianceDeclaration_studentSignature,
        role: "student"
      },
      { //Now we insert the signature in Guardians in Dormitory Agreement student
        userID: session.user.id,
        formName: "Dormitory Agreement 1",
        isAgreed: formData.agreementResidentSign,
        role: "student"
      },
      { //Now we insert the signature in Guardians in Dormitory Agreement student
        userID: session.user.id,
        formName: "Dormitory Agreement 1",
        isAgreed: formData.agreementParentSign,
        role: "parent"
      },
      { //Now we insert the signature in Guardians in Dormitory Agreement 2 student
        userID: session.user.id,
        formName: "Dormitory Agreement 2",
        isAgreed: formData.signatureResident_dormAgreement,
        role: "student"
      },
      { //Now we insert the signature in Guardians in Dormitory Agreement 2 parent
        userID: session.user.id,
        formName: "Dormitory Agreement 2",
        isAgreed: formData.signatureParent_dormAgreement,
        role: "parent"
      },
    ];

    const {error: error_insertingSignatures} = await supabase.from("signatureTable").insert(signatures);

    if(error_insertingSignatures){
      console.log("There's an error in inserting the signatures: ", error_insertingSignatures.message);
      return;
    }

    // Clear saved form data after successful submission
    localStorage.removeItem("dormApplicationFormData");
    localStorage.removeItem("debugFormData");
    console.log("Form submitted successfully, cleared saved data");

    navigate('/NoUpdate');
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
          <div><label className="block text-sm">* Semester</label><input name="semester" type='text' required onChange={handleChange} placeholder='1, 2, or summer' className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Full Name</label><input name="name" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="Surname, First Name, Middle Name" /></div>
          <div><label className="block text-sm">* Sex</label><select name="sex" required onChange={handleChange} className="border rounded p-2 w-full"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="block text-sm">* Age</label><input type="number" name="age" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Student’s ID No.</label><input name="studentId" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Course</label><input name="course" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Year Level</label><input type="number" name="yearLevel" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Date of Birth</label><input type="date" name="dob" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Place of Birth</label><input name="pob" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Religion</label><input name="religion" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Civil Status</label><input name="civilStatus" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="Single/Married/Others" /></div>
          <div><label className="block text-sm">* Nationality</label><input name="nationality" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* E-mail Address</label><input type="email" name="email" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="you@example.com" /></div>
          <div className="sm:col-span-2"><label className="block text-sm">* Home Address</label><input name="homeAddress" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div className="sm:col-span-2"><label className="block text-sm">* Contact No.</label><input name="contact" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="09XXXXXXXXX" /></div>
        </div>
        <hr className="my-4" />
        {/* Parent/Guardian */}
        <div className="space-y-4">
          <h4 className="font-semibold">Parent/Guardian Authorization</h4>
          {/* Father */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <div><label className="block text-sm">Name of Father</label><input name="fatherName" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Occupation</label><input name="fatherOccupation" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="fatherAge" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="fatherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="fatherContact" onChange={handleChange} className="border rounded p-2 w-full" /></div>
          </div>
          {/* Mother */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <div><label className="block text-sm">Name of Mother</label><input name="motherName" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Occupation</label><input name="motherOccupation" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="motherAge" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="motherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="motherContact" onChange={handleChange} className="border rounded p-2 w-full" /></div>
          </div>
          {/* Guardian in Davao & Previous Stay */}
          <div className="space-y-4 border-gray-400 border-2 p-2 rounded-md shadow-black hover:shadow-md">
            <h5 className="font-medium">Guardian in Davao City (if any)</h5>
            <div><input name="guardianName" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Name" /></div>
            <div><input name="guardianHomeAddress" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Home Address" /></div>
            <div><input name="guardianContact" onChange={handleChange} className="border rounded p-2 w-full mb-2" placeholder="Contact No." /></div>
            <div><input name="guardianBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Business Address" /></div>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium">Have you stayed in any dormitory or boarding house before?</h5>
            <div className="flex items-center gap-4">
              <label className="flex items-center"><input type="radio" name="stayedBefore" value="yes" onChange={handleChange} className="mr-1" /> Yes</label>
              <label className="flex items-center"><input type="radio" name="stayedBefore" value="no" onChange={handleChange} className="mr-1" /> No</label>
            </div>
            <div><input name="lengthOfStay" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Length of Stay" /></div>
            <div><input name="previousLocation" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Where?" /></div>
          </div>
          <div className="mt-4">
            <label className="block text-sm"><strong>Sign by typing your name.</strong> You agree that you certify to the best of you knowledge as to the accuracy of the information supplied herein.</label>
            <input name="studentSignature_applicationForm" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Type your full name here" />
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
          />
        </div>

        {/* 3. Spend overnight/weekends with relatives and/or guardians */}
        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            name="instruction_3"
            onChange={handleChange}
            className="border rounded"
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
          />
        </div>

        {/* Parent Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm">Parent’s Printed Name, typing your name you assure that the typed information is true.</label>
            <input
              type="text"
              name="infoParentName"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      </fieldset>


      {/* Page 3: Designated Guardians */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Designated Guardian(s) in Davao City</legend>
        {[1, 2].map((n) => (
          <div key={n} className="mb-4">
            <h4 className="font-medium">Guardian No. {n}</h4>
            {['fullName', 'relationship', 'address', 'contact', 'signature'].map((field) => (
              <div key={field} className="mt-2">
                <label className="block text-sm">{field === 'fullName' ? 'Full Name' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  name={`guardian${n}_${field}`}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
            ))}
          </div>
        ))}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
          <div>
            <label className="block text-sm">Parent’s Printed Name</label>
            <input
              type="text"
              name="designatedGuardians_parentSignature"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
              <label className="block text-sm">Resident’s Printed Name</label>
              <input
                type="text"
                name="designatedGuardians_studentSignature"
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
      </fieldset>

      {/* Page 4: Appliance Declaration Form */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Appliance Declaration Form</legend>

        {[ 
          'Laptop / Tablet / Desktop', 'Printer / Scanner', 'Electric Fan', 'Cellular Phone',
          'Study Lamp', 'iPod / PSP', 'Chargeable Flashlight', 'Powerbank', 'Pocket Wifi',
          'Camera', 'Nebulizer',
        ].map((label, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
            <span className="self-center text-sm">{label}</span>
            <input
              name={`applianceQty_${i}`}
              onChange={handleChange}
              placeholder="Quantity"
              type="number"
              className="border rounded p-2"
            />
            <input
              name={`applianceBrand_${i}`}
              onChange={handleChange}
              placeholder="Brand"
              className="border rounded p-2"
            />
            <input
              name={`applianceSerial_${i}`}
              onChange={handleChange}
              placeholder="Serial No."
              className="border rounded p-2"
            />
          </div>
        ))}

        {/* New Semester and Year field */}


        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
          <div>
            <label className="block text-sm">Parent’s Printed Name</label>
            <input
              type="text"
              name="applianceDeclaration_parentSignature"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
              <label className="block text-sm">Resident’s Printed Name</label>
              <input
                type="text"
                name="applianceDeclaration_studentSignature"
                onChange={handleChange}
                className="border rounded p-2 w-full"
              />
            </div>
        </div>

      </fieldset>


      {/* Page 5-6: Dormitory Agreement */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Dormitory Agreement</legend>

        {/* Resident Information */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Name of Resident</label>
            <input
              type="text"
              name="residentName"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <input
              type="text"
              name="residentAddress"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        {/* Agreement Statement */}
        <p className="text-sm mb-4">
          I, <input type="text" name="agreementResidentNameInline" onChange={handleChange} className="border-b border-gray-400 mx-1 w-32 inline-block" />
          of <input type="text" name="agreementResidentAddressInline" onChange={handleChange} className="border-b border-gray-400 mx-1 w-48 inline-block" />
          do hereby agree to the following privileges granted to me by the University authorities to reside in one of the UP Mindanao dormitories:
        </p>

        {/* Rules List */}
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>That I shall abide the dormitory rules, regulations or injunctions promulgated verbally or in writing by the dormitory authorities;</li>
          <li>That upon admission I shall pay two (2) months advance in dormitory fee and two (2) months advance in electrical fee.</li>
          <li>That I shall pay all my dormitory accounts, appliances, and other obligations not later than two (2) weeks before the final examinations of the current semester or else I will not be allowed to register for all the succeeding term;</li>
          <li>That if I fail to pay my dorm fee for two (2) successive months, my privileges to stay in the dormitory shall automatically be cancelled;</li>
          <li>That if I leave before the end of the semester, I shall pay 50% of the remaining period except when, for the reasons which the authorities concerned shall deem meritorious, I shall be excepted;</li>
          <li>That reservation will hold good until the end of the first day of the classes only and that assignment of the room space shall be made by the dormitory in-charge;</li>
          <li>That I recognize the right of the dormitory authorities to inspect my room and lockers when circumstances warrant so, whether with the presence/absence of the occupant;</li>
          <li>That during summer vacation / end of every semester all my belongings shall be removed from the locker and rooms. That if I want to leave my things the Dormitory Management shall not be liable for any loss or damages.</li>
          <li>That some causes for my dismissal/expulsion from the dormitory by the DORMITORY MANAGER are:
            <ol className="list-lower-alpha ml-5 mt-1">
              <li>Commission of a major offense/violation;</li>
              <li>Habitual commission of minor offenses or violations;</li>
              <li>Failure to pay monthly rentals for at least two (2) consecutive months;</li>
              <li>Destruction, removal of equipment and furnishing without permission from the DORMITORY MANAGER;</li>
              <li>Misbehavior such as fighting among residents, insubordination and gross discourtesy.
              </li>
            </ol>
          </li>
        </ol>

        {/* Signatures */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Student's Printed Name & Signature</label>
            <input
              type="text"
              name="agreementResidentSign"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Parent's / Guardian's Printed Name & Signature</label>
            <input
              type="text"
              name="agreementParentSign"
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      </fieldset>

      {/* Page 7: Privacy Notice Acknowledgement */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Privacy Notice Acknowledgement</legend>
        <p className="text-sm mb-2">
          I have read the University of the Philippines’ Privacy Notice for Students.
I understand that for the UP System to carry out its mandate under the 1987
Constitution, the UP Charter, and other laws, that the University must necessarily
process my personal and sensitive personal information.
Therefore, I recognize the authority of the University of the Philippines to process
my personal and sensitive personal information, pursuant to the UP Privacy
Notice and applicable laws.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Name and Signature of Student</label>
            <input name="privacyNameSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>
      </fieldset>

      {/* In this part, this is for the agreement number 2 */}
       <fieldset className="border p-4 rounded">
      <legend className="font-semibold">Accommodation Agreement</legend>

      {/* Introductory Text */}
      <div className="space-y-2 text-sm mb-4">
        <p>
          Accommodation in the dormitory is a privilege granted to a university student based on HIS/HER VOLUNTARY DESIRE to avail of such privilege despite the prevailing problems and limitations. The University, however, through its representative assigned in the dormitory, has the <strong>RIGHT TO REFUSE ANY APPLICANT WITH UNDESIRABLE RECORD OF CONDUCT.</strong>
        </p>
        <p>
          It is important that before an applicant signs the dormitory contract or agreement, s/he should inquire about the dormitory conditions as regards to facilities, maintenance, water supply, etc. S/he must be willing to bear with the problems and limitations and <strong>ABIDE BY THE RULES AND REGULATIONS</strong> should s/he proceed to sign this agreement. Otherwise, <strong>s/he is FREE TO SEEK ACCOMMODATION ELSEWHERE.</strong>
        </p>
      </div>

      {/* Pledge Statement */}
      <p className="text-sm mb-4">In further consideration of my admission, I do hereby pledge:</p>

      {/* Pledge List */}
      <ol className="list-decimal ml-5 space-y-2 text-sm">
        <li>
          To reside in the dormitory for the period of{' '}
          <input
            type="date"
            name="accommodationFrom"
            onChange={handleChange}
            className="border-b border-gray-400 mx-1 p-1"
          /> until{' '}
          <input
            type="date"
            name="accommodationUntil"
            onChange={handleChange}
            className="border-b border-gray-400 mx-1 p-1"
          />;
        </li>
        <li>To use the residence facilities with due care and consideration as I do in my own home;</li>
        <li>To conduct myself in accordance with the University rules as well as dormitory rules promulgated by the duly constituted authorities;</li>
        <li>To accept and comply with sanctions that may be imposed by the duly constituted authorities as provided for in existing University rules in case of violations or misdemeanors committed while a resident of the dormitory;</li>
        <li>To live harmoniously with my fellow residents and cultivate goodwill and tolerance between and amongst my peers and elders;</li>
        <li>To help the University save resources by using facilities with provident care;</li>
        <li>To settle my obligations and other dues promptly; and</li>
        <li>To conduct myself in accordance with the generally accepted rules of discipline and community living.</li>
      </ol>

      {/* Closing Paragraph */}
      <p className="text-sm my-4">
        I understand that anything I do which violates this agreement, existing University rules and Dormitory policies will render the University waived from any and all legal liabilities for the consequences of such action and that my dormitory privilege may be revoked or cancelled if warranted.
      </p>
      <p className="text-sm mb-4">
        I declare under oath that these Accommodation Forms, consisting of six pages, have been accomplished by me and by my parents/guardian, and are true, correct and complete statement pursuant to the provisions of pertinent laws, rules and regulations of the University of the Philippines Mindanao.
      </p>
      <p className="text-sm mb-4">
        I also authorize the dormitory head/authorized representative to verify/validate the contents stated herein. I trust that this information shall remain confidential.
      </p>

      {/* Signatures */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Signature of Resident</label>
          <input
            type="text"
            name="signatureResident_dormAgreement"
            onChange={handleChange}
            placeholder="Signature"
            className="border rounded p-2 w-full mb-2"
          />
        </div>
        <div>
          <label className="block text-sm">Signature of Parent</label>
          <input
            type="text"
            name="signatureParent_dormAgreement"
            onChange={handleChange}
            placeholder="Signature"
            className="border rounded p-2 w-full mb-2"
          />
        </div>
      </div>
    </fieldset>

      <div className='w-[100%] bg-white pb-5 flex justify-center'>
          <button type='submit' className=' w-[25%] align-center p-2 bg-[#4E0303] text-white rounded-xl marcellus-sc-regular' >Submit</button>
      </div>

      {/* Page 8-9: Acknowledgement of Accountability Form
      <fieldset className="border p-4 rounded mb-8">
        <legend className="font-semibold">Acknowledgement of Accountability Form</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm font-medium mb-2">
          <span>Quantity</span><span>Description</span><span>Property Number</span>
        </div>
        {[
          { qty: '1 pc', desc: 'Room key' },
          { qty: '1 unit', desc: 'Study Table' },
          { qty: '2 pcs', desc: 'Jalousies (complete)' },
          { qty: '1 pc', desc: 'Window Screens (no holes)' },
          { qty: '1 pc', desc: 'Bedfoam (cover has no stain)' },
          { qty: '1 unit', desc: 'Closet' },
          { qty: '2 pcs', desc: 'Closet door handle' },
          { qty: '1 pc', desc: 'Chair' },
        ].map((item, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 items-center">
            <input name={`accQty_${i}`} defaultValue={item.qty} readOnly className="border rounded p-2 w-full bg-gray-50" />
            <input name={`accDesc_${i}`} defaultValue={item.desc} readOnly className="border rounded p-2 w-full bg-gray-50" />
            <input name={`accPropNo_${i}`} placeholder="Property #" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        ))}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Student’s Name and Signature</label>
            <input name="accStudentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" name="accStudentDate" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Parent’s/Guardian’s Name and Signature</label>
            <input name="accParentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" name="accParentDate" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>
      </fieldset> */}
      
      </form>

    </div>
  )
}

export default studentSignIn