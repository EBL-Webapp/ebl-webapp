import React, { useState, useEffect } from "react";
import supabase from "../../../supabase_client";
import { fetchColumnValue } from "../../../fetchColumnValue";
import { getSession } from "../../../getSession";
import PaginationControls from "../../../components/PaginationControls";
import Loading from "../../../components/Loading"; // Import the Loading component


export default function EditPayments() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  // staticCharges holds the values fetched from the database
  const [staticCharges, setStaticCharges] = useState({
    rent: 500, // Initial fallback value
    surcharge: 25, // Initial fallback value
  });
  // newStaticCharges holds the values being edited in the modal form
  const [newStaticCharges, setNewStaticCharges] = useState({});

  const [applianceForm, setApplianceForm] = useState({
    applianceName: "",
    addApplianceCharge: "",
  });
  const [list_of_appliances, set_list_of_appliances] = useState([]);
  const [adminID, setAdminID] = useState("");

  // searchTerm is for the input field's live value
  const [searchTerm, setSearchTerm] = useState("");
  // currentSearchTerm is the value used for the actual Supabase query
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const [searched_list, set_searched_list] = useState([]); // This will hold the paginated and filtered results from Supabase

  const [studentNumberFocus, setStudentNumberFocus] = useState({
    studentNumber: "",
    surplus_deficit_payment: 0,
    studentName: "",
    payment: 0,
    referenceID: "", // NEW: Added referenceID to state
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // You can adjust this number
  const [totalStudentsCount, setTotalStudentsCount] = useState(0);

  // State for the confirmation modal
  const [showConfirmChargesModal, setShowConfirmChargesModal] = useState(false);

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);


  const handleOpenModal = (studentNum, dues, name) => {
    setShowPaymentModal(true);
    setStudentNumberFocus({
      studentNumber: studentNum,
      surplus_deficit_payment: dues,
      studentName: name,
      payment: 0,
      referenceID: "", // NEW: Initialize referenceID when opening modal
    });
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setStudentNumberFocus({
      studentNumber: "",
      surplus_deficit_payment: 0,
      studentName: "",
      payment: 0,
      referenceID: "", // NEW: Reset referenceID when closing modal
    });
  };

  const handleCloseModal_save = async () => {
    // NEW: Validation for required fields
    if (parseFloat(studentNumberFocus.payment) <= 0 || isNaN(parseFloat(studentNumberFocus.payment))) {
      alert("Payment amount must be a positive number.");
      return;
    }
    if (!studentNumberFocus.referenceID.trim()) {
      alert("Reference ID is required.");
      return;
    }

    setIsLoading(true); // Show loading
    setShowPaymentModal(false);

    try {
      // Let's handle the payment insertion and updating the student's deficit
      const { error: error_inserting } = await supabase
        .from("studentPayment")
        .insert({
          studentNumber: studentNumberFocus.studentNumber,
          adminID: adminID,
          paymentAmount: studentNumberFocus.payment,
          referenceID: studentNumberFocus.referenceID, // NEW: Include referenceID
        });

      if (error_inserting) {
        alert("Error in inserting the payment: " + error_inserting.message);
        return;
      }

      const newBalance =
        parseFloat(studentNumberFocus.payment) +
        parseFloat(studentNumberFocus.surplus_deficit_payment);

      const { error: error_in_updating } = await supabase
        .from("Students")
        .update({
          surplus_deficit_payment: newBalance,
        })
        .eq("studentNumber", studentNumberFocus.studentNumber);

      if (error_in_updating) {
        alert("Error in updating the new payment: " + error_in_updating.message);
        return;
      }

      setStudentNumberFocus((prev) => ({
        ...prev,
        surplus_deficit_payment: newBalance,
      }));

      // Re-fetch students to reflect the updated balance on the current page
      getStudents(currentPage, rowsPerPage, currentSearchTerm);
    } catch (e) {
      console.error("An error occurred during payment save:", e);
      alert("An unexpected error occurred during payment save.");
    } finally {
      setIsLoading(false); // Hide loading
      setStudentNumberFocus({
        studentNumber: "",
        surplus_deficit_payment: 0,
        studentName: "",
        payment: 0,
        referenceID: "", // NEW: Reset referenceID after save
      });
    }
  };

  const handleOpenRateModal = () => setShowRateModal(true);
  const handleCloseRateModal = () => setShowRateModal(false);

  const handleStaticChargeChange = (e) => {
    const { name, value } = e.target;
    setNewStaticCharges((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleStaticChargeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading

    try {
      const updatedRent = newStaticCharges.rent;
      const updatedSurcharge = newStaticCharges.surcharge;

      console.log("New Dormitory Rental:", updatedRent);
      console.log("New Surcharge:", updatedSurcharge);

      const { error: rentUpdateError } = await supabase
        .from("staticCharge")
        .update({ charge: updatedRent })
        .eq("chargeName", "rent");
      if (rentUpdateError) {
        alert("Error updating rent: " + rentUpdateError.message);
        return;
      }

      const { error: surchargeUpdateError } = await supabase
        .from("staticCharge")
        .update({ charge: updatedSurcharge })
        .eq("chargeName", "surcharge");
      if (surchargeUpdateError) {
        alert("Error updating surcharge: " + surchargeUpdateError.message);
        return;
      }

      alert("Static charges updated successfully!");
      getCharges(); // Re-fetch charges to update the displayed values
      handleCloseRateModal(); // Close the modal after saving
    } catch (e) {
      console.error("An error occurred during static charge update:", e);
      alert("An unexpected error occurred during static charge update.");
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  const getCharges = async () => {
    const { data, error } = await supabase.from("staticCharge").select("*");
    if (error) {
      console.log("There was an error in getting the charges: ", error.message);
      return;
    }
    const chargesObject = Object.fromEntries(
      data.map((item) => [item.chargeName, item.charge])
    );
    setStaticCharges(chargesObject);
    setNewStaticCharges(chargesObject);
  };

  const getAppliances = async () => {
    const { data, error } = await supabase
      .from("list_of_appliances")
      .select("*");
    if (error) {
      console.log("There was an error in getting the appliances: ", error.message);
      return;
    }
    set_list_of_appliances(data);
  };

  const deleteAppliance = async (id) => {
    setIsLoading(true); // Show loading
    try {
      const { error } = await supabase
        .from("list_of_appliances")
        .delete()
        .eq("applianceID", id);
      if (error) {
        alert("Error in deleting row: " + error.message);
        return;
      }
      set_list_of_appliances((prev) =>
        prev.filter((appliance) => appliance.applianceID != id)
      );
    } catch (e) {
      console.error("An error occurred during appliance deletion:", e);
      alert("An unexpected error occurred during appliance deletion.");
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  const submitAppliance = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show loading
    try {
      const { data, error } = await supabase
        .from("list_of_appliances")
        .insert([
          {
            applianceName: applianceForm.applianceName,
            cost: applianceForm.addApplianceCharge,
          },
        ])
        .select("applianceID");
      if (error) {
        alert("Error in inserting your application: " + error.message);
        return;
      } else {
        alert("Your appliance is added successfully!");
        setApplianceForm({
          applianceName: "",
          addApplianceCharge: "",
        });
        set_list_of_appliances((prev) => [
          ...prev,
          {
            applianceID: data[0].applianceID,
            applianceName: applianceForm.applianceName,
            cost: applianceForm.addApplianceCharge,
          },
        ]);
      }
    } catch (e) {
      console.error("An error occurred during appliance submission:", e);
      alert("An unexpected error occurred during appliance submission.");
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  const updateForm_addAppliance = (x) => {
    const { value, name } = x.target;
    setApplianceForm({
      ...applianceForm,
      [name]: value,
    });
  };

  const confirmMakeCharges = async () => {
    setShowConfirmChargesModal(false);
    setIsLoading(true); // Show loading screen

    try {
      // 1. Fetch active appliances and their costs
      const { data: applianceData, error: applianceError } = await supabase
        .from("appliance_per_student")
        .select(
          `
          studentNumber,
          quantity,
          isActive,
          applianceID,
          list_of_appliances (
            cost
          )
        `
        )
        .eq("isActive", true);
      if (applianceError) {
        console.error("Fetch error:", applianceError.message);
        return;
      }

      // 2. Fetch current student balances in a single query
      const { data: studentsData, error: studentsError } = await supabase
        .from("Students")
        .select("studentNumber, surplus_deficit_payment");
      if (studentsError) {
        console.error("Failed to fetch students' balances:", studentsError.message);
        return;
      }

      // 3. Create maps for efficient lookups
      const chargesMap = {};
      const balanceMap = {};
      studentsData.forEach((student) => {
        balanceMap[student.studentNumber] = student.surplus_deficit_payment || 0;
      });

      // 4. Calculate total charges per student based on appliances and rent
      applianceData.forEach((entry) => {
        const student = entry.studentNumber;
        const quantity = entry.quantity || 1;
        const cost = entry.list_of_appliances?.cost || 0;
        if (!chargesMap[student]) {
          chargesMap[student] = 0;
        }
        chargesMap[student] += quantity * cost;
      });
      Object.keys(chargesMap).forEach((studentNumber) => {
        chargesMap[studentNumber] += staticCharges.rent;
      });

      // 5. Prepare the array for a single bulk insert into studentCharge
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 31);
      const formattedDueDate = dueDate.toISOString().split("T")[0];
      const newCharges = Object.entries(chargesMap).map(
        ([studentNumber, totalCost]) => ({
          studentNumber,
          amount: totalCost,
          dueDate: formattedDueDate,
          adminID,
        })
      );
      const { error: insertError } = await supabase
        .from("studentCharge")
        .insert(newCharges);
      if (insertError) {
        console.error("Insert failed:", insertError.message);
        return;
      }

      // 6. Prepare the array for a single bulk update using `upsert`
      const updates = Object.entries(chargesMap).map(([studentNumber, cost]) => {
        const currentBalance = balanceMap[studentNumber] || 0;
        return {
          studentNumber,
          surplus_deficit_payment: currentBalance - cost,
        };
      });

      const { error: upsertError } = await supabase
        .from("Students")
        .upsert(updates, { onConflict: "studentNumber" });
      if (upsertError) {
        console.error("Failed to update balances:", upsertError.message);
        return;
      }

      // 7. Announce the charges
      const { error: announcementError } = await supabase
        .from("announcements_table")
        .insert({
          issued_by: adminID,
          content: "Monthly charges have been applied. View details in your payments history.",
          type: "charge",
        });
      if (announcementError) {
        console.error("Failed to create announcement:", announcementError.message);
        return;
      }

      alert("The charges are made");
      window.location.reload(); // Reload to reflect changes
    } catch (e) {
      console.error("An unexpected error occurred:", e);
      alert("An unexpected error occurred.");
    } finally {
      window.location.reload(true);
      setIsLoading(false); // Hide loading screen
    }
  };

  const getStudents = async (page, limit, searchInput = "") => {
    setIsLoading(true); // Show loading screen
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    try {
      let query = supabase
        .from("Students")
        .select("studentNumber, studentName, surplus_deficit_payment, isArchived", {
          count: "exact",
        })
        .eq("isArchived", false);

      if (searchInput) {
        query = query.or(
          `studentName.ilike.%${searchInput}%,studentNumber.ilike.%${searchInput}%`
        );
      }

      const { data, error, count } = await query.range(startIndex, endIndex);

      if (error) {
        console.error("Error fetching students:", error.message);
        return;
      }

      const sorted = data.sort(
        (a, b) => (a.surplus_deficit_payment || 0) - (b.surplus_deficit_payment || 0)
      );

      set_searched_list(sorted);
      setTotalStudentsCount(count);
    } catch (e) {
      console.error("An unexpected error occurred:", e);
    } finally {
      setIsLoading(false); // Hide loading screen
    }
  };

  const getAdminInfo = async () => {
    setIsLoading(true); // Show loading
    try {
      const session_temp = await getSession();
      const fetchID = await fetchColumnValue(
        "admin",
        "userID",
        session_temp.session.user.id,
        "adminID"
      );
      setAdminID(fetchID);
    } catch (e) {
      console.error("Error fetching admin info:", e);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  const executeSearch = () => {
    setCurrentSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  useEffect(() => {
    getStudents(currentPage, rowsPerPage, currentSearchTerm);
  }, [currentPage, rowsPerPage, currentSearchTerm]);

  useEffect(() => {
    getAdminInfo();
    getCharges();
    getAppliances();
  }, []);

  const handlePageChange = (newPageNumber) => {
    setCurrentPage(newPageNumber);
  };

  return (
    <div className="p-4 md:p-8 zain-regular">
      {/* Loading Component - Renders conditionally */}
      {isLoading && <Loading />}

      {/* Main Content */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-4 gap-x-12 mb-6 ">
        <div className="flex flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by Name/Student Number"
            className="border border-gray-300 rounded-2xl px-4 py-2 w-full text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                executeSearch();
              }
            }}
          />
          <button
            onClick={executeSearch}
            className="bg-[#114516] text-white px-4 py-2 rounded-2xl hover:bg-green-800"
          >
            Search
          </button>
        </div>

        <div className="bg-[#4E0303] text-white px-4 py-2 rounded-2xl hover:bg-red-900 text-center max-sm:text-right w-fit">
          <button onClick={() => setShowConfirmChargesModal(true)}>
            Make Charges for the Month
          </button>
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
            {searched_list.length > 0 ? (
              searched_list.map((x) => (
                <tr
                  key={x.studentNumber}
                  className="border-t border-gray-200 text-sm sm:text-base"
                >
                  <td className="px-4 py-3">{x.studentName}</td>
                  <td className="px-4 py-3">{x.studentNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-18 sm:w-24 text-center px-3 py-1 rounded-2xl border border-green-600  ${
                        x.surplus_deficit_payment >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-500 text-black"
                      } `}
                    >
                      {x.surplus_deficit_payment >= 0
                        ? "PAID"
                        : `UNPAID (${x.surplus_deficit_payment}) `}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        handleOpenModal(
                          x.studentNumber,
                          x.surplus_deficit_payment,
                          x.studentName
                        )
                      }
                      className="bg-[#4E0303] text-white px-3 py-1 rounded-2xl hover:bg-red-900"
                    >
                      Edit Payment
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No Students Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        rowsPerPage={rowsPerPage}
        totalRows={totalStudentsCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-2xl p-6 space-y-2 sm:space-y-4 zain-regular">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-base">
              <div>
                <div className="mb-1 sm:mb-3">
                  <label>NAME:{studentNumberFocus.studentName}</label>
                  <div className="border-b border-black w-full"></div>
                </div>
              </div>

              <div className="flex-col">
                <p className="font-semibold mb-1 sm:mb-2">
                  THE AMOUNT DUE: {studentNumberFocus.surplus_deficit_payment}
                </p>
                <div className="border-b border-black w-full"></div>

                <div className="mt-2 sm:mt-6 flex justify-between font-semibold">
                  <span>Amount Paid:</span>
                  <input
                    type="number"
                    required // Make Amount Paid required
                    className="border-1 border-black rounded-xl p-1"
                    value={studentNumberFocus.payment}
                    onChange={(e) =>
                      setStudentNumberFocus((prev) => ({
                        ...prev,
                        payment: e.target.value,
                      }))
                    }
                  />
                </div>
                {/* NEW: Reference ID Input Field */}
                <div className="mt-2 sm:mt-4 flex justify-between font-semibold">
                  <span>Reference ID:</span>
                  <input
                    type="text"
                    required // Make Reference ID required
                    className="border-1 border-black rounded-xl p-1"
                    value={studentNumberFocus.referenceID}
                    onChange={(e) =>
                      setStudentNumberFocus((prev) => ({
                        ...prev,
                        referenceID: e.target.value,
                      }))
                    }
                    placeholder="e.g., Ref. No."
                  />
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-base flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
              <button
                onClick={handleCloseModal}
                className="bg-[#4E0303] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-red-900"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal_save}
                className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-900 hover:text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showRateModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-xl p-6 space-y-2 sm:space-y-4 zain-regular">
            <form onSubmit={handleStaticChargeSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-base">
                <div>
                  <div className="flex gap-2 mb-1 sm:mb-2 flex-row items-center">
                    <span>Dormitory Rental:</span>
                    <input
                      type="number"
                      name="rent"
                      value={newStaticCharges.rent || ""}
                      onChange={handleStaticChargeChange}
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 mb-1 sm:mb-2 flex-row items-center">
                    <span>Surcharge:</span>
                    <input
                      type="number"
                      name="surcharge"
                      value={newStaticCharges.surcharge || ""}
                      onChange={handleStaticChargeChange}
                      className="border-b border-black w-full px-1 py-0.5 focus:outline-none"
                    />
                  </div>

                  <p className="mb-1 font-semibold mt-4 sm:mt-6">
                    Add Appliance
                  </p>

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
                        <button
                          type="submit"
                          className="border border-[#114516] text-[#114516] px-3 mt-2 text-0.6rem sm:text-sm sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800"
                        >
                          Add Appliance
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div>
                  <p className="font-semibold mb-1 sm:mb-2">
                    List of Appliances
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm font-medium border-b border-black pb-1 sm:text-base">
                    <span>Appliance</span>
                    <span className="ml-8">AMT</span>
                  </div>

                  <div className="max-h-75 overflow-y-auto">
                    {list_of_appliances.length > 0 ? (
                      list_of_appliances.map((x) => (
                        <div
                          key={x.applianceID}
                          className="grid grid-cols-2 gap-2 items-center mb-1 sm:mb-2 text-[0.6rem] sm:text-sm border border-gray-200 hover:bg-gray-200 p-1 rounded-xl"
                        >
                          <span>{x.applianceName}</span>
                          <span className="ml-8">{x.cost}</span>
                          <button
                            className="bg-[#4E0303] text-sm text-white p-1 rounded-xl text-center border hover:bg-gray-300 hover:border-black hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
                            onClick={() => deleteAppliance(x.applianceID)}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No Appliance?</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs sm:text-base flex justify-end gap-2 sm:gap-4 mt-4 sm:mt-8">
                <button
                  type="button"
                  onClick={handleCloseRateModal}
                  className="bg-[#4E0303] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-red-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#114516] text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full hover:bg-green-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmChargesModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md p-6 space-y-4 zain-regular text-center">
            <p className="text-lg font-semibold">
              Are you sure you want to make charges for the month?
            </p>
            <p className="text-sm text-gray-700">
              This action will calculate and apply charges to all active students.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowConfirmChargesModal(false)}
                className="bg-[#4E0303] text-white px-4 py-2 rounded-full hover:bg-red-900"
              >
                No, Cancel
              </button>
              <button
                onClick={confirmMakeCharges}
                className="bg-[#114516] text-white px-4 py-2 rounded-full hover:bg-green-800"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
