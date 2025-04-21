import React, { useState } from 'react';
import {Link, Outlet} from 'react-router-dom'
import '../Styles/Header.css';

function Header() {

    // This part is for the burger button
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

//   This part is for the services dropdown
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

// This part is for the contacts dropdown
    const [contactsOpen, setContactsOpen] = useState(false);
    const toggleContacts = () => setContactsOpen(!contactsOpen);

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
            <img src='/account_Circle.svg' className='h-10 w-10'></img>
            <p className='text-center items-center ml-4 max-md:relative max-md:top-1 zain-regular truncate'>Lorem ipsum dolor</p>

          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
