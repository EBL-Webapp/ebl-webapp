import React from "react";

export default function StudentsArchive() {
  return (
    <div className="p-4 md:p-8 zain-regular">

      {/* Search Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 mb-6">
        {/* Search by Name */}
        <div className="flex flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by Name"
            className="border border-gray-300 rounded-2xl px-4 py-2 w-full text-black"
          />
          <button className="bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800">
            Search
          </button>
        </div>

        {/* Search by Student Number */}
        <div className="flex flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by Student Number"
            className="border border-gray-300 rounded-2xl px-4 py-2 w-full text-black"
          />
          <button className="bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800">
            Search
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-300 rounded-2xl">
        <table className="min-w-full border border-gray-300 rounded-2xl overflow-hidden text-base sm:text-lg">
          <thead className="bg-[#114516] text-white">
            <tr>
              <th className="text-left px-4 py-3">Student Name</th>
              <th className="text-left px-4 py-3">Student Number</th>
              <th className="text-left px-4 py-3">Archived Date</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {/* Dummy Data Row 1 */}
            <tr className="border-t border-gray-200 text-sm sm:text-base">
              <td className="px-4 py-3">John Doe</td>
              <td className="px-4 py-3">202301234</td>
              <td className="px-4 py-3">01/01/20</td>
              <td className="px-4 py-3 text-center sm:space-x-2 space-y-1">
                <button className="bg-[#114516]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-green-800">
                  Unarchive
                </button>
                <button className="bg-[#4E0303]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-red-900">
                  Delete
                </button>
              </td>
            </tr>
            {/* Dummy Data Row 2 */}
            <tr className="border-t border-gray-200 text-sm sm:text-base">
              <td className="px-4 py-3">Jane Smith</td>
              <td className="px-4 py-3">202305678</td>
              <td className="px-4 py-3">01/01/20</td>
              <td className="px-4 py-3 text-center sm:space-x-2 space-y-1">
                <button className="bg-[#114516]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-green-800">
                  Unarchive
                </button>
                <button className="bg-[#4E0303]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-red-900">
                  Delete
                </button>
              </td>
            </tr>
            {/* Dummy Data Row 3 */}
            <tr className="border-t border-gray-200 text-sm sm:text-base">
              <td className="px-4 py-3">Michael Brown</td>  
              <td className="px-4 py-3">202201234</td>
              <td className="px-4 py-3">01/01/20</td>
              <td className="px-4 py-3 text-center sm:space-x-2 space-y-1">
                <button className="bg-[#114516]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-green-800">
                  Unarchive
                </button>
                <button className="bg-[#4E0303]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-red-900">
                  Delete
                </button>
              </td>
            </tr>
            {/* Dummy Data Row 4 */}
            <tr className="border-t border-gray-200 text-sm sm:text-base">
              <td className="px-4 py-3">Emily Davis</td>
              <td className="px-4 py-3">202307890</td>
              <td className="px-4 py-3">01/01/20</td>
              <td className="px-4 py-3 text-center sm:space-x-2 space-y-1">
                <button className="bg-[#114516]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-green-800">
                  Unarchive
                </button>
                <button className="bg-[#4E0303]/90 text-white w-18 sm:w-20 px-3 py-1 rounded-2xl hover:bg-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
