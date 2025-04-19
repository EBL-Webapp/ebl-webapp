import React, { useState, useEffect, useRef } from "react";

const Header = ({ onLoginClick }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const menuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    let scrollTimer;
    
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (window.scrollY > 10) {
          setServicesOpen(false);
          setContactsOpen(false);
        }
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isScrolling]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuButtonRef.current && menuButtonRef.current.contains(event.target)) {
        return;
      }
      if (mobileMenuRef.current && mobileMenuRef.current.contains(event.target)) {
        return;
      }
      setServicesOpen(false);
      setContactsOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeDropdowns = () => {
    setServicesOpen(false);
    setContactsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#5a0000] text-white shadow-md">
      {/* Main Header Container */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* ===== LOGO AND TITLE SECTION ===== */}
        <div className="flex items-center">
          {/* Logo Icon */}
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-white opacity-90">
              <img
                src="/upmin_logo.jpg"
                alt="UP Mindanao Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
            </div>
          </div>

          {/* Title Text - Different versions for mobile and desktop */}
          <div className="ml-3 sm:ml-5 flex flex-col leading-tight">
            {/* Mobile Title (Two Lines) */}
            <span className="text-base sm:hidden font-nunito font-bold">UP MINDANAO</span>
            <span className="text-base sm:hidden font-nunito">EBL DORM</span>
            
            {/* Desktop Title (Single Line) */}
            <span className="hidden sm:inline-block text-xl font-nunito font-semibold">
              UP MINDANAO EBL DORM
            </span>
          </div>
        </div>

        {/* ===== MOBILE MENU BUTTON ===== */}
        <button 
          ref={menuButtonRef}
          className="sm:hidden text-white focus:outline-none p-2"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* ===== DESKTOP NAVIGATION ===== */}
        <nav className="hidden sm:flex items-center gap-x-8 text-lg font-medium">
          {/* Home Link */}
          <a href="#" className="hover:underline">
            HOME
          </a>

          {/* Services Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleServices}
              className="flex items-center"
            >
              <span>SERVICES</span>
              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Services Dropdown Menu */}
            {servicesOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#5a0000] shadow-lg z-50">
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-base">
                  Service 1
                </a>
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-base">
                  Service 2
                </a>
              </div>
            )}
          </div>

          {/* Contacts Dropdown */}
          <div className="relative">
            <button 
              onClick={toggleContacts}
              className="flex items-center"
            >
              <span>CONTACTS</span>
              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Contacts Dropdown Menu */}
            {contactsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-[#5a0000] shadow-lg z-50">
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-base">
                  Email
                </a>
                <a href="#" className="block px-5 py-3 text-white hover:bg-[#700000] text-base">
                  Address
                </a>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="bg-green-900 hover:bg-green-800 text-white rounded-md px-5 py-2 text-base"
            style={{ backgroundColor: '#15803d' }}
          >
            Log In
          </button>
        </nav>
      </div>

      {/* ===== MOBILE MENU (EXPANDED) ===== */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="sm:hidden bg-[#5a0000] border-t border-[#700000] py-2"
        >
          <nav className="flex flex-col px-4 py-2 space-y-3">
            {/* Home Link */}
            <a href="#" className="text-white hover:bg-[#700000] py-2 px-3 rounded-md text-lg">
              HOME
            </a>
            
            {/* Services Link with Dropdown Toggle */}
            <button 
              onClick={toggleServices}
              className="flex items-center justify-between text-white hover:bg-[#700000] py-2 px-3 rounded-md text-lg text-left"
            >
              <span>SERVICES</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={servicesOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                />
              </svg>
            </button>
            
            {/* Services Dropdown Items (Mobile) */}
            {servicesOpen && (
              <div className="pl-4 space-y-2">
                <a href="#" className="block text-white hover:bg-[#700000] py-2 px-3 rounded-md text-base">
                  Service 1
                </a>
                <a href="#" className="block text-white hover:bg-[#700000] py-2 px-3 rounded-md text-base">
                  Service 2
                </a>
              </div>
            )}
            
            {/* Contacts Link with Dropdown Toggle */}
            <button 
              onClick={toggleContacts}
              className="flex items-center justify-between text-white hover:bg-[#700000] py-2 px-3 rounded-md text-lg text-left"
            >
              <span>CONTACTS</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={contactsOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                />
              </svg>
            </button>
            
            {/* Contacts Dropdown Items (Mobile) */}
            {contactsOpen && (
              <div className="pl-4 space-y-2">
                <a href="#" className="block text-white hover:bg-[#700000] py-2 px-3 rounded-md text-base">
                  Email
                </a>
                <a href="#" className="block text-white hover:bg-[#700000] py-2 px-3 rounded-md text-base">
                  Address
                </a>
              </div>
            )}
            
            {/* Login Button (Mobile) */}
            <button
              onClick={onLoginClick}
              className="bg-green-900 hover:bg-green-800 text-white rounded-md py-2.5 px-4 text-lg w-full text-center"
              style={{ backgroundColor: '#15803d' }}
            >
              Log In
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;