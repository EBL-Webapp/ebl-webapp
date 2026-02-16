import React, { useState, useEffect } from "react";
import PaginationControls from "../../../components/PaginationControls";
import Loading from "../../../components/Loading";
import { useGlobalContext } from "../../../context/GlobalContext";
import { useStudentsWithPayments, useCreatePayment, useUpdateStudentBalance, useUpdateStaticCharge, useCreateAppliance, useDeleteAppliance, useTriggerMonthlyCharges } from "../../../hooks/usePayments";

export default function EditPayments() {
  // Get global context data
  const { staticCharges, appliances, adminID, isLoading: isLoadingGlobal } = useGlobalContext();

  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showConfirmChargesModal, setShowConfirmChargesModal] = useState(false);

  // Form states
  const [newStaticCharges, setNewStaticCharges] = useState({});
  const [applianceForm, setApplianceForm] = useState({
    applianceName: "",
    addApplianceCharge: "",
  });
  const [studentNumberFocus, setStudentNumberFocus] = useState({
    studentNumber: "",
    surplus_deficit_payment: 0,
    studentName: "",
    payment: 0,
    referenceID: "",
  });

  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch students with payments using TanStack Query
  const { data: studentsData, isLoading: isLoadingStudents } = useStudentsWithPayments(
    currentPage,
    rowsPerPage,
    currentSearchTerm
  );

  // Mutations
  const createPaymentMutation = useCreatePayment();
  const updateBalanceMutation = useUpdateStudentBalance();
  const updateChargeMutation = useUpdateStaticCharge();
  const createApplianceMutation = useCreateAppliance();
  const deleteApplianceMutation = useDeleteAppliance();
  const triggerChargesMutation = useTriggerMonthlyCharges();

  // Initialize newStaticCharges when staticCharges loads
  useEffect(() => {
    if (staticCharges) {
      setNewStaticCharges(staticCharges);
    }
  }, [staticCharges]);

  // Combined loading state
  const isLoading = isLoadingGlobal || isLoadingStudents ||
    createPaymentMutation.isPending ||
    updateBalanceMutation.isPending ||
    updateChargeMutation.isPending ||
    createApplianceMutation.isPending ||
    deleteApplianceMutation.isPending ||
    triggerChargesMutation.isPending;

  // Payment Modal Handlers
  const handleOpenModal = (studentNum, dues, name) => {
    setShowPaymentModal(true);
    setStudentNumberFocus({
      studentNumber: studentNum,
      surplus_deficit_payment: dues,
      studentName: name,
      payment: 0,
      referenceID: "",
    });
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setStudentNumberFocus({
      studentNumber: "",
      surplus_deficit_payment: 0,
      studentName: "",
      payment: 0,
      referenceID: "",
    });
  };

  const handleCloseModal_save = async () => {
    // Validation
    if (parseFloat(studentNumberFocus.payment) <= 0 || isNaN(parseFloat(studentNumberFocus.payment))) {
      alert("Payment amount must be a positive number.");
      return;
    }
    if (!studentNumberFocus.referenceID.trim()) {
      alert("Reference ID is required.");
      return;
    }

    setShowPaymentModal(false);

    try {
      // Create payment record
      await createPaymentMutation.mutateAsync({
        studentNumber: studentNumberFocus.studentNumber,
        adminID: adminID,
        paymentAmount: parseFloat(studentNumberFocus.payment),
        referenceID: studentNumberFocus.referenceID,
      });

      // Update student balance
      const newBalance =
        parseFloat(studentNumberFocus.payment) +
        parseFloat(studentNumberFocus.surplus_deficit_payment);

      await updateBalanceMutation.mutateAsync({
        studentNumber: studentNumberFocus.studentNumber,
        newBalance: newBalance,
      });

      // Reset form
      setStudentNumberFocus({
        studentNumber: "",
        surplus_deficit_payment: 0,
        studentName: "",
        payment: 0,
        referenceID: "",
      });
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Error in saving payment: " + error.message);
    }
  };

  // Rate Modal Handlers
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

    try {
      // Update rent
      if (newStaticCharges.rent !== staticCharges.rent) {
        await updateChargeMutation.mutateAsync({
          chargeName: "rent",
          chargeValue: newStaticCharges.rent,
        });
      }

      // Update surcharge
      if (newStaticCharges.surcharge !== staticCharges.surcharge) {
        await updateChargeMutation.mutateAsync({
          chargeName: "surcharge",
          chargeValue: newStaticCharges.surcharge,
        });
      }

      alert("Static charges updated successfully!");
      handleCloseRateModal();
    } catch (error) {
      console.error("Error updating charges:", error);
      alert("Error updating charges: " + error.message);
    }
  };

  // Appliance Handlers
  const submitAppliance = async (event) => {
    event.preventDefault();

    try {
      await createApplianceMutation.mutateAsync({
        applianceName: applianceForm.applianceName,
        cost: parseFloat(applianceForm.addApplianceCharge),
      });

      alert("Your appliance is added successfully!");
      setApplianceForm({
        applianceName: "",
        addApplianceCharge: "",
      });
    } catch (error) {
      console.error("Error adding appliance:", error);
      alert("Error adding appliance: " + error.message);
    }
  };

  const deleteAppliance = async (id) => {
    try {
      await deleteApplianceMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting appliance:", error);
      alert("Error deleting appliance: " + error.message);
    }
  };

  const updateForm_addAppliance = (x) => {
    const { value, name } = x.target;
    setApplianceForm({
      ...applianceForm,
      [name]: value,
    });
  };

  // Monthly Charges Handler
  const confirmMakeCharges = async () => {
    setShowConfirmChargesModal(false);

    try {
      const result = await triggerChargesMutation.mutateAsync(adminID);
      alert(result.message || "The charges are made successfully");
    } catch (error) {
      console.error("Error executing monthly charges:", error);
      alert("Error executing monthly charges: " + (error.message || "Unknown error"));
    }
  };

  // Search Handler
  const executeSearch = () => {
    setCurrentSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  // Pagination Handler
  const handlePageChange = (newPageNumber) => {
    setCurrentPage(newPageNumber);
  };

  return (
    <div className="p-4 md:p-8 zain-regular">
      {/* Loading Component */}
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

      {/* Students Table */}
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
            {studentsData && studentsData.data && studentsData.data.length > 0 ? (
              studentsData.data.map((x) => (
                <tr
                  key={x.studentNumber}
                  className="border-t border-gray-200 text-sm sm:text-base"
                >
                  <td className="px-4 py-3">{x.studentName}</td>
                  <td className="px-4 py-3">{x.studentNumber}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-18 sm:w-24 text-center px-3 py-1 rounded-2xl border border-green-600  ${x.surplus_deficit_payment >= 0
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
        totalRows={studentsData?.count || 0}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Payment Modal */}
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
                    required
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

                <div className="mt-2 sm:mt-4 flex justify-between font-semibold">
                  <span>Reference ID:</span>
                  <input
                    type="text"
                    required
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

      {/* Rate Modal */}
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
                    {appliances && appliances.length > 0 ? (
                      appliances.map((x) => (
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

      {/* Confirm Monthly Charges Modal */}
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
