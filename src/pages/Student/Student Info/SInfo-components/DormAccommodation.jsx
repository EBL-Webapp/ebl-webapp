import React, { useState } from "react";

const DormitoryAccommodation = () => {
  const [formData, setFormData] = useState({
    yearLevel: "",
    degreeProgram: "",
    studentNumber: "",
    contactNumber: "",
    email: "",
    currentAddress: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationship: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2 text-center">
        Dormitory Accommodation Form
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-6 text-xs sm:text-sm">
        {[
          { id: "yearLevel", label: "Year Level" },
          { id: "degreeProgram", label: "Degree Program" },
          { id: "studentNumber", label: "Student Number" },
          { id: "contactNumber", label: "Contact Number" },
          { id: "email", label: "Email", type: "email" },
          { id: "currentAddress", label: "Current Address" },
          { id: "emergencyContactName", label: "Emergency Contact Name" },
          { id: "emergencyContactNumber", label: "Emergency Contact Number" },
          { id: "relationship", label: "Relationship to Emergency Contact", full: true },
        ].map(({ id, label, type = "text", full }, index) => (
          <div key={index} className={full ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="block mb-1 text-gray-600">{label}</label>
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

        <div className="sm:col-span-2 text-center mt-4">
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
