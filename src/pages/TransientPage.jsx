import React from "react";

const DormitoryTransientForm = () => {
  return (
    <div className="max-w-5xl mx-auto text-black bg-white p-8 rounded-2xl shadow-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-bold leading-tight">
          UNIVERSITY OF THE PHILIPPINES MINDANAO <br />
          OFFICE OF STUDENT AFFAIRS <br />
          DORMITORY TRANSIENT FORM
        </h2>
      </div>

      {/* Checkboxes for Dorm Options */}
      <div className="flex space-x-6">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span>EBL DORM</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span>ILC</span>
        </label>
      </div>

      {/* Input Fields */}
      {[
        "Name of Occupant",
        "Complete Address",
        "Contact Number",
        "Agency connected",
        "Person to be contacted in case of emergency and his/her contact number"
      ].map((label) => (
        <div key={label}>
          <label className="block font-medium mb-1">{label}:</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
          />
        </div>
      ))}

      {/* Requested Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Requested Date of Stay (From):</label>
          <input type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">To:</label>
          <input type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
        </div>
      </div>

      {/* How Many */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">How many (Male):</label>
          <input type="number" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">How many (Female):</label>
          <input type="number" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
        </div>
      </div>

      {/* Payment */}
      <div>
        <label className="block font-medium mb-2">Payment:</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="form-radio" />
            <span>Cash</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" className="form-radio" />
            <span>Waived</span>
          </label>
          <p className="text-sm text-gray-500 italic">
            (If waived, attach Chancellor’s Approved Letter before check-in)
          </p>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block font-medium mb-1">Purpose:</label>
        <textarea
          className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24"
        />
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          "Requested by (UP Mindanao Personnel)",
          "Endorsed by (Unit Head/Chief)",
          "Recommended for Approval (Dormitory Manager)",
          "Approved by (OSA Director)",
        ].map((label, index) => (
          <div key={index}>
            <label className="block font-medium mb-2">{label}:</label>
            <div className="border-b border-gray-400 h-10 mb-1" />
            <p className="text-sm text-gray-600 italic">Signature over Printed Name & Date</p>
          </div>
        ))}
      </div>

      {/* Fees */}
      <div className="text-sm text-gray-700 space-y-1">
        <p>Transient Fee: ₱300.00 per head/day (ILC)</p>
        <p>Transient Fee: ₱200.00 per head/day (EBL)</p>
        <p>
          Beddings and towel (must be paid in cash at EBL C) ₱100.00 –
          <span className="ml-4">YES ___  NO ___</span>
        </p>
      </div>
    </div>
  );
};

export default DormitoryTransientForm;
