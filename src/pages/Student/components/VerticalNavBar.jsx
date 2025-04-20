import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function VerticalNavbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // always open on large screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`top-20 left-0 h-[calc(100vh-5rem)] bg-white shadow-lg border-r border-gray-300 flex flex-col transition-all duration-300 ease-in-out z-40 text-sm font-light
        ${isMobile ? (isOpen ? 'w-48' : 'w-12 fixed') : 'w-54'}`}
    >
      {/* Toggle Arrow - Mobile Only */}
      {isMobile && (
        <div className="flex justify-end p-2 mt-6">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none text-gray-600 hover:text-gray-800 !bg-transparent !border-none"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Student Profile */}
      <div className={`flex flex-col items-center text-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 p-6' : 'opacity-0 h-0 overflow-hidden'} md:opacity-100 md:p-6`}>
        <img
          src="https://via.placeholder.com/64"
          alt="Profile"
          className="rounded-full w-16 h-16 mb-4 border border-[#114516] mt-6"
        />
        <p className="font-semibold text-base">Juan Dela Cruz</p>
        <p className="text-sm">Year | Course</p>
        <p className="text-sm">2021-12345</p>
      </div>

      {/* Navbar links */}
      <nav className="mt-6 space-y-2 flex flex-col items-center">
        <a href="#offenses" className="block py-2 px-4 w-full text-center hover:bg-[#114516] hover:!text-white rounded-md">
          {isOpen ? 'Offenses' : 'O'}
        </a>
        <a href="#student-data" className="block py-2 px-4 w-full text-center hover:bg-[#114516] hover:!text-white rounded-md">
          {isOpen ? 'Student Data' : 'SD'}
        </a>
        <a href="#charge-slip" className="block py-2 px-4 w-full text-center hover:bg-[#114516] hover:!text-white rounded-md">
          {isOpen ? 'Charge Slip' : 'CS'}
        </a>
        <a href="#overnight-slip" className="block py-2 px-4 w-full text-center hover:bg-[#114516] hover:!text-white rounded-md">
          {isOpen ? 'Overnight Slip' : 'OS'}
        </a>
      </nav>
    </aside>
  );
}