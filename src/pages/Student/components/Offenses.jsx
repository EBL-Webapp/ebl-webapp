import React from 'react';

const Offenses = ({ offenses = [] }) => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-6 font-zion text-sm text-gray-800">
      <h2 className="text-lg font-semibold text-[#4E0303] mb-4">Recorded Offenses</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-[#4E0303] text-xs uppercase border-b border-gray-300">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Reported By</th>
              <th className="px-4 py-2 text-left">Type of Offense</th>
            </tr>
          </thead>
          <tbody>
            {offenses.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500 text-sm">
                  No offenses reported.
                </td>
              </tr>
            ) : (
              offenses.map((offense, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{offense.date}</td>
                  <td className="px-4 py-2">{offense.reportedBy}</td>
                  <td className="px-4 py-2">{offense.type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Offenses;
