import supabase from "../../../supabase_client";
import { useEffect, useState } from "react";
import Loading from '../../../components/Loading'; // Assuming this path is correct
import PaginationControls from '../../../components/PaginationControls'; // Assuming this path is correct

// --- Custom Modal Components (Replaces alert and confirm) ---

// Message Modal Component
const MessageModal = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm zain-regular text-black">
        <h3 className="text-xl font-semibold mb-4 text-[#114516]">{title}</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] transition-colors duration-200 shadow-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm zain-regular text-black">
        <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Action</h3>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-gray-200 text-black rounded-2xl hover:bg-gray-300 transition-colors duration-200 shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

function AdminPage_editOffenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [specificStudentModal, setSpecificStudentModal] = useState(false);
  const [specificStudent, setSpecificStudent] = useState(null); // Stores the entire student object
  const [specificStudentOffenses, setSpecificStudentOffenses] = useState([]);
  const [isEditOffenseModal, setIsEditOffenseModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [offenseHighlight, setOffenseHighlight] = useState({
    offenseID: '',
    admin: '',
    offenseName: '',
    offensePkey: '' // This is the ID of the offense type from List_of_Offenses
  });
  const rowsPerPage = 10;
  const [offensesList, setOffensesList] = useState([]); // List of all available offense types
  const [addOffenseModal, setAddOffenseModal] = useState(false);
  const [steps, set_steps] = useState({
    step1: true,
    step2: false
  });

  // State for custom message/confirmation modals
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalAction, setConfirmModalAction] = useState(() => {}); // Function to run on confirm

  // State for Add Offense Modal Step 1 (Find Student)
  const [addOffense_formData, setAddOffense_formData] = useState({
    name: '',
    studentNumber: '',
  });
  const [addOffense_isFind, setAddOffense_isFind] = useState(false); // True if search results are displayed
  const [nameSearchList, set_nameSearchList] = useState([]); // List of students found in search

  // State for Add Offense Modal Step 2 (Add Offense Details)
  const [specificStudentToAddOffense, setSpecificStudentToAddOffense] = useState(null); // The student selected to add an offense for
  const [selectedOffenseTypeId, setSelectedOffenseTypeId] = useState(''); // The offense type ID selected for adding

  // State for Add Offense Type Modal
  const [showAddOffenseTypeModal, setShowAddOffenseTypeModal] = useState(false);
  const [newOffenseTypeName, setNewOffenseTypeName] = useState('');
  const [newOffenseSeverity, setNewOffenseSeverity] = useState(''); // New state for offense severity

  // State for main search bar
  const [mainSearchTerm, setMainSearchTerm] = useState('');

  // --- Modal Handlers ---

  const handleShowMessage = (title, message) => {
    setMessageModalContent({ title, message });
    setShowMessageModal(true);
  };

  const handleShowConfirm = (message, action) => {
    setConfirmModalMessage(message);
    setConfirmModalAction(() => action); // Store the function to be called
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    setShowConfirmModal(false);
    confirmModalAction(); // Execute the stored action
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  const handleAddOffenseModal = () => {
    setAddOffenseModal(prev => {
      // If modal is closing (prev is true, new state will be false)
      if (prev === true) {
        setAddOffense_isFind(false); // Reset search results display
        set_nameSearchList([]); // Clear previous search results
        setAddOffense_formData({ // Clear form data
          name: '',
          studentNumber: '',
        });
        set_steps({ // Reset steps to step 1
          step1: true,
          step2: false
        });
        setSpecificStudentToAddOffense(null); // Clear selected student for adding
        setSelectedOffenseTypeId(''); // Clear selected offense type
      }
      return !prev; // Toggle the modal's visibility
    });
  };

  const handleAddOffenseTypeModal = () => {
    setShowAddOffenseTypeModal(prev => {
      if (prev === true) {
        setNewOffenseTypeName(''); // Clear input when closing
        setNewOffenseSeverity(''); // Clear severity when closing
      }
      return !prev;
    });
  };

  // --- Supabase Data Fetching ---

  // Function to fetch paginated student data from Supabase, now with search capability
  const fetchData = async (searchQuery = '', isSearchActive = false) => {
    setIsLoading(true);
    try {
      const from = (currentPage - 1) * rowsPerPage;
      const to = from + rowsPerPage - 1;

      let query = supabase.from('Students').select('studentNumber, studentName', { count: 'exact' });

      if (isSearchActive && searchQuery.trim() !== '') {
        // Check if the search term looks like a student number (e.g., purely numeric or contains a dash)
        const isStudentNumber = /^\d+(-?\d+)*$/.test(searchQuery.trim());

        if (isStudentNumber) {
          query = query.eq('studentNumber', searchQuery.trim());
        } else {
          query = query.ilike('studentName', `%${searchQuery.trim()}%`);
        }
      }

      const { data, error, count } = await query.range(from, to);
      if (error) {
        console.error("Error fetching students data: ", error.message);
        handleShowMessage("Error", "Failed to fetch student data.");
        setTableData([]);
        setTotalRows(0);
        return;
      }
      setTotalRows(count);
      setTableData(data);
    } catch (error) {
      console.error("Unexpected error fetching students data: ", error);
      handleShowMessage("Error", "An unexpected error occurred while fetching student data.");
      setTableData([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get all offense types from Supabase
  const getOffenses = async () => {
    const { data, error } = await supabase.from("List_of_Offenses").select("*");
    if (error) {
      console.error("Error in getting offense types: ", error.message);
      handleShowMessage("Error", "Failed to load offense types.");
      return;
    }
    setOffensesList(data);
  };

  // --- Specific Student Offenses & Edit Offense Handlers ---

  // Updated handleOpenSpecificStudent to receive the full student object
  const handleOpenSpecificStudent = async (student) => {
    if (!student || !student.studentNumber) {
      console.error("Error: Invalid student object or empty studentNumber passed to handleOpenSpecificStudent.");
      handleShowMessage("Error", "Could not open student details due to missing information.");
      return;
    }
    setSpecificStudent(student);
    setSpecificStudentModal(true);
    setIsLoading(true);

    // Get the student's offenses
    const { data, error } = await supabase.from('Offenses_Occured').select('*, List_of_Offenses(offenseName)').eq('studentNumber', student.studentNumber);
    if (error) {
      console.error("Error getting student's offenses: ", error.message);
      handleShowMessage("Error", "Failed to load student's offenses.");
      setSpecificStudentOffenses([]);
      setIsLoading(false);
      return;
    }
    setSpecificStudentOffenses(data);
    setIsLoading(false);
  };

  const handleOpenEdit = (offense) => {
    setOffenseHighlight({
      offenseID: offense.offenceInstance,
      admin: offense.adminName,
      offenseName: offense.List_of_Offenses.offenseName,
      offensePkey: offense.offenseID // This is the current offense type ID
    });
    setIsEditOffenseModal(true);
  };

  const editSpecificOffense = async (event) => {
    event.preventDefault();

    if (!offenseHighlight.offensePkey) {
      handleShowMessage("Validation Error", "Please select an offense type.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("Offenses_Occured")
        .update({
          offenseID: offenseHighlight.offensePkey,
          adminName: adminName,
          timestamp: new Date().toISOString()
        })
        .eq('offenceInstance', offenseHighlight.offenseID);

      if (error) {
        throw new Error(error.message);
      }

      handleShowMessage("Success", "Offense updated successfully!");
      setIsEditOffenseModal(false);
      // Refresh the student's offenses list
      if (specificStudent) {
        await handleOpenSpecificStudent(specificStudent);
      }
    } catch (error) {
      console.error("Error updating offense: ", error.message);
      handleShowMessage("Error", "Error updating offense: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSpecificOffense = async () => {
    handleShowConfirm("Are you sure you want to delete this offense? This action cannot be undone.", async () => {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("Offenses_Occured")
          .delete()
          .eq('offenceInstance', offenseHighlight.offenseID);

        if (error) {
          throw new Error(error.message);
        }

        handleShowMessage("Success", "Offense deleted successfully!");
        setIsEditOffenseModal(false);
        // Refresh the student's offenses list
        if (specificStudent) {
          await handleOpenSpecificStudent(specificStudent);
        }
      } catch (error) {
        console.error("Error deleting offense: ", error.message);
        handleShowMessage("Error", "Error deleting offense: " + error.message);
      } finally {
        setIsLoading(false);
      }
    });
  };

  // --- Add Offense Modal Step 1 & 2 Handlers ---

  const handleOffense_specificStudent = async (event) => {
    event.preventDefault();
    if (addOffense_formData.name === '' && addOffense_formData.studentNumber === '') {
      handleShowMessage("Input Required", "Please add a name or student number to search.");
      return;
    }

    setIsLoading(true);
    try {
      const query_func = supabase.from("Students").select("*");

      if (addOffense_formData.name !== '') {
        query_func.ilike('studentName', `%${addOffense_formData.name}%`);
      } else {
        query_func.eq('studentNumber', addOffense_formData.studentNumber);
      }

      const { data, error } = await query_func;
      if (error) {
        throw new Error(error.message);
      }
      set_nameSearchList(data);
      setAddOffense_isFind(true); // Show search results section
    } catch (error) {
      console.error("Error retrieving searched names: ", error.message);
      handleShowMessage("Error", "Failed to search for students: " + error.message);
      set_nameSearchList([]);
      setAddOffense_isFind(true); // Still show the search result area, but it will be empty
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStudentForOffense = (student) => {
    setSpecificStudentToAddOffense(student);
    set_steps({ step1: false, step2: true }); // Move to step 2
  };

  const handleAddOffenseSubmit = async (event) => {
    event.preventDefault();
    if (!specificStudentToAddOffense || !selectedOffenseTypeId) {
      handleShowMessage("Validation Error", "Please select a student and an offense type.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('Offenses_Occured')
        .insert({
          studentNumber: specificStudentToAddOffense.studentNumber,
          offenseID: selectedOffenseTypeId,
          adminName: adminName,
          timestamp: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      handleShowMessage("Success", `Offense successfully added for ${specificStudentToAddOffense.studentName}!`);
      handleAddOffenseModal(); // Close and reset the modal
      fetchData(); // Refresh the main table data
    } catch (error) {
      console.error("Error adding new offense: ", error.message);
      handleShowMessage("Error", "Failed to add offense: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Add Offense Type Handler ---
  const handleAddOffenseTypeSubmit = async (event) => {
    event.preventDefault();
    if (!newOffenseTypeName.trim()) {
      handleShowMessage("Input Required", "Offense type name cannot be empty.");
      return;
    }
    if (!newOffenseSeverity) {
      handleShowMessage("Input Required", "Please select an offense severity (Minor or Major).");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('List_of_Offenses')
        .insert({
          offenseName: newOffenseTypeName.trim(),
          offenseSeverity: newOffenseSeverity
        });

      if (error) {
        throw new Error(error.message);
      }

      handleShowMessage("Success", `Offense type "${newOffenseTypeName.trim()}" added successfully!`);
      handleAddOffenseTypeModal(); // Close and reset the modal
      getOffenses(); // Refresh the list of offense types
    } catch (error) {
      console.error("Error adding new offense type: ", error.message);
      handleShowMessage("Error", "Failed to add offense type: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Main Search Handler ---
  const handleMainSearch = () => {
    setCurrentPage(1); // Reset to first page for new search results
    fetchData(mainSearchTerm, true); // Trigger search with the current term
  };

  // --- Effects ---

  // Effect hook to fetch data whenever currentPage changes or mainSearchTerm changes (debounced search could be added here)
  useEffect(() => {
    // Only fetch data without search term if currentPage changes and no active search
    // Or if currentPage changes *after* a search, to handle pagination of search results
    fetchData(mainSearchTerm, mainSearchTerm.trim() !== '');
  }, [currentPage]);

  // Initial data fetching and admin name retrieval
  useEffect(() => {
    getOffenses();

    // Getting the admin name from localStorage
    const adminName_str = localStorage.getItem('Session');
    if (adminName_str) {
      try {
        const adminName_obj = JSON.parse(adminName_str);
        if (adminName_obj?.session?.user?.user_metadata?.name) {
          setAdminName(adminName_obj.session.user.user_metadata.name);
        } else {
          console.warn("Admin name not found in session metadata.");
          setAdminName("Unknown Admin"); // Fallback
        }
      } catch (e) {
        console.error("Error parsing session data from localStorage:", e);
        setAdminName("Unknown Admin"); // Fallback on parse error
      }
    } else {
      console.warn("No session found in localStorage.");
      setAdminName("Unknown Admin"); // Fallback
    }
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen font-sans">
      {/* Conditionally render Loading component */}
      {isLoading && <Loading />}

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          title={messageModalContent.title}
          message={messageModalContent.message}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          message={confirmModalMessage}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirm}
        />
      )}

      {/* Specific Student Offenses Modal */}
      {specificStudentModal && (
        <div onClick={() => setSpecificStudentModal(false)} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md">
            <div className="flex items-center gap-2">
              <span className="zain-regular align-middle font-semibold">Name:</span>
              <span className="truncate align-middle zain-regular overflow-hidden whitespace-nowrap flex-grow">
                {specificStudent?.studentName || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="zain-regular text-md font-semibold">Student#:</span>
              <span className="truncate zain-regular text-md overflow-hidden whitespace-nowrap flex-grow">
                {specificStudent?.studentNumber || 'N/A'}
              </span>
            </div>
            <hr className="bg-gray-300 border-[0.5] rounded-xl my-5" />
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {specificStudentOffenses.length > 0 ? (
                specificStudentOffenses.map((offense) => (
                  <div key={offense.offenceInstance} className="zain-regular border p-3 rounded-lg border-gray-200 shadow-sm bg-gray-50">
                    <div>
                      <span className="font-medium">Date:</span> {new Date(offense.timestamp).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">By:</span> {offense.adminName}
                    </div>
                    <div>
                      <span className="font-medium">Offense:</span> {offense.List_of_Offenses?.offenseName || 'N/A'}
                    </div>
                    <button onClick={() => { handleOpenEdit(offense); }} className="w-full my-2 text-center text-white rounded-2xl bg-[#114516] py-2 hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md">
                      Edit
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No offenses recorded for this student.</p>
              )}
            </div>
            <div className="flex mt-4">
              <button onClick={() => setSpecificStudentModal(false)} className="mx-auto py-2 px-6 text-center w-full text-black rounded-2xl bg-white shadow-md my-2 hover:bg-[#1e6a23] hover:text-white transition-colors duration-200 border border-gray-300">
                RETURN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Offense Modal */}
      {isEditOffenseModal && (
        <div onClick={() => setIsEditOffenseModal(false)} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-lg max-w-md w-full zain-regular">
            <div className="p-2 max-w-[300px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
              Offense ID: {offenseHighlight.offenseID}
            </div>
            <hr className="my-3" />
            <div className="mt-2">
              <form onSubmit={editSpecificOffense}>
                <div className="mb-4">
                  <label className="block mb-2">Offense Name:</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                    value={offenseHighlight.offensePkey}
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      const selected = offensesList.find(o => String(o.offenseID) === String(selectedValue));
                      setOffenseHighlight((prev) => ({
                        ...prev,
                        offensePkey: selectedValue,
                        offenseName: selected ? selected.offenseName : ''
                      }));
                    }}
                    required
                  >
                    <option value="">Select an offense</option>
                    {offensesList.map((offense) => (
                      <option key={offense.offenseID} value={offense.offenseID}>
                        {offense.offenseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <span className="block mb-2">Admin:</span>
                  <span className="ml-2 text-gray-700">
                    {adminName}
                  </span>
                </div>

                <p className="mt-5 text-gray-500 text-sm">
                  Updating this will make you the submitter of the offense and update the timestamp.
                </p>

                <div className="flex justify-around mt-6 gap-3">
                  <button
                    type="button"
                    onClick={deleteSpecificOffense}
                    className="flex-1 text-center px-2 text-white rounded-2xl bg-red-600 py-2 hover:bg-red-700 transition-colors duration-200 shadow-md"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-center px-4 text-white rounded-2xl bg-[#114516] py-2 hover:bg-[#1e6a23] transition-colors duration-200 shadow-md"
                  >
                    Update
                  </button>
                </div>
              </form>

              <button
                onClick={() => setIsEditOffenseModal(false)}
                className="w-full mt-3 py-2 px-6 text-center text-black rounded-2xl bg-gray-200 shadow-md hover:bg-gray-300 transition-colors duration-200 border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Offense Modal */}
      {addOffenseModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md zain-regular">
            <div className="zain-regular flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div>Steps:</div>
                <div className="flex gap-3 ml-2 items-center">
                  <div className={steps.step1 ? "bg-gradient-to-tr from-[#114516] to-pink-400 shadow-pink-500 shadow-md text-white p-2 px-3 rounded-xl" : "bg-gray-200 p-2 px-3 rounded-xl text-gray-700"}>
                    1
                  </div>
                  <div className={steps.step2 ? "bg-gradient-to-tr from-[#114516] to-pink-400 shadow-pink-500 shadow-md text-white p-2 px-3 rounded-xl" : "bg-gray-200 p-2 px-3 rounded-xl text-gray-700"}>
                    2
                  </div>
                </div>
              </div>
              <div>
                <button onClick={handleAddOffenseModal} className="text-center text-white rounded-2xl bg-[#114516] p-2 hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md">
                  Back
                </button>
              </div>
            </div>

            {/* Step 1: Search for Student */}
            {steps.step1 && (
              <div className="mt-5">
                <div>Search for the name of the student or their student number:</div>
                <form onSubmit={handleOffense_specificStudent} className="border-2 border-gray-300 p-4 rounded-xl mt-3">
                  <div className="mb-4">
                    <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Enter the name:</label>
                    <input
                      id="studentName"
                      value={addOffense_formData.name}
                      onChange={e => setAddOffense_formData(prevData => ({
                        ...prevData,
                        name: e.target.value,
                        studentNumber: '' // Clear student number if name is entered
                      }))}
                      type="text"
                      placeholder="Enter Name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">Enter the student number:</label>
                    <input
                      id="studentNumber"
                      value={addOffense_formData.studentNumber}
                      onChange={e => setAddOffense_formData(prevData => ({
                        ...prevData,
                        studentNumber: e.target.value,
                        name: '' // Clear name if student number is entered
                      }))}
                      type="text"
                      placeholder="20XX-XXXXX"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="text-center text-white rounded-2xl bg-[#114516] p-2 px-4 hover:bg-[#1e6a23] transition-colors duration-200 shadow-md">
                      Find!
                    </button>
                  </div>
                </form>

                {/* Search Result Display */}
                {addOffense_isFind && (
                  <div className="mt-5 p-4 border-2 border-gray-300 rounded-2xl bg-gray-50">
                    {nameSearchList.length > 0 ? (
                      <div>
                        <p className="font-medium mb-2">Is this the student(s)? Click to select:</p>
                        <div className="space-y-2">
                          {nameSearchList.map((student) => (
                            <div
                              key={student.studentNumber}
                              onClick={() => handleSelectStudentForOffense(student)}
                              className="bg-amber-100 p-3 rounded-xl cursor-pointer hover:bg-amber-200 transition-colors duration-200 shadow-sm"
                            >
                              <p className="font-semibold">{student.studentName}</p>
                              <p className="text-sm text-gray-600">Student #: {student.studentNumber}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-100 p-3 rounded-xl text-red-700">
                        No student found with the provided details.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Add Offense Details */}
            {steps.step2 && specificStudentToAddOffense && (
              <div className="mt-5">
                <h3 className="text-xl font-semibold mb-3">Add Offense for:</h3>
                <div className="bg-gray-100 p-4 rounded-xl mb-4 shadow-sm">
                  <p className="font-medium">Name: <span className="font-normal">{specificStudentToAddOffense.studentName}</span></p>
                  <p className="font-medium">Student #: <span className="font-normal">{specificStudentToAddOffense.studentNumber}</span></p>
                </div>

                <form onSubmit={handleAddOffenseSubmit} className="border-2 border-gray-300 p-4 rounded-xl">
                  <div className="mb-4">
                    <label htmlFor="offenseType" className="block text-sm font-medium text-gray-700 mb-1">Select Offense Type:</label>
                    <select
                      id="offenseType"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                      value={selectedOffenseTypeId}
                      onChange={(e) => setSelectedOffenseTypeId(e.target.value)}
                      required
                    >
                      <option value="">Choose an Offense</option>
                      {offensesList.map(offense => (
                        <option key={offense.offenseID} value={offense.offenseID}>
                          {offense.offenseName} ({offense.offenseSeverity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Admin Submitting:</span>
                    <span className="ml-2 text-gray-700">{adminName}</span>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button type="submit" className="text-center text-white rounded-2xl bg-[#114516] p-2 px-4 hover:bg-[#1e6a23] transition-colors duration-200 shadow-md">
                      Add Offense
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Offense Type Modal */}
      {showAddOffenseTypeModal && (
        <div onClick={() => handleAddOffenseTypeModal()} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md zain-regular">
            <div className="zain-regular flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#114516]">Add New Offense Type</h3>
              <div>
                <button onClick={handleAddOffenseTypeModal} className="text-center text-white rounded-2xl bg-[#114516] p-2 hover:bg-[#1e6a23] transition-colors duration-200 shadow-md">
                  Back
                </button>
              </div>
            </div>

            <form onSubmit={handleAddOffenseTypeSubmit} className="border-2 border-gray-300 p-4 rounded-xl">
              <div className="mb-4">
                <label htmlFor="newOffenseTypeName" className="block text-sm font-medium text-gray-700 mb-1">Offense Type Name:</label>
                <input
                  id="newOffenseTypeName"
                  type="text"
                  value={newOffenseTypeName}
                  onChange={(e) => setNewOffenseTypeName(e.target.value)}
                  placeholder="e.g., Late Submission, Cheating"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newOffenseSeverity" className="block text-sm font-medium text-gray-700 mb-1">Offense Severity:</label>
                <select
                  id="newOffenseSeverity"
                  value={newOffenseSeverity}
                  onChange={(e) => setNewOffenseSeverity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                  required
                >
                  <option value="">Select Severity</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="text-center text-white rounded-2xl bg-[#114516] p-2 px-4 hover:bg-[#1e6a23] transition-colors duration-200 shadow-md">
                  Add Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <h1 className="marcellus-sc-regular text-black py-10 text-2xl md:text-3xl lg:text-4xl text-center md:text-left">
        Edit Offenses
      </h1>

      {/* Actions Section - Improved Responsiveness */}
      <div className="flex flex-col md:flex-row w-full md:w-[90%] mx-auto justify-between items-center space-y-4 md:space-y-0">
        {/* Search Input and Button Group */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            className="text-black rounded-2xl border-2 border-gray-600 py-2 px-4 w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-[#114516]"
            placeholder="Name or Student#"
            value={mainSearchTerm}
            onChange={(e) => setMainSearchTerm(e.target.value)}
            onKeyPress={(e) => { // Allow pressing Enter to search
              if (e.key === 'Enter') {
                handleMainSearch();
              }
            }}
          />
          <button onClick={handleMainSearch} className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg">
            Search
          </button>
        </div>

        {/* Add Offense Buttons Group */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button onClick={handleAddOffenseModal} className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg">
            Add Offense
          </button>
          <button onClick={handleAddOffenseTypeModal} className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg">
            Add Offense Type
          </button>
        </div>
      </div>

      {/* Table Container - Ensuring overflow-x-scroll works */}
      <div className="w-full md:w-[90%] mx-auto mt-10 overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Number
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length > 0 ? (
              tableData.map((student, index) => (
                <tr key={student.studentNumber} className={index % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.studentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => handleOpenSpecificStudent(student)} className="bg-[#4E0303] hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
                        See Offenses
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-gray-700 text-center zain-regular py-5 text-sm md:text-lg" colSpan={3}>
                  No Data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-10">
        {totalRows > 0 && (
          <PaginationControls
            rowsPerPage={rowsPerPage}
            totalRows={totalRows}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage_editOffenses;
