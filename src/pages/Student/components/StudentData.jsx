import {React, useEffect, useState} from 'react';
import { Eye, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../supabase_client';
import {getSession} from '../../../getSession';
import { fetchColumnValue } from '../../../fetchColumnValue';

const StudentData = ({ student = {} }) => {
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);

  const loadInfo = async () => {
    const session_temp = await getSession();
    const studentNumber_temp = await fetchColumnValue("Students", "userID", session_temp.session.user.id, "studentNumber");
    const {data, error} = await supabase.from("Application_for_Dorm_Accomodation").select("*").eq("studentNumber", studentNumber_temp);
    if(error){
      console.log("There was an error in gettig student information: ", error.message);
      return;
    }

    setInfo(data[0]);
    console.log("Data: ", data);
  };

  useEffect(() => {
    loadInfo();
  }, [])

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <div className="flex flex-row justify-between sm:items-start mb-4">
        <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">
          Student Information
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm">
        <Info label="Full name:" value={info.studentName} />
        <Info label="Degree Program:" value={info.Course} />
        <Info label="Student Number:" value={info.studentNumber} />
        <Info label="Email:" value={info.emailAddress} />
        <Info label="Date of Birth:" value={info.dateOfBirth} />
        <Info label="Sex:" value={info.Sex} />
        <Info label="Address:" value={info.homeAddress} />
        <Info label="Phone Number:" value={info.contactNo} />
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
