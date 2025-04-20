import React from 'react';

const ChargeSlipSection = () => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-6 font-zion text-sm text-gray-800">
      <h2 className="text-lg font-semibold text-[#4E0303] mb-4">Charge Slip</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6">
        <div>
          <span className="font-semibold">Name:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div>
          <span className="font-semibold">Course & Year:</span>
          <div className="border-b border-gray-400" />
        </div>
        <div>
          <span className="font-semibold">Payment for the month(s) of:</span>
          <div className="border-b border-gray-400" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">For the following:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Dormitory Rental:</span>
            <div className="w-40 border-b border-gray-400" />
          </div>
          <div className="flex justify-between">
            <span>Electric Bill:</span>
            <div className="w-40 border-b border-gray-400" />
          </div>
          <div className="flex justify-between">
            <span>Surcharge:</span>
            <div className="w-40 border-b border-gray-400" />
          </div>
          <div className="flex justify-between font-semibold">
            <span>Amount Due:</span>
            <div className="w-40 border-b border-gray-400" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="font-semibold">Assessed by:</span>
            <div className="border-b border-gray-400" />
          </div>
          <div>
            <span className="font-semibold">Cashier:</span>
            <div className="border-b border-gray-400" />
          </div>
          <div>
            <span className="font-semibold">O.R.# & Date:</span>
            <div className="border-b border-gray-400" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">List of Appliances</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">Item</th>
                <th className="p-2 border border-gray-300">QTY</th>
                <th className="p-2 border border-gray-300">AMT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Personal Computer/Laptop', '70.00'],
                ['Rechargeable Batteries', '35.00'],
                ['MP3/MP4/IPOD/PSP', '35.00'],
                ['Electric Fan', '35.00'],
                ['Study Lamp', '25.00'],
                ['Cellphone with charger', '20.00'],
                ['Printer/Scanner', '20.00'],
                ['Others (please indicate)', '']
              ].map(([item, amt], i) => (
                <tr key={i}>
                  <td className="p-2 border border-gray-300">{item}</td>
                  <td className="p-2 border border-gray-300">______</td>
                  <td className="p-2 border border-gray-300">{amt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end font-semibold">
        <span className="mr-2">TOTAL AMOUNT:</span>
        <div className="w-40 border-b border-gray-400" />
      </div>
    </div>
  );
};

export default ChargeSlipSection;
