import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabase_client';

const LoginPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRole, setSelectedRole] = useState('no_role'); // Add state for role

  useEffect(() => {

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.log('Error during Google login:', error.message);
      alert(`Error during Google login: ${error.message}`);
    }

    // Now you can handle the selected role during login if needed
    console.log(`Selected Role: ${selectedRole}`);
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b0000] p-4">
      {isMobile ? (
        // Mobile layout
        <div className="bg-gray-100 p-8 rounded-2xl w-full max-w-sm shadow-lg flex flex-col items-center relative">
          {/* User icon */}
          <Link to='/'>
            <img
              src='home.png'
              className='h-10 absolute left-4 hover:bg-gray-500 hover:transition-all hover:delay-50 hover:p-2 hover:h-12 hover:rounded-full '
              alt="Home"
            />
          </Link>

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

          <button onClick={handleGoogleLogin}>
            <div className="text-gray-600 border-1 border-gray-400 py-7 px-10 rounded-4xl shadow-sm shadow-gray-50 flex flex-row gap-7 items-center transition-all delay-50 hover:shadow-lg hover:shadow-gray-500 hover:bg-gray-200">
              <img src="google-icon.svg" className="h-9" alt="Google Icon" />
              <p>Continue with Google</p>
            </div>
          </button>
        </div>
      ) : (
        // Desktop layout
        <div className="bg-gray-100 relative p-8 rounded-2xl w-full max-w-md text-center shadow-lg h-[500px]">
          <Link to='/'>
            <img
              src="home.png"
              className="h-15 absolute left-4 hover:bg-gray-500 hover:transition-all hover:delay-50 hover:p-2 hover:h-17 hover:rounded-full "
              alt="Home"
            />
          </Link>

          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
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
          </div>

          <button onClick={handleGoogleLogin}>
            <div className="text-gray-600 border-1 border-gray-400 py-7 px-10 rounded-4xl shadow-sm shadow-gray-50 flex flex-row gap-7 items-center transition-all delay-50 hover:shadow-lg hover:shadow-gray-500 hover:bg-gray-200">
              <img src="google-icon.svg" className="h-9" alt="Google Icon" />
              <p>Continue with Google</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
