import React from 'react';

const AcknowledgementForm = () => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
        Acknowledgement of Accountability Form
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6 text-xs sm:text-sm mt-6">
        <div>
          <span className="font-semibold">Name:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div>
          <span className="font-semibold">Course:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div>
          <span className="font-semibold">Room Number:</span>
          <div className="border-b border-gray-400" />
        </div>
      </div>

      <div className="mb-6 text-xs sm:text-sm">
        <h3 className="font-semibold mb-2">List of Provided Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100 text-xs sm:text-sm">
              <tr>
                <th className="p-2 border border-gray-300">Quantity</th>
                <th className="p-2 border border-gray-300">Unit</th>
                <th className="p-2 border border-gray-300">Description</th>
                <th className="p-2 border border-gray-300">Property Number</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', 'pc', 'Room key'],
                ['1', 'unit', 'Study Table'],
                ['', 'pcs', 'Jalousies (complete)'],
                ['', '', 'Window Screens (no holes)'],
                ['1', 'pc', 'Bedfoam (cover has no stain)'],
                ['1', 'unit', 'Closet'],
                ['2', 'pcs', 'Closet door handle'],
                ['1', 'pc', 'Chair']
              ].map(([qty, unit, desc], i) => (
                <tr key={i}>
                  <td className="p-2 border border-gray-300">{qty}</td>
                  <td className="p-2 border border-gray-300">{unit}</td>
                  <td className="p-2 border border-gray-300">{desc}</td>
                  <td className="p-2 border border-gray-300">______</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6 text-xs sm:text-sm space-y-3">
        <p>
          I hereby acknowledge that I have received the above-mentioned items/properties in good condition. I am liable for any damages or loss and will return the said items/properties complete and in good condition upon my check-out at the end of each semester.
        </p>
        <p>
          In case of loss or damage, I will pay or exchange the items/properties with a new one:
        </p>
        <ul className="ml-4 list-disc">
          <li>Room key – P60.00</li>
          <li>Jalousie – P100.00</li>
          <li>Closet door handle – P60.00</li>
          <li>Window Screens – P100.00</li>
          <li>Bedfoam stain – P300.00</li>
          <li>Chair – P500.00</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4 text-xs sm:text-sm">
        <div>
          <div className="border-b border-gray-400 h-6" />
          <span className="block text-center text-gray-600 mt-1">Student’s Name and Signature</span>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-2 py-1 w-full mb-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div>
          <div className="border-b border-gray-400 h-6" />
          <span className="block text-center text-gray-600 mt-1">Parent’s/Guardian’s Name and Signature</span>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md px-2 py-1 w-full mb-6"
          />
        </div>
      </div>

    </div>
  );
};

export default AcknowledgementForm;
