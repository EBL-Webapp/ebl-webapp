import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../../context/GlobalContext';
import { useStudentInfo } from '../../../hooks/useStudents';
import Loading from '../../../components/Loading';

const StudentData = () => {
  const navigate = useNavigate();
  const { studentNumber } = useGlobalContext();

  const { data: info, isLoading, error } = useStudentInfo(studentNumber);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 text-red-600">
        Error loading student information.
      </div>
    );
  }

  const studentInfo = info || {};

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <div className="flex flex-row justify-between sm:items-start mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
          Student Information
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm">
        <Info label="Full name:" value={studentInfo.studentName} />
        <Info label="Degree Program:" value={studentInfo.Course} />
        <Info label="Student Number:" value={studentInfo.studentNumber} />
        <Info label="Email:" value={studentInfo.emailAddress} />
        <Info label="Date of Birth:" value={studentInfo.dateOfBirth} />
        <Info label="Sex:" value={studentInfo.Sex} />
        <Info label="Address:" value={studentInfo.homeAddress} />
        <Info label="Phone Number:" value={studentInfo.contactNo} />
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
