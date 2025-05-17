import React, { useState, useEffect } from "react";
import supabase from '../../../../supabase_client';
import { fetchColumnValue } from "../../../../fetchColumnValue";
import { getSession } from "../../../../getSession";

const DormitoryAccommodation = () => {

  const [information, setInformation] = useState({});
  const [parentInfo, setParentInfo] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  const getData = async () => {
    const session_temp = await getSession();
    const student_Number = await fetchColumnValue("Students", "userID", session_temp.session.user.id, "studentNumber");

    // Let's the accomodation form's values:
    const {data, error} = await supabase.from("Application_for_Dorm_Accomodation").select("*").eq("studentNumber", student_Number);
    if(error){
      console.log("Error in getting Application from data: ", error.message);
      return;
    }

    const {data : parentInfo_temp, error : error_parentInfo} = await supabase.from("guardianInformation").select("*").eq("studentNumber", student_Number);
    if(error_parentInfo){
      console.log("An error occured in getting parent info: ", error_parentInfo.message);
      return;
    }

    setParentInfo(parentInfo_temp);

    console.log(data);
    setInformation(data[0]);
  }

  useEffect(() => {
    getData();
  }, [])

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

          <div>
            <label className="block mb-1 text-gray-600">Full Name</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.studentName}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Student ID Number</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.studentNumber}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Date of Birth</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.dateOfBirth}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600"></label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.dateOfBirth}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Sex</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.Sex}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Course</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.Course}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Home Address</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.homeAddress}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-1 text-gray-600">Contact Number</label>
            <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
              {information.contactNo}
            </div>
          </div>

          <div className="sm:col-span-2 mt-6">
            <h3 className="text-[#114516] font-semibold text-sm mb-2 border-b pb-1">
              Parent/Guardian Information
            </h3>
          </div>

          {parentInfo.length > 0 ? parentInfo.map((x) => (
            <>
            <div className="border border-gray-200 rounded-xl p-4" key={x.guardianID}>

              <div>
                <label className="block mb-1 text-gray-600">Name</label>
                <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
                  {x.Name}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Occupation</label>
                <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
                  {x.Occupation}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Business Address</label>
                <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
                  {x.businessAddress_or_employmentAddress}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Contact Number</label>
                <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
                  {x.contactNumber}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-gray-600">Home Address</label>
                <div className="border border-gray-300 rounded-md px-2 py-1 w-full bg-gray-50">
                  {x.homeAddress}
                </div>
              </div>

            </div>
            </>
          )) :
            <p>No Parent info</p>
          }



          
        </div>
      </div>
    );
};

export default DormitoryAccommodation;
