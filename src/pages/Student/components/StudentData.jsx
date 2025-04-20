import React from 'react';
// import { Eye, Pencil } from 'lucide-react';

const StudentData = ({ student = {} }) => {
  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-6 font-zion text-sm text-gray-800">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-[#4E0303]">Student Information</h2>
        <div className="flex gap-2">
          {/* Replace with actual icons/components */}
          <button title="View" className="text-[#4E0303] hover:text-red-800 text-sm !bg-transparent">
            {/* <Eye size={18} /> */} View
          </button>
          <button title="Edit" className="text-[#4E0303] hover:text-red-800 text-sm !bg-transparent">
            {/* <Pencil size={18} /> */} Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <div className="flex flex-col text-left">
          <span className="font-semibold">Full name:</span>
          <span>{student.fullName || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Year and Degree Program:</span>
          <span>{student.program || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Student Number:</span>
          <span>{student.studentNumber || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Email:</span>
          <span>{student.email || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Age:</span>
          <span>{student.age || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Gender:</span>
          <span>{student.gender || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Address:</span>
          <span>{student.address || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Room Number:</span>
          <span>{student.roomNumber || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Room Rate:</span>
          <span>{student.roomRate || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Check-in Date:</span>
          <span>{student.checkInDate || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Additional Appliances:</span>
          <span>{student.appliances || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Emergency Contact Person:</span>
          <span>{student.emergencyContact || '—'}</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold">Phone Number:</span>
          <span>{student.phoneNumber || '—'}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentData;
