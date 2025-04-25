import React, { useEffect, useState } from 'react';
import {Link, Outlet} from 'react-router-dom'
import '../Styles/Header.css';
import supabase from '../../../supabase_client';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const onLogout = async () => {
    const {error} = await supabase.auth.signOut();

    if (error) {
      alert(`Error during logout: ${error.message}`);
    }

    navigate('/')
  } 

    // This part is for the burger button
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

//   This part is for the services dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

// This part is for the contacts dropdown
    const [contactsOpen, setContactsOpen] = useState(false);
    const toggleContacts = () => setContactsOpen(!contactsOpen);

    // This part is for displaying the logo and the username
    const [accountLogo, setAccountLogo] = useState("/account_Circle.svg");
    const [userName, setUserName] = useState("Student User");

    useEffect(() => {
      const logoLoad = async () => {
        const {data: { session }, error } = await supabase.auth.getSession();
        if(error){
          console.log('Error fetching session:', error.message);
        }

        if (session) {
          // This is for the Logo
          setAccountLogo(session.user.user_metadata.avatar_url);
          console.log('User is logged in:', session.user);

          setUserName(session.user.user_metadata.full_name);
        }
      };

      logoLoad();
    }, [])

  return (
    <nav className='h-fit bg-[#4E0303] w-full md:grid md:grid-cols-2 py-3 relative z-50'>
      {/* Left side */}
      <div className='flex items-center relative'> 
        <div onClick={toggleMenu}>
          <img
            src='/burger_Button.png'
            className='h-10 w-10 ml-1 md:ml-5 bg-white/75 rounded-2xl p-1'  
            alt="Menu"
          />
        </div>

        <img
          src='/upmin_logo.jpg'
          className='h-10 w-10 ml-2 md:ml-5 rounded-full'
          alt="UPMin"
        />
        <p className='marcellus-sc-regular text-[12px] lg:text-[20px] ml-2 md:ml-3 text-white trunctate'>
          UP Mindanao EBL Dorm
        </p>

        {/* Dropdown - appears on toggle */}
        <div
          className={`absolute top-12 left-1 lg:top-15 lg:left-5 bg-white shadow-lg rounded-md p-4 w-[40%] transition-all duration-200 text-center z-52 ${
            menuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col gap-1 text-black marcellus-sc-regular">
            <Link to="/overstayPermits" className="hover:bg-gray-200 p-2 rounded transition-all duration-200">Overstay Permits</Link> <hr/>
            <Link to="/editOffenses" className="hover:bg-gray-200 p-2 rounded transition-all duration-200">Edit Offenses</Link><hr/>
            <Link to="/studentsArchive" className="hover:bg-gray-200 p-2 rounded transition-all duration-200">Student Archive</Link><hr/>
            <Link to="/studentsPayments" className="hover:bg-gray-200 p-2 rounded transition-all duration-200">Student Payments</Link><hr/>
            <Link to="/transientRequests" className="hover:bg-gray-200 p-2 rounded transition-all duration-200">Transient Requests</Link>
          </ul>
        </div>
      </div>

      {/* Right side - stays untouched */}
      <div className='items-center md:flex justify-end'>
        <ul className='flex flex-col md:flex-row max-md:mt-5 max-md:flex-col-reverse'>
          <li onClick={toggleDropdown} className='relative flex items-center mr-2 md:mr-5 md:px-3  px-1 py-3 text-[20px] lg:text-[20px]  zain-regular max-md:hover:bg-gray-900/50 max-md:ml-3 max-md:rounded-lg max-md:p-3  text-white hover:bg-gray-300/20 rounded-2xl'>
            SERVICES <img src='/dropdown.png' className='h-4 ml-2 max-lg:h-3'></img>
            <div className={`${dropdownOpen ? 'block' : 'hidden'} transition-all duration-200  top-13 left-[-1px] md:left-[-100px] absolute zain-regular ml-3 bg-white p-1 rounded-lg text-black z-51`}>
                <ul>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded md:w-70'>
                        Person 1: 09XX-XXXX-XXX
                    </li>
                    <hr></hr>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded'>
                        Person 2: 09XX-XXXX-XXX
                    </li>
                    <hr></hr>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded'>
                        Person 3: 09XX-XXXX-XXX
                    </li>
                </ul>
            </div>
          </li>
          <li onClick={toggleContacts} className='flex items-center relative mr-2 md:mr-5 md:px-3  px-1 py-3 text-[20px] lg:text-[20px] zain-regular max-md:hover:bg-gray-900/50 hover:bg-gray-300/20 max-md:ml-3 max-md:rounded-lg max-md:p-3 rounded-2xl text-white'>
            CONTACTS  <img src='/dropdown.png' className='h-4 ml-2 max-lg:h-3'></img>
            <div className={`${contactsOpen ? 'block' : 'hidden'} transition-all duration-200  top-12 left-[-2px] md:top-13 md:left-[-90px] absolute zain-regular ml-3 bg-white p-1 rounded-lg text-black z-51`}>
                <ul>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded md:w-70'>
                        Person 1: 09XX-XXXX-XXX
                    </li>
                    <hr></hr>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded'>
                        Person 2: 09XX-XXXX-XXX
                    </li>
                    <hr></hr>
                    <li className='radius-2 hover:bg-gray-200 p-2 rounded'>
                        Person 3: 09XX-XXXX-XXX
                    </li>
                </ul>
            </div>
          </li>
          <li className='lg:mr-5 md:mr-10 md:px-3 px-1 py-3 text-[20px] zain-regular max-md:hover:bg-gray-900/50 max-md:ml-3 max-lg:mr-3 rounded-3xl max-md:p-3  text-white flex items-center flex-row relative bg-gray-200/30'>
            <img src={accountLogo} className='h-10 w-10 rounded-full'></img>
            <p className='text-center items-center ml-4 max-md:relative max-md:top-1 zain-regular truncate'>{userName}</p>
            <button className='flex flex-row items-center  ml-4 px-2 py-1 rounded-lg hover:bg-[#4e030397] transition-all duration-500 ease-in-out cursor-pointer' onClick={onLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
              <p className='zain-regular ml-1'>Log out</p>
            </button>

          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
