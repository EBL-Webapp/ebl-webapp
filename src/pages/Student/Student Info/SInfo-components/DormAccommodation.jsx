import React, { useState } from "react";

const DormitoryAccommodation = () => {
  const [formData, setFormData] = useState({
    // Student Info
    name: "",
    age: "",
    sex: "",
    studentIdNumber: "",
    course: "",
    yearLevel: "",
    dob: "",
    pob: "",
    contactNumber: "",
    // Parent/Guardian Info
    fatherName: "",
    fatherAge: "",
    fatherOccupation: "",
    fatherBusinessAddress: "",
    fatherContact: "",
    motherName: "",
    motherAge: "",
    motherOccupation: "",
    motherBusinessAddress: "",
    motherContact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 text-center">
        Dormitory Accommodation Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm mt-6"
      >
        <div className="sm:col-span-2">
          <h3 className="text-[#114516] font-semibold text-sm mb-2 border-b pb-1">
            Student Information
          </h3>
        </div>

        {[
          { id: "name", label: "Full Name" },
          { id: "studentIdNumber", label: "Student ID Number" },
          { id: "age", label: "Age" },
          { id: "sex", label: "Sex" },
          
          { id: "course", label: "Course" },
          { id: "yearLevel", label: "Year Level" },
          { id: "dob", label: "Date of Birth", type: "date" },
          { id: "pob", label: "Place of Birth" },
          { id: "contactNumber", label: "Contact Number", full: true },
        ].map(({ id, label, type = "text", full }, index) => (
          <div key={index} className={full ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="block mb-1 text-gray-600">
              {label}
            </label>
            <input
              id={id}
              name={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          </div>
        ))}

        <div className="sm:col-span-2 mt-6">
          <h3 className="text-[#114516] font-semibold text-sm mb-2 border-b pb-1">
            Parent/Guardian Information
          </h3>
        </div>

        {[
          { id: "fatherName", label: "Father's Name" },
          { id: "fatherAge", label: "Father's Age" },
          { id: "fatherOccupation", label: "Father's Occupation" },
          { id: "fatherBusinessAddress", label: "Father's Business Address" },
          { id: "fatherContact", label: "Father's Contact Number" },
          { id: "motherName", label: "Mother's Name" },
          { id: "motherAge", label: "Mother's Age" },
          { id: "motherOccupation", label: "Mother's Occupation" },
          { id: "motherBusinessAddress", label: "Mother's Business Address" },
          { id: "motherContact", label: "Mother's Contact Number" },
        ].map(({ id, label }, index) => (
          <div key={index}>
            <label htmlFor={id} className="block mb-1 text-gray-600">
              {label}
            </label>
            <input
              id={id}
              name={id}
              type="text"
              value={formData[id]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
            />
          </div>
        ))}

        <div className="sm:col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-[#114516] text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DormitoryAccommodation;
