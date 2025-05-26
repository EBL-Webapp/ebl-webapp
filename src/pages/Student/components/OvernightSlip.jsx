import supabase from "../../../supabase_client";
import React, { useState, useEffect } from "react";
import { getSession } from "../../../getSession";
import { fetchColumnValue } from "../../../fetchColumnValue";

const OvernightSlipSection = () => {

  useEffect(() => {
    fetchOvernightSlips();
  }, []);

  const [formData, setFormData] = useState({
    fromDate : '',
    toDate : '',
    reason : '',
    signature : '',
  });
  const [overnightSlips, setOvernightSlips] = useState([]);
  const [student_number, setStudent_number] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert datetime-local values to proper UTC timestamps
    const fromDateUTC = new Date(formData.fromDate).toISOString();
    const toDateUTC = new Date(formData.toDate).toISOString();
    
    const {error} = await supabase.from("Overnight_Excuse").insert({
      fromDate : fromDateUTC,
      toDate : toDateUTC,
      studentNumber : student_number,
      reason : formData.reason
    });

    if(error){
      console.log("Error in inserting the new data: ", error.message);
      return;
    }
    
    // Refresh the list after successful submission
    fetchOvernightSlips();
    
    // Reset form
    setFormData({
      fromDate : '',
      toDate : '',
      reason : '',
      signature : '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchOvernightSlips = async () => {
    const session_temp = await getSession();
    const student_num = await fetchColumnValue("Students", "userID", session_temp.session.user.id, "studentNumber");
    setStudent_number(student_num);
    const {data, error} = await supabase.from("Overnight_Excuse").select("*").eq("studentNumber", student_num);
    if (error){
      console.log("Error in fetching overnight slips: ", error.message);
      return;
    }

    setOvernightSlips(data || []);
    console.log("Overnight slips fetched: ", data);
  }

  // Helper function to render status badges
  const renderStatusBadge = (status, type) => {
    let bgColor, textColor, displayText;
    
    if (status === null) {
      bgColor = "bg-gray-400";
      textColor = "text-white";
      displayText = "Unevaluated";
    } else if (status === true) {
      bgColor = "bg-green-500";
      textColor = "text-white";
      displayText = "Approved";
    } else {
      bgColor = "bg-red-500";
      textColor = "text-white";
      displayText = "Denied";
    }
    
    return (
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-xl text-xs font-medium`}>
        {displayText}
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#4E0303] shadow-md rounded-lg p-4 sm:p-6 font-zion text-sm text-gray-800">
      <h2 className="text-sm sm:text-base font-semibold text-[#4E0303] mb-4 sm:mb-2">Overnight Slip</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-6 text-xs sm:text-sm mt-6">

          {/* Date Range Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="text-gray-600 text-[0.6rem] sm:text-xs block mb-1">From:</label>
              <input
                type="datetime-local"
                required
                value={formData.fromDate}
                onChange={handleChange}
                name='fromDate'
                className="w-full border border-gray-400 rounded px-2 py-1 text-xs sm:text-sm"
              />
            </div>
            <div className="w-full">
              <label className="text-gray-600 text-[0.6rem] sm:text-xs block mb-1">To:</label>
              <input
                type="datetime-local"
                required
                value={formData.toDate}
                name='toDate'
                onChange={handleChange}
                className="w-full border border-gray-400 rounded px-2 py-1 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Reason */}
          <div className="sm:col-span-2 mt-2">
            <label className="font-semibold block mb-1">Reason:</label>
            <input
              type="text"
              required
              value={formData.reason}
              name="reason"
              onChange={handleChange}
              className="w-full border-b border-gray-400 focus:outline-none px-1 py-0.5"
            />
          </div>
        </div>

        {/* Certification */}
        <div className="text-justify italic mb-15 text-[0.6rem] sm:text-xs">
          I certify that the information that I provided above is true. It is understood that by submitting this request, I should come back to the dormitory on the date specified; otherwise, I shall be sanctioned accordingly. It has also come to my understanding that I should hold full responsibility over my personal safety while I am outside dormitory premises.
        </div>
        
        <div className="flex justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-6 gap-x-8">
            <div className="text-center">
              <input
                type="text"
                required
                value={formData.signature}
                name="signature"
                onChange={handleChange}
                placeholder="Signature of Student"
                className="w-full border-b border-gray-400 focus:outline-none px-1 py-0.5 mb-2 text-xs sm:text-sm"
              />
              <span className="block text-[0.6rem] sm:text-xs">Write your name above to affirm your request</span>
            </div>
          </div>

          <button type='submit' className='bg-[#4E0303] text-white p-4 rounded-2xl mt-5 hover:bg-gray-500 m-3'>
            Submit
          </button>
        </div>
        {/* Signatures */}

      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-xs sm:text-sm border-b border-gray-300 text-[#4E0303] font-semibold">
              <th className="px-4 py-2 text-left">From</th>
              <th className="px-4 py-2 text-left">To</th>
              <th className="px-4 py-2 text-left">Approved?</th>
              <th className="px-4 py-2 text-left">Validated?</th>
            </tr>
          </thead>
          <tbody>
            {overnightSlips.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500 text-xs sm:text-sm">
                  No overnight slips submitted.
                </td>
              </tr>
            ) : (
              overnightSlips.map((slip, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-4 py-2">{new Date(slip.fromDate).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(slip.toDate).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {renderStatusBadge(slip.isApproved, 'approved')}
                  </td>
                  <td className="px-4 py-2">
                    {renderStatusBadge(slip.isValidated, 'validated')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OvernightSlipSection;