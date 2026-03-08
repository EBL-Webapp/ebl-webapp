import { useEffect, useState, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import supabase from '../../../supabase_client';


function Header() {
  const navigate = useNavigate();

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // Using console.error instead of alert() for better user experience in a web app
      console.error(`Error during logout: ${error.message}`);
      // In a production app, you'd show a user-friendly modal or toast notification here
    }

    navigate('/');
  };

  // State for the burger menu
  const [menuOpen, setMenuOpen] = useState(false);
  // Ref for the burger menu container (including the trigger and the dropdown itself)
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // State for the services dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Ref for the services dropdown container
  const dropdownRef = useRef(null);

  // toggleDropdown kept for potential future use with services dropdown
  // const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // State for the contacts dropdown
  const [contactsOpen, setContactsOpen] = useState(false);
  // Ref for the contacts dropdown container
  const contactsRef = useRef(null);

  const toggleContacts = () => setContactsOpen(!contactsOpen);

  // State for displaying the logo and username
  const [accountLogo, setAccountLogo] = useState("/account_Circle.svg");
  const [userName, setUserName] = useState("Student User");

  // Effect to load user session data for logo and username
  useEffect(() => {
    const logoLoad = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }

      if (session) {
        setAccountLogo(session.user.user_metadata.avatar_url);
        setUserName(session.user.user_metadata.full_name);
      }
    };

    logoLoad();
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the burger menu dropdown if open and click is outside its ref
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      // Close the services dropdown if open and click is outside its ref
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // Close the contacts dropdown if open and click is outside its ref
      if (contactsOpen && contactsRef.current && !contactsRef.current.contains(event.target)) {
        setContactsOpen(false);
      }
    };

    // Add the mousedown event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function: remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, dropdownOpen, contactsOpen]); // Dependencies ensure the effect re-runs if any dropdown state changes

  return (
    <nav className='h-fit bg-[#4E0303] w-full py-3 relative z-50 flex flex-col md:flex-row md:justify-between md:items-center'>
      {/* Left side: Burger, Logo, App Name */}
      <div className='flex items-center relative px-2 md:px-5'>
        {/* Burger menu trigger and dropdown container */}
        <div className='relative' ref={menuRef}> {/* Attach menuRef here */}
          <img
            src='/burger_Button.png'
            className='h-10 w-10 mr-2 bg-white/75 rounded-2xl p-1 cursor-pointer'
            alt="Menu"
            onClick={toggleMenu} // Move onClick directly to the image
          />
          {/* Burger Menu Dropdown Content */}
          <div
            className={`absolute top-12 left-0 bg-white shadow-lg rounded-md p-4 w-48 max-w-[80vw] transition-all duration-200 text-center z-52 ${
              menuOpen ? 'block' : 'hidden'
            }`}
          >
            <ul className="flex flex-col gap-1 text-black marcellus-sc-regular">
              <Link to="/admin/overstayPermits" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Overstay Permits</Link> <hr/>
              <Link to="/admin/editOffenses" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Edit Offenses</Link><hr/>
              <Link to="/admin/studentsArchive" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Student Archive</Link><hr/>
              <Link to="/admin/studentsPayments" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Student Payments</Link><hr/>
              {/* <Link to="/admin/transientRequests" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Transient Requests</Link> <hr/> */}
              <Link to="/admin/editRoles" className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Edit Roles</Link> <hr/>
              <Link to='/admin/studentsList' className="hover:bg-gray-200 p-2 rounded transition-all duration-200 whitespace-nowrap">Students List</Link>
            </ul>
          </div>
        </div>

        <img
          src='/upmin_logo.jpg'
          className='h-10 w-10 rounded-full mr-2'
          alt="UPMin"
        />
        <p className='marcellus-sc-regular text-[12px] lg:text-[20px] text-white grow truncate'> {/* grow to allow text to fill space */}
          UP Mindanao EBL Dorm
        </p>
      </div>

      {/* Right side: Services, Contacts, User Info/Logout */}
      <div className='flex items-center justify-end max-md:mt-5 px-2 md:px-5'>
        <ul className='flex flex-col md:flex-row md:items-center w-full md:w-auto'> {/* w-full for mobile stacking */}
          {/* Contacts dropdown trigger and container */}
          <li className='flex items-center relative mr-2 md:mr-5 py-3 text-[20px] lg:text-[20px] zain-regular max-md:hover:bg-gray-900/50 hover:bg-gray-300/20 max-md:rounded-lg max-md:p-3 rounded-2xl text-white'>
            <div onClick={toggleContacts} ref={contactsRef} className='flex items-center cursor-pointer px-3'> {/* Attach contactsRef here */}
              CONTACTS <img src='/dropdown.png' className='h-4 ml-2 max-lg:h-3'></img>
            </div>
            <div className={`${contactsOpen ? 'block' : 'hidden'} transition-all duration-200 absolute top-full md:top-13 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 bg-white p-1 rounded-lg text-black z-51 w-48 max-w-[80vw]`}>
              <ul>
                <li className='hover:bg-gray-200 p-2 rounded wrap-break-word'>
                  <a
                    href={
                      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
                      encodeURIComponent("shs_osa.upmindanao@up.edu.ph")
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    shs_osa.upmindanao@up.edu.ph
                  </a>
                </li>
              </ul>
            </div>
          </li>
          {/* User Info and Logout */}
          <li className='lg:mr-5 md:mr-10 px-3 py-3 text-[20px] zain-regular max-md:hover:bg-gray-900/50 max-md:ml-0 max-lg:mr-3 rounded-3xl max-md:p-3 text-white flex items-center flex-row relative bg-gray-200/30'>
            <img src={accountLogo} className='h-10 w-10 rounded-full'></img>
            <p className='text-center items-center ml-4 max-md:relative max-md:top-1 zain-regular truncate'>{userName}</p>
            <button className='flex flex-row items-center ml-4 px-2 py-1 rounded-lg hover:bg-[#4e030397] transition-all duration-500 ease-in-out cursor-pointer' onClick={onLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
              <p className='zain-regular ml-1'>Log out</p>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
