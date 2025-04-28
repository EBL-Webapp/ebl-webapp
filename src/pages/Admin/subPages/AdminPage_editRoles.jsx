import { React, useEffect, useState } from 'react';
import supabase from '../../../supabase_client';

function AdminPage_editRoles() {
  const [userData, setUserData] = useState([]);
  const [deniedPeople, setDeniedPeople] = useState([]);
 
  useEffect(() => {

    const session = () => {
        const {data : dataSession, error : errorSession} = supabase.auth.getSession();
        if(error){
            console.log('Error: ', errorSession.message);
        }

        console.log('Session Data: ', dataSession);
    }




    const fetchData = async () => {
      const { data, error } = await supabase
        .from('userRoles')
        .select(`
          userID,
          roles,
          desiredRole,
          safe_users (
            full_name,
            email
          )
        `)
        // only bring back users whose role = 'no_role'
        .eq('roles', 'no_role');

      if (error) {
        console.error('Fetch error:', error);
        return;
      }

      // flatten the nested array into a simple .role
      const usersWithRoles = data.map((u) => ({
        id:        u.userID,
        full_name: u.safe_users.full_name,
        role:      u.roles,
        desiredRole: u.desiredRole,
        email:     u.safe_users.email,
      }));

      setUserData(usersWithRoles);

      const {data : deniedData, error : deniedError} = await supabase
        .from('userRoles')
        .select(`
            
            userID,
            roles,
            desiredRole,
            safe_users(
                full_name,
                email
            )
        `)
        .eq('roles', 'denied');

        console.log('This is the data:', deniedData);

        if(deniedError){
            console.log('Error:', deniedError.message);
            return;
        }

        const deniedPeopleMap = deniedData.map((u) => ({
            id:        u.userID,
            full_name: u.safe_users.full_name,
            role:      u.roles,
            desiredRole: u.desiredRole,
            email:     u.safe_users.email,
          }));

        setDeniedPeople(deniedPeopleMap);


    };

    fetchData();
  }, []);


  const handleAccept = async (id, desiredRole) => {
    const {error} = await supabase
        .from("userRoles")
        .update({
            'roles' : desiredRole,
        })
        .eq('userID', id);

    if(error){
        console.log("Error in accepting: ", error.message);
    }
    window.location.reload();

  }

  const handleDeny = async (id) => {
    const {error} = await supabase
        .from("userRoles")
        .update({
            roles : 'denied',
        })
        .eq("userID", id);

    if(error){
        console.log('An error occured:', error.message);
    }

    window.location.reload();
  }

  const handleDelete = async (id) => {
    const {error} = await supabase
        .from('userRoles')
        .delete()
        .eq('userID', id);

    console.log('Error: ', error.message);
    window.location.reload();
  }

  return (
    <div className="py-5">
      <div className="mx-2 p-2 border-2 border-black rounded-2xl flex flex-col gap-2 text-black zain-regular">
        {userData.map((u) => (
          <div key={u.id} className="flex justify-between items-center">
            <p>Name: {u.full_name}</p>
            <p>Requested Role: {u.desiredRole}</p>
            <p>Email: {u.email}</p>
            <div>
              <button className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600" onClick={() => handleDeny(u.id)}>
                Deny
              </button>
              <button className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600" onClick={() => handleAccept(u.id, u.desiredRole)}>
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-3 mx-2 p-2 border-black border-2 rounded-2xl flex flex-col gap-2 text-black zain-regular bg-[#4e03032e]'>
        <p className='marcellus-sc-regular '>List of denied roles: </p> <hr/>

        {deniedPeople.map((i) => (
            <div  className="flex justify-between items-center">
                <p>Name: {i.full_name}</p>
                <p>Requested Role: {i.desiredRole}</p>
                <p>Email: {i.email}</p>
                <div>
                <button className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600" onClick={() => handleDelete(i.id)}>
                    Delete
                </button>
                <button className="w-20 py-3 bg-[#4E0303] text-white rounded-xl mr-2 hover:bg-gray-600" onClick={() => handleAccept(i.id, i.desiredRole)}>
                    Accept
                </button>
                </div>
            </div>
        ))}

      </div>
    </div>
  );
}

export default AdminPage_editRoles;
