import {useEffect, useReducer, useState} from 'react'
import supabase from '../../../supabase_client'
import Loading from '../../../components/Loading'
import PaginationControls from '../../../components/PaginationControls'
import StudentFullInfo from '../../../components/StudentFullInfo'


function AdminPage_editRoles() {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [load, setLoad] = useState(true);
  const [rows, setRows] = useState([]);
  const pageSize = 5;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

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

  useEffect(() => {

    const fetchAll = async () => {
      await Promise.all(
        retrieve_data(),

      )
      setLoad(false);
    }
    
    //After finish loading
    fetchAll();
  }, [currentPage])

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
                          <button className="bg-red-300 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                            Deny
                          </button>
                          {row.requester_type !== 'admin' ? 
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200">
                              View
                            </button> 
                          : 
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
        {/*  This is the pagination*/}
        <PaginationControls rowsPerPage={5} totalRows={totalRows}  currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

    </div>
  );
}

export default AdminPage_editRoles;
