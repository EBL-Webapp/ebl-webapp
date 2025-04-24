import React from 'react';

const OvernightSlipSection = () => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Overnight Slip</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6 text-xs sm:text-sm mt-6">
        {/* Permit Checkboxes */}
        <div>
          <div className="flex flex-wrap gap-4 sm:gap-3 mt-1">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#4E0303]" />
              <span className="ml-1">Overnight Permit</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-[#4E0303]" />
              <span className="ml-1">Weekend Permit</span>
            </label>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <label className="text-gray-600 text-[0.6rem] sm:text-xs block mb-1">From:</label>
            <input
              type="date"
              className="w-full border border-gray-400 rounded px-2 py-1 text-xs sm:text-sm"
            />
          </div>
          <div className="w-full">
            <label className="text-gray-600 text-[0.6rem] sm:text-xs block mb-1">To:</label>
            <input
              type="date"
              className="w-full border border-gray-400 rounded px-2 py-1 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="sm:col-span-2 mt-2">
          <label className="font-semibold block mb-1">Reason:</label>
          <input
            type="text"
            className="w-full border-b border-gray-400 focus:outline-none px-1 py-0.5"
          />
        </div>
      </div>

      {/* Certification */}
      <div className="text-justify italic mb-15 text-[0.6rem] sm:text-xs">
        I certify that the information that I provided above is true. It is understood that by submitting this request, I should come back to the dormitory on the date specified; otherwise, I shall be sanctioned accordingly. It has also come to my understanding that I should hold full responsibility over my personal safety while I am outside dormitory premises.
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-6 gap-x-8">
        <div className="text-center">
          <div className="border-b border-gray-400 w-2/3 mx-auto mb-1" />
          <span className="block text-[0.6rem] sm:text-xs">Signature over Printed Name (Student)</span>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 w-2/3 mx-auto mb-1" />
          <span className="block text-[0.6rem] sm:text-xs">Signature over Printed Name (Parent/Guardian)</span>
        </div>
      </div>
    </div>
  );
};

export default OvernightSlipSection;
