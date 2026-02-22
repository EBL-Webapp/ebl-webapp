import React from "react";
import { useGlobalContext } from "../../../../context/GlobalContext";
import { useStudentInfo, useGuardianInfo } from "../../../../hooks/useStudents";
import Loading from "../../../../components/Loading";

const DormitoryAccommodation = () => {
  const { studentNumber } = useGlobalContext();

  const { data: information = {}, isLoading: isLoadingInfo } = useStudentInfo(studentNumber);
  const { data: parentInfo = [], isLoading: isLoadingGuardian } = useGuardianInfo(studentNumber);

  const isLoading = isLoadingInfo || isLoadingGuardian;

  if (isLoading) {
    return (
      <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 h-64 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 text-center">
        Dormitory Accommodation Form
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm mt-6">
        <div className="sm:col-span-2">
          <h3 className="text-[#114516] font-semibold text-sm mb-2 border-b pb-1">
            Student Information
          </h3>
        </div>

        <ReadOnlyField label="Full Name" value={information.studentName} />
        <ReadOnlyField label="Student ID Number" value={information.studentNumber} />
        <ReadOnlyField label="Date of Birth" value={information.dateOfBirth} />
        <ReadOnlyField label="Sex" value={information.Sex} />
        <ReadOnlyField label="Course" value={information.Course} />
        <ReadOnlyField label="Home Address" value={information.homeAddress} />
        <div className="sm:col-span-2">
          <ReadOnlyField label="Contact Number" value={information.contactNo} />
        </div>

        <div className="sm:col-span-2 mt-6">
          <h3 className="text-[#114516] font-semibold text-sm mb-2 border-b pb-1">
            Parent/Guardian Information
          </h3>
        </div>

        {parentInfo.length > 0 ? parentInfo.map((x) => (
          <div className="sm:col-span-2 border border-gray-200 rounded-xl p-4" key={x.guardianID}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReadOnlyField label="Name" value={x.Name} />
              <ReadOnlyField label="Occupation" value={x.Occupation} />
              <ReadOnlyField label="Business/Employment Address" value={x.businessAddress_or_employmentAddress} />
              <ReadOnlyField label="Contact Number" value={x.contactNumber} />
            </div>
          </div>
        )) : (
          <p className="text-gray-500 sm:col-span-2">No parent/guardian info found.</p>
        )}
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block mb-1 text-gray-600">{label}</label>
    <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
      {value || '—'}
    </div>
  </div>
);

export default DormitoryAccommodation;
