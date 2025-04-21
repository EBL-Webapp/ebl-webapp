import React from 'react';

const OvernightSlipSection = () => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6  font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Overnight Slip</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6 text-xs sm:text-sm mt-6">
        <div>
          <span className="font-semibold">Destination:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div>
          <span className="font-semibold">Date:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div className="sm:col-span-2">
          <span className="font-semibold">Reason:</span>
          <div className="border-b border-gray-400" />
        </div>
      </div>

      <div className="text-justify c italic mb-15 text-[0.6rem] sm:text-xs">
        I certify that the information that I provided above is true. It is understood that by submitting this request, I should come back to the dormitory on the date specified; otherwise, I shall be sanctioned accordingly. It has also come to my understanding that I should hold full responsibility over my personal safety while I am outside dormitory premises.
      </div>

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
