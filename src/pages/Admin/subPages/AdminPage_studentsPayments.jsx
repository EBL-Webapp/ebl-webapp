import React, { useState, useEffect } from "react";
import supabase from "../../../supabase_client";
import { fetchColumnValue } from "../../../fetchColumnValue";
import {getSession} from "../../../getSession";


export default function EditPayments() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [staticCharges, setStaticCharges] = useState({
    rent : 500,
    surcharge : 25
  })
  const [applianceForm, setApplianceForm] = useState({
    applianceName : "",
    addApplianceCharge : ""
  });
  const [list_of_appliances, set_list_of_appliances] = useState([]);
  const [adminID, setAdminID] = useState("");
  const [searched_list, set_searched_list] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentNumberFocus, setStudentNumberFocus] = useState({
      studentNumber : "",
      surplus_deficit_payment : 0,
      studentName : "",
      payment : 0
  });


  const handleOpenModal = (studentNum, dues, name) => {
    setShowPaymentModal(true);
    setStudentNumberFocus({
      studentNumber : studentNum,
      surplus_deficit_payment : dues,
      studentName : name,
      payment : 0,
    });
  };
  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setStudentNumberFocus({
      studentNumber : "",
      surplus_deficit_payment : 0,
      studentName : "",
      payment : 0,
    })
  };
  const handleCloseModal_save = async () => {
    setShowPaymentModal(false);
    // Let's handle the payment insertion and updating the student's deficit
    const {error : error_inserting} = await supabase
      .from("studentPayment")
      .insert({
        studentNumber : studentNumberFocus.studentNumber,
        adminID : adminID,
        paymentAmount : studentNumberFocus.payment
      });

      if(error_inserting){
        alert("Error in inserting the payment: " + error_inserting.message);
        return;
      }

      // Let's update the student's payment status
      // Update student's balance

    const newBalance  = parseFloat(studentNumberFocus.payment) + parseFloat(studentNumberFocus.surplus_deficit_payment);

    // Now we insert the new value
    const {error : error_in_updating} = await supabase
      .from("Students")
      .update({
        surplus_deficit_payment : newBalance
      })
      .eq("studentNumber", studentNumberFocus.studentNumber)
      ;

    if(error_in_updating){
      alert("Error in updating the new payment: " + error_in_updating.message);
      return;
    }

    setStudentNumberFocus(prev => ({
      ...prev,
      surplus_deficit_payment: newBalance
    }));


    set_searched_list(prev =>
      prev.map((each) =>
        each.studentNumber === studentNumberFocus.studentNumber
          ? {
              ...each,
              surplus_deficit_payment: newBalance,
            }
          : each
      )
    );

    set_students_list(prev =>
      prev.map((each) =>
        each.studentNumber === studentNumberFocus.studentNumber
          ? {
              ...each,
              surplus_deficit_payment: newBalance,
            }
          : each
      )
);




    console.log("This is the studentFocus: ", studentNumberFocus);


    setStudentNumberFocus({
      studentNumber : "",
      surplus_deficit_payment : 0,
      studentName : "",
      payment : 0,
    })
  };

  const handleOpenRateModal = () => setShowRateModal(true);
  const handleCloseRateModal = () => setShowRateModal(false);

  const [students_list, set_students_list] = useState([]);

  const getCharges = async () => {
    const {data , error} = await supabase.from("staticCharge").select("*");
    if(error){
      console.log("There was an error in getting the charges: ", error.message);
      return;
    }
    
    const chargesObject = Object.fromEntries(
      data.map(item => [item.chargeName, item.charge])
    );
    setStaticCharges(chargesObject);
    
  };

  const getAppliances = async () => {
    const {data , error} = await supabase
      .from("list_of_appliances")
      .select("*");

    if(error){
      console.log("There was an error in getting the appliances: ", error.message);
      return;
    }

    set_list_of_appliances(data);
  }

  const deleteAppliance = async (id) => {
    const {error} = await supabase
      .from("list_of_appliances")
      .delete()
      .eq("applianceID", id);

    if(error){
      alert("Error in deleting row: " + error.message);
      return;
    }

    set_list_of_appliances(prev => prev.filter(appliance => appliance.applianceID != id));
  }

  const submitAppliance = async (event) => {
    event.preventDefault();
    const {data, error} = await supabase
      .from("list_of_appliances")
      .insert([{
        applianceName : applianceForm.applianceName,
        cost : applianceForm.addApplianceCharge
      }])
      .select("applianceID")
      ;

    if(error){
      alert("Error in inserting your application: " + error.message);
      return;
    } else {
      alert("Your appliance is added successfully!");
      setApplianceForm({
        applianceName : "",
        addApplianceCharge : ""
      })

      set_list_of_appliances(prev => [
        ...prev,
        {
          applianceID : data[0].applianceID,
          applianceName : applianceForm.applianceName,
          cost :  applianceForm.addApplianceCharge
        }
      ])
      return;
    }
  }

  const updateForm_addAppliance = (x) => {
    const {value, name} = x.target;

    setApplianceForm({
      ...applianceForm,
      [name] : value
    });
    
  };

  const makeCharges = async () => {
    alert("Processing your request please wait...")
    const { data, error } = await supabase
      .from("appliance_per_student")
      .select(`
        studentNumber,
        quantity,
        isActive,
        applianceID,
        list_of_appliances (
          cost
        )
      `)
      .eq("isActive", true);

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    const chargesMap = {};

    data.forEach(entry => {
      const student = entry.studentNumber;
      const quantity = entry.quantity || 1;
      const cost = entry.list_of_appliances?.cost || 0;

      if (!chargesMap[student]) {
        chargesMap[student] = 0;
      }

      chargesMap[student] += quantity * cost;
    });

      // ✅ Add ₱500 rent for every student
    Object.keys(chargesMap).forEach(studentNumber => {
      chargesMap[studentNumber] += 500;
    });

    // ✅ Calculate due date once
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 31);
    const formattedDueDate = dueDate.toISOString().split("T")[0];

    // ✅ Build charge records
    const charges = Object.entries(chargesMap).map(([studentNumber, totalCost]) => ({
      studentNumber,
      amount: totalCost,
      dueDate: formattedDueDate,
      adminID
    }));

    // ✅ Insert into studentCharge
    const { data: insertData, error: insertError } = await supabase
      .from("studentCharge")
      .insert(charges);

    if (insertError) {
      console.error("Insert failed:", insertError.message);
      return;
    } else {
      console.log("Inserted charges:", insertData);
    }

    // ✅ Fetch current surplus/deficit balances
    const { data: studentsData, error: studentsError } = await supabase
      .from("Students")
      .select("studentNumber, surplus_deficit_payment");

    if (studentsError) {
      console.error("Failed to fetch students' balances:", studentsError.message);
      return;
    }

    // ✅ Create map of current balances
    const balanceMap = {};
    studentsData.forEach(student => {
      balanceMap[student.studentNumber] = student.surplus_deficit_payment || 0;
    });

    // ✅ Prepare updates to each student's balance
    const updates = Object.entries(chargesMap).map(([studentNumber, cost]) => ({
      studentNumber,
      surplus_deficit_payment: (balanceMap[studentNumber] || 0) - cost
    }));

    // ✅ Update each student record
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from("Students")
        .update({ surplus_deficit_payment: update.surplus_deficit_payment })
        .eq("studentNumber", update.studentNumber);

      if (updateError) {
        console.error(`Failed to update balance for ${update.studentNumber}:`, updateError.message);
      }
    }

    console.log("Finished updating surplus/deficit balances.");
    alert("The charges are made");
    window.location.reload();
  };

  const getStudents = async () => {
    const { data, error } = await supabase
      .from("Students")
      .select("studentNumber, studentName, surplus_deficit_payment, isArchived")
      .eq("isArchived", false);

    if (error) {
      console.error("Error fetching students:", error.message);
      return;
    }
    console.log("This is the data: ", data);
    // sort by balance
    const sorted = data.sort(
      (a, b) => (a.surplus_deficit_payment || 0) - (b.surplus_deficit_payment || 0)
    );

    set_searched_list(sorted);
    set_students_list(sorted);
  };


  const getAdminInfo = async () => {
    const session_temp = await getSession();

    const fetchID = await fetchColumnValue("admin", "userID", session_temp.session.user.id, "adminID");
    setAdminID(fetchID);
  }

  const search = (user_input) => {
    const lowerTerm = user_input.toLowerCase();
    const filtered = students_list.filter(student =>
      student.studentName.toLowerCase().includes(lowerTerm) ||
      student.studentNumber.toLowerCase().includes(lowerTerm)
    );

    set_searched_list(filtered)
    setSearchTerm(user_input);
    console.log("Ito yun:", filtered);
  }


  useEffect(() => {
    getAdminInfo();
    getCharges();
    getAppliances();
    getStudents();
  }, [])

  return (
    <div className="p-4 md:p-8 zain-regular">

      {/* Search & Change Rate */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-4 gap-x-12 mb-6 ">
        {/* Search by Name */}
        <div className="flex flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by Name/Student Number"
            className="border border-gray-300 rounded-2xl px-4 py-2 w-full text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => search(searchTerm)} className="bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800">
            Search
          </button>
        </div>

        <div className="bg-[#4E0303] text-white px-4 py-2 rounded-2xl hover:bg-red-900 text-center max-sm:text-right w-fit">
          <button onClick={() => makeCharges()}>Make Charges for the Month</button>
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
            {/* Single row of dummy data */}
            {searched_list.length > 0 ? searched_list.map((x) => (
              <tr key={x.studentNumber} className="border-t border-gray-200 text-sm sm:text-base">
                <td className="px-4 py-3">{x.studentName}</td>
                <td className="px-4 py-3">{x.studentNumber}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block w-18 sm:w-24 text-center px-3 py-1 rounded-2xl border border-green-600   ${x.surplus_deficit_payment >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-500 text-black'} `}
                  >
                    {x.surplus_deficit_payment >= 0 ? "PAID" : `UNPAID (${x.surplus_deficit_payment}) `}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(x.studentNumber, x.surplus_deficit_payment, x.studentName)}
                    className="bg-[#4E0303] text-white px-3 py-1 rounded-2xl hover:bg-red-900"
                  >
                    Edit Payment
                  </button>
                </td>
              </tr>
            )) : <tr><td>No Students</td></tr>}

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
                  <label>NAME:{studentNumberFocus.studentName}</label>
                  <div className="border-b border-black w-full"></div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-col">
                <p className="font-semibold mb-1 sm:mb-2">THE AMOUNT DUE: {studentNumberFocus.surplus_deficit_payment}</p>
                <div className="border-b border-black w-full"></div>
                

                <div className="mt-2 sm:mt-6 flex justify-between font-semibold">
                  <span>Amount Paid:</span>
                  <input
                    type="number"
                    className="border-1 border-black rounded-xl p-1"
                    value={studentNumberFocus.payment}
                    onChange={(e) =>
                      setStudentNumberFocus(prev => ({
                        ...prev,
                        payment: e.target.value
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="text-xs sm:text-base flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
              <button onClick={handleCloseModal} className="bg-[#4E0303] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-red-900">
                Cancel
              </button>
              <button onClick={handleCloseModal_save} className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-900 hover:text-white">
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
                <div className="flex gap-2 mb-1 sm:mb-2 flex-row">
                  <span>Dormitory Rental:</span>
                  <input name="static_rent" value={staticCharges.rent}/>
                </div>
                <div className="flex gap-2 mb-1 sm:mb-2 flex-row">
                  <span>Surcharge:</span>
                  <input name="static_charge" value={staticCharges.surcharge} />
                </div>

                <p className="mb-1 font-semibold mt-4 sm:mt-6">Add Appliance</p>

              <form onSubmit={submitAppliance}>
               <div className="border border-gray-300 px-4 py-4 rounded-2xl">
                <div className="mb-1 sm:mb-3">
                    <label>Appliance Name:</label>
                    <input
                      type="text"
                      required
                      name="applianceName"
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                      placeholder="e.g., Hair Dryer"
                      onChange={updateForm_addAppliance}
                      value={applianceForm.applianceName}
                    />
                  </div>
                  <div className="mb-2 sm:mb-4">
                    <label>Appliance Value:</label>
                    <input
                      type="number"
                      required
                      name="addApplianceCharge"
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                      placeholder="e.g., 45.00"
                      onChange={updateForm_addAppliance}
                      value={applianceForm.addApplianceCharge}
                    />
                  </div>
                  <div className="flex justify-center">
                  <button type="submit" className="border border-[#114516] text-[#114516] px-3 mt-2 text-0.6rem sm:text-sm sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800">
                    Add Appliance
                  </button>
                </div>
               </div>                
              </form>

              </div>

              {/* Right Column */}
              <div>
                <p className="font-semibold mb-1 sm:mb-2">List of Appliances</p>
                <div className="grid grid-cols-2 gap-2 text-sm font-medium border-b border-black pb-1 sm:text-base">
                  <span>Appliance</span>
                  <span className="ml-8">AMT</span>
                </div>
                

                <div className="max-h-75 overflow-y-auto">
                  {list_of_appliances.length > 0 ? list_of_appliances.map((x) => (
                    <div key={x.applianceID} className="grid grid-cols-2 gap-2 items-center mb-1 sm:mb-2 text-[0.6rem] sm:text-sm border border-gray-200 hover:bg-gray-200 p-1 rounded-xl">
                      <span>{x.applianceName}</span>
                      <span className="ml-8">{x.cost}</span>
                      <button
                        className="bg-[#4E0303] text-sm text-white p-1 rounded-xl text-center border hover:bg-gray-300 hover:border-black hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
                        onClick={() => deleteAppliance(x.applianceID)}
                      >
                        Delete
                      </button>

                    </div>
                  )) : <p>No Appliance?</p>}
                </div>

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
              <button
                onClick={handleCloseRateModal}
                className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}