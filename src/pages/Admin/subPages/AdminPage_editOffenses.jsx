import supabase from "../../../supabase_client";
import { useEffect, useState } from "react";
import Loading from '../../../components/Loading'
import PaginationControls from '../../../components/PaginationControls';

function AdminPage_editOffenses() {

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [specificStudentModal, setSpecificStudentModal] = useState(false)               //CHANGED BACK TO FALSE
  // Changed specificStudent to store the entire student object, not just the number
  const [specificStudent, setSpecificStudent] = useState(null);
  const [specificStudentOffenses, setSpecificStudentOffenses] = useState([]);
  const [isEditOffenseModal, setIsEditOffenseModal] = useState(false);                  //CHANGED BACK TO FALSE
  const [adminName, setAdminName] = useState('')
  const [offenseHighlight, setOffenseHighlight] = useState({
    offenseID : '',
    admin : '',
    offenseName : '',
    offensePkey : ''
  })
  const rowsPerPage = 10; // Define rows per page here
  const [offensesList, setOffensesList] = useState([]);
  const [addOffenseModal, setAddOffenseModal] = useState(false);
  const [steps, set_steps] = useState({
    step1 : true,
    step2 : false
  })

  const handleAddOffenseModal = () => {
    setAddOffenseModal(prev => !prev)
  }
  const [addOffense_formData, setAddOffense_formData] = useState({
    name : '',
    studentNumber: '',
  })

  const [addOffense_isFind, setAddOffense_isFind] = useState(false);


  const handleOffense_specificStudent = async (event) => {
    event.preventDefault()
    if (addOffense_formData.name === '' && addOffense_formData.studentNumber === '' ){
      alert("Please add a name or student number")
      return
    }
    setAddOffense_isFind(prev => !prev)

    // We do a query here:
    if (addOffense_formData.name === '' && addOffense_formData.studentNumber !== ''){
      const {data, error} = await supabase.from("Students").select("*").eq(studentNumber, addOffense_formData.studentNumber)
      if(error){
        console.log(error.message);
      }
    }
    if (addOffense_formData.name !== '' && addOffense_formData.studentNumber === ''){
      const {data, error} = await supabase.from("Students").select("*").or(`studentName.ilike.%${addOffense_formData.name}%`)
      if(error){
        console.log(error.message);
      }
    }
    if (addOffense_formData.name !== '' && addOffense_formData.studentNumber !== ''){
      const {data, error} = await supabase.from("Students").select("*").or(`studentNumber.eq.${addOffense_formData.studentNumber},studentName.ilike.${addOffense_formData.name}`)
      if(error){
        console.log(error.message);
      }
    }
  }

  // Updated handleOpenSpecificStudent to receive the full student object
  const handleOpenSpecificStudent = async (student) => {
    if (!student || !student.studentNumber) { // Check for valid student object and number
      console.error("Error: passed in open specific student function with invalid student object or empty studentNumber");
      return;
    }
    setSpecificStudent(student); // Store the entire student object
    setSpecificStudentModal(true);
    setIsLoading(true);

    // Let's get the student's offenses:
    const { data, error } = await supabase.from('Offenses_Occured').select('*, List_of_Offenses(offenseName)').eq('studentNumber', student.studentNumber); // Use student.studentNumber
    if (error) {
      console.error("There was an error in getting the list offenses of the student: ", error.message);
      setSpecificStudentOffenses([]); // Clear offenses on error
      setIsLoading(false);
      return;
    }
    console.log("Students offenses: ", data)
    setSpecificStudentOffenses(data);
    setIsLoading(false);
  }

  // Function to fetch data from Supabase
  const fetchData = async () => {
    setIsLoading(true); // Start loading
    try {
      const from = (currentPage - 1) * rowsPerPage;
      const to = from + rowsPerPage - 1; // Supabase range is inclusive

      const { data, error, count } = await supabase.from('Students').select('studentNumber, studentName ', { count: 'exact' }).range(from, to);
      if (error) {
        console.error("Error in fetching data in editing offenses: ", error.message);
        setTableData([]);
        setTotalRows(0);
        return;
      }
      setTotalRows(count);
      setTableData(data);
    } catch (error) {
      console.error("There was an error in fetching data: ", error);
      setTableData([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false); // End loading regardless of success or failure
    }
  }

  const handleOpenEdit = async (offense) => {
    console.log("DEBUG - Full offense object:", offense);
    console.log("DEBUG - Current offensesList:", offensesList);
    
    setOffenseHighlight({
      offenseID : offense.offenceInstance,
      admin : offense.adminName,
      offenseName : offense.List_of_Offenses.offenseName,
      offensePkey : offense.offenseID  // This is the current offense type ID
    })
    console.log("DEBUG - Set offenseHighlight.offensePkey to:", offense.offenseID);
    setIsEditOffenseModal(true);
  }

  const getOffenses = async () => {
    const {data, error} = await supabase.from("List_of_Offenses").select("*")
    if(error){
      console.log("Error in getting offenses: ", error.message);
      return
    }
    console.log("DEBUG - Offenses list structure:", data);
    setOffensesList(data)
  }

  useEffect(() => {
    console.log("Updated offenseHighlight:", offenseHighlight);
  }, [offenseHighlight]);

  const editSpecificOffense = async (event) => {
    event.preventDefault()
    
    if (!offenseHighlight.offensePkey) {
      console.error("No offense selected");
      alert("Please select an offense type");
      return;
    }

    console.log("Updating offense with ID:", offenseHighlight.offenseID);
    console.log("New offense type ID:", offenseHighlight.offensePkey);
    
    // Update the offense record with new offense type and admin
    const {error} = await supabase
      .from("Offenses_Occured")
      .update({
        offenseID: offenseHighlight.offensePkey,  // Update to new offense type
        adminName: adminName,  // Update admin name to current user
        timestamp: new Date().toISOString()  // Update timestamp
      })
      .eq('offenceInstance', offenseHighlight.offenseID);  // Use the correct identifier
    
    if(error){
      console.log("There was an error in updating: ", error.message);
      alert("Error updating offense: " + error.message);
      return;
    }
    
    console.log("Offense updated successfully");
    alert("Offense updated successfully!");
    
    // Close the edit modal
    setIsEditOffenseModal(false);
    
    // Refresh the student's offenses list
    if (specificStudent) {
      await handleOpenSpecificStudent(specificStudent);
    }
  }

  const deleteSpecificOffense = async (event) => {
    event.preventDefault();
    
    if (!confirm("Are you sure you want to delete this offense? This action cannot be undone.")) {
      return;
    }

    console.log("Deleting offense with ID:", offenseHighlight.offenseID);
    
    const {error} = await supabase
      .from("Offenses_Occured")
      .delete()
      .eq('offenceInstance', offenseHighlight.offenseID);  // Use the correct identifier
    
    if(error){
      console.log("There was an error in deleting: ", error.message);
      alert("Error deleting offense: " + error.message);
      return;
    }
    
    console.log("Offense deleted successfully");
    alert("Offense deleted successfully!");
    
    // Close the edit modal
    setIsEditOffenseModal(false);
    
    // Refresh the student's offenses list
    if (specificStudent) {
      await handleOpenSpecificStudent(specificStudent);
    }
  }

  // Effect hook to fetch data whenever currentPage changes
  useEffect(() => {
    fetchData();
  }, [currentPage]); // Dependency array includes currentPage to re-fetch on page change

  useEffect(() => {
    getOffenses()

    // Getting the admin name
    const adminName_str = localStorage.getItem('Session');
    const adminName_obj = JSON.parse(adminName_str);
    setAdminName(adminName_obj.session.user.user_metadata.name);
  }, [])

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen font-sans"> {/* Added background and default font */}

      {/* Conditionally render Loading component */}
      {isLoading && <Loading />}

      {/* Specific Student Offenses Modal */}
      {specificStudentModal && (
        <div onClick={() => setSpecificStudentModal(false)} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4"> {/* Added p-4 for mobile padding */}
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md">
            {/* Top part */}
            <div className="flex items-center gap-2">
              <span className="zain-regular align-middle font-semibold"> {/* Added font-semibold */}
                Name:
              </span>
              {/* Display actual student name from state */}
              <span className="truncate align-middle zain-regular overflow-hidden whitespace-nowrap flex-grow"> {/* Use flex-grow for dynamic width */}
                {specificStudent?.studentName || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="zain-regular text-md font-semibold"> {/* Added font-semibold */}
                Student#:
              </span>
              {/* Display actual student number from state */}
              <span className="truncate zain-regular text-md overflow-hidden whitespace-nowrap flex-grow">
                {specificStudent?.studentNumber || 'N/A'}
              </span>
            </div>
            {/* Bottom Part */}
            <hr className="bg-gray-300 border-[0.5] rounded-xl my-5" />
            <div className="max-h-[300px] overflow-y-auto space-y-3"> {/* Added space-y for gap between offense cards */}
              {specificStudentOffenses.length > 0 ? (
                specificStudentOffenses.map((offense) => (
                  <div key={offense.offenceInstance} className="zain-regular border p-3 rounded-lg border-gray-200 shadow-sm bg-gray-50"> 
                    <div>
                      <span className="font-medium">Date:</span> {offense.timestamp}
                    </div>
                    <div>
                      <span className="font-medium">By:</span> {offense.adminName}
                    </div>
                    <div>
                      <span className="font-medium">Offense:</span> {offense.List_of_Offenses.offenseName}
                    </div>
                    <button onClick={() => {handleOpenEdit(offense)}} className="w-full my-2 text-center text-white rounded-2xl bg-[#114516] py-2 hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md">
                      Edit
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No offenses recorded for this student.</p>
              )}
            </div>
            <div className="flex mt-4"> {/* Increased top margin */}
              <button onClick={() => setSpecificStudentModal(false)} className="mx-auto py-2 px-6 text-center w-full text-black rounded-2xl bg-white shadow-md my-2 hover:bg-[#1e6a23] hover:text-white transition-colors duration-200 border border-gray-300"> {/* Added px-6 and border */}
                RETURN
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOffenseModal && (
        <div onClick={() => setIsEditOffenseModal(false)} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
          <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-lg max-w-md w-full zain-regular">
            <div className="p-2 max-w-[300px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
              Offense ID: {offenseHighlight.offenseID}
            </div>
            <hr className="my-3"/>
            <div className="mt-2">
              <form onSubmit={editSpecificOffense}>
                <div className="mb-4">
                  <label className="block mb-2">
                    Offense Name:
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#114516]"
                    value={offenseHighlight.offensePkey}
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      console.log("DEBUG - Selected value:", selectedValue);
                      console.log("DEBUG - Available offenses:", offensesList);
                      
                      const selected = offensesList.find(o => {
                        console.log("DEBUG - Comparing:", o.offenseID, "with", selectedValue);
                        return String(o.offenseID) === String(selectedValue);
                      });
                      
                      console.log("DEBUG - Found selected offense:", selected);
                      
                      if (selectedValue && !selected) {
                        console.error("Selected offense not found! Available keys:", offensesList.map(o => o.offenseID));
                        return;
                      }
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
                  <span className="block mb-2">
                    Admin: 
                  </span>
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

      {addOffenseModal && (
        <div>   
          <div onClick={() => handleAddOffenseModal()} className="fixed inset-0 bg-white/10 backdrop-blur-xs z-50 flex items-center justify-center text-black p-4">
            <div onClick={(e) => e.stopPropagation()} className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md zain-regular">
              <div className="zain-regular flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div>
                    Steps: 
                  </div>
                  <div className="flex gap-3 ml-2 items-center">
                    <div className={steps.step1 ? "bg-gradient-to-tr from-[#114516] to-pink-400 shadow-pink-500 shadow-md text-white p-2 px-3 rounded-xl" : null} >
                      1
                    </div>
                    <div className={steps.step2 ? "bg-gradient-to-tr from-[#114516] to-pink-400 shadow-pink-500 shadow-md text-white p-2 px-3 rounded-xl" : null}>
                      2
                    </div>
                  </div>
                </div>
                <div>
                  <button className="text-center text-white rounded-2xl bg-[#114516] p-2 hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md">
                    Back
                  </button>
                </div>

              </div>
              <div className="mt-5">
                <div>Search for the name of the student or their student number: </div>
                <form className="border-2 border-black p-2 rounded-xl">
                  <div>
                    <label className="mr-2">Enter the name: </label>
                    <input onChange={e => setAddOffense_formData(prevData => ({
                      ...prevData,
                      name : e.target.value
                    }))} type="text" placeholder="Enter Name" />
                    <br/>
                    <label>Enter the student number: </label>
                    <input onChange={e => setAddOffense_formData(prevData => ({
                      ...prevData,
                      studentNumber : e.target.value
                    }))} type="text" placeholder="20XX-XXXXX" />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={(event) => handleOffense_specificStudent(event)}  className="text-center text-white rounded-2xl bg-[#114516] p-2 hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md">
                      Find!
                    </button>
                  </div>
                </form>
                {/* Result */}
                {addOffense_isFind && (
                <div className="mt-5 p-2 border-2 border-black rounded-2xl">
                  <p>Is this the name(s):</p>
                  <div className="bg-amber-200 p-2 rounded-xl ">
                    Name
                  </div>
                </div>
                )}
              </div>
            </div>
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
            className="text-black rounded-2xl border-2 border-gray-600 py-2 px-4 w-full sm:w-auto flex-grow focus:outline-none focus:ring-2 focus:ring-[#114516]" // Added focus styles
            placeholder="Name or Student#"
          />
          <button className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"> {/* Added shadow */}
            Search
          </button>
        </div>

        {/* Add Offense Buttons Group */}
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <button onClick={() => handleAddOffenseModal()} className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"> {/* Added shadow */}
            Add Offense
          </button>
          <button className="px-5 py-2 w-full sm:w-auto bg-[#114516] text-white rounded-2xl hover:bg-[#1e6a23] hover:text-black transition-colors duration-200 shadow-md hover:shadow-lg"> {/* Added shadow */}
            Add Offense Type
          </button>
        </div>
      </div>

      {/* Table Container - Ensuring overflow-x-scroll works */}
      <div className="w-full md:w-[90%] mx-auto mt-10 overflow-x-auto rounded-lg shadow-md border border-gray-200">
        {/* IMPORTANT: Removed the problematic whitespace here */}
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
                      {/* Pass the entire student object to handleOpenSpecificStudent */}
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
        {totalRows > 0 && ( // Only render pagination if there are rows
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