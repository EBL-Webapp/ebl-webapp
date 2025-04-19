import React, { useState, useEffect } from 'react';

const LoginPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3b0000] p-4">
      {isMobile ? (
        // Mobile layout
        <div className="bg-gray-100 p-8 rounded-2xl w-full max-w-sm shadow-lg flex flex-col items-center">
          {/* User icon */}
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

          <form className="w-full space-y-6">
            {/* Email field */}
            <div className="flex flex-col">
              <label htmlFor="mobile-email" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Email
              </label>
              <input
                type="email"
                id="mobile-email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 text-base text-center"
              />
            </div>
            
            {/* Password field */}
            <div className="flex flex-col">
              <label htmlFor="mobile-password" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Password
              </label>
              <input
                type="password"
                id="mobile-password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 text-base text-center"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-900 text-white font-semibold rounded-md hover:bg-green-800 transition duration-200 text-base"
              style={{ backgroundColor: '#166534' }}
            >
              Log In
            </button>

            <div className="text-sm text-gray-600 mt-4 text-center">
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      ) : (
        // Desktop layout
        <div className="bg-gray-100 p-8 rounded-2xl w-full max-w-md text-center shadow-lg">
          {/* User icon */}
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

          <form className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>
            
            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-900 text-white font-semibold rounded-md hover:bg-green-800 transition duration-200"
              style={{ backgroundColor: '#166534' }}
            >
              Log In
            </button>

            <div className="text-sm text-gray-600 mt-4">
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;