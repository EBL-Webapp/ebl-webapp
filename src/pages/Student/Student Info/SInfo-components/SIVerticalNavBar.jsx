import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, UserRound, Lock, Home, Clipboard, Book } from "lucide-react";
import { NavLink } from "react-router-dom";
import supabase from '../../../../supabase_client';
import { fetchColumnValue } from "../../../../fetchColumnValue";
import { getSession } from "../../../../getSession";

export default function VerticalNavbar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [info, setInfo] = useState({});

  const loadInfo = async () => {
    const session_temp = await getSession();

    const partialInfo = {
      accLogo : session_temp.session.user.user_metadata.avatar_url,
    }
    ;

    console.log("Session: ", session_temp);

    // Now we get the name
    const studentNumber_temp = await fetchColumnValue("Students", "userID", session_temp.session.user.id, "studentNumber");
    const {data, error} = await supabase.from("Application_for_Dorm_Accomodation").select("studentName, Course").eq("studentNumber", studentNumber_temp);

    if(error){
      console.log("Error in retrieving the name: ", error.message);
      return;
    }

    setInfo({
      ...partialInfo, 
      studentName : data[0] ? data[0].studentName : null,
      Course : data[0] ? data[0].Course : null,
    })
  }

  useEffect(() => {
    loadInfo();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // always open on large screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: "Accommodation", icon: Clipboard, href: "#dorm-accommodation" },
    { label: "Acknowledgement", icon: Book, href: "#acknowledgement" },
  ];

  return (
    <aside
      className={`top-15 sm:top-20 left-0 h-[calc(105vh-5rem)] sm:h-[calc(100vh-5rem)] bg-white shadow-lg border-r border-gray-300 flex flex-col transition-all duration-300 ease-in-out z-40 text-xs sm:text-sm font-light
        ${isMobile ? (isOpen ? "w-48" : "w-12 fixed") : "w-54"}`}
    >
      {/* Toggle Arrow - Mobile Only */}
      {isMobile && (
        <div className="flex justify-end p-2 mt-4">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none text-gray-600 hover:text-gray-800 font-light !bg-transparent !border-none"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Student Profile */}
      <div
        className={`flex flex-col items-center text-center transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 p-6" : "opacity-0 h-0 overflow-hidden"
        } md:opacity-100 md:p-6`}
      >
        <img
          src={info.accLogo}
          alt="Profile"
          className="rounded-full w-16 h-16 mb-4 border border-[#114516] mt-0 sm:mt-6"
        />
        <p className="font-semibold text-sm sm:text-base">{info.studentName}</p>
        <p className="text-xs sm:text-sm">{info.Course}</p>
        <p className="text-xs sm:text-sm">Hello</p>
      </div>

      {/* Navbar links */}
      <nav className="mt-4 sm:mt-6 space-y-1 px-2">
        {/* Main Page Link */}
        <NavLink
          to="/student/student-info"
          className={({ isActive }) =>
            `flex items-center ${isOpen ? "gap-4" : "justify-center"} py-1 px-3 rounded-md transition-all duration-200 ${
              isActive
                ? "bg-[#114516] !text-white !font-light"
                : "text-gray-700 hover:bg-[#114516]/90 hover:text-white font-light"
            }`
          }
        >
          <div
            className={`flex items-center justify-center rounded-full${
              isOpen ? "w-8 h-8" : "w-9 h-6"
            } transition-all`}
          >
            <UserRound
              size={isOpen ? 14 : 16}
              className={`transition-all ${
                isOpen
                  ? "text-gray-500 group-hover:text-[#114516]"
                  : "text-gray-500 group-hover:text-white"
              }`}
            />
          </div>
          {isOpen && <span className="text-xs font-light">Student Data</span>}
        </NavLink>

        {/* Anchor Links */}
        {navLinks.map(({ label, icon: Icon, href }) => (
          <a
          key={label}
          href={href}
          className={`flex items-center ${isOpen ? "ml-6 py-1 pr-3 justify-start" : "justify-center px-3 py-3"} rounded-md transition-colors group ${
            isOpen
              ? "text-gray-600 hover:text-[#114516] hover:bg-[#114516]/10 font-light"
              : "hover:bg-[#114516]"
          }`}
        >
          {/* Icon */}
          <div className="w-6 flex justify-center">
            <Icon
              size={isOpen ? 12 : 14}
              className={`transition-all ${
                isOpen
                  ? "text-gray-500 group-hover:text-[#114516]"
                  : "text-gray-600 group-hover:text-white"
              }`}

            />
          </div>
        
          {/* Label */}
          {isOpen && (
            <span className="ml-3 text-xs leading-tight text-left font-light">
              {label}
            </span>
          )}
        </a>
        
        ))}

        {/* Go Back */}
        <NavLink
          to="/student"
          className={`mt-6 flex items-center ${
            isOpen ? "justify-end" : "justify-center px-3 py-3"
          } text-gray-400 hover:text-[#114516] text-xs italic rounded-md transition-all`}
        >
            {isOpen && <span className="text-xs text-gray-500 font-light">Go Back</span>}
          <div
            className={`flex items-center justify-center rounded-full ${
              isOpen ? "w-8 h-8" : "w-9 h-2"
            } transition-all`}
          >
            <Home
              size={isOpen ? 13 : 14}
              className={`transition-all ${
                isOpen
                  ? "text-gray-500 group-hover:text-[#114516]"
                  : "text-[#4E0303] group-hover:text-white"
              }`}
            />
          </div>
        </NavLink>
      </nav>
    </aside>
  );
}
