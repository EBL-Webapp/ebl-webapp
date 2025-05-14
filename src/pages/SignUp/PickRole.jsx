import React from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase_client';

const PickRole = () => {
  const navigate = useNavigate();

  

  // Handler for each role button click
  const handleRoleSelection = async (role) => {

    const {data : {session}, errorSession} = await supabase.auth.getSession();
    if(errorSession){
        console.log('An error in getting Session: ', errorSession);
    }

    if(role === 'admin'){

      // We insert the entry/request to be admin
      const {error : errorAddingAdmin} = await supabase
        .from("admin")
        .insert([{
          "userID" : session.user.id,
          "adminName" : session.user.user_metadata.full_name,
          "isAccepted" : false,
        }])

      if(errorAddingAdmin){
        alert("There was an error in adding you as admin: " + errorAddingAdmin.message);
        return;
      }


      navigate('/NoUpdate')
    } else {
      navigate('/StudentSignIn')
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b0000] p-4">
      <div className="bg-gray-100 p-8 rounded-2xl w-full max-w-sm shadow-lg flex flex-col items-center">
        {/* User icon */}
        <p className='text-black marcellus-sc-regular text-xl'>Pick a Role:</p>
        <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mb-8">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>

        {/* Role Selection Buttons */}
        <button
          onClick={() => handleRoleSelection('admin')}
          className="bg-[#4E0303] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all delay-50 mb-4"
        >
          Admin
        </button>

        <button
          onClick={() => handleRoleSelection('student')}
          className="bg-[#4E0303] hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all delay-50 mb-4"
        >
          Student
        </button>

      </div>
    </div>
  );
};

export default PickRole;
