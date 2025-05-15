import React from 'react';
import Footer from '../../../components/Footer';

function RequestCard() {
  return (
    <div className="border-2 border-gray-400 rounded-2xl p-3 sm:p-4 w-full max-w-md bg-white shadow">
      {/* Card Details */}
      <div className="space-y-1 sm:space-y-2 text-gray-800 text-sm sm:text-base">
        <p className="font-bold text-black">Occupant Name: <span className="font-normal">________________________________</span></p>
        <p className="font-medium">Contact Number: <span className="font-normal">_______________________________</span></p>
        <p className="font-medium">Which Facility: <span className="font-normal">__________________________________</span></p>
        <p className="font-medium">Number of People: <span className="font-normal">_____________________________</span></p>
        <p className="font-medium">Payment: <span className="font-normal">_______________________________________</span></p>
        <p className="font-medium">From: <span className="font-normal">__________</span> to <span className="font-normal">__________</span></p>
        <p className="font-medium">Reason/Purpose: <span className="font-normal">_______________________________</span></p>
      </div>

      {/* Action buttons */}
      <div className="mt-3 sm:mt-4 flex justify-center gap-8 sm:gap-16">
        <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-sm sm:text-base">Confirm</button>
        <button className="bg-[#700000] hover:bg-red-800 text-white font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-sm sm:text-base">Cancel</button>
      </div>
    </div>
  );
}

function AdminPage_transientRequests() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow px-2 sm:px-4 py-2 sm:py-4">
        <div className="container mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center sm:text-left">Transient Requests</h1>
          
          {/* Grid layout with scrollable container */}
          <div className="overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mx-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <RequestCard key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPage_transientRequests;