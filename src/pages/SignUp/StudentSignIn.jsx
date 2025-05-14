import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase_client';

function studentSignIn() {

  const navigate = useNavigate();

  const handleSubmit = async () => {

    const {data : {session}, error: errorSession} = await supabase.auth.getSession();
    if(errorSession){
      console.log('An error incurred in getting session:', errorSession);
    }

    // We register the answers to table "studentMainInfo"
    const {error: insertionError} = await supabase
    .from('Students')
    .insert([{
      'userID' : session.user.id,
      'studentNumber' : formData.studentId,
    }])

    if(insertionError){
      console.log("error in inserting: ", insertionError.message);
    }

    // Insert mo din ang data

    navigate('/NoUpdate')
  }

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      


      <form className="space-y-6 p-4 max-w-4xl zain-regular mx-auto bg-white text-black">

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
          <div><label className="block text-sm">* Semester/Summer, A.Y.</label><input name="semester" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Full Name</label><input name="name" required onChange={handleChange} className="border rounded p-2 w-full" placeholder="Surname, First Name, Middle Name" /></div>
          <div><label className="block text-sm">* Sex</label><select name="sex" required onChange={handleChange} className="border rounded p-2 w-full"><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
          <div><label className="block text-sm">* Age</label><input type="number" name="age" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Student’s ID No.</label><input name="studentId" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Course</label><input name="course" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
          <div><label className="block text-sm">* Year Level</label><input name="yearLevel" required onChange={handleChange} className="border rounded p-2 w-full" /></div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm">Name of Father</label><input name="fatherName" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Occupation</label><input name="fatherOccupation" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="fatherAge" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="fatherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="fatherContact" onChange={handleChange} className="border rounded p-2 w-full" /></div>
          </div>
          {/* Mother */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm">Name of Mother</label><input name="motherName" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Occupation</label><input name="motherOccupation" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div><label className="block text-sm">Age</label><input type="number" name="motherAge" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Business Address</label><input name="motherBusinessAddress" onChange={handleChange} className="border rounded p-2 w-full" /></div>
            <div className="sm:col-span-2"><label className="block text-sm">Contact No.</label><input name="motherContact" onChange={handleChange} className="border rounded p-2 w-full" /></div>
          </div>
          {/* Guardian in Davao & Previous Stay */}
          <div className="space-y-4">
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
            <label className="block text-sm">Signature over Printed Name of Student</label>
            <input name="studentSignature" onChange={handleChange} className="border rounded p-2 w-full" placeholder="Sign here" />
          </div>
        </div>
      </fieldset>


      {/* Prompt for users */}
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm">
          Please complete all sections of this Student Housing Form. Fields marked with * are required.
        </p>
      </div>

      {/* Page 1: Application & Parent/Guardian (already implemented above) */}
      {/* ... existing page 1 code ... */}

      {/* Page 2: Information and Instruction Sheet (For Parents/Guardian) */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Information and Instruction Sheet (For Parents/Guardian)</legend>
        {[
          'Go home on weekends? If so, how often',
          'Go home on weekdays? When? If so, please specify',
          'Spend overnight/weekends with relatives and/or guardians',
          'Spend overnight with friends or dormmates',
          'Join school-related field trips/picnics/excursions',
          'Join organizations/fraternities/sororities',
          'Join demonstrations or rallies',
          'Does he/she have illness(es) we must know? If so, please elaborate',
        ].map((q, i) => (
          <div key={i} className="space-y-1">
            <span className="block text-sm">{i + 1}. {q}</span>
            <input
              type="text"
              name={`instruction_${i + 1}`}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Your response"
            />
          </div>
        ))}
        <div className="mt-2">
          <label className="block text-sm">Additional Instructions or Information:</label>
          <textarea
            name="additionalInstructions"
            onChange={handleChange}
            className="border rounded p-2 w-full"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm">Parent’s Printed Name</label>
            <input name="infoParentName" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Signature</label>
            <input name="infoParentSignature" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Date Accomplished</label>
            <input type="date" name="infoDate" onChange={handleChange} className="border rounded p-2 w-full" />
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
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Signature over Printed Name of Resident</label>
            <input name="applianceResidentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Signature over Printed Name of Parent</label>
            <input name="applianceParentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>
      </fieldset>

      {/* Page 5-6: Dormitory Agreement */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Dormitory Agreement</legend>
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Period From</label>
              <input type="date" name="agreementFrom" onChange={handleChange} className="border rounded p-2 w-full" />
            </div>
            <div>
              <label className="block text-sm">Until</label>
              <input type="date" name="agreementUntil" onChange={handleChange} className="border rounded p-2 w-full" />
            </div>
          </div>
        </div>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          {[
            'I shall abide by dormitory rules and regulations.',
            'I shall pay two months advance dormitory fee and two months advance electrical fee upon admission.',
            'I shall settle all obligations two weeks before final exams.',
            'Failure to pay two consecutive months will cancel my privilege.',
            'Early leave before semester end incurs 50% fee unless excused.',
            'Reservation holds until first day of classes only.',
            'Dormitory authorities may inspect my room as needed.',
            'Remove belongings during vacation; management not liable for losses.',
            'Causes for dismissal include offenses, non-payment, misconduct.',
          ].map((text, idx) => <li key={idx}>{text}</li>)}
        </ol>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Signature over Printed Name of Resident</label>
            <input name="agreementResidentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Signature over Printed Name of Parent</label>
            <input name="agreementParentSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>
      </fieldset>

      {/* Page 7: Privacy Notice Acknowledgement */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Privacy Notice Acknowledgement</legend>
        <p className="text-sm mb-2">
          I have read the University of the Philippines’ Privacy Notice for Students and consent to processing of my personal and sensitive personal information.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Name and Signature of Student</label>
            <input name="privacyNameSign" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" name="privacyDate" onChange={handleChange} className="border rounded p-2 w-full" />
          </div>
        </div>
      </fieldset>

      {/* Page 8-9: Acknowledgement of Accountability Form */}
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
      </fieldset>
      
      </form>

      <div className='w-[100%] bg-white pb-5 flex justify-center'>
          <button className=' w-[25%] align-center p-2 bg-[#4E0303] text-white rounded-xl marcellus-sc-regular' onClick={() => handleSubmit()}>Submit</button>
      </div>

    </div>
  )
}

export default studentSignIn