import React, { useState } from "react";

export default function EditPayments() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);

  const handleOpenModal = () => setShowPaymentModal(true);
  const handleCloseModal = () => setShowPaymentModal(false);

  const handleOpenRateModal = () => setShowRateModal(true);
  const handleCloseRateModal = () => setShowRateModal(false);

  return (
    <div className="p-4 md:p-8 zain-regular">

      {/* Search & Change Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-12 mb-6">
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

        <div className="text-center sm:text-right">
          <button
            onClick={handleOpenRateModal}
            className="bg-[#4E0303] text-white px-4 py-2 rounded-2xl hover:bg-red-900"
          >
            Change Base Rate
          </button>
        </div>
      </div>

      {/* Payment Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-2xl">
        <table className="min-w-full text-base sm:text-lg">
          <thead className="bg-[#114516] text-white">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Student Number</th>
              <th className="text-left px-4 py-3">Payment Status</th>
              <th className="text-center px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-black">
             {/* dummy data */}
             {[1, 2, 3].map((id) => {
              const isPaid = id % 2 === 1; // example: alternate paid/unpaid
              return (
                <tr key={id} className="border-t border-gray-200 text-sm sm:text-base">
                  <td className="px-4 py-3">John Doe {id}</td>
                  <td className="px-4 py-3">{id}1234567</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-18 sm:w-24 text-center px-3 py-1 rounded-2xl border ${
                        isPaid
                          ? "border-green-600 text-green-700 bg-green-50"
                          : "border-red-600 text-red-700 bg-red-50"
                      }`}
                    >
                      {isPaid ? "PAID" : "UNPAID"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={handleOpenModal}
                      className="bg-[#4E0303] text-white px-3 py-1 rounded-2xl hover:bg-red-900"
                    >
                      Edit Payment
                    </button>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-2xl p-6 space-y-2 sm:space-y-4 zain-regular">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-base">
              {/* Left Column */}
              <div>
                <div className="mb-1 sm:mb-3">
                  <label>Name:</label>
                  <div className="border-b border-black w-full"></div>
                </div>
                <div className="mb-1 sm:mb-3">
                  <label>Course & Year:</label>
                  <div className="border-b border-black w-full"></div>
                </div>
                <div className="mb-1 sm:mb-3">
                  <label>Payment for the month(s) of:</label>
                  <div className="border-b border-black w-full"></div>
                </div>

                <p className="mb-1 font-semibold mt-2 sm:mt-6">For the following:</p>
                {["Dormitory Rental", "Electric Bill", "Surcharge", "Amount Due"].map((item) => (
                  <div className="flex justify-between mb-1 sm:mb-2" key={item}>
                    <span>{item}:</span>
                    <div className="border-b border-black w-2/3 ml-2"></div>
                  </div>
                ))} 

                <div className="mt-2 sm:mt-6 space-y-1 sm:space-y-3">
                  {["Assessed by", "Cashier", "O.R.# & Date"].map((label) => (
                    <div key={label}>
                      <label>{label}:</label>
                      <div className="border-b border-black w-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <p className="font-semibold mb-1 sm:mb-2">List of Appliances</p>
                <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b border-black pb-1 text-xs sm:text-base">
                  <span className="col-span-2">Appliance</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>

                {[
                  ["Personal Computer/Laptop", "70.00"],
                  ["Rechargeable Batteries", "35.00"],
                  ["MP3/MP4/IPOD/PSP", "35.00"],
                  ["Electric Fan", "35.00"],
                  ["Study Lamp", "25.00"],
                  ["Cellphone with charger", "20.00"],
                  ["Printer/Scanner", "20.00"],
                  ["Others (please indicate)", ""],
                ].map(([item, amt]) => (
                  <div className="grid grid-cols-4 gap-1 sm:gap-2 items-center mb-1 sm:mb-2 mt-1 sm:mt-3 text-0.6rem sm:text-sm" key={item}>
                    {item === "Others (please indicate)" ? (
                      <>
                        <span className="col-span-2">{item}:</span>
                        <input type="text" className="col-span-2 border rounded px-2 py-1" placeholder="Specify..." />
                      </>
                    ) : (
                      <>
                        <span className="col-span-2">{item}:</span>
                        <input type="number" className="border rounded w-full text-center" />
                        <span>{amt}</span>
                      </>
                    )}
                  </div>
                ))}

                <div className="mt-2 sm:mt-6 flex justify-between font-semibold">
                  <span>TOTAL AMOUNT:</span>
                  <div className="border-b border-black w-40"></div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-xs sm:text-base flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
              <button onClick={handleCloseModal} className="bg-[#4E0303] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-red-900">
                Cancel
              </button>
              <button className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-900 hover:text-white">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Base Rate Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-xl p-6 space-y-2 sm:space-y-4 zain-regular">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-base">
              {/* Left Column */}
              <div>
              {["Dormitory Rental", "Electric Bill", "Surcharge", "Amount Due"].map((item) => (
                  <div className="flex justify-between mb-1 sm:mb-2" key={item}>
                    <span>{item}:</span>
                    <div className="border-b border-black w-2/3 ml-2"></div>
                  </div>
                ))} 

                <p className="mb-1 font-semibold mt-4 sm:mt-6">Add Appliance</p>

               <div className="border border-gray-300 px-4 py-4 rounded-2xl">
                <div className="mb-1 sm:mb-3">
                    <label>Appliance Name:</label>
                    <input
                      type="text"
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                      placeholder="e.g., Hair Dryer"
                    />
                  </div>
                  <div className="mb-2 sm:mb-4">
                    <label>Appliance Value:</label>
                    <input
                      type="number"
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                      placeholder="e.g., 45.00"
                    />
                  </div>
                  <div className="flex justify-center">
                  <button className="border border-[#114516] text-[#114516] px-3 mt-2 text-0.6rem sm:text-sm sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800">
                    Add Appliance
                  </button>
                </div>
               </div>
              </div>

              {/* Right Column */}
              <div>
                <p className="font-semibold mb-1 sm:mb-2">List of Appliances</p>
                <div className="grid grid-cols-2 gap-2 text-sm font-medium border-b border-black pb-1 text-xs sm:text-base">
                  <span>Appliance</span>
                  <span className="ml-8">AMT</span>
                </div>

                {[
                  ["Personal Computer/Laptop", "70.00"],
                  ["Rechargeable Batteries", "35.00"],
                  ["MP3/MP4/IPOD/PSP", "35.00"],
                  ["Electric Fan", "35.00"],
                  ["Study Lamp", "25.00"],
                  ["Cellphone with charger", "20.00"],
                  ["Printer/Scanner", "20.00"],
                ].map(([item, amt]) => (
                  <div
                    className="grid grid-cols-2 gap-2 items-center mb-1 sm:mb-2 text-[0.6rem] sm:text-sm"
                    key={item}
                  >
                    <span>{item}:</span>
                    <span className="ml-8">{amt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="text-xs sm:text-base flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
              <button
                onClick={handleCloseRateModal}
                className="bg-[#4E0303] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-red-900"
              >
                Cancel
              </button>
              <button className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
