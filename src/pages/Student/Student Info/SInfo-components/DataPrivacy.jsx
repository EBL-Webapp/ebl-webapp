import React from 'react';

const DataPrivacy = () => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-5">Data Privacy Statement</h2>

      <p className="text-xs sm:text-sm mb-1 sm:mb-2">
        I have read the University of the Philippines’ Privacy Notice for Students.
      </p>

      <p className="text-xs sm:text-sm mb-1 sm:mb-2">
        I understand that for the UP System to carry out its mandate under the 1987 Constitution, the UP Charter, and other laws, that the University must necessarily process my personal and sensitive personal information.
      </p>

      <p className="text-xs sm:text-sm mb-1 sm:mb-2">
        Therefore, I recognize the authority of the University of the Philippines to process my personal and sensitive personal information, pursuant to the UP Privacy Notice and applicable laws.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4 text-xs sm:text-sm mt-8">
        <div>
          <div className="border-b border-gray-400 h-6" />
          <span className="block text-center text-gray-600 mt-1">Student’s Name and Signature</span>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-2 py-1 w-full mb-2"
          />
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
