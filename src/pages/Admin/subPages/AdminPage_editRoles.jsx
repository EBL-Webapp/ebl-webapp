import {useEffect, useReducer, useState} from 'react'
import supabase from '../../../supabase_client'
import Loading from '../../../components/Loading'
import PaginationControls from '../../../components/PaginationControls'
import StudentFullInfo from '../../../components/StudentFullInfo'
import TransientFullInfo from '../../../components/TransientFullInfo'


function AdminPage_editRoles() {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [load, setLoad] = useState(true);
  const [rows, setRows] = useState([]);
  const pageSize = 5;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectTransientID, setSelectedTransientId] = useState(null);
  const [adminRows, setAdminRows] = useState([]);

  const handlePageChange = (data) => {
    setCurrentPage(data)
  }

  const retrieve_data = async () => {
    //Let's retrieve the unapproved students
    const {data, error, count} = await supabase.from("all_requests_summary").select("*", {count : "exact"}).eq("request_status_boolean", false).range(from, to);
    if(error && error.message){
      console.log("There was an error in retrieving the requests: ", error.messsage);
    }
    setTotalRows(count);
    setRows(data);
    console.log(data);
    setLoad(false);
  }

  const handleDeleteAdmin = async (id) => {
    const admin_rows = adminRows.filter((row) => {
      return row.adminID !== id
    })

    setAdminRows(admin_rows);

    const {data, error} = await supabase
      .from('admin')
      .delete()
      .eq('adminID', id)

    if(error){
      console.log("There was an error in deleting the admin: ", error.message);
      return;
    }

    console.log("This should have deleted")
    console.log("Database data: ", data);
  }

  const handleAccept = async (id, type) => {
    //In accepting, there are three types the student, admin and transient

    //Let's update the UI first
    const new_rows = rows.filter((row) => {
      return row.original_entity_id !== id;
    })
    setRows(new_rows);

    if(type == 'transient'){

      const {error} = await supabase.from('Transient').update({
        isAccepted : true
      }).eq("transientID", id);
      if(error){
        console.log("There was an error in approving the Transient's role: ", error.message);
        return;
      }

    } else if(type == 'student'){

      const {error} = await supabase
        .from('Students')
        .update({
          isAssessed : true
        })
        .eq("studentNumber", id);

      if(error){
        console.log("There was an error in approving the student's role: ", error.message);
        return;
      }

    } else { //Assuming that this is admin

      const {error} = await supabase
        .from("admin")
        .update({
          isAccepted : true
        })
        .eq("adminID", id);

      if(error){
        console.log("There was an error in approving tge admin's role: ", error.message);
        return;
      }
    }

  }

  const getAdmins = async () => {

    const session_adminID = localStorage.getItem('adminID')

    const {data, error} = await supabase
      .from('admin')
      .select('adminName, email, adminID')
      .neq('adminID', session_adminID)
      .eq('isAccepted', true)

    if(error){
      console.log("There was an error in getting the admins: ", error.message);
      return;
    }

    setAdminRows(data);
    console.log("Please delete me: ", data);
  }

  const handleDelete= async (id, type) => {

    const new_rows = rows.filter((row) => {
        return row.original_entity_id !== id
      })
    setRows(new_rows);

    if (type === 'student'){
      const {error} = await supabase
        .from('Students')
        .delete()
        .eq("studentNumber", id)

      if(error){
        console.log("There was an error in deleting this row: ", error.message);
        return;
      }
    }
  }

  useEffect(() => {

    const fetchAll = async () => {
      await Promise.all(
        retrieve_data(),
        getAdmins(),
      )
      setLoad(false);
    }
    
    //After finish loading
    fetchAll();
  }, [currentPage])

  // This function will be called by the View button
  const handleViewStudentInfo = (studentId) => {
    setSelectedStudentId(studentId);
  }

  // This function will be passed to the StudentFullInfo component to close the modal
  const handleCloseStudentInfo = () => {
    setSelectedStudentId(null);
  }

  const handleCloseTransientInfo = () => {
    setSelectedTransientId(null);
  }

  return (
    <div className="pt-10 pb-60">
      {load ? <Loading/> : null}
      {/* This is the roles request table */}
      <div>
        <div>
          <h1 className="text-black zain-regular ml-15">Roles Request</h1>
        </div>
        <div className="mt-10 overflow-x-auto shadow-lg rounded-lg w-[90%] mx-auto">
          <table className="w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              {}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Requested Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>

            {rows && rows.length > 0 ? (

              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example Row (you'll replace this with your dynamic data) */}
                {rows.map((row) => {
                  return (
                    <tr key={row.original_entity_id} className='text-gray-500'>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                        {row.requester_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {row.requester_type == "student" ? 'Student' : row.requester_type == 'admin' ? 'Admin' : 'Transient'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {row.email ? row.email : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                            <button onClick={() => handleAccept(row.original_entity_id, row.requester_type)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                                Accept
                            </button>
                            <button onClick={() => handleDelete(row.original_entity_id, row.requester_type)} className="bg-red-300 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                                Deny
                            </button>
                            {row.requester_type === 'student' ?
                                <button
                                    onClick={() => setSelectedStudentId(row.original_entity_id)} // Set student ID for StudentFullInfo
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                                    View
                                </button>
                            : row.requester_type === 'transient' ? // Add this condition for transients
                                <button
                                    onClick={() => setSelectedTransientId(row.original_entity_id)} // Set transient ID for TransientFullInfo
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                                    View
                                </button>
                            : // For admin or other types, keep disabled
                                <button disabled className="bg-gray-200 text-white px-3 py-1 rounded text-sm transition-colors cursor-not-allowed duration-200">
                                    View
                                </button>
                            }
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {/* End Example Row */}
              </tbody>

            ) : (
              <tbody>
                <tr className='font-medium text-gray-500'>
                  <td colSpan={4} className='text-center py-5'>
                    No Data Found
                  </td>
                </tr>
              </tbody>
            )}

          </table>
        </div>
        {/*  This is the pagination*/}
        <PaginationControls rowsPerPage={5} totalRows={totalRows}  currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {/* RENDER THE STUDENTFULLINFO COMPONENT OUTSIDE THE MAP */}
      {selectedStudentId && (
        <StudentFullInfo
          isOpen={!!selectedStudentId}
          onClose={handleCloseStudentInfo}
          studentNumber={selectedStudentId}
        />
      )}

      {
        selectTransientID && (
          <TransientFullInfo 
          isOpen={!!selectTransientID}
          onClose={handleCloseTransientInfo}
          transientId={selectTransientID}
          />
        )
      }


      {/* This is the admin delete button */}
      <div className='mt-20'>
        <div>
          <h1 className="text-black zain-regular ml-15">List of Admins</h1>
        </div>

        {/* This is the table part */}
        <div class="mt-20">
          <div class="mt-10 overflow-x-auto shadow-lg rounded-lg w-[90%] mx-auto">
            <table class="w-full bg-white border border-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Admin Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Account Email
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>

              {adminRows.length > 0 && adminRows ? (
                <tbody class="bg-white divide-y divide-gray-200">
                  {adminRows.map((x) => (
                  <tr key={x.adminID} class="text-gray-500">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {x.adminName}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {x.email ? x.email : 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div class="flex justify-center space-x-2">
                        <button
                          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                          onClick={() => handleDeleteAdmin(x.adminID)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  ) )}
                </tbody>
              ) : (
                <tbody>
                  <tr className='font-medium text-gray-500'>
                    <td colSpan={3} className='text-center py-5'>
                      No Data Found
                    </td>
                  </tr>
                </tbody>
              )}

            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminPage_editRoles;
