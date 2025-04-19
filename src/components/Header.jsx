import React, { useState, useEffect } from "react";

const Header = ({ onLoginClick }) => {
  // State for dropdown menus
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  // Close dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      setServicesOpen(false);
      setContactsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dropdown toggle handlers
  const toggleServices = (e) => {
    e.stopPropagation();
    setServicesOpen(!servicesOpen);
    setContactsOpen(false);
  };

  const toggleContacts = (e) => {
    e.stopPropagation();
    setContactsOpen(!contactsOpen);
    setServicesOpen(false);
  };

  // Close all dropdowns
  const closeDropdowns = () => {
    setServicesOpen(false);
    setContactsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#5a0000] text-white shadow-md">
      <div className="flex flex-wrap sm:flex-nowrap w-full items-start sm:items-center justify-between px-4 py-3 gap-y-2">
        {/* ===== LOGO AND TITLE GROUP ===== */}
        <div className="flex items-start sm:items-center w-full sm:w-auto">
          {/* Logo Icon */}
          <div className="relative h-14 w-14 shrink-0">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-white opacity-90">
              <img
                src="/upmin_logo.jpg"
                alt="UP Mindanao Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>

          {/* Title Text */}
          <div className="ml-5 flex flex-col leading-tight">
            <span className="text-lg sm:hidden font-nunito font-bold">UP MINDANAO</span>
            <span className="text-lg sm:hidden font-nunito">EBL DORM</span>
            <span className="hidden sm:inline-block text-xl font-nunito font-semibold">
              UP MINDANAO EBL DORM
            </span>
          </div>
        </div>

        {/* ===== NAVIGATION ITEMS ===== */}
        <nav className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-x-8 gap-y-3 text-lg font-medium w-full sm:w-auto">
          {/* Home Link */}
          <a href="#" className="hover:underline w-full sm:w-auto text-left">
            HOME
          </a>

          {/* Services Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={toggleServices}
              className="flex items-center w-full sm:w-auto"
            >
              <span>SERVICES</span>
              <svg className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-md bg-[#5a0000] shadow-lg z-50">
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-lg">
                  Service 1
                </a>
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-lg">
                  Service 2
                </a>
              </div>
            )}
          </div>

          {/* Contacts Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={toggleContacts}
              className="flex items-center w-full sm:w-auto"
            >
              <span>CONTACTS</span>
              <svg className="h-6 w-6 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {contactsOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-md bg-[#5a0000] shadow-lg z-50">
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-lg">
                  Email
                </a>
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-lg">
                  Address
                </a>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="bg-green-900 hover:bg-green-800 text-white rounded-md px-6 py-2.5 text-lg w-full sm:w-auto"
            style={{ backgroundColor: '#15803d' }}
          >
            Log In
          </button>
        </nav>
      </div>

      {/* Invisible overlay to capture clicks outside dropdowns */}
      {(servicesOpen || contactsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdowns}
        />
      )}
    </header>
  );
};

export default Header;