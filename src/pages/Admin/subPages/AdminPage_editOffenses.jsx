import React, { useEffect, useState } from 'react';
import supabase from '../../../supabase_client';
import { fetchColumnValue } from '../../../fetchColumnValue';

function AdminPage_editOffenses() {
  // State variables
  const [studentsRecords, setStudentsRecords] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentRow, setStudentRow] = useState(null);
  const [offenseList, setOffenseList] = useState([]);
  const [adminInfo, setAdminInfo] = useState([]);
  const [offenses_student, setOffenses_students] = useState([]);

  // Modal toggles
  const [editOffenseStatus, setEditOffense] = useState(false);
  const [offensesType, setOffensesType] = useState(false);
  const [offense, setOffense] = useState(false);

  // Operation statuses
  const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: null });
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, success: false, error: null });
  const [addOffenseStatus, setAddOffenseStatus] = useState({ loading: false, success: false, error: null });
  const [addOffenseTypeStatus, setAddOffenseTypeStatus] = useState({ loading: false, success: false, error: null });

  // Search states
  const [searchByNameValue, setSearchByNameValue] = useState('');
  const [searchByStudentNumberValue, setSearchByStudentNumberValue] = useState('');

  // New offense type form state
  const [newOffenseType, setNewOffenseType] = useState({ offenseName: '', offenseSeverity: '' });

  // New offense form state
  const [newOffense, setNewOffense] = useState({
    studentNumber: '',
    offenseID: '',
    timestamp: new Date().toISOString().substr(0, 10)
  });

  useEffect(() => {
    display_records();
    get_offenses();
    get_admin();
  }, []);

  // Fetch functions
  const display_records = async () => {
    const { data, error } = await supabase
      .from('Application_for_Dorm_Accomodation')
      .select('studentName, studentNumber');
    if (error) {
      console.error("Error fetching student records:", error.message);
      return;
    }
    setStudentsRecords(data);
    setFilteredStudents(data);
  };

  const get_offenses = async () => {
    const { data, error } = await supabase
      .from('List_of_Offenses')
      .select('*');
    if (error) {
      console.error("Error fetching offense list:", error.message);
      return;
    }
    setOffenseList(data);
  };

  const get_admin = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Session error:", sessionError.message);
      return;
    }
    const adminID = await fetchColumnValue('admin', 'userID', sessionData.session.user.id, 'adminID');
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('adminID', adminID);
    if (error) {
      console.error("Error fetching admin info:", error.message);
      return;
    }
    setAdminInfo(data);
  };

  // Search handlers
  const searchByName = e => {
    e.preventDefault();
    setFilteredStudents(
      searchByNameValue.trim()
        ? studentsRecords.filter(s => s.studentName.toLowerCase().includes(searchByNameValue.toLowerCase()))
        : studentsRecords
    );
  };

  const searchByStudentNumber = e => {
    e.preventDefault();
    setFilteredStudents(
      searchByStudentNumberValue.trim()
        ? studentsRecords.filter(s => s.studentNumber.includes(searchByStudentNumberValue))
        : studentsRecords
    );
  };

  // Modal toggles
  const addOffenseType = () => {
    setOffensesType(prev => !prev);
    setNewOffenseType({ offenseName: '', offenseSeverity: '' });
    setAddOffenseTypeStatus({ loading: false, success: false, error: null });
  };

  const addOffense = () => {
    setOffense(prev => !prev);
    setNewOffense({ studentNumber: '', studentName: '', offenseID: '', timestamp: new Date().toISOString().substr(0, 10) });
    setAddOffenseStatus({ loading: false, success: false, error: null });
  };

  // Handlers for new offense form
  const handleNewOffenseTypeChange = e => setNewOffenseType(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNewOffenseChange = e => setNewOffense(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const on_Edit = (index, field, value) => {
    const updatedOffenses = [...offenses_student];
    updatedOffenses[index] = { ...updatedOffenses[index], [field]: value };
    setOffenses_students(updatedOffenses);
  };

  const findStudentByNumber = async number => {
    if (!number) return;
    const { data, error } = await supabase
      .from('Application_for_Dorm_Accomodation')
      .select('studentName, studentNumber')
      .eq('studentNumber', number)
      .single();
    if (error) {
      console.error("Error finding student:", error.message);
      return;
    }
    setNewOffense(prev => ({ ...prev, studentName: data.studentName, studentNumber: data.studentNumber }));
  };

  // Submit new offense type
  const submitNewOffenseType = async e => {
    e.preventDefault();
    setAddOffenseTypeStatus({ loading: true, success: false, error: null });
    if (!newOffenseType.offenseName || !newOffenseType.offenseSeverity) {
      return setAddOffenseTypeStatus({ loading: false, success: false, error: 'Please fill all fields' });
    }
    const { error } = await supabase
      .from('List_of_Offenses')
      .insert([{ ...newOffenseType }]);
    if (error) {
      return setAddOffenseTypeStatus({ loading: false, success: false, error: error.message });
    }
    await get_offenses();
    setAddOffenseTypeStatus({ loading: false, success: true, error: null });
    setTimeout(() => setOffensesType(false), 2000);
  };

  // Submit new offense
  const submitNewOffense = async e => {
    e.preventDefault();
    setAddOffenseStatus({ loading: true, success: false, error: null });
    if (!newOffense.studentNumber || !newOffense.offenseID || !newOffense.timestamp) {
      return setAddOffenseStatus({ loading: false, success: false, error: 'Please fill all fields' });
    }
    if (!adminInfo[0]?.adminID) {
      return setAddOffenseStatus({ loading: false, success: false, error: 'Admin info not available' });
    }
    
    // Remove studentName from the object since it's not in the Offenses_Occured table
    const { studentName, ...offenseData } = newOffense;
    
    const { error } = await supabase
      .from('Offenses_Occured')
      .insert([{
        ...offenseData,
        adminID: adminInfo[0].adminID
      }]);
    if (error) {
      return setAddOffenseStatus({ loading: false, success: false, error: error.message });
    }
    setAddOffenseStatus({ loading: false, success: true, error: null });
    setTimeout(() => setOffense(false), 2000);
  };

  // Edit modal
  const editOffense = async studentNumber => {
    // Toggle the edit offense modal state
    setEditOffense(prev => !prev);
    
    // Only fetch student offenses when opening the modal (not when closing)
    if (!editOffenseStatus) {
      try {
        // Find the student record
        const student = studentsRecords.find(s => s.studentNumber === studentNumber);
        setStudentRow(student);
        
        // Fetch offenses for this student with all related data
        const { data, error } = await supabase
          .from('Offenses_Occured')
          .select(`
            *,
            admin (adminName),
            List_of_Offenses (offenseName, offenseSeverity)
          `)
          .eq('studentNumber', studentNumber);
          console.log("The student number is:", studentNumber);

          
        if (error) {
          console.error("Error fetching student offenses:", error.message);
          return;
        }
        
        console.log("Fetched student offenses:", data);
        setOffenses_students(data || []);
      } catch (err) {
        console.error("Exception in editOffense:", err);
      }
    } else {
      // Clear offenses when closing the modal
      setOffenses_students([]);
    }
  };

  // Update and delete handlers
  const handleUpdate = async instance => {
    setUpdateStatus({ loading: true, success: false, error: null });
    const record = offenses_student.find(o => o.offenceInstance === instance);
    if (!record) {
      return setUpdateStatus({ loading: false, success: false, error: 'Record not found' });
    }
    
    try {
      const { error } = await supabase
        .from('Offenses_Occured')
        .update({ offenseID: record.offenseID, timestamp: record.timestamp })
        .eq('offenceInstance', instance);
        
      if (error) {
        return setUpdateStatus({ loading: false, success: false, error: error.message });
      }
      
      setUpdateStatus({ loading: false, success: true, error: null });
      setTimeout(() => setUpdateStatus({ loading: false, success: false, error: null }), 3000);
    } catch (err) {
      setUpdateStatus({ loading: false, success: false, error: err.message });
    }
  };

  const handleDelete = async instance => {
    setDeleteStatus({ loading: true, success: false, error: null });
    if (!window.confirm('Are you sure?')) {
      return setDeleteStatus({ loading: false, success: false, error: null });
    }
    
    try {
      const { error } = await supabase
        .from('Offenses_Occured')
        .delete()
        .eq('offenceInstance', instance);
        
      if (error) {
        return setDeleteStatus({ loading: false, success: false, error: error.message });
      }
      
      setOffenses_students(prev => prev.filter(o => o.offenceInstance !== instance));
      setDeleteStatus({ loading: false, success: true, error: null });
      setTimeout(() => setDeleteStatus({ loading: false, success: false, error: null }), 3000);
    } catch (err) {
      setDeleteStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <>
      <div className='bg-white pt-5'>
        {/* Add Offense Modal */}
        {offense && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75'>
            <div className='bg-white zain-regular text-black rounded-2xl p-5 md:w-[50%] max-md:w-[90%]'>
              <h2 className='text-xl font-bold mb-4'>Add New Offense</h2>
              {addOffenseStatus.success && (
                <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>Offense added successfully!</div>
              )}
              {addOffenseStatus.error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>Error: {addOffenseStatus.error}</div>
              )}
              <form onSubmit={submitNewOffense} className='w-full'>
                <label>Student Number:</label><br />
                <div className='flex gap-2 mb-2'>
                  <input
                    type='text'
                    name='studentNumber'
                    value={newOffense.studentNumber}
                    onChange={handleNewOffenseChange}
                    className='border-b-2 flex-grow'
                  />
                  <button type='button' onClick={() => findStudentByNumber(newOffense.studentNumber)} className='bg-gray-200 px-2 rounded'>Find</button>
                </div>
                <br />
                <label>Name of Admin: </label> <br />
                <p><u>{adminInfo[0]?.adminName || 'Admin Name'}</u></p> <br />
                <label>Offense Type: </label> <br />
                <select
                  name='offenseID'
                  value={newOffense.offenseID}
                  onChange={handleNewOffenseChange}
                  className='border-b-2 border-black mb-3 w-full'
                >
                  <option value=''>Select Offense Type</option>
                  {offenseList.map(an_offense => (
                    <option key={an_offense.offenseID} value={an_offense.offenseID}>
                      {an_offense.offenseName}
                    </option>
                  ))}
                </select>{' '}<br />
                <label>Date</label> <br />
                <input
                  type='date'
                  name='timestamp'
                  value={newOffense.timestamp}
                  onChange={handleNewOffenseChange}
                  className='border-b-2 border-black w-full'
                />{' '}
                <br />
                <div className='flex justify-end mt-4'>
                  <button
                    type='submit'
                    disabled={addOffenseStatus.loading}
                    className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                  >
                    {addOffenseStatus.loading ? 'Adding...' : 'Add Offense'}
                  </button>
                  <button
                    type='button'
                    className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                    onClick={addOffense}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Offense Type Modal */}
        {offensesType && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75'>
            <div className='bg-white zain-regular text-black rounded-2xl p-5 md:w-[50%] max-md:w-[90%]'>
              <h2 className='text-xl font-bold mb-4'>Add New Offense Type</h2>
              {addOffenseTypeStatus.success && (
                <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>Offense type added successfully!</div>
              )}
              {addOffenseTypeStatus.error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>Error: {addOffenseTypeStatus.error}</div>
              )}
              <form onSubmit={submitNewOffenseType} className='w-full'>
                <label>Name of Admin: </label><br />
                <p><u>{adminInfo[0]?.adminName || 'Admin Name'}</u></p><br />
                <label>Offense Name: </label><br />
                <input
                  type='text'
                  name='offenseName'
                  value={newOffenseType.offenseName}
                  onChange={handleNewOffenseTypeChange}
                  className='border-b-2 border-black mb-3 w-full'
                /> <br />
                <label>Offense Severity:</label><br />
                <select
                  name='offenseSeverity'
                  value={newOffenseType.offenseSeverity}
                  onChange={handleNewOffenseTypeChange}
                  className='border-b-2 border-black mb-3 w-full'
                >
                  <option value=''>Select Severity Type</option>
                  <option value='Minor'>Minor</option>
                  <option value='Moderate'>Moderate</option>
                  <option value='Severe'>Severe</option>
                </select><br />
                <div className='flex justify-end mt-4'>
                  <button
                    type='submit'
                    disabled={addOffenseTypeStatus.loading}
                    className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                  >
                    {addOffenseTypeStatus.loading ? 'Adding...' : 'Add Offense Type'}
                  </button>
                  <button
                    type='button'
                    className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                    onClick={addOffenseType}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Offense Modal */}
        {editOffenseStatus && studentRow && (
          <div className='fixed inset-0 z-[100] flex justify-center bg-gray-900/75 overflow-y-auto py-10 px-4'>
            <div className='bg-white zain-regular text-black rounded-2xl p-5 w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 h-fit'>
              <p className='col-span-1 md:col-span-2 lg:col-span-3'>Student Name: {studentRow.studentName}</p>
              <p className='col-span-1 md:col-span-2 lg:col-span-3'>Student Number: {studentRow.studentNumber}</p>

              <button
                className='col-span-1 md:col-span-2 lg:col-span-3 bg-[#4E0303] p-1 text-white rounded-xl hover:bg-[#1e6a23] hover:text-black'
                onClick={() => editOffense(studentRow.studentNumber)}
              >
                Return
              </button>

              {/* Status messages */}
              {updateStatus.success && <div className='col-span-1 md:col-span-2 lg:col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>Offense updated successfully!</div>}
              {updateStatus.error && <div className='col-span-1 md:col-span-2 lg:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>Error updating offense: {updateStatus.error}</div>}
              {deleteStatus.success && <div className='col-span-1 md:col-span-2 lg:col-span-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>Offense deleted successfully!</div>}
              {deleteStatus.error && <div className='col-span-1 md:col-span-2 lg:col-span-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>Error deleting offense: {deleteStatus.error}</div>}

              {/* One Card per offense */}
              {offenses_student && offenses_student.length > 0 ? (
                offenses_student.map((x, iter) => (
                  <div key={x.offenceInstance} className='m-1 border-1 border-black rounded-xl p-4'>
                    <label>Date: </label>
                    <input
                      onChange={e => on_Edit(iter, 'timestamp', e.target.value)}
                      value={x.timestamp || ''}
                      type='date'
                      className='border border-gray-300 rounded px-2 py-1 w-full'
                    />
                    <br />
                    <hr className='my-2' />
                    <label>Offense Type: </label>
                    <select
                      value={x.offenseID || ''}
                      onChange={e => on_Edit(iter, 'offenseID', e.target.value)}
                      className='border-b-2 border-black mb-3 w-full'
                    >
                      {offenseList.map(an_offense => (
                        <option key={an_offense.offenseID} value={an_offense.offenseID}>
                          {an_offense.offenseName}
                        </option>
                      ))}
                    </select>
                    <br />
                    <label>Administered by:</label>
                    <p><u>{x.admin?.adminName || 'Unknown Admin'}</u></p>
                    <br />
                    <div className='flex justify-end'>
                      <button
                        onClick={() => handleUpdate(x.offenceInstance)}
                        disabled={updateStatus.loading}
                        className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                      >
                        {updateStatus.loading ? 'Saving...' : 'Save Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(x.offenceInstance)}
                        disabled={deleteStatus.loading}
                        className='p-2 bg-[#4E0303] text-white rounded-lg m-2 hover:bg-[#1e6a23] hover:text-black'
                      >
                        {deleteStatus.loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='marcellus-sc-regular col-span-1 md:col-span-2 lg:col-span-3'>No offenses found for this student</p>
              )}
            </div>
          </div>
        )}

        {/* Search Part */}
        <div className='flex justify-center gap-3 zain-regular text-black max-md:my-5 max-md:mx-10 max-sm:flex-col'>
          <div>
            <form onSubmit={searchByName} className='max-md:flex max-md:flex-col'>
              <input
                type='text'
                placeholder='Search by Name:'
                value={searchByNameValue}
                onChange={e => setSearchByNameValue(e.target.value)}
                className='py-2 px-4 rounded-2xl border-2'
              />
              <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>Search</button>
            </form>
          </div>
          <div>
            <form onSubmit={searchByStudentNumber} className='max-md:flex max-md:flex-col'>
              <input
                type='text'
                placeholder='Student Number:'
                value={searchByStudentNumberValue}
                onChange={e => setSearchByStudentNumberValue(e.target.value)}
                className='py-2 px-4 rounded-2xl border-2'
              />
              <button className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>Search</button>
            </form>
          </div>
          <div className='flex justify-around'>
            <button onClick={addOffenseType} className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>Add Offense Type</button>
            <button onClick={addOffense} className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>ADD OFFENSE</button>
          </div>
        </div>

        {/* Display Part */}
        <div className='bg-white pb-2'>
          <div className='p-4 m-4 border-2 border-black rounded-2xl zain-regular text-black h-fit'>
            {filteredStudents && filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <div key={student.studentNumber} className='flex justify-between text-[10px] md:text-[12px] lg:text-[20px] items-center p-2 border-b'>
                  <div><p>Name: {student.studentName}</p></div>
                  <div><p>Student Number: {student.studentNumber}</p></div>
                  <div>
                    <button onClick={() => editOffense(student.studentNumber)} className='m-2 bg-[#114516] text-white py-2 px-3 rounded-2xl hover:bg-[#1e6a23] hover:text-black'>Edit Offenses</button>
                  </div>
                </div>
              ))
            ) : (
              <p className='marcellus-sc-regular'>No record...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage_editOffenses;