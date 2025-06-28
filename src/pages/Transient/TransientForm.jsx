import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../../supabase_client';
import { useRedirect } from '../../redirect'

const DormitoryTransientForm = () => {
  const [towel, setTowel] = useState(""); // yes or no
  const [userKey, set_userKey] = useState('')

  const redirect = useRedirect()
  const navigate = useNavigate()

  const get_session_data = async() => {
    const user_session_unparsed = localStorage.getItem("user_session_data")
    const user_session = JSON.parse(user_session_unparsed)
    if (!user_session){
      alert('You are not logged in')
      navigate('/')
    } else {
      get_userKey(user_session)
    }
  }

  const get_userKey = async (user_session) => {
    const {data, error} = await supabase.from('Transient').select('transientID').eq("userID", user_session.session.user.id)
    if(error && error.message){
      console.log("An error in getting user key: ", error.message)
    }
    set_userKey(data[0].transientID)
  }

  const handle_submit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const values = {
      nameOfOccupant : formData.get("name_of_occupant"),
      completeAddress : formData.get("complete_address"),
      contactNumber : formData.get("contact_number"),
      agencyConnected : formData.get("agency_connected"),
      emergencyContact : formData.get("emergency_contact"),
    }


    // In here we finally submit it to supabase
    // In here we update their info:
    const {data : transient_data, error : transient_error} = await supabase.from("Transient").update(values).eq("transientID", userKey)
    if(transient_error){
      console.log("There was an error in submitting your data", transient_data.message)
      return
    }

    const values_2 = {
      transientID : userKey,
      requestDateTo : formData.get("to_date"),
      requestDateFrom : formData.get("from_date"),
      no_Males : formData.get("how_many_males"),
      no_Females : formData.get("how_many_females"),
      purposeOfStay : formData.get("purpose"),
      isBedding_and_Towel : formData.get("towel") === "yes" ? true : false,
      isCash : formData.get("payment") === "Cash" ? true : false,
      isWaived : formData.get("payment") === "Waived" ? true : false,
      isEBL : formData.get("EBL/ILC") === "EBL" ? true : false,
      isILC : formData.get("EBL/ILC") === "ILC" ? true : false,
    }

    const {data : transient_request_data, error : transient_request_error} = await supabase.from('Transient_Request').insert(values_2)
    if(transient_request_error && transient_request_error.message){
      console.log("There was an error in inserting the information in Transient_Request table: ", transient_request_error.message)
      return
    }
    alert("Your information was succesfully sent to the admins!")

    // In the end the user must be redirected
    navigate('/transient')
  }

  useEffect(() => {
    redirect('transient')
    get_session_data()
  }, [])

  return (
    <div className="max-w-5xl mx-auto text-black bg-white p-8 rounded-2xl shadow-md space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-base sm:text-lg font-bold leading-tight">
          UNIVERSITY OF THE PHILIPPINES MINDANAO <br />
          OFFICE OF STUDENT AFFAIRS <br />
          DORMITORY TRANSIENT FORM
        </h2>
      </div>

      <form onSubmit={handle_submit}>
        {/* Checkboxes for Dorm Options */}
        <div className="flex space-x-6 text-sm sm:text-base">
          <label className="flex items-center space-x-2">
            <input value="EBL" type="radio" name="EBL/ILC" className="form-radio" required />
            <span>EBL DORM</span>
          </label>
          <label className="flex items-center space-x-2">
            <input value="ILC" type="radio" name="EBL/ILC" className="form-radio" required />
            <span>ILC</span>
          </label>
        </div>

        {/* Input Fields */}
        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">Name of Occupant:</label>
          <input
            type="text"
            name="name_of_occupant"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">Complete Address:</label>
          <input
            type="text"
            name="complete_address"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">Contact Number:</label>
          <input
            type="text"
            name="contact_number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">Agency connected:</label>
          <input
            type="text"
            name="agency_connected"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-sm sm:text-base">
            Person to be contacted in case of emergency and his/her contact number:
          </label>
          <input
            type="text"
            name="emergency_contact"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm sm:text-base"
          />
        </div>


        {/* Requested Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <label className="block font-medium mb-1">Requested Date of Stay (From):</label>
            <input name="from_date" type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">To:</label>
            <input name="to_date" type="date" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
        </div>

        {/* How Many */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <label className="block font-medium mb-1">How many (Male):</label>
            <input name="how_many_males" type="number" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
          <div>
            <label className="block font-medium mb-1">How many (Female):</label>
            <input name="how_many_females" type="number" className="w-full border border-gray-300 rounded-xl px-4 py-2" />
          </div>
        </div>

        {/* Payment */}
        <div className="text-sm sm:text-base">
          <label className="block font-medium mb-2">Payment:</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" value="Cash" className="form-radio" />
              <span>Cash</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" value="Waived" className="form-radio" />
              <span>Waived</span>
            </label>
            <p className="text-sm text-gray-500 italic">
              (If waived, attach Chancellor’s Approved Letter before check-in)
            </p>
          </div>
        </div>

        {/* Purpose */}
        <div className="text-sm sm:text-base">
          <label className="block font-medium mb-1">Purpose:</label>
          <input type="textarea" name="purpose" className="w-full border border-gray-300 rounded-xl px-4 py-2 h-24" />
        </div>

        {/* Fees */}
        <div className="text-xs sm:text-sm text-gray-700 space-y-1">
          <p>Transient Fee: ₱300.00 per head/day (ILC)</p>
          <p>Transient Fee: ₱200.00 per head/day (EBL)</p>
          <div className="flex items-center space-x-4 mt-2">
            <span>Beddings and towel (₱100.00):</span>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="towel"
                value="yes"
                checked={towel === "yes"}
                onChange={() => setTowel("yes")}
                className="form-radio"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="towel"
                value="no"
                checked={towel === "no"}
                onChange={() => setTowel("no")}
                className="form-radio"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <Link
            to="/transient"
            className="bg-gray-200 text-black px-6 py-2 rounded-xl hover:bg-gray-300 transition text-xs sm:text-sm"
          >
            Back to Transient Page
          </Link>
          <button
            type="submit"
            disabled={!userKey}
            className="bg-[#114516] text-white px-6 py-2 rounded-xl hover:bg-green-800 transition text-xs sm:text-sm"
          >
            Submit
          </button>
        </div>
      </form>

    </div>
  );
};

export default DormitoryTransientForm;
