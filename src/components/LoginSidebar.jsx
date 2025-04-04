import React from 'react';

export default function LoginSidebar({ isMobile, isCollapsed, toggleSidebar }) {
  return (
    <div className={`fixed right-0 top-[80px] h-[calc(100vh-80px)] bg-[#2E6F40] p-6 flex flex-col items-center transition-all duration-300 ease-in-out ${isCollapsed ? 'w-12' : 'w-[280px]'} md:w-[280px]`}>
      {isMobile && (
        <button
          className="text-white mb-4"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
      <div className={`${isCollapsed ? 'hidden md:flex' : 'flex'} flex-col items-center w-full transition-all duration-300 ease-in-out`}>
        <div className="mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div className="w-full mb-4">
          <label className="block text-white text-sm mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Enter email"
          />
        </div>
        <div className="w-full mb-6">
          <label className="block text-white text-sm mb-2">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Enter password"
          />
        </div>
        <button className="w-full bg-white text-[#2E6F40] py-2 rounded-md font-medium mb-4 hover:bg-gray-100 transition">
          Sign In
        </button>
        <a href="#" className="text-white text-sm underline mb-6 hover:text-gray-200">
          Forgot password?
        </a>
        <div className="text-white text-sm mb-4">or</div>
        <button className="w-full border-2 border-white text-white py-2 rounded-md font-medium hover:bg-white/10 transition">
          Sign Up
        </button>
      </div>
    </div>
  );
}