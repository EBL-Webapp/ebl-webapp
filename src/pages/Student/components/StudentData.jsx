import React from 'react';
import { Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentData = ({ student = {} }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <div className="flex flex-row justify-between sm:items-start mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
          Student Information
        </h2>
        <div className="flex flex-row gap-1 sm:gap-2 ">
          <button
            title="View"
            className="text-gray-500 hover:text-gray-500 !text-xs !bg-transparent flex items-center gap-1 !p-1"
          >
            <Eye size={14} /> View
          </button>
          <button
            title="Edit"
            className="text-gray-500 hover:text-red-500 !text-xs !bg-transparent flex items-center gap-1 !p-1"
          >
            <Pencil size={14} /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm">
        <Info label="Full name:" value={student.fullName} />
        <Info label="Year and Degree Program:" value={student.program} />
        <Info label="Student Number:" value={student.studentNumber} />
        <Info label="Email:" value={student.email} />
        <Info label="Age:" value={student.age} />
        <Info label="Gender:" value={student.gender} />
        <Info label="Address:" value={student.address} />
        <Info label="Room Number:" value={student.roomNumber} />
        <Info label="Room Rate:" value={student.roomRate} />
        <Info label="Check-in Date:" value={student.checkInDate} />
        <Info label="Additional Appliances:" value={student.appliances} />
        <Info label="Emergency Contact Person:" value={student.emergencyContact} />
        <Info label="Phone Number:" value={student.phoneNumber} />
      </div>

      {/* View All Info button - bottom right */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/student/student-info')}
          className="text-xs sm:text-sm text-white bg-[#114516] hover:bg-[#6b0b0b] px-4 py-1 rounded-md transition-colors"
        >
          View All Information
        </button>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex flex-col text-left">
    <span className="font-semibold">{label}</span>
    <span>{value || '—'}</span>
  </div>
);

export default StudentData;
